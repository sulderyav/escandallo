import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleNames } from 'src/modules/users/role.entity';

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
}
