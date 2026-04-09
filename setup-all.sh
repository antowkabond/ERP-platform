#!/bin/bash
# Complete Setup Script for ERP/Accounting Platform
# Runs both backend and frontend setup

set -e

echo "🚀 Setting up Complete ERP/Accounting Platform..."
echo ""

# Make scripts executable
chmod +x setup-backend.sh
chmod +x setup-frontend.sh
chmod +x docker-start.sh

# Run backend setup
echo "═══════════════════════════════════════"
echo "BACKEND SETUP"
echo "═══════════════════════════════════════"
./setup-backend.sh

echo ""
echo "═══════════════════════════════════════"
echo "FRONTEND SETUP"
echo "═══════════════════════════════════════"
./setup-frontend.sh

echo ""
echo "═══════════════════════════════════════"
echo "✅ COMPLETE SETUP FINISHED"
echo "═══════════════════════════════════════"
echo ""
echo "To start development:"
echo "1. Start Docker services: ./docker-start.sh"
echo "2. Backend terminal: cd backend && npm run start:dev"
echo "3. Frontend terminal: cd frontend && npm run dev"
echo ""
echo "URLs:"
echo "- Backend API: http://localhost:3000"
echo "- Swagger Docs: http://localhost:3000/api/docs"
echo "- Frontend: http://localhost:3001"
echo "- Prisma Studio: cd backend && npx prisma studio"
