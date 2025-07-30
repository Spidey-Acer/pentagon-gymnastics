#!/bin/bash
# Frontend build script for Render deployment

echo "==> Installing dependencies..."
npm install

echo "==> Building frontend..."
npm run build

echo "==> Build completed successfully!"
echo "==> Checking dist directory..."
ls -la dist/

if [ ! -d "dist" ]; then
    echo "ERROR: dist directory was not created!"
    exit 1
fi

echo "==> Frontend build ready for deployment!"
