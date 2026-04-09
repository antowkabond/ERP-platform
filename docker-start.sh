#!/bin/bash
# Start Docker services (PostgreSQL and Redis)

set -e

echo "🐳 Starting Docker services..."

if ! command -v docker-compose &> /dev/null; then
  echo "❌ docker-compose is not installed"
  echo "Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
  exit 1
fi

docker-compose up -d

echo "✅ Docker services started!"
echo ""
echo "Services:"
echo "- PostgreSQL: localhost:5432"
echo "- Redis: localhost:6379"
echo ""
echo "To stop services: docker-compose down"
echo "To view logs: docker-compose logs -f"
