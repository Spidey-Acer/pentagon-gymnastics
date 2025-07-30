# ABC Gymnastics Web Application

## Overview

This repository contains the source code for a comprehensive web application developed for ABC Gymnastics, a burgeoning gym company poised to enter the fitness market with an exceptional array of offerings. As a professional software design and development project, this platform serves as a centralized business hub, streamlining all operational processes and facilitating seamless interactions between the gym, its instructors, and clientele. The application is meticulously crafted to align with the client's specifications, leveraging technologies covered in the Software Design and Development module at Ravensbourne University London.

The core objective is to provide an intuitive, user-friendly interface that manages fitness class bookings, session scheduling, member registrations, and administrative tasks, thereby enhancing operational efficiency and user satisfaction.

## Project Description

ABC Gymnastics aims to distinguish itself by offering a diverse selection of fitness classes, including:
- Yoga
- Spin
- Boot Camp
- Barre
- Pilates
- Orangetheory
- CrossFit
- Hybrid Classes

The gym operates across three daily sessions to accommodate varying schedules:
- **Morning Session**: Commencing at 6:00 AM (precise timings to be confirmed and implemented based on client clarification; current documentation indicates potential OCR artifacts suggesting 6:00 AM start).
- **Afternoon Session**: Tailored for midday participants.
- **Evening Session**: Designed for post-work attendees.

This web application handles end-to-end business operations, from class enrollment and session management to payment processing and reporting, ensuring a robust platform for growth in the competitive fitness industry.

## Features

- **User Registration and Authentication**: Secure sign-up and login for members, instructors, and administrators.
- **Class Catalog and Booking System**: Browse available classes, view schedules, and book sessions with real-time availability checks.
- **Session Management**: Administrative tools to create, update, and cancel sessions across morning, afternoon, and evening slots.
- **Admin Dashboard**: Comprehensive analytics dashboard for gym management with user, session, and booking insights.
- **User Management**: Admin tools to manage user roles and permissions.
- **Capacity Management**: Real-time session capacity monitoring and adjustment capabilities.
- **Dashboard and Analytics**: Personalized dashboards for users and analytics for gym management to track attendance, revenue, and engagement.
- **Responsive Design**: Fully mobile-friendly interface for accessibility on desktops, tablets, and smartphones.

## Technologies Used

This project is built using a modern web development stack:

### Frontend
- **React.js**: Component-based UI library for building the user interface
- **TypeScript**: Strongly typed programming language that builds on JavaScript
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Next-generation frontend tooling for faster development
- **React Query (TanStack Query)**: Powerful data synchronization for React
- **React Router**: For handling navigation within the application

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework for Node.js
- **PostgreSQL**: Relational database for storing application data
- **Prisma**: Modern database toolkit and ORM
- **JWT**: JSON Web Tokens for authentication and authorization
- **bcryptjs**: Password hashing library

### Development Tools
- **Git & GitHub**: Version control and source code management
- **Vite**: Build tool and development server
- **ESLint & Prettier**: Code linting and formatting
- **Jest & React Testing Library**: Testing frameworks

## Installation & Setup

### Prerequisites
- Node.js (v18.0.0 or later)
- npm (v8.0.0 or later)
- PostgreSQL (v13.0 or later)

### Frontend Setup

1. **Clone the Repository**:
  ```bash
  git clone https://github.com/yourusername/ABC-Gymnastics.git
  cd ABC-Gymnastics/frontend
  ```

2. **Install Dependencies**:
  ```bash
  npm install
  ```

3. **Configure Environment Variables**:
  Create a `.env` file in the frontend directory:
  ```
  VITE_API_URL=http://localhost:5000/api
  ```

4. **Start Development Server**:
  ```bash
  npm run dev
  ```
  The frontend will be accessible at `http://localhost:3000`

### Backend Setup

1. **Navigate to Backend Directory**:
  ```bash
  cd ../backend
  ```

2. **Install Dependencies**:
  ```bash
  npm install
  ```

3. **Configure Environment Variables**:
  Create a `.env` file in the backend directory:
  ```
  PORT=5000
  DATABASE_URL="postgresql://username:password@localhost:5432/abc_gymnastics"
  JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
  ```

