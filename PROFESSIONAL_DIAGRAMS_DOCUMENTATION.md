# Pentagon Gymnastics System - Professional Diagrams Documentation

## Overview

This document provides comprehensive documentation for the professional UML and ERD diagrams created for the Pentagon Gymnastics Management System. These diagrams are designed for academic dissertation purposes and professional system documentation.

## Generated Diagrams

### 1. Entity Relationship Diagram (ERD)
- **File**: `pentagon_gym_comprehensive_erd.png/pdf`
- **Purpose**: Shows the complete database schema and relationships
- **Key Features**:
  - 16 normalized entities based on Prisma schema
  - Primary key and foreign key relationships
  - Cardinality notations (1:1, 1:M, M:M)
  - Complete attribute specifications

### 2. UML Class Diagram
- **File**: `pentagon_gym_comprehensive_uml.png/pdf`
- **Purpose**: Represents the object-oriented design of the system
- **Key Features**:
  - Domain classes and controller classes
  - Inheritance relationships
  - Association and composition relationships
  - Method and attribute specifications
  - Stereotype annotations for controllers

### 3. System Architecture Diagram
- **File**: `pentagon_gym_system_architecture.png/pdf`
- **Purpose**: Shows the multi-layered system architecture
- **Key Features**:
  - Frontend layer (React/TypeScript)
  - Middleware and security layer
  - Business logic layer (Controllers)
  - Data access layer (Prisma ORM)
  - Database layer (PostgreSQL)
  - External services integration

### 4. Sequence Diagrams

#### User Registration Sequence
- **File**: `pentagon_gym_registration_sequence.png/pdf`
- **Purpose**: Details the user registration process flow
- **Participants**: User, Frontend, AuthController, Prisma ORM, PostgreSQL

#### Class Booking Sequence
- **File**: `pentagon_gym_booking_sequence.png/pdf`
- **Purpose**: Shows the complete booking process
- **Participants**: Member, Frontend, BookingController, SessionController, Prisma ORM, Database

#### Subscription Process Sequence
- **File**: `pentagon_gym_subscription_sequence.png/pdf`
- **Purpose**: Illustrates subscription purchase and payment flow
- **Participants**: Member, Frontend, SubscriptionController, PaymentController, SimulatedPayment, Database

## Database Schema Details

### Core Entities

#### User (Abstract Base)
- **Primary Key**: id (Int)
- **Unique Constraints**: email
- **Key Attributes**: forename, surname, email, password, role, address, dateOfBirth, phoneNumber
- **Relationships**: One-to-many with Subscription, Booking, GearOrder, Transaction, ActivityLog

#### Class Management
- **Class**: Defines gymnastics classes with name, description
- **Session**: Specific time slots for classes with capacity management
- **Booking**: Links users to specific sessions

#### Subscription Management
- **Package**: Defines subscription tiers (Basic, Standard, Premium)
- **Subscription**: User subscriptions with status, dates, and protein supplement options
- **PackageClass**: Many-to-many relationship between packages and classes

#### Payment System
- **Payment**: Real payment processing records
- **SimulatedPayment**: Test payment simulation for development
- **SimulatedCard**: Test payment cards for simulation
- **Transaction**: Comprehensive transaction logging

#### Equipment Management
- **GearItem**: Gymnastics equipment for sale
- **GearOrder**: Customer orders for equipment
- **GearOrderItem**: Individual items within orders

#### Audit and Logging
- **ActivityLog**: User activity tracking
- **TransactionCategory**: Transaction categorization

## Technical Architecture

### Frontend Layer
- **Technology**: React 18 with TypeScript
- **Build System**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router DOM with protected routes

### Backend Layer
- **Framework**: Express.js with TypeScript
- **Database ORM**: Prisma
- **Authentication**: JWT tokens
- **API Design**: RESTful endpoints
- **Middleware**: CORS, authentication, validation

### Database Layer
- **Database**: PostgreSQL
- **Schema Management**: Prisma migrations
- **Data Integrity**: Foreign key constraints, unique constraints
- **Performance**: Indexed columns, optimized queries

### Security Features
- **Authentication**: JWT token-based authentication
- **Authorization**: Role-based access control (user, admin)
- **Data Validation**: Input validation and sanitization
- **Password Security**: bcrypt hashing
- **API Security**: Rate limiting, CORS configuration

## Business Logic

