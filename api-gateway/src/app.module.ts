import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

// Import Gateway Controllers (preserve original HTTP routes)
import { AuthController } from './auth/auth.controller';
// TODO: Create remaining controllers
// import { UsersController } from './users/users.controller';
// import { ReferralController } from './referral/referral.controller';
// import { WalletController } from './wallet/wallet.controller';
// import { ProductsController } from './products/products.controller';
// import { VendorsController } from './vendors/vendors.controller';
// import { CategoriesController } from './categories/categories.controller';
// import { CartController } from './cart/cart.controller';
// import { OrdersController } from './orders/orders.controller';
// import { BookingsController } from './bookings/bookings.controller';
// import { PurohitsController } from './purohits/purohits.controller';
// import { EventsController } from './events/events.controller';
// import { DeliveryController } from './delivery/delivery.controller';
// import { PaymentRecordsController } from './payment-records/payment-records.controller';
// import { OffersController } from './offers/offers.controller';
// import { UploadController } from './upload/upload.controller';
// import { BannersController } from './banners/banners.controller';
// import { NewsletterController } from './newsletter/newsletter.controller';
// import { TestimonialsController } from './testimonials/testimonials.controller';
// import { AdminSettingsController } from './admin-settings/admin-settings.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    ClientsModule.register([
      {
        name: 'IDENTITY_CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
      {
        name: 'ECOMMERCE_CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
      {
        name: 'BOOKING_CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3003,
        },
      },
      {
        name: 'PAYMENT_CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3004,
        },
      },
      {
        name: 'CONTENT_CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3005,
        },
      },
      {
        name: 'ADMIN_CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3006,
        },
      },
    ]),
  ],
  controllers: [
    // Identity Service Controllers
    AuthController,
    // TODO: Add remaining controllers as they are implemented
    // UsersController,
    // ReferralController,
    // WalletController,
    
    // E-commerce Service Controllers
    // ProductsController,
    // VendorsController,
    // CategoriesController,
    // CartController,
    // OrdersController,
    
    // Booking Service Controllers
    // BookingsController,
    // PurohitsController,
    // EventsController,
    // DeliveryController,
    
    // Payment Service Controllers
    // PaymentRecordsController,
    // OffersController,
    
    // Content Service Controllers
    // UploadController,
    // BannersController,
    // NewsletterController,
    // TestimonialsController,
    
    // Admin Service Controllers
    // AdminSettingsController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
