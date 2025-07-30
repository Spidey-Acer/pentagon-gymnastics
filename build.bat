@echo off
echo Starting build process...

REM Check if we're in the backend directory or root
if exist "package.json" if exist "src\index.ts" (
    echo Building from backend directory...
    npm install
    npx prisma generate
    npm run build
) else if exist "backend" (
    echo Building from root directory...
    cd backend
    npm install
    npx prisma generate
    npm run build
) else (
    echo Error: Cannot find backend directory or backend files
    exit /b 1
)

echo Build completed successfully!
