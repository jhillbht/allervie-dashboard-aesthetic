#!/bin/bash

echo "🧹 Cleaning up node_modules and lock files..."
rm -rf node_modules package-lock.json

echo "📦 Installing dependencies..."
npm install @vitejs/plugin-react@4.2.1 vite@5.0.10 typescript@5.3.3 @types/node@20.11.17 --save-dev

echo "📦 Installing core dependencies..."
npm install react@18.2.0 react-dom@18.2.0 @supabase/supabase-js@2.39.3 @supabase/auth-helpers-react@0.4.2

echo "✨ Clearing vite cache..."
rm -rf node_modules/.vite