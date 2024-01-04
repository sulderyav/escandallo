import { RoleNames } from '../../modules/users/role.entity';

export type JwtToken = {
  userId: number;
  username: string;
  roles: RoleNames[];
};
