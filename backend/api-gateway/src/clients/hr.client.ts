import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { firstValueFrom } from 'rxjs';

@Injectable()
export class HrClient {

  private readonly url: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {

    this.url = this.config.get<string>('HR_SERVICE')!;

  }

  create(token: string, dto: any) {

    return firstValueFrom(

      this.http.post(

        `${this.url}/employees`,
        dto,
        {
          headers: {
            Authorization: token,
          },
        },

      ),

    ).then(res => res.data);

  }

  findAll(token: string) {

    return firstValueFrom(

      this.http.get(

        `${this.url}/employees`,
        {
          headers: {
            Authorization: token,
          },
        },

      ),

    ).then(res => res.data);

  }

}