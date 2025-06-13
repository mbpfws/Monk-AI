#!/bin/bash

# Development startup script for TraeDevMate

# Create data directory if it doesn't exist
mkdir -p data

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file doesn't exist."
    echo "Please create a .env file based on .env.example"
    exit 1
fi

# Start development environment
echo "Starting development environment with Docker Compose..."
docker-compose up --build

# Exit
echo "Development environment stopped." 