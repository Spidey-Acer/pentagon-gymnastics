# Admin Features Testing Guide

## Testing Admin Login
1. Use these credentials to log in as admin:
   - **Email**: admin@abcgym.com  
   - **Password**: admin123

## Admin Features Available

### 1. Admin Dashboard
- **URL**: `/admin`
- **Features**:
  - View total users, classes, sessions, and bookings
  - Monitor session utilization rates
  - See recent booking activity

### 2. User Management
- View all registered users
- Change user roles (promote users to admin or demote to regular user)
- See booking counts per user

### 3. Session Management  
- View all sessions across all classes
- Update session capacities
- Monitor booking vs capacity ratios
- Real-time utilization tracking

### 4. Advanced Analytics
- Session utilization percentage tracking
- Color-coded capacity indicators:
  - 🟢 Green: Under 60% capacity  
  - 🟡 Yellow: 60-80% capacity
  - 🔴 Red: Over 80% capacity

## Backend API Endpoints

### Admin Routes (require admin role):
- `GET /api/admin/dashboard` - Dashboard analytics
- `GET /api/admin/users` - List all users  
- `PUT /api/admin/users/:userId/role` - Update user role
- `GET /api/admin/bookings` - List all bookings with filters
- `PUT /api/admin/sessions/:sessionId/capacity` - Update session capacity
- `DELETE /api/admin/classes/:classId` - Delete class and all related data

## Security Features
- Role-based access control
- Admin middleware protection
- JWT token verification
- Protected routes on frontend
- Automatic redirection for unauthorized access

## Quick Start
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`  
3. Navigate to `/login`
4. Use admin credentials above
5. Access admin features via the purple "Admin" button in the navbar
