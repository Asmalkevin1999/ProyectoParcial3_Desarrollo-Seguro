import { Injectable } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';

import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfilesService {

  constructor(

    private prisma: PrismaService,

  ) {}

  create(dto: CreateProfileDto) {

    return this.prisma.userProfile.create({

      data: dto,

    });

  }

  findAll() {

    return this.prisma.userProfile.findMany();

  }

}