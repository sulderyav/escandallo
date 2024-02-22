import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { RecipeIngredient } from '../recipe-ingredients/entities/recipe-ingredient.entity';
import { Subject } from '../../subjects/entities/subject.entity';

@Entity('recipes')
export class Recipe {
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
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  coverImage: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  steps: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  portions: number;

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

  @OneToMany(
    () => RecipeIngredient,
    (recipeIngredient) => recipeIngredient.recipe,
  )
  recipeIngredients: RecipeIngredient[];

  @ManyToMany(() => Subject, (subject) => subject.recipes)
  subjects: Subject[];
}
