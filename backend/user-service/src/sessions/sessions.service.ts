import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SessionsService {

  constructor(
    private prisma: PrismaService,
  ) {}

  create(userId: string, dto: any) {

    return this.prisma.userSession.create({

      data: {
        userId: userId,
        ip: dto.ip,
        device: dto.device,
        browser: dto.browser,
        refreshTokenHash: dto.refreshTokenHash,
      },

    });

  }

  findAll() {

    return this.prisma.userSession.findMany({

      orderBy: {
        loginAt: 'desc',
      },

    });

  }

}