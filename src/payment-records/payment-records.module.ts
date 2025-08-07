import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentRecordsController } from './payment-records.controller';
import { PaymentRecordsService } from './payment-records.service';
import { PaymentRecord, PaymentRecordSchema } from './schemas/payment-record.schema';
import { AuthModule } from '../auth/auth.module';
import { OrdersModule } from '../orders/orders.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentRecord.name, schema: PaymentRecordSchema },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => OrdersModule),
    forwardRef(() => BookingsModule),
  ],
  controllers: [PaymentRecordsController],
  providers: [PaymentRecordsService],
  exports: [PaymentRecordsService],
})
export class PaymentRecordsModule {}