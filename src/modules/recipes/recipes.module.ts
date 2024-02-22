import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Recipe } from './entities/recipe.entity';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { RecipeIngredientsModule } from './recipe-ingredients/recipe-ingredients.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe]), RecipeIngredientsModule],
  providers: [RecipesService],
  controllers: [RecipesController],
})
export class RecipesModule {}
