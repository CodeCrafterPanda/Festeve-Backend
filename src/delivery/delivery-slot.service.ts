import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DeliverySlot, DeliverySlotDocument } from './schemas/delivery-slot.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';

@Injectable()
export class DeliverySlotService {
  constructor(
    @InjectModel(DeliverySlot.name) private slotModel: Model<DeliverySlotDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async getAvailableSlots(productId: Types.ObjectId): Promise<DeliverySlot[]> {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid product ID');
    }

    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const now = new Date();
    const baseFilter: any = {
      startTime: { $gte: now },
      isActive: true,
      $expr: { $lt: ['$currentOrders', '$maxOrders'] }
    };

    // If it's a hot item, limit to slots within 90 minutes
    if (product.isHotItem) {
      const cutoff = new Date(Date.now() + 90 * 60 * 1000);
      baseFilter.startTime = { $gte: now, $lte: cutoff };
    }

    const slots = await this.slotModel
      .find(baseFilter)
      .sort({ startTime: 1 })
      .exec();

    return slots || [];
  }

  async getAllSlots(): Promise<DeliverySlot[]> {
    return this.slotModel.find({ isActive: true }).sort({ startTime: 1 }).exec();
  }

  async createSlot(slotData: Partial<DeliverySlot>): Promise<DeliverySlot> {
    const slot = new this.slotModel(slotData);
    return slot.save();
  }

  async updateSlot(id: string, updateData: Partial<DeliverySlot>): Promise<DeliverySlot> {
    const slot = await this.slotModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .exec();

    if (!slot) {
      throw new NotFoundException(`Delivery slot with ID ${id} not found`);
    }

    return slot;
  }

  async deleteSlot(id: string): Promise<void> {
    const result = await this.slotModel.deleteOne({ _id: id }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Delivery slot with ID ${id} not found`);
    }
  }

  async reserveSlot(slotId: string): Promise<DeliverySlot> {
    const slot = await this.slotModel
      .findOneAndUpdate(
        { 
          _id: slotId, 
          isActive: true,
          $expr: { $lt: ['$currentOrders', '$maxOrders'] }
        },
        { $inc: { currentOrders: 1 } },
        { new: true }
      )
      .exec();

    if (!slot) {
      throw new BadRequestException('Slot not available or fully booked');
    }

    return slot;
  }

  async releaseSlot(slotId: string): Promise<DeliverySlot> {
    const slot = await this.slotModel
      .findOneAndUpdate(
        { _id: slotId, currentOrders: { $gt: 0 } },
        { $inc: { currentOrders: -1 } },
        { new: true }
      )
      .exec();

    if (!slot) {
      throw new NotFoundException('Slot not found or no orders to release');
    }

    return slot;
  }
}