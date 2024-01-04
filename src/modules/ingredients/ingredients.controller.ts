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
import { IngredientsService } from './ingredients.service';
import {
  CreateIngredientDto,
  UpdateIngredientDto,
  FilterIngredientsDto,
} from './ingredient.dto';

// @UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('ingredients')
@Controller('ingredients')
export class IngredientsController {
  constructor(private ingredientsService: IngredientsService) {}

  @Roles(RoleNames.ADMIN)
  @Get()
  async findAll(@Query() params: FilterIngredientsDto) {
    return await this.ingredientsService.findAll(params);
  }

  @Public()
  // @Roles(RoleNames.ADMIN)
  @Get('/:id')
  async getOne(@Param('id') id: number) {
    return await this.ingredientsService.findOneBy({ id });
  }

  @Roles(RoleNames.ADMIN)
  @Post()
  async create(@Body() payload: CreateIngredientDto) {
    return await this.ingredientsService.create(payload);
  }

  @Roles(RoleNames.ADMIN)
  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateIngredientDto,
  ) {
    return await this.ingredientsService.update(id, payload);
  }

  @Roles(RoleNames.ADMIN)
  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.ingredientsService.remove(id);
  }
}
