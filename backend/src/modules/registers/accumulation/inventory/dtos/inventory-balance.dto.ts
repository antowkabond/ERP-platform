import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class InventoryBalanceFiltersDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  itemId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  warehouseId?: string;

  @ApiProperty({ required: false, description: 'Calculate balance as of this date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  asOfDate?: Date;

  @ApiProperty({ required: false, description: 'Only show balances above this quantity' })
  @IsOptional()
  @IsNumber()
  minQuantity?: number;
}

export class InventoryBalanceResponse {
  @ApiProperty()
  itemId: string;

  @ApiProperty()
  itemCode: string;

  @ApiProperty()
  itemDescription: string;

  @ApiProperty()
  warehouseId: string;

  @ApiProperty()
  warehouseCode: string;

  @ApiProperty()
  warehouseDescription: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  amount: number;

  constructor(data: any) {
    this.itemId = data.itemId;
    this.itemCode = data.itemCode;
    this.itemDescription = data.itemDescription;
    this.warehouseId = data.warehouseId;
    this.warehouseCode = data.warehouseCode;
    this.warehouseDescription = data.warehouseDescription;
    this.quantity = Number(data.quantity);
    this.amount = Number(data.amount);
  }
}
