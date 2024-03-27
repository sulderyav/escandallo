import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { RecipeIngredientsService } from './recipe-ingredients.service';
import { RecipeIngredientsController } from './recipe-ingredients.controller';
import { RecipesModule } from '../recipes.module';
import { IngredientsModule } from '../../ingredients/ingredients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecipeIngredient]),
    forwardRef(() => RecipesModule),
    forwardRef(() => IngredientsModule),
  ],
  controllers: [RecipeIngredientsController],
  providers: [RecipeIngredientsService],
})
export class RecipeIngredientsModule {}
