#!/bin/bash

# Exit on any error
set -e

echo "=== Starting TMS Automated EC2 Deployment Setup ==="

# 1. Update System Packages
echo "--> Updating system packages..."
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js (v20 LTS), Git, Nginx, and Build Tools
echo "--> Installing Node.js 20, Git, Nginx, and Build Tools..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx build-essential

# Global PM2 installation
sudo npm install -g pm2

# 3. Verify directory structure
APP_DIR=$(pwd)
echo "--> Working directory: $APP_DIR"

if [ ! -d "$APP_DIR/Backend" ]; then
    echo "Error: Must be run from the root of the TMS repository containing Backend folder."
    exit 1
fi

# 4. Setup Backend
echo "--> Setting up Backend..."
cd "$APP_DIR/Backend"

# Ensure .env exists
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "Created Backend/.env from .env.example. Please update MONGO_URI and JWT_SECRET!"
    else
        echo "Creating default Backend/.env..."
        cat <<EOT > .env
PORT=5050
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/tms
JWT_SECRET=production_jwt_secret_change_me
JWT_EXPIRES_IN=7d
EOT
    fi
fi

npm install --production
mkdir -p uploads

# Start / Restart Backend via PM2 on port 5050
echo "--> Starting Backend with PM2 on port 5050..."
pm2 stop tms-backend || true
pm2 start server.js --name "tms-backend"
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER || true

# 5. Setup Web Frontend (Modernized Jobie UI in mobile/ or Frontend/)
if [ -d "$APP_DIR/mobile" ]; then
    echo "--> Building Modernized Jobie UI (Expo Web)..."
    cd "$APP_DIR/mobile"
    npm install
    npx expo export --platform web
    WEB_ROOT="$APP_DIR/mobile/dist"
elif [ -d "$APP_DIR/Frontend" ]; then
    echo "--> Building Frontend..."
    cd "$APP_DIR/Frontend"
    npm install
    REACT_APP_API_URL="/api" npm run build
    WEB_ROOT="$APP_DIR/Frontend/build"
else
    echo "Error: No web frontend directory found (neither mobile/ nor Frontend/)."
    exit 1
fi

# 6. Configure Nginx Reverse Proxy
echo "--> Configuring Nginx reverse proxy to $WEB_ROOT and Backend port 5050..."
sudo cat <<EOT | sudo tee /etc/nginx/sites-available/tms
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;
    client_max_body_size 25M;

    # Serve Web Application
    location / {
        root $WEB_ROOT;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy API Requests to Express (Port 5050)
    location /api/ {
        proxy_pass http://127.0.0.1:5050/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Proxy Uploaded Files
    location /uploads/ {
        proxy_pass http://127.0.0.1:5050/uploads/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOT

# Enable Nginx site configuration
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/tms /etc/nginx/sites-enabled/tms

# Test Nginx syntax and restart
sudo nginx -t
sudo systemctl restart nginx

echo "========================================================"
echo "  TMS Deployment Complete!"
echo "  - Backend running via PM2 on port 5050"
echo "  - Web build served via Nginx on port 80"
echo "  - Make sure your AWS Security Group allows inbound on Port 80 & 22."
echo "========================================================"
