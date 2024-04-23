import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Career } from '../../careers/entities/career.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { User } from '../../users/user.entity';

@Entity('levels')
export class Level {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  slug: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Exclude()
  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isDeleted: boolean;

  @Exclude()
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: Date;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => Career, (career) => career.levels)
  @JoinColumn({ name: 'career_id' })
  career: Career;

  @ManyToMany(() => Subject, (subject) => subject.levels)
  subjects: Subject[];

  @ManyToMany(() => User, (user) => user.levels)
  @JoinTable({ name: 'levels_users' })
  users: User[];

  @BeforeUpdate()
  async setDeletedAt() {
    if (this.isDeleted) {
      this.deletedAt = new Date();
      this.slug = `${this.slug}-DELETED-${new Date().getTime()}`;
      this.name = `${this.name}-DELETED-${new Date().getTime()}`;
    }
  }
}
