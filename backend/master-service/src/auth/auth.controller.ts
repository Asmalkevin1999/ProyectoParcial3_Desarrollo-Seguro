import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { Public } from './decorators/public.decorator';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SelectRoleDto } from './dto/select-role.dto';

import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly auth: AuthService,
  ) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('select-role')
  selectRole(
    @Req() req,
    @Body() dto: SelectRoleDto,
  ) {
    return this.auth.selectRole(
      req.user,
      dto.roleId,
    );
  }

  //=====================================
  // NUEVO
  //=====================================

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req) {
    return req.user;
  }

  @Public()
  @Post('logout')
  logout(
    @Body('refreshToken')
    refreshToken: string,
  ) {
    return this.auth.logout(refreshToken);
  }

  @Public()
  @Post('refresh')
  refresh(
    @Body('refreshToken')
    refreshToken: string,
  ) {
    return this.auth.refresh(refreshToken);
  }

}