import { Injectable } from '@nestjs/common';


import { PrismaService } from '../database/prisma/prisma.service';



@Injectable()
export class MenusService {



constructor(

private prisma: PrismaService

){}




async getAdminMenu(){



return this.prisma.menu.findMany({


where:{


status:true


},



select:{


id:true,


name:true,


url:true,


icon:true,


order:true,



children:{


where:{


status:true


},


select:{


id:true,


name:true,


url:true,


icon:true


}


}



},



orderBy:{


order:'asc'


}



});



}



}