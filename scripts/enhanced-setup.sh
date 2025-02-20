#!/bin/bash

# Color formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Error handling
set -e  # Exit on any error
trap 'echo -e "${RED}An error occurred. Exiting...${NC}"' ERR

function log_step() {
    echo -e "\n${BLUE}==>${NC} $1"
}

function log_error() {
    echo -e "${RED}ERROR:${NC} $1" >&2
}

function log_success() {
    echo -e "${GREEN}SUCCESS:${NC} $1"
}

function log_warning() {
    echo -e "${YELLOW}WARNING:${NC} $1"
}

# Step 1: Environment Check
log_step "Checking execution environment"
if [[ ! -f "package.json" ]]; then
    log_error "package.json not found in current directory"
    exit 1
fi

# Step 2: Validate JSON files
log_step "Validating package.json structure"
node ./scripts/validate-json.js package.json
if [ $? -ne 0 ]; then
    log_error "package.json validation failed"
    exit 1
fi

# Step 3: Version Checks
log_step "Checking Node.js and npm versions"
node -v | grep -q "v18.19.0" || {
    log_error "Node.js v18.19.0 is required"
    echo "Current version: $(node -v)"
    exit 1
}

npm -v | grep -q "^10\." || {
    log_error "npm version 10.x is required"
    echo "Current version: $(npm -v)"
    exit 1
}

# Step 4: Clean Installation
log_step "Preparing for clean installation"
if [ -d "node_modules" ] || [ -f "package-lock.json" ]; then
    log_warning "Removing existing installation files"
    rm -rf node_modules package-lock.json
fi

# Step 5: Clear npm cache
log_step "Clearing npm cache"
npm cache clean --force
if [ $? -ne 0 ]; then
    log_error "Failed to clear npm cache"
    exit 1
fi

# Step 6: Install dependencies
log_step "Installing dependencies"
npm install --no-audit --no-fund
if [ $? -ne 0 ]; then
    log_error "Dependency installation failed"
    exit 1
fi

# Success message
echo -e "\n${GREEN}✨ Setup completed successfully!${NC}"
echo -e "\nNext steps:"
echo "1. Configure your .env file:"
echo "   VITE_SUPABASE_URL=your_supabase_url"
echo "   VITE_SUPABASE_ANON_KEY=your_supabase_key"
echo "2. Start development server: npm run dev"
echo "3. Visit http://localhost:4000"