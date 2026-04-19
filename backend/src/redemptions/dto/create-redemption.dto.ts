import { IsString, IsMongoId } from 'class-validator';

export class CreateRedemptionDto {
  @IsString()
  redemptionId: string;

  @IsMongoId()
  restaurantId: string;
}


