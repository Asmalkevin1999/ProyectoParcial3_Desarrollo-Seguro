import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
} from '@nestjs/common';

import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('profiles')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class ProfilesController {

  constructor(
    private readonly profilesService: ProfilesService,
  ) {}

  @Post()
  @Roles('ADMIN')
  async create(
    @Body() dto: CreateProfileDto,
  ) {

    return await this.profilesService.create(dto);

  }

  @Get()
  @Roles('ADMIN')
  async findAll() {

    return await this.profilesService.findAll();

  }

}