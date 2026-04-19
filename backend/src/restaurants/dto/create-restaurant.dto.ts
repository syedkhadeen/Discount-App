import { IsString, IsNumber, Min, IsEmail, MinLength } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  restaurantID: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  address: string;

  @IsString()
  phoneNumber: string;

  @IsNumber()
  @Min(0)
  discount: number;
}