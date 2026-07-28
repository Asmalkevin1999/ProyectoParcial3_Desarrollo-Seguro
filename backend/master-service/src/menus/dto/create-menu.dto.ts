import { IsInt, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateMenuDto{

    @IsString()
    name!:string;

    @IsOptional()
    @IsString()
    url?:string;

    @IsOptional()
    @IsString()
    icon?:string;

    @IsInt()
    order!:number;

    @IsUUID()
    moduleId!:string;

    @IsOptional()
    @IsUUID()
    parentId?:string;

}