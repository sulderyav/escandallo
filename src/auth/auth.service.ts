import * as bcrypt from 'bcrypt';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtDto } from './dto/Jwt.dto';
import { JwtService } from '@nestjs/jwt';
import { AccessToken } from './accessToken.entity';
import { RefreshToken } from './refreshToken.entity';
import { User } from '../modules/users/user.entity';
import { UsersService } from '../modules/users/users.service';
import { ConfigService } from '@nestjs/config';
import { uid } from 'rand-token';

// const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client();

// import { unix } from 'moment';
import { HttpException } from '../utils/HttpExceptionFilter';
import { Role } from '../modules/users/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: Repository<AccessToken>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshRepository: Repository<RefreshToken>,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    // First search if the user exists
    if (!user) throw new HttpException(HttpStatus.NOT_FOUND);

    // Second we campare the passwords
    // if (!(await bcrypt.compare(password, user.credential.password))) {
    //   // await this.usersService.incrementLoginAttempts(user.id);
    //   throw new HttpException(HttpStatus.UNAUTHORIZED);
    // }

    if (password !== user.credential.password) {
      // await this.usersService.incrementLoginAttempts(user.id);
      throw new HttpException(HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async login(user: User): Promise<JwtDto> {
    // this.usersService.setLastLogin(user.id);
    return await this.createTokens(user);
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

      // this.usersService.setLastLogin(refreshToken.accessToken.user.id);
      // // Find the full user here because refreshToken does not contain user roles
      const fullUser = await this.usersService.findByEmail(
        refreshToken.accessToken.user.email,
      );
      return this.createTokens(fullUser);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }

  async createTokens(user: User): Promise<JwtDto> {
    const id = uid(64);
    const refreshId = uid(64);
    const accessPayload = {
      email: user.email,
      sub: user.id,
      roles: user.roles.map((r) => r.name),
    };

    const accessToken = this.jwtService.sign(accessPayload, {
      jwtid: id,
    });

    // const tokenData: any = this.jwtService.decode(accessToken);

    const refreshToken = this.jwtService.sign(
      {},
      {
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
        jwtid: refreshId,
      },
    );

    // const accessTokenDB = await this.accessTokenRepository.save({
    //   id,
    //   user: await this.usersService.findOne(user.id),
    //   // expiresAt: unix(tokenData.exp).format(),
    //   expiresAt: new Date(),
    // });

    // await this.refreshRepository.save({
    //   id: refreshId,
    //   accessToken: accessTokenDB,
    //   expiresAt: unix(
    //     (this.jwtService.decode(refreshToken) as any).exp,
    //   ).format(),
    // });

    // // Verify the password expiration time
    // const { areSoonToExpire, areExpired, credentialsExpireAt } =
    //   await this.usersService.informationAboutCredentialsExpiration(user.id);

    return {
      accessToken,
      refreshToken,
      roles: accessPayload.roles,
      username: accessPayload.email,
    };
  }
}
