# NestJS Microservices Decomposition Analysis

## Current Module Analysis

Based on the existing codebase, I've identified the following modules and their dependencies:

### Existing Modules:
1. **AuthModule** - Authentication & authorization
2. **UsersModule** - User management
3. **ReferralModule** - Referral system
4. **WalletModule** - Wallet & transactions
5. **CategoriesModule** - Product categories
6. **ProductsModule** - Product catalog
7. **VendorsModule** - Vendor management
8. **BannersModule** - Banner management
9. **NewsletterModule** - Newsletter subscriptions
10. **TestimonialsModule** - Customer testimonials
11. **EventsModule** - Events & festivals
12. **PurohitsModule** - Purohit (priest) management
13. **BookingsModule** - Service bookings
14. **CartModule** - Shopping cart
15. **OrdersModule** - Order management
16. **OffersModule** - Promotional offers
17. **PaymentRecordsModule** - Payment tracking
18. **AdminSettingsModule** - Admin configuration
19. **UploadModule** - File uploads
20. **DeliveryModule** - Delivery slots

## Proposed Microservice Domains

### 1. **User Service** (`user-service`)
- **Modules**: AuthModule, UsersModule, ReferralModule
- **Responsibilities**: Authentication, user management, referral system
- **Port**: 3001

### 2. **Wallet Service** (`wallet-service`)
- **Modules**: WalletModule
- **Responsibilities**: Wallet management, transactions, coins/money
- **Port**: 3002

### 3. **Catalog Service** (`catalog-service`)
- **Modules**: CategoriesModule, ProductsModule, VendorsModule
- **Responsibilities**: Product catalog, categories, vendor management
- **Port**: 3003

### 4. **Content Service** (`content-service`)
- **Modules**: BannersModule, NewsletterModule, TestimonialsModule, UploadModule
- **Responsibilities**: Content management, file uploads, marketing content
- **Port**: 3004

### 5. **Event Service** (`event-service`)
- **Modules**: EventsModule, PurohitsModule
- **Responsibilities**: Events, festivals, purohit management
- **Port**: 3005

### 6. **Booking Service** (`booking-service`)
- **Modules**: BookingsModule
- **Responsibilities**: Service bookings, scheduling
- **Port**: 3006

### 7. **Order Service** (`order-service`)
- **Modules**: CartModule, OrdersModule, PaymentRecordsModule, DeliveryModule
- **Responsibilities**: Shopping cart, orders, payments, delivery
- **Port**: 3007

### 8. **Promotion Service** (`promotion-service`)
- **Modules**: OffersModule
- **Responsibilities**: Offers, discounts, promotions
- **Port**: 3008

### 9. **Admin Service** (`admin-service`)
- **Modules**: AdminSettingsModule
- **Responsibilities**: Admin configuration, settings
- **Port**: 3009

### 10. **API Gateway** (`api-gateway`)
- **Responsibilities**: HTTP API aggregation, routing to microservices
- **Port**: 3000

## Dependency Analysis

### Current Circular Dependencies:
1. **AuthModule** ↔ **ReferralModule** (forwardRef)
2. **ProductsModule** ↔ **VendorsModule** (forwardRef)
3. **OrdersModule** ↔ **PaymentRecordsModule** (forwardRef)
4. **BookingsModule** ↔ **PaymentRecordsModule** (forwardRef)

### Cross-Service Dependencies (to be replaced with ClientProxy):
- User Service → Wallet Service (referral bonuses)
- Order Service → User Service (user validation)
- Order Service → Catalog Service (product validation)
- Booking Service → Event Service (event validation)
- Booking Service → User Service (user validation)
- All Services → User Service (authentication)

## Communication Patterns

### Synchronous (Request-Response):
- User authentication/validation
- Product/vendor lookups
- Order creation validation

### Asynchronous (Event-Driven):
- Wallet transactions
- Referral bonuses
- Order status updates
- Payment confirmations