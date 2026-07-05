import {
  Injectable,
  UnauthorizedException
} from '@nestjs/common';


import { PrismaService } from '../database/prisma/prisma.service';


import { JwtService } from '@nestjs/jwt';


import * as bcrypt from 'bcrypt';


import { LoginDto } from './dto/login.dto';


import { ConfigService } from '@nestjs/config';

import { BadRequestException } from '@nestjs/common';

import { RegisterDto } from './dto/register.dto';


@Injectable()
export class AuthService {



  constructor(

    private readonly prisma: PrismaService,

    private readonly jwt: JwtService,

    private readonly config: ConfigService

  ) {}


async register(data: RegisterDto) {

  const usernameExists = await this.prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });

  if (usernameExists) {
    throw new BadRequestException(
      'El usuario ya existe',
    );
  }

  const emailExists = await this.prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (emailExists) {
    throw new BadRequestException(
      'El correo ya existe',
    );
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    10,
  );

  const role = await this.prisma.role.findFirst({
    where: {
      name: 'EMPLOYEE',
    },
  });

  if (!role) {
    throw new BadRequestException(
      'No existe el rol EMPLOYEE',
    );
  }

  const user = await this.prisma.user.create({

    data: {

      username: data.username,

      email: data.email,

      firstName: data.firstName,

      lastName: data.lastName,

      password: hashedPassword,

    },

  });

  await this.prisma.userRole.create({

    data: {

      userId: user.id,

      roleId: role.id,

    },

  });

  return {

    message: 'Usuario registrado correctamente',

    user: {

      id: user.id,

      username: user.username,

      email: user.email,

      firstName: user.firstName,

      lastName: user.lastName,

    },

  };

}


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