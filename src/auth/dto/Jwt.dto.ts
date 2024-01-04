import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/users/user.entity';

export class JwtDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  roles: string[];

  @ApiProperty()
  username: string;

  // @ApiProperty()
  // user: Partial<User>;
}
