import {
  IsString,
} from 'class-validator';

export class CreateSessionDto {

  @IsString()
  ip!: string;

  @IsString()
  device!: string;

  @IsString()
  browser!: string;

  @IsString()
  refreshTokenHash!: string;

}