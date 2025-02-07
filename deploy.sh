#!/bin/bash

# Color formatting for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
APP_DIR="/Users/supabowl/Downloads/DO app project/Allervie Aesthetic Dashboard"
GITHUB_REPO="jhillbht/allervie-dashboard-aesthetic"
DOCKER_REGISTRY="registry.digitalocean.com"
IMAGE_NAME="allerviedash/dashboard"
APP_ID="47fd3c68-91c9-4556-bc83-ddb7b9f4cdf5"  # Updated to the correct app ID

# Function to print section headers
print_section() {
    echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

# Function to check command success
check_command() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1 successful${NC}"
    else
        echo -e "${RED}✗ $1 failed${NC}"
        exit 1
    fi
}

# Verify local environment
verify_environment() {
    print_section "Verifying Environment"
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Error: Docker is not running${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Docker is running${NC}"

    # Check doctl authentication
    if ! doctl auth list > /dev/null 2>&1; then
        echo -e "${YELLOW}Authenticating with DigitalOcean...${NC}"
        doctl auth init
    fi
    echo -e "${GREEN}✓ DigitalOcean CLI authenticated${NC}"
}

# Sync with GitHub
sync_with_github() {
    print_section "Syncing with GitHub"
    
    # Create temporary .do directory if it doesn't exist
    mkdir -p "$APP_DIR/.do"
    
    # Create app spec file
    cat > "$APP_DIR/.do/app.yaml" << EOL
name: allervie-dashboard
region: sgp
services:
  - name: dashboard
    instance_size_slug: basic
    instance_count: 1
    github:
      repo: jhillbht/allervie-dashboard-aesthetic
      branch: main
      deploy_on_push: true
    dockerfile_path: Dockerfile
    http_port: 8080
    health_check:
      http_path: /health
      port: 8080
      initial_delay_seconds: 10
      period_seconds: 5
      timeout_seconds: 2
      success_threshold: 1
      failure_threshold: 3
    envs:
      - key: NODE_ENV
        value: production
      - key: VITE_SUPABASE_URL
        scope: RUN_TIME
        type: SECRET
        value: \${VITE_SUPABASE_URL}
      - key: VITE_SUPABASE_ANON_KEY
        scope: RUN_TIME
        type: SECRET
        value: \${VITE_SUPABASE_ANON_KEY}
EOL
    
    # Commit and push changes
    git add .
    git commit -m "Update deployment configuration"
    git push origin main
    check_command "GitHub sync"
}

# Build and push Docker image
build_and_push() {
    print_section "Building and Pushing Docker Image"
    
    echo -e "${YELLOW}Building Docker image...${NC}"
    DOCKER_BUILDKIT=1 docker build -t "${DOCKER_REGISTRY}/${IMAGE_NAME}:latest" .
    check_command "Docker build"
    
    echo -e "${YELLOW}Pushing to registry...${NC}"
    docker push "${DOCKER_REGISTRY}/${IMAGE_NAME}:latest"
    check_command "Docker push"
}

# Deploy to DigitalOcean
deploy_to_do() {
    print_section "Deploying to DigitalOcean"
    
    # Update app configuration
    doctl apps update $APP_ID --spec .do/app.yaml
    check_command "App configuration update"
    
    # Trigger new deployment
    doctl apps create-deployment $APP_ID
    check_command "Deployment creation"
}

# Monitor deployment
monitor_deployment() {
    print_section "Monitoring Deployment"
    
    echo -e "${YELLOW}Waiting for deployment to complete...${NC}"
    while true; do
        STATUS=$(doctl apps get-deployment --format Status --no-header $(doctl apps list-deployments $APP_ID --format ID --no-header | head -n1))
        echo -e "${BLUE}Deployment status: $STATUS${NC}"
        if [ "$STATUS" == "SUCCESS" ]; then
            echo -e "${GREEN}Deployment completed successfully!${NC}"
            break
        elif [ "$STATUS" == "ERROR" ]; then
            echo -e "${RED}Deployment failed. Check the logs for more information.${NC}"
            doctl apps logs $APP_ID --type=run_restarted
            exit 1
        fi
        sleep 10
    done
}

# Main execution
main() {
    cd "$APP_DIR" || exit 1
    
    verify_environment
    sync_with_github
    build_and_push
    deploy_to_do
    monitor_deployment
    
    echo -e "\n${GREEN}=====================================${NC}"
    echo -e "${GREEN}🚀 Deployment completed successfully!${NC}"
    echo -e "${GREEN}=====================================${NC}"
}

# Run the script
main