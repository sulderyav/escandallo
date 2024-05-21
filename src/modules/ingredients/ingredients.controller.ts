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
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { Public, Roles } from '../../auth/decorators';
import { RoleNames } from '../users/role.entity';
import { HttpException } from '../../utils/HttpExceptionFilter';
import { IngredientsService } from './ingredients.service';
import {
  CreateIngredientDto,
  UpdateIngredientDto,
  FilterIngredientsDto,
} from './ingredient.dto';
import { SetUserIdInterceptor } from 'src/utils/UserInterceptor';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('ingredients')
@Controller('ingredients')
export class IngredientsController {
  constructor(private ingredientsService: IngredientsService) {}

  @Roles(RoleNames.ADMIN, RoleNames.TEACHER, RoleNames.STUDENT)
  @Get()
  async findAll(@Query() params: FilterIngredientsDto) {
    return await this.ingredientsService.findAll(params);
  }

  @Roles(RoleNames.ADMIN, RoleNames.TEACHER, RoleNames.STUDENT)
  @Get('/:id')
  async getOne(@Param('id') id: number) {
    return await this.ingredientsService.findOneBy({ id });
  }

  @Roles(RoleNames.ADMIN, RoleNames.TEACHER, RoleNames.STUDENT)
  @UseInterceptors(new SetUserIdInterceptor('createdById'))
  @Post()
  async create(@Body() payload: CreateIngredientDto) {
    return await this.ingredientsService.create(payload);
  }

  @Roles(RoleNames.ADMIN, RoleNames.TEACHER)
  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateIngredientDto,
  ) {
    return await this.ingredientsService.update(id, payload);
  }

  @Roles(RoleNames.ADMIN, RoleNames.TEACHER)
  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.ingredientsService.remove(id);
  }
}
