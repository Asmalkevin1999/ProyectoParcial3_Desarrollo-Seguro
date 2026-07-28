import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [HttpModule],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
