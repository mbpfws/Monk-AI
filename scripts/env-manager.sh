#!/bin/bash

# Environment Manager for Monk AI
# This script helps manage different environment configurations

set -e  # Exit on error

# Colors for better output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENV="dev"
ACTION=""
FORCE=false
ENV_FILE=".env"
ENV_EXAMPLE=".env.example"
ENV_DIR="./environments"

# Help function
show_help() {
    echo -e "${BLUE}Monk AI Environment Manager${NC}"
    echo -e "Usage: $0 [options]"
    echo -e "\nOptions:"
    echo -e "  -e, --env ENV       Set environment (dev, staging, prod) [default: dev]"
    echo -e "  -a, --action ACTION Action to perform (setup, switch, backup, list)"
    echo -e "  -f, --force         Force action without confirmation"
    echo -e "  -h, --help          Show this help message"
    echo -e "\nExamples:"
    echo -e "  $0 --action setup --env prod     # Setup production environment"
    echo -e "  $0 --action switch --env staging # Switch to staging environment"
    echo -e "  $0 --action backup              # Backup current environment"
    echo -e "  $0 --action list                # List available environments"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -e|--env)
            ENV="$2"
            shift
            shift
            ;;
        -a|--action)
            ACTION="$2"
            shift
            shift
            ;;
        -f|--force)
            FORCE=true
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

# Validate environment
if [[ ! "$ENV" =~ ^(dev|staging|prod)$ ]]; then
    echo -e "${RED}Invalid environment: $ENV${NC}"
    echo -e "Valid environments: dev, staging, prod"
    exit 1
fi

# Validate action
if [[ ! "$ACTION" =~ ^(setup|switch|backup|list)$ ]]; then
    echo -e "${RED}Invalid or missing action: $ACTION${NC}"
    show_help
    exit 1
fi

# Create environments directory if it doesn't exist
mkdir -p "$ENV_DIR"

# Function to backup current environment
backup_env() {
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="$ENV_DIR/env_backup_$timestamp.env"
    
    if [ -f "$ENV_FILE" ]; then
        cp "$ENV_FILE" "$backup_file"
        echo -e "${GREEN}Current environment backed up to: $backup_file${NC}"
    else
        echo -e "${YELLOW}No .env file found to backup${NC}"
        return 1
    fi
}

# Function to setup a new environment
setup_env() {
    local env_target="$ENV_DIR/.env.$ENV"
    
    # Check if environment already exists
    if [ -f "$env_target" ] && [ "$FORCE" != true ]; then
        echo -e "${YELLOW}Environment file for $ENV already exists.${NC}"
        read -p "Do you want to overwrite it? (y/n): " confirm
        if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Setup cancelled.${NC}"
            return 1
        fi
    fi
    
    # Create from example if it doesn't exist or force is true
    if [ ! -f "$env_target" ] || [ "$FORCE" = true ]; then
        if [ -f "$ENV_EXAMPLE" ]; then
            cp "$ENV_EXAMPLE" "$env_target"
            echo -e "${GREEN}Created $env_target from $ENV_EXAMPLE${NC}"
        else
            echo -e "${RED}Error: $ENV_EXAMPLE not found!${NC}"
            return 1
        fi
    fi
    
    # Open the file for editing
    echo -e "${YELLOW}Please edit the environment variables for $ENV:${NC}"
    if command -v nano >/dev/null 2>&1; then
        nano "$env_target"
    elif command -v vim >/dev/null 2>&1; then
        vim "$env_target"
    else
        echo -e "${YELLOW}No editor found. Please edit $env_target manually.${NC}"
    fi
    
    echo -e "${GREEN}Environment $ENV setup complete.${NC}"
    echo -e "${YELLOW}To switch to this environment, run: $0 --action switch --env $ENV${NC}"
}

# Function to switch environments
switch_env() {
    local env_source="$ENV_DIR/.env.$ENV"
    
    # Check if target environment exists
    if [ ! -f "$env_source" ]; then
        echo -e "${RED}Environment file $env_source not found!${NC}"
        echo -e "${YELLOW}Please set up the environment first: $0 --action setup --env $ENV${NC}"
        return 1
    fi
    
    # Backup current environment if it exists
    if [ -f "$ENV_FILE" ]; then
        backup_env
    fi
    
    # Switch to new environment
    cp "$env_source" "$ENV_FILE"
    echo -e "${GREEN}Switched to $ENV environment.${NC}"
    
    # Ask if user wants to restart services
    if [ "$FORCE" != true ]; then
        read -p "Do you want to restart services with the new environment? (y/n): " restart
        if [[ "$restart" =~ ^[Yy]$ ]]; then
            if [ -f "./scripts/dev.sh" ] && [ "$ENV" = "dev" ]; then
                echo -e "${YELLOW}Restarting development environment...${NC}"
                ./scripts/dev.sh -r
            elif [ -f "./scripts/prod.sh" ] && [ "$ENV" = "prod" ]; then
                echo -e "${YELLOW}Restarting production environment...${NC}"
                ./scripts/prod.sh -r
            else
                echo -e "${YELLOW}Please restart services manually.${NC}"
            fi
        fi
    fi
}

# Function to list available environments
list_envs() {
    echo -e "${BLUE}Available environments:${NC}"
    
    if [ -f "$ENV_FILE" ]; then
        echo -e "${GREEN}Current active environment: .env${NC}"
    else
        echo -e "${YELLOW}No active environment (.env file not found)${NC}"
    fi
    
    echo -e "\n${BLUE}Saved environments:${NC}"
    if ls "$ENV_DIR"/.env.* >/dev/null 2>&1; then
        for env_file in "$ENV_DIR"/.env.*; do
            env_name=$(basename "$env_file" | sed 's/\.env\.//')
            echo -e "  - ${GREEN}$env_name${NC} ($env_file)"
        done
    else
        echo -e "  ${YELLOW}No saved environments found${NC}"
    fi
    
    echo -e "\n${BLUE}Backups:${NC}"
    if ls "$ENV_DIR"/env_backup_* >/dev/null 2>&1; then
        for backup in "$ENV_DIR"/env_backup_*; do
            backup_date=$(echo "$backup" | grep -o '[0-9]\{8\}_[0-9]\{6\}')
            formatted_date=$(date -d "${backup_date:0:8} ${backup_date:9:2}:${backup_date:11:2}:${backup_date:13:2}" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "$backup_date")
            echo -e "  - ${YELLOW}$formatted_date${NC} ($backup)"
        done
    else
        echo -e "  ${YELLOW}No backups found${NC}"
    fi
}

# Execute requested action
case "$ACTION" in
    setup)
        setup_env
        ;;
    switch)
        switch_env
        ;;
    backup)
        backup_env
        ;;
    list)
        list_envs
        ;;
esac

exit 0