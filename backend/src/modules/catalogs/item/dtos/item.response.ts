import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Item } from '@prisma/client';

export class ItemResponse {
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

  @ApiProperty()
  unitOfMeasure: string;

  @ApiPropertyOptional()
  sku?: string;

  @ApiPropertyOptional()
  barcode?: string;

  @ApiProperty()
  isInventory: boolean;

  @ApiProperty()
  isService: boolean;

  @ApiPropertyOptional()
  defaultPrice?: number;

  @ApiPropertyOptional()
  costPrice?: number;

  @ApiPropertyOptional()
  minimumQuantity?: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(data: Item) {
    this.id = data.id;
    this.code = data.code;
    this.description = data.description;
    this.isFolder = data.isFolder;
    this.parentId = data.parentId;
    this.unitOfMeasure = data.unitOfMeasure;
    this.sku = data.sku;
    this.barcode = data.barcode;
    this.isInventory = data.isInventory;
    this.isService = data.isService;
    this.defaultPrice = data.defaultPrice ? Number(data.defaultPrice) : null;
    this.costPrice = data.costPrice ? Number(data.costPrice) : null;
    this.minimumQuantity = data.minimumQuantity ? Number(data.minimumQuantity) : null;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
