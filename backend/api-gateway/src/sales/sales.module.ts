import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { SalesController } from '../controllers/sales.controller';
import { SalesService } from './sales.service';
import { SalesClient } from '../clients/sales.client';

@Module({

  imports: [

    HttpModule,

  ],

  controllers: [

    SalesController,

  ],

  providers: [

    SalesService,
    SalesClient,

  ],

  exports: [

    SalesService,

  ],

})

export class SalesModule {}