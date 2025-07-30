# Frontend deployment script for Render
echo "==> Starting frontend build process..."

# Ensure we're in the frontend directory
cd frontend 2>/dev/null || echo "Already in frontend directory"

echo "==> Installing dependencies..."
npm install

echo "==> Cleaning previous builds..."
rm -rf dist
rm -rf node_modules/.vite

echo "==> Building frontend application..."
npm run build

echo "==> Verifying build output..."
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "✅ Build successful! dist directory created with index.html"
    ls -la dist/
else
    echo "❌ Build failed! dist directory or index.html not found"
    exit 1
fi

echo "==> Frontend ready for deployment!"
