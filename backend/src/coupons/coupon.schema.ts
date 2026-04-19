import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CouponDocument = Coupon & Document;

export enum CouponStatus {
  ACTIVE = 'active',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired',
}

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Restaurant' })
  restaurantId: Types.ObjectId;

  @Prop({ required: true, enum: CouponStatus, default: CouponStatus.ACTIVE })
  status: CouponStatus;

  @Prop({ required: true })
  discountPercentage: number;

  @Prop({ required: true })
  maxDiscount: number;

  @Prop({ required: true })
  minOrderAmount: number;

  @Prop({ required: true })
  validFrom: Date;

  @Prop({ required: true })
  validUntil: Date;

  @Prop({ default: false })
  userConfirmed: boolean;

  @Prop({ default: false })
  restaurantConfirmed: boolean;

  @Prop()
  redeemedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  redeemedBy?: Types.ObjectId;

  @Prop()
  usageNotes?: string;

  @Prop()
  expiredAt?: Date;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);

// Index for efficient queries
CouponSchema.index({ userId: 1, restaurantId: 1, status: 1 });
CouponSchema.index({ code: 1 }, { unique: true });
CouponSchema.index({ validUntil: 1 }, { expireAfterSeconds: 0 });
