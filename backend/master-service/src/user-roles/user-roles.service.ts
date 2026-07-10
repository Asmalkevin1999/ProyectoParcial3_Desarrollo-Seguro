import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma/prisma.service';

import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UserRolesService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateUserRoleDto) {

    const exists = await this.prisma.userRole.findFirst({

      where:{

        userId:dto.userId,

        roleId:dto.roleId,

      }

    });

    if(exists){

      throw new BadRequestException(
        'El usuario ya tiene ese rol',
      );

    }

    return this.prisma.userRole.create({

      data:dto,

      include:{

        user:true,

        role:true,

      }

    });

  }

  async findAll(){

    return this.prisma.userRole.findMany({

      include:{

        user:true,

        role:true,

      },

      orderBy:{

        createdAt:'desc',

      }

    });

  }

  async findOne(id:string){

    return this.prisma.userRole.findUnique({

      where:{id},

      include:{

        user:true,

        role:true,

      }

    });

  }

  async update(

    id:string,

    dto:UpdateUserRoleDto,

  ){

    return this.prisma.userRole.update({

      where:{id},

      data:dto,

    });

  }

  async remove(id:string){

    return this.prisma.userRole.delete({

      where:{id},

    });

  }

}