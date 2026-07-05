import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { firstValueFrom } from 'rxjs';

@Injectable()
export class SalesClient {

  private readonly url: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {

    this.url = this.config.get<string>('SALES_SERVICE')!;

  }

  create(token: string, dto: any) {

    return firstValueFrom(

      this.http.post(

        `${this.url}/sales`,
        dto,
        {
          headers: {
            Authorization: token,
          },
        },

      ),

    ).then(r => r.data);

  }

  findAll(token: string) {

    return firstValueFrom(

      this.http.get(

        `${this.url}/sales`,
        {
          headers: {
            Authorization: token,
          },
        },

      ),

    ).then(r => r.data);

  }

}