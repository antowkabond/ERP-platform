import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGoodsSaleItemDto {
  @ApiProperty({ description: 'Item ID' })
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({ description: 'Quantity', example: 10 })
  @Type(() => Number)
  @IsNumber()
  @Min(0.001)
  quantity: number;

  @ApiProperty({ description: 'Price per unit', example: 99.99 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;
}
