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
import { Career } from './entities/career.entity';
import { CreateCareerDto, UpdateCareerDto, FilterCareersDto } from './dto';

@Injectable()
export class CareersService {
  constructor(
    @InjectRepository(Career)
    private careerRepo: Repository<Career>,
  ) {}

  async findAll(params: FilterCareersDto) {
    const query = this.careerRepo.createQueryBuilder('c');

    query.orderBy('c.id', params.order).offset(params.skip).limit(params.take);

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
    data: FindOptionsWhere<Career>,
    relations?: string[],
    throwException = true,
  ) {
    const careers = await this.careerRepo.findOne({
      where: { ...data, isDeleted: false },
      relations,
    });
    if (!careers && throwException)
      throw new HttpException(HttpStatus.NOT_FOUND, 'CAREER', 'f');
    return careers;
  }

  async findManyBy(
    data: FindOptionsWhere<Career>,
    relations?: string[],
    throwException = true,
  ) {
    const careers = await this.careerRepo.find({
      where: { ...data, isDeleted: false },
      relations,
    });
    if (!careers && throwException)
      throw new HttpException(HttpStatus.NOT_FOUND, 'CAREER', 'f');
    return careers;
  }

  async create(data: CreateCareerDto) {
    await this.checkIfCareerExists(data);
    const newCareers = this.careerRepo.create(data);
    return await this.careerRepo.save(newCareers);
  }

  async checkIfCareerExists(
    data: CreateCareerDto | UpdateCareerDto,
    throwException = true,
  ) {
    const {} = data;
    const careers = await this.careerRepo.findOne({
      where: [],
    });

    if (careers) {
      if (!throwException) return true;
    }

    return false;
  }

  async update(id: number, changes: UpdateCareerDto) {
    const careers = await this.findOneBy({ id });
    this.careerRepo.merge(careers, changes);
    return await this.careerRepo.save(careers);
  }

  async remove(id: number) {
    const careers = await this.findOneBy({ id });
    careers.isDeleted = true;
    return await this.careerRepo.save(careers);
  }
}
