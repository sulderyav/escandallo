import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleNames } from '../../modules/users/role.entity';
import { HttpExceptionMessage } from '../../utils/HttpExceptionFilter';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    let roles: RoleNames[] = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    ) as RoleNames[];
    if (!roles) return true;

    // Always allow super admin
    roles = [...roles, RoleNames.SUPER_ADMIN];

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const hasRole = () =>
      user.roles.some((role: RoleNames) => roles.includes(role));
    return user && user.roles && hasRole();
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw new HttpExceptionMessage(
        HttpStatus.UNAUTHORIZED,
        'Invalid token 2',
      );
    }
    return user;
  }
}
