# NestJS Microservices Migration Plan

## Phase 1: Preparation (Week 1)

### 1.1 Setup Shared Libraries
```bash
# Create shared interfaces and constants
mkdir -p microservices/shared/{interfaces,constants,dto}

# Copy shared types and message patterns
# (Already created in previous steps)
```

### 1.2 Database Strategy
- **Option A**: Shared Database (Easier migration)
  - Keep single MongoDB instance
  - Each service connects to same database
  - Gradually split databases later

- **Option B**: Database per Service (Recommended)
  - Create separate databases for each domain
  - Migrate data using scripts
  - Implement eventual consistency

### 1.3 Environment Setup
```bash
# Create docker-compose for local development
# Setup service discovery (optional)
# Configure monitoring and logging
```

## Phase 2: Service Extraction (Weeks 2-4)

### 2.1 Start with User Service (Week 2)
1. **Create User Service**
   ```bash
   cd microservices/user-service
   npm install
   npm run start:dev
   ```

2. **Update Original Monolith**
   - Add ClientProxy for User Service
   - Replace direct calls with microservice calls
   - Keep both implementations during transition

3. **Testing**
   ```bash
   # Test user service independently
   npm run test
   
   # Test gateway integration
   cd ../api-gateway
   npm run test:e2e
   ```

### 2.2 Extract Catalog Service (Week 3)
1. **Create Catalog Service**
   - Move ProductsModule, CategoriesModule, VendorsModule
   - Update dependencies to use ClientProxy

2. **Update Dependencies**
   - Order Service → Catalog Service (product validation)
   - Cart Service → Catalog Service (product details)

### 2.3 Extract Order Service (Week 4)
1. **Create Order Service**
   - Move OrdersModule, CartModule, PaymentRecordsModule
   - Handle complex inter-service communication

2. **Event-Driven Architecture**
   ```typescript
   // Example: Order creation triggers wallet debit
   @EventPattern('order.created')
   async handleOrderCreated(data: OrderCreatedEvent) {
     await this.walletClient.send('wallet.debit', {
       userId: data.userId,
       amount: data.amount,
       source: 'order',
     });
   }
   ```

## Phase 3: API Gateway Implementation (Week 5)

### 3.1 Create API Gateway
```bash
cd microservices/api-gateway
npm install
npm run start:dev
```

### 3.2 Route Configuration
```typescript
// Example routing in gateway
@Controller('products')
export class ProductsController {
  constructor(
    @Inject('CATALOG_SERVICE') private catalogClient: ClientProxy,
  ) {}

  @Get()
  async findAll(@Query() query: any) {
    return firstValueFrom(
      this.catalogClient.send('catalog.get_products', query)
    );
  }
}
```

### 3.3 Authentication Middleware
```typescript
// Centralized auth in gateway
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = this.extractToken(context);
    const user = await this.userService.validateToken(token);
    context.switchToHttp().getRequest().user = user;
    return true;
  }
}
```

## Phase 4: Remaining Services (Weeks 6-8)

### 4.1 Service Priority Order
1. **Wallet Service** (Week 6)
   - Critical for transactions
   - Used by multiple services

2. **Event & Booking Services** (Week 7)
   - Domain-specific functionality
   - Lower coupling with other services

3. **Content & Admin Services** (Week 8)
   - Less critical services
   - Can be migrated last

## Phase 5: Testing & Optimization (Week 9)

### 5.1 End-to-End Testing
```typescript
// Example E2E test
describe('Order Flow (E2E)', () => {
  it('should create order with product validation', async () => {
    // Start all required services
    const userService = await startUserService();
    const catalogService = await startCatalogService();
    const orderService = await startOrderService();
    const gateway = await startGateway();

    // Test complete flow
    const response = await request(gateway)
      .post('/orders')
      .send(orderData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
  });
});
```

### 5.2 Performance Testing
- Load test each service individually
- Test inter-service communication latency
- Monitor resource usage

### 5.3 Circuit Breaker Implementation
```typescript
@Injectable()
export class CatalogService {
  private circuitBreaker = new CircuitBreaker(this.catalogClient);

  async getProduct(id: string) {
    return this.circuitBreaker.fire(() =>
      firstValueFrom(this.catalogClient.send('get_product', { id }))
    );
  }
}
```

