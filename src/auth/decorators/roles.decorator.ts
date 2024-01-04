import { SetMetadata } from '@nestjs/common';

import { RoleNames } from '../../modules/users/role.entity';

export const Roles = (...roles: RoleNames[]) => SetMetadata('roles', roles);
