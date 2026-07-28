import { IsUUID } from 'class-validator';

export class CreateRoleModuleDto {

  @IsUUID()
  roleId!: string;

  @IsUUID()
  moduleId!: string;

}