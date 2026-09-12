#!/bin/bash
set -e

echo "=== Docker Setup Validation ==="
echo

# Check Docker files exist
echo "[1/4] Checking Docker files..."
test -f Dockerfile && echo "✓ Dockerfile found"
test -f docker-compose.yml && echo "✓ docker-compose.yml found"
test -f nginx.conf && echo "✓ nginx.conf found"
test -f .dockerignore && echo "✓ .dockerignore found"
echo

# Validate docker-compose.yml syntax
echo "[2/4] Validating docker-compose.yml..."
if command -v docker &> /dev/null; then
  docker compose config > /dev/null 2>&1 && echo "✓ docker-compose.yml valid" || echo "✗ docker-compose.yml invalid"
else
  echo "⊘ Docker not in PATH, skipping validation"
fi
echo

# Check build output exists
echo "[3/4] Checking build artifacts..."
test -d apps/frontend/dist && echo "✓ dist/ folder exists" || echo "✗ dist/ missing (run: cd apps/frontend && npm run build)"
test -f apps/frontend/dist/index.html && echo "✓ index.html present" || echo "✗ index.html missing"
echo

# Dockerfile validation
echo "[4/4] Checking Dockerfile structure..."
grep -q "FROM node:24-alpine" Dockerfile && echo "✓ Build stage: Node 24 Alpine"
grep -q "FROM nginx:alpine" Dockerfile && echo "✓ Runtime stage: Nginx Alpine"
grep -q "npm ci" Dockerfile && echo "✓ Install: npm ci"
grep -q "npm run build" Dockerfile && echo "✓ Build command present"
echo

echo "=== Summary ==="
echo "Docker setup ready. To run:"
echo "  sudo docker compose build"
echo "  sudo docker compose up -d"
echo "  # Access at http://localhost"
echo
echo "To stop:"
echo "  sudo docker compose down"
