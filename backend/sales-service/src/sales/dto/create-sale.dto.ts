import {

IsArray,

IsNumber,

IsString,

ValidateNested

} from 'class-validator';

import { Type } from 'class-transformer';

class DetailDto{

@IsString()

productId!:string;

@IsNumber()

quantity!:number;

@IsNumber()

price!:number;

}

export class CreateSaleDto{

@IsString()

customerName!:string;

@IsArray()

@ValidateNested({each:true})

@Type(()=>DetailDto)

details!:DetailDto[];

}