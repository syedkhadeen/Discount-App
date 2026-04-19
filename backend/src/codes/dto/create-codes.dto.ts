import { IsString, IsMongoId, IsBoolean, IsOptional } from 'class-validator';

export class CreateCodeDto {
  @IsString()
  codeId: string;

  @IsMongoId()
  discountId: string;

  @IsMongoId()
  restaurantId: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsBoolean()
  @IsOptional()
  isUsed?: boolean;
}