import {
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsUrl,
  Min,
  IsInt,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { i18nValidationMessage as t } from 'nestjs-i18n';

export class CreateRecipeDto {
  @IsString({
    message: t('lang.IS_STRING', {
      field: 'slug',
      entity: 'recipe',
    }),
  })
  @MaxLength(50, {
    message: t('lang.MAX_LENGTH', {
      field: 'slug',
      length: '50',
    }),
  })
  @ApiProperty()
  readonly slug: string;

  @IsString({
    message: t('lang.IS_STRING', {
      field: 'name',
      entity: 'recipe',
    }),
  })
  @MaxLength(120, {
    message: t('lang.MAX_LENGTH', {
      field: 'name',
      length: '120',
    }),
  })
  @ApiProperty()
  readonly name: string;

  @IsUrl(
    {},
    {
      message: t('lang.IS_URL', {
        field: 'coverImage',
        entity: 'recipe',
      }),
    },
  )
  @ApiProperty()
  readonly coverImage: string;

  @IsString({
    message: t('lang.IS_STRING', {
      field: 'steps',
      entity: 'recipe',
    }),
  })
  @ApiProperty()
  readonly steps: string;

  @Min(1, {
    message: t('lang.MIN', {
      field: 'portions',
      value: '1',
    }),
  })
  @IsInt({
    message: t('lang.IS_INT', {
      field: 'portions',
      entity: 'recipe',
    }),
  })
  @ApiProperty()
  readonly portions: number;
}
