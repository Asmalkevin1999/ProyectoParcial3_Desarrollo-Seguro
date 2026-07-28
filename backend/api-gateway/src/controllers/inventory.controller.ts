import {

Controller,

Get,

Post,

Body,

Headers,

} from '@nestjs/common';

import { InventoryService } from '../inventory/inventory.service';

@Controller('inventory')

export class InventoryController {

constructor(

private readonly service: InventoryService,

){}

@Get('categories')

findCategories(

@Headers('authorization')

token:string,

){

return this.service.findCategories(token);

}

@Post('categories')

createCategory(

@Headers('authorization')

token:string,

@Body()

dto:any,

){

return this.service.createCategory(

token,

dto,

);

}

@Get('products')

findProducts(

@Headers('authorization')

token:string,

){

return this.service.findProducts(token);

}

@Post('products')

createProduct(

@Headers('authorization')

token:string,

@Body()

dto:any,

){

return this.service.createProduct(

token,

dto,

);

}

}