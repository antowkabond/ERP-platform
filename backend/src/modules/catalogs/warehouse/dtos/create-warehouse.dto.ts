import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({ description: 'Unique warehouse code', example: 'WH001' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Warehouse name', example: 'Main Warehouse' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Parent warehouse ID for hierarchy' })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({ description: 'Physical address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Responsible person name' })
  @IsOptional()
  @IsString()
  responsiblePerson?: string;

  @ApiPropertyOptional({ description: 'Is this the default warehouse?', default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
