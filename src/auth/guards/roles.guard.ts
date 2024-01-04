import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleCodes } from 'src/modules/users/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    let roles: RoleCodes[] = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    ) as RoleCodes[];
    if (!roles) return true;

    // Always allow super admin
    roles = [...roles, RoleCodes.SUPER_ADMIN];

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const hasRole = () =>
      user.roles.some((role: RoleCodes) => roles.includes(role));
    return user && user.roles && hasRole();
  }
}
