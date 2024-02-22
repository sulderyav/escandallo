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
import { Ingredient } from './ingredient.entity';
import {
  CreateIngredientDto,
  UpdateIngredientDto,
  FilterIngredientsDto,
} from './ingredient.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepo: Repository<Ingredient>,
    private userService: UsersService,
  ) {}

  async findAll(params: FilterIngredientsDto) {
    const { ignorePagination } = params;

    const query = this.ingredientRepo.createQueryBuilder('i');

    query.where({ isDeleted: false });

    if (ignorePagination) return await query.getMany();

    query.orderBy('i.id', params.order).offset(params.skip).limit(params.take);

    const itemCount = await query.getCount();
    const data = await query.getMany();

    const paginationMetaDto = new PaginationMetaDto({
      itemCount,
      paginationOptionsDto: params,
    });

    return new PaginationDto(data, paginationMetaDto);
  }

  async findOneBy(
    data: FindOptionsWhere<Ingredient>,
    relations?: string[],
    throwException = true,
  ) {
    const ingredient = await this.ingredientRepo.findOne({
      where: { ...data, isDeleted: false },
      relations,
    });
    if (!ingredient && throwException)
      throw new HttpException(HttpStatus.NOT_FOUND, 'INGREDIENT', 'm');
    return ingredient;
  }

  async findManyBy(
    data: FindOptionsWhere<Ingredient>,
    relations?: string[],
    throwException = true,
  ) {
    const ingredient = await this.ingredientRepo.find({
      where: { ...data, isDeleted: false },
      relations,
    });
    if (!ingredient && throwException)
      throw new HttpException(HttpStatus.NOT_FOUND, 'INGREDIENT', 'm');
    return ingredient;
  }

  async create(data: CreateIngredientDto) {
    await this.checkIfIngredientExists(data);
    const newIngredient = this.ingredientRepo.create(data);

    const user = await this.userService.findOneBy({ id: data.createdById });
    newIngredient.createdBy = user;

    return await this.ingredientRepo.save(newIngredient);
  }

  async checkIfIngredientExists(
    data: CreateIngredientDto | UpdateIngredientDto,
    throwException = true,
  ) {
    const { slug } = data;
    const ingredient = await this.ingredientRepo.findOne({
      where: [
        {
          slug,
        },
      ],
    });

    if (ingredient) {
      if (!throwException) return true;

      throw new HttpException(HttpStatus.CONFLICT, 'slug', 'm', 'ingredient');
    }

    return false;
  }

  async update(id: number, changes: UpdateIngredientDto) {
    const ingredient = await this.findOneBy({ id });
    this.ingredientRepo.merge(ingredient, changes);
    return await this.ingredientRepo.save(ingredient);
  }

  async remove(id: number) {
    const ingredient = await this.findOneBy({ id });
    ingredient.isDeleted = true;
    return await this.ingredientRepo.save(ingredient);
  }
}
