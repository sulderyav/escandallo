import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { RecipeIngredientsModule } from './recipe-ingredients/recipe-ingredients.module';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService],
  imports: [RecipeIngredientsModule],
})
export class RecipesModule {}
