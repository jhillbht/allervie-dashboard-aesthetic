#!/bin/bash

# Color formatting for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "${BLUE}🚀 Setting up development environment for Allervie Dashboard...${NC}"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Python installation
if command_exists python3; then
    echo "${GREEN}✓ Python 3 is installed${NC}"
    python3 --version
else
    echo "${RED}✗ Python 3 is not installed${NC}"
    exit 1
fi

# Create Python virtual environment
echo "${BLUE}📦 Creating Python virtual environment...${NC}"
python3 -m venv .venv
source .venv/bin/activate

# Install Python dependencies
echo "${BLUE}📦 Installing Python dependencies...${NC}"
pip install --upgrade pip
pip install python-dotenv requests

# Verify Node.js version
echo "${BLUE}🔍 Checking Node.js version...${NC}"
required_node="18.19.0"
current_node=$(node -v)

if [[ "${current_node:1}" != "${required_node}" ]]; then
    echo "${YELLOW}⚠️  Node.js version mismatch. Required: ${required_node}, Current: ${current_node:1}${NC}"
    echo "${YELLOW}Please consider using nvm to manage Node.js versions${NC}"
    exit 1
fi

# Clean npm cache and remove existing node_modules
echo "${BLUE}🧹 Cleaning npm environment...${NC}"
npm cache clean --force
rm -rf node_modules package-lock.json

# Install Node.js dependencies
echo "${BLUE}📦 Installing Node.js dependencies...${NC}"
npm install

# Create or update .env file
echo "${BLUE}📝 Setting up environment variables...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo "${YELLOW}⚠️  Please update the .env file with your actual values${NC}"
fi

# Create necessary directories
echo "${BLUE}📁 Creating project directories...${NC}"
mkdir -p src/pages/auth
mkdir -p src/components/google
mkdir -p src/services/analytics

# Add virtual environment to .gitignore if not already present
if ! grep -q ".venv" .gitignore; then
    echo ".venv" >> .gitignore
    echo "${GREEN}✓ Added .venv to .gitignore${NC}"
fi

# Create activation script for easy environment setup
cat > activate-env.sh << EOL
#!/bin/bash
source .venv/bin/activate
export NODE_ENV=development
export PATH="./node_modules/.bin:\$PATH"
echo "Development environment activated!"
EOL

chmod +x activate-env.sh

echo "${GREEN}✅ Setup complete!${NC}"
echo "
${BLUE}Next steps:${NC}
1. Update your .env file with the correct values
2. Activate the environment:
   source ./activate-env.sh
3. Start the development server:
   npm run dev
4. Visit http://localhost:4000

${BLUE}Project Structure:${NC}
/allervie-dashboard
  ├── .venv/           # Python virtual environment
  ├── node_modules/    # Node.js dependencies
  ├── src/            
  │   ├── pages/      # React pages
  │   ├── components/ # React components
  │   └── services/   # Backend services
  ├── .env            # Environment variables
  └── activate-env.sh # Environment activation script

${YELLOW}Note: Always activate the environment before development:
source ./activate-env.sh${NC}"