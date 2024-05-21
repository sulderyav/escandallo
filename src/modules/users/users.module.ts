import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { Role } from './role.entity';
import { Credential } from './credentials.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { LevelsModule } from '../levels/levels.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Credential]), LevelsModule],
  providers: [UsersService, RolesService],
  controllers: [UsersController, RolesController],
  exports: [UsersService, RolesService],
})
export class UsersModule {}
