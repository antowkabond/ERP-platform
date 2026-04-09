#!/bin/bash
# Backend Setup Script for ERP/Accounting Platform
# Run this script to initialize the NestJS backend

set -e

echo "🚀 Setting up ERP/Accounting Platform Backend..."

cd backend

# Check if node_modules exists
if [ -d "node_modules" ]; then
  echo "✓ Dependencies already installed"
else
  echo "📦 Installing dependencies..."
  npm install
fi

# Install additional required dependencies
echo "📦 Installing additional dependencies..."
npm install --save \
  passport-jwt @nestjs/passport \
  ioredis \
  @nestjs/bull bull \
  exceljs pdfkit \
  @types/passport-jwt \
  @types/ioredis \
  @types/pdfkit

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Check if .env exists
if [ ! -f ".env" ]; then
  echo "⚙️  Creating .env file..."
  cp .env.example .env
  echo "⚠️  Please update .env with your configuration"
fi

echo "✅ Backend setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your database credentials"
echo "2. Run: cd backend && npx prisma migrate dev"
echo "3. Run: cd backend && npm run start:dev"
