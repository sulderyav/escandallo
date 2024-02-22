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
import { LevelsService } from './levels.service';
import { CreateLevelDto, UpdateLevelDto, FilterLevelsDto } from './dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('levels')
@Controller('levels')
export class LevelsController {
  constructor(private levelsService: LevelsService) {}

  @Roles(RoleNames.ADMIN)
  @Get()
  async findAll(@Query() params: FilterLevelsDto) {
    return await this.levelsService.findAll(params);
  }

  @Roles(RoleNames.ADMIN)
  @Get('/:id')
  async getOne(@Param('id') id: number) {
    return await this.levelsService.findOneBy({ id });
  }

  @Roles(RoleNames.ADMIN)
  @Post()
  async create(@Body() payload: CreateLevelDto) {
    return await this.levelsService.create(payload);
  }

  @Roles(RoleNames.ADMIN)
  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateLevelDto,
  ) {
    return await this.levelsService.update(id, payload);
  }

  @Roles(RoleNames.ADMIN)
  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.levelsService.remove(id);
  }
}
