import { IsEmail, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpdateRestaurantDto {
  @IsOptional()
  @IsString()
  restaurantID?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;
}

