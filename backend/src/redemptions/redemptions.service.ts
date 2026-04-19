import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Redemption, RedemptionDocument } from './schemas/redemption.schema';
import { CreateRedemptionDto } from './dto/create-redemption.dto';

@Injectable()
export class RedemptionsService {
  constructor(
    @InjectModel(Redemption.name) private redemptionModel: Model<RedemptionDocument>,
  ) {}

  async create(createRedemptionDto: CreateRedemptionDto, userId: string): Promise<Redemption> {
    const code = this.generateCode();
    const createdRedemption = new this.redemptionModel({
      ...createRedemptionDto,
      userId,
      code,
    });
    return createdRedemption.save();
  }

  async findByUser(userId: string): Promise<Redemption[]> {
    return this.redemptionModel
      .find({ userId })
      .populate('restaurantId', 'name')
      .exec();
  }

  private generateCode(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}


