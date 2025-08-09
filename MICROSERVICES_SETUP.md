# NestJS Microservices Refactoring Implementation Guide

## Architecture Overview

The monolithic application has been refactored into 6 microservices + 1 API Gateway:

### Microservices (TCP Transport)
1. **Identity Service** (Port 3001) - Auth, Users, Referral, Wallet
2. **E-commerce Service** (Port 3002) - Products, Vendors, Categories, Cart, Orders  
3. **Booking Service** (Port 3003) - Bookings, Purohits, Events, DeliverySlot
4. **Payment Service** (Port 3004) - PaymentRecords, Offers
5. **Content Service** (Port 3005) - Upload, Banners, Newsletter, Testimonials
6. **Admin Service** (Port 3006) - AdminSettings, Guards

### API Gateway (Port 3000)
- Preserves all original HTTP routes
- Forwards requests to appropriate microservices via TCP
- Handles authentication and routing

## Directory Structure

```
Backend/
├── package.json (root orchestration)
├── api-gateway/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── auth/auth.controller.ts
│   │   ├── users/users.controller.ts
│   │   ├── products/products.controller.ts
│   │   └── ... (all original controllers)
│   └── package.json
├── services/
│   ├── identity-service/
│   │   ├── src/
│   │   │   ├── main.ts (TCP port 3001)
│   │   │   ├── app.module.ts
│   │   │   ├── auth/ (copied from src/auth)
│   │   │   ├── users/ (copied from src/users) 
│   │   │   ├── referral/ (copied from src/referral)
│   │   │   └── wallet/ (copied from src/wallet)
│   │   └── package.json
│   ├── e-commerce-service/
│   │   ├── src/
│   │   │   ├── main.ts (TCP port 3002)
│   │   │   ├── app.module.ts
│   │   │   ├── products/ (copied from src/products)
│   │   │   ├── vendors/ (copied from src/vendors)
│   │   │   ├── categories/ (copied from src/categories)
│   │   │   ├── cart/ (copied from src/cart)
│   │   │   └── orders/ (copied from src/orders)
│   │   └── package.json
│   ├── booking-service/ (Port 3003)
│   ├── payment-service/ (Port 3004)
│   ├── content-service/ (Port 3005)
│   └── admin-service/ (Port 3006)
```

## Key Implementation Changes

### 1. Microservice main.ts Template
```typescript
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 300X, // Unique port per service
      },
    },
  );
  
  await app.listen();
  console.log('Service is listening on port 300X');
}
bootstrap();
```

### 2. Removed Dependencies
- All `@Inject(forwardRef())` usages removed
- All `forwardRef()` imports removed  
- Cross-service dependencies eliminated
- Auth guards kept but will be handled by API Gateway

### 3. API Gateway Controller Template
```typescript
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IDENTITY_CLIENT') private identityClient: ClientProxy,
  ) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.identityClient.send('auth_signup', signupDto);
  }
}
```

### 4. API Gateway ClientsModule Configuration
```typescript
ClientsModule.register([
  {
    name: 'IDENTITY_CLIENT',
    transport: Transport.TCP,
    options: { host: 'localhost', port: 3001 },
  },
  {
    name: 'ECOMMERCE_CLIENT', 
    transport: Transport.TCP,
    options: { host: 'localhost', port: 3002 },
  },
  // ... other clients
])
```

## NPM Scripts

Root package.json provides orchestration:

```json
{
  "scripts": {
    "build:all": "npm run build:identity && npm run build:ecommerce && ...",
    "start:all": "concurrently \"npm run start:identity\" \"npm run start:ecommerce\" ...",
    "dev:all": "concurrently \"npm run dev:identity\" \"npm run dev:ecommerce\" ...",
    "install:all": "npm install && cd services/identity-service && npm install && ..."
  }
}
```

## Database Strategy

Each microservice connects to the same MongoDB instance but manages its own domain collections:

- **Identity Service**: users, otps, referrals, wallet-transactions
- **E-commerce Service**: products, vendors, categories, carts, orders
- **Booking Service**: bookings, purohits, events, delivery-slots  
- **Payment Service**: payment-records, offers
- **Content Service**: banners, newsletters, testimonials
- **Admin Service**: admin-settings

## Message Patterns

### Request-Response Patterns
```typescript
// API Gateway -> Microservice
this.identityClient.send('auth_signup', signupDto)
this.ecommerceClient.send('products_findAll', query)
this.bookingClient.send('bookings_create', createBookingDto)
```

### Event Patterns (Future Enhancement)
```typescript
// For async operations
this.paymentClient.emit('payment_completed', paymentData)
```

## Development Workflow

1. **Build All Services**: `npm run build:all`
2. **Start All Services**: `npm run start:all`  
3. **Development Mode**: `npm run dev:all`
4. **Access API**: All original routes available at `http://localhost:3000`

## Production Considerations

1. **Environment Variables**: Each service needs its own .env
2. **Health Checks**: Implement health endpoints for each service
3. **Service Discovery**: Consider Consul/etcd for production
4. **Load Balancing**: Use Nginx/HAProxy for API Gateway scaling
5. **Monitoring**: Implement distributed tracing (Jaeger/Zipkin)
6. **Error Handling**: Implement circuit breakers and retry logic

## Migration Benefits

✅ **Independent Scaling**: Scale services based on load  
✅ **Independent Deployment**: Deploy services separately  
✅ **Technology Flexibility**: Different services can use different tech stacks  
✅ **Team Autonomy**: Teams can own specific services  
✅ **Fault Isolation**: Service failures don't cascade  
✅ **Resource Optimization**: Allocate resources per service needs

## Next Steps

1. Complete remaining service scaffolding
2. Implement API Gateway controllers
3. Add message pattern handlers to microservices
4. Implement health checks and monitoring
5. Add comprehensive error handling
6. Create deployment scripts
7. Add integration tests

This architecture maintains all existing functionality while providing the flexibility and scalability benefits of microservices.
