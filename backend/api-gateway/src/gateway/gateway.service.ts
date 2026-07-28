import { Injectable } from '@nestjs/common';

@Injectable()
export class GatewayService {

  health() {

    return {

      service: 'Gateway',

      status: 'Activo'

    };

  }

}