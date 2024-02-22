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
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto, UpdateSubjectDto, FilterSubjectsDto } from './dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(private subjectsService: SubjectsService) {}

  @Roles(RoleNames.ADMIN)
  @Get()
  async findAll(@Query() params: FilterSubjectsDto) {
    return await this.subjectsService.findAll(params);
  }

  @Roles(RoleNames.ADMIN)
  @Get('/:id')
  async getOne(@Param('id') id: number) {
    return await this.subjectsService.findOneBy({ id });
  }

  @Roles(RoleNames.ADMIN)
  @Post()
  async create(@Body() payload: CreateSubjectDto) {
    return await this.subjectsService.create(payload);
  }

  @Roles(RoleNames.ADMIN)
  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateSubjectDto,
  ) {
    return await this.subjectsService.update(id, payload);
  }

  @Roles(RoleNames.ADMIN)
  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.subjectsService.remove(id);
  }
}
