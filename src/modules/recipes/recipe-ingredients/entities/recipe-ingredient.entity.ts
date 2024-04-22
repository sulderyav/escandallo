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
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Recipe } from '../../entities/recipe.entity';
import { Ingredient } from '../../../ingredients/ingredient.entity';

@Entity('recipe_ingredients')
export class RecipeIngredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  grossWeight: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  netWeight: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  waste: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  outputPercentage: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  wastePercentage: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  outputCost: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  wasteCost: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  totalCost: number;

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

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipeIngredients)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;
}
