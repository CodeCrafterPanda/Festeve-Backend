import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

// Import all modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReferralModule } from './referral/referral.module';
import { WalletModule } from './wallet/wallet.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { BannersModule } from './banners/banners.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { EventsModule } from './events/events.module';
import { PurohitsModule } from './purohits/purohits.module';
import { BookingsModule } from './bookings/bookings.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { OffersModule } from './offers/offers.module';
import { PaymentRecordsModule } from './payment-records/payment-records.module';
import { AdminSettingsModule } from './admin-settings/admin-settings.module';
import { UploadModule } from './upload/upload.module';
import { VendorsModule } from './vendors/vendors.module';
import { DeliveryModule } from './delivery/delivery.module';

// Filters and Guards
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { configValidationSchema } from './config/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    AuthModule,
    UsersModule,
    ReferralModule,
    WalletModule,
    CategoriesModule,
    ProductsModule,
    BannersModule,
    NewsletterModule,
    TestimonialsModule,
    EventsModule,
    PurohitsModule,
    BookingsModule,
    CartModule,
    OrdersModule,
    OffersModule,
    PaymentRecordsModule,
    AdminSettingsModule,
    UploadModule,
    VendorsModule,
    DeliveryModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}