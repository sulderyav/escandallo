import {
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsPositive,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { i18nValidationMessage as t } from 'nestjs-i18n';

import { IsSlug } from 'src/utils/Validators';

export class CreateLevelDto {
  @IsString({
    message: t('lang.IS_STRING', {
      field: 'slug',
      entity: 'level',
    }),
  })
  @MaxLength(100, {
    message: t('lang.MAX_LENGTH', {
      field: 'slug',
      length: '100',
    }),
  })
  @IsSlug({
    message: t('lang.IS_SLUG', {
      field: 'slug',
      entity: 'level',
    }),
  })
  @ApiProperty()
  readonly slug: string;

  @IsString({
    message: t('lang.IS_STRING', {
      field: 'name',
      entity: 'level',
    }),
  })
  @MaxLength(100, {
    message: t('lang.MAX_LENGTH', {
      field: 'name',
      length: '100',
    }),
  })
  @ApiProperty()
  readonly name: string;

  @IsPositive({
    message: t('lang.IS_POSITIVE', {
      field: 'careerId',
      entity: 'level',
    }),
  })
  @ApiProperty()
  readonly careerId: number;
}
