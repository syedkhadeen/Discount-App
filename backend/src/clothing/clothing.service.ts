import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Clothing, ClothingDocument } from './schemas/clothing.schema';
import { CreateClothingDto } from './dto/create-clothing.dto';
import { UpdateClothingDto } from './dto/update-clothing.dto';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { Role } from '../common/enums/roles.enum';

@Injectable()
export class ClothingService {
  constructor(
    @InjectModel(Clothing.name) private clothingModel: Model<ClothingDocument>,
    private readonly usersService: UsersService,
  ) {}

  async create(createClothingDto: CreateClothingDto): Promise<Clothing> {
    const hashedPassword = await bcrypt.hash(createClothingDto.password, 10);
    const createdClothing = new this.clothingModel({
      ...createClothingDto,
      password: hashedPassword,
    });
    const clothing = await createdClothing.save();
    try {
      await this.usersService.create({
        userID: createClothingDto.brandId,
        name: createClothingDto.name,
        email: createClothingDto.email,
        password: createClothingDto.password,
        role: Role.RESTAURANT,
        restaurantId: (clothing as any)._id?.toString?.() ?? (clothing as any).id,
      } as any);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[ClothingService] Failed to create clothing user:', e?.message);
    }
    return clothing;
  }

  async findAll(): Promise<Clothing[]> {
    return this.clothingModel.find().exec();
  }

  async findOne(id: string): Promise<Clothing> {
    const clothing = await this.clothingModel.findById(id).exec();
    if (!clothing) {
      throw new NotFoundException('Clothing not found');
    }
    return clothing;
  }

  async update(id: string, updateClothingDto: UpdateClothingDto): Promise<Clothing> {
    if (typeof updateClothingDto.password === 'string' && updateClothingDto.password.length > 0) {
      (updateClothingDto as any).password = await bcrypt.hash(updateClothingDto.password, 10);
    } else {
      delete (updateClothingDto as any).password;
    }
    const updated = await this.clothingModel
      .findByIdAndUpdate(id, updateClothingDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Clothing not found');
    }
    return updated;
  }

  async remove(id: string): Promise<Clothing> {
    const deleted = await this.clothingModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Clothing not found');
    }
    return deleted;
  }
}