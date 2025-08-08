"""
Pentagon Gymnastics System - UML and ERD Diagram Generator
Created for dissertation documentation
Author: Pentagon Gymnastics Development Team
Date: August 8, 2025
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, ConnectionPatch
import numpy as np
from datetime import datetime
import os

class DiagramGenerator:
    def __init__(self):
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
        fig, ax = plt.subplots(1, 1, figsize=(20, 16))
        ax.set_xlim(0, 20)
        ax.set_ylim(0, 16)
        ax.axis('off')
        
        # Title
        ax.text(10, 15.5, 'Pentagon Gymnastics - Entity Relationship Diagram', 
                fontsize=20, fontweight='bold', ha='center')
        
        # Define entities and their attributes
        entities = {
            'User': {
                'pos': (2, 12),
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
                'pos': (10, 13),
                'attributes': [
                    ('id', 'PK'),
                    ('name', 'UNIQUE'),
                    ('description', '')
                ]
            },
            'Session': {
                'pos': (10, 10),
                'attributes': [
                    ('id', 'PK'),
                    ('classId', 'FK'),
                    ('timeSlot', ''),
                    ('capacity', ''),
                    ('bookingCount', '')
                ]
            },
            'Booking': {
                'pos': (6, 10),
                'attributes': [
                    ('id', 'PK'),
                    ('userId', 'FK'),
                    ('sessionId', 'FK')
                ]
            },
            'Package': {
                'pos': (14, 10),
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
                'pos': (6, 6),
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
                'pos': (18, 8),
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
                'pos': (14, 6),
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
                'pos': (2, 6),
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
                'pos': (10, 3),
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
                'pos': (2, 2),
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
        
        # Draw entities
        entity_boxes = {}
        for entity_name, entity_data in entities.items():
            x, y = entity_data['pos']
            attributes = entity_data['attributes']
            
            # Calculate box dimensions
            max_width = max(len(entity_name), max(len(attr[0]) for attr in attributes)) * 0.12
            height = (len(attributes) + 2) * 0.3
            
            # Draw entity box
            entity_box = FancyBboxPatch(
                (x - max_width/2, y - height/2),
                max_width, height,
                boxstyle="round,pad=0.1",
                facecolor=self.colors['entity'],
                edgecolor=self.colors['entity_border'],
                linewidth=2
            )
            ax.add_patch(entity_box)
            entity_boxes[entity_name] = (x, y, max_width, height)
            
            # Entity name
            ax.text(x, y + height/2 - 0.2, entity_name, 
                   fontsize=12, fontweight='bold', ha='center')
            
            # Horizontal line under entity name
            ax.plot([x - max_width/2 + 0.1, x + max_width/2 - 0.1], 
                   [y + height/2 - 0.4, y + height/2 - 0.4], 
                   color=self.colors['entity_border'], linewidth=1)
            
            # Attributes
            for i, (attr_name, attr_type) in enumerate(attributes):
                attr_y = y + height/2 - 0.7 - (i * 0.25)
                
                # Highlight primary keys and foreign keys
                if attr_type == 'PK':
                    attr_color = self.colors['primary_key']
                    ax.add_patch(patches.Rectangle(
                        (x - max_width/2 + 0.05, attr_y - 0.1),
                        max_width - 0.1, 0.2,
                        facecolor=attr_color, alpha=0.3
                    ))
                elif attr_type == 'FK':
                    attr_color = self.colors['foreign_key']
                    ax.add_patch(patches.Rectangle(
                        (x - max_width/2 + 0.05, attr_y - 0.1),
                        max_width - 0.1, 0.2,
                        facecolor=attr_color, alpha=0.3
                    ))
                
                # Attribute text
                attr_text = f"{attr_name}"
                if attr_type:
                    attr_text += f" ({attr_type})"
                
                ax.text(x - max_width/2 + 0.1, attr_y, attr_text, 
                       fontsize=9, ha='left', va='center')
        
        # Define relationships
        relationships = [
            ('User', 'Booking', '1:N', 'has'),
            ('Session', 'Booking', '1:N', 'contains'),
            ('Class', 'Session', '1:N', 'has'),
            ('User', 'Subscription', '1:1', 'has'),
            ('Package', 'Subscription', '1:N', 'includes'),
            ('User', 'GearOrder', '1:N', 'places'),
            ('User', 'Transaction', '1:N', 'makes'),
            ('User', 'ActivityLog', '1:N', 'generates'),
            ('SimulatedCard', 'Subscription', '1:N', 'pays for'),
            ('SimulatedCard', 'GearOrder', '1:N', 'pays for')
        ]
        
        # Draw relationships
        for entity1, entity2, cardinality, relationship_name in relationships:
            if entity1 in entity_boxes and entity2 in entity_boxes:
                x1, y1, w1, h1 = entity_boxes[entity1]
                x2, y2, w2, h2 = entity_boxes[entity2]
                
                # Calculate connection points
                if x1 < x2:  # entity1 is to the left of entity2
                    start_point = (x1 + w1/2, y1)
                    end_point = (x2 - w2/2, y2)
                elif x1 > x2:  # entity1 is to the right of entity2
                    start_point = (x1 - w1/2, y1)
                    end_point = (x2 + w2/2, y2)
                else:  # entities are vertically aligned
                    if y1 > y2:  # entity1 is above entity2
                        start_point = (x1, y1 - h1/2)
                        end_point = (x2, y2 + h2/2)
                    else:  # entity1 is below entity2
                        start_point = (x1, y1 + h1/2)
                        end_point = (x2, y2 - h2/2)
                
                # Draw relationship line
                ax.annotate('', xy=end_point, xytext=start_point,
                           arrowprops=dict(arrowstyle='->', 
                                         color=self.colors['relationship'],
                                         lw=1.5))
                
                # Add cardinality label
                mid_x = (start_point[0] + end_point[0]) / 2
                mid_y = (start_point[1] + end_point[1]) / 2
                ax.text(mid_x, mid_y + 0.15, cardinality, 
                       fontsize=8, ha='center', va='center',
                       bbox=dict(boxstyle="round,pad=0.2", 
                               facecolor='white', alpha=0.8))
        
        # Add legend
        legend_x = 0.5
        legend_y = 3
        ax.text(legend_x, legend_y + 1, 'Legend:', fontsize=12, fontweight='bold')
        
        # PK legend
        ax.add_patch(patches.Rectangle((legend_x, legend_y + 0.5), 0.3, 0.2,
                                     facecolor=self.colors['primary_key'], alpha=0.3))
        ax.text(legend_x + 0.4, legend_y + 0.6, 'Primary Key (PK)', fontsize=10)
        
        # FK legend
        ax.add_patch(patches.Rectangle((legend_x, legend_y + 0.2), 0.3, 0.2,
                                     facecolor=self.colors['foreign_key'], alpha=0.3))
        ax.text(legend_x + 0.4, legend_y + 0.3, 'Foreign Key (FK)', fontsize=10)
        
        # Add timestamp
        ax.text(19, 0.5, f'Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', 
               fontsize=8, ha='right', style='italic')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/pentagon_gym_erd.png', 
                   dpi=300, bbox_inches='tight', facecolor='white')
        plt.savefig(f'{self.output_dir}/pentagon_gym_erd.pdf', 
                   bbox_inches='tight', facecolor='white')
        print(f"ERD diagram saved to {self.output_dir}/pentagon_gym_erd.png and .pdf")
        plt.show()
    
    def generate_system_architecture_uml(self):
        """Generate System Architecture UML Diagram"""
        fig, ax = plt.subplots(1, 1, figsize=(18, 14))
        ax.set_xlim(0, 18)
        ax.set_ylim(0, 14)
        ax.axis('off')
        
        # Title
        ax.text(9, 13.5, 'Pentagon Gymnastics - System Architecture (UML)', 
                fontsize=18, fontweight='bold', ha='center')
        
        # Define layers
        layers = [
            {
                'name': 'Presentation Layer',
                'y': 11,
                'height': 2,
                'color': self.colors['interface'],
                'border': self.colors['interface_border'],
                'components': [
                    'React Frontend',
                    'Responsive UI',
                    'State Management',
                    'Routing'
                ]
            },
            {
                'name': 'API Gateway Layer',
                'y': 8.5,
                'height': 1.5,
                'color': self.colors['class'],
                'border': self.colors['class_border'],
                'components': [
                    'Express.js Server',
                    'CORS Middleware',
                    'Authentication',
                    'Route Handlers'
                ]
            },
            {
                'name': 'Business Logic Layer',
                'y': 5.5,
                'height': 2.5,
                'color': self.colors['entity'],
                'border': self.colors['entity_border'],
                'components': [
                    'User Controller',
                    'Class Controller',
                    'Subscription Controller',
                    'Payment Controller',
                    'Admin Controller',
                    'Gear Controller'
                ]
            },
            {
                'name': 'Data Access Layer',
                'y': 2.5,
                'height': 2,
                'color': self.colors['interface'],
                'border': self.colors['interface_border'],
                'components': [
                    'Prisma ORM',
                    'Database Migrations',
                    'Query Optimization',
                    'Connection Pooling'
                ]
            },
            {
                'name': 'Database Layer',
                'y': 0.5,
                'height': 1.5,
                'color': '#F3E5F5',
                'border': '#9C27B0',
                'components': [
                    'PostgreSQL Database',
                    'Indexes',
                    'Constraints',
                    'Triggers'
                ]
            }
        ]
        
        # Draw layers
        for layer in layers:
            # Layer box
            layer_box = FancyBboxPatch(
                (1, layer['y']),
                16, layer['height'],
                boxstyle="round,pad=0.1",
                facecolor=layer['color'],
                edgecolor=layer['border'],
                linewidth=2
            )
            ax.add_patch(layer_box)
            
            # Layer name
            ax.text(1.5, layer['y'] + layer['height'] - 0.3, layer['name'], 
                   fontsize=14, fontweight='bold')
            
            # Components
            comp_per_row = 4
            comp_width = 3.8
            comp_height = 0.4
            
            for i, component in enumerate(layer['components']):
                row = i // comp_per_row
                col = i % comp_per_row
                
                comp_x = 2 + (col * comp_width)
                comp_y = layer['y'] + layer['height'] - 0.8 - (row * 0.5)
                
                # Component box
                comp_box = FancyBboxPatch(
                    (comp_x, comp_y),
                    comp_width - 0.2, comp_height,
                    boxstyle="round,pad=0.05",
                    facecolor='white',
                    edgecolor=layer['border'],
                    linewidth=1,
                    alpha=0.8
                )
                ax.add_patch(comp_box)
                
                # Component text
                ax.text(comp_x + (comp_width - 0.2)/2, comp_y + comp_height/2, 
                       component, fontsize=10, ha='center', va='center')
        
        # Draw arrows between layers
        arrow_positions = [
            (9, 11, 9, 10),      # Presentation to API Gateway
            (9, 8.5, 9, 8),      # API Gateway to Business Logic
            (9, 5.5, 9, 4.5),    # Business Logic to Data Access
            (9, 2.5, 9, 2)       # Data Access to Database
        ]
        
        for x1, y1, x2, y2 in arrow_positions:
            ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                       arrowprops=dict(arrowstyle='<->', 
                                     color=self.colors['relationship'],
                                     lw=2))
        
        # Add external systems
        external_systems = [
            {'name': 'External Payment\nGateway (Simulated)', 'pos': (15.5, 6.5)},
            {'name': 'Email Service\n(Future)', 'pos': (2.5, 6.5)},
            {'name': 'Cloud Storage\n(Render)', 'pos': (15.5, 1.5)}
        ]
        
        for system in external_systems:
            x, y = system['pos']
            sys_box = FancyBboxPatch(
                (x - 0.8, y - 0.4),
                1.6, 0.8,
                boxstyle="round,pad=0.1",
                facecolor='#FFEBEE',
                edgecolor='#F44336',
                linewidth=2,
                linestyle='--'
            )
            ax.add_patch(sys_box)
            ax.text(x, y, system['name'], fontsize=9, ha='center', va='center')
        
        # Add deployment information
        deployment_info = FancyBboxPatch(
            (0.5, 0.2),
            17, 0.8,
            boxstyle="round,pad=0.1",
            facecolor='#E3F2FD',
            edgecolor='#1976D2',
            linewidth=1
        )
        ax.add_patch(deployment_info)
        
        ax.text(9, 0.6, 'Deployment: Render Cloud Platform | Database: PostgreSQL | CDN: Render Static', 
               fontsize=12, ha='center', va='center', fontweight='bold')
        
        # Add timestamp
        ax.text(17, 0.2, f'Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', 
               fontsize=8, ha='right', style='italic')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/pentagon_gym_system_architecture.png', 
                   dpi=300, bbox_inches='tight', facecolor='white')
        plt.savefig(f'{self.output_dir}/pentagon_gym_system_architecture.pdf', 
                   bbox_inches='tight', facecolor='white')
        print(f"System Architecture diagram saved to {self.output_dir}/pentagon_gym_system_architecture.png and .pdf")
        plt.show()
    
    def generate_class_diagram(self):
        """Generate UML Class Diagram for key classes"""
        fig, ax = plt.subplots(1, 1, figsize=(20, 16))
        ax.set_xlim(0, 20)
        ax.set_ylim(0, 16)
        ax.axis('off')
        
        # Title
        ax.text(10, 15.5, 'Pentagon Gymnastics - UML Class Diagram', 
                fontsize=18, fontweight='bold', ha='center')
        
        # Define classes
        classes = {
            'AuthController': {
                'pos': (3, 13),
                'type': 'controller',
                'attributes': [],
                'methods': [
                    '+ register(req, res): Response',
                    '+ login(req, res): Response',
                    '+ getProfile(req, res): Response',
                    '+ validateToken(token): boolean'
                ]
            },
            'ClassController': {
                'pos': (8, 13),
                'type': 'controller',
                'attributes': [],
                'methods': [
                    '+ getAllClasses(req, res): Response',
                    '+ getClassById(req, res): Response',
                    '+ createClass(req, res): Response',
                    '+ updateClass(req, res): Response'
                ]
            },
            'SubscriptionController': {
                'pos': (13, 13),
                'type': 'controller',
                'attributes': [],
                'methods': [
                    '+ createSubscription(req, res): Response',
                    '+ switchPackage(req, res): Response',
                    '+ getCurrentSubscription(req, res): Response',
                    '+ cancelSubscription(req, res): Response'
                ]
            },
            'User': {
                'pos': (3, 9),
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
                    '+ getFullName(): string'
                ]
            },
            'Class': {
                'pos': (8, 9),
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
                    '+ isBookable(): boolean'
                ]
            },
            'Subscription': {
                'pos': (13, 9),
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
                    '+ canBookClass(classId): boolean'
                ]
            },
            'AuthService': {
                'pos': (3, 5),
                'type': 'service',
                'attributes': [
                    '- jwtSecret: string'
                ],
                'methods': [
                    '+ generateToken(user): string',
                    '+ verifyToken(token): User',
                    '+ hashPassword(password): string',
                    '+ comparePassword(password, hash): boolean'
                ]
            },
            'SubscriptionService': {
                'pos': (8, 5),
                'type': 'service',
                'attributes': [],
                'methods': [
                    '+ createSubscription(userId, packageId): Subscription',
                    '+ switchPackage(userId, newPackageId): Subscription',
                    '+ calculateProration(subscription): number',
                    '+ validateEligibility(userId): boolean'
                ]
            },
            'PaymentService': {
                'pos': (13, 5),
                'type': 'service',
                'attributes': [
                    '- simulatedCards: SimulatedCard[]'
                ],
                'methods': [
                    '+ processPayment(amount, cardId): PaymentResult',
                    '+ validateCard(cardId): boolean',
                    '+ simulatePayment(paymentData): Promise<PaymentResult>'
                ]
            },
            'PrismaClient': {
                'pos': (8, 1),
                'type': 'dao',
                'attributes': [
                    '- connection: DatabaseConnection'
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
            class_type = class_data['type']
            attributes = class_data['attributes']
            methods = class_data['methods']
            
            colors = type_colors[class_type]
            
            # Calculate dimensions
            max_width = max(
                len(class_name) * 0.1,
                max([len(attr) * 0.08 for attr in attributes] + [0]),
                max([len(method) * 0.08 for method in methods] + [0])
            ) + 0.5
            
            height = 0.6 + (len(attributes) * 0.25) + (len(methods) * 0.25) + 0.4
            
            # Class box
            class_box = FancyBboxPatch(
                (x - max_width/2, y - height/2),
                max_width, height,
                boxstyle="round,pad=0.1",
                facecolor=colors['face'],
                edgecolor=colors['border'],
                linewidth=2
            )
            ax.add_patch(class_box)
            class_boxes[class_name] = (x, y, max_width, height)
            
            # Class name
            ax.text(x, y + height/2 - 0.2, class_name, 
                   fontsize=12, fontweight='bold', ha='center')
            
            # Stereotype
            stereotype = f"<<{class_type}>>"
            ax.text(x, y + height/2 - 0.4, stereotype, 
                   fontsize=9, style='italic', ha='center')
            
            # Separator line
            separator_y = y + height/2 - 0.5
            ax.plot([x - max_width/2 + 0.1, x + max_width/2 - 0.1], 
                   [separator_y, separator_y], 
                   color=colors['border'], linewidth=1)
            
            # Attributes
            current_y = separator_y - 0.2
            for attr in attributes:
                ax.text(x - max_width/2 + 0.1, current_y, attr, 
                       fontsize=9, ha='left', va='center')
                current_y -= 0.25
            
            # Methods separator
            if attributes and methods:
                ax.plot([x - max_width/2 + 0.1, x + max_width/2 - 0.1], 
                       [current_y + 0.1, current_y + 0.1], 
                       color=colors['border'], linewidth=1)
                current_y -= 0.1
            
            # Methods
            for method in methods:
                ax.text(x - max_width/2 + 0.1, current_y, method, 
                       fontsize=9, ha='left', va='center')
                current_y -= 0.25
        
        # Define relationships
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
                                             lw=1.5))
                
                # Add label
                mid_x = (start[0] + end[0]) / 2
                mid_y = (start[1] + end[1]) / 2
                ax.text(mid_x, mid_y + 0.1, label, 
                       fontsize=8, ha='center', va='center',
                       bbox=dict(boxstyle="round,pad=0.1", 
                               facecolor='white', alpha=0.8))
        
        # Add legend
        legend_x = 17
        legend_y = 12
        ax.text(legend_x, legend_y + 1, 'Stereotypes:', fontsize=12, fontweight='bold')
        
        stereotypes = [
            ('<<controller>>', type_colors['controller']),
            ('<<model>>', type_colors['model']),
            ('<<service>>', type_colors['service']),
            ('<<dao>>', type_colors['dao'])
        ]
        
        for i, (stereotype, colors) in enumerate(stereotypes):
            y_pos = legend_y + 0.6 - (i * 0.3)
            ax.add_patch(patches.Rectangle((legend_x, y_pos), 0.5, 0.2,
                                         facecolor=colors['face'], 
                                         edgecolor=colors['border']))
            ax.text(legend_x + 0.6, y_pos + 0.1, stereotype, 
                   fontsize=10, va='center')
        
        # Add timestamp
        ax.text(19, 0.5, f'Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', 
               fontsize=8, ha='right', style='italic')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/pentagon_gym_class_diagram.png', 
                   dpi=300, bbox_inches='tight', facecolor='white')
        plt.savefig(f'{self.output_dir}/pentagon_gym_class_diagram.pdf', 
                   bbox_inches='tight', facecolor='white')
        print(f"Class diagram saved to {self.output_dir}/pentagon_gym_class_diagram.png and .pdf")
        plt.show()
    
    def generate_all_diagrams(self):
        """Generate all diagrams"""
        print("Generating Pentagon Gymnastics System Diagrams for Dissertation...")
        print("=" * 60)
        
        print("\n1. Generating Entity Relationship Diagram (ERD)...")
        self.generate_erd_diagram()
        
        print("\n2. Generating System Architecture Diagram...")
        self.generate_system_architecture_uml()
        
        print("\n3. Generating UML Class Diagram...")
        self.generate_class_diagram()
        
        print("\n" + "=" * 60)
        print("All diagrams generated successfully!")
        print(f"Diagrams saved in: {self.output_dir}/")
        print("Files generated:")
        print("- pentagon_gym_erd.png/pdf")
        print("- pentagon_gym_system_architecture.png/pdf")
        print("- pentagon_gym_class_diagram.png/pdf")
        print("\nThese diagrams are ready for inclusion in your dissertation.")

def main():
    """Main function to run the diagram generator"""
    generator = DiagramGenerator()
    generator.generate_all_diagrams()

if __name__ == "__main__":
    main()
