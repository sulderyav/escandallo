import {
  Injectable,
  NotFoundException,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { HttpException } from '../../../utils/HttpExceptionFilter';
import {
  PaginationDto,
  PaginationMetaDto,
} from '../../../utils/pagination.dto';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import {
  CreateRecipeIngredientDto,
  UpdateRecipeIngredientDto,
  FilterRecipeIngredientsDto,
} from './dto';
import { RecipesService } from '../recipes.service';
import { IngredientsService } from '../../ingredients/ingredients.service';

@Injectable()
export class RecipeIngredientsService {
  constructor(
    @InjectRepository(RecipeIngredient)
    private recipeIngredientRepo: Repository<RecipeIngredient>,
    private recipesService: RecipesService,
    private ingredientsService: IngredientsService,
  ) {}

  async findAll(params: FilterRecipeIngredientsDto) {
    const query = this.recipeIngredientRepo.createQueryBuilder('ri');

    query.orderBy('ri.id', params.order).offset(params.skip).limit(params.take);

    query.andWhere({ isDeleted: false });

    const itemCount = await query.getCount();
    const data = await query.getMany();

    const paginationMetaDto = new PaginationMetaDto({
      itemCount,
      paginationOptionsDto: params,
    });

    return new PaginationDto(data, paginationMetaDto);
  }

  async findOneBy(
    data: FindOptionsWhere<RecipeIngredient>,
    relations?: string[],
    throwException = true,
  ) {
    const recipeIngredients = await this.recipeIngredientRepo.findOne({
      where: { ...data, isDeleted: false },
      relations,
    });
    if (!recipeIngredients && throwException)
      throw new HttpException(HttpStatus.NOT_FOUND, 'RECIPE_INGREDIENT', 'm');
    return recipeIngredients;
  }

  async findManyBy(
    data: FindOptionsWhere<RecipeIngredient>,
    relations?: string[],
    throwException = true,
  ) {
    const recipeIngredients = await this.recipeIngredientRepo.find({
      where: { ...data, isDeleted: false },
      relations,
    });
    if (!recipeIngredients && throwException)
      throw new HttpException(HttpStatus.NOT_FOUND, 'RECIPE_INGREDIENT', 'm');
    return recipeIngredients;
  }

  async create(data: CreateRecipeIngredientDto) {
    // await this.checkIfRecipeIngredientExists(data);
    const newRecipeIngredients = this.recipeIngredientRepo.create(data);

    const recipe = await this.recipesService.findOneBy({
      id: data.recipeId,
    });
    newRecipeIngredients.recipe = recipe;

    const ingredient = await this.ingredientsService.findOneBy({
      id: data.ingredientId,
    });
    newRecipeIngredients.ingredient = ingredient;

    return await this.recipeIngredientRepo.save(newRecipeIngredients);
  }

  async checkIfRecipeIngredientExists(
    data: CreateRecipeIngredientDto | UpdateRecipeIngredientDto,
    throwException = true,
  ) {
    const {} = data;
    const recipeIngredients = await this.recipeIngredientRepo.findOne({
      where: [],
    });

    if (recipeIngredients) {
      if (!throwException) return true;
    }

    return false;
  }

  async update(id: number, changes: UpdateRecipeIngredientDto) {
    const recipeIngredients = await this.findOneBy({ id });
    this.recipeIngredientRepo.merge(recipeIngredients, changes);
    return await this.recipeIngredientRepo.save(recipeIngredients);
  }

  async remove(id: number) {
    const recipeIngredients = await this.findOneBy({ id });
    recipeIngredients.isDeleted = true;
    return await this.recipeIngredientRepo.save(recipeIngredients);
  }
}
