"""
Pentagon Gymnastics System - Professional Academic Diagram Generator
Generates publication-quality UML and ERD diagrams for dissertation
Author: Pentagon Gymnastics Development Team
Date: August 8, 2025
"""

import os
import sys
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, Rectangle, FancyArrowPatch
import numpy as np
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class AcademicDiagramGenerator:
    """Professional diagram generator for academic publications"""
    
    def __init__(self, output_dir='dissertation_diagrams'):
        self.output_dir = output_dir
        self.ensure_output_directory()
        
        # Academic styling configuration
        self.colors = {
            'primary': '#2E4057',      # Dark blue-gray
            'secondary': '#048A81',     # Teal
            'accent': '#54C6EB',       # Light blue
            'warning': '#F18F01',      # Orange
            'success': '#C73E1D',      # Red-orange
            'text': '#2C3E50',         # Dark gray
            'light_gray': '#ECF0F1',   # Very light gray
            'medium_gray': '#BDC3C7',  # Medium gray
            'white': '#FFFFFF'
        }
        
        # Academic font configuration
        plt.rcParams.update({
            'font.family': 'serif',
            'font.serif': ['Times New Roman', 'DejaVu Serif'],
            'font.size': 10,
            'axes.titlesize': 12,
            'axes.labelsize': 10,
            'xtick.labelsize': 9,
            'ytick.labelsize': 9,
            'legend.fontsize': 9,
            'figure.titlesize': 14
        })
    
    def ensure_output_directory(self):
        """Create output directory if it doesn't exist"""
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
            print(f"✓ Created output directory: {self.output_dir}/")
    
    def save_figure(self, fig, filename, title=""):
        """Save figure in both PNG and PDF formats with academic quality"""
        if title:
            fig.suptitle(title, fontsize=14, fontweight='bold', y=0.95)
        
        # PNG for web/digital use
        png_path = os.path.join(self.output_dir, f"{filename}.png")
        fig.savefig(png_path, dpi=300, bbox_inches='tight', 
                   facecolor='white', edgecolor='none', format='png')
        
        # PDF for print/publication
        pdf_path = os.path.join(self.output_dir, f"{filename}.pdf")
        fig.savefig(pdf_path, bbox_inches='tight', 
                   facecolor='white', edgecolor='none', format='pdf')
        
        print(f"   ✓ {filename}.png & .pdf saved")
    
    def create_entity_box(self, ax, x, y, width, height, title, attributes, 
                         primary_keys=None, foreign_keys=None):
        """Create a professional entity box for ERD"""
        primary_keys = primary_keys or []
        foreign_keys = foreign_keys or []
        
        # Main entity box
        entity_box = FancyBboxPatch(
            (x, y), width, height,
            boxstyle="round,pad=0.02",
            facecolor=self.colors['light_gray'],
            edgecolor=self.colors['primary'],
            linewidth=2
        )
        ax.add_patch(entity_box)
        
        # Title section
        title_box = FancyBboxPatch(
            (x, y + height - 0.3), width, 0.3,
            boxstyle="round,pad=0.02",
            facecolor=self.colors['primary'],
            edgecolor=self.colors['primary'],
            linewidth=2
        )
        ax.add_patch(title_box)
        
        # Title text
        ax.text(x + width/2, y + height - 0.15, title, 
               ha='center', va='center', fontweight='bold', 
               color='white', fontsize=11)
        
        # Attributes
        attr_y = y + height - 0.5
        for attr in attributes:
            style = 'normal'
            color = self.colors['text']
            
            if attr in primary_keys:
                style = 'italic'
                color = self.colors['success']
                attr = f"PK: {attr}"
            elif attr in foreign_keys:
                style = 'italic'
                color = self.colors['warning']
                attr = f"FK: {attr}"
            
            ax.text(x + 0.1, attr_y, attr, 
                   ha='left', va='center', fontsize=9,
                   style=style, color=color)
            attr_y -= 0.25
    
    def create_relationship_line(self, ax, start_pos, end_pos, relationship_type="one-to-many", direction="forward"):
        """Create relationship lines between entities"""
        x1, y1 = start_pos
        x2, y2 = end_pos
        
        # Main relationship line
        ax.plot([x1, x2], [y1, y2], 
               color=self.colors['secondary'], linewidth=2)
        
        # Relationship symbols - direction matters for foreign keys
        if relationship_type == "one-to-many":
            if direction == "forward":
                # One side (circle) at start
                circle = plt.Circle((x1, y1), 0.05, 
                                  facecolor='white', 
                                  edgecolor=self.colors['secondary'], 
                                  linewidth=2)
                ax.add_patch(circle)
                
                # Many side (crow's foot) at end
                if x1 == x2:  # vertical line
                    if y2 > y1:  # pointing up
                        ax.plot([x2-0.05, x2, x2+0.05], [y2-0.1, y2, y2-0.1], 
                               color=self.colors['secondary'], linewidth=2)
                    else:  # pointing down
                        ax.plot([x2-0.05, x2, x2+0.05], [y2+0.1, y2, y2+0.1], 
                               color=self.colors['secondary'], linewidth=2)
                else:  # horizontal line
                    if x2 > x1:  # pointing right
                        ax.plot([x2-0.1, x2, x2-0.1], [y2-0.05, y2, y2+0.05], 
                               color=self.colors['secondary'], linewidth=2)
                    else:  # pointing left
                        ax.plot([x2+0.1, x2, x2+0.1], [y2-0.05, y2, y2+0.05], 
                               color=self.colors['secondary'], linewidth=2)
            else:  # reverse direction
                # Many side (crow's foot) at start
                if x1 == x2:  # vertical line
                    if y1 > y2:  # pointing down
                        ax.plot([x1-0.05, x1, x1+0.05], [y1-0.1, y1, y1-0.1], 
                               color=self.colors['secondary'], linewidth=2)
                    else:  # pointing up
                        ax.plot([x1-0.05, x1, x1+0.05], [y1+0.1, y1, y1+0.1], 
                               color=self.colors['secondary'], linewidth=2)
                else:  # horizontal line
                    if x1 > x2:  # pointing left
                        ax.plot([x1-0.1, x1, x1-0.1], [y1-0.05, y1, y1+0.05], 
                               color=self.colors['secondary'], linewidth=2)
                    else:  # pointing right
                        ax.plot([x1+0.1, x1, x1+0.1], [y1-0.05, y1, y1+0.05], 
                               color=self.colors['secondary'], linewidth=2)
                
                # One side (circle) at end
                circle = plt.Circle((x2, y2), 0.05, 
                                  facecolor='white', 
                                  edgecolor=self.colors['secondary'], 
                                  linewidth=2)
                ax.add_patch(circle)
    
    def generate_erd(self):
        """Generate Entity Relationship Diagram"""
        print("   Generating ERD...")
        
        fig, ax = plt.subplots(figsize=(16, 12))
        ax.set_xlim(0, 16)
        ax.set_ylim(0, 12)
        ax.set_aspect('equal')
        ax.axis('off')
        
        # User Entity
        self.create_entity_box(
            ax, 1, 8, 3, 3,
            "User",
            ["user_id", "email", "password_hash", "first_name", 
             "last_name", "phone", "date_joined", "is_active"],
            primary_keys=["user_id"]
        )
        
        # Member Entity
        self.create_entity_box(
            ax, 6, 8, 3, 3,
            "Member",
            ["member_id", "user_id", "membership_type", "start_date", 
             "end_date", "is_active", "emergency_contact"],
            primary_keys=["member_id"],
            foreign_keys=["user_id"]
        )
        
        # Subscription Entity
        self.create_entity_box(
            ax, 11, 8, 3, 3,
            "Subscription",
            ["subscription_id", "member_id", "plan_name", "price", 
             "billing_cycle", "start_date", "next_billing", "status"],
            primary_keys=["subscription_id"],
            foreign_keys=["member_id"]
        )
        
        # Class Entity
        self.create_entity_box(
            ax, 1, 4, 3, 3,
            "Class",
            ["class_id", "class_name", "description", "instructor_id", 
             "duration", "max_capacity", "difficulty_level"],
            primary_keys=["class_id"],
            foreign_keys=["instructor_id"]
        )
        
        # Schedule Entity
        self.create_entity_box(
            ax, 6, 4, 3, 3,
            "Schedule",
            ["schedule_id", "class_id", "date", "start_time", 
             "end_time", "room", "available_spots"],
            primary_keys=["schedule_id"],
            foreign_keys=["class_id"]
        )
        
        # Booking Entity
        self.create_entity_box(
            ax, 11, 4, 3, 3,
            "Booking",
            ["booking_id", "member_id", "schedule_id", "booking_date", 
             "status", "payment_status", "check_in_time"],
            primary_keys=["booking_id"],
            foreign_keys=["member_id", "schedule_id"]
        )
        
        # Instructor Entity
        self.create_entity_box(
            ax, 3.5, 0.5, 3, 2.5,
            "Instructor",
            ["instructor_id", "user_id", "specialization", 
             "certification", "hire_date", "hourly_rate"],
            primary_keys=["instructor_id"],
            foreign_keys=["user_id"]
        )
        
        # Relationships with correct directions (FK points to PK)
        self.create_relationship_line(ax, (4, 9.5), (6, 9.5), "one-to-many", "forward")  # User -> Member
        self.create_relationship_line(ax, (9, 9.5), (11, 9.5), "one-to-many", "forward")  # Member -> Subscription
        self.create_relationship_line(ax, (4, 5.5), (6, 5.5), "one-to-many", "forward")  # Class -> Schedule
        self.create_relationship_line(ax, (9, 5.5), (11, 5.5), "one-to-many", "forward")  # Schedule -> Booking
        self.create_relationship_line(ax, (7.5, 8), (7.5, 7), "one-to-many", "reverse")  # Member -> Booking (vertical)
        self.create_relationship_line(ax, (2.5, 4), (5, 3), "one-to-many", "reverse")  # Instructor -> Class (diagonal)
        self.create_relationship_line(ax, (2.5, 8), (5, 3), "one-to-many", "forward")  # User -> Instructor (diagonal)
        
        self.save_figure(fig, "pentagon_gym_erd", 
                        "Pentagon Gymnastics System - Entity Relationship Diagram")
        plt.close(fig)
    
    def generate_system_architecture(self):
        """Generate System Architecture Diagram"""
        print("   Generating System Architecture...")
        
        fig, ax = plt.subplots(figsize=(14, 10))
        ax.set_xlim(0, 14)
        ax.set_ylim(0, 10)
        ax.set_aspect('equal')
        ax.axis('off')
        
        # Presentation Layer
        presentation_box = FancyBboxPatch(
            (1, 7.5), 12, 2,
            boxstyle="round,pad=0.1",
            facecolor=self.colors['accent'],
            edgecolor=self.colors['primary'],
            linewidth=2
        )
        ax.add_patch(presentation_box)
        ax.text(7, 8.5, "Presentation Layer", ha='center', va='center', 
               fontweight='bold', fontsize=12)
        ax.text(3, 8, "Web Interface", ha='center', va='center', fontsize=10)
        ax.text(7, 8, "Mobile App", ha='center', va='center', fontsize=10)
        ax.text(11, 8, "Admin Dashboard", ha='center', va='center', fontsize=10)
        
        # Business Logic Layer
        business_box = FancyBboxPatch(
            (1, 5), 12, 2,
            boxstyle="round,pad=0.1",
            facecolor=self.colors['secondary'],
            edgecolor=self.colors['primary'],
            linewidth=2
        )
        ax.add_patch(business_box)
        ax.text(7, 6, "Business Logic Layer", ha='center', va='center', 
               fontweight='bold', fontsize=12, color='white')
        ax.text(2.5, 5.5, "User Management", ha='center', va='center', 
               fontsize=9, color='white')
        ax.text(5, 5.5, "Class Scheduling", ha='center', va='center', 
               fontsize=9, color='white')
        ax.text(7.5, 5.5, "Booking System", ha='center', va='center', 
               fontsize=9, color='white')
        ax.text(10, 5.5, "Payment Processing", ha='center', va='center', 
               fontsize=9, color='white')
        ax.text(11.5, 5.5, "Notifications", ha='center', va='center', 
               fontsize=9, color='white')
        
        # Data Access Layer
        data_box = FancyBboxPatch(
            (1, 2.5), 12, 2,
            boxstyle="round,pad=0.1",
            facecolor=self.colors['warning'],
            edgecolor=self.colors['primary'],
            linewidth=2
        )
        ax.add_patch(data_box)
        ax.text(7, 3.5, "Data Access Layer", ha='center', va='center', 
               fontweight='bold', fontsize=12, color='white')
        ax.text(4, 3, "ORM/Repository Pattern", ha='center', va='center', 
               fontsize=10, color='white')
        ax.text(10, 3, "Database Connections", ha='center', va='center', 
               fontsize=10, color='white')
        
        # Database Layer
        db_box = FancyBboxPatch(
            (1, 0.5), 12, 1.5,
            boxstyle="round,pad=0.1",
            facecolor=self.colors['primary'],
            edgecolor=self.colors['primary'],
            linewidth=2
        )
        ax.add_patch(db_box)
        ax.text(7, 1.25, "Database Layer", ha='center', va='center', 
               fontweight='bold', fontsize=12, color='white')
        ax.text(4, 0.8, "PostgreSQL Database", ha='center', va='center', 
               fontsize=10, color='white')
        ax.text(10, 0.8, "Redis Cache", ha='center', va='center', 
               fontsize=10, color='white')
        
        # Arrows between layers
        arrow_positions = [(7, 7.4), (7, 4.9), (7, 2.4)]
        for i in range(len(arrow_positions) - 1):
            start_y = arrow_positions[i][1]
            end_y = arrow_positions[i + 1][1] + 0.1
            
            arrow = FancyArrowPatch(
                (7, start_y), (7, end_y),
                arrowstyle='->',
                mutation_scale=20,
                color=self.colors['text'],
                linewidth=2
            )
            ax.add_patch(arrow)
        
        self.save_figure(fig, "pentagon_gym_system_architecture",
                        "Pentagon Gymnastics System - System Architecture")
        plt.close(fig)
    
    def generate_class_diagram(self):
        """Generate UML Class Diagram"""
        print("   Generating UML Class Diagram...")
        
        fig, ax = plt.subplots(figsize=(18, 14))
        ax.set_xlim(0, 18)
        ax.set_ylim(0, 14)
        ax.set_aspect('equal')
        ax.axis('off')
        
        # User Class
        self.create_uml_class(ax, 1, 10, 3.5, 3,
            "User",
            ["-user_id: int", "-email: string", "-password_hash: string", 
             "-first_name: string", "-last_name: string", "-phone: string"],
            ["+register(): boolean", "+login(): boolean", "+logout(): void", 
             "+updateProfile(): boolean"]
        )
        
        # Member Class
        self.create_uml_class(ax, 6, 10, 3.5, 3,
            "Member",
            ["-member_id: int", "-membership_type: string", "-start_date: date", 
             "-end_date: date", "-is_active: boolean"],
            ["+subscribe(): boolean", "+cancelSubscription(): boolean", 
             "+bookClass(): boolean", "+viewBookings(): List<Booking>"]
        )
        
        # Instructor Class
        self.create_uml_class(ax, 11, 10, 3.5, 3,
            "Instructor",
            ["-instructor_id: int", "-specialization: string", 
             "-certification: string", "-hourly_rate: decimal"],
            ["+createClass(): boolean", "+updateSchedule(): boolean", 
             "+viewStudents(): List<Member>", "+markAttendance(): void"]
        )
        
        # Class
        self.create_uml_class(ax, 1, 6, 3.5, 3,
            "GymClass",
            ["-class_id: int", "-class_name: string", "-description: string", 
             "-duration: int", "-max_capacity: int", "-difficulty_level: string"],
            ["+addSchedule(): boolean", "+updateCapacity(): void", 
             "+getAvailableSpots(): int", "+isAvailable(): boolean"]
        )
        
        # Schedule Class
        self.create_uml_class(ax, 6, 6, 3.5, 3,
            "Schedule",
            ["-schedule_id: int", "-date: date", "-start_time: time", 
             "-end_time: time", "-room: string", "-available_spots: int"],
            ["+bookSpot(): boolean", "+cancelBooking(): boolean", 
             "+checkAvailability(): boolean", "+updateRoom(): void"]
        )
        
        # Booking Class
        self.create_uml_class(ax, 11, 6, 3.5, 3,
            "Booking",
            ["-booking_id: int", "-booking_date: datetime", "-status: string", 
             "-payment_status: string", "-check_in_time: datetime"],
            ["+confirm(): boolean", "+cancel(): boolean", "+checkIn(): void", 
             "+processPayment(): boolean"]
        )
        
        # Subscription Class
        self.create_uml_class(ax, 6, 2, 3.5, 3,
            "Subscription",
            ["-subscription_id: int", "-plan_name: string", "-price: decimal", 
             "-billing_cycle: string", "-next_billing: date"],
            ["+renew(): boolean", "+cancel(): boolean", "+updatePlan(): boolean", 
             "+processPayment(): boolean"]
        )
        
        # Relationships with correct directions and types
        self.create_uml_relationship(ax, (4.5, 11.5), (2.75, 11.5), "inherits", "")  # Member inherits from User
        self.create_uml_relationship(ax, (11, 11.5), (2.75, 11.5), "inherits", "")  # Instructor inherits from User  
        self.create_uml_relationship(ax, (7.75, 10), (7.75, 5), "composition", "1..*")  # Member has Subscription
        self.create_uml_relationship(ax, (2.75, 10), (2.75, 9), "aggregation", "1..*")  # Instructor teaches Classes
        self.create_uml_relationship(ax, (4.5, 7.5), (6, 7.5), "composition", "1..*")  # Class has Schedules
        self.create_uml_relationship(ax, (9.5, 7.5), (12.75, 7.5), "association", "1..*")  # Schedule creates Bookings
        self.create_uml_relationship(ax, (7.75, 10), (12.75, 9), "association", "1..*")  # Member makes Bookings
        
        self.save_figure(fig, "pentagon_gym_class_diagram",
                        "Pentagon Gymnastics System - UML Class Diagram")
        plt.close(fig)
    
    def create_uml_class(self, ax, x, y, width, height, class_name, attributes, methods):
        """Create a UML class box"""
        # Main class box
        class_box = FancyBboxPatch(
            (x, y), width, height,
            boxstyle="square,pad=0.02",
            facecolor=self.colors['light_gray'],
            edgecolor=self.colors['primary'],
            linewidth=2
        )
        ax.add_patch(class_box)
        
        # Class name section
        name_height = 0.4
        name_box = Rectangle(
            (x, y + height - name_height), width, name_height,
            facecolor=self.colors['primary'],
            edgecolor=self.colors['primary']
        )
        ax.add_patch(name_box)
        
        ax.text(x + width/2, y + height - name_height/2, class_name,
               ha='center', va='center', fontweight='bold', 
               color='white', fontsize=11)
        
        # Separator line
        ax.plot([x, x + width], [y + height - name_height - 0.05, y + height - name_height - 0.05],
               color=self.colors['primary'], linewidth=1)
        
        # Attributes section
        attr_y = y + height - name_height - 0.2
        for attr in attributes:
            ax.text(x + 0.1, attr_y, attr, ha='left', va='center', 
                   fontsize=8, color=self.colors['text'])
            attr_y -= 0.2
        
        # Methods separator
        methods_start_y = attr_y - 0.1
        ax.plot([x, x + width], [methods_start_y, methods_start_y],
               color=self.colors['primary'], linewidth=1)
        
        # Methods section
        method_y = methods_start_y - 0.2
        for method in methods:
            ax.text(x + 0.1, method_y, method, ha='left', va='center',
                   fontsize=8, color=self.colors['text'])
            method_y -= 0.2
    
    def create_uml_relationship(self, ax, start_pos, end_pos, relationship_type, multiplicity):
        """Create UML relationship lines with correct directional arrows"""
        x1, y1 = start_pos
        x2, y2 = end_pos
        
        # Relationship line
        ax.plot([x1, x2], [y1, y2], color=self.colors['secondary'], linewidth=2)
        
        # Arrow based on relationship type
        if relationship_type == "inherits":
            # Inheritance arrow (hollow triangle pointing to parent)
            # Calculate direction vector
            dx = x2 - x1
            dy = y2 - y1
            length = np.sqrt(dx**2 + dy**2)
            
            if length > 0:
                # Normalize direction
                ux = dx / length
                uy = dy / length
                
                # Triangle points toward parent (end position)
                triangle_x = x2 - 0.15 * ux
                triangle_y = y2 - 0.15 * uy
                
                # Create triangle pointing in direction of parent
                triangle = mpatches.RegularPolygon((triangle_x, triangle_y), 3, radius=0.1,
                                                 orientation=np.arctan2(uy, ux) + np.pi/2,
                                                 facecolor='white', 
                                                 edgecolor=self.colors['secondary'],
                                                 linewidth=2)
                ax.add_patch(triangle)
        elif relationship_type == "composition":
            # Composition (filled diamond at owner end)
            diamond = mpatches.RegularPolygon((x1, y1), 4, radius=0.08,
                                            orientation=np.pi/4,
                                            facecolor=self.colors['secondary'], 
                                            edgecolor=self.colors['secondary'],
                                            linewidth=2)
            ax.add_patch(diamond)
            
            # Arrow at the other end
            arrow = FancyArrowPatch(
                (x1, y1), (x2, y2),
                arrowstyle='->',
                mutation_scale=15,
                color=self.colors['secondary'],
                linewidth=2
            )
            ax.add_patch(arrow)
        elif relationship_type == "aggregation":
            # Aggregation (hollow diamond at owner end)
            diamond = mpatches.RegularPolygon((x1, y1), 4, radius=0.08,
                                            orientation=np.pi/4,
                                            facecolor='white', 
                                            edgecolor=self.colors['secondary'],
                                            linewidth=2)
            ax.add_patch(diamond)
            
            # Arrow at the other end
            arrow = FancyArrowPatch(
                (x1, y1), (x2, y2),
                arrowstyle='->',
                mutation_scale=15,
                color=self.colors['secondary'],
                linewidth=2
            )
            ax.add_patch(arrow)
        else:
            # Association arrow (points from dependent to independent)
            arrow = FancyArrowPatch(
                (x1, y1), (x2, y2),
                arrowstyle='->',
                mutation_scale=15,
                color=self.colors['secondary'],
                linewidth=2
            )
            ax.add_patch(arrow)
        
        # Multiplicity label
        mid_x, mid_y = (x1 + x2) / 2, (y1 + y2) / 2
        ax.text(mid_x, mid_y + 0.1, multiplicity, ha='center', va='center',
               fontsize=9, bbox=dict(boxstyle="round,pad=0.3", 
                                   facecolor='white', alpha=0.8))
    
    def generate_sequence_diagram(self, filename, title, actors, interactions):
        """Generate sequence diagram"""
        print(f"   Generating {title}...")
        
        fig, ax = plt.subplots(figsize=(16, 10))
        ax.set_xlim(0, 16)
        ax.set_ylim(0, 10)
        ax.axis('off')
        
        # Actor positions
        actor_positions = {}
        x_start = 2
        x_spacing = 3
        
        # Draw actors
        for i, actor in enumerate(actors):
            x = x_start + i * x_spacing
            actor_positions[actor] = x
            
            # Actor box
            actor_box = FancyBboxPatch(
                (x - 0.6, 8.5), 1.2, 0.8,
                boxstyle="round,pad=0.1",
                facecolor=self.colors['primary'],
                edgecolor=self.colors['primary'],
                linewidth=2
            )
            ax.add_patch(actor_box)
            
            ax.text(x, 8.9, actor, ha='center', va='center',
                   fontweight='bold', color='white', fontsize=9)
            
            # Lifeline
            ax.plot([x, x], [8.5, 1], color=self.colors['medium_gray'], 
                   linewidth=2, linestyle='--')
        
        # Draw interactions
        y_pos = 7.5
        for interaction in interactions:
            from_actor, to_actor, message, message_type = interaction
            
            from_x = actor_positions[from_actor]
            to_x = actor_positions[to_actor]
            
            # Message arrow - ensure proper direction for return messages
            if message_type == "sync":
                arrow_style = '->'
                line_style = '-'
                # Standard sync call: from -> to
                start_x, end_x = from_x, to_x
            elif message_type == "async":
                arrow_style = '->'
                line_style = '--'
                # Async call: from -> to
                start_x, end_x = from_x, to_x
            else:  # return
                arrow_style = '<-'
                line_style = ':'
                # Return message: to <- from (reverse direction)
                start_x, end_x = to_x, from_x
            
            arrow = FancyArrowPatch(
                (start_x, y_pos), (end_x, y_pos),
                arrowstyle=arrow_style,
                mutation_scale=15,
                color=self.colors['secondary'],
                linewidth=2,
                linestyle=line_style
            )
            ax.add_patch(arrow)
            
            # Message label
            mid_x = (from_x + to_x) / 2
            ax.text(mid_x, y_pos + 0.15, message, ha='center', va='bottom',
                   fontsize=9, bbox=dict(boxstyle="round,pad=0.3",
                                       facecolor='white', alpha=0.9))
            
            y_pos -= 0.8
        
        self.save_figure(fig, filename, title)
        plt.close(fig)
    
    def generate_all_sequence_diagrams(self):
        """Generate all sequence diagrams"""
        # User Registration Sequence
        self.generate_sequence_diagram(
            "pentagon_gym_registration_sequence",
            "Pentagon Gymnastics - User Registration Sequence",
            ["User", "Web App", "Auth Service", "Database"],
            [
                ("User", "Web App", "1: Enter registration details", "sync"),
                ("Web App", "Auth Service", "2: Validate user data", "sync"),
                ("Auth Service", "Database", "3: Check email exists", "sync"),
                ("Database", "Auth Service", "4: Email available", "return"),
                ("Auth Service", "Database", "5: Create user record", "sync"),
                ("Database", "Auth Service", "6: User created", "return"),
                ("Auth Service", "Web App", "7: Registration successful", "return"),
                ("Web App", "User", "8: Show success message", "sync")
            ]
        )
        
        # Class Booking Sequence
        self.generate_sequence_diagram(
            "pentagon_gym_booking_sequence", 
            "Pentagon Gymnastics - Class Booking Sequence",
            ["Member", "Web App", "Booking Service", "Payment Service", "Database"],
            [
                ("Member", "Web App", "1: Select class", "sync"),
                ("Web App", "Booking Service", "2: Check availability", "sync"),
                ("Booking Service", "Database", "3: Query available spots", "sync"),
                ("Database", "Booking Service", "4: Return availability", "return"),
                ("Booking Service", "Payment Service", "5: Process payment", "sync"),
                ("Payment Service", "Booking Service", "6: Payment confirmed", "return"),
                ("Booking Service", "Database", "7: Create booking", "sync"),
                ("Database", "Booking Service", "8: Booking confirmed", "return"),
                ("Booking Service", "Web App", "9: Booking successful", "return"),
                ("Web App", "Member", "10: Show confirmation", "sync")
            ]
        )
        
        # Subscription Management Sequence
        self.generate_sequence_diagram(
            "pentagon_gym_subscription_sequence",
            "Pentagon Gymnastics - Subscription Management Sequence", 
            ["Member", "Web App", "Subscription Service", "Billing System", "Database"],
            [
                ("Member", "Web App", "1: Choose subscription plan", "sync"),
                ("Web App", "Subscription Service", "2: Create subscription", "sync"),
                ("Subscription Service", "Billing System", "3: Setup recurring billing", "sync"),
                ("Billing System", "Subscription Service", "4: Billing setup complete", "return"),
                ("Subscription Service", "Database", "5: Save subscription", "sync"),
                ("Database", "Subscription Service", "6: Subscription saved", "return"),
                ("Subscription Service", "Web App", "7: Subscription active", "return"),
                ("Web App", "Member", "8: Show subscription details", "sync")
            ]
        )
    
    def generate_all_diagrams(self):
        """Generate all professional academic diagrams"""
        print("\n📊 GENERATING PROFESSIONAL ACADEMIC DIAGRAMS")
        print("-" * 50)
        
        # Generate static diagrams
        self.generate_erd()
        self.generate_system_architecture()
        self.generate_class_diagram()
        
        # Generate sequence diagrams
        print("\n🔄 GENERATING SEQUENCE DIAGRAMS")
        print("-" * 30)
        self.generate_all_sequence_diagrams()

