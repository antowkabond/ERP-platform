import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateGoodsSaleItemDto } from './create-goods-sale-item.dto';

export class CreateGoodsSaleDto {
  @ApiProperty({ description: 'Document date', example: '2025-01-09T12:00:00Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Counterparty (customer) ID' })
  @IsString()
  @IsNotEmpty()
  counterpartyId: string;

  @ApiProperty({ description: 'Warehouse ID' })
  @IsString()
  @IsNotEmpty()
  warehouseId: string;

  @ApiProperty({ description: 'Document items', type: [CreateGoodsSaleItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateGoodsSaleItemDto)
  items: CreateGoodsSaleItemDto[];
}
