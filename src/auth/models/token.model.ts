import { RoleNames } from '../../modules/users/role.entity';

export interface PayloadToken {
  userId: number;
  username: string;
  roles: RoleNames[];
}
