import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { InventoryController } from '../controllers/inventory.controller';
import { InventoryService } from './inventory.service';
import { InventoryClient } from '../clients/inventory.client';

@Module({

  imports: [

    HttpModule,

  ],

  controllers: [

    InventoryController,

  ],

  providers: [

    InventoryService,

    InventoryClient,

  ],

})

export class InventoryModule {}