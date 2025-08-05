# Pentagon Gymnastics Web Application

## Overview

This repository contains the source code for a comprehensive web application developed for Pentagon Gymnastics, a burgeoning gym company poised to enter the fitness market with an exceptional array of offerings. As a professional software design and development project, this platform serves as a centralized business hub, streamlining all operational processes and facilitating seamless interactions between the gym, its instructors, and clientele. The application is meticulously crafted to align with the client's specifications, leveraging technologies covered in the Software Design and Development module at Ravensbourne University London.

The core objective is to provide an intuitive, user-friendly interface that manages fitness class bookings, session scheduling, member registrations, and administrative tasks, thereby enhancing operational efficiency and user satisfaction.

## Project Description

Pentagon Gymnastics aims to distinguish itself by offering a diverse selection of fitness classes, including:
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

### Customer-Facing Features
- **User Registration and Authentication**: Secure sign-up/login for members, with role-based access (e.g., customer vs. admin). Supports password hashing and session management to meet data protection standards.
- **Class Catalog Browsing**: A searchable and filterable list of all offered classes (Yoga, Spin, etc.), including descriptions, benefits, and hybrid options. Users can filter by session time (morning/afternoon/evening).
- **Session Scheduling and Booking**: Dynamic calendar view showing available sessions. Users can book classes in real-time, with limits on class capacity to prevent overbooking. Includes confirmation emails/notifications.
- **Personal Dashboard**: Users view their booked sessions, track attendance history, and receive recommendations based on past preferences (e.g., suggesting Pilates after Yoga bookings).
- **Payment Integration Stub**: Placeholder for processing class fees or memberships (integrated if module technologies allow; otherwise, simulated for demonstration).

### Admin/Staff-Facing Features
- **Class and Session Management**: Admins can create, update, or delete classes and sessions, including setting capacities, instructors, and timings. Ensures all three sessions are configurable.
- **User Management**: View and manage member profiles, including approvals, bans, or role assignments.
- **Reporting and Analytics**: Generate reports on booking trends, class popularity (e.g., Crossfit vs. Barre), and session utilization to inform business decisions.
- **Content Management**: Upload class details, images, or promotional offers to keep the platform engaging.

## Production Setup & Deployment (Render)

### 🚀 Render Deployment Configuration

This application is configured for deployment on Render with the following services:
- **Backend API**: Node.js service with PostgreSQL database
- **Frontend**: Static site deployment
- **Database**: Managed PostgreSQL instance

### 🗄️ Database Setup & Prisma Configuration

#### Initial Database Setup
1. **Database Creation**: Render automatically creates a PostgreSQL database instance as defined in `render.yaml`
2. **Connection String**: Automatically injected as `DATABASE_URL` environment variable
3. **Migration Deployment**: Runs automatically during backend build process

#### Database Schema Migration
The backend build process automatically handles:
```bash
npx prisma migrate deploy  # Applies all migrations to production DB
npx prisma generate        # Generates Prisma client
```

#### Seed Data Creation
If no admin user exists, you need to create one manually. Connect to your Render PostgreSQL database:

1. **Via Render Dashboard**:
   - Go to your database service in Render
   - Click "Connect" and use the provided psql command
   - Or use the internal connection from your backend service

2. **Create Admin User**:
   ```sql
   INSERT INTO "User" (email, password, role) 
   VALUES ('admin@Pentagongym.com', '$2b$10$example_hashed_password', 'admin');
   ```

3. **Hash Password Locally** (to get proper bcrypt hash):
   ```javascript
   // Run this in Node.js console or create a small script
   const bcrypt = require('bcryptjs');
   const hash = bcrypt.hashSync('your_admin_password', 10);
   console.log(hash); // Use this in the SQL INSERT
   ```

#### Troubleshooting Database Issues

**Problem: "Users not being created during registration"**
- Check backend logs in Render dashboard
- Verify `DATABASE_URL` environment variable is set
- Ensure migrations have been applied successfully
- Check CORS configuration allows frontend domain

**Problem: "Login fails with valid credentials"**
- Verify JWT_SECRET environment variable is set in Render
- Check backend API is accessible from frontend (CORS)
- Confirm user exists in database with correct password hash
- Review backend logs for authentication errors

**Problem: "Database connection errors"**
- Verify PostgreSQL service is running
- Check database connection string format
- Ensure database exists and migrations are applied
- Check if connection pooling is configured correctly

#### Environment Variables Required
```bash
# Backend Service Environment Variables
DATABASE_URL=postgresql://...  # Auto-injected by Render
JWT_SECRET=your_secret_key     # Auto-generated by Render
NODE_ENV=production

# Frontend Service Environment Variables  
VITE_API_URL=https://your-backend.onrender.com/api
```

#### Manual Database Operations
If you need to manually run database operations:

1. **Connect to Database**:
   ```bash
   # From Render dashboard, get connection command
   psql postgresql://username:password@host:port/database
   ```

2. **View Current Schema**:
   ```sql
   \dt              -- List tables
   \d "User"        -- Describe User table
   SELECT * FROM "User" WHERE role = 'admin';  -- Check admin users
   ```

3. **Reset Database** (if needed):
   ```sql
   -- CAUTION: This will delete ALL data
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   -- Then redeploy to run migrations again
   ```

#### Deployment Verification
After deployment, verify:
1. Backend health endpoint: `https://your-backend.onrender.com/api/health`
2. Database connectivity from backend logs
3. Frontend can communicate with backend API
4. Admin user can log in successfully

### 🔧 Common Production Issues & Solutions

**Issue**: Module resolution errors during build
**Solution**: All imports use direct file paths (no barrel exports)

**Issue**: CORS errors preventing frontend-backend communication  
**Solution**: Backend configured with proper CORS origins for Render domains

**Issue**: Database migrations not applied
**Solution**: `render.yaml` includes `prisma migrate deploy` in build command

**Issue**: Environment variables not loading
**Solution**: Set in Render dashboard under service environment variables




## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

Developed as part of the Software Design and Development coursework at Ravensbourne University London. Special thanks to the module instructors for guidance on best practices in web application development.



