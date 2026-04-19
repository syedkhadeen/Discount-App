import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CodeDocument = Code & Document;

@Schema({ timestamps: true })
export class Code {
  @Prop({ required: true })
  codeId: string;

  @Prop({ type: Types.ObjectId, ref: 'Discount', required: true })
  discountId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurantId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ default: false })
  isUsed: boolean;
}

export const CodeSchema = SchemaFactory.createForClass(Code);