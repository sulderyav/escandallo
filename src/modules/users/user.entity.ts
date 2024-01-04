import {
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { v4 as uuid } from 'uuid';
import { Role } from './role.entity';

const bcrypt = require('bcrypt');

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  code: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  avatarUrl: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  fullName: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  mobile: string;

  @Exclude()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
  })
  isActive: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  registerDate: Date;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isDeleted: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date;

  @Exclude()
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  @BeforeInsert()
  @BeforeUpdate()
  hashPasswordandGenerateCode() {
    this.code = 'USER-' + Math.floor(Math.random() * 1000000);
    this.password = bcrypt.hashSync(this.password, 10);
  }

  @BeforeUpdate()
  async setDeletedAt() {
    if (this.isDeleted) {
      const uuidCode = uuid().split('-')[0];
      this.code = `${this.code}-${uuidCode}`;
      this.email = `${this.email}-${uuidCode}`;
      this.mobile = `${this.mobile}-${uuidCode}`;
      this.deletedAt = new Date();
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  multipleSettings() {
    if (this.firstName || this.lastName)
      this.fullName = `${this.firstName} ${this.lastName}`;
  }
}