4. **Database Setup and Prisma Configuration**:

   #### Local Development Setup
   
   **Step 1: Ensure PostgreSQL is Running**
   ```bash
   # Check if PostgreSQL is running
   pg_isready -h localhost -p 5432
   
   # If not running, start PostgreSQL service:
   # Windows: Start PostgreSQL service from Services
   # macOS: brew services start postgresql
   # Linux: sudo systemctl start postgresql
   ```

   **Step 2: Create Database**
   ```bash
   # Connect to PostgreSQL and create database
   psql -h localhost -U postgres
   CREATE DATABASE abc_gymnastics;
   \q
   ```

   **Step 3: Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

   **Step 4: Run Database Migrations**
   ```bash
   # Apply all migrations to create tables
   npx prisma migrate dev --name init
   
   # Alternative: Reset and migrate (use if you have migration issues)
   npx prisma migrate reset --force
   ```

   **Step 5: Seed Database with Initial Data**
   ```bash
   # This creates the admin user and sample classes
   npm run prisma:seed
   ```

   **Step 6: Verify Database Setup**
   ```bash
   # Open Prisma Studio to view your data
   npx prisma studio
   ```

5. **Start Backend Server**:
  ```bash
  npm run dev
  ```
  The API will be accessible at `http://localhost:5000`

## 🔧 Troubleshooting Guide

### Prisma Setup Issues

#### Problem: "User not created" or "Cannot login with admin credentials"

**Solution Steps:**

1. **Verify Database Connection**:
   ```bash
   cd backend
   npx prisma db push
   ```
   If this fails, check your `DATABASE_URL` in `.env`

2. **Reset and Recreate Database**:
   ```bash
   # WARNING: This will delete all data
   npx prisma migrate reset --force
   npx prisma generate
   npm run prisma:seed
   ```

3. **Check if Admin User Exists**:
   ```bash
   # Open Prisma Studio
   npx prisma studio
   # Navigate to User table and look for admin@abcgym.com
   ```

4. **Manual Admin User Creation**:
   If seeding fails, create admin user manually:
   ```bash
   # Connect to your database
   psql -h localhost -U postgres -d abc_gymnastics
   
   # Insert admin user (password is hashed version of "admin123")
   INSERT INTO "User" (email, password, role) 
   VALUES ('admin@abcgym.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
   ```

#### Problem: "Prisma Client not generated"

**Solution:**
```bash
cd backend
npx prisma generate
npm run build
```

#### Problem: "Database does not exist"

**Solution:**
```bash
# Create database manually
createdb abc_gymnastics -h localhost -U postgres

# Or using psql
psql -h localhost -U postgres
CREATE DATABASE abc_gymnastics;
\q

# Then run migrations
npx prisma migrate dev
```

#### Problem: "Connection refused" or "Database connection error"

**Solution:**
1. Check if PostgreSQL is running:
   ```bash
   pg_isready -h localhost -p 5432
   ```

2. Verify your `.env` DATABASE_URL format:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/abc_gymnastics"
   ```

3. Test database connection:
   ```bash
   npx prisma db pull
   ```

### Default Admin Credentials

After successful seeding, use these credentials to login:

**🔑 Admin Login:**
- **Email**: `admin@abcgym.com`
- **Password**: `admin123`

**📝 Available User Roles:**
- `admin`: Full access to admin dashboard and user management
- `user`: Standard user access to booking and classes

### Database Schema Overview

The application uses the following main tables:
- **User**: Stores user accounts with email, hashed password, and role
- **Class**: Fitness class types (Yoga, Spin, Boot Camp, etc.)
- **Session**: Time slots for each class (morning, afternoon, evening)
- **Booking**: User bookings for specific sessions

### Production Deployment Notes

For production deployment on Render:

1. **Database Migration**: Automatic via `prisma migrate deploy`
2. **Environment Variables**: Set via Render dashboard
3. **Prisma Client**: Generated during build process

### Quick Commands Reference

```bash
# Database operations
npx prisma migrate dev          # Create and apply migration
npx prisma migrate reset        # Reset database (development only)
npx prisma generate            # Generate Prisma client
npx prisma studio              # Open database GUI
npx prisma db seed             # Run seed script

# Development
npm run dev                    # Start development server
npm run build                  # Build for production
npm start                      # Start production server

# Troubleshooting
npx prisma validate           # Validate schema
npx prisma format             # Format schema file
npx prisma db pull            # Pull schema from database
```

### Running in Production

1. **Build Frontend**:
  ```bash
  cd frontend
  npm run build
  ```

2. **Start Production Servers**:
  ```bash
  # For backend
  cd backend
  npm start
  
  # For frontend (using a static server like serve)
  cd frontend
  npx serve -s dist
  ```
