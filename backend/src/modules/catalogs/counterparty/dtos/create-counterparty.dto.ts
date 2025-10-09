import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCounterpartyDto {
  @ApiProperty({ description: 'Unique code for counterparty', example: 'CUST001' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Counterparty name', example: 'ABC Corporation' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Parent counterparty ID for hierarchy' })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({ description: 'Tax identification number' })
  @IsOptional()
  @IsString()
  taxNumber?: string;

  @ApiPropertyOptional({ description: 'Physical address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Contact phone number' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'Contact email' })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Is this a customer?', default: true })
  @IsOptional()
  @IsBoolean()
  isCustomer?: boolean;

  @ApiPropertyOptional({ description: 'Is this a supplier?', default: false })
  @IsOptional()
  @IsBoolean()
  isSupplier?: boolean;

  @ApiPropertyOptional({ description: 'Credit limit amount' })
  @IsOptional()
  @Type(() => Number)
  creditLimit?: number;
}
