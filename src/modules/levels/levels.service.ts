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
import { Level } from './entities/level.entity';
import { CreateLevelDto, UpdateLevelDto, FilterLevelsDto } from './dto';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(Level)
    private levelRepo: Repository<Level>,
  ) {}

  async findAll(params: FilterLevelsDto) {
    const query = this.levelRepo.createQueryBuilder('l');

    query.orderBy('l.id', params.order).offset(params.skip).limit(params.take);

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
    data: FindOptionsWhere<Level>,
    relations?: string[],
    throwException = true,
  ) {
    const levels = await this.levelRepo.findOne({
      where: { ...data, isDeleted: false },
      relations,
    });
    if (!levels && throwException)
      throw new HttpException(HttpStatus.NOT_FOUND, 'LEVEL', 'm');
    return levels;
  }

  async findManyBy(
    data: FindOptionsWhere<Level>,
    relations?: string[],
    throwException = true,
  ) {
    const levels = await this.levelRepo.find({
      where: { ...data, isDeleted: false },
      relations,
    });
    if (!levels && throwException)
      throw new HttpException(HttpStatus.NOT_FOUND, 'LEVEL', 'm');
    return levels;
  }

  async create(data: CreateLevelDto) {
    await this.checkIfLevelExists(data);
    const newLevel = this.levelRepo.create(data);
    return await this.levelRepo.save(newLevel);
  }

  async checkIfLevelExists(
    data: CreateLevelDto | UpdateLevelDto,
    throwException = true,
  ) {
    const {} = data;
    const levels = await this.levelRepo.findOne({
      where: [],
    });

    if (levels) {
      if (!throwException) return true;
    }

    return false;
  }

  async update(id: number, changes: UpdateLevelDto) {
    const levels = await this.findOneBy({ id });
    this.levelRepo.merge(levels, changes);
    return await this.levelRepo.save(levels);
  }

  async remove(id: number) {
    const levels = await this.findOneBy({ id });
    levels.isDeleted = true;
    return await this.levelRepo.save(levels);
  }
}
