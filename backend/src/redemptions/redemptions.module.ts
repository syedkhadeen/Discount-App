import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedemptionsService } from './redemptions.service';
import { RedemptionsController } from './redemptions.controller';
import { Redemption, RedemptionSchema } from './schemas/redemption.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, MongooseModule.forFeature([{ name: Redemption.name, schema: RedemptionSchema }])],
  providers: [RedemptionsService],
  controllers: [RedemptionsController],
})
export class RedemptionsModule {}


