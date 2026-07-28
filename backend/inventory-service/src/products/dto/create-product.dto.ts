import {
  IsString,
  IsNumber,
  IsUUID,
  IsOptional
} from 'class-validator';

export class CreateProductDto {

  @IsString()
  name!: string;

  @IsString()
  sku!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price!: number;

  @IsNumber()
  stock!: number;

  @IsUUID()
  categoryId!: string;

}