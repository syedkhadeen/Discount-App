import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ClothingService } from './clothing.service';
import { CreateClothingDto } from './dto/create-clothing.dto';
import { UpdateClothingDto } from './dto/update-clothing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Controller('clothing')
export class ClothingController {
  constructor(private readonly clothingService: ClothingService, private readonly jwtService: JwtService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createClothingDto: CreateClothingDto) {
    return this.clothingService.create(createClothingDto);
  }

  @Get()
  findAll() {
    return this.clothingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clothingService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateClothingDto: UpdateClothingDto) {
    return this.clothingService.update(id, updateClothingDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.clothingService.remove(id);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const all = await this.clothingService.findAll();
    const clothing = all.find((c: any) => c.email === body.email);
    if (!clothing || !clothing.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValid = await bcrypt.compare(body.password, clothing.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const clothingId = (clothing as any)._id?.toString?.() ?? (clothing as any).id;
    const payload = {
      email: clothing.email,
      sub: clothingId,
      role: String(Role.RESTAURANT).toLowerCase(),
      restaurantId: clothingId,
    };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
      clothing: {
        id: clothingId,
        name: clothing.name,
        email: clothing.email,
      },
    };
  }
}