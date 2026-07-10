import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../database/prisma/prisma.service';

import { CreateRoleModuleDto } from './dto/create-role-module.dto';

import { UpdateRoleModuleDto } from './dto/update-role-module.dto';

@Injectable()
export class RoleModulesService {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async create(dto: CreateRoleModuleDto) {

        return this.prisma.roleModule.create({

            data:{

                roleId:dto.roleId,

                moduleId:dto.moduleId,

            },

            include:{

                role:true,

                module:true,

            }

        });

    }

    async findAll(){

        return this.prisma.roleModule.findMany({

            include:{

                role:true,

                module:true,

            },

            orderBy:{

                createdAt:'asc'

            }

        });

    }

    async findOne(id:string){

        const relation=

        await this.prisma.roleModule.findUnique({

            where:{id},

            include:{

                role:true,

                module:true,

            }

        });

        if(!relation){

            throw new NotFoundException(
                'Relación no encontrada'
            );

        }

        return relation;

    }

    async update(
        id:string,
        dto:UpdateRoleModuleDto,
    ){

        return this.prisma.roleModule.update({

            where:{id},

            data:dto,

            include:{

                role:true,

                module:true,

            }

        });

    }

    async remove(id:string){

        return this.prisma.roleModule.delete({

            where:{id}

        });

    }

}