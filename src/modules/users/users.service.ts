import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  HttpException,
  HttpExceptionMessage,
} from '../../utils/HttpExceptionFilter';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { RolesService } from '../users/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private rolesService: RolesService,
  ) {}

  async findAll() {
    return await this.userRepo.find();
  }

  async listAll() {
    return await this.userRepo.find({
      where: {
        isActive: true,
        isDeleted: false,
      },
      select: ['id', 'fullName', 'email', 'mobile', 'avatarUrl'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!user) throw new HttpException(HttpStatus.NOT_FOUND, 'USER');
    return user;
  }

  async myInfo(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    delete user.password;
    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  async create(data: CreateUserDto) {
    await this.checkIfUserExists(data);

    const newUser = this.userRepo.create(data);

    const roles = await this.rolesService.findByRolesIds(data.rolesIds);
    newUser.roles = roles;

    if (!newUser.avatarUrl)
      newUser.avatarUrl = `https://ui-avatars.com/api/?name=${newUser.firstName}${newUser.lastName}&background=random`;

    if (newUser.roles.length === 0)
      throw new HttpExceptionMessage(
        HttpStatus.BAD_REQUEST,
        'The user must have at least one role',
      );

    return await this.userRepo.save(newUser);
  }

  async checkIfUserExists(
    data: CreateUserDto | UpdateUserDto,
    throwException = true,
  ) {
    const user = await this.userRepo.findOne({
      where: [{ email: data.email }, { mobile: data.mobile }],
    });

    if (user) {
      if (!throwException) return true;

      if (data.email === user.email)
        throw new HttpException(HttpStatus.CONFLICT, 'email', 'm', 'user');

      if (data.mobile === user.mobile)
        throw new HttpException(HttpStatus.CONFLICT, 'mobile', 'm', 'user');
    }
    return false;
  }

  async update(id: number, changes: UpdateUserDto) {
    if (changes.email || changes.mobile) await this.checkIfUserExists(changes);

    const user = await this.findOne(id);
    this.userRepo.merge(user, changes);
    return await this.userRepo.save(user);
  }

  async remove(id: number) {
    return await this.userRepo.delete(id);
  }
}
