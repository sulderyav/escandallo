import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  Column,
  JoinColumn,
  Timestamp,
} from 'typeorm';
import { User } from '../modules/users/user.entity';

@Entity({
  name: 'access_tokens',
})
export class AccessToken {
  @PrimaryColumn()
  id: string;

  @ManyToOne((type) => User)
  @JoinColumn({
    name: 'system_user_id',
  })
  systemUser: User;

  @Column({
    default: false,
  })
  revoked: boolean;

  @Column({
    type: 'timestamp',
  })
  expiresAt: Timestamp;
}
