import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AccountingEntryFiltersDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateFrom?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateTo?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  debitAccountId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  creditAccountId?: string;
}

export class AccountingEntryResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  recorder: string;

  @ApiProperty()
  recordType: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  debitAccountId: string;

  @ApiProperty({ required: false })
  debitAccount?: {
    code: string;
    description: string;
    accountType: string;
  };

  @ApiProperty()
  creditAccountId: string;

  @ApiProperty({ required: false })
  creditAccount?: {
    code: string;
    description: string;
    accountType: string;
  };

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty({ required: false })
  description?: string | null;

  @ApiProperty()
  createdAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.recorder = data.recorder;
    this.recordType = data.recordType;
    this.date = data.date;
    this.debitAccountId = data.debitAccountId;
    this.creditAccountId = data.creditAccountId;
    this.amount = Number(data.amount);
    this.currency = data.currency;
    this.description = data.description;
    this.createdAt = data.createdAt;

    if (data.debitAccount) {
      this.debitAccount = {
        code: data.debitAccount.code,
        description: data.debitAccount.description,
        accountType: data.debitAccount.accountType,
      };
    }

    if (data.creditAccount) {
      this.creditAccount = {
        code: data.creditAccount.code,
        description: data.creditAccount.description,
        accountType: data.creditAccount.accountType,
      };
    }
  }
}
