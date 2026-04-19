import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UseGuards, Request } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { GenerateCouponDto, RedeemCouponDto, SearchCouponsDto, ValidateCouponDto } from './dto/coupon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async generateCoupon(@Body() generateCouponDto: GenerateCouponDto, @Request() req) {
    return this.couponService.generateCoupon(req.user.id, generateCouponDto);
  }

  @Post('validate')
  async validateCoupon(@Body() validateCouponDto: ValidateCouponDto) {
    return this.couponService.validateCoupon(validateCouponDto);
  }

  @Post('redeem')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RESTAURANT)
  async redeemCoupon(@Body() redeemCouponDto: RedeemCouponDto, @Request() req) {
    const restaurantId = req.user.restaurantId || req.user.userId;
    return this.couponService.redeemCoupon(restaurantId, redeemCouponDto);
  }

  @Get('my-coupons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async findUserCoupons(@Query() query: SearchCouponsDto, @Request() req) {
    return this.couponService.findUserCoupons(req.user.id, query);
  }

  @Get('restaurant-coupons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RESTAURANT)
  async findRestaurantCoupons(@Query() query: SearchCouponsDto, @Request() req) {
    const restaurantId = req.user.restaurantId || req.user.userId;
    return this.couponService.findRestaurantCoupons(restaurantId, query);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RESTAURANT)
  async searchCoupons(@Query() query: SearchCouponsDto, @Request() req) {
    const restaurantId = req.user.restaurantId || req.user.userId;
    return this.couponService.findRestaurantCoupons(restaurantId, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Request() req) {
    const coupon = await this.couponService.findOne(id);
    
    // Check if user has access to this coupon
    if (req.user.role === Role.USER && coupon.userId.toString() !== req.user.id) {
      throw new Error('Unauthorized');
    }
    
    if (req.user.role === Role.RESTAURANT && coupon.restaurantId.toString() !== (req.user.restaurantId || req.user.userId)) {
      throw new Error('Unauthorized');
    }
    
    return coupon;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }

  @Patch(':code/confirm-user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async confirmByUser(@Param('code') code: string, @Request() req) {
    return this.couponService.confirmCouponByUser(req.user.userId, code);
  }

  @Patch(':code/confirm-restaurant')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RESTAURANT)
  async confirmByRestaurant(@Param('code') code: string, @Request() req) {
    const restaurantId = req.user.restaurantId || req.user.userId;
    return this.couponService.confirmCouponByRestaurant(restaurantId, code);
  }
}
