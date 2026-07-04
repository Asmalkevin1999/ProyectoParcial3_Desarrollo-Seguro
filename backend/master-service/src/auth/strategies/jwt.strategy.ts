import { Injectable } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {



constructor(

private readonly config: ConfigService

){



const secret = 
config.get<string>('jwt.accessSecret');



super({

jwtFromRequest:

ExtractJwt.fromAuthHeaderAsBearerToken(),



ignoreExpiration:false,



secretOrKey:

secret ?? 'Master2026!'



});



}





async validate(payload:any){



return {


userId: payload.sub,


username: payload.username,


role: payload.role



};



}



}