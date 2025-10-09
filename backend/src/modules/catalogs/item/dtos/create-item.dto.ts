import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateItemDto {
  @ApiProperty({ description: 'Unique item code', example: 'ITEM001' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Item name/description', example: 'Laptop Dell XPS 15' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Parent item ID for hierarchy' })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({ description: 'Unit of measure', example: 'pcs', default: 'pcs' })
  @IsOptional()
  @IsString()
  unitOfMeasure?: string;

  @ApiPropertyOptional({ description: 'SKU code' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ description: 'Barcode' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({ description: 'Is inventory item?', default: true })
  @IsOptional()
  @IsBoolean()
  isInventory?: boolean;

  @ApiPropertyOptional({ description: 'Is service item?', default: false })
  @IsOptional()
  @IsBoolean()
  isService?: boolean;

  @ApiPropertyOptional({ description: 'Default sale price', example: 999.99 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  defaultPrice?: number;

  @ApiPropertyOptional({ description: 'Cost price', example: 750.00 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costPrice?: number;

  @ApiPropertyOptional({ description: 'Minimum stock quantity', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minimumQuantity?: number;
}
