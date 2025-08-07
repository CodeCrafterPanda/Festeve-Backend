import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new this.orderModel({
      ...createOrderDto,
      userId,
    });

    return await order.save();
  }

  async findAll(userId?: string) {
    const filter = userId ? { userId } : {};
    
    return this.orderModel
      .find(filter)
      .populate('userId', 'name email')
      .populate('items.productId', 'name')
      .populate('paymentRecords')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, userId?: string): Promise<Order> {
    const filter: any = { _id: id };
    if (userId) filter.userId = userId;

    const order = await this.orderModel
      .findOne(filter)
      .populate('userId', 'name email')
      .populate('items.productId', 'name variants')
      .populate('paymentRecords')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const validStatuses = ['placed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid order status');
    }

    const order = await this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('userId', 'name email')
      .populate('items.productId', 'name')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updatePaymentStatus(id: string, paymentStatus: string, paidAmount?: number): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    order.paymentStatus = paymentStatus;
    if (paidAmount !== undefined) {
      order.paidAmount = paidAmount;
      order.dueAmount = order.totalAmount - paidAmount;
    }

    return await order.save();
  }

  async addPaymentRecord(orderId: string, paymentRecordId: string): Promise<Order> {
    const order = await this.orderModel
      .findByIdAndUpdate(
        orderId,
        { $addToSet: { paymentRecords: paymentRecordId } },
        { new: true }
      )
      .populate('paymentRecords')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return order;
  }

  async removePaymentRecord(orderId: string, paymentRecordId: string): Promise<Order> {
    const order = await this.orderModel
      .findByIdAndUpdate(
        orderId,
        { $pull: { paymentRecords: paymentRecordId } },
        { new: true }
      )
      .populate('paymentRecords')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return order;
  }

  async calculatePaymentStatus(orderId: string): Promise<Order> {
    const order = await this.orderModel
      .findById(orderId)
      .populate('paymentRecords')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Calculate total paid amount from all payment records
    const totalPaid = (order.paymentRecords as any[])
      .filter(payment => payment.status === 'paid')
      .reduce((sum, payment) => sum + payment.amount, 0);

    order.paidAmount = totalPaid;
    order.dueAmount = order.totalAmount - totalPaid;

    // Update payment status based on amounts
    if (totalPaid === 0) {
      order.paymentStatus = 'pending';
    } else if (totalPaid >= order.totalAmount) {
      order.paymentStatus = 'paid';
    } else {
      order.paymentStatus = 'partially_paid';
    }

    return await order.save();
  }

  async cancel(id: string, userId?: string): Promise<Order> {
    const filter: any = { _id: id };
    if (userId) filter.userId = userId;

    const order = await this.orderModel.findOne(filter).exec();
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (['delivered', 'cancelled'].includes(order.status)) {
      throw new BadRequestException('Cannot cancel delivered or already cancelled orders');
    }

    if (order.status === 'shipped' || order.status === 'out_for_delivery') {
      throw new BadRequestException('Cannot cancel orders that are already shipped');
    }

    order.status = 'cancelled';
    return await order.save();
  }

  async getStats() {
    const [total, placed, shipped, delivered, cancelled] = await Promise.all([
      this.orderModel.countDocuments(),
      this.orderModel.countDocuments({ status: 'placed' }),
      this.orderModel.countDocuments({ status: 'shipped' }),
      this.orderModel.countDocuments({ status: 'delivered' }),
      this.orderModel.countDocuments({ status: 'cancelled' }),
    ]);

    const revenueStats = await this.orderModel.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);

    return {
      total,
      placed,
      shipped,
      delivered,
      cancelled,
      totalRevenue: revenueStats[0]?.totalRevenue || 0,
    };
  }
}