import {
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsUrl,
  IsEnum,
  Min,
  IsPositive,
  IsInt,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { i18nValidationMessage as t } from 'nestjs-i18n';
import { PaginationOptionsDto } from '../../utils/pagination.dto';
import { MeassurementType } from './ingredient.entity';
import { ToBoolean } from 'src/utils/ToBoolean';

export class CreateIngredientDto {
  @IsString({
    message: t('lang.IS_STRING', {
      field: 'slug',
      entity: 'ingredient',
    }),
  })
  @ApiProperty()
  readonly slug: string;

  @IsOptional()
  @IsString({
    message: t('lang.IS_STRING', {
      field: 'image',
      entity: 'ingredient',
    }),
  })
  @IsUrl(
    {},
    {
      message: t('lang.IS_URL', {
        field: 'image',
        entity: 'ingredient',
      }),
    },
  )
  @ApiProperty()
  readonly image?: string;

  @IsString({
    message: t('lang.IS_STRING', {
      field: 'name',
      entity: 'ingredient',
    }),
  })
  @ApiProperty()
  readonly name: string;

  @IsOptional()
  @IsString({
    message: t('lang.IS_STRING', {
      field: 'description',
      entity: 'ingredient',
    }),
  })
  @MaxLength(1024, {
    message: t('lang.MAX_LENGTH', {
      field: 'description',
      length: 1024,
      entity: 'ingredient',
    }),
  })
  @ApiProperty()
  readonly description?: string;

  @IsEnum(MeassurementType, {
    message: t('lang.IS_ENUM', {
      field: 'meassurementType',
      entity: 'ingredient',
      enum: Object.keys(MeassurementType),
    }),
  })
  @ApiProperty()
  readonly meassurementType: MeassurementType;

  // @Min(0, {
  //   message: t('lang.MIN', {
  //     field: 'cost',
  //     value: 0,
  //     entity: 'ingredient',
  //   }),
  // })
  // @ApiProperty()
  // readonly cost: number;

  @Min(0, {
    message: t('lang.MIN', {
      field: 'unitPrice',
      value: 0,
      entity: 'ingredient',
    }),
  })
  @ApiProperty()
  readonly unitPrice: number;

  @IsPositive({
    message: t('lang.IS_POSITIVE', {
      field: 'createdById',
      entity: 'ingredient',
    }),
  })
  @IsInt({
    message: t('lang.IS_INT', {
      field: 'createdById',
      entity: 'ingredient',
    }),
  })
  @ApiProperty()
  readonly createdById: number;
}

export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {}

export class FilterIngredientsDto extends PaginationOptionsDto {
  @IsOptional()
  @ToBoolean()
  @IsBoolean({
    message: t('lang.IS_BOOLEAN', {
      field: 'ignorePagination',
      entity: 'ingredient',
    }),
  })
  @ApiProperty()
  readonly ignorePagination?: boolean;
}
