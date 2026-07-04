import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserClient {

  constructor(
    private readonly http: HttpService,
  ) {}

  async getProfiles(token: string) {

    const response = await firstValueFrom(

      this.http.get(
        `${process.env.USER_SERVICE}/profiles`,
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