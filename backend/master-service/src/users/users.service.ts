import {
  Injectable,
  BadRequestException
} from '@nestjs/common';

import { PrismaService } from '../database/prisma/prisma.service';

import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  constructor(
    private prisma: PrismaService
  ) {}

  //------------------------------------------------

  async create(dto: CreateUserDto) {

    const exists = await this.prisma.user.findFirst({

      where: {

        OR: [

          {
            username: dto.username
          },

          {
            email: dto.email
          }

        ]

      }

    });

    if (exists) {

      throw new BadRequestException(
        'Usuario ya existe'
      );

    }

    const password = await bcrypt.hash(
      dto.password,
      10
    );

    return this.prisma.user.create({

      data: {

        username: dto.username,

        email: dto.email,

        password,

        firstName: dto.firstName,

        lastName: dto.lastName

      }

    });

  }

  //------------------------------------------------

  findAll() {

    return this.prisma.user.findMany({

      orderBy: {

        username: 'asc'

      }

    });

  }

  //------------------------------------------------

  findOne(id: string) {

    return this.prisma.user.findUnique({

      where: {

        id

      }

    });

  }

  //------------------------------------------------

  async update(

    id: string,

    dto: UpdateUserDto

  ) {

    const data: any = {

      ...dto

    };

    if (dto.password) {

      data.password = await bcrypt.hash(

        dto.password,

        10

      );

    }

    return this.prisma.user.update({

      where: {

        id

      },

      data

    });

  }

  //------------------------------------------------

  remove(id: string) {

    return this.prisma.user.delete({

      where: {

        id

      }

    });

  }

}