def check_requirements():
    """Check if required packages are installed"""
    try:
        import matplotlib
        import numpy
        print("✓ All required packages are installed")
        return True
    except ImportError as e:
        print(f"✗ Missing required package: {e}")
        print("Please install requirements: pip install matplotlib numpy")
        return False

def main():
    """Generate all diagrams for Pentagon Gymnastics system"""
    print("=" * 80)
    print("Pentagon Gymnastics System - Professional Academic Diagram Generator")
    print("=" * 80)
    print("Generating publication-quality UML and ERD diagrams for dissertation use")
    print()
    
    # Check requirements
    if not check_requirements():
        return 1
    
    try:
        # Initialize diagram generator
        generator = AcademicDiagramGenerator()
        
        # Generate all diagrams
        generator.generate_all_diagrams()
        
        # Success summary
        print("\n" + "=" * 80)
        print("🎉 ALL PROFESSIONAL ACADEMIC DIAGRAMS GENERATED SUCCESSFULLY!")
        print("=" * 80)
        print(f"\n📁 Output Location: {os.path.abspath(generator.output_dir)}/")
        print("\n📄 Generated Files (PNG & PDF formats):")
        print("\n   📊 Entity Relationship Diagram:")
        print("   • pentagon_gym_erd.png/pdf - Complete database schema")
        
        print("\n   🏗️  System Architecture:")
        print("   • pentagon_gym_system_architecture.png/pdf - Layered architecture")
        
        print("\n   📋 UML Class Diagram:")
        print("   • pentagon_gym_class_diagram.png/pdf - Object-oriented design")
        
        print("\n   🔄 UML Sequence Diagrams:")
        print("   • pentagon_gym_registration_sequence.png/pdf - User registration flow")
        print("   • pentagon_gym_booking_sequence.png/pdf - Class booking process")
        print("   • pentagon_gym_subscription_sequence.png/pdf - Subscription management")
        
        print("\n" + "✅" * 3 + " ACADEMIC QUALITY FEATURES " + "✅" * 3)
        print("✅ High resolution (300 DPI) for print publication")
        print("✅ Professional color scheme suitable for academic work")
        print("✅ Both PNG (digital) and PDF (print) formats provided")
        print("✅ Academic serif fonts (Times New Roman)")
        print("✅ Proper UML notation and ERD standards")
        print("✅ Clear, readable labels and annotations")
        print("✅ Consistent styling across all diagrams")
        print("✅ Suitable for thesis, dissertation, or research publication")
        
        print(f"\n📝 Citation Format:")
        print(f"   Figure X: Pentagon Gymnastics System [Diagram Type]")
        print(f"   Source: Generated on {datetime.now().strftime('%B %d, %Y')}")
        
        print("\n🎓 Ready for academic submission!")
        
    except Exception as e:
        print(f"\n❌ Error generating diagrams: {e}")
        print("Please check the error message and try again.")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())