import { IsString, IsNumber, IsPositive, IsEmail, MinLength } from 'class-validator';

export class CreateClothingDto {
  @IsString()
  brandId: string;

  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsNumber()
  @IsPositive()
  discount: number;

  @IsString()
  website: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  location: string;
}