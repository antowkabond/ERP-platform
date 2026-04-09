import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GoodsSale, GoodsSaleItem, DocumentState } from '@prisma/client';

export class GoodsSaleItemResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  lineNumber: number;

  @ApiProperty()
  itemId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  amount: number;

  constructor(data: GoodsSaleItem) {
    this.id = data.id;
    this.lineNumber = data.lineNumber;
    this.itemId = data.itemId;
    this.quantity = Number(data.quantity);
    this.price = Number(data.price);
    this.amount = Number(data.amount);
  }
}

export class GoodsSaleResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  number: string;

  @ApiProperty()
  date: Date;

  @ApiProperty({ enum: DocumentState })
  state: DocumentState;

  @ApiPropertyOptional()
  postedAt?: Date;

  @ApiProperty()
  counterpartyId: string;

  @ApiProperty()
  warehouseId: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ type: [GoodsSaleItemResponse] })
  items: GoodsSaleItemResponse[];

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(data: GoodsSale & { items?: GoodsSaleItem[] }) {
    this.id = data.id;
    this.number = data.number;
    this.date = data.date;
    this.state = data.state;
    this.postedAt = data.postedAt;
    this.counterpartyId = data.counterpartyId;
    this.warehouseId = data.warehouseId;
    this.totalAmount = Number(data.totalAmount);
    this.items = data.items ? data.items.map(item => new GoodsSaleItemResponse(item)) : [];
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
