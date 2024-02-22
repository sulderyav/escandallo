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
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { v4 as uuid } from 'uuid';

import { Role } from './role.entity';
import { Credential } from './credentials.entity';
import { Career } from '../careers/entities/career.entity';
import { Level } from '../levels/entities/level.entity';
import { Subject } from '../subjects/entities/subject.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  mobile: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  fullName: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  isActive: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  avatar: string;

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
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToOne(() => Credential, (credential) => credential.user)
  credential: Credential;

  @ManyToMany(() => Career, (career) => career.users)
  careers: Career[];

  @ManyToMany(() => Level, (level) => level.users)
  levels: Level[];

  @ManyToMany(() => Subject, (subject) => subject.users)
  subjects: Subject[];

  @BeforeUpdate()
  async setDeletedAt() {
    if (this.isDeleted) {
      const uuidCode = uuid().split('-')[0];
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
    if (!this.avatar)
      this.avatar = `https://ui-avatars.com/api/?name=${this.firstName}${this.lastName}&background=random`;
  }
}
