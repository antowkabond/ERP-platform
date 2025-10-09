import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Counterparty } from '@prisma/client';

export class CounterpartyResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isFolder: boolean;

  @ApiPropertyOptional()
  parentId?: string;

  @ApiPropertyOptional()
  taxNumber?: string;

  @ApiPropertyOptional()
  address?: string;

  @ApiPropertyOptional()
  contactPhone?: string;

  @ApiPropertyOptional()
  contactEmail?: string;

  @ApiProperty()
  isCustomer: boolean;

  @ApiProperty()
  isSupplier: boolean;

  @ApiPropertyOptional()
  creditLimit?: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(data: Counterparty) {
    this.id = data.id;
    this.code = data.code;
    this.description = data.description;
    this.isFolder = data.isFolder;
    this.parentId = data.parentId;
    this.taxNumber = data.taxNumber;
    this.address = data.address;
    this.contactPhone = data.contactPhone;
    this.contactEmail = data.contactEmail;
    this.isCustomer = data.isCustomer;
    this.isSupplier = data.isSupplier;
    this.creditLimit = data.creditLimit ? Number(data.creditLimit) : null;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
