#!/bin/bash

# Automated SSL certificate renewal script for Monk AI

set -e  # Exit on error

# Colors for better output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="example.com"
EMAIL="admin@example.com"
WEBROOT_PATH="/usr/share/nginx/html"
CERTBOT_PATH="/usr/bin/certbot"
NGINX_RELOAD_CMD="docker exec monk-ai-nginx nginx -s reload"
CERT_DIR="/etc/letsencrypt/live/$DOMAIN"
NGINX_SSL_DIR="/path/to/nginx/ssl"

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
    echo -e "${RED}Error: This script must be run as root${NC}"
    exit 1
fi

# Check if certbot is installed
if [ ! -f "$CERTBOT_PATH" ]; then
    echo -e "${YELLOW}Certbot not found. Installing...${NC}"
    apt-get update
    apt-get install -y certbot
fi

# Function to check certificate expiration
check_expiration() {
    if [ ! -d "$CERT_DIR" ]; then
        echo -e "${YELLOW}Certificate directory not found. Will attempt to obtain a new certificate.${NC}"
        return 1
    fi
    
    # Get expiration date
    exp_date=$(openssl x509 -enddate -noout -in "$CERT_DIR/cert.pem" | cut -d= -f2)
    exp_epoch=$(date -d "$exp_date" +%s)
    now_epoch=$(date +%s)
    days_left=$(( (exp_epoch - now_epoch) / 86400 ))
    
    echo -e "${GREEN}Certificate for $DOMAIN expires in $days_left days${NC}"
    
    # Return 0 if more than 30 days left, 1 otherwise
    [ "$days_left" -gt 30 ]
}

# Main process
echo -e "${GREEN}Starting SSL certificate check/renewal for $DOMAIN${NC}"

if check_expiration; then
    echo -e "${GREEN}Certificate still valid, no renewal needed${NC}"
    exit 0
fi

echo -e "${YELLOW}Attempting to renew/obtain certificate...${NC}"

# Try to renew existing certificate first
if [ -d "$CERT_DIR" ]; then
    $CERTBOT_PATH renew --webroot -w $WEBROOT_PATH
else
    # Obtain new certificate
    $CERTBOT_PATH certonly --webroot -w $WEBROOT_PATH \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        -d $DOMAIN -d www.$DOMAIN
fi

# Check if renewal was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Certificate renewal/acquisition successful!${NC}"
    
    # Copy certificates to Nginx directory
    mkdir -p "$NGINX_SSL_DIR"
    cp "$CERT_DIR/fullchain.pem" "$NGINX_SSL_DIR/"
    cp "$CERT_DIR/privkey.pem" "$NGINX_SSL_DIR/"
    
    # Set proper permissions
    chmod 644 "$NGINX_SSL_DIR/fullchain.pem"
    chmod 600 "$NGINX_SSL_DIR/privkey.pem"
    
    # Reload Nginx to apply new certificate
    echo -e "${GREEN}Reloading Nginx...${NC}"
    eval $NGINX_RELOAD_CMD
    
    echo -e "${GREEN}SSL certificate has been renewed and applied successfully!${NC}"
else
    echo -e "${RED}Certificate renewal failed!${NC}"
    exit 1
fi

# Create a log entry
echo "$(date): Certificate for $DOMAIN renewed successfully" >> /var/log/ssl-renewal.log