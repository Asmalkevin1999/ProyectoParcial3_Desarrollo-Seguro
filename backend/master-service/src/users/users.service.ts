import { Injectable } from '@nestjs/common';


import { PrismaService } from '../database/prisma/prisma.service';



@Injectable()
export class UsersService {



constructor(

private prisma:PrismaService

){}




async findAll(){



return this.prisma.user.findMany({

select:{


id:true,

username:true,

email:true,

firstName:true,

lastName:true,

status:true,

createdAt:true,


roles:{


include:{


role:true


}


}


}


});


}



}