#!/usr/bin/env python3
"""
Fixed Pentagon Gymnastics System - UML and ERD Diagram Generator
This script generates well-arranged, non-overlapping professional diagrams for the dissertation.
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, ConnectionPatch
import numpy as np
import warnings
warnings.filterwarnings('ignore')

# Set up professional styling
plt.style.use('default')
plt.rcParams['font.family'] = 'Arial'
plt.rcParams['font.size'] = 9
plt.rcParams['figure.facecolor'] = 'white'

def create_class_diagram():
    """Create a comprehensive UML Class Diagram with proper spacing"""
    fig, ax = plt.subplots(1, 1, figsize=(20, 14))
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    
    # Color scheme for different components
    colors = {
        'controller': '#E3F2FD',
        'service': '#F3E5F5',
        'model': '#E8F5E8',
        'middleware': '#FFF3E0',
        'interface': '#FFEBEE'
    }
    
    # Define class positions with better spacing
    classes = {
        # Controllers (Top row)
        'AuthController': {'pos': (8, 85), 'type': 'controller', 'width': 18, 'height': 12},
        'ClassController': {'pos': (30, 85), 'type': 'controller', 'width': 18, 'height': 12},
        'SubscriptionController': {'pos': (52, 85), 'type': 'controller', 'width': 18, 'height': 12},
        'PaymentController': {'pos': (74, 85), 'type': 'controller', 'width': 18, 'height': 12},
        
        # Services (Second row)
        'AuthService': {'pos': (8, 65), 'type': 'service', 'width': 18, 'height': 10},
        'SimulatedPaymentService': {'pos': (30, 65), 'type': 'service', 'width': 18, 'height': 10},
        'TransactionService': {'pos': (52, 65), 'type': 'service', 'width': 18, 'height': 10},
        'NotificationService': {'pos': (74, 65), 'type': 'service', 'width': 18, 'height': 10},
        
        # Middleware (Third row)
        'AuthMiddleware': {'pos': (15, 45), 'type': 'middleware', 'width': 16, 'height': 8},
        'AdminMiddleware': {'pos': (35, 45), 'type': 'middleware', 'width': 16, 'height': 8},
        'ErrorHandler': {'pos': (55, 45), 'type': 'middleware', 'width': 16, 'height': 8},
        'CorsMiddleware': {'pos': (75, 45), 'type': 'middleware', 'width': 16, 'height': 8},
        
        # Models (Bottom two rows)
        'User': {'pos': (8, 28), 'type': 'model', 'width': 16, 'height': 14},
        'Class': {'pos': (28, 28), 'type': 'model', 'width': 16, 'height': 14},
        'Session': {'pos': (48, 28), 'type': 'model', 'width': 16, 'height': 14},
        'Booking': {'pos': (68, 28), 'type': 'model', 'width': 16, 'height': 14},
        'Subscription': {'pos': (8, 8), 'type': 'model', 'width': 16, 'height': 14},
        'Package': {'pos': (28, 8), 'type': 'model', 'width': 16, 'height': 14},
        'Transaction': {'pos': (48, 8), 'type': 'model', 'width': 16, 'height': 14},
        'SimulatedCard': {'pos': (68, 8), 'type': 'model', 'width': 16, 'height': 14},
    }
    
    # Draw classes
    for class_name, info in classes.items():
        x, y = info['pos']
        width, height = info['width'], info['height']
        color = colors[info['type']]
        
        # Create rounded rectangle
        rect = FancyBboxPatch(
            (x-width/2, y-height/2), width, height,
            boxstyle="round,pad=0.5",
            facecolor=color,
            edgecolor='black',
            linewidth=1.5
        )
        ax.add_patch(rect)
        
        # Add class name
        ax.text(x, y+height/3, class_name, ha='center', va='center', 
                fontweight='bold', fontsize=10)
        
        # Add methods based on class type
        if info['type'] == 'controller':
            methods = get_controller_methods(class_name)
        elif info['type'] == 'service':
            methods = get_service_methods(class_name)
        elif info['type'] == 'model':
            methods = get_model_attributes(class_name)
        else:
            methods = get_middleware_methods(class_name)
        
        # Add methods/attributes
        method_y = y - 1
        for method in methods[:4]:  # Limit to 4 to prevent overcrowding
            ax.text(x, method_y, method, ha='center', va='center', 
                   fontsize=8, style='italic')
            method_y -= 2.5
    
    # Add relationships with proper spacing
    add_class_relationships(ax, classes)
    
    # Add title and legend
    ax.text(50, 95, 'Pentagon Gymnastics - UML Class Diagram', 
            ha='center', va='center', fontsize=16, fontweight='bold')
    
    add_legend(ax, colors, 5, 95)
    
    plt.tight_layout()
    return fig

def create_erd_diagram():
    """Create Entity-Relationship Diagram with optimized layout"""
    fig, ax = plt.subplots(1, 1, figsize=(18, 12))
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    
    # Entity positions with strategic spacing
    entities = {
        'User': {'pos': (20, 80), 'width': 16, 'height': 16},
        'Subscription': {'pos': (50, 80), 'width': 16, 'height': 16},
        'Package': {'pos': (80, 80), 'width': 16, 'height': 16},
        'Class': {'pos': (20, 50), 'width': 16, 'height': 16},
        'Session': {'pos': (50, 50), 'width': 16, 'height': 16},
        'Booking': {'pos': (80, 50), 'width': 16, 'height': 16},
        'Transaction': {'pos': (20, 20), 'width': 16, 'height': 16},
        'SimulatedCard': {'pos': (50, 20), 'width': 16, 'height': 16},
        'GearOrder': {'pos': (80, 20), 'width': 16, 'height': 16},
    }
    
    # Draw entities
    for entity_name, info in entities.items():
        x, y = info['pos']
        width, height = info['width'], info['height']
        
        # Create entity rectangle
        rect = patches.Rectangle(
            (x-width/2, y-height/2), width, height,
            facecolor='lightblue',
            edgecolor='darkblue',
            linewidth=2
        )
        ax.add_patch(rect)
        
        # Add entity name
        ax.text(x, y+height/3, entity_name, ha='center', va='center', 
                fontweight='bold', fontsize=11)
        
        # Add key attributes
        attributes = get_entity_attributes(entity_name)
        attr_y = y - 1
        for attr in attributes[:4]:  # Limit attributes to prevent overlap
            ax.text(x, attr_y, attr, ha='center', va='center', 
                   fontsize=8)
            attr_y -= 2.5
    
    # Add relationships
    add_erd_relationships(ax, entities)
    
    # Title
    ax.text(50, 95, 'Pentagon Gymnastics - Entity Relationship Diagram', 
            ha='center', va='center', fontsize=16, fontweight='bold')
    
    plt.tight_layout()
    return fig

def create_sequence_diagram():
    """Create Sequence Diagram for user booking flow"""
    fig, ax = plt.subplots(1, 1, figsize=(16, 12))
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    
    # Actors/Objects with wider spacing
    actors = {
        'User': 10,
        'Frontend': 25,
        'AuthMiddleware': 40,
        'SessionController': 55,
        'Database': 70,
        'PaymentService': 85
    }
    
    # Draw actor boxes
    for actor, x in actors.items():
        rect = patches.Rectangle((x-5, 90), 10, 6, 
                               facecolor='lightgray', edgecolor='black')
        ax.add_patch(rect)
        ax.text(x, 93, actor, ha='center', va='center', fontweight='bold', fontsize=9)
        
        # Draw lifeline
        ax.plot([x, x], [90, 10], 'k--', alpha=0.5)
    
    # Messages with proper Y spacing
    messages = [
        (85, 'User', 'Frontend', 'Login Request'),
        (80, 'Frontend', 'AuthMiddleware', 'Authenticate'),
        (75, 'AuthMiddleware', 'Database', 'Verify Credentials'),
        (70, 'Database', 'AuthMiddleware', 'User Data'),
        (65, 'AuthMiddleware', 'Frontend', 'JWT Token'),
        (60, 'Frontend', 'User', 'Login Success'),
        (50, 'User', 'Frontend', 'Book Session'),
        (45, 'Frontend', 'SessionController', 'POST /sessions/book'),
        (40, 'SessionController', 'Database', 'Check Subscription'),
        (35, 'Database', 'SessionController', 'Subscription Valid'),
        (30, 'SessionController', 'Database', 'Create Booking'),
        (25, 'Database', 'SessionController', 'Booking Created'),
        (20, 'SessionController', 'Frontend', 'Booking Confirmation'),
        (15, 'Frontend', 'User', 'Success Message'),
    ]
    
    # Draw messages
    for y, from_actor, to_actor, message in messages:
        x1 = actors[from_actor]
        x2 = actors[to_actor]
        
        # Draw arrow
        if x1 < x2:
            ax.annotate('', xy=(x2-1, y), xytext=(x1+1, y),
                       arrowprops=dict(arrowstyle='->', color='blue', lw=1.5))
        else:
            ax.annotate('', xy=(x2+1, y), xytext=(x1-1, y),
                       arrowprops=dict(arrowstyle='->', color='blue', lw=1.5))
        
        # Add message text
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y+1, message, ha='center', va='bottom', fontsize=8,
               bbox=dict(boxstyle="round,pad=0.2", facecolor='white', alpha=0.8))
    
    # Title
    ax.text(50, 98, 'Sequence Diagram - User Session Booking Flow', 
            ha='center', va='center', fontsize=14, fontweight='bold')
    
    plt.tight_layout()
    return fig

def create_component_diagram():
    """Create Component Diagram showing system architecture"""
    fig, ax = plt.subplots(1, 1, figsize=(16, 12))
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    
    # Component layers with proper spacing
    layers = {
        'Presentation': {'y': 85, 'color': '#E3F2FD'},
        'API': {'y': 65, 'color': '#F3E5F5'},
        'Business': {'y': 45, 'color': '#E8F5E8'},
        'Data': {'y': 25, 'color': '#FFF3E0'}
    }
    
    # Components in each layer
    components = {
        'Presentation': [
            {'name': 'React App', 'x': 20},
            {'name': 'Authentication UI', 'x': 40},
            {'name': 'Booking Interface', 'x': 60},
            {'name': 'Admin Dashboard', 'x': 80}
        ],
        'API': [
            {'name': 'Express Server', 'x': 20},
            {'name': 'REST Endpoints', 'x': 40},
            {'name': 'Middleware Stack', 'x': 60},
            {'name': 'Error Handling', 'x': 80}
        ],
        'Business': [
            {'name': 'Auth Service', 'x': 20},
            {'name': 'Booking Service', 'x': 40},
            {'name': 'Payment Service', 'x': 60},
            {'name': 'Notification Service', 'x': 80}
        ],
        'Data': [
            {'name': 'Prisma ORM', 'x': 20},
            {'name': 'PostgreSQL', 'x': 40},
            {'name': 'Redis Cache', 'x': 60},
            {'name': 'File Storage', 'x': 80}
        ]
    }
    
    # Draw layers
    for layer_name, layer_info in layers.items():
        y = layer_info['y']
        color = layer_info['color']
        
        # Layer background
        rect = patches.Rectangle((5, y-8), 90, 16, 
                               facecolor=color, edgecolor='gray', 
                               linewidth=1, alpha=0.3)
        ax.add_patch(rect)
        
        # Layer label
        ax.text(2, y, layer_name, ha='center', va='center', 
                fontweight='bold', fontsize=12, rotation=90)
        
        # Draw components
        for comp in components[layer_name]:
            comp_rect = patches.Rectangle((comp['x']-8, y-6), 16, 12,
                                        facecolor=color, edgecolor='black',
                                        linewidth=1.5)
            ax.add_patch(comp_rect)
            ax.text(comp['x'], y, comp['name'], ha='center', va='center',
                   fontweight='bold', fontsize=9)
    
    # Add connections between layers
    for i in range(len(list(layers.keys()))-1):
        layer_names = list(layers.keys())
        y1 = layers[layer_names[i]]['y'] - 8
        y2 = layers[layer_names[i+1]]['y'] + 8
        
        # Draw connecting arrows
        for x in [20, 40, 60, 80]:
            ax.annotate('', xy=(x, y1), xytext=(x, y2),
                       arrowprops=dict(arrowstyle='->', color='gray', lw=1))
    
    # Title
    ax.text(50, 95, 'Pentagon Gymnastics - Component Architecture Diagram', 
            ha='center', va='center', fontsize=14, fontweight='bold')
    
    plt.tight_layout()
    return fig

def get_controller_methods(class_name):
    """Get methods for controller classes"""
    methods = {
        'AuthController': ['+login()', '+register()', '+getProfile()', '+logout()'],
        'ClassController': ['+getClasses()', '+createClass()', '+updateClass()', '+deleteClass()'],
        'SubscriptionController': ['+getPackages()', '+createSubscription()', '+switchPackage()', '+cancelSubscription()'],
        'PaymentController': ['+processPayment()', '+getTestCards()', '+validateCard()', '+getPaymentStats()']
    }
    return methods.get(class_name, ['+method1()', '+method2()'])

def get_service_methods(class_name):
    """Get methods for service classes"""
    methods = {
        'AuthService': ['+authenticate()', '+generateToken()', '+validateToken()', '+hashPassword()'],
        'SimulatedPaymentService': ['+processPayment()', '+validateCard()', '+getTestCards()', '+refundPayment()'],
        'TransactionService': ['+logTransaction()', '+getTransactions()', '+logActivity()', '+getStatistics()'],
        'NotificationService': ['+sendEmail()', '+sendSMS()', '+pushNotification()', '+logNotification()']
    }
    return methods.get(class_name, ['+service1()', '+service2()'])

def get_middleware_methods(class_name):
    """Get methods for middleware classes"""
    methods = {
        'AuthMiddleware': ['+authenticate()', '+extractToken()', '+verifyUser()'],
        'AdminMiddleware': ['+requireAdmin()', '+checkPermissions()', '+validateRole()'],
        'ErrorHandler': ['+handleError()', '+logError()', '+formatResponse()'],
        'CorsMiddleware': ['+setCorsHeaders()', '+validateOrigin()', '+handlePreflight()']
    }
    return methods.get(class_name, ['+middleware()'])

def get_model_attributes(class_name):
    """Get attributes for model classes"""
    attributes = {
        'User': ['id: number', 'email: string', 'role: string', 'createdAt: Date'],
        'Class': ['id: number', 'name: string', 'description: string'],
        'Session': ['id: number', 'timeSlot: string', 'capacity: number', 'bookingCount: number'],
        'Booking': ['id: number', 'userId: number', 'sessionId: number'],
        'Subscription': ['id: number', 'userId: number', 'packageId: number', 'status: string'],
        'Package': ['id: number', 'name: string', 'price: number', 'maxClasses: number'],
        'Transaction': ['id: number', 'amount: number', 'status: string', 'type: string'],
        'SimulatedCard': ['id: number', 'cardNumber: string', 'balance: number', 'isValid: boolean']
    }
    return attributes.get(class_name, ['id: number', 'data: string'])

def get_entity_attributes(entity_name):
    """Get attributes for ERD entities"""
    attributes = {
        'User': ['🔑 id (PK)', 'email', 'password', 'role'],
        'Subscription': ['🔑 id (PK)', '🔗 userId (FK)', '🔗 packageId (FK)', 'status'],
        'Package': ['🔑 id (PK)', 'name', 'price', 'maxClasses'],
        'Class': ['🔑 id (PK)', 'name', 'description'],
        'Session': ['🔑 id (PK)', '🔗 classId (FK)', 'timeSlot', 'capacity'],
        'Booking': ['🔑 id (PK)', '🔗 userId (FK)', '🔗 sessionId (FK)'],
        'Transaction': ['🔑 id (PK)', '🔗 userId (FK)', 'amount', 'status'],
        'SimulatedCard': ['🔑 id (PK)', 'cardNumber', 'balance', 'isValid'],
        'GearOrder': ['🔑 id (PK)', '🔗 userId (FK)', 'totalAmount', 'status']
    }
    return attributes.get(entity_name, ['🔑 id (PK)', 'data'])

def add_class_relationships(ax, classes):
    """Add relationships between classes with non-overlapping lines"""
    relationships = [
        ('AuthController', 'AuthService', 'uses'),
        ('SubscriptionController', 'TransactionService', 'uses'),
        ('PaymentController', 'SimulatedPaymentService', 'uses'),
        ('AuthMiddleware', 'User', 'validates'),
        ('Session', 'Class', 'belongs to'),
        ('Booking', 'User', 'made by'),
        ('Subscription', 'Package', 'has'),
    ]
    
    for from_class, to_class, relation_type in relationships:
        if from_class in classes and to_class in classes:
            x1, y1 = classes[from_class]['pos']
            x2, y2 = classes[to_class]['pos']
            
            # Draw relationship line with offset to prevent overlap
            ax.plot([x1, x2], [y1, y2], 'k-', alpha=0.6, linewidth=1)
            
            # Add relationship label
            mid_x, mid_y = (x1 + x2) / 2, (y1 + y2) / 2
            ax.text(mid_x, mid_y, relation_type, ha='center', va='center',
                   fontsize=7, bbox=dict(boxstyle="round,pad=0.2", 
                   facecolor='yellow', alpha=0.7))

def add_erd_relationships(ax, entities):
    """Add ERD relationships"""
    relationships = [
        ('User', 'Subscription', '1:1', (0, -2)),
        ('Subscription', 'Package', 'N:1', (2, 0)),
        ('User', 'Booking', '1:N', (-2, 2)),
        ('Session', 'Booking', '1:N', (0, 2)),
        ('Class', 'Session', '1:N', (2, -2)),
        ('User', 'Transaction', '1:N', (-2, -2)),
        ('User', 'GearOrder', '1:N', (2, 2)),
    ]
    
    for from_entity, to_entity, cardinality, offset in relationships:
        if from_entity in entities and to_entity in entities:
            x1, y1 = entities[from_entity]['pos']
            x2, y2 = entities[to_entity]['pos']
            
            # Apply offset to prevent line overlap
            x1 += offset[0]
            y1 += offset[1]
            x2 += offset[0]
            y2 += offset[1]
            
            # Draw relationship line
            ax.plot([x1, x2], [y1, y2], 'r-', linewidth=2)
            
            # Add cardinality
            mid_x, mid_y = (x1 + x2) / 2, (y1 + y2) / 2
            ax.text(mid_x, mid_y, cardinality, ha='center', va='center',
                   fontsize=8, fontweight='bold',
                   bbox=dict(boxstyle="round,pad=0.2", facecolor='white'))

def add_legend(ax, colors, x, y):
    """Add legend for diagram colors"""
    legend_items = [
        ('Controller', colors['controller']),
        ('Service', colors['service']),
        ('Model', colors['model']),
        ('Middleware', colors['middleware'])
    ]
    
    for i, (label, color) in enumerate(legend_items):
        rect = patches.Rectangle((x, y-i*3), 2, 2, facecolor=color, edgecolor='black')
        ax.add_patch(rect)
        ax.text(x+3, y-i*3+1, label, va='center', fontsize=9)

def save_diagrams():
    """Generate and save all diagrams"""
    print("🎨 Generating Pentagon Gymnastics System Diagrams...")
    
    diagrams = [
        ('Class Diagram', create_class_diagram),
        ('ERD Diagram', create_erd_diagram),
        ('Sequence Diagram', create_sequence_diagram),
        ('Component Diagram', create_component_diagram)
    ]
    
    for name, func in diagrams:
        print(f"📊 Creating {name}...")
        try:
            fig = func()
            
            # Save as PNG (high resolution)
            png_filename = f"pentagon_gym_{name.lower().replace(' ', '_')}.png"
            fig.savefig(png_filename, dpi=300, bbox_inches='tight', 
                       facecolor='white', edgecolor='none')
            print(f"✅ Saved: {png_filename}")
            
            # Save as PDF (vector format)
            pdf_filename = f"pentagon_gym_{name.lower().replace(' ', '_')}.pdf"
            fig.savefig(pdf_filename, format='pdf', bbox_inches='tight',
                       facecolor='white', edgecolor='none')
            print(f"✅ Saved: {pdf_filename}")
            
            plt.close(fig)
            
        except Exception as e:
            print(f"❌ Error creating {name}: {str(e)}")
    
    print("\n🎉 All diagrams generated successfully!")
    print("📁 Files created:")
    print("   - pentagon_gym_class_diagram.png/.pdf")
    print("   - pentagon_gym_erd_diagram.png/.pdf") 
    print("   - pentagon_gym_sequence_diagram.png/.pdf")
    print("   - pentagon_gym_component_diagram.png/.pdf")
    print("\n💡 These diagrams are ready for your dissertation!")

if __name__ == "__main__":
    save_diagrams()
