import { Injectable } from '@nestjs/common';

import { UserClient } from '../clients/user.client';

@Injectable()
export class UsersService {

  constructor(
    private readonly client: UserClient,
  ) {}

  //================ AUTH =================

  login(data: any) {

    return this.client.login(data);

  }

  register(data: any) {

    return this.client.register(data);

  }

  //================ PROFILES =================

  profiles(token: string) {

    return this.client.getProfiles(token);

  }

  createProfile(
    token: string,
    data: any,
  ) {

    return this.client.createProfile(
      token,
      data,
    );

  }

  //================ SESSIONS =================

  sessions(token: string) {

    return this.client.getSessions(token);

  }

  createSession(
    token: string,
    data: any,
  ) {

    return this.client.createSession(
      token,
      data,
    );

  }

  //================ AUDIT =================

  audit(token: string) {

    return this.client.getAudit(token);

  }

  createAudit(
    token: string,
    data: any,
  ) {

    return this.client.createAudit(
      token,
      data,
    );

  }

}