import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from './user.entity';

export enum RoleCodes {
  SUPER_ADMIN = 'SA',
  ADMIN = 'AD',
  SELLER = 'SL',
  SUPPLIER = 'SP',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RoleCodes,
    nullable: false,
    unique: true,
  })
  code: RoleCodes;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  description: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @Exclude()
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Exclude()
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
