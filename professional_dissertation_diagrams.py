#!/usr/bin/env python3
"""
Professional UML and ERD Diagram Generator for Pentagon Gymnastics System
=========================================================================

Generates comprehensive, professional-quality UML and ERD diagrams for academic
dissertation and professional documentation based on the actual Prisma schema.

Author: Pentagon Gymnastics System
Date: August 8, 2025
Purpose: Academic dissertation and professional documentation
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Polygon, ConnectionPatch
import numpy as np
from typing import List, Dict, Tuple, Optional
import math
import os


class ProfessionalDiagramGenerator:
    """
    Professional UML and ERD Diagram Generator
    
    Creates publication-quality diagrams with:
    - Accurate representation of Prisma schema
    - UML 2.0 compliant notation
    - Academic formatting standards
    - Professional visual appearance
    - Multiple output formats
    """
    
    def __init__(self, figsize=(30, 24)):
        """Initialize the diagram generator."""
        self.figsize = figsize
        self.colors = {
            # Entity colors for ERD
            'entity_bg': '#F8F9FA',
            'entity_border': '#2C3E50',
            'entity_header': '#3498DB',
            'primary_key': '#E74C3C',
            'foreign_key': '#F39C12',
            'regular_attr': '#2C3E50',
            
            # Class colors for UML
            'class_bg': '#FFFFFF',
            'class_border': '#34495E',
            'abstract_bg': '#ECF0F1',
            'interface_bg': '#E8F5E8',
            'enum_bg': '#FFF3E0',
            
            # Relationship colors
            'one_to_one': '#E74C3C',
            'one_to_many': '#3498DB',
            'many_to_many': '#9B59B6',
            'inheritance': '#27AE60',
            'composition': '#E67E22',
            'aggregation': '#F39C12',
            'dependency': '#95A5A6',
            
            # Text colors
            'text': '#2C3E50',
            'header_text': '#FFFFFF',
            'relationship_text': '#2C3E50'
        }
        
        self.fonts = {
            'title': {'size': 24, 'weight': 'bold'},
            'entity_name': {'size': 14, 'weight': 'bold'},
            'class_name': {'size': 14, 'weight': 'bold'},
            'attribute': {'size': 10, 'weight': 'normal'},
            'method': {'size': 10, 'weight': 'normal'},
            'relationship': {'size': 9, 'weight': 'normal'},
            'stereotype': {'size': 10, 'style': 'italic'}
        }
        
        # Create output directory
        self.output_dir = 'dissertation_diagrams'
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
    
    def generate_comprehensive_erd(self):
        """Generate comprehensive ERD based on Prisma schema."""
        fig, ax = plt.subplots(1, 1, figsize=self.figsize)
        ax.set_xlim(0, 150)
        ax.set_ylim(0, 120)
        ax.set_aspect('equal')
        ax.axis('off')
        fig.patch.set_facecolor('white')
        
        # Title
        ax.text(75, 115, 'Pentagon Gymnastics Management System\nEntity Relationship Diagram', 
                ha='center', va='center', fontsize=self.fonts['title']['size'],
                fontweight=self.fonts['title']['weight'], color=self.colors['text'])
        
        # Define entity positions and sizes (x, y, width, height)
        entity_positions = {
            'User': (10, 85, 25, 20),
            'Class': (45, 85, 25, 15),
            'Session': (80, 85, 25, 15),
            'Booking': (115, 85, 25, 15),
            'Package': (10, 55, 25, 15),
            'Subscription': (45, 55, 25, 20),
            'Payment': (80, 55, 25, 15),
            'Transaction': (115, 55, 25, 15),
            'PackageClass': (10, 25, 25, 12),
            'GearItem': (45, 25, 25, 15),
            'GearOrder': (80, 25, 25, 15),
            'GearOrderItem': (115, 25, 25, 12),
            'SimulatedCard': (10, 5, 25, 12),
            'SimulatedPayment': (45, 5, 25, 12),
            'ActivityLog': (80, 5, 25, 12),
            'TransactionCategory': (115, 5, 25, 10)
        }
        
        # Create all entities
        for entity_name, (x, y, w, h) in entity_positions.items():
            self.create_entity_box(ax, entity_name, x, y, w, h)
        
        # Create relationships
        self.create_erd_relationships(ax, entity_positions)
        
        # Add legend
        self.add_erd_legend(ax)
        
        # Save ERD
        erd_png = os.path.join(self.output_dir, 'pentagon_gym_comprehensive_erd.png')
        erd_pdf = os.path.join(self.output_dir, 'pentagon_gym_comprehensive_erd.pdf')
        
        fig.savefig(erd_png, dpi=300, bbox_inches='tight', facecolor='white', edgecolor='none')
        fig.savefig(erd_pdf, format='pdf', bbox_inches='tight', facecolor='white', edgecolor='none')
        
        plt.close()
        return erd_png, erd_pdf
    
    def create_entity_box(self, ax, entity_name: str, x: float, y: float, width: float, height: float):
        """Create an entity box for ERD."""
        
        # Get entity attributes from Prisma schema
        attributes = self.get_entity_attributes(entity_name)
        
        # Calculate required height
        attr_count = len(attributes)
        min_height = 3 + (attr_count * 1.5)  # Header + attributes
        actual_height = max(height, min_height)
        
        # Main entity rectangle
        entity_rect = FancyBboxPatch(
            (x, y), width, actual_height,
            boxstyle="round,pad=0.3",
            facecolor=self.colors['entity_bg'],
            edgecolor=self.colors['entity_border'],
            linewidth=2,
            zorder=2
        )
        ax.add_patch(entity_rect)
        
        # Header rectangle
        header_height = 3
        header_rect = FancyBboxPatch(
            (x, y + actual_height - header_height), width, header_height,
            boxstyle="round,pad=0.3",
            facecolor=self.colors['entity_header'],
            edgecolor=self.colors['entity_border'],
            linewidth=2,
            zorder=3
        )
        ax.add_patch(header_rect)
        
        # Entity name
        ax.text(x + width/2, y + actual_height - header_height/2, entity_name,
                ha='center', va='center', fontsize=self.fonts['entity_name']['size'],
                fontweight=self.fonts['entity_name']['weight'], 
                color=self.colors['header_text'], zorder=4)
        
        # Attributes
        attr_y = y + actual_height - header_height - 1
        for i, (attr_name, attr_type, is_pk, is_fk) in enumerate(attributes):
            if is_pk:
                color = self.colors['primary_key']
                prefix = "🔑 "
            elif is_fk:
                color = self.colors['foreign_key']
                prefix = "🔗 "
            else:
                color = self.colors['regular_attr']
                prefix = ""
            
            attr_text = f"{prefix}{attr_name}: {attr_type}"
            ax.text(x + 0.5, attr_y - (i * 1.5), attr_text, ha='left', va='center',
                    fontsize=self.fonts['attribute']['size'], color=color, zorder=4)
    
    def get_entity_attributes(self, entity_name: str) -> List[Tuple[str, str, bool, bool]]:
        """Get entity attributes from Prisma schema."""
        
        entity_schemas = {
            'User': [
                ('id', 'Int', True, False),
                ('email', 'String', False, False),
                ('password', 'String', False, False),
                ('role', 'String', False, False),
                ('forename', 'String', False, False),
                ('surname', 'String', False, False),
                ('address', 'String', False, False),
                ('dateOfBirth', 'DateTime', False, False),
                ('phoneNumber', 'String', False, False),
                ('stripeCustomerId', 'String?', False, False),
                ('createdAt', 'DateTime', False, False),
                ('updatedAt', 'DateTime', False, False)
            ],
            'Class': [
                ('id', 'Int', True, False),
                ('name', 'String', False, False),
                ('description', 'String', False, False)
            ],
            'Session': [
                ('id', 'Int', True, False),
                ('classId', 'Int', False, True),
                ('timeSlot', 'String', False, False),
                ('capacity', 'Int', False, False),
                ('bookingCount', 'Int', False, False)
            ],
            'Booking': [
                ('id', 'Int', True, False),
                ('userId', 'Int', False, True),
                ('sessionId', 'Int', False, True)
            ],
            'Package': [
                ('id', 'Int', True, False),
                ('name', 'String', False, False),
                ('description', 'String', False, False),
                ('price', 'Float', False, False),
                ('maxClasses', 'Int?', False, False),
                ('priority', 'Int', False, False),
                ('isActive', 'Boolean', False, False),
                ('createdAt', 'DateTime', False, False),
                ('updatedAt', 'DateTime', False, False)
            ],
            'Subscription': [
                ('id', 'Int', True, False),
                ('userId', 'Int', False, True),
                ('packageId', 'Int', False, True),
                ('stripeSubscriptionId', 'String?', False, False),
                ('status', 'String', False, False),
                ('startDate', 'DateTime', False, False),
                ('endDate', 'DateTime', False, False),
                ('proteinSupplement', 'Boolean', False, False),
                ('proteinSupplementPrice', 'Float', False, False),
                ('isAutoRenew', 'Boolean', False, False),
                ('createdAt', 'DateTime', False, False),
                ('updatedAt', 'DateTime', False, False)
            ],
            'Payment': [
                ('id', 'Int', True, False),
                ('subscriptionId', 'Int?', False, True),
                ('gearOrderId', 'Int?', False, True),
                ('stripePaymentIntentId', 'String?', False, False),
                ('amount', 'Float', False, False),
                ('currency', 'String', False, False),
                ('status', 'String', False, False),
                ('paymentType', 'String', False, False),
                ('description', 'String?', False, False),
                ('createdAt', 'DateTime', False, False),
                ('updatedAt', 'DateTime', False, False)
            ],
            'Transaction': [
                ('id', 'Int', True, False),
                ('userId', 'Int', False, True),
                ('type', 'String', False, False),
                ('amount', 'Float', False, False),
                ('currency', 'String', False, False),
                ('status', 'String', False, False),
                ('description', 'String', False, False),
                ('relatedId', 'Int?', False, False),
                ('relatedType', 'String?', False, False),
                ('stripePaymentId', 'String?', False, False),
                ('metadata', 'Json?', False, False),
                ('createdAt', 'DateTime', False, False),
                ('updatedAt', 'DateTime', False, False)
            ],
            'PackageClass': [
                ('id', 'Int', True, False),
                ('packageId', 'Int', False, True),
                ('classId', 'Int', False, True)
            ],
            'GearItem': [
                ('id', 'Int', True, False),
                ('name', 'String', False, False),
                ('description', 'String', False, False),
                ('price', 'Float', False, False),
                ('category', 'String', False, False),
                ('stock', 'Int', False, False),
                ('imageUrl', 'String?', False, False),
                ('isActive', 'Boolean', False, False),
                ('createdAt', 'DateTime', False, False),
                ('updatedAt', 'DateTime', False, False)
            ],
            'GearOrder': [
                ('id', 'Int', True, False),
                ('userId', 'Int', False, True),
                ('stripePaymentIntentId', 'String?', False, False),
                ('totalAmount', 'Float', False, False),
                ('status', 'String', False, False),
                ('customerName', 'String', False, False),
                ('shippingAddress', 'String', False, False),
                ('createdAt', 'DateTime', False, False),
                ('updatedAt', 'DateTime', False, False)
            ],
            'GearOrderItem': [
                ('id', 'Int', True, False),
                ('gearOrderId', 'Int', False, True),
                ('gearItemId', 'Int', False, True),
                ('size', 'String', False, False),
                ('quantity', 'Int', False, False),
                ('unitPrice', 'Float', False, False),
                ('customText', 'String?', False, False)
            ],
            'SimulatedCard': [
                ('id', 'Int', True, False),
                ('cardNumber', 'String', False, False),
                ('cardholderName', 'String', False, False),
                ('expiryMonth', 'Int', False, False),
                ('expiryYear', 'Int', False, False),
                ('cvv', 'String', False, False),
                ('cardType', 'String', False, False),
                ('isValid', 'Boolean', False, False),
                ('balance', 'Float', False, False),
                ('createdAt', 'DateTime', False, False)
            ],
            'SimulatedPayment': [
                ('id', 'Int', True, False),
                ('cardId', 'Int', False, True),
                ('subscriptionId', 'Int?', False, True),
                ('gearOrderId', 'Int?', False, True),
                ('amount', 'Float', False, False),
                ('currency', 'String', False, False),
                ('status', 'String', False, False),
                ('paymentType', 'String', False, False),
                ('description', 'String?', False, False),
                ('failureReason', 'String?', False, False),
                ('simulatedDelay', 'Int', False, False),
                ('createdAt', 'DateTime', False, False),
                ('updatedAt', 'DateTime', False, False)
            ],
            'ActivityLog': [
                ('id', 'Int', True, False),
                ('userId', 'Int', False, True),
                ('action', 'String', False, False),
                ('description', 'String', False, False),
                ('ipAddress', 'String?', False, False),
                ('userAgent', 'String?', False, False),
                ('metadata', 'Json?', False, False),
                ('createdAt', 'DateTime', False, False)
            ],
            'TransactionCategory': [
                ('id', 'Int', True, False),
                ('name', 'String', False, False),
                ('description', 'String', False, False),
                ('isActive', 'Boolean', False, False),
                ('createdAt', 'DateTime', False, False)
            ]
        }
        
        return entity_schemas.get(entity_name, [])
    
    def create_erd_relationships(self, ax, positions: Dict[str, Tuple[float, float, float, float]]):
        """Create ERD relationships between entities."""
        
        relationships = [
            ('User', 'Subscription', '1', 'M', 'one_to_many'),
            ('User', 'Booking', '1', 'M', 'one_to_many'),
            ('User', 'GearOrder', '1', 'M', 'one_to_many'),
            ('User', 'Transaction', '1', 'M', 'one_to_many'),
            ('User', 'ActivityLog', '1', 'M', 'one_to_many'),
            
            ('Package', 'Subscription', '1', 'M', 'one_to_many'),
            ('Package', 'PackageClass', '1', 'M', 'one_to_many'),
            
            ('Class', 'Session', '1', 'M', 'one_to_many'),
            ('Class', 'PackageClass', '1', 'M', 'one_to_many'),
            
            ('Session', 'Booking', '1', 'M', 'one_to_many'),
            
            ('Subscription', 'Payment', '1', 'M', 'one_to_many'),
            ('Subscription', 'SimulatedPayment', '1', 'M', 'one_to_many'),
            
            ('GearOrder', 'Payment', '1', 'M', 'one_to_many'),
            ('GearOrder', 'GearOrderItem', '1', 'M', 'one_to_many'),
            ('GearOrder', 'SimulatedPayment', '1', 'M', 'one_to_many'),
            
            ('GearItem', 'GearOrderItem', '1', 'M', 'one_to_many'),
            
            ('SimulatedCard', 'SimulatedPayment', '1', 'M', 'one_to_many')
        ]
        
        for from_entity, to_entity, from_card, to_card, rel_type in relationships:
            if from_entity in positions and to_entity in positions:
                self.create_erd_relationship(ax, positions[from_entity], positions[to_entity], 
                                           from_card, to_card, rel_type)
    
    def create_erd_relationship(self, ax, from_pos: Tuple, to_pos: Tuple, 
                               from_card: str, to_card: str, rel_type: str):
        """Create a relationship line between entities."""
        fx, fy, fw, fh = from_pos
        tx, ty, tw, th = to_pos
        
        # Calculate connection points
        from_center = (fx + fw/2, fy + fh/2)
        to_center = (tx + tw/2, ty + th/2)
        
        from_point = self.get_box_edge_point(from_pos, to_center)
        to_point = self.get_box_edge_point(to_pos, from_center)
        
        # Choose color based on relationship type
        color = self.colors.get(rel_type, self.colors['one_to_many'])
        
        # Draw line
        ax.plot([from_point[0], to_point[0]], [from_point[1], to_point[1]], 
                color=color, linewidth=2, zorder=1)
        
        # Add cardinality labels
        self.add_cardinality_label(ax, from_point, from_card)
        self.add_cardinality_label(ax, to_point, to_card)
    
    def get_box_edge_point(self, box_pos: Tuple, target_point: Tuple) -> Tuple[float, float]:
        """Calculate the point where a line intersects the edge of a box."""
        x, y, w, h = box_pos
        tx, ty = target_point
        
        # Box center
        cx, cy = x + w/2, y + h/2
        
        # Direction vector
        dx, dy = tx - cx, ty - cy
        
        # Calculate intersection with box edges
        if abs(dx) > abs(dy):
            # Intersect with left or right edge
            if dx > 0:  # Right edge
                edge_x = x + w
                edge_y = cy + dy * (w/2) / abs(dx)
            else:  # Left edge
                edge_x = x
                edge_y = cy + dy * (w/2) / abs(dx)
        else:
            # Intersect with top or bottom edge
            if dy > 0:  # Top edge
                edge_y = y + h
                edge_x = cx + dx * (h/2) / abs(dy)
            else:  # Bottom edge
                edge_y = y
                edge_x = cx + dx * (h/2) / abs(dy)
        
        return (edge_x, edge_y)
    
    def add_cardinality_label(self, ax, point: Tuple[float, float], cardinality: str):
        """Add cardinality label near a relationship endpoint."""
        offset = 2
        label_x = point[0] + offset
        label_y = point[1] + offset
        
        ax.text(label_x, label_y, cardinality, ha='center', va='center',
                fontsize=self.fonts['relationship']['size'],
                fontweight=self.fonts['relationship']['weight'],
                color=self.colors['relationship_text'], zorder=4,
                bbox=dict(boxstyle='round,pad=0.2', facecolor='white', 
                         edgecolor='none', alpha=0.8))
    
    def add_erd_legend(self, ax):
        """Add legend for ERD."""
        legend_x, legend_y = 10, 1
        
        # Legend box
        legend_box = FancyBboxPatch(
            (legend_x, legend_y), 60, 8,
            boxstyle="round,pad=0.5",
            facecolor=self.colors['entity_bg'],
            edgecolor=self.colors['entity_border'],
            linewidth=2,
            zorder=2
        )
        ax.add_patch(legend_box)
        
        # Legend title
        ax.text(legend_x + 30, legend_y + 6, 'Entity Relationship Diagram Legend',
                ha='center', va='center', fontsize=14, fontweight='bold',
                color=self.colors['text'])
        
        # Legend items
        ax.text(legend_x + 5, legend_y + 3, '🔑 Primary Key', ha='left', va='center',
                fontsize=10, color=self.colors['primary_key'])
        ax.text(legend_x + 20, legend_y + 3, '🔗 Foreign Key', ha='left', va='center',
                fontsize=10, color=self.colors['foreign_key'])
        ax.text(legend_x + 35, legend_y + 3, '1:M One-to-Many', ha='left', va='center',
                fontsize=10, color=self.colors['one_to_many'])
        ax.text(legend_x + 50, legend_y + 3, 'M:M Many-to-Many', ha='left', va='center',
                fontsize=10, color=self.colors['many_to_many'])
    
    def generate_comprehensive_uml(self):
        """Generate comprehensive UML class diagram."""
        fig, ax = plt.subplots(1, 1, figsize=self.figsize)
        ax.set_xlim(0, 150)
        ax.set_ylim(0, 120)
        ax.set_aspect('equal')
        ax.axis('off')
        fig.patch.set_facecolor('white')
        
        # Title
        ax.text(75, 115, 'Pentagon Gymnastics Management System\nUML Class Diagram', 
                ha='center', va='center', fontsize=self.fonts['title']['size'],
                fontweight=self.fonts['title']['weight'], color=self.colors['text'])
        
        # Define class positions for better layout
        class_positions = {
            'User': (15, 90, 30, 18),
            'AuthController': (60, 90, 30, 15),
            'Member': (10, 65, 25, 18),
            'Instructor': (40, 65, 25, 15),
            'Administrator': (70, 65, 25, 15),
            'Class': (105, 90, 25, 15),
            'Session': (105, 65, 25, 15),
            'Booking': (105, 40, 25, 15),
            'Package': (15, 40, 25, 15),
            'Subscription': (45, 40, 25, 18),
            'SubscriptionController': (75, 40, 30, 15),
            'Payment': (15, 15, 25, 15),
            'PaymentController': (45, 15, 25, 15),
            'GearItem': (75, 15, 25, 15),
            'GearController': (105, 15, 25, 15)
        }
        
        # Create all classes
        for class_name, (x, y, w, h) in class_positions.items():
            self.create_uml_class_box(ax, class_name, x, y, w, h)
        
        # Create UML relationships
        self.create_uml_relationships(ax, class_positions)
        
        # Add UML legend
        self.add_uml_legend(ax)
        
        # Save UML
        uml_png = os.path.join(self.output_dir, 'pentagon_gym_comprehensive_uml.png')
        uml_pdf = os.path.join(self.output_dir, 'pentagon_gym_comprehensive_uml.pdf')
        
        fig.savefig(uml_png, dpi=300, bbox_inches='tight', facecolor='white', edgecolor='none')
        fig.savefig(uml_pdf, format='pdf', bbox_inches='tight', facecolor='white', edgecolor='none')
        
        plt.close()
        return uml_png, uml_pdf
    
    def create_uml_class_box(self, ax, class_name: str, x: float, y: float, width: float, height: float):
        """Create a UML class box."""
        
        # Get class details
        class_details = self.get_uml_class_details(class_name)
        
        # Calculate required height
        attributes = class_details.get('attributes', [])
        methods = class_details.get('methods', [])
        
        base_height = 3  # For class name
        attr_height = len(attributes) * 1.3 + 1.5 if attributes else 0
        method_height = len(methods) * 1.3 + 1.5 if methods else 0
        required_height = base_height + attr_height + method_height
        actual_height = max(height, required_height)
        
        # Determine class type styling
        if class_details.get('is_controller', False):
            bg_color = self.colors['interface_bg']
        elif class_details.get('is_abstract', False):
            bg_color = self.colors['abstract_bg']
        else:
            bg_color = self.colors['class_bg']
        
        # Main class rectangle
        class_rect = FancyBboxPatch(
            (x, y), width, actual_height,
            boxstyle="round,pad=0.3",
            facecolor=bg_color,
            edgecolor=self.colors['class_border'],
            linewidth=2,
            zorder=2
        )
        ax.add_patch(class_rect)
        
        # Calculate section heights
        name_height = 3
        remaining_height = actual_height - name_height
        
        if attributes and methods:
            attribute_section = remaining_height * 0.4
            method_section = remaining_height * 0.6
        elif attributes:
            attribute_section = remaining_height
            method_section = 0
        elif methods:
            attribute_section = 0
            method_section = remaining_height
        else:
            attribute_section = remaining_height * 0.5
            method_section = remaining_height * 0.5
        
        # Add separating lines
        if attributes:
            line1_y = y + actual_height - name_height
            ax.plot([x + 0.5, x + width - 0.5], [line1_y, line1_y], 
                    color=self.colors['class_border'], linewidth=1.5, zorder=3)
        
        if methods and attributes:
            line2_y = y + method_section
            ax.plot([x + 0.5, x + width - 0.5], [line2_y, line2_y], 
                    color=self.colors['class_border'], linewidth=1.5, zorder=3)
        elif methods and not attributes:
            line2_y = y + actual_height - name_height
            ax.plot([x + 0.5, x + width - 0.5], [line2_y, line2_y], 
                    color=self.colors['class_border'], linewidth=1.5, zorder=3)
        
        # Add class name with stereotype
        name_y = y + actual_height - name_height/2
        if class_details.get('stereotype'):
            ax.text(x + width/2, name_y + 0.8, f"<<{class_details['stereotype']}>>",
                    ha='center', va='center', fontsize=self.fonts['stereotype']['size'],
                    style=self.fonts['stereotype']['style'], color=self.colors['text'])
            name_y -= 0.8
        
        # Class name (italic if abstract)
        font_style = 'italic' if class_details.get('is_abstract', False) else 'normal'
        ax.text(x + width/2, name_y, class_name,
                ha='center', va='center', fontsize=self.fonts['class_name']['size'],
                fontweight=self.fonts['class_name']['weight'], style=font_style,
                color=self.colors['text'], zorder=4)
        
        # Add attributes
        if attributes:
            attr_start_y = y + actual_height - name_height - 0.5
            for i, attr in enumerate(attributes):
                attr_y = attr_start_y - (i * 1.3)
                display_attr = attr if len(attr) <= 28 else attr[:25] + "..."
                ax.text(x + 0.8, attr_y, display_attr, ha='left', va='center',
                        fontsize=self.fonts['attribute']['size'],
                        color=self.colors['text'], zorder=4)
        
        # Add methods
        if methods:
            if attributes:
                method_start_y = y + method_section - 0.5
            else:
                method_start_y = y + actual_height - name_height - 0.5
            
            for i, method in enumerate(methods):
                method_y = method_start_y - (i * 1.3)
                display_method = method if len(method) <= 28 else method[:25] + "..."
                ax.text(x + 0.8, method_y, display_method, ha='left', va='center',
                        fontsize=self.fonts['method']['size'],
                        color=self.colors['text'], zorder=4)
    
    def get_uml_class_details(self, class_name: str) -> Dict:
        """Get UML class details."""
        
        class_definitions = {
            'User': {
                'is_abstract': True,
                'attributes': [
                    '# id: number',
                    '# email: string',
                    '# password: string',
                    '# role: string',
                    '# forename: string',
                    '# surname: string',
                    '# address: string',
                    '# dateOfBirth: Date',
                    '# phoneNumber: string'
                ],
                'methods': [
                    '+ authenticate(): boolean',
                    '+ updateProfile(data): void',
                    '+ validateEmail(): boolean',
                    '+ getFullName(): string'
                ]
            },
            'Member': {
                'attributes': [
                    '- membershipStatus: string',
                    '- emergencyContact: string',
                    '- medicalInfo: string',
                    '- skillLevel: string'
                ],
                'methods': [
                    '+ bookClass(session): Booking',
                    '+ cancelBooking(id): void',
                    '+ subscribe(package): Subscription',
                    '+ getBookingHistory(): Booking[]'
                ]
            },
            'Instructor': {
                'attributes': [
                    '- specializations: string[]',
                    '- certifications: string[]',
                    '- hourlyRate: number'
                ],
                'methods': [
                    '+ createClass(details): Class',
                    '+ updateSchedule(): void',
                    '+ markAttendance(): void'
                ]
            },
            'Administrator': {
                'attributes': [
                    '- permissions: string[]',
                    '- department: string'
                ],
                'methods': [
                    '+ manageUsers(): void',
                    '+ generateReports(): Report',
                    '+ configureSystem(): void'
                ]
            },
            'AuthController': {
                'stereotype': 'controller',
                'is_controller': True,
                'methods': [
                    '+ register(req, res): Response',
                    '+ login(req, res): Response',
                    '+ updateProfile(req, res): Response',
                    '+ validateToken(req, res): Response'
                ]
            },
            'Class': {
                'attributes': [
                    '- id: number',
                    '- name: string',
                    '- description: string',
                    '- category: string',
                    '- level: string',
                    '- maxCapacity: number'
                ],
                'methods': [
                    '+ addSession(time): Session',
                    '+ updateDetails(data): void',
                    '+ checkCapacity(): boolean'
                ]
            },
            'Session': {
                'attributes': [
                    '- id: number',
                    '- classId: number',
                    '- timeSlot: string',
                    '- capacity: number',
                    '- bookingCount: number'
                ],
                'methods': [
                    '+ createBooking(user): Booking',
                    '+ checkAvailability(): boolean',
                    '+ updateCapacity(): void'
                ]
            },
            'Booking': {
                'attributes': [
                    '- id: number',
                    '- userId: number',
                    '- sessionId: number',
                    '- status: string',
                    '- bookingDate: Date'
                ],
                'methods': [
                    '+ confirm(): void',
                    '+ cancel(): void',
                    '+ reschedule(session): void'
                ]
            },
            'Package': {
                'attributes': [
                    '- id: number',
                    '- name: string',
                    '- description: string',
                    '- price: number',
                    '- maxClasses: number',
                    '- priority: number'
                ],
                'methods': [
                    '+ calculatePrice(): number',
                    '+ applyDiscount(amount): void',
                    '+ isActive(): boolean'
                ]
            },
            'Subscription': {
                'attributes': [
                    '- id: number',
                    '- userId: number',
                    '- packageId: number',
                    '- status: string',
                    '- startDate: Date',
                    '- endDate: Date',
                    '- proteinSupplement: boolean'
                ],
                'methods': [
                    '+ activate(): void',
                    '+ cancel(): void',
                    '+ upgrade(package): void',
                    '+ renew(): void'
                ]
            },
            'SubscriptionController': {
                'stereotype': 'controller',
                'is_controller': True,
                'methods': [
                    '+ getPackages(req, res): Response',
                    '+ getUserSubscription(req, res): Response',
                    '+ createSubscription(req, res): Response',
                    '+ switchPackage(req, res): Response',
                    '+ cancelSubscription(req, res): Response'
                ]
            },
            'Payment': {
                'attributes': [
                    '- id: number',
                    '- amount: number',
                    '- currency: string',
                    '- status: string',
                    '- paymentType: string'
                ],
                'methods': [
                    '+ process(): boolean',
                    '+ refund(): void',
                    '+ verify(): boolean'
                ]
            },
            'PaymentController': {
                'stereotype': 'controller',
                'is_controller': True,
                'methods': [
                    '+ processPayment(req, res): Response',
                    '+ simulatePayment(req, res): Response',
                    '+ getPaymentHistory(req, res): Response'
                ]
            },
            'GearItem': {
                'attributes': [
                    '- id: number',
                    '- name: string',
                    '- category: string',
                    '- price: number',
                    '- stock: number'
                ],
                'methods': [
                    '+ updateStock(quantity): void',
                    '+ checkAvailability(): boolean',
                    '+ applyDiscount(percent): void'
                ]
            },
            'GearController': {
                'stereotype': 'controller',
                'is_controller': True,
                'methods': [
                    '+ getGearItems(req, res): Response',
                    '+ createOrder(req, res): Response',
                    '+ updateStock(req, res): Response'
                ]
            }
        }
        
        return class_definitions.get(class_name, {})
    
    def create_uml_relationships(self, ax, positions: Dict[str, Tuple[float, float, float, float]]):
        """Create UML relationships."""
        
        # Inheritance relationships
        inheritance_relations = [
            ('User', 'Member'),
            ('User', 'Instructor'),
            ('User', 'Administrator')
        ]
        
        for parent, child in inheritance_relations:
            if parent in positions and child in positions:
                self.create_inheritance(ax, positions[parent], positions[child])
        
        # Association relationships
        associations = [
            ('Member', 'Booking', '1', '*'),
            ('Member', 'Subscription', '1', '0..1'),
            ('Session', 'Booking', '1', '*'),
            ('Class', 'Session', '1', '*'),
            ('Package', 'Subscription', '1', '*'),
            ('Subscription', 'Payment', '1', '*'),
            ('AuthController', 'User', 'uses', ''),
            ('SubscriptionController', 'Subscription', 'manages', ''),
            ('PaymentController', 'Payment', 'processes', ''),
            ('GearController', 'GearItem', 'manages', '')
        ]
        
        for from_class, to_class, from_mult, to_mult in associations:
            if from_class in positions and to_class in positions:
                self.create_association(ax, positions[from_class], positions[to_class], 
                                      from_mult, to_mult)
    
    def create_inheritance(self, ax, parent_pos: Tuple, child_pos: Tuple):
        """Create inheritance relationship with hollow triangle."""
        px, py, pw, ph = parent_pos
        cx, cy, cw, ch = child_pos
        
        parent_center = (px + pw/2, py + ph/2)
        child_center = (cx + cw/2, cy + ch/2)
        
        parent_point = self.get_box_edge_point(parent_pos, child_center)
        child_point = self.get_box_edge_point(child_pos, parent_center)
        
        # Draw line
        ax.plot([child_point[0], parent_point[0]], 
                [child_point[1], parent_point[1]], 
                color=self.colors['inheritance'], linewidth=2, zorder=1)
        
        # Create hollow triangle
        triangle_size = 1.5
        angle = math.atan2(parent_point[1] - child_point[1], 
                          parent_point[0] - child_point[0])
        
        tip = parent_point
        base1 = (parent_point[0] - triangle_size * math.cos(angle + 0.5),
                parent_point[1] - triangle_size * math.sin(angle + 0.5))
        base2 = (parent_point[0] - triangle_size * math.cos(angle - 0.5),
                parent_point[1] - triangle_size * math.sin(angle - 0.5))
        
        triangle = Polygon([tip, base1, base2], closed=True,
                          facecolor='white', edgecolor=self.colors['inheritance'],
                          linewidth=2, zorder=3)
        ax.add_patch(triangle)
    
    def create_association(self, ax, from_pos: Tuple, to_pos: Tuple, 
                          from_mult: str, to_mult: str):
        """Create association relationship with arrow."""
        fx, fy, fw, fh = from_pos
        tx, ty, tw, th = to_pos
        
        from_center = (fx + fw/2, fy + fh/2)
        to_center = (tx + tw/2, ty + th/2)
        
        from_point = self.get_box_edge_point(from_pos, to_center)
        to_point = self.get_box_edge_point(to_pos, from_center)
        
        # Draw line with arrow
        ax.annotate('', xy=to_point, xytext=from_point,
                    arrowprops=dict(arrowstyle='->', 
                                  color=self.colors['one_to_many'],
                                  lw=2), zorder=1)
        
        # Add multiplicity labels if they're not descriptive text
        if from_mult not in ['uses', 'manages', 'processes']:
            self.add_cardinality_label(ax, from_point, from_mult)
        if to_mult not in ['uses', 'manages', 'processes']:
            self.add_cardinality_label(ax, to_point, to_mult)
    
    def add_uml_legend(self, ax):
        """Add UML legend."""
        legend_x, legend_y = 10, 1
        
        legend_box = FancyBboxPatch(
            (legend_x, legend_y), 60, 8,
            boxstyle="round,pad=0.5",
            facecolor=self.colors['class_bg'],
            edgecolor=self.colors['class_border'],
            linewidth=2,
            zorder=2
        )
        ax.add_patch(legend_box)
        
        ax.text(legend_x + 30, legend_y + 6, 'UML Class Diagram Legend',
                ha='center', va='center', fontsize=14, fontweight='bold',
                color=self.colors['text'])
        
        # Legend items
        legend_items = [
            ('△ Inheritance', self.colors['inheritance']),
            ('→ Association', self.colors['one_to_many']),
            ('<<controller>> Stereotype', self.colors['text']),
            ('+ Public  # Protected  - Private', self.colors['text'])
        ]
        
        for i, (text, color) in enumerate(legend_items):
            y_pos = legend_y + 4 - (i * 1)
            ax.text(legend_x + 5, y_pos, text, ha='left', va='center',
                    fontsize=10, color=color)


def main():
    """Main function to generate comprehensive diagrams."""
    print("🎨 Generating Professional Pentagon Gymnastics Diagrams...")
    print("=" * 70)
    
    generator = ProfessionalDiagramGenerator()
    
    # Generate ERD
    print("📊 Creating comprehensive Entity Relationship Diagram...")
    erd_png, erd_pdf = generator.generate_comprehensive_erd()
    print(f"✅ ERD Generated: {erd_png}")
    print(f"✅ ERD Generated: {erd_pdf}")
    
    # Generate UML
    print("\n📐 Creating comprehensive UML Class Diagram...")
    uml_png, uml_pdf = generator.generate_comprehensive_uml()
    print(f"✅ UML Generated: {uml_png}")
    print(f"✅ UML Generated: {uml_pdf}")
    
    print(f"\n🎓 Professional Dissertation Diagrams Complete!")
    print(f"📁 Output Directory: dissertation_diagrams/")
    print("\n🏆 Features:")
    print("   • Accurate representation of Prisma schema")
    print("   • UML 2.0 compliant notation")
    print("   • Academic-quality formatting")
    print("   • High-resolution outputs (300 DPI)")
    print("   • Vector PDF formats for publications")
    print("   • Complete entity relationships")
    print("   • Controller and service layer representation")
    print("   • Professional legends and documentation")


if __name__ == "__main__":
    main()
