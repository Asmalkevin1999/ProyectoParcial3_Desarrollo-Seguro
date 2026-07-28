import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfilesService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateProfileDto) {

    try {

      const profile = await this.prisma.userProfile.create({

        data: {

          masterUserId: dto.masterUserId,

          phone: dto.phone,

          address: dto.address,

          photo: dto.photo,

          ...(dto.birthDate && {
            birthDate: new Date(dto.birthDate),
          }),

        },

      });

      return profile;

    } catch (error: any) {

      console.error(error);

      throw new BadRequestException(
        error.message,
      );

    }

  }

  async findAll() {

    return await this.prisma.userProfile.findMany({

      orderBy: {

        createdAt: 'desc',

      },

    });

  }

}