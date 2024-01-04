import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/users/user.entity';

import { RoleCodes } from '../../modules/users/role.entity';

export class JwtDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  roles: RoleCodes[];

  @ApiProperty()
  username: string;

  // @ApiProperty()
  // user: Partial<User>;
}
