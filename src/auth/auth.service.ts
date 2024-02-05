import * as bcrypt from 'bcrypt';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtDto } from './dto/Jwt.dto';
import { JwtService } from '@nestjs/jwt';
import { AccessToken } from './accessToken.entity';
import { RefreshToken } from './refreshToken.entity';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

import {
  HttpException,
  HttpExceptionMessage,
} from '../utils/HttpExceptionFilter';
import { UsersService } from '../modules/users/users.service';
import { User } from '../modules/users/user.entity';
import { RoleNames } from '../modules/users/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: Repository<AccessToken>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshRepository: Repository<RefreshToken>,
    private systemUsersService: UsersService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.systemUsersService.findOneBy(
      {
        email,
      },
      ['roles', 'credential'],
    );

    // First search if the user exists
    if (!user) throw new HttpException(HttpStatus.NOT_FOUND, 'USER');

    // Second we campare the passwords
    if (!(await bcrypt.compare(password, user.credential.password))) {
      throw new HttpExceptionMessage(HttpStatus.UNAUTHORIZED, 'Wrong password');
    }

    return user;
  }

  async login(user: User, tenantId: number): Promise<JwtDto> {
    return await this.createUserTokens(user);
  }

  async refresh(token: string): Promise<JwtDto> {
    try {
      const refreshData = this.jwtService.verify(token);

      const refreshToken = await this.refreshRepository.findOne({
        where: { id: refreshData.jti },
        join: {
          alias: 'refreshToken',
          leftJoinAndSelect: {
            accessToken: 'refreshToken.accessToken',
            user: 'accessToken.user',
          },
        },
      });

      if (!refreshToken || refreshToken.revoked) {
        throw new Error('Refresh token not recognized');
      }

      refreshToken.revoked = true;
      await this.refreshRepository.save(refreshToken);
      refreshToken.accessToken.revoked = true;
      await this.accessTokenRepository.save(refreshToken.accessToken);

      // this.systemUsersService.setLastLogin(refreshToken.accessToken.user.id);
      // // Find the full user here because refreshToken does not contain user roles
      // const fullUser = await this.systemUsersService.findByEmail(
      //   refreshToken.accessToken.systemUser.email,
      // );
      const fullUser = await this.systemUsersService.findOneBy(
        {
          email: refreshToken.accessToken.systemUser.email,
        },
        ['roles'],
        false,
      );
      // Testing value: 1
      return this.createUserTokens(fullUser);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }

  async createUserTokens(
    user: User,
  ): Promise<JwtDto> {
    const id = uuid();
    const refreshId = uuid();
    const accessPayload = {
      email: user.email,
      sub: user.id,
      roles: user.roles.map((r) => r.name),
    };

    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: this.configService.get('JWT_EXPIRATION'),
      jwtid: id,
    });

    const refreshToken = this.jwtService.sign(
      {},
      {
        expiresIn: this.configService.get('JWT_EXPIRATION'),
        jwtid: refreshId,
      },
    );

    return {
      accessToken,
      refreshToken,
      roles: accessPayload.roles,
      sub: accessPayload.sub,
      email: accessPayload.email,
    };
  }

  async validateUserTokenInfo(userId: number, roles: RoleNames[]) {
    const user = await this.systemUsersService.findOneBy(
      {
        id: userId,
      },
      ['roles'],
      false,
    );
    if (!user)
      throw new HttpExceptionMessage(
        HttpStatus.UNAUTHORIZED,
        'System User have been deleted',
      );

    const assignedRoles = user.roles.map((r) => r.name);
    // const areRolesTheSame = equalsIgnoreOrder(roles, assignedRoles);

    // if (!areRolesTheSame)
    //   throw new HttpExceptionMessage(
    //     HttpStatus.FORBIDDEN,
    //     'System Roles have been updated',
    //   );

    return user;
  }

 
}
