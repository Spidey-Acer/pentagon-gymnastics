"""
Pentagon Gymnastics System - Improved UML and ERD Diagram Generator
Fixed issues with hanging and improved diagram layouts
Author: Pentagon Gymnastics Development Team
Date: August 8, 2025
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, ConnectionPatch
import numpy as np
from datetime import datetime
import os
import sys

class ImprovedDiagramGenerator:
    def __init__(self):
        # Use non-interactive backend to prevent hanging
        plt.switch_backend('Agg')
        
        self.colors = {
            'entity': '#E8F4FD',
            'entity_border': '#2196F3',
            'class': '#FFF3E0',
            'class_border': '#FF9800',
            'interface': '#E8F5E8',
            'interface_border': '#4CAF50',
            'relationship': '#333333',
            'text': '#000000',
            'primary_key': '#FFE0B2',
            'foreign_key': '#FFCDD2'
        }
        
        # Create output directory
        self.output_dir = 'dissertation_diagrams'
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
    
    def generate_erd_diagram(self):
        """Generate Entity Relationship Diagram for Pentagon Gymnastics Database"""
        print("Generating ERD diagram...")
        
        fig, ax = plt.subplots(1, 1, figsize=(24, 18))
        ax.set_xlim(0, 24)
        ax.set_ylim(0, 18)
        ax.axis('off')
        
        # Title
        ax.text(12, 17.5, 'Pentagon Gymnastics - Entity Relationship Diagram', 
                fontsize=22, fontweight='bold', ha='center')
        
        # Define entities with better positioning
        entities = {
            'User': {
                'pos': (3, 14),
                'size': (3.5, 4),
                'attributes': [
                    ('id', 'PK'),
                    ('email', 'UNIQUE'),
                    ('password', ''),
                    ('role', ''),
                    ('forename', ''),
                    ('surname', ''),
                    ('address', ''),
                    ('dateOfBirth', ''),
                    ('phoneNumber', ''),
                    ('stripeCustomerId', 'NULL'),
                    ('createdAt', ''),
                    ('updatedAt', '')
                ]
            },
            'Class': {
                'pos': (12, 15),
                'size': (3, 2.5),
                'attributes': [
                    ('id', 'PK'),
                    ('name', 'UNIQUE'),
                    ('description', '')
                ]
            },
            'Session': {
                'pos': (12, 11.5),
                'size': (3, 3),
                'attributes': [
                    ('id', 'PK'),
                    ('classId', 'FK'),
                    ('timeSlot', ''),
                    ('capacity', ''),
                    ('bookingCount', '')
                ]
            },
            'Booking': {
                'pos': (7.5, 11.5),
                'size': (2.5, 2.5),
                'attributes': [
                    ('id', 'PK'),
                    ('userId', 'FK'),
                    ('sessionId', 'FK')
                ]
            },
            'Package': {
                'pos': (17, 12),
                'size': (3.5, 3.5),
                'attributes': [
                    ('id', 'PK'),
                    ('name', 'UNIQUE'),
                    ('description', ''),
                    ('price', ''),
                    ('maxClasses', 'NULL'),
                    ('priority', ''),
                    ('isActive', '')
                ]
            },
            'Subscription': {
                'pos': (7.5, 7.5),
                'size': (4, 4),
                'attributes': [
                    ('id', 'PK'),
                    ('userId', 'FK'),
                    ('packageId', 'FK'),
                    ('stripeSubscriptionId', 'NULL'),
                    ('status', ''),
                    ('startDate', ''),
                    ('endDate', ''),
                    ('proteinSupplement', ''),
                    ('isAutoRenew', '')
                ]
            },
            'GearItem': {
                'pos': (20, 8),
                'size': (3.5, 3.5),
                'attributes': [
                    ('id', 'PK'),
                    ('name', ''),
                    ('description', ''),
                    ('price', ''),
                    ('category', ''),
                    ('stock', ''),
                    ('isActive', '')
                ]
            },
            'GearOrder': {
                'pos': (16.5, 5.5),
                'size': (3.5, 3),
                'attributes': [
                    ('id', 'PK'),
                    ('userId', 'FK'),
                    ('totalAmount', ''),
                    ('status', ''),
                    ('customerName', ''),
                    ('shippingAddress', '')
                ]
            },
            'Transaction': {
                'pos': (3, 7.5),
                'size': (3.5, 4.5),
                'attributes': [
                    ('id', 'PK'),
                    ('userId', 'FK'),
                    ('type', ''),
                    ('amount', ''),
                    ('currency', ''),
                    ('status', ''),
                    ('description', ''),
                    ('relatedId', 'NULL'),
                    ('relatedType', 'NULL')
                ]
            },
            'SimulatedCard': {
                'pos': (12, 4),
                'size': (3.5, 4),
                'attributes': [
                    ('id', 'PK'),
                    ('cardNumber', 'UNIQUE'),
                    ('cardholderName', ''),
                    ('expiryMonth', ''),
                    ('expiryYear', ''),
                    ('cvv', ''),
                    ('cardType', ''),
                    ('isValid', ''),
                    ('balance', '')
                ]
            },
            'ActivityLog': {
                'pos': (3, 2.5),
                'size': (3.5, 3),
                'attributes': [
                    ('id', 'PK'),
                    ('userId', 'FK'),
                    ('action', ''),
                    ('description', ''),
                    ('ipAddress', 'NULL'),
                    ('userAgent', 'NULL')
                ]
            }
        }
        
        # Draw entities with fixed sizing
        entity_boxes = {}
        for entity_name, entity_data in entities.items():
            x, y = entity_data['pos']
            width, height = entity_data['size']
            attributes = entity_data['attributes']
            
            # Draw entity box
            entity_box = FancyBboxPatch(
                (x - width/2, y - height/2),
                width, height,
                boxstyle="round,pad=0.1",
                facecolor=self.colors['entity'],
                edgecolor=self.colors['entity_border'],
                linewidth=2
            )
            ax.add_patch(entity_box)
            entity_boxes[entity_name] = (x, y, width, height)
            
            # Entity name
            ax.text(x, y + height/2 - 0.3, entity_name, 
                   fontsize=14, fontweight='bold', ha='center')
            
            # Horizontal line under entity name
            ax.plot([x - width/2 + 0.1, x + width/2 - 0.1], 
                   [y + height/2 - 0.6, y + height/2 - 0.6], 
                   color=self.colors['entity_border'], linewidth=1.5)
            
            # Attributes
            attr_start_y = y + height/2 - 0.9
            line_height = 0.25
            
            for i, (attr_name, attr_type) in enumerate(attributes):
                attr_y = attr_start_y - (i * line_height)
                
                # Highlight primary keys and foreign keys
                if attr_type == 'PK':
                    attr_color = self.colors['primary_key']
                    ax.add_patch(patches.Rectangle(
                        (x - width/2 + 0.05, attr_y - 0.1),
                        width - 0.1, 0.2,
                        facecolor=attr_color, alpha=0.5
                    ))
                elif attr_type == 'FK':
                    attr_color = self.colors['foreign_key']
                    ax.add_patch(patches.Rectangle(
                        (x - width/2 + 0.05, attr_y - 0.1),
                        width - 0.1, 0.2,
                        facecolor=attr_color, alpha=0.5
                    ))
                
                # Attribute text
                attr_text = f"{attr_name}"
                if attr_type:
                    attr_text += f" ({attr_type})"
                
                ax.text(x - width/2 + 0.15, attr_y, attr_text, 
                       fontsize=10, ha='left', va='center',
                       fontweight='bold' if attr_type in ['PK', 'FK'] else 'normal')
        
        # Define relationships with better routing
        relationships = [
            ('User', 'Booking', '1:N', 'creates'),
            ('Session', 'Booking', '1:N', 'contains'),
            ('Class', 'Session', '1:N', 'has'),
            ('User', 'Subscription', '1:1', 'subscribes to'),
            ('Package', 'Subscription', '1:N', 'defines'),
            ('User', 'GearOrder', '1:N', 'places'),
            ('User', 'Transaction', '1:N', 'makes'),
            ('User', 'ActivityLog', '1:N', 'generates'),
            ('SimulatedCard', 'Subscription', '1:N', 'pays for'),
            ('SimulatedCard', 'GearOrder', '1:N', 'purchases')
        ]
        
        # Draw relationships with improved positioning
        for entity1, entity2, cardinality, relationship_name in relationships:
            if entity1 in entity_boxes and entity2 in entity_boxes:
                x1, y1, w1, h1 = entity_boxes[entity1]
                x2, y2, w2, h2 = entity_boxes[entity2]
                
                # Calculate optimal connection points
                dx = x2 - x1
                dy = y2 - y1
                
                if abs(dx) > abs(dy):  # Horizontal connection preferred
                    if dx > 0:  # entity1 is left of entity2
                        start_point = (x1 + w1/2, y1)
                        end_point = (x2 - w2/2, y2)
                    else:  # entity1 is right of entity2
                        start_point = (x1 - w1/2, y1)
                        end_point = (x2 + w2/2, y2)
                else:  # Vertical connection preferred
                    if dy > 0:  # entity1 is below entity2
                        start_point = (x1, y1 + h1/2)
                        end_point = (x2, y2 - h2/2)
                    else:  # entity1 is above entity2
                        start_point = (x1, y1 - h1/2)
                        end_point = (x2, y2 + h2/2)
                
                # Draw relationship line
                ax.annotate('', xy=end_point, xytext=start_point,
                           arrowprops=dict(arrowstyle='->', 
                                         color=self.colors['relationship'],
                                         lw=2))
                
                # Add cardinality label
                mid_x = (start_point[0] + end_point[0]) / 2
                mid_y = (start_point[1] + end_point[1]) / 2
                ax.text(mid_x, mid_y + 0.2, cardinality, 
                       fontsize=10, ha='center', va='center', fontweight='bold',
                       bbox=dict(boxstyle="round,pad=0.3", 
                               facecolor='white', edgecolor='gray', alpha=0.9))
        
        # Add comprehensive legend
        legend_x = 1
        legend_y = 5
        legend_box = FancyBboxPatch(
            (legend_x - 0.2, legend_y - 2),
            4.5, 4,
            boxstyle="round,pad=0.2",
            facecolor='#F8F9FA',
            edgecolor='#6C757D',
            linewidth=1.5
        )
        ax.add_patch(legend_box)
        
        ax.text(legend_x + 2, legend_y + 1.5, 'Legend', fontsize=14, fontweight='bold', ha='center')
        
        # PK legend
        ax.add_patch(patches.Rectangle((legend_x, legend_y + 0.8), 0.4, 0.25,
                                     facecolor=self.colors['primary_key'], alpha=0.5))
        ax.text(legend_x + 0.6, legend_y + 0.92, 'Primary Key (PK)', fontsize=11, va='center')
        
        # FK legend
        ax.add_patch(patches.Rectangle((legend_x, legend_y + 0.4), 0.4, 0.25,
                                     facecolor=self.colors['foreign_key'], alpha=0.5))
        ax.text(legend_x + 0.6, legend_y + 0.52, 'Foreign Key (FK)', fontsize=11, va='center')
        
        # Cardinality legend
        ax.text(legend_x, legend_y, 'Cardinality:', fontsize=11, fontweight='bold')
        ax.text(legend_x, legend_y - 0.3, '1:1 = One-to-One', fontsize=10)
        ax.text(legend_x, legend_y - 0.6, '1:N = One-to-Many', fontsize=10)
        ax.text(legend_x, legend_y - 0.9, 'N:M = Many-to-Many', fontsize=10)
        
        # Add timestamp and metadata
        ax.text(23, 1, f'Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', 
               fontsize=10, ha='right', style='italic')
        ax.text(23, 0.5, 'Pentagon Gymnastics System Database Schema', 
               fontsize=10, ha='right', style='italic')
        
        plt.tight_layout()
        
        # Save without showing (to prevent hanging)
        erd_png_path = f'{self.output_dir}/pentagon_gym_erd.png'
        erd_pdf_path = f'{self.output_dir}/pentagon_gym_erd.pdf'
        
        plt.savefig(erd_png_path, dpi=300, bbox_inches='tight', facecolor='white')
        plt.savefig(erd_pdf_path, bbox_inches='tight', facecolor='white')
        plt.close()  # Important: close the figure to free memory
        
        print(f"✅ ERD diagram saved to {erd_png_path} and {erd_pdf_path}")
        return erd_png_path
    
    def generate_system_architecture_uml(self):
        """Generate System Architecture UML Diagram"""
        print("Generating System Architecture diagram...")
        
        fig, ax = plt.subplots(1, 1, figsize=(20, 16))
        ax.set_xlim(0, 20)
        ax.set_ylim(0, 16)
        ax.axis('off')
        
        # Title
        ax.text(10, 15.5, 'Pentagon Gymnastics - System Architecture (UML)', 
                fontsize=20, fontweight='bold', ha='center')
        
        # Define layers with improved layout
        layers = [
            {
                'name': 'Presentation Layer (Frontend)',
                'y': 12.5,
                'height': 2.5,
                'color': self.colors['interface'],
                'border': self.colors['interface_border'],
                'components': [
                    'React Components',
                    'State Management (Context)',
                    'React Query (Server State)',
                    'React Router (Navigation)',
                    'Tailwind CSS (Styling)',
                    'Axios (HTTP Client)'
                ]
            },
            {
                'name': 'API Gateway Layer',
                'y': 9.5,
                'height': 2,
                'color': self.colors['class'],
                'border': self.colors['class_border'],
                'components': [
                    'Express.js Server',
                    'CORS Middleware',
                    'JWT Authentication',
                    'Route Handlers'
                ]
            },
            {
                'name': 'Business Logic Layer (Controllers & Services)',
                'y': 6.5,
                'height': 2.5,
                'color': self.colors['entity'],
                'border': self.colors['entity_border'],
                'components': [
                    'AuthController',
                    'ClassController',
                    'SubscriptionController',
                    'PaymentController',
                    'AdminController',
                    'GearController'
                ]
            },
            {
                'name': 'Data Access Layer (ORM)',
                'y': 3.5,
                'height': 2,
                'color': self.colors['interface'],
                'border': self.colors['interface_border'],
                'components': [
                    'Prisma ORM',
                    'Database Migrations',
                    'Query Builder',
                    'Connection Pooling'
                ]
            },
            {
                'name': 'Database Layer',
                'y': 1,
                'height': 1.5,
                'color': '#F3E5F5',
                'border': '#9C27B0',
                'components': [
                    'PostgreSQL Database',
                    'Indexes & Constraints',
                    'Stored Procedures',
                    'Backup & Recovery'
                ]
            }
        ]
        
        # Draw layers
        for layer in layers:
            # Layer box
            layer_box = FancyBboxPatch(
                (1, layer['y']),
                18, layer['height'],
                boxstyle="round,pad=0.15",
                facecolor=layer['color'],
                edgecolor=layer['border'],
                linewidth=2.5
            )
            ax.add_patch(layer_box)
            
            # Layer name
            ax.text(2, layer['y'] + layer['height'] - 0.4, layer['name'], 
                   fontsize=16, fontweight='bold')
            
            # Components
            comp_per_row = 3
            comp_width = 5.8
            comp_height = 0.5
            
            for i, component in enumerate(layer['components']):
                row = i // comp_per_row
                col = i % comp_per_row
                
                comp_x = 2 + (col * comp_width)
                comp_y = layer['y'] + layer['height'] - 1.2 - (row * 0.6)
                
                # Component box
                comp_box = FancyBboxPatch(
                    (comp_x, comp_y),
                    comp_width - 0.3, comp_height,
                    boxstyle="round,pad=0.08",
                    facecolor='white',
                    edgecolor=layer['border'],
                    linewidth=1.5,
                    alpha=0.9
                )
                ax.add_patch(comp_box)
                
                # Component text
                ax.text(comp_x + (comp_width - 0.3)/2, comp_y + comp_height/2, 
                       component, fontsize=11, ha='center', va='center', fontweight='bold')
        
        # Draw improved arrows between layers
        arrow_positions = [
            (10, 12.5, 10, 11.5),    # Presentation to API Gateway
            (10, 9.5, 10, 9),        # API Gateway to Business Logic
            (10, 6.5, 10, 5.5),      # Business Logic to Data Access
            (10, 3.5, 10, 2.5)       # Data Access to Database
        ]
        
        for x1, y1, x2, y2 in arrow_positions:
            ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                       arrowprops=dict(arrowstyle='<->', 
                                     color=self.colors['relationship'],
                                     lw=3))
        
        # Add external systems with better positioning
        external_systems = [
            {'name': 'Simulated Payment\nGateway', 'pos': (16.5, 7), 'color': '#FFEBEE'},
            {'name': 'Cloud Storage\n(Render Platform)', 'pos': (3.5, 7), 'color': '#E3F2FD'},
            {'name': 'Email Service\n(Future Integration)', 'pos': (16.5, 4), 'color': '#FFF3E0'}
        ]
        
        for system in external_systems:
            x, y = system['pos']
            sys_box = FancyBboxPatch(
                (x - 1, y - 0.6),
                2, 1.2,
                boxstyle="round,pad=0.15",
                facecolor=system['color'],
                edgecolor='#F44336',
                linewidth=2,
                linestyle='--'
            )
            ax.add_patch(sys_box)
            ax.text(x, y, system['name'], fontsize=11, ha='center', va='center', fontweight='bold')
        
        # Add deployment information box
        deployment_box = FancyBboxPatch(
            (0.5, 0.2),
            19, 1,
            boxstyle="round,pad=0.15",
            facecolor='#E8F5E8',
            edgecolor='#4CAF50',
            linewidth=2
        )
        ax.add_patch(deployment_box)
        
        ax.text(10, 0.7, 'Deployment Environment: Render Cloud Platform | Database: PostgreSQL | Frontend: Static Site Hosting', 
               fontsize=14, ha='center', va='center', fontweight='bold')
        
        # Add timestamp
        ax.text(19, 0.2, f'Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', 
               fontsize=10, ha='right', style='italic')
        
        plt.tight_layout()
        
        # Save without showing
        arch_png_path = f'{self.output_dir}/pentagon_gym_system_architecture.png'
        arch_pdf_path = f'{self.output_dir}/pentagon_gym_system_architecture.pdf'
        
        plt.savefig(arch_png_path, dpi=300, bbox_inches='tight', facecolor='white')
        plt.savefig(arch_pdf_path, bbox_inches='tight', facecolor='white')
        plt.close()
        
        print(f"✅ System Architecture diagram saved to {arch_png_path} and {arch_pdf_path}")
        return arch_png_path
    
    def generate_class_diagram(self):
        """Generate UML Class Diagram for key classes"""
        print("Generating UML Class diagram...")
        
        fig, ax = plt.subplots(1, 1, figsize=(22, 18))
        ax.set_xlim(0, 22)
        ax.set_ylim(0, 18)
        ax.axis('off')
        
        # Title
        ax.text(11, 17.5, 'Pentagon Gymnastics - UML Class Diagram', 
                fontsize=20, fontweight='bold', ha='center')
        
        # Define classes with better positioning
        classes = {
            'AuthController': {
                'pos': (4, 15),
                'size': (4, 2.5),
                'type': 'controller',
                'attributes': [
                    '- jwtSecret: string',
                    '- bcrypt: BcryptService'
                ],
                'methods': [
                    '+ register(req, res): Response',
                    '+ login(req, res): Response',
                    '+ getProfile(req, res): Response',
                    '+ validateToken(token): boolean'
                ]
            },
            'ClassController': {
                'pos': (11, 15),
                'size': (4, 2.5),
                'type': 'controller',
                'attributes': [
                    '- classService: ClassService'
                ],
                'methods': [
                    '+ getAllClasses(req, res): Response',
                    '+ getClassById(req, res): Response',
                    '+ createClass(req, res): Response',
                    '+ updateClass(req, res): Response'
                ]
            },
            'SubscriptionController': {
                'pos': (18, 15),
                'size': (4, 2.5),
                'type': 'controller',
                'attributes': [
                    '- subscriptionService: SubscriptionService'
                ],
                'methods': [
                    '+ createSubscription(req, res): Response',
                    '+ switchPackage(req, res): Response',
                    '+ getCurrentSubscription(req, res): Response',
                    '+ cancelSubscription(req, res): Response'
                ]
            },
            'User': {
                'pos': (4, 11),
                'size': (4, 3.5),
                'type': 'model',
                'attributes': [
                    '- id: number',
                    '- email: string',
                    '- password: string',
                    '- role: UserRole',
                    '- forename: string',
                    '- surname: string',
                    '- address: string',
                    '- dateOfBirth: Date',
                    '- phoneNumber: string'
                ],
                'methods': [
                    '+ validatePassword(password): boolean',
                    '+ hasPermission(permission): boolean',
                    '+ getFullName(): string',
                    '+ isActive(): boolean'
                ]
            },
            'Class': {
                'pos': (11, 11),
                'size': (4, 3),
                'type': 'model',
                'attributes': [
                    '- id: number',
                    '- name: string',
                    '- description: string',
                    '- sessions: Session[]'
                ],
                'methods': [
                    '+ getAvailableSessions(): Session[]',
                    '+ getTotalCapacity(): number',
                    '+ isBookable(): boolean',
                    '+ getPopularity(): number'
                ]
            },
            'Subscription': {
                'pos': (18, 11),
                'size': (4, 3.5),
                'type': 'model',
                'attributes': [
                    '- id: number',
                    '- userId: number',
                    '- packageId: number',
                    '- status: SubscriptionStatus',
                    '- startDate: Date',
                    '- endDate: Date',
                    '- isAutoRenew: boolean'
                ],
                'methods': [
                    '+ isActive(): boolean',
                    '+ daysRemaining(): number',
                    '+ canBookClass(classId): boolean',
                    '+ calculateProration(): number'
                ]
            },
            'AuthService': {
                'pos': (4, 6.5),
                'size': (4, 2.5),
                'type': 'service',
                'attributes': [
                    '- jwtSecret: string',
                    '- saltRounds: number'
                ],
                'methods': [
                    '+ generateToken(user): string',
                    '+ verifyToken(token): User',
                    '+ hashPassword(password): string',
                    '+ comparePassword(password, hash): boolean'
                ]
            },
            'SubscriptionService': {
                'pos': (11, 6.5),
                'size': (4, 2.5),
                'type': 'service',
                'attributes': [
                    '- paymentService: PaymentService'
                ],
                'methods': [
                    '+ createSubscription(userId, packageId): Subscription',
                    '+ switchPackage(userId, newPackageId): Subscription',
                    '+ calculateProration(subscription): number',
                    '+ validateEligibility(userId): boolean'
                ]
            },
            'PaymentService': {
                'pos': (18, 6.5),
                'size': (4, 2.5),
                'type': 'service',
                'attributes': [
                    '- simulatedCards: SimulatedCard[]',
                    '- processingDelay: number'
                ],
                'methods': [
                    '+ processPayment(amount, cardId): PaymentResult',
                    '+ validateCard(cardId): boolean',
                    '+ simulatePayment(paymentData): Promise<PaymentResult>',
                    '+ refundPayment(paymentId): PaymentResult'
                ]
            },
            'PrismaClient': {
                'pos': (11, 2.5),
                'size': (4, 2.5),
                'type': 'dao',
                'attributes': [
                    '- connection: DatabaseConnection',
                    '- connectionPool: Pool'
                ],
                'methods': [
                    '+ user: UserDelegate',
                    '+ class: ClassDelegate',
                    '+ subscription: SubscriptionDelegate',
                    '+ transaction(callback): Promise<any>'
                ]
            }
        }
        
        # Color mapping for different types
        type_colors = {
            'controller': {'face': self.colors['class'], 'border': self.colors['class_border']},
            'model': {'face': self.colors['entity'], 'border': self.colors['entity_border']},
            'service': {'face': self.colors['interface'], 'border': self.colors['interface_border']},
            'dao': {'face': '#F3E5F5', 'border': '#9C27B0'}
        }
        
        # Draw classes
        class_boxes = {}
        for class_name, class_data in classes.items():
            x, y = class_data['pos']
            width, height = class_data['size']
            class_type = class_data['type']
            attributes = class_data['attributes']
            methods = class_data['methods']
            
            colors = type_colors[class_type]
            
            # Class box
            class_box = FancyBboxPatch(
                (x - width/2, y - height/2),
                width, height,
                boxstyle="round,pad=0.1",
                facecolor=colors['face'],
                edgecolor=colors['border'],
                linewidth=2
            )
            ax.add_patch(class_box)
            class_boxes[class_name] = (x, y, width, height)
            
            # Class name
            ax.text(x, y + height/2 - 0.3, class_name, 
                   fontsize=13, fontweight='bold', ha='center')
            
            # Stereotype
            stereotype = f"<<{class_type}>>"
            ax.text(x, y + height/2 - 0.6, stereotype, 
                   fontsize=10, style='italic', ha='center')
            
            # Separator line
            separator_y = y + height/2 - 0.8
            ax.plot([x - width/2 + 0.1, x + width/2 - 0.1], 
                   [separator_y, separator_y], 
                   color=colors['border'], linewidth=1.5)
            
            # Attributes
            current_y = separator_y - 0.25
            for attr in attributes:
                ax.text(x - width/2 + 0.2, current_y, attr, 
                       fontsize=10, ha='left', va='center')
                current_y -= 0.3
            
            # Methods separator
            if attributes and methods:
                ax.plot([x - width/2 + 0.1, x + width/2 - 0.1], 
                       [current_y + 0.15, current_y + 0.15], 
                       color=colors['border'], linewidth=1.5)
                current_y -= 0.1
            
            # Methods
            for method in methods:
                ax.text(x - width/2 + 0.2, current_y, method, 
                       fontsize=10, ha='left', va='center')
                current_y -= 0.3
        
        # Define relationships with labels
        relationships = [
            ('AuthController', 'AuthService', 'uses', '-->'),
            ('AuthController', 'User', 'manages', '-->'),
            ('ClassController', 'Class', 'manages', '-->'),
            ('SubscriptionController', 'SubscriptionService', 'uses', '-->'),
            ('SubscriptionController', 'Subscription', 'manages', '-->'),
            ('SubscriptionService', 'PaymentService', 'uses', '-->'),
            ('AuthService', 'PrismaClient', 'uses', '-->'),
            ('SubscriptionService', 'PrismaClient', 'uses', '-->'),
            ('PaymentService', 'PrismaClient', 'uses', '-->'),
        ]
        
        # Draw relationships
        for class1, class2, label, arrow_style in relationships:
            if class1 in class_boxes and class2 in class_boxes:
                x1, y1, w1, h1 = class_boxes[class1]
                x2, y2, w2, h2 = class_boxes[class2]
                
                # Calculate connection points
                if abs(x1 - x2) > abs(y1 - y2):  # Horizontal connection
                    if x1 < x2:
                        start = (x1 + w1/2, y1)
                        end = (x2 - w2/2, y2)
                    else:
                        start = (x1 - w1/2, y1)
                        end = (x2 + w2/2, y2)
                else:  # Vertical connection
                    if y1 > y2:
                        start = (x1, y1 - h1/2)
                        end = (x2, y2 + h2/2)
                    else:
                        start = (x1, y1 + h1/2)
                        end = (x2, y2 - h2/2)
                
                # Draw relationship
                if arrow_style == '-->':
                    ax.annotate('', xy=end, xytext=start,
                               arrowprops=dict(arrowstyle='->', 
                                             color=self.colors['relationship'],
                                             lw=2))
                
                # Add label
                mid_x = (start[0] + end[0]) / 2
                mid_y = (start[1] + end[1]) / 2
                ax.text(mid_x, mid_y + 0.15, label, 
                       fontsize=9, ha='center', va='center', fontweight='bold',
                       bbox=dict(boxstyle="round,pad=0.15", 
                               facecolor='white', edgecolor='gray', alpha=0.9))
        
        # Add comprehensive legend
        legend_x = 1
        legend_y = 6
        legend_box = FancyBboxPatch(
            (legend_x - 0.2, legend_y - 3),
            3, 6,
            boxstyle="round,pad=0.2",
            facecolor='#F8F9FA',
            edgecolor='#6C757D',
            linewidth=1.5
        )
        ax.add_patch(legend_box)
        
        ax.text(legend_x + 1.2, legend_y + 2.5, 'Class Stereotypes', fontsize=14, fontweight='bold', ha='center')
        
        stereotypes = [
            ('<<controller>>', 'Handles HTTP requests', type_colors['controller']),
            ('<<model>>', 'Data entities', type_colors['model']),
            ('<<service>>', 'Business logic', type_colors['service']),
            ('<<dao>>', 'Data access layer', type_colors['dao'])
        ]
        
        for i, (stereotype, desc, colors) in enumerate(stereotypes):
            y_pos = legend_y + 1.5 - (i * 0.8)
            ax.add_patch(patches.Rectangle((legend_x, y_pos), 0.6, 0.3,
                                         facecolor=colors['face'], 
                                         edgecolor=colors['border'],
                                         linewidth=1.5))
            ax.text(legend_x + 0.8, y_pos + 0.15, stereotype, 
                   fontsize=11, va='center', fontweight='bold')
            ax.text(legend_x + 0.8, y_pos - 0.1, desc, 
                   fontsize=9, va='center', style='italic')
        
        # Add visibility legend
        ax.text(legend_x, legend_y - 2.5, 'Visibility:', fontsize=12, fontweight='bold')
        ax.text(legend_x, legend_y - 2.8, '+ Public', fontsize=10)
        ax.text(legend_x, legend_y - 3.1, '- Private', fontsize=10)
        ax.text(legend_x, legend_y - 3.4, '# Protected', fontsize=10)
        
        # Add timestamp
        ax.text(21, 0.5, f'Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', 
               fontsize=10, ha='right', style='italic')
        
        plt.tight_layout()
        
        # Save without showing
        class_png_path = f'{self.output_dir}/pentagon_gym_class_diagram.png'
        class_pdf_path = f'{self.output_dir}/pentagon_gym_class_diagram.pdf'
        
        plt.savefig(class_png_path, dpi=300, bbox_inches='tight', facecolor='white')
        plt.savefig(class_pdf_path, bbox_inches='tight', facecolor='white')
        plt.close()
        
        print(f"✅ Class diagram saved to {class_png_path} and {class_pdf_path}")
        return class_png_path
    
    def generate_sequence_diagram(self):
        """Generate UML Sequence Diagram for key user flows"""
        print("Generating UML Sequence diagram...")
        
        fig, ax = plt.subplots(1, 1, figsize=(20, 14))
        ax.set_xlim(0, 20)
        ax.set_ylim(0, 14)
        ax.axis('off')
        
        # Title
        ax.text(10, 13.5, 'Pentagon Gymnastics - Sequence Diagram: User Subscription Flow', 
                fontsize=18, fontweight='bold', ha='center')
        
        # Define actors and objects
        actors = [
            {'name': 'User', 'x': 2, 'type': 'actor'},
            {'name': 'Frontend', 'x': 5.5, 'type': 'boundary'},
            {'name': 'AuthController', 'x': 9, 'type': 'control'},
            {'name': 'SubscriptionService', 'x': 12.5, 'type': 'control'},
            {'name': 'PaymentService', 'x': 16, 'type': 'control'},
            {'name': 'Database', 'x': 18.5, 'type': 'entity'}
        ]
        
        # Draw actors and lifelines
        lifeline_top = 12
        lifeline_bottom = 1
        
        for actor in actors:
            x = actor['x']
            
            # Actor box
            if actor['type'] == 'actor':
                # Stick figure for user
                ax.plot([x, x], [lifeline_top + 0.3, lifeline_top + 0.8], 'k-', lw=2)  # body
                ax.add_patch(plt.Circle((x, lifeline_top + 1), 0.15, fill=False, linewidth=2))  # head
                ax.plot([x-0.3, x+0.3], [lifeline_top + 0.6, lifeline_top + 0.6], 'k-', lw=2)  # arms
                ax.plot([x-0.2, x, x+0.2], [lifeline_top + 0.1, lifeline_top + 0.3, lifeline_top + 0.1], 'k-', lw=2)  # legs
            else:
                # Box for objects
                box_width = 1.5
                box_height = 0.6
                
                colors = {
                    'boundary': '#E8F5E8',
                    'control': '#FFF3E0', 
                    'entity': '#E8F4FD'
                }
                
                actor_box = FancyBboxPatch(
                    (x - box_width/2, lifeline_top + 0.3),
                    box_width, box_height,
                    boxstyle="round,pad=0.05",
                    facecolor=colors[actor['type']],
                    edgecolor='black',
                    linewidth=1.5
                )
                ax.add_patch(actor_box)
            
            # Actor name
            ax.text(x, lifeline_top + (1.2 if actor['type'] == 'actor' else 0.6), 
                   actor['name'], fontsize=12, fontweight='bold', ha='center')
            
            # Lifeline
            ax.plot([x, x], [lifeline_top, lifeline_bottom], 'k--', alpha=0.7, lw=1.5)
        
        # Define messages in sequence
        messages = [
            {'from': 0, 'to': 1, 'y': 11, 'text': '1: Select Subscription Package', 'type': 'sync'},
            {'from': 1, 'to': 2, 'y': 10.5, 'text': '2: POST /api/auth/login', 'type': 'sync'},
            {'from': 2, 'to': 5, 'y': 10, 'text': '3: Validate Credentials', 'type': 'sync'},
            {'from': 5, 'to': 2, 'y': 9.5, 'text': '4: Return User Data', 'type': 'return'},
            {'from': 2, 'to': 1, 'y': 9, 'text': '5: JWT Token', 'type': 'return'},
            {'from': 1, 'to': 3, 'y': 8.5, 'text': '6: POST /api/subscriptions/create', 'type': 'sync'},
            {'from': 3, 'to': 5, 'y': 8, 'text': '7: Create Subscription Record', 'type': 'sync'},
            {'from': 5, 'to': 3, 'y': 7.5, 'text': '8: Subscription Created', 'type': 'return'},
            {'from': 3, 'to': 4, 'y': 7, 'text': '9: Process Payment', 'type': 'sync'},
            {'from': 4, 'to': 5, 'y': 6.5, 'text': '10: Create Payment Record', 'type': 'sync'},
            {'from': 5, 'to': 4, 'y': 6, 'text': '11: Payment Saved', 'type': 'return'},
            {'from': 4, 'to': 3, 'y': 5.5, 'text': '12: Payment Result', 'type': 'return'},
            {'from': 3, 'to': 5, 'y': 5, 'text': '13: Update Subscription Status', 'type': 'sync'},
            {'from': 3, 'to': 1, 'y': 4.5, 'text': '14: Subscription Confirmation', 'type': 'return'},
            {'from': 1, 'to': 0, 'y': 4, 'text': '15: Display Success Message', 'type': 'return'}
        ]
        
        # Draw messages
        for msg in messages:
            from_x = actors[msg['from']]['x']
            to_x = actors[msg['to']]['x']
            y = msg['y']
            
            # Message arrow
            if msg['type'] == 'sync':
                arrow_style = '->'
                color = 'blue'
            elif msg['type'] == 'return':
                arrow_style = '<-'
                color = 'green'
            else:
                arrow_style = '->'
                color = 'black'
            
            ax.annotate('', xy=(to_x, y), xytext=(from_x, y),
                       arrowprops=dict(arrowstyle=arrow_style, color=color, lw=1.5))
            
            # Message text
            mid_x = (from_x + to_x) / 2
            ax.text(mid_x, y + 0.15, msg['text'], fontsize=10, ha='center', va='bottom',
                   bbox=dict(boxstyle="round,pad=0.1", facecolor='white', alpha=0.8))
        
        # Add activation boxes (execution specifications)
        activations = [
            {'actor': 2, 'start': 10.5, 'end': 4.5, 'width': 0.1},  # AuthController
            {'actor': 3, 'start': 8.5, 'end': 4.5, 'width': 0.1},   # SubscriptionService  
            {'actor': 4, 'start': 7, 'end': 5.5, 'width': 0.1},     # PaymentService
        ]
        
        for activation in activations:
            x = actors[activation['actor']]['x']
            ax.add_patch(patches.Rectangle(
                (x - activation['width']/2, activation['end']),
                activation['width'], activation['start'] - activation['end'],
                facecolor='lightgray', edgecolor='black', linewidth=1
            ))
        
        # Add notes
        note_box = FancyBboxPatch(
            (0.5, 2.5), 4, 1.5,
            boxstyle="round,pad=0.1",
            facecolor='#FFFACD',
            edgecolor='#DAA520',
            linewidth=1.5
        )
        ax.add_patch(note_box)
        
        ax.text(2.5, 3.7, 'Notes:', fontsize=12, fontweight='bold', ha='center')
        ax.text(2.5, 3.3, '• Simulated payment processing', fontsize=10, ha='center')
        ax.text(2.5, 3, '• JWT authentication required', fontsize=10, ha='center')
        ax.text(2.5, 2.7, '• Transaction rollback on failure', fontsize=10, ha='center')
        
        # Add timestamp
        ax.text(19, 0.5, f'Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', 
               fontsize=10, ha='right', style='italic')
        
        plt.tight_layout()
        
        # Save without showing
        seq_png_path = f'{self.output_dir}/pentagon_gym_sequence_diagram.png'
        seq_pdf_path = f'{self.output_dir}/pentagon_gym_sequence_diagram.pdf'
        
        plt.savefig(seq_png_path, dpi=300, bbox_inches='tight', facecolor='white')
        plt.savefig(seq_pdf_path, bbox_inches='tight', facecolor='white')
        plt.close()
        
        print(f"✅ Sequence diagram saved to {seq_png_path} and {seq_pdf_path}")
        return seq_png_path
    
    def generate_all_diagrams(self):
        """Generate all diagrams without hanging"""
        print("🎨 Generating Pentagon Gymnastics System Diagrams for Dissertation...")
        print("=" * 70)
        
        generated_files = []
        
        try:
            print("\n📊 1. Generating Entity Relationship Diagram (ERD)...")
            erd_path = self.generate_erd_diagram()
            generated_files.append(erd_path)
            
            print("\n🏗️ 2. Generating System Architecture Diagram...")
            arch_path = self.generate_system_architecture_uml()
            generated_files.append(arch_path)
            
            print("\n🎯 3. Generating UML Class Diagram...")
            class_path = self.generate_class_diagram()
            generated_files.append(class_path)
            
            print("\n🔄 4. Generating UML Sequence Diagram...")
            seq_path = self.generate_sequence_diagram()
            generated_files.append(seq_path)
            
            print("\n" + "=" * 70)
            print("✅ All diagrams generated successfully!")
            print(f"📁 Diagrams saved in: {os.path.abspath(self.output_dir)}/")
            print("\n📋 Generated files:")
            for i, file_path in enumerate(generated_files, 1):
                filename = os.path.basename(file_path)
                print(f"   {i}. {filename}")
                print(f"      - PNG: {filename}")
                print(f"      - PDF: {filename.replace('.png', '.pdf')}")
            
            print("\n🎓 These diagrams are ready for inclusion in your dissertation.")
            print("💡 Tip: Use the PDF versions for high-quality printing in your thesis.")
            
            return generated_files
            
        except Exception as e:
            print(f"\n❌ Error generating diagrams: {str(e)}")
            return []

def main():
    """Main function to run the improved diagram generator"""
    print("🚀 Starting Pentagon Gymnastics Diagram Generator...")
    
    generator = ImprovedDiagramGenerator()
    generated_files = generator.generate_all_diagrams()
    
    if generated_files:
        print(f"\n🎉 Successfully generated {len(generated_files)} diagram files!")
    else:
        print("\n❌ Failed to generate diagrams. Please check the error messages above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
