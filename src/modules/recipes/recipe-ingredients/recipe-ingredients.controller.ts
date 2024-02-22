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

import { JwtAuthGuard, RolesGuard } from '../../../auth/guards';
import { Public, Roles } from '../../../auth/decorators';
import { RoleNames } from '../../users/role.entity';
import { HttpException } from '../../../utils/HttpExceptionFilter';
import { RecipeIngredientsService } from './recipe-ingredients.service';
import {
  CreateRecipeIngredientDto,
  UpdateRecipeIngredientDto,
  FilterRecipeIngredientsDto,
} from './dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('recipe-ingredients')
@Controller('recipe-ingredients')
export class RecipeIngredientsController {
  constructor(private recipeIngredientsService: RecipeIngredientsService) {}

  @Roles(RoleNames.ADMIN)
  @Get()
  async findAll(@Query() params: FilterRecipeIngredientsDto) {
    return await this.recipeIngredientsService.findAll(params);
  }

  @Roles(RoleNames.ADMIN)
  @Get('/:id')
  async getOne(@Param('id') id: number) {
    return await this.recipeIngredientsService.findOneBy({ id });
  }

  @Roles(RoleNames.ADMIN)
  @Post()
  async create(@Body() payload: CreateRecipeIngredientDto) {
    return await this.recipeIngredientsService.create(payload);
  }

  @Roles(RoleNames.ADMIN)
  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateRecipeIngredientDto,
  ) {
    return await this.recipeIngredientsService.update(id, payload);
  }

  @Roles(RoleNames.ADMIN)
  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.recipeIngredientsService.remove(id);
  }
}
