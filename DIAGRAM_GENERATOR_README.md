# Pentagon Gymnastics - Diagram Generator Documentation

## Overview

This documentation covers the Python scripts created to generate professional UML and ERD diagrams for the Pentagon Gymnastics system dissertation. The diagrams are designed to meet academic standards and provide comprehensive visual documentation of the system architecture.

## Files Included

### 1. `generate_all_diagrams.py` - Master Script
**Purpose**: Main script that generates all diagrams in one run
**Usage**: 
```bash
python generate_all_diagrams.py
```

### 2. `diagram_generator.py` - Static Diagrams
**Purpose**: Generates ERD, System Architecture, and Class diagrams
**Diagrams Generated**:
- **Entity Relationship Diagram (ERD)**: Database schema with relationships
- **System Architecture**: Layered architecture visualization  
- **UML Class Diagram**: Key classes with attributes and methods

### 3. `sequence_diagram_generator.py` - Dynamic Diagrams
**Purpose**: Generates UML sequence diagrams for key workflows
**Diagrams Generated**:
- **User Registration Sequence**: Complete user registration flow
- **Class Booking Sequence**: Session booking workflow with validation
- **Subscription Creation Sequence**: Payment and subscription setup

### 4. `requirements.txt` - Dependencies
**Purpose**: Lists required Python packages
**Contents**:
```
matplotlib>=3.7.0
numpy>=1.24.0  
Pillow>=9.5.0
```

## Installation & Setup

### Step 1: Install Python Dependencies
```bash
# Install required packages
pip install -r requirements.txt

# Verify installation
python -c "import matplotlib, numpy; print('Dependencies installed successfully')"
```

### Step 2: Run Diagram Generation
```bash
# Generate all diagrams
python generate_all_diagrams.py

# Or generate specific diagram types
python diagram_generator.py        # Static diagrams only
python sequence_diagram_generator.py  # Sequence diagrams only
```

## Output Details

### Generated Files Structure
```
dissertation_diagrams/
├── pentagon_gym_erd.png                    # Entity Relationship Diagram
├── pentagon_gym_erd.pdf
├── pentagon_gym_system_architecture.png    # System Architecture  
├── pentagon_gym_system_architecture.pdf
├── pentagon_gym_class_diagram.png          # UML Class Diagram
├── pentagon_gym_class_diagram.pdf
├── pentagon_gym_registration_sequence.png  # Registration Sequence
├── pentagon_gym_registration_sequence.pdf
├── pentagon_gym_booking_sequence.png       # Booking Sequence
├── pentagon_gym_booking_sequence.pdf
├── pentagon_gym_subscription_sequence.png  # Subscription Sequence
└── pentagon_gym_subscription_sequence.pdf
```

### File Formats
- **PNG Files**: High resolution (300 DPI) for web display and presentations
- **PDF Files**: Vector format for print publications and academic submissions

## Diagram Details

### 1. Entity Relationship Diagram (ERD)
**Features**:
- Complete database schema visualization
- Primary keys highlighted in orange
- Foreign keys highlighted in pink  
- Relationship cardinalities (1:1, 1:N, M:N)
- All entities: User, Class, Session, Booking, Package, Subscription, etc.

**Academic Use**: Database design section, data modeling discussion

### 2. System Architecture Diagram
**Features**:
- 5-layer architecture visualization
- Component breakdown within each layer
- Technology stack identification
- External system integration points
- Deployment information

**Academic Use**: Architecture section, technology choices justification

### 3. UML Class Diagram  
**Features**:
- Key system classes with stereotypes
- Attributes and methods for each class
- Relationships between classes (uses, manages, etc.)
- Color-coded by component type (Controller, Model, Service, DAO)

**Academic Use**: Object-oriented design section, implementation details

### 4. Registration Sequence Diagram
**Features**:
- Complete user registration workflow
- Frontend-backend interaction
- Password hashing and JWT token generation
- Database transactions
- Error handling flows

**Academic Use**: User management process documentation

### 5. Booking Sequence Diagram
**Features**:
- Class booking workflow with authentication
- Subscription eligibility checking
- Capacity validation
- Notification system integration
- Alternative flows for error cases

**Academic Use**: Core business process documentation

### 6. Subscription Sequence Diagram
**Features**:
- Payment processing workflow
- Subscription creation and activation
- Transaction logging
- Simulated payment system interaction

**Academic Use**: Business logic and payment integration

## Customization Options

### Color Scheme Modification
Edit the `colors` dictionary in each generator class:
```python
self.colors = {
    'entity': '#E8F4FD',           # Light blue for entities
    'entity_border': '#2196F3',    # Blue borders
    'class': '#FFF3E0',            # Light orange for classes
    'class_border': '#FF9800',     # Orange borders
    # ... customize as needed
}
```

### Diagram Size Adjustment
Modify the `figsize` parameter:
```python
fig, ax = plt.subplots(1, 1, figsize=(20, 16))  # Width, Height in inches
```

### Resolution Settings
Change DPI for different output quality:
```python
plt.savefig('diagram.png', dpi=300)  # 300 DPI for print quality
plt.savefig('diagram.png', dpi=150)  # 150 DPI for web quality
```

## Troubleshooting

### Common Issues

**Issue**: "ModuleNotFoundError: No module named 'matplotlib'"
**Solution**: 
```bash
pip install matplotlib numpy pillow
```

**Issue**: "Permission denied" when saving files
**Solution**: 
- Run script as administrator (Windows)
- Check directory permissions
- Ensure output directory is writable

**Issue**: Diagrams appear cut off
**Solution**:
- Increase figure size in the code
- Use `bbox_inches='tight'` parameter (already included)

**Issue**: Text too small/large
**Solution**:
- Modify `fontsize` parameters in the code
- Adjust figure dimensions proportionally

### Performance Considerations
- Large diagrams may take 10-30 seconds to generate
- PDF generation is slower than PNG
- Memory usage increases with diagram complexity

## Academic Integration

### Dissertation Sections
These diagrams are suitable for:
- **Chapter 3**: System Design and Architecture
- **Chapter 4**: Implementation Details  
- **Chapter 5**: Database Design
- **Appendices**: Technical Documentation

### Citation Example
```
Figure 3.1: Pentagon Gymnastics Entity Relationship Diagram
(Generated using custom Python visualization scripts, 2025)
```

### Quality Standards
- 300 DPI resolution meets academic publication standards
- Professional color scheme suitable for printed documents
- Clear labeling and annotations for academic readability
- Consistent formatting across all diagrams

## Maintenance

### Adding New Diagrams
1. Create new method in appropriate generator class
2. Follow existing naming conventions
3. Use consistent color scheme and styling
4. Add to the main generation loop

### Updating Existing Diagrams
1. Modify the relevant generator method
2. Test output quality and readability
3. Ensure all text fits within boundaries
4. Verify PDF and PNG outputs

---

**Generated**: August 8, 2025  
**Version**: 1.0  
**Author**: Pentagon Gymnastics Development Team  
**Purpose**: Academic dissertation documentation
