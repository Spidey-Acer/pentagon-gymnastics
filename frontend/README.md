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
- **Payment Integration**: Seamless handling of membership fees and class payments (integrated with standard payment gateways).
- **Dashboard and Analytics**: Personalized dashboards for users and analytics for gym management to track attendance, revenue, and engagement.
- **Responsive Design**: Fully mobile-friendly interface for accessibility on desktops, tablets, and smartphones.
- **Notification System**: Email/SMS alerts for bookings, cancellations, and promotions.

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

4. **Setup Database**:
  ```bash
  # Generate Prisma client
  npm run prisma:generate
  
  # Run database migrations
  npm run prisma:migrate
  
  # Seed the database with initial data
  npm run prisma:seed
  ```

4. **Start Backend Server**:
  ```bash
  npm run dev
  ```
  The API will be accessible at `http://localhost:5000`

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
