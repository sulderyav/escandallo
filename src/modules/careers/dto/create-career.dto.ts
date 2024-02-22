import {
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { i18nValidationMessage as t } from 'nestjs-i18n';

import { CareerMode } from '../entities/career.entity';
import { IsSlug } from 'src/utils/Validators';

export class CreateCareerDto {
  @IsString({
    message: t('lang.IS_STRING', {
      field: 'slug',
      entity: 'career',
    }),
  })
  @IsSlug({
    message: t('lang.IS_SLUG', {
      field: 'slug',
      entity: 'career',
    }),
  })
  @MaxLength(100, {
    message: t('lang.MAX_LENGTH', {
      field: 'slug',
      length: '100',
    }),
  })
  @ApiProperty()
  readonly slug: string;

  @IsString({
    message: t('lang.IS_STRING', {
      field: 'name',
      entity: 'career',
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

  @IsOptional()
  @IsString({
    message: t('lang.IS_STRING', {
      field: 'description',
      entity: 'career',
    }),
  })
  @MaxLength(255, {
    message: t('lang.MAX_LENGTH', {
      field: 'description',
      length: '255',
    }),
  })
  @ApiProperty()
  readonly description?: string;

  @IsEnum(CareerMode, {
    message: t('lang.IS_ENUM', {
      field: 'mode',
      entity: 'career',
    }),
  })
  @ApiProperty()
  readonly mode: CareerMode;
}
