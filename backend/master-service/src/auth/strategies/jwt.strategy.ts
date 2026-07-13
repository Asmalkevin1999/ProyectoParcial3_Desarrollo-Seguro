import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

constructor(
  private readonly config: ConfigService,
) {

  console.log(
    'JWT SECRET:',
    config.get<string>('jwt.accessSecret'),
  );

  super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: config.getOrThrow<string>('jwt.accessSecret'),
  });

}

async validate(payload:any){

return{

id:payload.sub,

username:payload.username,

roleId:payload.roleId,

role:payload.role,

type:payload.type

};

}
}