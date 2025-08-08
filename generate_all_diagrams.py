"""
Pentagon Gymnastics System - Complete Diagram Generator
Generates all UML and ERD diagrams for dissertation
Author: Pentagon Gymnastics Development Team
Date: August 8, 2025
"""

import os
import sys
from diagram_generator import DiagramGenerator
from sequence_diagram_generator import SequenceDiagramGenerator

def check_requirements():
    """Check if required packages are installed"""
    try:
        import matplotlib
        import numpy
        print("✓ All required packages are installed")
        return True
    except ImportError as e:
        print(f"✗ Missing required package: {e}")
        print("Please install requirements: pip install -r requirements.txt")
        return False

def main():
    """Generate all diagrams for Pentagon Gymnastics system"""
    print("=" * 70)
    print("Pentagon Gymnastics System - Complete Diagram Generator")
    print("=" * 70)
    print("Generating professional UML and ERD diagrams for dissertation use")
    print()
    
    # Check requirements
    if not check_requirements():
        return
    
    # Create output directory
    output_dir = 'dissertation_diagrams'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"✓ Created output directory: {output_dir}/")
    
    try:
        # Generate static diagrams (ERD, Architecture, Class)
        print("\n📊 GENERATING STATIC DIAGRAMS")
        print("-" * 40)
        diagram_gen = DiagramGenerator()
        diagram_gen.generate_all_diagrams()
        
        # Generate sequence diagrams
        print("\n🔄 GENERATING SEQUENCE DIAGRAMS")
        print("-" * 40)
        sequence_gen = SequenceDiagramGenerator()
        sequence_gen.generate_all_sequence_diagrams()
        
        # Summary
        print("\n" + "=" * 70)
        print("🎉 ALL DIAGRAMS GENERATED SUCCESSFULLY!")
        print("=" * 70)
        print(f"\n📁 Output Location: {os.path.abspath(output_dir)}/")
        print("\n📄 Generated Files:")
        print("   Static Diagrams:")
        print("   • pentagon_gym_erd.png/pdf - Entity Relationship Diagram")
        print("   • pentagon_gym_system_architecture.png/pdf - System Architecture")
        print("   • pentagon_gym_class_diagram.png/pdf - UML Class Diagram")
        print("\n   Sequence Diagrams:")
        print("   • pentagon_gym_registration_sequence.png/pdf - User Registration Flow")
        print("   • pentagon_gym_booking_sequence.png/pdf - Class Booking Flow")
        print("   • pentagon_gym_subscription_sequence.png/pdf - Subscription Creation Flow")
        
        print("\n✅ These diagrams are ready for inclusion in your dissertation!")
        print("✅ All diagrams are saved in both PNG (for web) and PDF (for print) formats")
        print("✅ High resolution (300 DPI) suitable for academic publications")
        
    except Exception as e:
        print(f"\n❌ Error generating diagrams: {e}")
        print("Please check the error message and try again.")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
