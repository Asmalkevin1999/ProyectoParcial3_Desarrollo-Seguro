import { Module } from '@nestjs/common';

import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { GatewayGuard } from './gateway.guard';

@Module({

  controllers: [

    GatewayController

  ],

  providers: [

    GatewayService,

    GatewayGuard

  ],

  exports: [

    GatewayGuard

  ]

})

export class GatewayModule {}