#!/bin/bash
# Frontend Setup Script for ERP/Accounting Platform
# Run this script to initialize the Next.js frontend

set -e

echo "🚀 Setting up ERP/Accounting Platform Frontend..."

cd frontend

# Initialize Next.js project if package.json doesn't exist
if [ ! -f "package.json" ]; then
  echo "📦 Initializing Next.js project..."
  npm init -y
  
  # Install Next.js and dependencies
  npm install next@latest react@latest react-dom@latest
  npm install --save-dev typescript @types/react @types/node
  
  # Install additional dependencies
  npm install \
    @tanstack/react-query \
    @auth0/auth0-react \
    react-hook-form \
    zod \
    @hookform/resolvers \
    tailwindcss postcss autoprefixer \
    class-variance-authority clsx tailwind-merge \
    lucide-react
  
  # Initialize Tailwind
  npx tailwindcss init -p
  
  echo "✓ Dependencies installed"
else
  echo "✓ package.json exists"
  npm install
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
  echo "⚙️  Creating .env.local file..."
  cp .env.example .env.local
  echo "⚠️  Please update .env.local with your configuration"
fi

echo "✅ Frontend setup complete!"
echo ""
echo "Next steps:"
echo "1. Update frontend/.env.local with your API URL and Auth0 credentials"
echo "2. Run: cd frontend && npm run dev"
