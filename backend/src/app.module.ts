import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurant.module';
import { ReviewsModule } from './reviews/reviews.module';
import { RedemptionsModule } from './redemptions/redemptions.module';
import { ClothingModule } from './clothing/clothing.module';
import { DiscountsModule } from './discounts/discounts.module';
import { CodesModule } from './codes/codes.module';
import { CouponModule } from './coupons/coupon.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/discount_app'),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    ReviewsModule,
    RedemptionsModule,
    ClothingModule,
    DiscountsModule,
    CodesModule,
    CouponModule,
  ],
})
export class AppModule {}