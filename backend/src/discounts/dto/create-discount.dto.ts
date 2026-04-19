import { IsString, IsNumber, IsDateString, IsMongoId, IsPositive, Max } from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  discountId: string;

  @IsMongoId()
  restaurantId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  @Max(100)
  discountPercent: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}