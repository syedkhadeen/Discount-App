import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Coupon, CouponDocument, CouponStatus } from './coupon.schema';
import { GenerateCouponDto, RedeemCouponDto, SearchCouponsDto, ValidateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name) private couponModel: Model<CouponDocument>,
  ) {}

  private generateCouponCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async generateCoupon(userId: string, generateCouponDto: GenerateCouponDto): Promise<Coupon> {
    const { restaurantId, ...couponData } = generateCouponDto;
    
    // Check if user already has a coupon for this restaurant this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const existingCoupon = await this.couponModel.findOne({
      userId: new Types.ObjectId(userId),
      restaurantId: new Types.ObjectId(restaurantId),
      createdAt: { $gte: oneWeekAgo },
    });

    if (existingCoupon) {
      throw new ConflictException('You can only generate 1 coupon per restaurant per week');
    }

    // Generate unique coupon code
    let code = '';
    let isUnique = false;
    while (!isUnique) {
      code = this.generateCouponCode();
      const existingCode = await this.couponModel.findOne({ code });
      if (!existingCode) {
        isUnique = true;
      }
    }

    const validFrom = couponData.validFrom ? new Date(couponData.validFrom) : new Date();
    const validUntil = couponData.validUntil ? new Date(couponData.validUntil) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const coupon = new this.couponModel({
      ...couponData,
      code,
      userId: new Types.ObjectId(userId),
      restaurantId: new Types.ObjectId(restaurantId),
      validFrom,
      validUntil,
    });

    return coupon.save();
  }

  async validateCoupon(validateCouponDto: ValidateCouponDto): Promise<{ valid: boolean; discount: number; message: string }> {
    const { couponCode, orderAmount } = validateCouponDto;
    
    const coupon = await this.couponModel.findOne({ code: couponCode });
    
    if (!coupon) {
      return { valid: false, discount: 0, message: 'Coupon not found' };
    }

    if (coupon.status !== CouponStatus.ACTIVE) {
      return { valid: false, discount: 0, message: 'Coupon is not active' };
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return { valid: false, discount: 0, message: 'Coupon is expired or not yet valid' };
    }

    if (orderAmount < coupon.minOrderAmount) {
      return { valid: false, discount: 0, message: `Minimum order amount is $${coupon.minOrderAmount}` };
    }

    const discount = Math.min(
      (orderAmount * coupon.discountPercentage) / 100,
      coupon.maxDiscount
    );

    return { valid: true, discount, message: 'Coupon is valid' };
  }

  async redeemCoupon(restaurantId: string, redeemCouponDto: RedeemCouponDto): Promise<Coupon> {
    const { couponCode, usageNotes } = redeemCouponDto;
    
    const coupon = await this.couponModel.findOne({ code: couponCode });
    
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    if (coupon.restaurantId.toString() !== restaurantId) {
      throw new BadRequestException('This coupon is not valid for this restaurant');
    }

    if (coupon.status !== CouponStatus.ACTIVE) {
      throw new BadRequestException('Coupon is not active');
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      throw new BadRequestException('Coupon is expired or not yet valid');
    }

    // For new flow, redemption happens when both parties confirm. Keep for backward compat: mark as restaurantConfirmed
    coupon.restaurantConfirmed = true;
    coupon.usageNotes = usageNotes;
    return this.checkAndExpireIfBothConfirmed(coupon);
  }

  async findUserCoupons(userId: string, query: SearchCouponsDto): Promise<{ coupons: Coupon[]; total: number }> {
    const { status, page = 1, limit = 10 } = query;
    
    const filter: any = { userId: new Types.ObjectId(userId) };
    
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;
    
    const [coupons, total] = await Promise.all([
      this.couponModel.find(filter)
        .populate('restaurantId', 'name address')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.couponModel.countDocuments(filter),
    ]);

    return { coupons, total };
  }

  async findRestaurantCoupons(restaurantId: string, query: SearchCouponsDto): Promise<{ coupons: Coupon[]; total: number }> {
    const { code, status, page = 1, limit = 10 } = query;
    
    const filter: any = { restaurantId: new Types.ObjectId(restaurantId) };
    
    if (code) {
      filter.code = { $regex: code, $options: 'i' };
    }
    
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;
    
    const [coupons, total] = await Promise.all([
      this.couponModel.find(filter)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.couponModel.countDocuments(filter),
    ]);

    return { coupons, total };
  }

  async confirmCouponByUser(userId: string, code: string): Promise<Coupon> {
    const coupon = await this.couponModel.findOne({ code });
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    if (coupon.userId.toString() !== userId) {
      throw new BadRequestException('Not your coupon');
    }
    coupon.userConfirmed = true;
    return this.checkAndExpireIfBothConfirmed(coupon);
  }

  async confirmCouponByRestaurant(restaurantId: string, code: string): Promise<Coupon> {
    const coupon = await this.couponModel.findOne({ code });
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    if (coupon.restaurantId.toString() !== restaurantId) {
      throw new BadRequestException('Coupon does not belong to this restaurant');
    }
    coupon.restaurantConfirmed = true;
    return this.checkAndExpireIfBothConfirmed(coupon);
  }

  private async checkAndExpireIfBothConfirmed(coupon: CouponDocument): Promise<Coupon> {
    if (coupon.userConfirmed && coupon.restaurantConfirmed) {
      coupon.status = CouponStatus.REDEEMED;
      coupon.redeemedAt = new Date();
      coupon.redeemedBy = new Types.ObjectId(coupon.restaurantId);
    }
    return coupon.save();
  }

  async findOne(id: string): Promise<Coupon> {
    const coupon = await this.couponModel.findById(id)
      .populate('userId', 'name email')
      .populate('restaurantId', 'name address');
      
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    
    return coupon;
  }

  async remove(id: string): Promise<void> {
    const result = await this.couponModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Coupon not found');
    }
  }
}
