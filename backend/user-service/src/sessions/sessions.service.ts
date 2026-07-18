import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SessionsService {

  constructor(
    private prisma: PrismaService,
  ) {}

  create(masterUserId: string, dto: any) {

    return this.prisma.userSession.create({

      data: {
        masterUserId,
        ip: dto.ip,
        device: dto.device,
        browser: dto.browser,
        refreshTokenHash: dto.refreshTokenHash,
        status: true,
      },

    });

  }

  findAll() {

    return this.prisma.userSession.findMany({

      where: { status: true },

      orderBy: {
        loginAt: 'desc',
      },

    });

  }

  async findOne(id: string) {

    return this.prisma.userSession.findFirst({

      where: { id, status: true },

    });

  }

  async update(id: string, dto: any) {

    return this.prisma.userSession.update({

      where: { id },

      data: { ...dto, updatedAt: new Date() },

    });

  }

  async remove(id: string) {

    return this.prisma.userSession.update({

      where: { id },

      data: { status: false, updatedAt: new Date() },

    });

  }

}