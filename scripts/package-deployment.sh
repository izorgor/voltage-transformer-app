#!/bin/bash

# Deployment packaging script for Voltage Transformer App
# Creates a timestamped deployment package with all necessary files

set -e

echo "🚀 Creating deployment package..."

# Generate version from timestamp
VERSION=$(date +%Y%m%d-%H%M%S)
PACKAGE_NAME="voltage-app-deployment-${VERSION}"
TEMP_DIR="./temp-deployment"

# Clean up any existing temp directory
if [ -d "${TEMP_DIR}" ]; then
  echo "🧹 Cleaning up old temp directory..."
  rm -rf "${TEMP_DIR}"
fi

# Build the application
echo "📦 Building application..."
npm run build

# Create temporary directory structure
echo "📁 Creating package structure..."
mkdir -p "${TEMP_DIR}/${PACKAGE_NAME}"

# Copy necessary files
echo "📋 Copying files..."
cp -r dist "${TEMP_DIR}/${PACKAGE_NAME}/"
cp -r public "${TEMP_DIR}/${PACKAGE_NAME}/"
cp -r src "${TEMP_DIR}/${PACKAGE_NAME}/"
cp Dockerfile "${TEMP_DIR}/${PACKAGE_NAME}/"
cp docker-compose.yml "${TEMP_DIR}/${PACKAGE_NAME}/"
cp nginx.conf "${TEMP_DIR}/${PACKAGE_NAME}/"
cp .dockerignore "${TEMP_DIR}/${PACKAGE_NAME}/"
cp package.json "${TEMP_DIR}/${PACKAGE_NAME}/"
cp package-lock.json "${TEMP_DIR}/${PACKAGE_NAME}/"
cp tsconfig.json "${TEMP_DIR}/${PACKAGE_NAME}/"
cp tsconfig.app.json "${TEMP_DIR}/${PACKAGE_NAME}/"
cp tsconfig.node.json "${TEMP_DIR}/${PACKAGE_NAME}/"
cp vite.config.ts "${TEMP_DIR}/${PACKAGE_NAME}/"
cp index.html "${TEMP_DIR}/${PACKAGE_NAME}/"
cp tailwind.config.js "${TEMP_DIR}/${PACKAGE_NAME}/"
cp postcss.config.js "${TEMP_DIR}/${PACKAGE_NAME}/"
cp README.md "${TEMP_DIR}/${PACKAGE_NAME}/"

# Create deployment instructions
cat > "${TEMP_DIR}/${PACKAGE_NAME}/DEPLOY.md" << 'EOF'
# Quick Deployment Guide

## Prerequisites
- Docker 20.x or higher
- Docker Compose 2.x or higher

## Deployment Steps

### Option 1: Docker Compose (Recommended)
```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### Option 2: Docker CLI
```bash
# Build the image
docker build -t voltage-app .

# Run the container
docker run -d -p 3000:80 --name voltage-app voltage-app

# View logs
docker logs -f voltage-app

# Stop the container
docker stop voltage-app
docker rm voltage-app
```

## Access
- Application: http://localhost:3000
- Health check: http://localhost:3000/health

## Troubleshooting
- Check logs: `docker-compose logs -f`
- Restart: `docker-compose restart`
- Rebuild: `docker-compose up -d --build`

For detailed documentation, see README.md
EOF

# Create archive
echo "🗜️  Creating archive..."
cd "${TEMP_DIR}"
tar -czf "../${PACKAGE_NAME}.tar.gz" "${PACKAGE_NAME}/"
cd ..

# Clean up temp directory
echo "🧹 Cleaning up..."
rm -rf "${TEMP_DIR}"

# Display results
echo ""
echo "✅ Deployment package created successfully!"
echo "📦 Package: ${PACKAGE_NAME}.tar.gz"
echo "📊 Size: $(du -h ${PACKAGE_NAME}.tar.gz | cut -f1)"
echo ""
echo "To extract and deploy:"
echo "  tar -xzf ${PACKAGE_NAME}.tar.gz"
echo "  cd ${PACKAGE_NAME}"
echo "  docker-compose up -d"
echo ""
