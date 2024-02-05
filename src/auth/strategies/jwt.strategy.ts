import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth.service';
import { JwtDto } from '../dto/Jwt.dto';
import { RoleNames } from '../../modules/users/role.entity';
import { PayloadToken } from '../models/token.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: configService.get('NODE_ENV') === 'development',
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtDto): Promise<PayloadToken> {
    // TODO: Validate if system-user is active

    await this.authService.validateUserTokenInfo(
      payload.sub,
      payload.roles,
    );

    return {
      userId: payload.sub,
      roles: payload.roles,
      email: payload.email,
    };
  }
}
