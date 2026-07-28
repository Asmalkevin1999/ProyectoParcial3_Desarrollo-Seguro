import { IsOptional, IsString } from 'class-validator';

export class CreateModuleDto {

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;

}