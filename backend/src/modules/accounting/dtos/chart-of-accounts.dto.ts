import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { AccountType } from '@prisma/client';

export class CreateChartOfAccountsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: AccountType })
  @IsEnum(AccountType)
  accountType: AccountType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class UpdateChartOfAccountsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, enum: AccountType })
  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class ChartOfAccountsResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: AccountType })
  accountType: string;

  @ApiProperty({ required: false })
  description?: string | null;

  @ApiProperty({ required: false })
  parentId?: string | null;

  @ApiProperty()
  isActive: boolean;

  constructor(data: any) {
    this.id = data.id;
    this.code = data.code;
    this.name = data.name;
    this.accountType = data.accountType;
    this.description = data.description;
    this.parentId = data.parentId;
    this.isActive = data.isActive;
  }
}
