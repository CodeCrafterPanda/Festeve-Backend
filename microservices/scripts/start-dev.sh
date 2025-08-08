#!/bin/bash

# Start all microservices in development mode

echo "Starting NestJS Microservices Development Environment..."

# Start infrastructure services
echo "Starting MongoDB and Redis..."
docker-compose up -d mongodb redis

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
sleep 10

# Start microservices in parallel
echo "Starting microservices..."

# Start User Service
cd user-service && npm run start:dev &
USER_PID=$!

# Start Wallet Service
cd ../wallet-service && npm run start:dev &
WALLET_PID=$!

# Start Catalog Service
cd ../catalog-service && npm run start:dev &
CATALOG_PID=$!

# Wait a bit for core services to start
sleep 5

# Start Order Service (depends on other services)
cd ../order-service && npm run start:dev &
ORDER_PID=$!

# Start API Gateway (depends on all services)
sleep 5
cd ../api-gateway && npm run start:dev &
GATEWAY_PID=$!

echo "All services started!"
echo "API Gateway: http://localhost:3000"
echo "Swagger Docs: http://localhost:3000/api"
echo ""
echo "Service Ports:"
echo "- User Service: 3001"
echo "- Wallet Service: 3002"
echo "- Catalog Service: 3003"
echo "- Order Service: 3007"
echo "- API Gateway: 3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo "Stopping all services..."
    kill $USER_PID $WALLET_PID $CATALOG_PID $ORDER_PID $GATEWAY_PID 2>/dev/null
    docker-compose down
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for all background processes
wait