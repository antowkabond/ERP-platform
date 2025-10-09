import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsDate, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { MovementType } from '../../../../../app/enums';

export class InventoryMovementDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  recorder: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  recordType: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  warehouseId: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: MovementType })
  @IsEnum(MovementType)
  movementType: MovementType;
}

export class InventoryMovementFiltersDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  itemId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  warehouseId?: string;

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
}

export class InventoryMovementResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  recorder: string;

  @ApiProperty()
  recordType: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  itemId: string;

  @ApiProperty({ required: false })
  item?: {
    code: string;
    description: string;
  };

  @ApiProperty()
  warehouseId: string;

  @ApiProperty({ required: false })
  warehouse?: {
    code: string;
    description: string;
  };

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: MovementType })
  movementType: MovementType;

  @ApiProperty()
  createdAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.recorder = data.recorder;
    this.recordType = data.recordType;
    this.date = data.date;
    this.itemId = data.itemId;
    this.warehouseId = data.warehouseId;
    this.quantity = Number(data.quantity);
    this.amount = Number(data.amount);
    this.movementType = data.movementType;
    this.createdAt = data.createdAt;

    if (data.item) {
      this.item = {
        code: data.item.code,
        description: data.item.description,
      };
    }

    if (data.warehouse) {
      this.warehouse = {
        code: data.warehouse.code,
        description: data.warehouse.description,
      };
    }
  }
}
