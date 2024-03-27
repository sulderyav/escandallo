import {
  Injectable,
  NotFoundException,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { HttpException } from '../../utils/HttpExceptionFilter';
import { PaginationDto, PaginationMetaDto } from '../../utils/pagination.dto';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto, UpdateRecipeDto, FilterRecipesDto } from './dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepo: Repository<Recipe>,
    private userService: UsersService,
  ) {}

  async findAll(params: FilterRecipesDto) {
    const { ignorePagination } = params;
    const query = this.recipeRepo.createQueryBuilder('recipe');

    // Joins
    query.leftJoinAndSelect('recipe.recipeIngredients', 'recipeIngredients');
    query.leftJoinAndSelect('recipeIngredients.ingredient', 'ingredient');

    // Filters
    query.where({ isDeleted: false });

    query.orderBy('recipe.id', params.order);

    if (ignorePagination) return await query.getMany();

    query.offset(params.skip).limit(params.take);

    const itemCount = await query.getCount();
    const data = await query.getMany();

    const paginationMetaDto = new PaginationMetaDto({
      itemCount,
      paginationOptionsDto: params,
    });

    return new PaginationDto(data, paginationMetaDto);
  }

  async findOneBy(
    data: FindOptionsWhere<Recipe>,
    relations?: string[],
    throwException = true,
  ) {
    const recipe = await this.recipeRepo.findOne({
      where: { ...data },
      relations,
    });
    if (!recipe && throwException)
      throw new HttpException(HttpStatus.NOT_FOUND, 'RECIPE', 'f');
    return recipe;
  }

  async findManyBy(
    data: FindOptionsWhere<Recipe>,
    relations?: string[],
    throwException = true,
  ) {
    const recipe = await this.recipeRepo.find({
      where: { ...data },
      relations,
    });
    if (!recipe && throwException)
      throw new HttpException(HttpStatus.NOT_FOUND, 'RECIPE', 'f');
    return recipe;
  }

  async create(data: CreateRecipeDto) {
    await this.checkIfRecipeExists(data);
    const newRecipe = this.recipeRepo.create(data);

    const user = await this.userService.findOneBy({ id: data.createdById });
    newRecipe.createdBy = user;

    if (!data.coverImage)
      newRecipe.coverImage = `https://ui-avatars.com/api/?name=${newRecipe.slug}&background=random&width=200&height=200`;

    return await this.recipeRepo.save(newRecipe);
  }

  async checkIfRecipeExists(
    data: CreateRecipeDto | UpdateRecipeDto,
    throwException = true,
  ) {
    const { slug, name } = data;
    const recipe = await this.recipeRepo.findOne({
      where: [
        {
          slug,
          isDeleted: false,
        },
        {
          name,
          isDeleted: false,
        },
      ],
    });

    if (recipe) {
      if (!throwException) return true;

      throw new HttpException(HttpStatus.CONFLICT, 'slug', 'f', 'recipe');
    }

    return false;
  }

  async update(id: number, changes: UpdateRecipeDto) {
    const recipe = await this.findOneBy({ id });
    this.recipeRepo.merge(recipe, changes);
    return await this.recipeRepo.save(recipe);
  }

  async remove(id: number) {
    const recipe = await this.findOneBy({ id });
    recipe.isDeleted = true;
    return await this.recipeRepo.save(recipe);
  }
}
