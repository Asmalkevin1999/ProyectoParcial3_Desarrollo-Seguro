import { Module } from '@nestjs/common';
import { InternalsController } from './internals.controller';
import { InternalsService } from './internals.service';

@Module({
  controllers: [InternalsController],
  providers: [InternalsService]
})
export class InternalsModule {}
