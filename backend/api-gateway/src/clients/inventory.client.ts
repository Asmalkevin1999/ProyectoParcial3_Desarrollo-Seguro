import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class InventoryClient {

  constructor(
    private readonly http: HttpService,
  ) {}

  async getProducts(token: string) {

    const response = await firstValueFrom(

      this.http.get(
        `${process.env.INVENTORY_SERVICE}/products`,
        {
          headers: {
            Authorization: token,
          },
        },
      ),

    );

    return response.data;

  }

  async getCategories(token: string) {

    const response = await firstValueFrom(

      this.http.get(
        `${process.env.INVENTORY_SERVICE}/categories`,
        {
          headers: {
            Authorization: token,
          },
        },
      ),

    );

    return response.data;

  }

}