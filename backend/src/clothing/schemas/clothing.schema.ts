import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClothingDocument = Clothing & Document;

@Schema({ timestamps: true })
export class Clothing {
  @Prop({ required: true })
  brandId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  discount: number;

  @Prop({ required: true })
  website: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  location: string;
}

export const ClothingSchema = SchemaFactory.createForClass(Clothing);