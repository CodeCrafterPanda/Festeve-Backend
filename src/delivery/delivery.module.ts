import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryController } from './delivery.controller';
import { DeliverySlotService } from './delivery-slot.service';
import { DeliverySlot, DeliverySlotSchema } from './schemas/delivery-slot.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeliverySlot.name, schema: DeliverySlotSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [DeliveryController],
  providers: [DeliverySlotService],
  exports: [DeliverySlotService],
})
export class DeliveryModule {}