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
    this.url = (this.config.get<string>('MASTER_SERVICE') || 'http://master-service:3000').replace(/\/$/, '');
  }

  //================================================
  // AUTH
  //================================================

  async register(data: any) {

    const response = await firstValueFrom(
      this.http.post(
        `${this.url}/api/auth/register`,
        data,
      ),
    );

    return response.data;
  }

  async login(data: any) {

    const response = await firstValueFrom(
      this.http.post(
        `${this.url}/api/auth/login`,
        data,
      ),
    );

    return response.data;
  }

  async selectRole(
    token: string,
    roleId: string,
  ) {

    const response = await firstValueFrom(
      this.http.post(
        `${this.url}/api/auth/select-role`,
        {
          roleId,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      ),
    );

    return response.data;
  }

  //================================================
  // MODULES
  //================================================

  async getModules(token: string) {

    const response = await firstValueFrom(
      this.http.get(
        `${this.url}/api/modules`,
        {
          headers: {
            Authorization: token,
          },
        },
      ),
    );

    return response.data;
  }

  //================================================
  // MENUS
  //================================================

  async getMenus(token: string) {

    const response = await firstValueFrom(
      this.http.get(
        `${this.url}/api/menus/my-menu`,
        {
          headers: {
            Authorization: token,
          },
        },
      ),
    );

    return response.data;
  }

  //================================================
  // USERS
  //================================================

  async getUsers(token: string) {

    const response = await firstValueFrom(
      this.http.get(
        `${this.url}/api/users`,
        {
          headers: {
            Authorization: token,
          },
        },
      ),
    );

    return response.data;
  }

  //================================================
  // ROLES
  //================================================

  async getRoles(token: string) {

    const response = await firstValueFrom(
      this.http.get(
        `${this.url}/api/roles`,
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