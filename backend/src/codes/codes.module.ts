import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CodesService } from './codes.service';
import { CodesController } from './codes.controller';
import { Code, CodeSchema } from './schemas/code.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, MongooseModule.forFeature([{ name: Code.name, schema: CodeSchema }])],
  controllers: [CodesController],
  providers: [CodesService],
})
export class CodesModule {}