### User Management
1. **Registration**: Email validation, age verification (16+), password hashing
2. **Authentication**: Secure login with JWT tokens
3. **Profile Management**: Update personal information with validation

### Subscription System
1. **Package Selection**: Three tiers with different pricing and class access
2. **Payment Processing**: Simulated payment gateway for testing
3. **Subscription Management**: Activation, cancellation, upgrades/downgrades
4. **Protein Supplements**: Optional add-on service

### Class Booking
1. **Class Discovery**: Browse available classes and sessions
2. **Capacity Management**: Prevent overbooking with real-time capacity checking
3. **Booking Validation**: Ensure valid subscription and class access
4. **Booking Management**: Create, view, and cancel bookings

### Equipment Store
1. **Product Catalog**: Gymnastics equipment with categories and pricing
2. **Order Management**: Shopping cart functionality with customization
3. **Inventory Tracking**: Stock management and availability checking
4. **Order Processing**: Payment integration and order fulfillment

### Payment Processing
1. **Simulated Gateway**: Test payment processing without real transactions
2. **Card Validation**: Simulate various payment scenarios
3. **Transaction Logging**: Comprehensive audit trail
4. **Failure Simulation**: Test error handling and recovery

## Data Flow Patterns

### Request-Response Cycle
1. **Frontend**: User interaction triggers API request
2. **Middleware**: Authentication and validation
3. **Controller**: Business logic processing
4. **Service Layer**: Data manipulation and validation
5. **ORM**: Database query execution
6. **Database**: Data persistence and retrieval
7. **Response**: Data return through the same layers

### Error Handling
- **Validation Errors**: Input validation at multiple layers
- **Business Logic Errors**: Domain-specific error handling
- **Database Errors**: Transaction rollback and error recovery
- **API Errors**: Standardized error response format

## Scalability Considerations

### Database Design
- **Normalization**: Third normal form compliance
- **Indexing**: Strategic indexes on frequently queried columns
- **Relationships**: Efficient foreign key relationships
- **Constraints**: Data integrity enforcement

### API Design
- **RESTful Principles**: Standard HTTP methods and status codes
- **Pagination**: Efficient data retrieval for large datasets
- **Caching**: Response caching for improved performance
- **Rate Limiting**: API abuse prevention

### Security Scalability
- **Token Management**: Stateless JWT authentication
- **Role-Based Access**: Scalable permission system
- **Input Validation**: Comprehensive data sanitization
- **Audit Logging**: Complete activity tracking

## Future Enhancements

### Technical Improvements
1. **Real Payment Integration**: Stripe or PayPal integration
2. **Mobile Application**: React Native implementation
3. **Real-time Features**: WebSocket integration for live updates
4. **Advanced Analytics**: Dashboard with business intelligence
5. **Notification System**: Email and SMS notifications
6. **File Upload**: Profile pictures and document management

### Business Features
1. **Advanced Scheduling**: Recurring class schedules
2. **Instructor Management**: Schedule management for instructors
3. **Loyalty Programs**: Points and rewards system
4. **Group Bookings**: Family and corporate packages
5. **Waiting Lists**: Automatic booking when capacity available
6. **Refund System**: Automated refund processing

## Academic Significance

### Software Engineering Principles
- **Separation of Concerns**: Clear layer separation
- **Single Responsibility**: Each class has one responsibility
- **Open/Closed Principle**: Extensible design patterns
- **Dependency Injection**: Loose coupling between components

### Database Design Principles
- **ACID Compliance**: Transaction integrity
- **Referential Integrity**: Foreign key constraints
- **Data Consistency**: Normalized schema design
- **Performance Optimization**: Strategic indexing

### Security Best Practices
- **Authentication**: Industry-standard JWT implementation
- **Authorization**: Role-based access control
- **Data Protection**: Encrypted password storage
- **Input Validation**: SQL injection prevention

## Conclusion

The Pentagon Gymnastics Management System represents a comprehensive, professionally designed application that demonstrates modern web development practices, secure coding principles, and scalable architecture patterns. The accompanying diagrams provide visual documentation suitable for academic dissertation purposes and professional system documentation.

The system successfully integrates multiple complex subsystems including user management, subscription handling, class booking, payment processing, and equipment sales, all built on a solid foundation of modern technologies and best practices.

---

**Generated**: August 8, 2025  
**Version**: 1.0  
**Purpose**: Academic Dissertation and Professional Documentation
