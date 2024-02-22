import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { Roles, Public } from '../../auth/decorators';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { RoleNames } from './role.entity';
import { PayloadToken } from 'src/auth/models/token.model';
import { HttpException } from 'src/utils/HttpExceptionFilter';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  async getMyInfo(@Req() req: Request) {
    const user = req.user as PayloadToken;
    if (!user) throw new HttpException(HttpStatus.FORBIDDEN);
    return await this.usersService.myInfo(user.userId);
  }

  @Roles(RoleNames.ADMIN)
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Roles(RoleNames.ADMIN)
  @Get('/list')
  async listAll() {
    return await this.usersService.listAll();
  }

  @Roles(RoleNames.ADMIN)
  @Get('/:id')
  async getOne(@Param('id') id: number) {
    return await this.usersService.findOne(id);
  }

  @Roles()
  @Post()
  async create(@Body() payload: CreateUserDto) {
    return await this.usersService.create(payload);
  }

  @Roles(RoleNames.ADMIN)
  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ) {
    return await this.usersService.update(id, payload);
  }

  // @Delete('/:id')
  // async remove(@Param('id', ParseIntPipe) id: number) {
  //   return await this.usersService.remove(id);
  // }
}
