import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscountsService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
import { Discount, DiscountSchema } from './schemas/discount.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, MongooseModule.forFeature([{ name: Discount.name, schema: DiscountSchema }])],
  controllers: [DiscountsController],
  providers: [DiscountsService],
})
export class DiscountsModule {}