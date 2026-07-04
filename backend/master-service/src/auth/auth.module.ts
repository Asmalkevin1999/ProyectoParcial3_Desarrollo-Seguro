import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { ConfigModule, ConfigService } from '@nestjs/config';


import { AuthService } from './auth.service';

import { AuthController } from './auth.controller';

import { JwtStrategy } from './strategies/jwt.strategy';



@Module({

imports:[


ConfigModule,


JwtModule.register({})

],


controllers:[

AuthController

],


providers:[

AuthService,

JwtStrategy

],


exports:[

AuthService

]

})


export class AuthModule{}