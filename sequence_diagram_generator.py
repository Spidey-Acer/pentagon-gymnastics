"""
Pentagon Gymnastics System - Sequence Diagram Generator
Creates UML sequence diagrams for key user workflows
Author: Pentagon Gymnastics Development Team
Date: August 8, 2025
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch
import numpy as np
from datetime import datetime
import os

class SequenceDiagramGenerator:
    def __init__(self):
        self.colors = {
            'actor': '#E3F2FD',
            'actor_border': '#1976D2',
            'object': '#FFF3E0',
            'object_border': '#FF9800',
            'activation': '#FFEB3B',
            'message': '#333333',
            'return': '#666666',
            'note': '#FFFDE7',
            'note_border': '#FBC02D'
        }
        
        # Create output directory
        self.output_dir = 'dissertation_diagrams'
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
    
    def generate_user_registration_sequence(self):
        """Generate sequence diagram for user registration workflow"""
        fig, ax = plt.subplots(1, 1, figsize=(16, 12))
        ax.set_xlim(0, 16)
        ax.set_ylim(0, 12)
        ax.axis('off')
        
        # Title
        ax.text(8, 11.5, 'Pentagon Gymnastics - User Registration Sequence Diagram', 
                fontsize=16, fontweight='bold', ha='center')
        
        # Define actors and objects
        participants = [
            {'name': 'User', 'type': 'actor', 'x': 2},
            {'name': 'Frontend\n(React)', 'type': 'object', 'x': 5},
            {'name': 'AuthController', 'type': 'object', 'x': 8},
            {'name': 'AuthService', 'type': 'object', 'x': 11},
            {'name': 'Database\n(PostgreSQL)', 'type': 'object', 'x': 14}
        ]
        
        # Draw participants
        for participant in participants:
            x = participant['x']
            name = participant['name']
            p_type = participant['type']
            
            if p_type == 'actor':
                # Draw actor (stick figure)
                # Head
                circle = plt.Circle((x, 10.5), 0.15, facecolor=self.colors['actor'], 
                                  edgecolor=self.colors['actor_border'], linewidth=2)
                ax.add_patch(circle)
                # Body
                ax.plot([x, x], [10.35, 9.8], color=self.colors['actor_border'], linewidth=2)
                # Arms
                ax.plot([x-0.2, x+0.2], [10.1, 10.1], color=self.colors['actor_border'], linewidth=2)
                # Legs
                ax.plot([x-0.15, x], [9.5, 9.8], color=self.colors['actor_border'], linewidth=2)
                ax.plot([x+0.15, x], [9.5, 9.8], color=self.colors['actor_border'], linewidth=2)
            else:
                # Draw object box
                obj_box = FancyBboxPatch(
                    (x - 0.6, 10),
                    1.2, 0.6,
                    boxstyle="round,pad=0.05",
                    facecolor=self.colors['object'],
                    edgecolor=self.colors['object_border'],
                    linewidth=2
                )
                ax.add_patch(obj_box)
            
            # Participant name
            ax.text(x, 9.2, name, fontsize=10, ha='center', va='center', fontweight='bold')
            
            # Lifeline
            ax.plot([x, x], [9, 1], color='black', linewidth=1, linestyle='--')
        
        # Define messages
        messages = [
            {'from': 2, 'to': 5, 'y': 8.5, 'text': '1: Fill registration form', 'type': 'sync'},
            {'from': 5, 'to': 5, 'y': 8.2, 'text': '2: Validate input', 'type': 'self'},
            {'from': 5, 'to': 8, 'y': 7.8, 'text': '3: POST /api/auth/register', 'type': 'sync'},
            {'from': 8, 'to': 8, 'y': 7.5, 'text': '4: Validate request data', 'type': 'self'},
            {'from': 8, 'to': 11, 'y': 7.1, 'text': '5: hashPassword(password)', 'type': 'sync'},
            {'from': 11, 'to': 8, 'y': 6.8, 'text': '6: hashedPassword', 'type': 'return'},
            {'from': 8, 'to': 14, 'y': 6.4, 'text': '7: CREATE USER', 'type': 'sync'},
            {'from': 14, 'to': 8, 'y': 6.1, 'text': '8: user data', 'type': 'return'},
            {'from': 8, 'to': 11, 'y': 5.7, 'text': '9: generateToken(user)', 'type': 'sync'},
            {'from': 11, 'to': 8, 'y': 5.4, 'text': '10: JWT token', 'type': 'return'},
            {'from': 8, 'to': 5, 'y': 5.0, 'text': '11: {success: true, token, user}', 'type': 'return'},
            {'from': 5, 'to': 2, 'y': 4.6, 'text': '12: Registration successful', 'type': 'return'},
            {'from': 2, 'to': 5, 'y': 4.2, 'text': '13: Navigate to dashboard', 'type': 'sync'},
        ]
        
        # Draw messages
        for msg in messages:
            from_x = msg['from']
            to_x = msg['to']
            y = msg['y']
            text = msg['text']
            msg_type = msg['type']
            
            if msg_type == 'self':
                # Self message (loop)
                ax.plot([from_x, from_x + 0.5, from_x + 0.5, from_x], 
                       [y, y, y - 0.1, y - 0.1], 
                       color=self.colors['message'], linewidth=1.5)
                ax.plot([from_x - 0.05, from_x], [y - 0.05, y - 0.1], 
                       color=self.colors['message'], linewidth=1.5)
                ax.text(from_x + 0.7, y - 0.05, text, fontsize=9, va='center')
            elif msg_type == 'sync':
                # Synchronous message
                ax.annotate('', xy=(to_x, y), xytext=(from_x, y),
                           arrowprops=dict(arrowstyle='->', 
                                         color=self.colors['message'], lw=1.5))
                # Message text
                mid_x = (from_x + to_x) / 2
                ax.text(mid_x, y + 0.1, text, fontsize=9, ha='center', va='bottom')
            elif msg_type == 'return':
                # Return message (dashed)
                ax.annotate('', xy=(to_x, y), xytext=(from_x, y),
                           arrowprops=dict(arrowstyle='->', 
                                         color=self.colors['return'], 
                                         lw=1.5, linestyle='--'))
                # Message text
                mid_x = (from_x + to_x) / 2
                ax.text(mid_x, y + 0.1, text, fontsize=9, ha='center', va='bottom')
        
        # Add activation boxes
        activations = [
            {'x': 5, 'start': 8.5, 'end': 4.6, 'width': 0.1},
            {'x': 8, 'start': 7.8, 'end': 5.0, 'width': 0.1},
            {'x': 11, 'start': 7.1, 'end': 5.4, 'width': 0.1},
            {'x': 14, 'start': 6.4, 'end': 6.1, 'width': 0.1}
        ]
        
        for activation in activations:
            x = activation['x']
            start = activation['start']
            end = activation['end']
            width = activation['width']
            
            activation_box = patches.Rectangle(
                (x - width/2, end),
                width, start - end,
                facecolor=self.colors['activation'],
                edgecolor='black',
                linewidth=1
            )
            ax.add_patch(activation_box)
        
        # Add notes
        note_box = FancyBboxPatch(
            (0.5, 3),
            3, 1.5,
            boxstyle="round,pad=0.1",
            facecolor=self.colors['note'],
            edgecolor=self.colors['note_border'],
            linewidth=1
        )
        ax.add_patch(note_box)
        
        ax.text(2, 3.75, 'Notes:\n• Password is hashed using bcrypt\n• JWT token expires in 24 hours\n• User data excludes password', 
               fontsize=9, ha='center', va='center')
        
        # Add timestamp
        ax.text(15, 0.5, f'Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', 
               fontsize=8, ha='right', style='italic')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/pentagon_gym_registration_sequence.png', 
                   dpi=300, bbox_inches='tight', facecolor='white')
        plt.savefig(f'{self.output_dir}/pentagon_gym_registration_sequence.pdf', 
                   bbox_inches='tight', facecolor='white')
        print(f"Registration sequence diagram saved to {self.output_dir}/pentagon_gym_registration_sequence.png and .pdf")
        plt.show()
    
    def generate_class_booking_sequence(self):
        """Generate sequence diagram for class booking workflow"""
        fig, ax = plt.subplots(1, 1, figsize=(18, 14))
        ax.set_xlim(0, 18)
        ax.set_ylim(0, 14)
        ax.axis('off')
        
        # Title
        ax.text(9, 13.5, 'Pentagon Gymnastics - Class Booking Sequence Diagram', 
                fontsize=16, fontweight='bold', ha='center')
        
        # Define participants
        participants = [
            {'name': 'Member', 'type': 'actor', 'x': 2},
            {'name': 'React\nFrontend', 'type': 'object', 'x': 4.5},
            {'name': 'AuthMiddleware', 'type': 'object', 'x': 7},
            {'name': 'SessionController', 'type': 'object', 'x': 9.5},
            {'name': 'SubscriptionService', 'type': 'object', 'x': 12},
            {'name': 'Database', 'type': 'object', 'x': 14.5},
            {'name': 'NotificationService', 'type': 'object', 'x': 17}
        ]
        
        # Draw participants
        for participant in participants:
            x = participant['x']
            name = participant['name']
            p_type = participant['type']
            
            if p_type == 'actor':
                # Draw actor
                circle = plt.Circle((x, 12.5), 0.15, facecolor=self.colors['actor'], 
                                  edgecolor=self.colors['actor_border'], linewidth=2)
                ax.add_patch(circle)
                ax.plot([x, x], [12.35, 11.8], color=self.colors['actor_border'], linewidth=2)
                ax.plot([x-0.2, x+0.2], [12.1, 12.1], color=self.colors['actor_border'], linewidth=2)
                ax.plot([x-0.15, x], [11.5, 11.8], color=self.colors['actor_border'], linewidth=2)
                ax.plot([x+0.15, x], [11.5, 11.8], color=self.colors['actor_border'], linewidth=2)
            else:
                obj_box = FancyBboxPatch(
                    (x - 0.6, 12),
                    1.2, 0.6,
                    boxstyle="round,pad=0.05",
                    facecolor=self.colors['object'],
                    edgecolor=self.colors['object_border'],
                    linewidth=2
                )
                ax.add_patch(obj_box)
            
            ax.text(x, 11.2, name, fontsize=9, ha='center', va='center', fontweight='bold')
            ax.plot([x, x], [11, 1.5], color='black', linewidth=1, linestyle='--')
        
        # Define messages for booking flow
        messages = [
            {'from': 2, 'to': 4.5, 'y': 10.5, 'text': '1: Select class session', 'type': 'sync'},
            {'from': 4.5, 'to': 4.5, 'y': 10.2, 'text': '2: Check authentication', 'type': 'self'},
            {'from': 4.5, 'to': 9.5, 'y': 9.8, 'text': '3: POST /api/sessions/book\n{sessionId: 123}', 'type': 'sync'},
            {'from': 9.5, 'to': 7, 'y': 9.4, 'text': '4: authenticate(token)', 'type': 'sync'},
            {'from': 7, 'to': 9.5, 'y': 9.1, 'text': '5: user authenticated', 'type': 'return'},
            {'from': 9.5, 'to': 12, 'y': 8.7, 'text': '6: checkEligibility(userId, sessionId)', 'type': 'sync'},
            {'from': 12, 'to': 14.5, 'y': 8.3, 'text': '7: GET user subscription', 'type': 'sync'},
            {'from': 14.5, 'to': 12, 'y': 8.0, 'text': '8: subscription data', 'type': 'return'},
            {'from': 12, 'to': 12, 'y': 7.6, 'text': '9: validate class access', 'type': 'self'},
            {'from': 12, 'to': 9.5, 'y': 7.2, 'text': '10: eligibility confirmed', 'type': 'return'},
            {'from': 9.5, 'to': 14.5, 'y': 6.8, 'text': '11: CHECK session capacity', 'type': 'sync'},
            {'from': 14.5, 'to': 9.5, 'y': 6.5, 'text': '12: capacity available', 'type': 'return'},
            {'from': 9.5, 'to': 14.5, 'y': 6.1, 'text': '13: CREATE booking', 'type': 'sync'},
            {'from': 14.5, 'to': 14.5, 'y': 5.8, 'text': '14: Update session count', 'type': 'self'},
            {'from': 14.5, 'to': 9.5, 'y': 5.4, 'text': '15: booking created', 'type': 'return'},
            {'from': 9.5, 'to': 17, 'y': 5.0, 'text': '16: sendConfirmation(booking)', 'type': 'async'},
            {'from': 9.5, 'to': 4.5, 'y': 4.6, 'text': '17: {success: true, booking}', 'type': 'return'},
            {'from': 4.5, 'to': 2, 'y': 4.2, 'text': '18: Booking confirmed!', 'type': 'return'},
            {'from': 17, 'to': 2, 'y': 3.8, 'text': '19: Email confirmation', 'type': 'async'}
        ]
        
        # Draw messages
        for msg in messages:
            from_x = msg['from']
            to_x = msg['to']
            y = msg['y']
            text = msg['text']
            msg_type = msg['type']
            
            if msg_type == 'self':
                ax.plot([from_x, from_x + 0.5, from_x + 0.5, from_x], 
                       [y, y, y - 0.1, y - 0.1], 
                       color=self.colors['message'], linewidth=1.5)
                ax.plot([from_x - 0.05, from_x], [y - 0.05, y - 0.1], 
                       color=self.colors['message'], linewidth=1.5)
                ax.text(from_x + 0.7, y - 0.05, text, fontsize=8, va='center')
            elif msg_type == 'sync':
                ax.annotate('', xy=(to_x, y), xytext=(from_x, y),
                           arrowprops=dict(arrowstyle='->', 
                                         color=self.colors['message'], lw=1.5))
                mid_x = (from_x + to_x) / 2
                ax.text(mid_x, y + 0.1, text, fontsize=8, ha='center', va='bottom')
            elif msg_type == 'return':
                ax.annotate('', xy=(to_x, y), xytext=(from_x, y),
                           arrowprops=dict(arrowstyle='->', 
                                         color=self.colors['return'], 
                                         lw=1.5, linestyle='--'))
                mid_x = (from_x + to_x) / 2
                ax.text(mid_x, y + 0.1, text, fontsize=8, ha='center', va='bottom')
            elif msg_type == 'async':
                ax.annotate('', xy=(to_x, y), xytext=(from_x, y),
                           arrowprops=dict(arrowstyle='->', 
                                         color='#FF5722', 
                                         lw=1.5, linestyle='-.'))
                mid_x = (from_x + to_x) / 2
                ax.text(mid_x, y + 0.1, text, fontsize=8, ha='center', va='bottom')
        
        # Add activation boxes
        activations = [
            {'x': 4.5, 'start': 10.5, 'end': 4.2, 'width': 0.08},
            {'x': 7, 'start': 9.4, 'end': 9.1, 'width': 0.08},
            {'x': 9.5, 'start': 9.8, 'end': 4.6, 'width': 0.08},
            {'x': 12, 'start': 8.7, 'end': 7.2, 'width': 0.08},
            {'x': 14.5, 'start': 8.3, 'end': 5.4, 'width': 0.08},
            {'x': 17, 'start': 5.0, 'end': 3.8, 'width': 0.08}
        ]
        
        for activation in activations:
            x = activation['x']
            start = activation['start']
            end = activation['end']
            width = activation['width']
            
            activation_box = patches.Rectangle(
                (x - width/2, end),
                width, start - end,
                facecolor=self.colors['activation'],
                edgecolor='black',
                linewidth=1
            )
            ax.add_patch(activation_box)
        
        # Add alternative flow (capacity full)
        alt_box = FancyBboxPatch(
            (0.5, 2.5),
            17, 1,
            boxstyle="round,pad=0.05",
            facecolor='#FFEBEE',
            edgecolor='#F44336',
            linewidth=1,
            linestyle='--'
        )
        ax.add_patch(alt_box)
        
        ax.text(9, 3, 'Alternative Flow: Session Full', fontsize=10, ha='center', fontweight='bold')
        ax.text(9, 2.7, 'If session capacity is full, return error: "Session is fully booked"', 
               fontsize=9, ha='center', style='italic')
        
        # Add timestamp
        ax.text(17, 0.5, f'Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', 
               fontsize=8, ha='right', style='italic')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/pentagon_gym_booking_sequence.png', 
                   dpi=300, bbox_inches='tight', facecolor='white')
        plt.savefig(f'{self.output_dir}/pentagon_gym_booking_sequence.pdf', 
                   bbox_inches='tight', facecolor='white')
        print(f"Booking sequence diagram saved to {self.output_dir}/pentagon_gym_booking_sequence.png and .pdf")
        plt.show()
    
    def generate_subscription_sequence(self):
        """Generate sequence diagram for subscription management"""
        fig, ax = plt.subplots(1, 1, figsize=(16, 12))
        ax.set_xlim(0, 16)
        ax.set_ylim(0, 12)
        ax.axis('off')
        
        # Title
        ax.text(8, 11.5, 'Pentagon Gymnastics - Subscription Creation Sequence', 
                fontsize=16, fontweight='bold', ha='center')
        
        # Define participants
        participants = [
            {'name': 'User', 'type': 'actor', 'x': 2},
            {'name': 'Frontend', 'type': 'object', 'x': 4.5},
            {'name': 'SubscriptionController', 'type': 'object', 'x': 7.5},
            {'name': 'PaymentService', 'type': 'object', 'x': 10.5},
            {'name': 'Database', 'type': 'object', 'x': 13.5}
        ]
        
        # Draw participants
        for participant in participants:
            x = participant['x']
            name = participant['name']
            p_type = participant['type']
            
            if p_type == 'actor':
                circle = plt.Circle((x, 10.5), 0.15, facecolor=self.colors['actor'], 
                                  edgecolor=self.colors['actor_border'], linewidth=2)
                ax.add_patch(circle)
                ax.plot([x, x], [10.35, 9.8], color=self.colors['actor_border'], linewidth=2)
                ax.plot([x-0.2, x+0.2], [10.1, 10.1], color=self.colors['actor_border'], linewidth=2)
                ax.plot([x-0.15, x], [9.5, 9.8], color=self.colors['actor_border'], linewidth=2)
                ax.plot([x+0.15, x], [9.5, 9.8], color=self.colors['actor_border'], linewidth=2)
            else:
                obj_box = FancyBboxPatch(
                    (x - 0.7, 10),
                    1.4, 0.6,
                    boxstyle="round,pad=0.05",
                    facecolor=self.colors['object'],
                    edgecolor=self.colors['object_border'],
                    linewidth=2
                )
                ax.add_patch(obj_box)
            
            ax.text(x, 9.2, name, fontsize=10, ha='center', va='center', fontweight='bold')
            ax.plot([x, x], [9, 1], color='black', linewidth=1, linestyle='--')
        
        # Messages for subscription creation
        messages = [
            {'from': 2, 'to': 4.5, 'y': 8.5, 'text': '1: Select package', 'type': 'sync'},
            {'from': 4.5, 'to': 7.5, 'y': 8.1, 'text': '2: POST /subscriptions/create', 'type': 'sync'},
            {'from': 7.5, 'to': 13.5, 'y': 7.7, 'text': '3: Check existing subscription', 'type': 'sync'},
            {'from': 13.5, 'to': 7.5, 'y': 7.4, 'text': '4: No active subscription', 'type': 'return'},
            {'from': 7.5, 'to': 10.5, 'y': 7.0, 'text': '5: processPayment(amount, cardData)', 'type': 'sync'},
            {'from': 10.5, 'to': 10.5, 'y': 6.6, 'text': '6: Validate payment card', 'type': 'self'},
            {'from': 10.5, 'to': 10.5, 'y': 6.3, 'text': '7: Simulate payment processing', 'type': 'self'},
            {'from': 10.5, 'to': 7.5, 'y': 5.9, 'text': '8: Payment successful', 'type': 'return'},
            {'from': 7.5, 'to': 13.5, 'y': 5.5, 'text': '9: CREATE subscription', 'type': 'sync'},
            {'from': 13.5, 'to': 13.5, 'y': 5.2, 'text': '10: Set start/end dates', 'type': 'self'},
            {'from': 13.5, 'to': 7.5, 'y': 4.8, 'text': '11: Subscription created', 'type': 'return'},
            {'from': 7.5, 'to': 13.5, 'y': 4.4, 'text': '12: LOG transaction', 'type': 'sync'},
            {'from': 13.5, 'to': 7.5, 'y': 4.1, 'text': '13: Transaction logged', 'type': 'return'},
            {'from': 7.5, 'to': 4.5, 'y': 3.7, 'text': '14: {success: true, subscription}', 'type': 'return'},
            {'from': 4.5, 'to': 2, 'y': 3.3, 'text': '15: Subscription active!', 'type': 'return'}
        ]
        
        # Draw messages
        for msg in messages:
            from_x = msg['from']
            to_x = msg['to']
            y = msg['y']
            text = msg['text']
            msg_type = msg['type']
            
            if msg_type == 'self':
                ax.plot([from_x, from_x + 0.5, from_x + 0.5, from_x], 
                       [y, y, y - 0.1, y - 0.1], 
                       color=self.colors['message'], linewidth=1.5)
                ax.plot([from_x - 0.05, from_x], [y - 0.05, y - 0.1], 
                       color=self.colors['message'], linewidth=1.5)
                ax.text(from_x + 0.7, y - 0.05, text, fontsize=9, va='center')
            elif msg_type == 'sync':
                ax.annotate('', xy=(to_x, y), xytext=(from_x, y),
                           arrowprops=dict(arrowstyle='->', 
                                         color=self.colors['message'], lw=1.5))
                mid_x = (from_x + to_x) / 2
                ax.text(mid_x, y + 0.1, text, fontsize=9, ha='center', va='bottom')
            elif msg_type == 'return':
                ax.annotate('', xy=(to_x, y), xytext=(from_x, y),
                           arrowprops=dict(arrowstyle='->', 
                                         color=self.colors['return'], 
                                         lw=1.5, linestyle='--'))
                mid_x = (from_x + to_x) / 2
                ax.text(mid_x, y + 0.1, text, fontsize=9, ha='center', va='bottom')
        
        # Add activation boxes
        activations = [
            {'x': 4.5, 'start': 8.5, 'end': 3.3, 'width': 0.1},
            {'x': 7.5, 'start': 8.1, 'end': 3.7, 'width': 0.1},
            {'x': 10.5, 'start': 7.0, 'end': 5.9, 'width': 0.1},
            {'x': 13.5, 'start': 7.7, 'end': 4.1, 'width': 0.1}
        ]
        
        for activation in activations:
            x = activation['x']
            start = activation['start']
            end = activation['end']
            width = activation['width']
            
            activation_box = patches.Rectangle(
                (x - width/2, end),
                width, start - end,
                facecolor=self.colors['activation'],
                edgecolor='black',
                linewidth=1
            )
            ax.add_patch(activation_box)
        
        # Add notes
        note_box = FancyBboxPatch(
            (0.5, 2),
            6, 1,
            boxstyle="round,pad=0.1",
            facecolor=self.colors['note'],
            edgecolor=self.colors['note_border'],
            linewidth=1
        )
        ax.add_patch(note_box)
        
        ax.text(3.5, 2.5, 'Payment Processing:\n• Simulated payment system\n• Validates card data\n• Records transaction history', 
               fontsize=9, ha='center', va='center')
        
        # Add timestamp
        ax.text(15, 0.5, f'Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', 
               fontsize=8, ha='right', style='italic')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/pentagon_gym_subscription_sequence.png', 
                   dpi=300, bbox_inches='tight', facecolor='white')
        plt.savefig(f'{self.output_dir}/pentagon_gym_subscription_sequence.pdf', 
                   bbox_inches='tight', facecolor='white')
        print(f"Subscription sequence diagram saved to {self.output_dir}/pentagon_gym_subscription_sequence.png and .pdf")
        plt.show()
    
    def generate_all_sequence_diagrams(self):
        """Generate all sequence diagrams"""
        print("Generating Pentagon Gymnastics Sequence Diagrams...")
        print("=" * 60)
        
        print("\n1. Generating User Registration Sequence...")
        self.generate_user_registration_sequence()
        
        print("\n2. Generating Class Booking Sequence...")
        self.generate_class_booking_sequence()
        
        print("\n3. Generating Subscription Creation Sequence...")
        self.generate_subscription_sequence()
        
        print("\n" + "=" * 60)
        print("All sequence diagrams generated successfully!")
        print(f"Diagrams saved in: {self.output_dir}/")
        print("Sequence diagram files:")
        print("- pentagon_gym_registration_sequence.png/pdf")
        print("- pentagon_gym_booking_sequence.png/pdf")
        print("- pentagon_gym_subscription_sequence.png/pdf")

def main():
    """Main function to run the sequence diagram generator"""
    generator = SequenceDiagramGenerator()
    generator.generate_all_sequence_diagrams()

if __name__ == "__main__":
    main()
