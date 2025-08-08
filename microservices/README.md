# NestJS Microservices Architecture

This project demonstrates the migration from a monolithic NestJS application to a microservices architecture while maintaining 100% API compatibility and business logic.

## Architecture Overview

### Services

1. **API Gateway** (Port 3000) - HTTP API aggregation and routing
2. **User Service** (Port 3001) - Authentication, user management, referrals
3. **Wallet Service** (Port 3002) - Wallet transactions, coins, money
4. **Catalog Service** (Port 3003) - Products, categories, vendors
5. **Content Service** (Port 3004) - Banners, newsletters, testimonials
6. **Event Service** (Port 3005) - Events, festivals, purohits
7. **Booking Service** (Port 3006) - Service bookings
8. **Order Service** (Port 3007) - Cart, orders, payments, delivery
9. **Promotion Service** (Port 3008) - Offers, discounts
10. **Admin Service** (Port 3009) - Admin settings

### Communication

- **Transport**: TCP (configurable to Redis/NATS)
- **Pattern**: Request-Response for synchronous operations
- **Pattern**: Event-driven for asynchronous operations
- **Authentication**: Centralized in API Gateway with token validation

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- MongoDB (via Docker)

### Development Setup

1. **Clone and Install**
   ```bash
   git clone <repository>
   cd microservices
   
   # Install dependencies for all services
   ./scripts/install-all.sh
   ```

2. **Start Development Environment**
   ```bash
   # Start all services in development mode
   ./scripts/start-dev.sh
   ```

3. **Access Services**
   - API Gateway: http://localhost:3000
   - Swagger Documentation: http://localhost:3000/api
   - Individual services: http://localhost:300X (where X is service number)

### Production Setup

1. **Build and Deploy**
   ```bash
   # Build all services
   docker-compose build
   
   # Start production environment
   docker-compose up -d
   ```

2. **Health Checks**
   ```bash
   # Check all services
   ./scripts/health-check.sh
   ```

## Testing

### Unit Tests
```bash
# Test individual service
cd user-service
npm run test

# Test all services
./scripts/test-all.sh
```

### Integration Tests
```bash
# Test service-to-service communication
cd user-service
npm run test:integration
```

### End-to-End Tests
```bash
# Test complete user journeys
./scripts/test-e2e.sh
```

## Migration from Monolith

### Phase 1: Preparation
1. Set up shared interfaces and constants
2. Configure development environment
3. Plan database strategy

### Phase 2: Service Extraction
1. Start with User Service (least dependencies)
2. Extract Catalog Service
3. Extract Order Service (most complex)
4. Extract remaining services

### Phase 3: API Gateway
1. Implement routing and aggregation
2. Centralize authentication
3. Add circuit breakers and retry logic

### Phase 4: Testing & Optimization
1. Comprehensive testing at all levels
2. Performance optimization
3. Monitoring and observability

### Phase 5: Production Deployment
1. Infrastructure setup
2. Blue-green deployment
3. Gradual traffic migration

## Key Features

### Preserved from Monolith
- ✅ All API endpoints and contracts
- ✅ Authentication and authorization
- ✅ Data validation and transformation
- ✅ Error handling and responses
- ✅ Swagger documentation
- ✅ Business logic and workflows

### New Microservices Benefits
- 🚀 Independent deployments
- 📈 Horizontal scaling
- 🔧 Technology diversity
- 🛡️ Fault isolation
- 👥 Team autonomy
- 🔄 Faster development cycles

## Configuration

### Environment Variables

Each service uses environment variables for configuration:

```bash
# User Service
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/users
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# API Gateway
USER_SERVICE_HOST=localhost
USER_SERVICE_PORT=3001
CATALOG_SERVICE_HOST=localhost
CATALOG_SERVICE_PORT=3003
```

### Service Discovery

Services are configured to communicate via:
- **Development**: Direct host:port configuration
- **Production**: Service discovery via Docker networks or Kubernetes

## Monitoring and Observability

### Health Checks
Each service exposes a `/health` endpoint for monitoring.

### Logging
Structured logging with correlation IDs for distributed tracing.

### Metrics
Prometheus metrics for monitoring service performance.

## Troubleshooting

### Common Issues

1. **Service Connection Errors**
   ```bash
   # Check if service is running
   curl http://localhost:3001/health
   
   # Check Docker networks
   docker network ls
   ```

2. **Database Connection Issues**
   ```bash
   # Check MongoDB status
   docker-compose logs mongodb
   
   # Verify connection string
   echo $MONGODB_URI
   ```

3. **Authentication Failures**
   ```bash
   # Verify JWT secret consistency
   # Check token expiration
   # Validate user service connectivity
   ```

### Performance Issues

1. **High Latency**
   - Check network connectivity between services
   - Monitor database query performance
   - Implement caching where appropriate

2. **Memory Leaks**
   - Monitor service memory usage
   - Check for unclosed database connections
   - Review event listener cleanup

## Contributing

1. Follow the existing code structure
2. Maintain API compatibility
3. Add comprehensive tests
4. Update documentation
5. Follow semantic versioning

## License

MIT License - see LICENSE file for details.