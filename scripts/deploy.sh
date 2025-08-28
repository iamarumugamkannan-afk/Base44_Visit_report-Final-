#!/bin/bash

# CANNA Visit Reports - Production Deployment Script
# This script deploys the application using Docker Compose

set -e

echo "🚀 Deploying CANNA Visit Reports to Production..."

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env files exist
if [ ! -f .env ]; then
    echo "❌ Frontend .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

if [ ! -f server/.env ]; then
    echo "❌ Backend .env file not found. Please copy server/.env.example to server/.env and configure it."
    exit 1
fi

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check if API is healthy
echo "🔍 Checking API health..."
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ API is healthy"
else
    echo "❌ API health check failed"
    docker-compose logs api
    exit 1
fi

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose exec api npm run migrate

# Seed initial data if needed
echo "🌱 Seeding initial data..."
docker-compose exec api npm run seed

echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Application is now available at:"
echo "   Frontend: http://localhost"
echo "   API: http://localhost/api"
echo ""
echo "📊 To monitor the application:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop the application:"
echo "   docker-compose down"