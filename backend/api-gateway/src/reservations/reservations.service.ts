import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReservationsService {
  private readonly url: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.url = (this.config.get<string>('RESERVATIONS_SERVICE') || 'http://reservations-service:3001').replace(/\/$/, '');
  }

  async findAll(token: string) {
    const response = await firstValueFrom(
      this.http.get(`${this.url}/api/reservations`, {
        headers: { Authorization: token },
      }),
    );
    return response.data;
  }

  async create(token: string, dto: any) {
    const response = await firstValueFrom(
      this.http.post(`${this.url}/api/reservations`, dto, {
        headers: { Authorization: token },
      }),
    );
    return response.data;
  }

  async findStats(token: string) {
    const response = await firstValueFrom(
      this.http.get(`${this.url}/api/stats`, {
        headers: { Authorization: token },
      }),
    );
    return response.data;
  }
}
