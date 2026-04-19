import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClothingService } from './clothing.service';
import { ClothingController } from './clothing.controller';
import { Clothing, ClothingSchema } from './schemas/clothing.schema';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AuthModule, UsersModule, MongooseModule.forFeature([{ name: Clothing.name, schema: ClothingSchema }])],
  controllers: [ClothingController],
  providers: [ClothingService],
})
export class ClothingModule {}