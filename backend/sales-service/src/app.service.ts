import { Injectable } from '@nestjs/common';

@Injectable()

export class AppService {

  getHello() {

    return {

      service: 'Sales Service',

      status: 'running',

    };

  }

}