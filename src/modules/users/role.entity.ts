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

export enum RoleNames {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  RECIPE_ADMIN = 'RECIPE_ADMIN',
  RECEPE_OBSERVER = 'RECEPE_OBSERVER',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    nullable: false,
    unique: true,
    enum: RoleNames,
  })
  name: RoleNames;

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
