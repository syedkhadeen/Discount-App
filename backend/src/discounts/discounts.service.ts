import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Discount, DiscountDocument } from './schemas/discount.schema';
import { CreateDiscountDto } from './dto/create-discount.dto';

@Injectable()
export class DiscountsService {
  constructor(@InjectModel(Discount.name) private discountModel: Model<DiscountDocument>) {}

  async create(createDiscountDto: CreateDiscountDto): Promise<Discount> {
    const createdDiscount = new this.discountModel(createDiscountDto);
    return createdDiscount.save();
  }

  async findAll(): Promise<Discount[]> {
    return this.discountModel.find().populate('restaurantId', 'name').exec();
  }

  async findByRestaurant(restaurantId: string): Promise<Discount[]> {
    return this.discountModel.find({ restaurantId }).populate('restaurantId', 'name').exec();
  }

  async findActive(): Promise<Discount[]> {
    const now = new Date();
    return this.discountModel
      .find({
        startDate: { $lte: now },
        endDate: { $gte: now },
      })
      .populate('restaurantId', 'name')
      .exec();
  }

  async findOne(id: string): Promise<Discount> {
    const result = await this.discountModel
      .findById(id)
      .populate('restaurantId', 'name')
      .exec();
    if (!result) {
      throw new NotFoundException('Discount not found');
    }
    return result;
  }

  async update(id: string, updateDiscountDto: CreateDiscountDto): Promise<Discount> {
    const updated = await this.discountModel
      .findByIdAndUpdate(id, updateDiscountDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Discount not found');
    }
    return updated;
  }

  async remove(id: string): Promise<Discount> {
    const deleted = await this.discountModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Discount not found');
    }
    return deleted;
  }
}