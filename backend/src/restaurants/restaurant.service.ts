import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { Role } from '../common/enums/roles.enum';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: Model<RestaurantDocument>,
    private readonly usersService: UsersService,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const hashedPassword = await bcrypt.hash(createRestaurantDto.password, 10);
    const createdRestaurant = new this.restaurantModel({
      ...createRestaurantDto,
      password: hashedPassword,
    });
    const restaurant = await createdRestaurant.save();
    try {
      await this.usersService.create({
        userID: createRestaurantDto.restaurantID,
        name: createRestaurantDto.name,
        email: createRestaurantDto.email,
        password: createRestaurantDto.password,
        role: Role.RESTAURANT,
        restaurantId: (restaurant as any)._id?.toString?.() ?? (restaurant as any).id,
      } as any);
    } catch (e) {
      // If user creation fails, do not block restaurant creation; log and continue
      // eslint-disable-next-line no-console
      console.error('[RestaurantsService] Failed to create restaurant user:', e?.message);
    }
    return restaurant;
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantModel.find().select('-password').exec();
  }

  async findOne(id: string): Promise<Restaurant> {
    const res = await this.restaurantModel.findById(id).exec();
    if (!res) {
      throw new NotFoundException('Restaurant not found');
    }
    return res;
  }

  async remove(id: string): Promise<Restaurant> {
    const del = await this.restaurantModel.findByIdAndDelete(id).exec();
    if (!del) {
      throw new NotFoundException('Restaurant not found');
    }
    return del;
  }

  async update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    if (updateRestaurantDto.password) {
      updateRestaurantDto.password = await bcrypt.hash(updateRestaurantDto.password, 10);
    }
    const updated = await this.restaurantModel
      .findByIdAndUpdate(id, updateRestaurantDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Restaurant not found');
    }
    return updated;
  }

  async findByEmail(email: string): Promise<Restaurant | null> {
    return this.restaurantModel.findOne({ email }).exec();
  }
}