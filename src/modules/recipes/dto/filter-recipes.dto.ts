import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { i18nValidationMessage as t } from 'nestjs-i18n';

import { ToBoolean } from 'src/utils/ToBoolean';
import { PaginationOptionsDto } from '../../../utils/pagination.dto';

export class FilterRecipesDto extends PaginationOptionsDto {
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

  @IsOptional()
  @ApiProperty()
  readonly userId?: number;

  @IsOptional()
  @ApiProperty()
  readonly filterByCurrentLevels?: boolean;
}
