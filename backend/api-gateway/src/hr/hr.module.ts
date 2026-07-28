import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { HrController } from '../controllers/hr.controller';
import { HrService } from './hr.service';
import { HrClient } from '../clients/hr.client';

@Module({

  imports: [

    HttpModule,

  ],

  controllers: [

    HrController,

  ],

  providers: [

    HrService,
    HrClient,

  ],

  exports: [

    HrService,

  ],

})

export class HrModule {}