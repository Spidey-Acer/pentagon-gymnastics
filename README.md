# Pentagon Gymnastics Web Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v13+-blue.svg)](https://www.postgresql.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Development Environment Setup](#development-environment-setup)
- [Local Installation Guide](#local-installation-guide)
- [Production Deployment](#production-deployment)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Pentagon Gymnastics is a comprehensive full-stack web application designed for modern fitness facility management. Built with enterprise-grade architecture, this platform provides complete business operations management including class bookings, subscription management, equipment ordering, and administrative analytics.

### 🏋️ Featured Fitness Classes
- **Yoga** - Mindfulness and flexibility training
- **Spin** - High-intensity cardio cycling
- **Boot Camp** - Military-style fitness training
- **Barre** - Ballet-inspired strength and conditioning
- **Pilates** - Core strengthening and body alignment
- **Orangetheory** - Heart rate-based interval training
- **CrossFit** - Functional movement and strength training
- **Hybrid Classes** - Combination fitness experiences

### ⏰ Session Schedule
- **Morning Session**: 6:00 AM - 11:00 AM
- **Afternoon Session**: 12:00 PM - 5:00 PM  
- **Evening Session**: 6:00 PM - 9:00 PM

### 💼 Business Capabilities
This application streamlines all operational processes including member management, class scheduling, subscription billing, equipment sales, and comprehensive business analytics to drive growth in the competitive fitness industry.

## 🛠️ Prerequisites

Before setting up the Pentagon Gymnastics application, ensure you have the following software installed on your system:

### Essential Software Requirements

#### 1. Code Editor
- **Visual Studio Code** (Recommended)
  - Download: [https://code.visualstudio.com/](https://code.visualstudio.com/)
  - Version: Latest stable release
  - **Required Extensions**:
    - TypeScript and JavaScript Language Features
    - ES7+ React/Redux/React-Native snippets
    - Prettier - Code formatter
    - ESLint
    - Prisma (for database schema)
    - Thunder Client (for API testing)

#### 2. Runtime Environment
- **Node.js** (v18.0.0 or higher)
  - Download: [https://nodejs.org/](https://nodejs.org/)
  - **Recommended**: Use Node Version Manager (NVM)
    - Windows: [nvm-windows](https://github.com/coreybutler/nvm-windows)
    - macOS/Linux: [nvm](https://github.com/nvm-sh/nvm)
  - Verify installation:
    ```bash
    node --version  # Should show v18.0.0+
    npm --version   # Should show v8.0.0+
    ```

#### 3. Database System
- **PostgreSQL** (v13.0 or higher)
  - Download: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
  - **Alternative**: Use Docker for containerized PostgreSQL
    ```bash
    docker run --name postgres-pentagon -e POSTGRES_PASSWORD=your_password -p 5432:5432 -d postgres:15
    ```

#### 4. Version Control
- **Git** (v2.30.0 or higher)
  - Download: [https://git-scm.com/](https://git-scm.com/)
  - Configure Git:
    ```bash
    git config --global user.name "Your Name"
    git config --global user.email "your.email@example.com"
    ```

#### 5. Package Manager
- **npm** (comes with Node.js) or **Yarn** (optional)
  - For Yarn: `npm install -g yarn`

### Optional Development Tools

#### Database Management
- **pgAdmin** (PostgreSQL GUI): [https://www.pgadmin.org/](https://www.pgadmin.org/)
- **DBeaver** (Universal database tool): [https://dbeaver.io/](https://dbeaver.io/)

#### API Development & Testing
- **Postman**: [https://www.postman.com/](https://www.postman.com/)
- **Insomnia**: [https://insomnia.rest/](https://insomnia.rest/)

#### Terminal Enhancement (Windows)
- **Windows Terminal**: Available from Microsoft Store
- **PowerShell 7+**: [https://github.com/PowerShell/PowerShell](https://github.com/PowerShell/PowerShell)

### Browser Requirements
- **Google Chrome** (v100+) - Recommended for development
- **Mozilla Firefox** (v100+)
- **Microsoft Edge** (v100+)

## 🚀 Development Environment Setup

### Step 1: Install Visual Studio Code Extensions

Open VS Code and install the following extensions:

1. **Essential Extensions**:
   ```
   Name: TypeScript and JavaScript Language Features
   Publisher: Microsoft
   
   Name: ES7+ React/Redux/React-Native snippets  
   Publisher: dsznajder
   
   Name: Prettier - Code formatter
   Publisher: Prettier
   
   Name: ESLint
   Publisher: Microsoft
   
   Name: Prisma
   Publisher: Prisma
   ```

2. **Open VS Code Terminal**: `Ctrl+Shift+` ` (backtick)

### Step 2: Configure VS Code Settings

Create `.vscode/settings.json` in your project root:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### Step 3: Install Node.js and Verify Setup

1. **Download and Install Node.js**:
   - Visit [nodejs.org](https://nodejs.org/)
   - Download LTS version (v18.0.0+)
   - Run installer with default settings

2. **Verify Installation**:
   ```bash
   # Open terminal in VS Code
   node --version    # Should output: v18.x.x or higher
   npm --version     # Should output: v8.x.x or higher
   ```

### Step 4: Setup PostgreSQL Database

#### Option A: Local PostgreSQL Installation

1. **Download PostgreSQL**:
   - Visit [postgresql.org/download](https://www.postgresql.org/download/)
   - Choose your operating system
   - Install with default port (5432)

2. **Create Database**:
   ```sql
   -- Open pgAdmin or psql command line
   CREATE DATABASE pentagon_gym;
   CREATE USER gym_admin WITH ENCRYPTED PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE pentagon_gym TO gym_admin;
   ```

#### Option B: Docker PostgreSQL (Recommended for Development)

```bash
# Pull PostgreSQL image
docker pull postgres:15

# Run PostgreSQL container
docker run --name pentagon-postgres \
  -e POSTGRES_DB=pentagon_gym \
  -e POSTGRES_USER=gym_admin \
  -e POSTGRES_PASSWORD=secure_password \
  -p 5432:5432 \
  -d postgres:15

# Verify container is running
docker ps
```

## 📦 Local Installation Guide

### Step 1: Clone the Repository

```bash
# Open terminal in your desired directory
git clone https://github.com/Spidey-Acer/pentagon-gymnastics.git
cd pentagon-gymnastics

# Open project in VS Code
code .
```

### Step 2: Environment Configuration

#### Backend Environment Setup

1. **Create Backend Environment File**:
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Create .env file
   touch .env    # On Windows: echo. > .env
   ```

2. **Configure Backend Environment Variables**:
   ```bash
   # Edit backend/.env file
   DATABASE_URL="postgresql://gym_admin:secure_password@localhost:5432/pentagon_gym"
   JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
   NODE_ENV="development"
   PORT=3000
   CORS_ORIGIN="http://localhost:5173"
   ```

#### Frontend Environment Setup

1. **Create Frontend Environment File**:
   ```bash
   # Navigate to frontend directory  
   cd ../frontend
   touch .env    # On Windows: echo. > .env
   ```

2. **Configure Frontend Environment Variables**:
   ```bash
   # Edit frontend/.env file
   VITE_API_URL=http://localhost:3000/api
   VITE_APP_NAME="Pentagon Gymnastics"
   ```

### Step 3: Install Dependencies

#### Install Backend Dependencies

```bash
# From project root directory
cd backend

# Install all backend dependencies
npm install

# Verify critical packages are installed
npm list @prisma/client bcryptjs express jsonwebtoken
```

#### Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd ../frontend

# Install all frontend dependencies  
npm install

# Verify critical packages are installed
npm list react react-dom @tanstack/react-query axios
```

### Step 4: Database Setup and Migration

```bash
# Navigate to backend directory
cd ../backend

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with initial data
npx prisma db seed
```

#### Verify Database Setup

```bash
# Open Prisma Studio to view database
npx prisma studio
# This opens http://localhost:5555 in your browser
```

### Step 5: Start Development Servers

#### Terminal 1: Start Backend Server

```bash
# From backend directory
cd backend
npm run dev

# Should output:
# Server running on http://localhost:3000
# Database connected successfully
```

#### Terminal 2: Start Frontend Development Server

```bash
# Open new terminal in VS Code: Ctrl+Shift+`
# From frontend directory
cd frontend
npm run dev

# Should output:
# VITE ready in xxxms
# Local: http://localhost:5173
# Network: use --host to expose
```

### Step 6: Verification and Testing

1. **Test Backend API**:
   ```bash
   # Test health endpoint
   curl http://localhost:3000/api/health
   # Should return: {"status":"healthy","database":"connected"}
   ```

2. **Test Frontend Application**:
   - Open browser: [http://localhost:5173](http://localhost:5173)
   - Verify homepage loads correctly
   - Test navigation between pages

3. **Test Database Connection**:
   - Open Prisma Studio: [http://localhost:5555](http://localhost:5555)
   - Verify tables are created
   - Check seed data is populated

### Step 7: Create Admin User (Required)

```bash
# From backend directory
npx prisma studio

# Or use SQL directly:
psql -h localhost -U gym_admin -d pentagon_gym

# Create admin user:
INSERT INTO "User" (email, password, role, forename, surname, address, "dateOfBirth", "phoneNumber") 
VALUES (
  'admin@pentagongym.com',
  '$2b$10$example.hash.here',  -- Use bcrypt to hash password
  'admin',
  'Admin',
  'User',
  '123 Gym Street',
  '1990-01-01',
  '+44 123 456 7890'
);
```

## 🌐 Production Deployment

This application is configured for deployment on Render with automatic CI/CD pipeline.

### Render Platform Setup

#### 1. Prerequisites for Deployment
- GitHub repository with your code
- Render account: [https://render.com](https://render.com)
- Environment variables configured

#### 2. Database Service Deployment

1. **Create PostgreSQL Database**:
   - Login to Render Dashboard
   - Click "New +" → "PostgreSQL"
   - Configure database settings:
     ```
     Name: pentagon-gym-db
     Database: pentagon_gym
     User: gym_admin
     Region: Oregon (US West) or nearest to your users
     PostgreSQL Version: 15
     ```

2. **Note Database Connection Details**:
   - Internal Database URL (for backend service)
   - External Database URL (for migrations)

#### 3. Backend API Deployment

1. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Configure service:
     ```
     Name: pentagon-gym-backend
     Environment: Node
     Build Command: cd backend && npm install && npx prisma generate && npm run build
     Start Command: cd backend && npx prisma migrate deploy && npm start
     Instance Type: Starter (free tier)
     ```

2. **Environment Variables**:
   ```bash
   NODE_ENV=production
   DATABASE_URL={Auto-filled from database service}
   JWT_SECRET={Generate secure 32+ character string}
   CORS_ORIGIN=https://pentagon-gym-frontend.onrender.com
   PORT=3000
   ```

#### 4. Frontend Deployment

1. **Create Static Site**:
   - Click "New +" → "Static Site"
   - Connect same GitHub repository
   - Configure build:
     ```
     Name: pentagon-gym-frontend
     Build Command: cd frontend && npm install && npm run build:prod
     Publish Directory: frontend/dist
     ```

2. **Environment Variables**:
   ```bash
   VITE_API_URL=https://pentagon-gym-backend.onrender.com/api
   ```

#### 5. Custom Domain Setup (Optional)

```bash
# Add custom domain in Render dashboard
# Update DNS records:
CNAME: www.pentagongym.com -> pentagon-gym-frontend.onrender.com
A: pentagongym.com -> 216.24.57.1
```

### Deployment Verification

1. **Health Check**:
   ```bash
   curl https://pentagon-gym-backend.onrender.com/api/health
   ```

2. **Database Migration Status**:
   ```bash
   # Check render logs for successful migration
   npx prisma migrate status
   ```

3. **Frontend Accessibility**:
   - Visit: https://pentagon-gym-frontend.onrender.com
   - Test user registration and login
   - Verify API connectivity

## 📁 Project Structure

```
pentagon-gymnastics/
│
├── 📂 backend/                     # Node.js/Express API Server
│   ├── 📂 prisma/                  # Database Schema & Migrations
│   │   ├── schema.prisma           # Database schema definition
│   │   ├── seed.ts                 # Database seeding script
│   │   └── 📂 migrations/          # Database migration files
│   │
│   ├── 📂 src/                     # Source code
│   │   ├── index.ts                # Main server entry point
│   │   ├── 📂 controllers/         # Request handlers
│   │   │   ├── authController.ts   # Authentication logic
│   │   │   ├── classController.ts  # Class management
│   │   │   ├── subscriptionController.ts
│   │   │   └── gearController.ts   # Equipment management
│   │   │
│   │   ├── 📂 middleware/          # Express middleware
│   │   │   ├── authMiddleware.ts   # JWT authentication
│   │   │   └── adminMiddleware.ts  # Admin authorization
│   │   │
│   │   ├── 📂 routes/              # API route definitions
│   │   │   ├── authRoutes.ts       # /api/auth endpoints
│   │   │   ├── classRoutes.ts      # /api/classes endpoints
│   │   │   └── subscriptionRoutes.ts
│   │   │
│   │   ├── 📂 services/            # Business logic layer
│   │   │   ├── transactionService.ts
│   │   │   └── simulatedPaymentService.ts
│   │   │
│   │   └── 📂 lib/                 # Utilities & configurations
│   │       └── prisma.ts           # Database connection
│   │
│   ├── package.json                # Backend dependencies
│   └── tsconfig.json               # TypeScript configuration
│
├── 📂 frontend/                    # React Application
│   ├── 📂 public/                  # Static assets
│   │   ├── _redirects              # Netlify routing rules
│   │   └── vite.svg                # Favicon
│   │
│   ├── 📂 src/                     # Source code
│   │   ├── main.tsx                # React application entry
│   │   ├── App.tsx                 # Main application component
│   │   ├── index.css               # Global styles (Tailwind)
│   │   │
│   │   ├── 📂 components/          # Reusable UI components
│   │   │   ├── Navbar.tsx          # Navigation component
│   │   │   ├── ClassCard.tsx       # Class display component
│   │   │   ├── ProtectedRoute.tsx  # Route protection
│   │   │   └── SimulatedPaymentForm.tsx
│   │   │
│   │   ├── 📂 contexts/            # React Context providers
│   │   │   ├── AuthContext.tsx     # Authentication state
│   │   │   └── ToastContext.tsx    # Notification system
│   │   │
│   │   ├── 📂 pages/               # Page components
│   │   │   ├── HomePage.tsx        # Landing page
│   │   │   ├── ClassesPage.tsx     # Class catalog
│   │   │   ├── DashboardPage.tsx   # User dashboard
│   │   │   └── AdminDashboard.tsx  # Admin panel
│   │   │
│   │   ├── 📂 hooks/               # Custom React hooks
│   │   ├── 📂 services/            # API communication
│   │   └── 📂 utils/               # Helper functions
│   │
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.ts              # Vite build configuration
│   ├── tailwind.config.js          # Tailwind CSS setup
│   └── tsconfig.json               # TypeScript configuration
│
├── 📂 .vscode/                     # VS Code workspace settings
│   └── settings.json               # Editor configuration
│
├── render.yaml                     # Render deployment configuration
├── package.json                    # Root package.json for scripts
├── README.md                       # This documentation
└── LICENSE                         # MIT License
## 🚀 Available Scripts

### Root Level Scripts

```bash
# Install dependencies for both frontend and backend
npm run install-backend     # Install backend dependencies only
npm run install-frontend    # Install frontend dependencies only

# Build commands
npm run build              # Build frontend for production
npm run build-backend      # Build backend with Prisma generation

# Start production server
npm start                  # Start backend production server
npm run dev               # Start backend in development mode
```

### Backend Scripts (from /backend directory)

```bash
# Development
npm run dev               # Start development server with hot reload
npm run build            # Compile TypeScript to JavaScript
npm start                # Start production server

# Database operations
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate    # Run database migrations (development)
npm run prisma:migrate:deploy  # Deploy migrations (production)
npm run prisma:seed       # Seed database with initial data

# Production setup
npm run production:setup  # Full production database setup
```

### Frontend Scripts (from /frontend directory)

```bash
# Development
npm run dev              # Start Vite development server
npm run build            # Build for production
npm run build:prod       # Build with production configuration
npm run preview          # Preview production build locally

# Code quality
npm run lint             # Run ESLint
npm run build:check      # Type check and build verification
```

## 📚 API Documentation

### Authentication Endpoints

```bash
POST /api/auth/register
# Register new user account
# Body: { email, password, forename, surname, address, dateOfBirth, phoneNumber }

POST /api/auth/login  
# Authenticate user and receive JWT token
# Body: { email, password }

GET /api/auth/profile
# Get current user profile (requires authentication)
# Headers: { Authorization: "Bearer <token>" }
```

### Class Management Endpoints

```bash
GET /api/classes
# Retrieve all available fitness classes with sessions
# Response: Array of classes with session information

GET /api/classes/:id
# Get specific class details
# Response: Class object with sessions and booking information
```

### Booking Endpoints

```bash
POST /api/sessions/book
# Book a class session
# Body: { sessionId }
# Headers: { Authorization: "Bearer <token>" }

DELETE /api/sessions/cancel/:bookingId
# Cancel a booking
# Headers: { Authorization: "Bearer <token>" }

GET /api/users/:userId/bookings
# Get user's booking history
# Headers: { Authorization: "Bearer <token>" }
```

### Subscription Endpoints

```bash
GET /api/subscriptions/packages
# Get all available subscription packages
# Response: Array of packages with pricing and class access

POST /api/subscriptions/create
# Create new subscription
# Body: { packageId, proteinSupplement? }
# Headers: { Authorization: "Bearer <token>" }

POST /api/subscriptions/switch
# Switch subscription package
# Body: { newPackageId }
# Headers: { Authorization: "Bearer <token>" }

GET /api/subscriptions/current
# Get current user subscription
# Headers: { Authorization: "Bearer <token>" }
```

### Equipment/Gear Endpoints

```bash
GET /api/gear
# Get all available gear items
# Response: Array of gear items with pricing

POST /api/gear/order
# Place gear order
# Body: { items: [{ gearItemId, size, quantity, customText? }], customerName, shippingAddress }
# Headers: { Authorization: "Bearer <token>" }
```

### Admin Endpoints

```bash
GET /api/admin/dashboard
# Get admin dashboard statistics
# Headers: { Authorization: "Bearer <admin-token>" }

GET /api/admin/users
# Get all users (admin only)
# Headers: { Authorization: "Bearer <admin-token>" }

POST /api/admin/classes
# Create new class (admin only)
# Body: { name, description }
# Headers: { Authorization: "Bearer <admin-token>" }
```

### System Endpoints

```bash
GET /api/health
# Health check endpoint
# Response: { status: "healthy", database: "connected", timestamp }
```

## 🔧 Troubleshooting

### Common Development Issues

#### Issue: "Cannot connect to database"
**Solutions:**
```bash
# Check PostgreSQL service status
sudo systemctl status postgresql  # Linux
brew services list | grep postgres  # macOS

# Verify database exists
psql -U gym_admin -d pentagon_gym -c "\dt"

# Check environment variables
echo $DATABASE_URL
cat backend/.env
```

#### Issue: "Port already in use"
**Solutions:**
```bash
# Find process using port 3000
lsof -i :3000        # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>        # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
PORT=3001 npm run dev
```

#### Issue: "Module not found" errors
**Solutions:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force

# Check Node.js version
node --version  # Should be v18+
```

#### Issue: "Prisma client errors"
**Solutions:**
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database
npx prisma migrate reset

# Check schema syntax
npx prisma validate
```

#### Issue: "CORS errors in browser"
**Solutions:**
```bash
# Check backend CORS configuration
# Verify frontend URL in backend/.env
CORS_ORIGIN=http://localhost:5173

# Check browser console for specific CORS error
# Ensure backend is running on correct port
```

#### Issue: "TypeScript compilation errors"
**Solutions:**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Update TypeScript
npm install typescript@latest

# Clear TypeScript cache
rm -rf .tsbuildinfo
```

### Production Deployment Issues

#### Issue: "Build failing on Render"
**Solutions:**
1. Check build logs in Render dashboard
2. Verify all environment variables are set
3. Ensure package.json build commands are correct
4. Check Node.js version compatibility

#### Issue: "Database migration fails"
**Solutions:**
```bash
# Check migration status
npx prisma migrate status

# Manually run migrations
npx prisma migrate deploy

# Reset and re-apply migrations
npx prisma migrate reset --force
```

#### Issue: "Frontend can't reach backend API"
**Solutions:**
1. Verify VITE_API_URL environment variable
2. Check backend health endpoint
3. Confirm CORS settings allow frontend domain
4. Test API endpoints with curl/Postman

### Performance Optimization

#### Frontend Performance
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Enable production build
npm run build:prod
```

#### Backend Performance
```bash
# Enable database query logging
# Add to backend/.env:
DATABASE_URL="postgresql://...?connection_limit=5&pool_timeout=20"

# Monitor API response times
# Check Render metrics dashboard
```

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make changes and test thoroughly**
4. **Commit with conventional commits**:
   ```bash
   git commit -m "feat: add user subscription management"
   ```
5. **Push and create pull request**

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Automatic code formatting
- **Conventional Commits**: Standardized commit messages

### Testing Guidelines

```bash
# Run tests before committing
npm run test              # Frontend tests
npm run test:backend      # Backend tests
npm run lint             # Code linting
npm run type-check       # TypeScript checking
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ Commercial use allowed
- ✅ Modification allowed  
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ No warranty provided
- ❌ No liability accepted

## 📞 Support & Contact

### Academic Context
This project was developed as part of the Software Design and Development module at **Ravensbourne University London**.

### Technical Support
For technical issues or questions:
1. Check this README.md troubleshooting section
2. Review GitHub Issues for similar problems
3. Create new issue with detailed problem description

### Learning Resources
- **React Documentation**: [https://react.dev/](https://react.dev/)
- **TypeScript Handbook**: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
- **Prisma Documentation**: [https://www.prisma.io/docs/](https://www.prisma.io/docs/)
- **Express.js Guide**: [https://expressjs.com/](https://expressjs.com/)

---

**Pentagon Gymnastics Web Application** - Transforming fitness facility management through modern web technology.

*Last Updated: August 8, 2025*