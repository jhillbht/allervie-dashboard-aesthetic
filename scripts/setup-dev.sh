#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "${BLUE}🚀 Setting up development environment...${NC}"

# Clean install
echo "${BLUE}📦 Cleaning npm cache and node_modules...${NC}"
npm cache clean --force
rm -rf node_modules package-lock.json

# Install dependencies
echo "${BLUE}📦 Installing dependencies...${NC}"
npm install

# Check if .env exists, if not create it
if [ ! -f .env ]; then
    echo "${BLUE}📝 Creating .env file...${NC}"
    cp .env.example .env
    echo "${RED}⚠️  Don't forget to update the .env file with your actual values!${NC}"
fi

# Create necessary directories if they don't exist
echo "${BLUE}📁 Creating necessary directories...${NC}"
mkdir -p src/pages/auth

# Verify local environment
echo "${BLUE}🔍 Verifying local environment...${NC}"
if [ -f .env ]; then
    if grep -q "your-supabase-project-url" .env; then
        echo "${RED}⚠️  Warning: Supabase URL not configured in .env${NC}"
    fi
    if grep -q "your-supabase-anon-key" .env; then
        echo "${RED}⚠️  Warning: Supabase anon key not configured in .env${NC}"
    fi
else
    echo "${RED}⚠️  Warning: .env file not found${NC}"
fi

echo "${GREEN}✅ Setup complete!${NC}"
echo "
${BLUE}Next steps:${NC}
1. Update your .env file with the correct values
2. Run 'npm run dev' to start the development server
3. Visit http://localhost:4000 to view your application

${BLUE}Useful commands:${NC}
- npm run dev     : Start development server
- npm run build   : Build for production
- npm run preview : Preview production build"