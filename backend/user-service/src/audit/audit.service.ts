import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAuditDto } from './dto/create-audit.dto';

@Injectable()
export class AuditService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateAuditDto) {

    return await this.prisma.userAuditLog.create({

      data: {

        masterUserId: dto.masterUserId,

        action: dto.action,

        entity: dto.entity,

        description: dto.description,

        ip: dto.ip,

      },

    });

  }

  async findAll() {

    return await this.prisma.userAuditLog.findMany({

      orderBy: {

        createdAt: 'desc',

      },

    });

  }

}