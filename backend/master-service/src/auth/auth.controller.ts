import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';

import { Public } from './decorators/public.decorator';

import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {


constructor(
private auth:AuthService
){}


@Public()
@Post('register')
register(
  @Body() data: RegisterDto,
) {
  return this.auth.register(data);
}

@Public()
@Post('login')
login(
@Body() data:LoginDto
){

return this.auth.login(data);

}



}