## Phase 6: Production Deployment (Week 10)

### 6.1 Infrastructure Setup
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  api-gateway:
    build: ./api-gateway
    ports:
      - "3000:3000"
    environment:
      - USER_SERVICE_HOST=user-service
      - CATALOG_SERVICE_HOST=catalog-service

  user-service:
    build: ./user-service
    ports:
      - "3001:3001"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/users

  catalog-service:
    build: ./catalog-service
    ports:
      - "3003:3003"
```

### 6.2 Monitoring & Logging
```typescript
// Add distributed tracing
import { trace } from '@opentelemetry/api';

@Controller()
export class ProductsController {
  @Get(':id')
  async getProduct(@Param('id') id: string) {
    const span = trace.getActiveSpan();
    span?.setAttributes({ 'product.id': id });
    
    return this.catalogService.getProduct(id);
  }
}
```

### 6.3 Rollback Strategy
1. **Blue-Green Deployment**
   - Keep monolith running alongside microservices
   - Route traffic gradually to new services
   - Quick rollback if issues occur

2. **Feature Flags**
   ```typescript
   @Get('products')
   async getProducts() {
     if (this.featureFlags.isEnabled('use_microservices')) {
       return this.catalogClient.send('get_products', {});
     }
     return this.legacyProductService.getProducts();
   }
   ```

## Testing Strategy

### Unit Testing
```typescript
// Test individual service methods
describe('UserService', () => {
  it('should validate token', async () => {
    const mockUser = { id: '1', email: 'test@test.com' };
    jest.spyOn(userModel, 'findById').mockResolvedValue(mockUser);
    
    const result = await userService.validateToken('valid-token');
    expect(result).toEqual(mockUser);
  });
});
```

### Integration Testing
```typescript
// Test service-to-service communication
describe('Order Service Integration', () => {
  it('should validate product before creating order', async () => {
    const mockProduct = { id: '1', price: 100, stock: 10 };
    catalogClient.send.mockResolvedValue(mockProduct);
    
    const order = await orderService.createOrder(orderData);
    expect(catalogClient.send).toHaveBeenCalledWith('get_product', { id: '1' });
  });
});
```

### E2E Testing
```typescript
// Test complete user journeys
describe('Complete Order Flow', () => {
  beforeAll(async () => {
    // Start all services
    await startTestServices();
  });

  it('should complete order from cart to payment', async () => {
    // Login user
    const loginResponse = await request(app)
      .post('/auth/login')
      .send(credentials);

    // Add to cart
    await request(app)
      .post('/cart/items')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(cartItem);

    // Create order
    const orderResponse = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(orderData);

    expect(orderResponse.status).toBe(201);
  });
});
```

## Rollback Plan

### Immediate Rollback (< 5 minutes)
1. **Load Balancer Switch**
   ```bash
   # Switch traffic back to monolith
   kubectl patch service api-gateway -p '{"spec":{"selector":{"app":"monolith"}}}'
   ```

2. **Feature Flag Disable**
   ```typescript
   // Disable microservices via feature flag
   this.configService.set('USE_MICROSERVICES', false);
   ```

### Gradual Rollback (< 30 minutes)
1. **Service-by-Service Rollback**
   - Identify problematic service
   - Route specific endpoints back to monolith
   - Keep working services on microservices

2. **Data Consistency Check**
   ```typescript
   // Verify data consistency between services
   const monolithData = await monolithService.getData();
   const microserviceData = await microservice.getData();
   
   if (!isEqual(monolithData, microserviceData)) {
     await this.syncData(monolithData, microserviceData);
   }
   ```

## Success Metrics

### Performance Metrics
- **Response Time**: < 200ms for 95th percentile
- **Throughput**: Handle same load as monolith
- **Availability**: 99.9% uptime per service

### Development Metrics
- **Deployment Frequency**: Increase by 50%
- **Lead Time**: Reduce by 30%
- **Recovery Time**: < 15 minutes for rollbacks

### Business Metrics
- **Zero Downtime**: No service interruption during migration
- **Feature Parity**: 100% API compatibility
- **User Experience**: No degradation in user experience

This migration plan ensures a smooth transition from monolith to microservices while maintaining system reliability and business continuity.