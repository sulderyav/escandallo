import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { Roles, Public } from '../../auth/decorators';
import { RolesService } from './roles.service';
import { RoleNames } from './role.entity';
import { HttpException } from 'src/utils/HttpExceptionFilter';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Roles(RoleNames.ADMIN)
  @Get()
  async findAll() {
    return await this.rolesService.findAll();
  }
}
