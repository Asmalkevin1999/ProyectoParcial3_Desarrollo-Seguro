import { Injectable } from '@nestjs/common';

import { InventoryClient } from '../clients/inventory.client';

@Injectable()
export class InventoryService {

  constructor(

    private readonly client: InventoryClient,

  ) {}

  findCategories(token: string) {

    return this.client.findCategories(token);

  }

  createCategory(token: string, dto: any) {

    return this.client.createCategory(token, dto);

  }

  findProducts(token: string) {

    return this.client.findProducts(token);

  }

  createProduct(token: string, dto: any) {

    return this.client.createProduct(token, dto);

  }

}