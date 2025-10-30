import { ApiProperty } from '@nestjs/swagger';

/**
 * Single row in the inventory balance report
 */
export class InventoryBalanceRowDto {
  @ApiProperty({ description: 'Item ID' })
  itemId: string;

  @ApiProperty({ description: 'Item code' })
  itemCode: string;

  @ApiProperty({ description: 'Item description' })
  itemDescription: string;

  @ApiProperty({ description: 'Warehouse ID' })
  warehouseId: string;

  @ApiProperty({ description: 'Warehouse code' })
  warehouseCode: string;

  @ApiProperty({ description: 'Warehouse description' })
  warehouseDescription: string;

  @ApiProperty({ description: 'Opening balance quantity' })
  openingQuantity: number;

  @ApiProperty({ description: 'Opening balance amount' })
  openingAmount: number;

  @ApiProperty({ description: 'Receipt quantity during period' })
  receiptQuantity: number;

  @ApiProperty({ description: 'Receipt amount during period' })
  receiptAmount: number;

  @ApiProperty({ description: 'Expense quantity during period' })
  expenseQuantity: number;

  @ApiProperty({ description: 'Expense amount during period' })
  expenseAmount: number;

  @ApiProperty({ description: 'Closing balance quantity' })
  closingQuantity: number;

  @ApiProperty({ description: 'Closing balance amount' })
  closingAmount: number;

  @ApiProperty({ description: 'Average cost per unit' })
  averageCost: number;

  @ApiProperty({ description: 'Unit of measure' })
  unitOfMeasure: string;
}

/**
 * Complete inventory balance report response
 */
export class InventoryBalanceReportDto {
  @ApiProperty({ type: [InventoryBalanceRowDto] })
  data: InventoryBalanceRowDto[];

  @ApiProperty({
    description: 'Report configuration used',
    type: 'object',
  })
  config: any;

  @ApiProperty({ description: 'Report generation timestamp' })
  generatedAt: Date;

  @ApiProperty({
    description: 'Pagination info',
    type: 'object',
  })
  pagination?: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };

  @ApiProperty({
    description: 'Summary totals',
    type: 'object',
  })
  summary: {
    totalItems: number;
    totalOpeningQuantity: number;
    totalOpeningAmount: number;
    totalReceiptQuantity: number;
    totalReceiptAmount: number;
    totalExpenseQuantity: number;
    totalExpenseAmount: number;
    totalClosingQuantity: number;
    totalClosingAmount: number;
  };
}

/**
 * Drill-down data showing source documents
 */
export class InventoryBalanceDrillDownDto {
  @ApiProperty({ description: 'Item ID' })
  itemId: string;

  @ApiProperty({ description: 'Item description' })
  itemDescription: string;

  @ApiProperty({ description: 'Warehouse ID' })
  warehouseId: string;

  @ApiProperty({ description: 'Warehouse description' })
  warehouseDescription: string;

  @ApiProperty({
    description: 'List of movements',
    type: 'array',
  })
  movements: {
    id: string;
    date: Date;
    recorder: string;
    recordType: string;
    quantity: number;
    amount: number;
    movementType: string;
    runningBalance: number;
  }[];

  @ApiProperty({ description: 'Current balance' })
  currentBalance: number;
}
