import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getHealth() {

    return {

      service: 'API Gateway',

      status: 'OK',

      version: '1.0.0',

      timestamp: new Date()

    };

  }

}