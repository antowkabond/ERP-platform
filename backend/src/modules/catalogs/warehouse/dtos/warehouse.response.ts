import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Warehouse } from '@prisma/client';

export class WarehouseResponse {
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
  address?: string;

  @ApiPropertyOptional()
  responsiblePerson?: string;

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(data: Warehouse) {
    this.id = data.id;
    this.code = data.code;
    this.description = data.description;
    this.isFolder = data.isFolder;
    this.parentId = data.parentId;
    this.address = data.address;
    this.responsiblePerson = data.responsiblePerson;
    this.isDefault = data.isDefault;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
