import { Injectable } from '@nestjs/common';

import { HrClient } from '../clients/hr.client';

@Injectable()
export class HrService {

  constructor(

    private readonly client: HrClient,

  ) {}

  create(token: string, dto: any) {

    return this.client.create(token, dto);

  }

  findAll(token: string) {

    return this.client.findAll(token);

  }

}