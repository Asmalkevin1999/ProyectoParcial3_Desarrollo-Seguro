import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { firstValueFrom } from 'rxjs';

@Injectable()
export class InventoryClient {

  private readonly url: string;

  constructor(

    private readonly http: HttpService,

    private readonly config: ConfigService,

  ) {

    this.url = this.config.get<string>(
      'INVENTORY_SERVICE',
    )!;

  }

  async findCategories(token: string) {

    const response = await firstValueFrom(

      this.http.get(

        `${this.url}/categories`,

        {

          headers: {

            Authorization: token,

          },

        },

      ),

    );

    return response.data;

  }

  async createCategory(token: string, dto: any) {

    const response = await firstValueFrom(

      this.http.post(

        `${this.url}/categories`,

        dto,

        {

          headers: {

            Authorization: token,

          },

        },

      ),

    );

    return response.data;

  }

  async findProducts(token: string) {

    const response = await firstValueFrom(

      this.http.get(

        `${this.url}/products`,

        {

          headers: {

            Authorization: token,

          },

        },

      ),

    );

    return response.data;

  }

  async createProduct(token: string, dto: any) {

    const response = await firstValueFrom(

      this.http.post(

        `${this.url}/products`,

        dto,

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