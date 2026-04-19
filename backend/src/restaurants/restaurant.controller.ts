import { Controller, Get, Post, Delete, Body, Param, UseGuards, Put, UnauthorizedException } from '@nestjs/common';
import { RestaurantsService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { JwtService } from '@nestjs/jwt';
import { RestaurantLoginDto } from '../auth/dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Get()
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Post('login')
  async login(@Body() loginDto: RestaurantLoginDto) {
    const restaurant = await this.restaurantsService.findByEmail(loginDto.email);
    if (!restaurant || !restaurant.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValid = await bcrypt.compare(loginDto.password, restaurant.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const restaurantId = (restaurant as any)._id?.toString?.() ?? (restaurant as any).id;
    const payload = {
      email: restaurant.email,
      sub: restaurantId,
      role: String(Role.RESTAURANT).toLowerCase(),
      restaurantId,
    };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
      restaurant: {
        id: restaurantId,
        name: restaurant.name,
        email: restaurant.email,
      },
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(id, updateRestaurantDto);
  }
}