import {
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  Min,
  IsPositive,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { i18nValidationMessage as t } from 'nestjs-i18n';

//   @IsBoolean({
//     message: t('lang.IS_BOOLEAN', {
//       field: 'isActive',
//       entity: 'vehicle',
//     }),
//   })

//   @IsString({
//     message: t('lang.IS_STRING', {
//       field: 'licensePlate',
//       entity: 'vehicle',
//     }),
//   })

export class CreateRecipeIngredientDto {
  @Min(0, {
    message: t('lang.MIN', {
      field: 'quantity',
      entity: 'recipeIngredient',
      min: 0,
    }),
  })
  @ApiProperty()
  readonly quantity: number;

  @IsPositive({
    message: t('lang.IS_POSITIVE', {
      field: 'recipeId',
      entity: 'recipeIngredient',
    }),
  })
  @ApiProperty()
  readonly recipeId: number;

  @IsPositive({
    message: t('lang.IS_POSITIVE', {
      field: 'ingredientId',
      entity: 'recipeIngredient',
    }),
  })
  @ApiProperty()
  readonly ingredientId: number;
}
