import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage as t } from 'nestjs-i18n';

import { ToBoolean } from 'src/utils/ToBoolean';
import { PaginationOptionsDto } from '../../../utils/pagination.dto';

export class FilterSubjectsDto extends PaginationOptionsDto {
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
