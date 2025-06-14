#!/bin/bash

# Domain Setup and Configuration Script for Monk AI
# This script automates the process of setting up domains and configuring Nginx

set -e  # Exit on error

# Colors for better output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
DOMAIN=""
ENVIRONMENT="production"
ENABLE_SSL=true
NGINX_CONF_DIR="./nginx"
NGINX_PROD_CONF="$NGINX_CONF_DIR/nginx.prod.conf"
NGINX_TEMPLATE="$NGINX_CONF_DIR/domain-template.conf"
OUTPUT_CONF=""
FORCE=false

# Help function
show_help() {
    echo -e "${BLUE}Monk AI Domain Setup Script${NC}"
    echo -e "Usage: $0 [options]"
    echo -e "\nOptions:"
    echo -e "  -d, --domain DOMAIN     Domain name to configure (required)"
    echo -e "  -e, --env ENV          Environment (production, staging, development) [default: production]"
    echo -e "  -s, --ssl BOOL         Enable SSL (true/false) [default: true]"
    echo -e "  -o, --output FILE      Output configuration file [default: ./nginx/domains/domain.conf]"
    echo -e "  -f, --force            Force overwrite if configuration already exists"
    echo -e "  -h, --help             Show this help message"
    echo -e "\nExamples:"
    echo -e "  $0 --domain example.com --env production --ssl true"
    echo -e "  $0 --domain staging.example.com --env staging"
    echo -e "  $0 --domain dev.example.com --env development --ssl false"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -d|--domain)
            DOMAIN="$2"
            shift
            shift
            ;;
        -e|--env)
            ENVIRONMENT="$2"
            shift
            shift
            ;;
        -s|--ssl)
            ENABLE_SSL="$2"
            shift
            shift
            ;;
        -o|--output)
            OUTPUT_CONF="$2"
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

# Validate required parameters
if [ -z "$DOMAIN" ]; then
    echo -e "${RED}Error: Domain name is required${NC}"
    show_help
    exit 1
fi

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(production|staging|development)$ ]]; then
    echo -e "${RED}Invalid environment: $ENVIRONMENT${NC}"
    echo -e "Valid environments: production, staging, development"
    exit 1
fi

# Set default output file if not specified
if [ -z "$OUTPUT_CONF" ]; then
    # Create domains directory if it doesn't exist
    mkdir -p "$NGINX_CONF_DIR/domains"
    OUTPUT_CONF="$NGINX_CONF_DIR/domains/${DOMAIN}.conf"
fi

# Check if output file already exists
if [ -f "$OUTPUT_CONF" ] && [ "$FORCE" != true ]; then
    echo -e "${YELLOW}Configuration file for $DOMAIN already exists at $OUTPUT_CONF${NC}"
    read -p "Do you want to overwrite it? (y/n): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Setup cancelled.${NC}"
        exit 0
    fi
fi

# Create domain configuration from template or generate new one
generate_config() {
    echo -e "${GREEN}Generating Nginx configuration for $DOMAIN (Environment: $ENVIRONMENT)${NC}"
    
    # Create domains directory if it doesn't exist
    mkdir -p "$(dirname "$OUTPUT_CONF")"
    
    # If template exists, use it, otherwise generate from scratch
    if [ -f "$NGINX_TEMPLATE" ]; then
        echo -e "${GREEN}Using template from $NGINX_TEMPLATE${NC}"
        cp "$NGINX_TEMPLATE" "$OUTPUT_CONF"
        
        # Replace placeholders in the template
        sed -i "s/{{DOMAIN}}/$DOMAIN/g" "$OUTPUT_CONF"
        sed -i "s/{{ENVIRONMENT}}/$ENVIRONMENT/g" "$OUTPUT_CONF"
    else
        echo -e "${YELLOW}Template not found, generating configuration from scratch${NC}"
        
        # Generate HTTP server block
        cat > "$OUTPUT_CONF" << EOF
# Nginx configuration for $DOMAIN ($ENVIRONMENT environment)

server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Access and error logs
    access_log /var/log/nginx/$DOMAIN.access.log;
    error_log /var/log/nginx/$DOMAIN.error.log;
    
    # Let's Encrypt challenge response handler
    location /.well-known/acme-challenge/ {
        root /usr/share/nginx/html;
    }
    
EOF
        
        # Add SSL redirect if enabled
        if [ "$ENABLE_SSL" = true ]; then
            cat >> "$OUTPUT_CONF" << EOF
    # Redirect all HTTP requests to HTTPS
    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL configuration
    ssl_certificate /etc/nginx/ssl/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/$DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;
    
    # HSTS (optional, but recommended)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Access and error logs
    access_log /var/log/nginx/$DOMAIN.access.log;
    error_log /var/log/nginx/$DOMAIN.error.log;
    
EOF
        else
            # Close the server block if SSL is not enabled
            echo "}" >> "$OUTPUT_CONF"
        fi
        
        # Add location blocks based on environment
        if [ "$ENABLE_SSL" = true ]; then
            # These go inside the HTTPS server block
            cat >> "$OUTPUT_CONF" << EOF
    # Frontend static files
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)\$ {
            expires 30d;
            add_header Cache-Control "public, no-transform";
        }
    }
    
    # Backend API proxy
    location /api/ {
        proxy_pass http://backend:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Custom error handling
    error_page 404 /404.html;
    location = /404.html {
        root /usr/share/nginx/html;
        internal;
    }
    
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
        internal;
    }
}
EOF
        else
            # These go inside the HTTP server block if SSL is not enabled
            cat >> "$OUTPUT_CONF" << EOF
    # Frontend static files
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)\$ {
            expires 30d;
            add_header Cache-Control "public, no-transform";
        }
    }
    
    # Backend API proxy
    location /api/ {
        proxy_pass http://backend:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Custom error handling
    error_page 404 /404.html;
    location = /404.html {
        root /usr/share/nginx/html;
        internal;
    }
    
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
        internal;
    }
}
EOF
        fi
    fi
    
    echo -e "${GREEN}Configuration generated at $OUTPUT_CONF${NC}"
}

