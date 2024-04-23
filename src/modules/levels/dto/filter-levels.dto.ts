import { ApiProperty } from '@nestjs/swagger';
import { PaginationOptionsDto } from '../../../utils/pagination.dto';
import { IsBoolean, IsObject, IsOptional } from 'class-validator';
import { ToBoolean } from 'src/utils/ToBoolean';

export class FilterLevelsDto extends PaginationOptionsDto {
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  @ApiProperty()
  readonly ignorePagination?: boolean;
}
