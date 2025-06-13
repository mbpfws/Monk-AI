#!/bin/bash

# Production deployment script for TraeDevMate

# Create required directories
mkdir -p data nginx/ssl

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file doesn't exist."
    echo "Please create a .env file based on .env.example"
    exit 1
fi

# Check for SSL certificates
if [ ! -f nginx/ssl/cert.pem ] || [ ! -f nginx/ssl/key.pem ]; then
    echo "Warning: SSL certificates not found in nginx/ssl/"
    echo "For production, please add proper SSL certificates"
    echo "For testing, creating self-signed certificates..."
    
    # Generate self-signed certificates for testing
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
fi

# Start production environment
echo "Starting production environment with Docker Compose..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Display status
echo "Production environment started in detached mode."
echo "Use 'docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps' to check status." 