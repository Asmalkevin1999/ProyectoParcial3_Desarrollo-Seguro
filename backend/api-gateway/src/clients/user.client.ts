import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserClient {

  private readonly url: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {

    this.url = (this.config.get<string>(
      'USER_SERVICE',
    ) || 'http://user-service:3001').replace(/\/$/, '');

  }

  //==========================
  // AUTH
  //==========================

  async login(data: any) {

    const response = await firstValueFrom(

      this.http.post(

        `${this.url}/api/auth/login`,

        data,

      ),

    );

    return response.data;

  }

  async register(data: any) {

    const response = await firstValueFrom(

      this.http.post(

        `${this.url}/api/auth/register`,

        data,

      ),

    );

    return response.data;

  }

  //==========================
  // PROFILES
  //==========================

  async getProfiles(token: string) {

    const response = await firstValueFrom(

      this.http.get(

        `${this.url}/api/profiles`,

        {

          headers: {

            Authorization: token,

          },

        },

      ),

    );

    return response.data;

  }

  async createProfile(
    token: string,
    data: any,
  ) {

    const response = await firstValueFrom(

      this.http.post(

        `${this.url}/api/profiles`,

        data,

        {

          headers: {

            Authorization: token,

          },

        },

      ),

    );

    return response.data;

  }

  //==========================
  // SESSIONS
  //==========================

  async getSessions(token: string) {

    const response = await firstValueFrom(

      this.http.get(

        `${this.url}/api/sessions`,

        {

          headers: {

            Authorization: token,

          },

        },

      ),

    );

    return response.data;

  }

  async createSession(
    token: string,
    data: any,
  ) {

    const response = await firstValueFrom(

      this.http.post(

        `${this.url}/api/sessions`,

        data,

        {

          headers: {

            Authorization: token,

          },

        },

      ),

    );

    return response.data;

  }

  //==========================
  // AUDIT
  //==========================

  async getAudit(token: string) {

    const response = await firstValueFrom(

      this.http.get(

        `${this.url}/api/audit`,

        {

          headers: {

            Authorization: token,

          },

        },

      ),

    );

    return response.data;

  }

  async createAudit(
    token: string,
    data: any,
  ) {

    const response = await firstValueFrom(

      this.http.post(

        `${this.url}/api/audit`,

        data,

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