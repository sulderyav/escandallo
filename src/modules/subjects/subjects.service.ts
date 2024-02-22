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
import { Subject } from './entities/subject.entity';
import { CreateSubjectDto, UpdateSubjectDto, FilterSubjectsDto } from './dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepo: Repository<Subject>,
  ) {}

  async findAll(params: FilterSubjectsDto) {
    const query = this.subjectRepo.createQueryBuilder('s');

    query.orderBy('s.id', params.order).offset(params.skip).limit(params.take);

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
    data: FindOptionsWhere<Subject>,
    relations?: string[],
    throwException = true,
  ) {
    const subjects = await this.subjectRepo.findOne({
      where: { ...data },
      relations,
    });
    if (!subjects && throwException)
      throw new HttpException(HttpStatus.NOT_FOUND, 'SUBJECT', 'f');
    return subjects;
  }

  async findManyBy(
    data: FindOptionsWhere<Subject>,
    relations?: string[],
    throwException = true,
  ) {
    const subjects = await this.subjectRepo.find({
      where: { ...data },
      relations,
    });
    if (!subjects && throwException)
      throw new HttpException(HttpStatus.NOT_FOUND, 'SUBJECT', 'f');
    return subjects;
  }

  async create(data: CreateSubjectDto) {
    await this.checkIfSubjectExists(data);
    const newSubject = this.subjectRepo.create(data);
    return await this.subjectRepo.save(newSubject);
  }

  async checkIfSubjectExists(
    data: CreateSubjectDto | UpdateSubjectDto,
    throwException = true,
  ) {
    const {} = data;
    const subjects = await this.subjectRepo.findOne({
      where: [],
    });

    if (subjects) {
      if (!throwException) return true;
    }

    return false;
  }

  async update(id: number, changes: UpdateSubjectDto) {
    const subjects = await this.findOneBy({ id });
    this.subjectRepo.merge(subjects, changes);
    return await this.subjectRepo.save(subjects);
  }

  async remove(id: number) {
    // const subjects = await this.findOneBy({ id });
    // subjects.isDeleted = true;
    // return await this.subjectRepo.save(subjects);
    return await this.subjectRepo.softDelete(id);
  }
}
