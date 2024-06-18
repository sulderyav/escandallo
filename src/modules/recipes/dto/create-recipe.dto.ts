import {
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsUrl,
  Min,
  IsInt,
  IsPositive,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { i18nValidationMessage as t } from 'nestjs-i18n';
import { IsSlug } from 'src/utils/Validators';

export class CreateRecipeDto {
  @IsSlug({
    message: t('lang.IS_SLUG', {
      field: 'slug',
      entity: 'recipe',
    }),
  })
  @IsString({
    message: t('lang.IS_STRING', {
      field: 'slug',
      entity: 'recipe',
    }),
  })
  @MaxLength(50, {
    message: t('lang.MAX_LENGTH', {
      field: 'slug',
      entity: 'recipe',
      max: '50',
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

  @IsOptional()
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
  readonly coverImage?: string;

  @IsString({
    message: t('lang.IS_STRING', {
      field: 'steps',
      entity: 'recipe',
    }),
  })
  @ApiProperty()
  readonly steps: string;

  @IsOptional()
  @IsUrl(
    {},
    {
      message: t('lang.IS_URL', {
        field: 'video',
        entity: 'recipe',
      }),
    },
  )
  @ApiProperty()
  readonly video?: string;

  @Min(1, {
    message: t('lang.MIN', {
      field: 'portions',
      entity: 'recipe',
      min: '1',
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

  @IsPositive({
    message: t('lang.IS_POSITIVE', {
      field: 'createdById',
      entity: 'recipe',
    }),
  })
  @IsInt({
    message: t('lang.IS_INT', {
      field: 'createdById',
      entity: 'recipe',
    }),
  })
  @ApiProperty()
  readonly createdById: number;

  @IsOptional()
  @IsPositive({
    message: t('lang.IS_POSITIVE', {
      field: 'subjectIds',
      entity: 'recipe',
    }),
    each: true,
  })
  @ApiProperty()
  readonly subjectIds?: number[];
}
