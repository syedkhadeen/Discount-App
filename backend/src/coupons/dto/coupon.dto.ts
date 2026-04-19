import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { CouponStatus } from '../coupon.schema';

export class GenerateCouponDto {
  @IsString()
  @IsNotEmpty()
  restaurantId: string;

  @IsNumber()
  discountPercentage: number;

  @IsNumber()
  maxDiscount: number;

  @IsNumber()
  minOrderAmount: number;

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;
}

export class RedeemCouponDto {
  @IsString()
  @IsNotEmpty()
  couponCode: string;

  @IsOptional()
  @IsString()
  usageNotes?: string;
}

export class SearchCouponsDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  restaurantId?: string;

  @IsOptional()
  @IsEnum(CouponStatus)
  status?: CouponStatus;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;
}

export class ValidateCouponDto {
  @IsString()
  @IsNotEmpty()
  couponCode: string;

  @IsNumber()
  orderAmount: number;
}
