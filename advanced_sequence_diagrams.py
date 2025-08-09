#!/usr/bin/env python3
"""
Advanced System Architecture and Sequence Diagrams for Pentagon Gymnastics
==========================================================================

Creates additional professional diagrams including:
- System Architecture Diagram
- User Registration Sequence Diagram
- Booking Process Sequence Diagram
- Payment Processing Sequence Diagram

Author: Pentagon Gymnastics System
Date: August 8, 2025
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Rectangle, Circle, Arrow, Polygon
import numpy as np
from typing import List, Dict, Tuple
import os


class AdvancedDiagramGenerator:
    """Generate advanced system diagrams for comprehensive documentation."""
    
    def __init__(self, figsize=(24, 18)):
        self.figsize = figsize
        self.colors = {
            # System architecture colors
            'frontend': '#3498DB',
            'backend': '#2ECC71',
            'database': '#E74C3C',
            'external': '#F39C12',
            'middleware': '#9B59B6',
            'security': '#E67E22',
            
            # Sequence diagram colors
            'actor': '#34495E',
            'system': '#3498DB',
            'database_seq': '#E74C3C',
            'external_seq': '#F39C12',
            'message': '#2C3E50',
            'activation': '#BDC3C7',
            
            # Background and text
            'background': '#FFFFFF',
            'text': '#2C3E50',
            'border': '#34495E'
        }
        
        self.fonts = {
            'title': {'size': 20, 'weight': 'bold'},
            'component': {'size': 12, 'weight': 'bold'},
            'description': {'size': 10, 'weight': 'normal'},
            'sequence': {'size': 10, 'weight': 'normal'},
            'message': {'size': 9, 'weight': 'normal'}
        }
        
        # Create output directory
        self.output_dir = 'dissertation_diagrams'
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
    
    def generate_system_architecture(self):
        """Generate system architecture diagram."""
        fig, ax = plt.subplots(1, 1, figsize=self.figsize)
        ax.set_xlim(0, 120)
        ax.set_ylim(0, 90)
        ax.set_aspect('equal')
        ax.axis('off')
        fig.patch.set_facecolor('white')
        
        # Title
        ax.text(60, 85, 'Pentagon Gymnastics System Architecture', 
                ha='center', va='center', fontsize=self.fonts['title']['size'],
                fontweight=self.fonts['title']['weight'], color=self.colors['text'])
        
        # Frontend Layer
        self.create_component_box(ax, 'React Frontend', 10, 70, 30, 8, 
                                 self.colors['frontend'], [
                                     'React 18 with TypeScript',
                                     'Vite Build System',
                                     'Tailwind CSS',
                                     'Context API State Management'
                                 ])
        
        self.create_component_box(ax, 'UI Components', 45, 70, 25, 8,
                                 self.colors['frontend'], [
                                     'LoginForm, RegisterForm',
                                     'ClassCard, Booking Components',
                                     'Payment Forms',
                                     'Admin Dashboard'
                                 ])
        
        self.create_component_box(ax, 'Routing & Navigation', 75, 70, 25, 8,
                                 self.colors['frontend'], [
                                     'React Router DOM',
                                     'Protected Routes',
                                     'Role-based Access',
                                     'Dynamic Navigation'
                                 ])
        
        # API Gateway / Middleware Layer
        self.create_component_box(ax, 'Express.js Server', 25, 55, 35, 6,
                                 self.colors['middleware'], [
                                     'RESTful API Endpoints',
                                     'JWT Authentication',
                                     'CORS Configuration',
                                     'Request Validation'
                                 ])
        
        self.create_component_box(ax, 'Authentication Middleware', 65, 55, 30, 6,
                                 self.colors['security'], [
                                     'JWT Token Verification',
                                     'Role-based Authorization',
                                     'Rate Limiting',
                                     'Security Headers'
                                 ])
        
        # Business Logic Layer
        self.create_component_box(ax, 'Auth Controller', 10, 40, 20, 8,
                                 self.colors['backend'], [
                                     'User Registration',
                                     'Login/Logout',
                                     'Profile Management',
                                     'Token Validation'
                                 ])
        
        self.create_component_box(ax, 'Subscription Controller', 35, 40, 20, 8,
                                 self.colors['backend'], [
                                     'Package Management',
                                     'Subscription CRUD',
                                     'Package Switching',
                                     'Renewal Logic'
                                 ])
        
        self.create_component_box(ax, 'Booking Controller', 60, 40, 20, 8,
                                 self.colors['backend'], [
                                     'Class Booking',
                                     'Session Management',
                                     'Capacity Checking',
                                     'Booking History'
                                 ])
        
        self.create_component_box(ax, 'Payment Controller', 85, 40, 20, 8,
                                 self.colors['backend'], [
                                     'Payment Processing',
                                     'Simulated Payments',
                                     'Transaction Logging',
                                     'Receipt Generation'
                                 ])
        
        # Data Access Layer
        self.create_component_box(ax, 'Prisma ORM', 30, 25, 30, 6,
                                 self.colors['database'], [
                                     'Type-safe Database Client',
                                     'Query Builder',
                                     'Migration Management',
                                     'Connection Pooling'
                                 ])
        
        self.create_component_box(ax, 'Transaction Service', 65, 25, 25, 6,
                                 self.colors['backend'], [
                                     'Business Logic',
                                     'Data Validation',
                                     'Activity Logging',
                                     'Error Handling'
                                 ])
        
        # Database Layer
        self.create_component_box(ax, 'PostgreSQL Database', 40, 10, 40, 8,
                                 self.colors['database'], [
                                     '16 Normalized Tables',
                                     'ACID Compliance',
                                     'Referential Integrity',
                                     'Performance Optimization'
                                 ])
        
        # External Services
        self.create_component_box(ax, 'Simulated Payment Gateway', 10, 25, 15, 6,
                                 self.colors['external'], [
                                     'Card Validation',
                                     'Payment Simulation',
                                     'Transaction Status',
                                     'Failure Simulation'
                                 ])
        
        # Add connection arrows
        self.add_connection_arrows(ax)
        
        # Add legend
        self.add_architecture_legend(ax)
        
        # Save
        arch_png = os.path.join(self.output_dir, 'pentagon_gym_system_architecture.png')
        arch_pdf = os.path.join(self.output_dir, 'pentagon_gym_system_architecture.pdf')
        
        fig.savefig(arch_png, dpi=300, bbox_inches='tight', facecolor='white', edgecolor='none')
        fig.savefig(arch_pdf, format='pdf', bbox_inches='tight', facecolor='white', edgecolor='none')
        
        plt.close()
        return arch_png, arch_pdf
    
    def create_component_box(self, ax, title: str, x: float, y: float, width: float, height: float,
                           color: str, descriptions: List[str]):
        """Create a component box with title and descriptions."""
        
        # Main box
        box = FancyBboxPatch(
            (x, y), width, height,
            boxstyle="round,pad=0.3",
            facecolor=color,
            edgecolor=self.colors['border'],
            linewidth=2,
            alpha=0.8,
            zorder=2
        )
        ax.add_patch(box)
        
        # Title
        ax.text(x + width/2, y + height - 1, title,
                ha='center', va='center', fontsize=self.fonts['component']['size'],
                fontweight=self.fonts['component']['weight'], 
                color='white', zorder=4)
        
        # Descriptions
        for i, desc in enumerate(descriptions):
            ax.text(x + 0.5, y + height - 2.5 - (i * 1.2), f"• {desc}",
                    ha='left', va='center', fontsize=self.fonts['description']['size'],
                    color='white', zorder=4)
    
    def add_connection_arrows(self, ax):
        """Add connection arrows between components."""
        
        # Define connections (start_point, end_point)
        connections = [
            # Frontend to Middleware
            ((25, 70), (42, 61)),
            ((57, 70), (57, 61)),
            ((87, 70), (72, 61)),
            
            # Middleware to Controllers
            ((35, 55), (25, 48)),
            ((50, 55), (45, 48)),
            ((65, 55), (70, 48)),
            ((80, 55), (95, 48)),
            
            # Controllers to Data Layer
            ((20, 40), (40, 31)),
            ((45, 40), (45, 31)),
            ((70, 40), (70, 31)),
            ((95, 40), (77, 31)),
            
            # Data Layer to Database
            ((47, 25), (55, 18)),
            ((77, 25), (65, 18)),
            
            # External connections
            ((17, 25), (30, 31))
        ]
        
        for start, end in connections:
            ax.annotate('', xy=end, xytext=start,
                       arrowprops=dict(arrowstyle='->', lw=2, color=self.colors['border']))
    
    def add_architecture_legend(self, ax):
        """Add legend for architecture diagram."""
        legend_x, legend_y = 105, 10
        
        legend_box = FancyBboxPatch(
            (legend_x, legend_y), 14, 25,
            boxstyle="round,pad=0.5",
            facecolor='white',
            edgecolor=self.colors['border'],
            linewidth=2,
            zorder=2
        )
        ax.add_patch(legend_box)
        
        ax.text(legend_x + 7, legend_y + 23, 'Component Types',
                ha='center', va='center', fontsize=12, fontweight='bold',
                color=self.colors['text'])
        
        # Legend items
        legend_items = [
            ('Frontend', self.colors['frontend']),
            ('Backend', self.colors['backend']),
            ('Database', self.colors['database']),
            ('External', self.colors['external']),
            ('Middleware', self.colors['middleware']),
            ('Security', self.colors['security'])
        ]
        
        for i, (label, color) in enumerate(legend_items):
            y_pos = legend_y + 20 - (i * 3)
            
            # Color box
            color_box = Rectangle((legend_x + 1, y_pos - 0.5), 2, 1,
                                facecolor=color, edgecolor=self.colors['border'])
            ax.add_patch(color_box)
            
            # Label
            ax.text(legend_x + 4, y_pos, label, ha='left', va='center',
                    fontsize=10, color=self.colors['text'])
    
    def generate_user_registration_sequence(self):
        """Generate user registration sequence diagram."""
        fig, ax = plt.subplots(1, 1, figsize=(20, 14))
        ax.set_xlim(0, 100)
        ax.set_ylim(0, 70)
        ax.axis('off')
        fig.patch.set_facecolor('white')
        
        # Title
        ax.text(50, 67, 'User Registration Sequence Diagram', 
                ha='center', va='center', fontsize=18, fontweight='bold')
        
        # Actors and Systems
        actors = [
            ('User', 10, self.colors['actor']),
            ('Frontend', 25, self.colors['system']),
            ('AuthController', 45, self.colors['backend']),
            ('Prisma ORM', 65, self.colors['database_seq']),
            ('PostgreSQL', 85, self.colors['database'])
        ]
        
        # Draw actors
        for name, x, color in actors:
            self.create_sequence_actor(ax, name, x, 60, color)
            # Lifeline
            ax.plot([x, x], [55, 5], color=color, linewidth=2, linestyle='--', alpha=0.7)
        
        # Messages
        messages = [
            (10, 25, 50, '1: Fill registration form', 'sync'),
            (25, 45, 47, '2: POST /api/auth/register', 'sync'),
            (45, 45, 44, '3: Validate input data', 'self'),
            (45, 65, 41, '4: Hash password', 'sync'),
            (45, 65, 38, '5: user.create(userData)', 'sync'),
            (65, 85, 35, '6: INSERT INTO users', 'sync'),
            (85, 65, 32, '7: Return user record', 'return'),
            (65, 45, 29, '8: Return created user', 'return'),
            (45, 25, 26, '9: Return success response', 'return'),
            (25, 10, 23, '10: Display success message', 'sync')
        ]
        
        for from_x, to_x, y, text, msg_type in messages:
            self.create_sequence_message(ax, from_x, to_x, y, text, msg_type)
        
        # Add notes
        self.add_sequence_note(ax, 15, 15, 'User provides:\n• Email\n• Password\n• Personal Details', 'left')
        self.add_sequence_note(ax, 75, 15, 'Database ensures:\n• Email uniqueness\n• Data integrity\n• ACID compliance', 'right')
        
        # Save
        seq_png = os.path.join(self.output_dir, 'pentagon_gym_registration_sequence.png')
        seq_pdf = os.path.join(self.output_dir, 'pentagon_gym_registration_sequence.pdf')
        
        fig.savefig(seq_png, dpi=300, bbox_inches='tight', facecolor='white', edgecolor='none')
        fig.savefig(seq_pdf, format='pdf', bbox_inches='tight', facecolor='white', edgecolor='none')
        
        plt.close()
        return seq_png, seq_pdf
    
    def generate_booking_sequence(self):
        """Generate booking process sequence diagram."""
        fig, ax = plt.subplots(1, 1, figsize=(22, 16))
        ax.set_xlim(0, 110)
        ax.set_ylim(0, 80)
        ax.axis('off')
        fig.patch.set_facecolor('white')
        
        # Title
        ax.text(55, 77, 'Class Booking Process Sequence Diagram', 
                ha='center', va='center', fontsize=18, fontweight='bold')
        
        # Actors and Systems
        actors = [
            ('Member', 10, self.colors['actor']),
            ('Frontend', 25, self.colors['system']),
            ('BookingController', 45, self.colors['backend']),
            ('SessionController', 65, self.colors['backend']),
            ('Prisma ORM', 85, self.colors['database_seq']),
            ('Database', 105, self.colors['database'])
        ]
        
        # Draw actors
        for name, x, color in actors:
            self.create_sequence_actor(ax, name, x, 70, color)
            ax.plot([x, x], [65, 5], color=color, linewidth=2, linestyle='--', alpha=0.7)
        
        # Messages
        messages = [
            (10, 25, 60, '1: Browse available classes', 'sync'),
            (25, 45, 57, '2: GET /api/classes', 'sync'),
            (45, 65, 54, '3: getAvailableSessions()', 'sync'),
            (65, 85, 51, '4: findMany(sessions)', 'sync'),
            (85, 105, 48, '5: SELECT sessions with capacity', 'sync'),
            (105, 85, 45, '6: Return session data', 'return'),
            (85, 65, 42, '7: Return sessions', 'return'),
            (65, 45, 39, '8: Return available classes', 'return'),
            (45, 25, 36, '9: Return class list', 'return'),
            (25, 10, 33, '10: Display classes', 'sync'),
            
            (10, 25, 28, '11: Select class and book', 'sync'),
            (25, 45, 25, '12: POST /api/bookings', 'sync'),
            (45, 65, 22, '13: checkCapacity(sessionId)', 'sync'),
            (65, 85, 19, '14: Check current bookings', 'sync'),
            (85, 65, 16, '15: Return capacity status', 'return'),
            (45, 85, 13, '16: createBooking(userId, sessionId)', 'sync'),
            (85, 105, 10, '17: INSERT booking, UPDATE session', 'sync'),
            (105, 85, 7, '18: Return booking confirmation', 'return'),
            (85, 45, 4, '19: Return booking details', 'return'),
            (45, 25, 1, '20: Return success response', 'return')
        ]
        
        for from_x, to_x, y, text, msg_type in messages:
            self.create_sequence_message(ax, from_x, to_x, y, text, msg_type)
        
        # Add notes
        self.add_sequence_note(ax, 15, 15, 'Member must have:\n• Valid subscription\n• Available class credits', 'left')
        self.add_sequence_note(ax, 95, 25, 'System ensures:\n• Capacity limits\n• No double booking\n• Transaction integrity', 'right')
        
        # Save
        book_png = os.path.join(self.output_dir, 'pentagon_gym_booking_sequence.png')
        book_pdf = os.path.join(self.output_dir, 'pentagon_gym_booking_sequence.pdf')
        
        fig.savefig(book_png, dpi=300, bbox_inches='tight', facecolor='white', edgecolor='none')
        fig.savefig(book_pdf, format='pdf', bbox_inches='tight', facecolor='white', edgecolor='none')
        
        plt.close()
        return book_png, book_pdf
    
    def generate_subscription_sequence(self):
        """Generate subscription process sequence diagram."""
        fig, ax = plt.subplots(1, 1, figsize=(24, 18))
        ax.set_xlim(0, 120)
        ax.set_ylim(0, 90)
        ax.axis('off')
        fig.patch.set_facecolor('white')
        
        # Title
        ax.text(60, 87, 'Subscription Purchase Process Sequence Diagram', 
                ha='center', va='center', fontsize=18, fontweight='bold')
        
        # Actors and Systems
        actors = [
            ('Member', 10, self.colors['actor']),
            ('Frontend', 25, self.colors['system']),
            ('SubscriptionController', 45, self.colors['backend']),
            ('PaymentController', 70, self.colors['backend']),
            ('SimulatedPayment', 95, self.colors['external_seq']),
            ('Database', 115, self.colors['database'])
        ]
        
        # Draw actors
        for name, x, color in actors:
            self.create_sequence_actor(ax, name, x, 80, color)
            ax.plot([x, x], [75, 5], color=color, linewidth=2, linestyle='--', alpha=0.7)
        
        # Messages - Subscription Flow
        messages = [
            (10, 25, 70, '1: Browse packages', 'sync'),
            (25, 45, 67, '2: GET /api/packages', 'sync'),
            (45, 115, 64, '3: SELECT packages WHERE active=true', 'sync'),
            (115, 45, 61, '4: Return package list', 'return'),
            (45, 25, 58, '5: Return packages', 'return'),
            (25, 10, 55, '6: Display package options', 'sync'),
            
            (10, 25, 50, '7: Select package and subscribe', 'sync'),
            (25, 45, 47, '8: POST /api/subscriptions', 'sync'),
            (45, 115, 44, '9: Check existing subscription', 'sync'),
            (115, 45, 41, '10: Return subscription status', 'return'),
            (45, 115, 38, '11: CREATE subscription (pending)', 'sync'),
            (115, 45, 35, '12: Return subscription ID', 'return'),
            
            # Payment Flow
            (45, 70, 32, '13: Process payment', 'sync'),
            (70, 95, 29, '14: Simulate card payment', 'sync'),
            (95, 95, 26, '15: Validate card details', 'self'),
            (95, 115, 23, '16: LOG transaction', 'sync'),
            (95, 70, 20, '17: Return payment result', 'return'),
            
            (70, 45, 17, '18: Update subscription status', 'sync'),
            (45, 115, 14, '19: UPDATE subscription SET active', 'sync'),
            (115, 45, 11, '20: Confirm update', 'return'),
            (45, 25, 8, '21: Return success response', 'return'),
            (25, 10, 5, '22: Display confirmation', 'sync')
        ]
        
        for from_x, to_x, y, text, msg_type in messages:
            self.create_sequence_message(ax, from_x, to_x, y, text, msg_type)
        
        # Add activation boxes
        activations = [
            (45, 47, 8),  # SubscriptionController
            (70, 32, 8),  # PaymentController
            (95, 29, 6)   # SimulatedPayment
        ]
        
        for x, y, height in activations:
            activation_box = Rectangle((x-1, y-height), 2, height,
                                     facecolor=self.colors['activation'], 
                                     edgecolor=self.colors['border'], alpha=0.7)
            ax.add_patch(activation_box)
        
        # Add notes
        self.add_sequence_note(ax, 15, 25, 'Package Options:\n• Basic: £30/month\n• Standard: £50/month\n• Premium: £80/month\n+ Protein Supplement: £50', 'left')
        self.add_sequence_note(ax, 85, 40, 'Payment Features:\n• Simulated processing\n• Card validation\n• Transaction logging\n• Failure simulation', 'right')
        
        # Save
        sub_png = os.path.join(self.output_dir, 'pentagon_gym_subscription_sequence.png')
        sub_pdf = os.path.join(self.output_dir, 'pentagon_gym_subscription_sequence.pdf')
        
        fig.savefig(sub_png, dpi=300, bbox_inches='tight', facecolor='white', edgecolor='none')
        fig.savefig(sub_pdf, format='pdf', bbox_inches='tight', facecolor='white', edgecolor='none')
        
        plt.close()
        return sub_png, sub_pdf
    
    def create_sequence_actor(self, ax, name: str, x: float, y: float, color: str):
        """Create a sequence diagram actor."""
        # Actor box
        box = FancyBboxPatch(
            (x-5, y-2), 10, 4,
            boxstyle="round,pad=0.3",
            facecolor=color,
            edgecolor=self.colors['border'],
            linewidth=2,
            alpha=0.9,
            zorder=3
        )
        ax.add_patch(box)
        
        # Actor name
        ax.text(x, y, name, ha='center', va='center',
                fontsize=self.fonts['sequence']['size'],
                fontweight='bold', color='white', zorder=4)
    
    def create_sequence_message(self, ax, from_x: float, to_x: float, y: float, 
                              text: str, msg_type: str):
        """Create a sequence message arrow."""
        
        if msg_type == 'self':
            # Self-call
            ax.add_patch(Rectangle((from_x, y-0.5), 8, 1, 
                                 facecolor='none', edgecolor=self.colors['message'], linewidth=1.5))
            ax.annotate('', xy=(from_x, y-0.5), xytext=(from_x+8, y-0.5),
                       arrowprops=dict(arrowstyle='->', lw=1.5, color=self.colors['message']))
            ax.text(from_x+12, y, text, ha='left', va='center',
                    fontsize=self.fonts['message']['size'], color=self.colors['text'])
        elif msg_type == 'return':
            # Return message (dashed)
            ax.annotate('', xy=(from_x, y), xytext=(to_x, y),
                       arrowprops=dict(arrowstyle='->', lw=1.5, color=self.colors['message'],
                                     linestyle='dashed'))
            ax.text((from_x + to_x)/2, y+1, text, ha='center', va='bottom',
                    fontsize=self.fonts['message']['size'], color=self.colors['text'])
        else:
            # Regular message
            ax.annotate('', xy=(to_x, y), xytext=(from_x, y),
                       arrowprops=dict(arrowstyle='->', lw=1.5, color=self.colors['message']))
            ax.text((from_x + to_x)/2, y+1, text, ha='center', va='bottom',
                    fontsize=self.fonts['message']['size'], color=self.colors['text'])
    
    def add_sequence_note(self, ax, x: float, y: float, text: str, align: str):
        """Add a note to sequence diagram."""
        note_width = 15 if align == 'left' else 20
        note_x = x if align == 'left' else x - note_width
        
        note_box = FancyBboxPatch(
            (note_x, y), note_width, 8,
            boxstyle="round,pad=0.5",
            facecolor='#FFF9C4',
            edgecolor='#F57F17',
            linewidth=1.5,
            alpha=0.9,
            zorder=2
        )
        ax.add_patch(note_box)
        
        # Fold corner effect
        corner = Polygon([(note_x + note_width - 2, y + 8), 
                         (note_x + note_width, y + 6),
                         (note_x + note_width, y + 8)],
                        facecolor='#FBC02D', edgecolor='#F57F17', zorder=3)
        ax.add_patch(corner)
        
        ax.text(note_x + note_width/2, y + 4, text, ha='center', va='center',
                fontsize=9, color=self.colors['text'], zorder=4)


def main():
    """Generate all advanced diagrams."""
    print("🎨 Generating Advanced Pentagon Gymnastics Diagrams...")
    print("=" * 70)
    
    generator = AdvancedDiagramGenerator()
    
    # Generate System Architecture
    print("🏗️  Creating System Architecture Diagram...")
    arch_png, arch_pdf = generator.generate_system_architecture()
    print(f"✅ Architecture Diagram: {arch_png}")
    print(f"✅ Architecture Diagram: {arch_pdf}")
    
    # Generate Registration Sequence
    print("\n👤 Creating User Registration Sequence Diagram...")
    reg_png, reg_pdf = generator.generate_user_registration_sequence()
    print(f"✅ Registration Sequence: {reg_png}")
    print(f"✅ Registration Sequence: {reg_pdf}")
    
    # Generate Booking Sequence
    print("\n📅 Creating Booking Process Sequence Diagram...")
    book_png, book_pdf = generator.generate_booking_sequence()
    print(f"✅ Booking Sequence: {book_png}")
    print(f"✅ Booking Sequence: {book_pdf}")
    
    # Generate Subscription Sequence
    print("\n💳 Creating Subscription Process Sequence Diagram...")
    sub_png, sub_pdf = generator.generate_subscription_sequence()
    print(f"✅ Subscription Sequence: {sub_png}")
    print(f"✅ Subscription Sequence: {sub_pdf}")
    
    print(f"\n🎓 All Advanced Diagrams Complete!")
    print(f"📁 Output Directory: dissertation_diagrams/")
    print("\n🏆 Advanced Features:")
    print("   • Comprehensive system architecture")
    print("   • Detailed sequence diagrams")
    print("   • Professional notation and styling")
    print("   • Multi-layer system representation")
    print("   • Interactive process flows")
    print("   • Academic-quality documentation")


if __name__ == "__main__":
    main()
