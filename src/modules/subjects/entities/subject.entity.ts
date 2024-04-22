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
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { v4 as uuid } from 'uuid';

import { Level } from '../../levels/entities/level.entity';
import { User } from '../../users/user.entity';
import { Recipe } from '../../recipes/entities/recipe.entity';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
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

  @ManyToOne(() => Level, (level) => level.subjects)
  @JoinColumn({ name: 'level_id' })
  level: Level;

  @ManyToMany(() => User, (user) => user.subjects)
  @JoinTable({
    name: 'subjects_users',
  })
  users: User[];

  @ManyToMany(() => Recipe, (recipe) => recipe.subjects, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'subjects_recipes',
  })
  recipes: Recipe[];

  @BeforeUpdate()
  async setDeletedAt() {
    if (this.isDeleted) {
      this.deletedAt = new Date();
      this.slug = `${this.slug}-DELETED-${uuid()}`;
      this.name = `${this.name}-DELETED-${uuid()}`;
    }
  }
}
