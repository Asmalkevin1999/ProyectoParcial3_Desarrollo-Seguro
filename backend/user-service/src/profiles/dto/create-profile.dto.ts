import {
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class CreateProfileDto {

  @IsString()
  masterUserId!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

}