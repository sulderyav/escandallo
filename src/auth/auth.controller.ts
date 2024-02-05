import {
  Controller,
  // Request,
  Req,
  Post,
  UseGuards,
  Get,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { RefreshTokenDto } from './dto/RefreshToken.dto';
import { JwtDto } from './dto/Jwt.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '../modules/users/user.entity';

@Controller('auth')
@UsePipes(ValidationPipe)
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiConsumes('email', 'password', 'tenantId')
  @Post('/login')
  async login(@Req() req: any): Promise<JwtDto> {
    const loggedUser = req.user as { user: User; tenantId: number };
    return this.authService.login(loggedUser.user, loggedUser.tenantId); // If loggedUser.tenantId value is here, is because the user is included in the tenant
  }

  @Post('/refresh')
  async refreshToken(@Body() body: RefreshTokenDto): Promise<JwtDto> {
    return this.authService.refresh(body.refreshToken);
  }
}