# Update main Nginx configuration to include the domain config
update_main_config() {
    if [ -f "$NGINX_PROD_CONF" ]; then
        echo -e "${GREEN}Updating main Nginx configuration to include $DOMAIN${NC}"
        
        # Check if the include directive already exists
        if grep -q "include.*domains/\*.conf" "$NGINX_PROD_CONF"; then
            echo -e "${GREEN}Include directive for domains already exists in main configuration${NC}"
        else
            # Add include directive before the last closing brace
            sed -i '$i\    # Include domain-specific configurations\n    include domains/*.conf;' "$NGINX_PROD_CONF"
            echo -e "${GREEN}Added include directive to main configuration${NC}"
        fi
    else
        echo -e "${YELLOW}Main Nginx configuration not found at $NGINX_PROD_CONF${NC}"
        echo -e "${YELLOW}Please manually include the domain configuration in your Nginx setup${NC}"
    fi
}

# Generate SSL certificate instructions
ssl_instructions() {
    if [ "$ENABLE_SSL" = true ]; then
        echo -e "\n${BLUE}SSL Certificate Setup Instructions:${NC}"
        echo -e "${YELLOW}To obtain an SSL certificate for $DOMAIN, run:${NC}"
        echo -e "./scripts/ssl-renew.sh --domain $DOMAIN --email admin@$DOMAIN"
        echo -e "\n${YELLOW}Or manually with certbot:${NC}"
        echo -e "certbot certonly --webroot -w /usr/share/nginx/html \\"
        echo -e "  --email admin@$DOMAIN \\"
        echo -e "  --agree-tos \\"
        echo -e "  --no-eff-email \\"
        echo -e "  -d $DOMAIN -d www.$DOMAIN"
    fi
}

# DNS record instructions
dns_instructions() {
    echo -e "\n${BLUE}DNS Configuration Instructions:${NC}"
    echo -e "${YELLOW}Add the following DNS records for $DOMAIN:${NC}"
    echo -e "\n1. A Record:"
    echo -e "   Name: @"
    echo -e "   Value: [Your Server IP Address]"
    echo -e "   TTL: 3600"
    
    echo -e "\n2. CNAME Record:"
    echo -e "   Name: www"
    echo -e "   Value: $DOMAIN"
    echo -e "   TTL: 3600"
    
    if [ "$ENABLE_SSL" = true ]; then
        echo -e "\n3. CAA Record (Optional, for enhanced SSL security):"
        echo -e "   Name: @"
        echo -e "   Value: 0 issue \"letsencrypt.org\""
        echo -e "   TTL: 3600"
    fi
}

# Main execution
generate_config
update_main_config

echo -e "\n${GREEN}Domain configuration for $DOMAIN has been completed!${NC}"
ssl_instructions
dns_instructions

echo -e "\n${GREEN}Next Steps:${NC}"
echo -e "1. Restart Nginx to apply the changes"
echo -e "2. Set up DNS records as instructed above"
if [ "$ENABLE_SSL" = true ]; then
    echo -e "3. Obtain SSL certificate as instructed above"
fi

exit 0