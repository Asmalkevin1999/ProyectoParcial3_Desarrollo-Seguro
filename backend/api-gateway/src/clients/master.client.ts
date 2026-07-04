import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MasterClient {

  constructor(
    private readonly http: HttpService,
  ) {}

  async login(data: any) {

    const response = await firstValueFrom(

      this.http.post(
        `${process.env.MASTER_SERVICE}/auth/login`,
        data,
      ),

    );

    return response.data;

  }

  async register(data: any) {

    const response = await firstValueFrom(

      this.http.post(
        `${process.env.MASTER_SERVICE}/auth/register`,
        data,
      ),

    );

    return response.data;

  }

}