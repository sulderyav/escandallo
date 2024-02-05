import { ApiProperty } from '@nestjs/swagger';

import { RoleNames } from '../../modules/users/role.entity';

export class JwtDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  roles: RoleNames[];

  @ApiProperty()
  email: string;

  @ApiProperty()
  sub: number;

}
