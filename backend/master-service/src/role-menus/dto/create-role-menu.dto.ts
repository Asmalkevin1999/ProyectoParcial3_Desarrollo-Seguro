import { IsUUID } from 'class-validator';

export class CreateRoleMenuDto {

    @IsUUID()
    roleId!: string;

    @IsUUID()
    menuId!: string;

}