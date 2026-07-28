import { IsUUID } from 'class-validator';

export class SelectRoleDto {

  @IsUUID()
  roleId!: string;

}