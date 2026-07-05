import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { firstValueFrom } from 'rxjs';

@Injectable()
export class MasterClient {

  private readonly url: string;

  constructor(

    private readonly http: HttpService,

    private readonly config: ConfigService,

  ) {

this.url = this.config.get<string>(
  'MASTER_SERVICE',
)!;

  }

  async register(data: any) {

    const response = await firstValueFrom(

      this.http.post(

        `${this.url}/auth/register`,

        data,

      ),

    );

    return response.data;

  }

  async login(data: any) {

    const response = await firstValueFrom(

      this.http.post(

        `${this.url}/auth/login`,

        data,

      ),

    );

    return response.data;

  }

}