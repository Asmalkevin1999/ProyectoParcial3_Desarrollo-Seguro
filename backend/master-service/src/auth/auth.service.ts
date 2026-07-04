import {
  Injectable,
  UnauthorizedException
} from '@nestjs/common';


import { PrismaService } from '../database/prisma/prisma.service';


import { JwtService } from '@nestjs/jwt';


import * as bcrypt from 'bcrypt';


import { LoginDto } from './dto/login.dto';


import { ConfigService } from '@nestjs/config';



@Injectable()
export class AuthService {



  constructor(

    private readonly prisma: PrismaService,

    private readonly jwt: JwtService,

    private readonly config: ConfigService

  ) {}





  async login(data: LoginDto) {



    // Buscar usuario

    const user = await this.prisma.user.findUnique({


      where: {

        username: data.username

      },


      include: {


        roles: {


          include: {


            role: true

          }


        }


      }


    });





    if (!user) {


      throw new UnauthorizedException(
        'Usuario no encontrado'
      );


    }





    // Validar contraseña

    const passwordValid = await bcrypt.compare(


      data.password,


      user.password


    );





    if (!passwordValid) {


      throw new UnauthorizedException(

        'Contraseña incorrecta'

      );


    }





    // Obtener rol

    const userRole = user.roles[0];



    const roleName = userRole?.role.name;





    // Payload JWT

    const payload = {


sub:user.id,


username:user.username,


role:user.roles[0].role.name


};






    // ACCESS TOKEN

    const accessToken = await this.jwt.signAsync(


      payload,


      {


        secret: this.config.get<string>(

          'jwt.accessSecret'

        )!,


        expiresIn: '15m'


      }


    );







    // REFRESH TOKEN

    const refreshToken = await this.jwt.signAsync(


      payload,


      {


        secret: this.config.get<string>(

          'jwt.refreshSecret'

        )!,


        expiresIn: '7d'


      }


    );







    // Guardar refresh token

    await this.prisma.refreshToken.create({


      data: {


        token: refreshToken,


        userId: user.id,


        roleId: userRole.roleId,


        expiresAt: new Date(


          Date.now() +


          7 * 24 * 60 * 60 * 1000


        )


      }


    });







    return {


      accessToken,


      refreshToken,


      user:{


        id:user.id,


        username:user.username,


        role:roleName


      }


    };



  }



}