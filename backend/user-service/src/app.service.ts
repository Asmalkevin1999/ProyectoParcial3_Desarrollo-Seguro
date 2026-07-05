import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getStatus() {

    return {

      service: 'User Service',

      status: 'OK',

      port: process.env.PORT,

      timestamp: new Date(),

    };

  }

}