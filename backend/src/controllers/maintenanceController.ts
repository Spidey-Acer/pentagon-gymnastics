import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

interface MaintenanceAlert {
  id: string;
  type: 'low_stock' | 'high_demand' | 'maintenance_due';
  itemId: number;
  itemName: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  resolved: boolean;
}

export class MaintenanceController {
  // Get all maintenance alerts
  static async getAlerts(req: Request, res: Response) {
    try {
      const alerts: MaintenanceAlert[] = [];
      
      // Check for low stock items
      const lowStockItems = await prisma.gearItem.findMany({
        where: {
          stock: { lte: 10 }, // Alert when stock is 10 or below
          isActive: true
        }
      });

      for (const item of lowStockItems) {
        alerts.push({
          id: `low_stock_${item.id}`,
          type: 'low_stock',
          itemId: item.id,
          itemName: item.name,
          message: `Low stock alert: ${item.name} has only ${item.stock} units remaining`,
          priority: item.stock <= 5 ? 'high' : 'medium',
          createdAt: new Date(),
          resolved: false
        });
      }

      // Check for high demand items (items with many recent orders)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const highDemandItems = await prisma.gearOrderItem.groupBy({
        by: ['gearItemId'],
        where: {
          gearOrder: {
            createdAt: { gte: thirtyDaysAgo }
          }
        },
        _sum: { quantity: true },
        _count: { id: true },
        having: {
          id: { _count: { gte: 10 } } // 10+ orders in 30 days
        }
      });

      for (const demandItem of highDemandItems) {
        const gearItem = await prisma.gearItem.findUnique({
          where: { id: demandItem.gearItemId }
        });
        
        if (gearItem) {
          alerts.push({
            id: `high_demand_${gearItem.id}`,
            type: 'high_demand',
            itemId: gearItem.id,
            itemName: gearItem.name,
            message: `High demand alert: ${gearItem.name} has ${demandItem._count.id} orders (${demandItem._sum.quantity} units) in the last 30 days`,
            priority: 'medium',
            createdAt: new Date(),
            resolved: false
          });
        }
      }

      // Check for items that need maintenance (based on usage)
      const maintenanceItems = await prisma.gearOrderItem.groupBy({
        by: ['gearItemId'],
        _sum: { quantity: true },
        having: {
          quantity: { _sum: { gte: 100 } } // Items sold 100+ times might need inspection
        }
      });

      for (const maintenanceItem of maintenanceItems) {
        const gearItem = await prisma.gearItem.findUnique({
          where: { id: maintenanceItem.gearItemId }
        });
        
        if (gearItem) {
          alerts.push({
            id: `maintenance_${gearItem.id}`,
            type: 'maintenance_due',
            itemId: gearItem.id,
            itemName: gearItem.name,
            message: `Maintenance check recommended: ${gearItem.name} has been ordered ${maintenanceItem._sum.quantity} times`,
            priority: 'low',
            createdAt: new Date(),
            resolved: false
          });
        }
      }

      res.json({
        success: true,
        alerts: alerts.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        })
      });
    } catch (error) {
      console.error('Error fetching maintenance alerts:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch alerts' });
    }
  }

  // Get equipment statistics for maintenance planning
  static async getEquipmentStats(req: Request, res: Response) {
    try {
      const stats = await prisma.gearItem.findMany({
        include: {
          _count: {
            select: { gearOrderItems: true }
          },
          gearOrderItems: {
            select: {
              quantity: true,
              gearOrder: {
                select: { createdAt: true }
              }
            }
          }
        }
      });

      const equipmentStats = stats.map(item => {
        const totalQuantitySold = item.gearOrderItems.reduce((sum, orderItem) => sum + orderItem.quantity, 0);
        const lastOrderDate = item.gearOrderItems.length > 0 
          ? new Date(Math.max(...item.gearOrderItems.map(oi => oi.gearOrder.createdAt.getTime())))
          : null;

        return {
          id: item.id,
          name: item.name,
          currentStock: item.stock,
          totalOrders: item._count.gearOrderItems,
          totalQuantitySold,
          lastOrderDate,
          averageMonthlyDemand: item.gearOrderItems.length > 0 
            ? Math.round(totalQuantitySold / Math.max(1, Math.floor((Date.now() - item.createdAt.getTime()) / (30 * 24 * 60 * 60 * 1000))))
            : 0,
          stockStatus: item.stock <= 5 ? 'critical' : item.stock <= 10 ? 'low' : 'adequate',
          maintenanceRecommended: totalQuantitySold >= 100
        };
      });

      res.json({
        success: true,
        equipmentStats
      });
    } catch (error) {
      console.error('Error fetching equipment stats:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch equipment statistics' });
    }
  }

  // Auto-restock suggestion
  static async getRestockSuggestions(req: Request, res: Response) {
    try {
      const suggestions = [];
      
      const lowStockItems = await prisma.gearItem.findMany({
        where: {
          stock: { lte: 15 },
          isActive: true
        },
        include: {
          gearOrderItems: {
            select: {
              quantity: true,
              gearOrder: {
                select: { createdAt: true }
              }
            }
          }
        }
      });

      for (const item of lowStockItems) {
        // Calculate average monthly demand
        const monthlyOrders = item.gearOrderItems.filter(
          oi => oi.gearOrder.createdAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );
        const monthlyDemand = monthlyOrders.reduce((sum, oi) => sum + oi.quantity, 0);
        
        // Suggest restock quantity (2-3 months of demand)
        const suggestedRestock = Math.max(50, monthlyDemand * 2.5);
        
        suggestions.push({
          itemId: item.id,
          itemName: item.name,
          currentStock: item.stock,
          monthlyDemand,
          suggestedRestock: Math.round(suggestedRestock),
          priority: item.stock <= 5 ? 'urgent' : 'normal',
          estimatedCost: suggestedRestock * item.price * 0.6 // Assuming 60% cost ratio
        });
      }

      res.json({
        success: true,
        suggestions: suggestions.sort((a, b) => 
          (a.priority === 'urgent' ? 1 : 0) - (b.priority === 'urgent' ? 1 : 0)
        )
      });
    } catch (error) {
      console.error('Error generating restock suggestions:', error);
      res.status(500).json({ success: false, message: 'Failed to generate suggestions' });
    }
  }
}
