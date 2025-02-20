#!/bin/bash

# Color formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Validating development environment..."

# Check Node.js version
required_node="18.19.0"
current_node=$(node -v)

if [[ "${current_node:1}" != "${required_node}" ]]; then
    echo "${RED}❌ Node.js version mismatch${NC}"
    echo "Required: ${required_node}"
    echo "Current: ${current_node:1}"
    echo "Please use nvm or similar to install the correct version"
    exit 1
fi

# Check npm version
required_npm="10.4.0"
current_npm=$(npm -v)

if [[ "${current_npm}" != "${required_npm}" ]]; then
    echo "${RED}❌ npm version mismatch${NC}"
    echo "Required: ${required_npm}"
    echo "Current: ${current_npm}"
    exit 1
fi

echo "${GREEN}✅ Environment validation passed${NC}"

# Clean installation
echo "${YELLOW}🧹 Cleaning previous installation...${NC}"
rm -rf node_modules package-lock.json

# Clear npm cache
echo "${YELLOW}🧹 Clearing npm cache...${NC}"
npm cache clean --force

# Install dependencies
echo "${GREEN}📦 Installing dependencies...${NC}"
npm install

# Verify installation
if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Setup completed successfully${NC}"
    echo "
Next steps:
1. Ensure your .env file is configured with Supabase credentials
2. Run 'npm run dev' to start the development server
3. Visit http://localhost:4000 in your browser"
else
    echo "${RED}❌ Setup failed${NC}"
    echo "Please check the error messages above"
    exit 1
fi