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
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { Public, Roles } from '../../auth/decorators';
import { RoleNames } from '../users/role.entity';
import { HttpException } from '../../utils/HttpExceptionFilter';
import { CareersService } from './careers.service';
import { CreateCareerDto, UpdateCareerDto, FilterCareersDto } from './dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('careers')
@Controller('careers')
export class CareersController {
  constructor(private careersService: CareersService) {}

  @Roles(RoleNames.ADMIN)
  @Get()
  async findAll(@Query() params: FilterCareersDto) {
    return await this.careersService.findAll(params);
  }

  @Roles(RoleNames.ADMIN)
  @Get('/:id')
  async getOne(@Param('id') id: number) {
    return await this.careersService.findOneBy({ id });
  }

  @Roles(RoleNames.ADMIN)
  @Post()
  async create(@Body() payload: CreateCareerDto) {
    return await this.careersService.create(payload);
  }

  @Roles(RoleNames.ADMIN)
  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCareerDto,
  ) {
    return await this.careersService.update(id, payload);
  }

  @Roles(RoleNames.ADMIN)
  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.careersService.remove(id);
  }
}
