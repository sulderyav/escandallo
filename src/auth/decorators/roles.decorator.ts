import { SetMetadata } from '@nestjs/common';

import { RoleCodes } from '../../modules/users/role.entity';

export const Roles = (...roles: RoleCodes[]) => SetMetadata('roles', roles);
