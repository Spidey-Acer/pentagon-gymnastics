#!/bin/bash

# Build script for Render deployment
echo "Starting build process..."

# Check if we're in the backend directory or root
if [ -f "package.json" ] && [ -f "src/index.ts" ]; then
    echo "Building from backend directory..."
    npm install
    npx prisma generate
    npm run build
elif [ -d "backend" ]; then
    echo "Building from root directory..."
    cd backend
    npm install
    npx prisma generate
    npm run build
else
    echo "Error: Cannot find backend directory or backend files"
    exit 1
fi

echo "Build completed successfully!"
