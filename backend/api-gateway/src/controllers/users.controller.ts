import {

Controller,

Get,

Post,

Body,

Headers,

} from '@nestjs/common';

import { UsersService } from '../users/users.service';

@Controller('users')

export class UsersController {

  constructor(

    private readonly usersService: UsersService,

  ) {}

  //==========================
  // LOGIN
  //==========================

  @Post('login')

  login(

    @Body() dto: any,

  ) {

    return this.usersService.login(dto);

  }

  //==========================
  // REGISTER
  //==========================

  @Post('register')

  register(

    @Body() dto: any,

  ) {

    return this.usersService.register(dto);

  }

  //==========================
  // PROFILES
  //==========================

  @Get('profiles')

  profiles(

    @Headers('authorization')

    token: string,

  ) {

    return this.usersService.profiles(token);

  }

  @Post('profiles')

  createProfile(

    @Headers('authorization')

    token: string,

    @Body()

    dto: any,

  ) {

    return this.usersService.createProfile(

      token,

      dto,

    );

  }

  //==========================
  // SESSIONS
  //==========================

  @Get('sessions')

  sessions(

    @Headers('authorization')

    token: string,

  ) {

    return this.usersService.sessions(token);

  }

  @Post('sessions')

  createSession(

    @Headers('authorization')

    token: string,

    @Body()

    dto: any,

  ) {

    return this.usersService.createSession(

      token,

      dto,

    );

  }

  //==========================
  // AUDIT
  //==========================

  @Get('audit')

  audit(

    @Headers('authorization')

    token: string,

  ) {

    return this.usersService.audit(token);

  }

  @Post('audit')

  createAudit(

    @Headers('authorization')

    token: string,

    @Body()

    dto: any,

  ) {

    return this.usersService.createAudit(

      token,

      dto,

    );

  }

}