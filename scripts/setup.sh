#!/bin/bash

# CANNA Visit Reports - Setup Script
# This script sets up the development environment

set -e

echo "🌱 Setting up CANNA Visit Reports Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. Docker is required for the database."
    echo "   You can install Docker from: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if PostgreSQL is running locally or start with Docker
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "🐘 Starting PostgreSQL with Docker..."
    docker run --name canna-postgres \
        -e POSTGRES_DB=canna_visits \
        -e POSTGRES_USER=canna_user \
        -e POSTGRES_PASSWORD=canna_password \
        -p 5432:5432 \
        -d postgis/postgis:15-3.3
    
    echo "⏳ Waiting for PostgreSQL to start..."
    sleep 10
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install
cd ..

# Copy environment files if they don't exist
if [ ! -f .env ]; then
    echo "📝 Creating frontend environment file..."
    cp .env.example .env
fi

if [ ! -f server/.env ]; then
    echo "📝 Creating backend environment file..."
    cp server/.env.example server/.env
fi

# Run database migrations
echo "🗄️  Running database migrations..."
cd server
npm run migrate

# Seed initial data
echo "🌱 Seeding initial data..."
npm run seed

cd ..

echo "✅ Setup completed successfully!"
echo ""
echo "🚀 To start the development servers:"
echo "   1. Backend:  cd server && npm run dev"
echo "   2. Frontend: npm run dev"
echo ""
echo "🔑 Demo credentials:"
echo "   Admin: admin@canna.com / admin123"
echo "   Sales Rep: sales@canna.com / user123"
echo ""
echo "🌐 Application will be available at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:3001/api"