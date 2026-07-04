import { Injectable } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuditService {

  constructor(
    private prisma: PrismaService,
  ) {}

  create(dto: any) {

    return this.prisma.userAuditLog.create({
      data: dto,
    });

  }

  findAll() {

    return this.prisma.userAuditLog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

  }

}