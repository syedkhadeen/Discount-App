import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Code, CodeDocument } from './schemas/code.schema';
import { CreateCodeDto } from './dto/create-code.dto';

@Injectable()
export class CodesService {
  constructor(@InjectModel(Code.name) private codeModel: Model<CodeDocument>) {}

  async create(createCodeDto: CreateCodeDto, userId: string): Promise<Code> {
    const code = createCodeDto.code || this.generateCode();
    const createdCode = new this.codeModel({
      ...createCodeDto,
      userId,
      code,
      isUsed: false,
    });
    return createdCode.save();
  }

  async findAll(): Promise<Code[]> {
    return this.codeModel
      .find()
      .populate('userId', 'name email')
      .populate('discountId', 'title')
      .populate('restaurantId', 'name')
      .exec();
  }

  async findByUser(userId: string): Promise<Code[]> {
    return this.codeModel
      .find({ userId })
      .populate('discountId', 'title')
      .populate('restaurantId', 'name')
      .exec();
  }

  async findByCode(code: string): Promise<Code> {
    const result = await this.codeModel
      .findOne({ code })
      .populate('userId', 'name email')
      .populate('discountId', 'title discountPercent')
      .populate('restaurantId', 'name')
      .exec();
    if (!result) {
      throw new NotFoundException('Code not found');
    }
    return result;
  }

  async useCode(code: string): Promise<Code> {
    const foundCode = await this.codeModel.findOne({ code });
    if (!foundCode) {
      throw new BadRequestException('Invalid code');
    }
    if (foundCode.isUsed) {
      throw new BadRequestException('Code already used');
    }
    foundCode.isUsed = true;
    return foundCode.save();
  }

  async findOne(id: string): Promise<Code> {
    const result = await this.codeModel
      .findById(id)
      .populate('userId', 'name email')
      .populate('discountId', 'title')
      .populate('restaurantId', 'name')
      .exec();
    if (!result) {
      throw new NotFoundException('Code not found');
    }
    return result;
  }

  async remove(id: string): Promise<Code> {
    const deleted = await this.codeModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Code not found');
    }
    return deleted;
  }

  private generateCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}