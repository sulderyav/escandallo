import { RoleNames } from '../../modules/users/role.entity';

export interface PayloadToken {
  userId: number;
  email: string;
  roles: RoleNames[];
  tenantId?: number;
}
