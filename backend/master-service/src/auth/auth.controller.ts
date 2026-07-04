import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';

import { Public } from './decorators/public.decorator';


@Controller('auth')
export class AuthController {


constructor(
private auth:AuthService
){}



@Public()
@Post('login')
login(
@Body() data:LoginDto
){

return this.auth.login(data);

}



}