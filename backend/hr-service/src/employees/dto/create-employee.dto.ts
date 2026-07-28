import {
  IsString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsDateString
} from 'class-validator';

export class CreateEmployeeDto {

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  position!: string;

  @IsNumber()
  salary!: number;

  @IsDateString()
  hireDate!: string;

}