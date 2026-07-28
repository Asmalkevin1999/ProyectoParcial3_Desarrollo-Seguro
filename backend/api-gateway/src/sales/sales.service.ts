import { Injectable } from '@nestjs/common';

import { SalesClient } from '../clients/sales.client';

@Injectable()
export class SalesService {

  constructor(

    private readonly client: SalesClient,

  ) {}

  create(token: string, dto: any) {

    return this.client.create(token, dto);

  }

  findAll(token: string) {

    return this.client.findAll(token);

  }

}