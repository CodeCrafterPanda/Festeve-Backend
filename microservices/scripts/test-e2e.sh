#!/bin/bash

# End-to-end testing script for microservices

echo "Starting E2E Tests for Microservices..."

# Start test environment
echo "Starting test infrastructure..."
docker-compose -f docker-compose.test.yml up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 30

# Function to check service health
check_service() {
    local service_name=$1
    local port=$2
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:$port/health >/dev/null 2>&1; then
            echo "$service_name is ready"
            return 0
        fi
        echo "Waiting for $service_name... (attempt $attempt/$max_attempts)"
        sleep 2
        ((attempt++))
    done

    echo "$service_name failed to start"
    return 1
}

# Check all services
check_service "User Service" 3001
check_service "Wallet Service" 3002
check_service "Catalog Service" 3003
check_service "Order Service" 3007
check_service "API Gateway" 3000

# Run E2E tests
echo "Running E2E tests..."

# Test 1: User Authentication Flow
echo "Testing user authentication flow..."
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "provider": "native",
    "password": "TestPass123!"
  }'

# Test 2: Product Catalog
echo "Testing product catalog..."
curl -X GET http://localhost:3000/products

# Test 3: Order Creation (requires authentication)
echo "Testing order creation..."
# This would require a valid JWT token from the signup/login flow

# Run automated test suites
cd api-gateway
npm run test:e2e

cd ../user-service
npm run test:e2e

cd ../catalog-service
npm run test:e2e

cd ../order-service
npm run test:e2e

echo "E2E tests completed!"

# Cleanup
echo "Cleaning up test environment..."
docker-compose -f docker-compose.test.yml down