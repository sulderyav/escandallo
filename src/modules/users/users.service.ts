import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import {
  HttpException,
  HttpExceptionMessage,
} from '../../utils/HttpExceptionFilter';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { RolesService } from '../users/roles.service';
import { Credential } from './credentials.entity';
import { LevelsService } from '../levels/levels.service';
import { Level } from '../levels/entities/level.entity';

const bcrypt = require('bcrypt');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Credential)
    private credentialRepo: Repository<Credential>,
    private rolesService: RolesService,
    private levelsService: LevelsService,
  ) {}

  async findAll() {
    return await this.userRepo.find({
      where: {
        isDeleted: false,
      },
      relations: ['roles'],
    });
  }

  async listAll() {
    return await this.userRepo.find({
      where: {
        isDeleted: false,
      },
      // select: ['id', 'fullName', 'email', 'mobile', 'credential', 'roles'],
      select: {
        id: true,
        fullName: true,
        email: true,
        mobile: true,
        roles: {
          id: true,
          name: true,
        },
        credential: {
          password: true,
        },
      },
      relations: ['roles', 'credential'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id, isDeleted: false },
      relations: ['roles', 'levels'],
    });
    if (!user) throw new HttpException(HttpStatus.NOT_FOUND, 'USER');
    return user;
  }

  async myInfo(id: number) {
    const user = await this.userRepo.findOne({
      where: {
        id,
        isDeleted: false,
      },
      relations: ['roles', 'levels'],
    });
    return user;
  }

  async findOneBy(
    data: FindOptionsWhere<User>,
    relations?: string[],
    throwException = true,
  ) {
    const user = await this.userRepo.findOne({
      where: { ...data, isDeleted: false },
      relations,
    });
    if (!user && throwException)
      throw new HttpException(HttpStatus.NOT_FOUND, 'USER', 'm');
    return user;
  }

  async findManyBy(
    data: FindOptionsWhere<User>,
    relations?: string[],
    throwException = true,
  ) {
    const users = await this.userRepo.find({
      where: { ...data, isDeleted: false },
      relations,
    });
    if (!users && throwException)
      throw new HttpException(HttpStatus.NOT_FOUND, 'USER', 'm');
    return users;
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOne({
      where: { email, isDeleted: false },
      relations: ['roles', 'credential'],
    });
  }

  async create(data: CreateUserDto) {
    await this.checkIfUserExists(data);

    const newUser = this.userRepo.create(data);

    const roles = await this.rolesService.findByRolesIds(data.roleIds);
    newUser.roles = roles;

    if (newUser.roles.length === 0)
      throw new HttpExceptionMessage(
        HttpStatus.BAD_REQUEST,
        'The user must have at least one role',
      );

    if (data.levelIds) {
      const levels: Level[] = [];
      for (const levelId of data.levelIds) {
        const level = await this.levelsService.findOneBy({ id: levelId });
        levels.push(level);
      }
      newUser.levels = levels;
    }

    const createdUser = await this.userRepo.save(newUser);

    await this.credentialRepo.save({
      user: await this.userRepo.findOne({
        where: { id: createdUser.id },
      }),
      // password: data.password,
      password: bcrypt.hashSync(data.password, 10),
    });

    return createdUser;
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

    if (changes.password) {
      // Remove old password
      await this.credentialRepo.delete({
        user: {
          id: user.id,
        },
      });
      await this.credentialRepo.save({
        user,
        password: bcrypt.hashSync(changes.password, 10),
      });
    }

    if (changes.levelIds) {
      const levels: Level[] = [];
      for (const levelId of changes.levelIds) {
        const level = await this.levelsService.findOneBy({ id: levelId });
        levels.push(level);
      }
      user.levels = levels;
    }

    return await this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    user.isDeleted = true;
    return await this.userRepo.save(user);
  }
}
