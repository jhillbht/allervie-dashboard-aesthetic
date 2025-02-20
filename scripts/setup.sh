#!/bin/bash

echo "🔍 Checking environment..."
node ./scripts/check-environment.js

if [ $? -ne 0 ]; then
    echo "❌ Environment check failed"
    exit 1
fi

echo "🧹 Cleaning existing installation..."
rm -rf node_modules package-lock.json

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Installation failed"
    exit 1
fi

echo "✨ Setup complete - ready to start development"
echo "
Next steps:
1. Update .env with your Supabase credentials
2. Run 'npm run dev' to start the server
3. Visit http://localhost:4000"