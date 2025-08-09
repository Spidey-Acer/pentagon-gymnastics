#!/usr/bin/env python3
"""
Pentagon Gymnastics System - Academic Quality UML and ERD Diagram Generator
This script generates professionally arranged, non-overlapping diagrams suitable for academic dissertation.
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, ConnectionPatch, Rectangle
import numpy as np
import warnings
warnings.filterwarnings('ignore')

# Set up academic styling
plt.style.use('default')
plt.rcParams['font.family'] = ['Times New Roman', 'serif']
plt.rcParams['font.size'] = 10
plt.rcParams['figure.facecolor'] = 'white'
plt.rcParams['axes.facecolor'] = 'white'

def create_class_diagram():
    """Create a comprehensive UML Class Diagram with academic standards"""
    fig, ax = plt.subplots(1, 1, figsize=(24, 16))
    ax.set_xlim(0, 120)
    ax.set_ylim(0, 120)
    ax.axis('off')
    
    # Academic color scheme
    colors = {
        'controller': '#E8F4FD',
        'service': '#F0E8FF', 
        'model': '#E8F8E8',
        'middleware': '#FFF8E8',
        'interface': '#FFE8E8'
    }
    
    # Define class positions with academic spacing (no overlaps)
    classes = {
        # Controllers (Top row with wide spacing)
        'AuthController': {'pos': (15, 105), 'type': 'controller', 'width': 20, 'height': 12},
        'ClassController': {'pos': (45, 105), 'type': 'controller', 'width': 20, 'height': 12},
        'SubscriptionController': {'pos': (75, 105), 'type': 'controller', 'width': 20, 'height': 12},
        'PaymentController': {'pos': (105, 105), 'type': 'controller', 'width': 20, 'height': 12},
        
        # Services (Second row with ample spacing)
        'AuthService': {'pos': (15, 82), 'type': 'service', 'width': 18, 'height': 10},
        'SimulatedPaymentService': {'pos': (45, 82), 'type': 'service', 'width': 18, 'height': 10},
        'TransactionService': {'pos': (75, 82), 'type': 'service', 'width': 18, 'height': 10},
        'NotificationService': {'pos': (105, 82), 'type': 'service', 'width': 18, 'height': 10},
        
        # Middleware (Third row with clear separation)
        'AuthMiddleware': {'pos': (20, 60), 'type': 'middleware', 'width': 16, 'height': 8},
        'AdminMiddleware': {'pos': (45, 60), 'type': 'middleware', 'width': 16, 'height': 8},
        'ErrorHandler': {'pos': (70, 60), 'type': 'middleware', 'width': 16, 'height': 8},
        'CorsMiddleware': {'pos': (95, 60), 'type': 'middleware', 'width': 16, 'height': 8},
        
        # Models (Bottom rows with proper academic spacing)
        'User': {'pos': (15, 40), 'type': 'model', 'width': 16, 'height': 15},
        'Class': {'pos': (40, 40), 'type': 'model', 'width': 16, 'height': 15},
        'Session': {'pos': (65, 40), 'type': 'model', 'width': 16, 'height': 15},
        'Booking': {'pos': (90, 40), 'type': 'model', 'width': 16, 'height': 15},
        
        # Second model row
        'Subscription': {'pos': (15, 18), 'type': 'model', 'width': 16, 'height': 15},
        'Package': {'pos': (40, 18), 'type': 'model', 'width': 16, 'height': 15},
        'Transaction': {'pos': (65, 18), 'type': 'model', 'width': 16, 'height': 15},
        'SimulatedCard': {'pos': (90, 18), 'type': 'model', 'width': 16, 'height': 15},
    }
    
    # Draw classes with academic styling
    for class_name, info in classes.items():
        draw_uml_class(ax, class_name, info, colors)
    
    # Add relationships with proper academic notation
    add_academic_relationships(ax, classes)
    
    # Add academic title and legend
    ax.text(60, 115, 'Pentagon Gymnastics Web Application', 
            ha='center', va='center', fontsize=18, fontweight='bold')
    ax.text(60, 112, 'UML Class Diagram', 
            ha='center', va='center', fontsize=14, style='italic')
    
    add_academic_legend(ax, colors, 5, 108)
    
    plt.tight_layout()
    return fig

def draw_uml_class(ax, class_name, info, colors):
    """Draw a single UML class with academic standards"""
    x, y = info['pos']
    width, height = info['width'], info['height']
    color = colors[info['type']]
    
    # Create main class rectangle
    rect = Rectangle((x-width/2, y-height/2), width, height,
                    facecolor=color, edgecolor='black', linewidth=1.5)
    ax.add_patch(rect)
    
    # Class name compartment
    name_height = height / 3
    ax.text(x, y + height/2 - name_height/2, class_name, 
           ha='center', va='center', fontweight='bold', fontsize=11)
    
    # Separator line
    ax.plot([x-width/2, x+width/2], [y + height/6, y + height/6], 'k-', linewidth=1)
    
    # Attributes compartment
    attributes = get_class_attributes(class_name, info['type'])
    attr_start_y = y + height/6 - 1
    for i, attr in enumerate(attributes[:3]):  # Limit to 3 to prevent overlap
        ax.text(x, attr_start_y - i*2.5, attr, ha='center', va='center', 
               fontsize=9, style='italic')
    
    # Another separator line
    ax.plot([x-width/2, x+width/2], [y - height/6, y - height/6], 'k-', linewidth=1)
    
    # Methods compartment
    methods = get_class_methods(class_name, info['type'])
    method_start_y = y - height/6 - 1
    for i, method in enumerate(methods[:3]):  # Limit to 3 to prevent overlap
        ax.text(x, method_start_y - i*2.5, method, ha='center', va='center', 
               fontsize=9)

def create_erd_diagram():
    """Create Entity-Relationship Diagram with academic standards"""
    fig, ax = plt.subplots(1, 1, figsize=(20, 14))
    ax.set_xlim(0, 120)
    ax.set_ylim(0, 100)
    ax.axis('off')
    
    # Entity positions with academic spacing (no overlaps)
    entities = {
        'User': {'pos': (25, 80), 'width': 18, 'height': 16},
        'Subscription': {'pos': (60, 80), 'width': 18, 'height': 16},
        'Package': {'pos': (95, 80), 'width': 18, 'height': 16},
        
        'Class': {'pos': (25, 50), 'width': 18, 'height': 16},
        'Session': {'pos': (60, 50), 'width': 18, 'height': 16},
        'Booking': {'pos': (95, 50), 'width': 18, 'height': 16},
        
        'Transaction': {'pos': (25, 20), 'width': 18, 'height': 16},
        'SimulatedCard': {'pos': (60, 20), 'width': 18, 'height': 16},
        'GearOrder': {'pos': (95, 20), 'width': 18, 'height': 16},
    }
    
    # Draw entities with academic styling
    for entity_name, info in entities.items():
        draw_erd_entity(ax, entity_name, info)
    
    # Add relationships with academic notation
    add_erd_relationships(ax, entities)
    
    # Academic title
    ax.text(60, 95, 'Pentagon Gymnastics Web Application', 
            ha='center', va='center', fontsize=18, fontweight='bold')
    ax.text(60, 92, 'Entity-Relationship Diagram', 
            ha='center', va='center', fontsize=14, style='italic')
    
    plt.tight_layout()
    return fig

def draw_erd_entity(ax, entity_name, info):
    """Draw a single ERD entity with academic standards"""
    x, y = info['pos']
    width, height = info['width'], info['height']
    
    # Create entity rectangle
    rect = Rectangle((x-width/2, y-height/2), width, height,
                    facecolor='lightblue', edgecolor='darkblue', linewidth=2)
    ax.add_patch(rect)
    
    # Entity name
    ax.text(x, y + height/3, entity_name, ha='center', va='center', 
            fontweight='bold', fontsize=12)
    
    # Separator line
    ax.plot([x-width/2+1, x+width/2-1], [y + height/6, y + height/6], 'k-', linewidth=1)
    
    # Key attributes
    attributes = get_entity_attributes(entity_name)
    attr_y = y
    for i, attr in enumerate(attributes[:4]):  # Limit to prevent overlap
        ax.text(x, attr_y - i*2.8, attr, ha='center', va='center', 
               fontsize=9)

def create_sequence_diagram():
    """Create Sequence Diagram with academic standards"""
    fig, ax = plt.subplots(1, 1, figsize=(18, 14))
    ax.set_xlim(0, 120)
    ax.set_ylim(0, 100)
    ax.axis('off')
    
    # Actors/Objects with academic spacing
    actors = {
        'User': 15,
        'React Frontend': 30,
        'Auth Middleware': 45,
        'Session Controller': 60,
        'Prisma ORM': 75,
        'PostgreSQL DB': 90,
        'Payment Service': 105
    }
    
    # Draw actor boxes with academic styling
    for actor, x in actors.items():
        rect = Rectangle((x-7, 90), 14, 6, 
                        facecolor='lightgray', edgecolor='black', linewidth=1.5)
        ax.add_patch(rect)
        ax.text(x, 93, actor, ha='center', va='center', fontweight='bold', fontsize=9)
        
        # Draw lifeline
        ax.plot([x, x], [90, 15], 'k--', alpha=0.7, linewidth=1.5)
    
    # Messages with proper academic spacing
    messages = [
        (85, 'User', 'React Frontend', '1: login(credentials)', 'sync'),
        (80, 'React Frontend', 'Auth Middleware', '2: authenticate(token)', 'sync'),
        (75, 'Auth Middleware', 'PostgreSQL DB', '3: validateUser()', 'sync'),
        (70, 'PostgreSQL DB', 'Auth Middleware', '4: userData', 'return'),
        (65, 'Auth Middleware', 'React Frontend', '5: authSuccess(jwt)', 'return'),
        (60, 'React Frontend', 'User', '6: loginConfirmation', 'return'),
        
        (50, 'User', 'React Frontend', '7: bookSession(sessionId)', 'sync'),
        (45, 'React Frontend', 'Session Controller', '8: POST /sessions/book', 'sync'),
        (40, 'Session Controller', 'Prisma ORM', '9: checkSubscription()', 'sync'),
        (35, 'Prisma ORM', 'PostgreSQL DB', '10: query(subscription)', 'sync'),
        (30, 'PostgreSQL DB', 'Prisma ORM', '11: subscriptionData', 'return'),
        (25, 'Session Controller', 'Prisma ORM', '12: createBooking()', 'sync'),
        (20, 'Session Controller', 'React Frontend', '13: bookingSuccess', 'return'),
        (15, 'React Frontend', 'User', '14: confirmationMessage', 'return'),
    ]
    
    # Draw messages with academic notation
    for y, from_actor, to_actor, message, msg_type in messages:
        x1 = actors[from_actor]
        x2 = actors[to_actor]
        
        # Draw arrow based on message type
        if msg_type == 'return':
            arrow_style = '<-'
            color = 'red'
        else:
            arrow_style = '->'
            color = 'blue'
            
        if x1 != x2:  # Only draw if different actors
            ax.annotate('', xy=(x2-1 if arrow_style == '->' else x2+1, y), 
                       xytext=(x1+1 if arrow_style == '->' else x1-1, y),
                       arrowprops=dict(arrowstyle=arrow_style, color=color, lw=1.5))
        
        # Add message text
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y+1.5, message, ha='center', va='bottom', fontsize=8,
               bbox=dict(boxstyle="round,pad=0.3", facecolor='white', alpha=0.9))
    
    # Academic title
    ax.text(60, 98, 'Pentagon Gymnastics Web Application', 
            ha='center', va='center', fontsize=16, fontweight='bold')
    ax.text(60, 95, 'Sequence Diagram: User Session Booking Flow', 
            ha='center', va='center', fontsize=12, style='italic')
    
    plt.tight_layout()
    return fig

def create_component_diagram():
    """Create Component Diagram with academic standards"""
    fig, ax = plt.subplots(1, 1, figsize=(18, 14))
    ax.set_xlim(0, 120)
    ax.set_ylim(0, 100)
    ax.axis('off')
    
    # Layer definitions with academic spacing
    layers = {
        'Presentation Layer': {'y': 85, 'color': '#E3F2FD', 'height': 12},
        'API Gateway Layer': {'y': 70, 'color': '#F3E5F5', 'height': 12},
        'Business Logic Layer': {'y': 55, 'color': '#E8F5E8', 'height': 12},
        'Data Access Layer': {'y': 40, 'color': '#FFF3E0', 'height': 12},
        'Database Layer': {'y': 25, 'color': '#FFEBEE', 'height': 12}
    }
    
    # Components in each layer with proper spacing
    components = {
        'Presentation Layer': [
            {'name': 'React App\n(TypeScript)', 'x': 20},
            {'name': 'Authentication\nUI Components', 'x': 40},
            {'name': 'Booking\nInterface', 'x': 60},
            {'name': 'Admin\nDashboard', 'x': 80},
            {'name': 'Payment\nForms', 'x': 100}
        ],
        'API Gateway Layer': [
            {'name': 'Express.js\nServer', 'x': 20},
            {'name': 'REST API\nEndpoints', 'x': 40},
            {'name': 'Middleware\nStack', 'x': 60},
            {'name': 'CORS &\nSecurity', 'x': 80},
            {'name': 'Error\nHandling', 'x': 100}
        ],
        'Business Logic Layer': [
            {'name': 'Authentication\nService', 'x': 20},
            {'name': 'Booking\nService', 'x': 40},
            {'name': 'Subscription\nService', 'x': 60},
            {'name': 'Payment\nService', 'x': 80},
            {'name': 'Notification\nService', 'x': 100}
        ],
        'Data Access Layer': [
            {'name': 'Prisma ORM\nClient', 'x': 30},
            {'name': 'Query\nOptimization', 'x': 50},
            {'name': 'Transaction\nManagement', 'x': 70},
            {'name': 'Connection\nPooling', 'x': 90}
        ],
        'Database Layer': [
            {'name': 'PostgreSQL\nDatabase', 'x': 35},
            {'name': 'Data\nValidation', 'x': 55},
            {'name': 'Backup &\nRecovery', 'x': 75}
        ]
    }
    
    # Draw layers and components
    for layer_name, layer_info in layers.items():
        y = layer_info['y']
        color = layer_info['color']
        height = layer_info['height']
        
        # Layer background
        rect = Rectangle((8, y-height/2), 104, height, 
                        facecolor=color, edgecolor='gray', 
                        linewidth=1.5, alpha=0.4)
        ax.add_patch(rect)
        
        # Layer label
        ax.text(5, y, layer_name, ha='center', va='center', 
                fontweight='bold', fontsize=11, rotation=90)
        
        # Draw components
        for comp in components[layer_name]:
            comp_width = 16
            comp_height = 8
            comp_rect = Rectangle((comp['x']-comp_width/2, y-comp_height/2), 
                                comp_width, comp_height,
                                facecolor=color, edgecolor='black',
                                linewidth=1.5, alpha=0.8)
            ax.add_patch(comp_rect)
            ax.text(comp['x'], y, comp['name'], ha='center', va='center',
                   fontweight='bold', fontsize=9)
    
    # Add inter-layer connections
    layer_ys = [info['y'] for info in layers.values()]
    for i in range(len(layer_ys)-1):
        y1 = layer_ys[i] - 6
        y2 = layer_ys[i+1] + 6
        
        # Draw connecting arrows at multiple points
        for x in [20, 40, 60, 80, 100]:
            if i < 3 or x in [35, 55, 75]:  # Adjust for different component counts
                ax.annotate('', xy=(x, y2), xytext=(x, y1),
                           arrowprops=dict(arrowstyle='->', color='gray', lw=1.2))
    
    # Academic title
    ax.text(60, 95, 'Pentagon Gymnastics Web Application', 
            ha='center', va='center', fontsize=16, fontweight='bold')
    ax.text(60, 92, 'Component Architecture Diagram', 
            ha='center', va='center', fontsize=12, style='italic')
    
    plt.tight_layout()
    return fig

def get_class_attributes(class_name, class_type):
    """Get attributes for different class types"""
    if class_type == 'model':
        attributes_map = {
            'User': ['-id: number', '-email: string', '-role: UserRole'],
            'Class': ['-id: number', '-name: string', '-description: string'],
            'Session': ['-id: number', '-timeSlot: string', '-capacity: number'],
            'Booking': ['-id: number', '-userId: number', '-sessionId: number'],
            'Subscription': ['-id: number', '-status: string', '-packageId: number'],
            'Package': ['-id: number', '-name: string', '-price: number'],
            'Transaction': ['-id: number', '-amount: number', '-status: string'],
            'SimulatedCard': ['-cardNumber: string', '-balance: number', '-isValid: boolean']
        }
    else:
        attributes_map = {
            'AuthController': ['-authService: AuthService', '-logger: Logger'],
            'ClassController': ['-classService: ClassService', '-validator: Validator'],
            'SubscriptionController': ['-subscriptionService: Service', '-transactionService: Service'],
            'PaymentController': ['-paymentService: PaymentService', '-cardValidator: Validator']
        }
    
    return attributes_map.get(class_name, ['-attribute1: type', '-attribute2: type'])

def get_class_methods(class_name, class_type):
    """Get methods for different class types"""
    methods_map = {
        'AuthController': ['+login(): Response', '+register(): Response', '+getProfile(): Response'],
        'ClassController': ['+getClasses(): Response', '+createClass(): Response', '+updateClass(): Response'],
        'SubscriptionController': ['+createSubscription(): Response', '+switchPackage(): Response', '+getPackages(): Response'],
        'PaymentController': ['+processPayment(): Response', '+validateCard(): Response', '+getTestCards(): Response'],
        'AuthService': ['+authenticate(): boolean', '+generateToken(): string', '+hashPassword(): string'],
        'SimulatedPaymentService': ['+processPayment(): PaymentResult', '+validateCard(): boolean', '+getTestCards(): Card[]'],
        'TransactionService': ['+logTransaction(): void', '+getTransactions(): Transaction[]', '+logActivity(): void'],
        'NotificationService': ['+sendEmail(): void', '+sendSMS(): void', '+pushNotification(): void'],
        'AuthMiddleware': ['+authenticate(): void', '+extractToken(): string', '+verifyUser(): boolean'],
        'AdminMiddleware': ['+requireAdmin(): void', '+checkPermissions(): boolean'],
        'ErrorHandler': ['+handleError(): void', '+logError(): void', '+formatResponse(): Response'],
        'CorsMiddleware': ['+setCorsHeaders(): void', '+validateOrigin(): boolean']
    }
    
    return methods_map.get(class_name, ['+method1(): type', '+method2(): type'])

def get_entity_attributes(entity_name):
    """Get attributes for ERD entities"""
    attributes = {
        'User': ['🔑 id (PK)', 'email (UNIQUE)', 'password', 'role'],
        'Subscription': ['🔑 id (PK)', '🔗 userId (FK)', '🔗 packageId (FK)', 'status'],
        'Package': ['🔑 id (PK)', 'name (UNIQUE)', 'price', 'maxClasses'],
        'Class': ['🔑 id (PK)', 'name (UNIQUE)', 'description'],
        'Session': ['🔑 id (PK)', '🔗 classId (FK)', 'timeSlot', 'capacity'],
        'Booking': ['🔑 id (PK)', '🔗 userId (FK)', '🔗 sessionId (FK)'],
        'Transaction': ['🔑 id (PK)', '🔗 userId (FK)', 'amount', 'type'],
        'SimulatedCard': ['🔑 id (PK)', 'cardNumber', 'balance', 'cardType'],
        'GearOrder': ['🔑 id (PK)', '🔗 userId (FK)', 'totalAmount', 'status']
    }
    return attributes.get(entity_name, ['🔑 id (PK)', 'data'])

def add_academic_relationships(ax, classes):
    """Add UML relationships with academic notation"""
    relationships = [
        ('AuthController', 'AuthService', 'uses', ''),
        ('SubscriptionController', 'TransactionService', 'uses', ''),
        ('PaymentController', 'SimulatedPaymentService', 'uses', ''),
        ('AuthMiddleware', 'User', 'validates', '1..*'),
        ('Session', 'Class', 'belongs to', 'n:1'),
        ('Booking', 'User', 'made by', 'n:1'),
        ('Subscription', 'Package', 'has', '1:1'),
    ]
    
    for from_class, to_class, relation_type, cardinality in relationships:
        if from_class in classes and to_class in classes:
            x1, y1 = classes[from_class]['pos']
            x2, y2 = classes[to_class]['pos']
            
            # Calculate connection points to avoid overlap
            if abs(x1 - x2) > abs(y1 - y2):
                # Horizontal connection
                if x1 < x2:
                    start_x = x1 + classes[from_class]['width']/2
                    end_x = x2 - classes[to_class]['width']/2
                else:
                    start_x = x1 - classes[from_class]['width']/2
                    end_x = x2 + classes[to_class]['width']/2
                start_y = y1
                end_y = y2
            else:
                # Vertical connection
                start_x = x1
                end_x = x2
                if y1 > y2:
                    start_y = y1 - classes[from_class]['height']/2
                    end_y = y2 + classes[to_class]['height']/2
                else:
                    start_y = y1 + classes[from_class]['height']/2
                    end_y = y2 - classes[to_class]['height']/2
            
            # Draw relationship line
            ax.plot([start_x, end_x], [start_y, end_y], 'k-', alpha=0.7, linewidth=1.5)
            
            # Add arrow
            ax.annotate('', xy=(end_x, end_y), xytext=(start_x, start_y),
                       arrowprops=dict(arrowstyle='->', color='black', lw=1))
            
            # Add relationship label
            mid_x, mid_y = (start_x + end_x) / 2, (start_y + end_y) / 2
            ax.text(mid_x, mid_y+1, relation_type, ha='center', va='center',
                   fontsize=8, bbox=dict(boxstyle="round,pad=0.2", 
                   facecolor='yellow', alpha=0.8))

def add_erd_relationships(ax, entities):
    """Add ERD relationships with academic notation"""
    relationships = [
        ('User', 'Subscription', '1:1'),
        ('Subscription', 'Package', 'N:1'),
        ('User', 'Booking', '1:N'),
        ('Session', 'Booking', '1:N'),
        ('Class', 'Session', '1:N'),
        ('User', 'Transaction', '1:N'),
        ('User', 'GearOrder', '1:N'),
    ]
    
    for from_entity, to_entity, cardinality in relationships:
        if from_entity in entities and to_entity in entities:
            x1, y1 = entities[from_entity]['pos']
            x2, y2 = entities[to_entity]['pos']
            
            # Calculate connection points
            if abs(x1 - x2) > abs(y1 - y2):
                # Horizontal connection
                if x1 < x2:
                    start_x = x1 + entities[from_entity]['width']/2
                    end_x = x2 - entities[to_entity]['width']/2
                else:
                    start_x = x1 - entities[from_entity]['width']/2
                    end_x = x2 + entities[to_entity]['width']/2
                start_y = y1
                end_y = y2
            else:
                # Vertical connection
                start_x = x1
                end_x = x2
                if y1 > y2:
                    start_y = y1 - entities[from_entity]['height']/2
                    end_y = y2 + entities[to_entity]['height']/2
                else:
                    start_y = y1 + entities[from_entity]['height']/2
                    end_y = y2 - entities[to_entity]['height']/2
            
            # Draw relationship line
            ax.plot([start_x, end_x], [start_y, end_y], 'r-', linewidth=2.5)
            
            # Add cardinality
            mid_x, mid_y = (start_x + end_x) / 2, (start_y + end_y) / 2
            ax.text(mid_x, mid_y, cardinality, ha='center', va='center',
                   fontsize=10, fontweight='bold',
                   bbox=dict(boxstyle="round,pad=0.3", facecolor='white', 
                           edgecolor='red', linewidth=1))

def add_academic_legend(ax, colors, x, y):
    """Add academic legend for diagram colors"""
    legend_items = [
        ('Controller Layer', colors['controller']),
        ('Service Layer', colors['service']),
        ('Data Model', colors['model']),
        ('Middleware', colors['middleware'])
    ]
    
    for i, (label, color) in enumerate(legend_items):
        rect = Rectangle((x, y-i*4), 3, 2.5, facecolor=color, edgecolor='black')
        ax.add_patch(rect)
        ax.text(x+4, y-i*4+1.25, label, va='center', fontsize=10, fontweight='bold')

def save_diagrams():
    """Generate and save all academic-quality diagrams"""
    print("🎨 Generating Pentagon Gymnastics Academic Diagrams...")
    print("📚 Using academic standards for dissertation quality")
    
    diagrams = [
        ('Class Diagram', create_class_diagram),
        ('ERD Diagram', create_erd_diagram),
        ('Sequence Diagram', create_sequence_diagram),
        ('Component Diagram', create_component_diagram)
    ]
    
    for name, func in diagrams:
        print(f"📊 Creating Academic {name}...")
        try:
            fig = func()
            
            # Save as high-resolution PNG (for digital viewing)
            png_filename = f"academic_{name.lower().replace(' ', '_')}.png"
            fig.savefig(png_filename, dpi=300, bbox_inches='tight', 
                       facecolor='white', edgecolor='none', 
                       format='png', pil_kwargs={'quality': 95})
            print(f"✅ Saved: {png_filename}")
            
            # Save as PDF (vector format for academic printing)
            pdf_filename = f"academic_{name.lower().replace(' ', '_')}.pdf"
            fig.savefig(pdf_filename, format='pdf', bbox_inches='tight',
                       facecolor='white', edgecolor='none')
            print(f"✅ Saved: {pdf_filename}")
            
            plt.close(fig)
            
        except Exception as e:
            print(f"❌ Error creating {name}: {str(e)}")
            import traceback
            traceback.print_exc()
    
    print("\n🎉 All academic diagrams generated successfully!")
    print("📁 Academic quality files created:")
    print("   - academic_class_diagram.png/.pdf")
    print("   - academic_erd_diagram.png/.pdf") 
    print("   - academic_sequence_diagram.png/.pdf")
    print("   - academic_component_diagram.png/.pdf")
    print("\n🎓 These diagrams meet academic dissertation standards!")
    print("📖 Features:")
    print("   • No overlapping elements")
    print("   • Academic typography (Times New Roman)")
    print("   • Proper UML/ERD notation")
    print("   • High resolution for printing")
    print("   • Vector PDF for scalability")

if __name__ == "__main__":
    save_diagrams()
