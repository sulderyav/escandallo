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
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { Public, Roles } from '../../auth/decorators';
import { RoleNames } from '../users/role.entity';
import { HttpException } from '../../utils/HttpExceptionFilter';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto, UpdateRecipeDto, FilterRecipesDto } from './dto';
import { SetUserIdInterceptor } from 'src/utils/UserInterceptor';
import { PayloadToken } from 'src/auth/models/token.model';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private recipeRepo: RecipesService) {}

  @Roles(RoleNames.ADMIN, RoleNames.TEACHER, RoleNames.STUDENT)
  @Get()
  async findAll(@Query() params: FilterRecipesDto, @Req() req: Request) {
    const user = req.user as PayloadToken;
    const appendParams = {};
    if (user.roles.some((role) => role === RoleNames.STUDENT)) {
      appendParams['filterByCurrentLevels'] = true;
      appendParams['userId'] = user.userId;
    }
    return await this.recipeRepo.findAll(Object.assign(params, appendParams));
  }

  @Roles(RoleNames.ADMIN, RoleNames.TEACHER, RoleNames.STUDENT)
  @Get('/:id')
  async getOne(@Param('id') id: number) {
    return await this.recipeRepo.findOneBy({ id }, [
      'recipeIngredients',
      'recipeIngredients.ingredient',
      'subjects',
    ]);
  }

  @Roles(RoleNames.ADMIN, RoleNames.TEACHER, RoleNames.STUDENT)
  @UseInterceptors(new SetUserIdInterceptor('createdById'))
  @Post()
  async create(@Body() payload: CreateRecipeDto) {
    return await this.recipeRepo.create(payload);
  }

  @Roles(RoleNames.ADMIN, RoleNames.TEACHER)
  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateRecipeDto,
  ) {
    return await this.recipeRepo.update(id, payload);
  }

  @Roles(RoleNames.ADMIN, RoleNames.TEACHER)
  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.recipeRepo.remove(id);
  }
}
