import {

IsString

} from 'class-validator';

export class CreateAuditDto{

@IsString()

masterUserId!:string;

@IsString()

action!:string;

@IsString()

entity!:string;

@IsString()

description!:string;

@IsString()

ip!:string;

}