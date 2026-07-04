import {
IsOptional,
IsString
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

}