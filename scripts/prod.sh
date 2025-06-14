#!/bin/bash

# Production deployment script for Monk AI
# This script sets up and starts the production environment

set -e  # Exit on error

# Colors for better output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
REBUILD=false
DETACHED=false
SELF_SIGNED=false
DOMAIN=""
EMAIL=""
SETUP_SSL=false

# Help function
show_help() {
    echo -e "${GREEN}Monk AI Production Deployment Script${NC}"
    echo -e "Usage: $0 [options]"
    echo -e "\nOptions:"
    echo -e "  -r, --rebuild       Rebuild all containers"
    echo -e "  -d, --detached      Run in detached mode"
    echo -e "  -s, --self-signed   Generate self-signed SSL certificates (for testing only)"
    echo -e "  --domain DOMAIN     Domain name for SSL certificate"
    echo -e "  --email EMAIL       Email for SSL certificate registration"
    echo -e "  -h, --help          Show this help message"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -r|--rebuild)
            REBUILD=true
            shift
            ;;
        -d|--detached)
            DETACHED=true
            shift
            ;;
        -s|--self-signed)
            SELF_SIGNED=true
            shift
            ;;
        --domain)
            DOMAIN="$2"
            SETUP_SSL=true
            shift
            shift
            ;;
        --email)
            EMAIL="$2"
            shift
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Create necessary directories
mkdir -p data/ssl
mkdir -p data/certbot/conf
mkdir -p data/certbot/www
mkdir -p logs/nginx
mkdir -p logs/frontend
mkdir -p logs/backend
mkdir -p nginx/domains

# Check if .env file exists, if not create from example
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo -e "${YELLOW}Creating .env file from .env.example${NC}"
        cp .env.example .env
        echo -e "${YELLOW}Please update the .env file with your production settings${NC}"
        echo -e "${YELLOW}You can use the environment manager: ./scripts/env-manager.sh --action setup --env prod${NC}"
    else
        echo -e "${RED}Error: .env.example file not found${NC}"
        exit 1
    fi
fi

# SSL Certificate setup
setup_ssl() {
    if [ "$SETUP_SSL" = true ]; then
        if [ -z "$DOMAIN" ]; then
            echo -e "${RED}Error: Domain name is required for SSL setup${NC}"
            exit 1
        fi
        
        if [ "$SELF_SIGNED" = true ]; then
            echo -e "${YELLOW}Generating self-signed SSL certificate for $DOMAIN${NC}"
            echo -e "${RED}WARNING: Self-signed certificates should only be used for testing!${NC}"
            
            mkdir -p "data/ssl/$DOMAIN"
            
            # Generate self-signed certificate
            openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                -keyout "data/ssl/$DOMAIN/privkey.pem" \
                -out "data/ssl/$DOMAIN/fullchain.pem" \
                -subj "/CN=$DOMAIN/O=Monk AI/C=US" \
                -addext "subjectAltName=DNS:$DOMAIN,DNS:www.$DOMAIN"
                
            echo -e "${GREEN}Self-signed certificate generated for $DOMAIN${NC}"
        else
            if [ -z "$EMAIL" ]; then
                echo -e "${RED}Error: Email is required for Let's Encrypt registration${NC}"
                exit 1
            fi
            
            echo -e "${YELLOW}Setting up Let's Encrypt certificate for $DOMAIN${NC}"
            echo -e "${YELLOW}This will be handled by the certbot service after deployment${NC}"
            echo -e "${YELLOW}Make sure your domain is pointing to this server and port 80 is open${NC}"
            
            # Create domain configuration
            ./scripts/domain-setup.sh --domain "$DOMAIN" --env production --ssl true --force
        fi
    fi
}

# Run the deployment
deploy() {
    # Build arguments
    BUILD_ARGS=""
    if [ "$REBUILD" = true ]; then
        BUILD_ARGS="--build --no-cache"
        echo -e "${YELLOW}Rebuilding all containers${NC}"
    fi
    
    # Detached mode argument
    DETACHED_ARG=""
    if [ "$DETACHED" = true ]; then
        DETACHED_ARG="-d"
        echo -e "${YELLOW}Running in detached mode${NC}"
    fi
    
    echo -e "${GREEN}Starting production deployment...${NC}"
    
    # Start the services using both docker-compose files
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up $DETACHED_ARG $BUILD_ARGS
    
    # If not in detached mode, show instructions for stopping
    if [ "$DETACHED" != true ]; then
        echo -e "\n${YELLOW}To stop the services, press Ctrl+C${NC}"
    else
        echo -e "\n${GREEN}Services started in detached mode${NC}"
        echo -e "${YELLOW}To view logs: docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f${NC}"
        echo -e "${YELLOW}To stop: docker-compose -f docker-compose.yml -f docker-compose.prod.yml down${NC}"
    fi
}

# Main execution
setup_ssl
deploy

exit 0