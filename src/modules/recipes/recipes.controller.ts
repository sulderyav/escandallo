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
import { RecipesService } from './recipes.service';
import { CreateRecipeDto, UpdateRecipeDto, FilterRecipesDto } from './dto';
import { SetUserIdInterceptor } from 'src/utils/UserInterceptor';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private recipeRepo: RecipesService) {}

  @Roles(RoleNames.ADMIN)
  @Get()
  async findAll(@Query() params: FilterRecipesDto) {
    return await this.recipeRepo.findAll(params);
  }

  @Roles(RoleNames.ADMIN)
  @Get('/:id')
  async getOne(@Param('id') id: number) {
    return await this.recipeRepo.findOneBy({ id }, [
      'recipeIngredients',
      'recipeIngredients.ingredient',
    ]);
  }

  @Roles(RoleNames.ADMIN)
  @UseInterceptors(new SetUserIdInterceptor('createdById'))
  @Post()
  async create(@Body() payload: CreateRecipeDto) {
    return await this.recipeRepo.create(payload);
  }

  @Roles(RoleNames.ADMIN)
  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateRecipeDto,
  ) {
    return await this.recipeRepo.update(id, payload);
  }

  @Roles(RoleNames.ADMIN)
  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.recipeRepo.remove(id);
  }
}
