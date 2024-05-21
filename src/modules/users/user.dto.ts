import {
  IsString,
  IsUrl,
  IsOptional,
  MaxLength,
  IsEmail,
  IsPositive,
  Min,
  IsDate,
  IsEnum,
  Matches,
  IsBoolean,
  Max,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { i18nValidationMessage as t } from 'nestjs-i18n';

export class CreateUserDto {
  @IsString({
    message: t('lang.IS_STRING', {
      field: 'firstName',
      entity: 'user',
    }),
  })
  @ApiProperty()
  readonly firstName: string;

  @IsString({
    message: t('lang.IS_STRING', {
      field: 'lastName',
      entity: 'user',
    }),
  })
  @ApiProperty()
  readonly lastName: string;

  @IsOptional()
  @IsUrl(
    {},
    {
      message: t('lang.IS_URL', {
        field: 'avatar',
        entity: 'user',
      }),
    },
  )
  @ApiProperty()
  readonly avatar?: string;

  @IsEmail(
    {},
    {
      message: t('lang.IS_EMAIL', {
        field: 'email',
        entity: 'user',
      }),
    },
  )
  @ApiProperty()
  readonly email: string;

  @IsString({
    message: t('lang.IS_STRING', {
      field: 'mobile',
      entity: 'user',
    }),
  })
  @ApiProperty()
  readonly mobile: string;

  @IsString({
    message: t('lang.IS_STRING', {
      field: 'password',
      entity: 'user',
    }),
  })
  @ApiProperty()
  readonly password: string;

  @IsString({
    message: t('lang.IS_STRING', {
      field: 'username',
      entity: 'user',
    }),
  })
  @ApiProperty()
  readonly username: string;

  @IsOptional()
  @IsBoolean({
    message: t('lang.IS_BOOLEAN', {
      field: 'isActive',
      entity: 'user',
    }),
  })
  readonly isActive?: boolean;

  @IsPositive({
    message: t('lang.IS_POSITIVE', {
      field: 'rolesId',
      entity: 'user',
    }),
    each: true,
  })
  readonly roleIds: number[];

  // readonly registerDate: Date;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
