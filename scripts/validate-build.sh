#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting build validation..."

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v)
if [[ $NODE_VERSION != v18.19.* ]]; then
    echo "❌ Invalid Node.js version. Expected v18.19.x, got $NODE_VERSION"
    exit 1
fi
echo "✅ Node.js version check passed"

# Clean install dependencies
echo "📦 Installing dependencies..."
rm -rf node_modules
npm ci
echo "✅ Dependencies installed"

# TypeScript check
echo "🔍 Running TypeScript checks..."
npm run typecheck
echo "✅ TypeScript checks passed"

# Lint check
echo "🔍 Running linting..."
npm run lint
echo "✅ Linting passed"

# Build client
echo "🏗️ Building client..."
npm run build
echo "✅ Client build successful"

# Build server
echo "🏗️ Building server..."
npm run build:server
echo "✅ Server build successful"

# Validate dist directory
echo "🔍 Validating build output..."
if [ ! -d "dist" ]; then
    echo "❌ dist directory not found"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "❌ index.html not found in dist"
    exit 1
fi

if [ ! -f "dist/server.js" ]; then
    echo "❌ server.js not found in dist"
    exit 1
fi
echo "✅ Build output validation passed"

# Test server startup
echo "🔧 Testing server startup..."
node --experimental-specifier-resolution=node dist/server.js & SERVER_PID=$!
sleep 5

# Test health endpoint
echo "🔍 Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:8080/health)
if [[ $HEALTH_RESPONSE != *"healthy"* ]]; then
    echo "❌ Health check failed"
    kill $SERVER_PID
    exit 1
fi
kill $SERVER_PID
echo "✅ Server health check passed"

echo "🎉 Build validation complete! Ready for deployment."