# 🔑 ABC Gymnastics Admin Guide

## 👤 Admin Account Setup

### **IMPORTANT: Creating the First Admin User**

#### **For Production Deployment:**
1. **SSH into your Render backend service** or run this command in the backend console:
   ```bash
   npx prisma db seed
   ```

2. **Or manually create an admin user** by registering normally, then updating the database:
   ```sql
   UPDATE "User" SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

#### **Default Admin Credentials (if seeded):**
- **Email**: `admin@abcgym.com`
- **Password**: `admin123`

⚠️ **CHANGE THESE CREDENTIALS IMMEDIATELY IN PRODUCTION!**

## 🚀 How to Login as Admin

1. **Go to the login page**: `https://your-frontend-url.onrender.com/login`
2. **Enter admin credentials** (see above)
3. **You'll be redirected to**: `/admin` (Admin Dashboard)
4. **Look for the purple "Admin" button** in the navigation bar

## 📊 Admin Features Available

### 1. **Dashboard Analytics**
- **URL**: `/admin`
- **Features**:
  - 📈 Total users, classes, sessions, and bookings
  - 📊 Session utilization rates
  - 📅 Recent booking activity
  - 🎯 Real-time capacity monitoring

### 2. **User Management**
- **View all registered users** with their details
- **Change user roles**: Promote users to admin or demote to regular user
- **See booking statistics** per user
- **Access via**: Admin Dashboard → "Users" tab

### 3. **Session Management**
- **View all sessions** across all classes
- **Edit session capacities** with validation
- **Monitor booking vs capacity** ratios
- **Real-time utilization tracking**
- **Access via**: Admin Dashboard → "Sessions" tab

### 4. **Visual Indicators**
- 🟢 **Green**: Under 60% capacity (Low utilization)
- 🟡 **Yellow**: 60-80% capacity (Moderate utilization)
- 🔴 **Red**: Over 80% capacity (High utilization)

## 🛠️ Backend Admin API Endpoints

All admin routes require authentication + admin role:

```bash
# Dashboard Analytics
GET /api/admin/dashboard

# User Management
GET /api/admin/users
PUT /api/admin/users/:userId/role

# Booking Management  
GET /api/admin/bookings

# Session Management
PUT /api/admin/sessions/:sessionId/capacity

# Class Management
DELETE /api/admin/classes/:classId
```

## 🔒 Security Features

- ✅ **Role-based access control**
- ✅ **JWT token verification**
- ✅ **Protected admin routes**
- ✅ **Automatic unauthorized redirects**
- ✅ **Admin middleware protection**

## 🚀 Quick Setup Guide

### **For Development:**
1. **Start backend**: `cd backend && npm run dev`
2. **Start frontend**: `cd frontend && npm run dev`
3. **Run seed command**: `cd backend && npx prisma db seed`
4. **Login with admin credentials**
5. **Access admin features**

### **For Production (Render):**
1. **Ensure database is migrated**: Check render logs for migration success
2. **Run seed command** in backend service console
3. **Login with admin credentials**
4. **Change default password immediately**

## ❓ Troubleshooting

### **Can't Access Admin Features?**
- ✅ Ensure you're logged in with an admin account
- ✅ Check that the user role is set to "admin" in database
- ✅ Verify JWT token is valid
- ✅ Clear browser cache and cookies

### **Registration Not Working?**
- ✅ Check browser console for API errors
- ✅ Verify API URL is correct in environment variables
- ✅ Ensure backend service is running and accessible

### **Need to Create More Admins?**
1. **Login as existing admin**
2. **Go to Admin Dashboard → Users tab**
3. **Find the user you want to promote**
4. **Change their role to "admin"**
