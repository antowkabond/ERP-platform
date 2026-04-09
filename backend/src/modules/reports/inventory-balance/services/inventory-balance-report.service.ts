import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';
import { BaseReportService } from '../../base/base-report.service';
import {
  InventoryBalanceConfigDto,
  InventoryBalanceReportDto,
  InventoryBalanceDrillDownDto,
  InventoryBalanceRowDto,
} from '../dtos';
import { MovementType } from '../../../../app/enums';
import * as ExcelJS from 'exceljs';

@Injectable()
export class InventoryBalanceReportService extends BaseReportService<
  InventoryBalanceConfigDto,
  InventoryBalanceReportDto,
  InventoryBalanceDrillDownDto
> {
  protected readonly logger = new Logger(InventoryBalanceReportService.name);
  protected readonly reportName = 'InventoryBalance';

  constructor(protected readonly prisma: PrismaService) {
    super();
  }

  /**
   * Generate inventory balance report
   */
  protected async generateReportData(
    config: InventoryBalanceConfigDto,
  ): Promise<InventoryBalanceReportDto> {
    this.logger.log('Generating inventory balance report with config:', JSON.stringify(config));

    const dateFrom = config.dateFrom ? new Date(config.dateFrom) : new Date('2000-01-01');
    const dateTo = config.dateTo ? new Date(config.dateTo) : new Date();
    const minimumQuantity = config.minimumQuantity ?? 0;
    const showOnlyNonZero = config.showOnlyNonZero ?? true;

    // Build filters for movements query
    const movementFilters: any = {
      date: { lte: dateTo },
    };

    if (config.itemId) {
      movementFilters.itemId = config.itemId;
    }

    if (config.warehouseId) {
      movementFilters.warehouseId = config.warehouseId;
    }

    // Get all movements up to the end date
    const movements = await this.prisma.inventoryRegister.findMany({
      where: movementFilters,
      include: {
        item: true,
        warehouse: true,
      },
      orderBy: [{ itemId: 'asc' }, { warehouseId: 'asc' }, { date: 'asc' }],
    });

    // Group movements by item and warehouse
    const balanceMap = new Map<string, InventoryBalanceRowDto>();

    for (const movement of movements) {
      const key = `${movement.itemId}-${movement.warehouseId}`;
      
      if (!balanceMap.has(key)) {
        balanceMap.set(key, {
          itemId: movement.itemId,
          itemCode: movement.item.code,
          itemDescription: movement.item.description,
          warehouseId: movement.warehouseId,
          warehouseCode: movement.warehouse.code,
          warehouseDescription: movement.warehouse.description,
          openingQuantity: 0,
          openingAmount: 0,
          receiptQuantity: 0,
          receiptAmount: 0,
          expenseQuantity: 0,
          expenseAmount: 0,
          closingQuantity: 0,
          closingAmount: 0,
          averageCost: 0,
          unitOfMeasure: movement.item.unitOfMeasure,
        });
      }

      const row = balanceMap.get(key)!;
      const quantity = Number(movement.quantity);
      const amount = Number(movement.amount);

      // Check if movement is before period start (opening balance)
      if (movement.date < dateFrom) {
        row.openingQuantity += quantity;
        row.openingAmount += amount;
      } else {
        // Movement is within the period
        if (movement.movementType === MovementType.RECEIPT) {
          row.receiptQuantity += quantity;
          row.receiptAmount += amount;
        } else if (movement.movementType === MovementType.EXPENSE) {
          row.expenseQuantity += Math.abs(quantity);
          row.expenseAmount += Math.abs(amount);
        }
      }
    }

    // Calculate closing balances and average costs
    const rows: InventoryBalanceRowDto[] = [];
    for (const row of balanceMap.values()) {
      row.closingQuantity = row.openingQuantity + row.receiptQuantity - row.expenseQuantity;
      row.closingAmount = row.openingAmount + row.receiptAmount - row.expenseAmount;
      row.averageCost = row.closingQuantity > 0 ? row.closingAmount / row.closingQuantity : 0;

      // Apply filters
      if (showOnlyNonZero && row.closingQuantity === 0) {
        continue;
      }

      if (row.closingQuantity < minimumQuantity) {
        continue;
      }

      rows.push(row);
    }

    // Sort by item code, warehouse code
    rows.sort((a, b) => {
      const itemCompare = a.itemCode.localeCompare(b.itemCode);
      if (itemCompare !== 0) return itemCompare;
      return a.warehouseCode.localeCompare(b.warehouseCode);
    });

    // Calculate summary
    const summary = {
      totalItems: rows.length,
      totalOpeningQuantity: rows.reduce((sum, r) => sum + r.openingQuantity, 0),
      totalOpeningAmount: rows.reduce((sum, r) => sum + r.openingAmount, 0),
      totalReceiptQuantity: rows.reduce((sum, r) => sum + r.receiptQuantity, 0),
      totalReceiptAmount: rows.reduce((sum, r) => sum + r.receiptAmount, 0),
      totalExpenseQuantity: rows.reduce((sum, r) => sum + r.expenseQuantity, 0),
      totalExpenseAmount: rows.reduce((sum, r) => sum + r.expenseAmount, 0),
      totalClosingQuantity: rows.reduce((sum, r) => sum + r.closingQuantity, 0),
      totalClosingAmount: rows.reduce((sum, r) => sum + r.closingAmount, 0),
    };

    // Apply pagination
    const page = config.page || 1;
    const perPage = config.perPage || 50;
    const paginatedResult = this.applyPagination(rows, page, perPage);

    return {
      data: paginatedResult.data,
      config,
      generatedAt: new Date(),
      pagination: paginatedResult.pagination,
      summary,
    };
  }

  /**
   * Drill down to see source documents for a specific item/warehouse
   */
  protected async generateDrillDownData(
    config: InventoryBalanceConfigDto,
    dimensions: { itemId: string; warehouseId: string },
  ): Promise<InventoryBalanceDrillDownDto> {
    this.logger.log('Drilling down for item:', dimensions.itemId, 'warehouse:', dimensions.warehouseId);

    const dateTo = config.dateTo ? new Date(config.dateTo) : new Date();

    // Get all movements for this item/warehouse combination
    const movements = await this.prisma.inventoryRegister.findMany({
      where: {
        itemId: dimensions.itemId,
        warehouseId: dimensions.warehouseId,
        date: { lte: dateTo },
      },
      include: {
        item: true,
        warehouse: true,
      },
      orderBy: { date: 'asc' },
    });

    // Calculate running balance
    let runningBalance = 0;
    const movementDetails = movements.map((m) => {
      const quantity = Number(m.quantity);
      runningBalance += quantity;

      return {
        id: m.id,
        date: m.date,
        recorder: m.recorder,
        recordType: m.recordType,
        quantity,
        amount: Number(m.amount),
        movementType: m.movementType,
        runningBalance,
      };
    });

    const item = movements[0]?.item;
    const warehouse = movements[0]?.warehouse;

    return {
      itemId: dimensions.itemId,
      itemDescription: item?.description || 'Unknown Item',
      warehouseId: dimensions.warehouseId,
      warehouseDescription: warehouse?.description || 'Unknown Warehouse',
      movements: movementDetails,
      currentBalance: runningBalance,
    };
  }

  /**
   * Export report to Excel
   */
  protected async generateExcelBuffer(report: {
    config: InventoryBalanceConfigDto;
    data: InventoryBalanceReportDto;
    generatedAt: Date;
  }): Promise<Buffer> {
    this.logger.log('Generating Excel export');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory Balance');

    // Add title
    worksheet.mergeCells('A1:N1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Inventory Balance Report';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center' };

    // Add metadata
    worksheet.getCell('A2').value = 'Generated At:';
    worksheet.getCell('B2').value = report.generatedAt.toLocaleString();
    worksheet.getCell('A3').value = 'Date Range:';
    worksheet.getCell('B3').value = `${report.config.dateFrom || 'Beginning'} to ${report.config.dateTo || 'Now'}`;

    // Add headers (row 5)
    const headers = [
      'Item Code',
      'Item Description',
      'Warehouse',
      'Opening Qty',
      'Opening Amt',
      'Receipt Qty',
      'Receipt Amt',
      'Expense Qty',
      'Expense Amt',
      'Closing Qty',
      'Closing Amt',
      'Avg Cost',
      'Unit',
    ];

    worksheet.getRow(5).values = headers;
    worksheet.getRow(5).font = { bold: true };
    worksheet.getRow(5).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' },
    };

    // Add data
    let rowNum = 6;
    for (const row of report.data.data) {
      worksheet.getRow(rowNum).values = [
        row.itemCode,
        row.itemDescription,
        row.warehouseCode,
        row.openingQuantity,
        row.openingAmount,
        row.receiptQuantity,
        row.receiptAmount,
        row.expenseQuantity,
        row.expenseAmount,
        row.closingQuantity,
        row.closingAmount,
        row.averageCost,
        row.unitOfMeasure,
      ];
      rowNum++;
    }

    // Add summary row
    rowNum++;
    worksheet.getRow(rowNum).values = [
      'TOTAL',
      '',
      '',
      report.data.summary.totalOpeningQuantity,
      report.data.summary.totalOpeningAmount,
      report.data.summary.totalReceiptQuantity,
      report.data.summary.totalReceiptAmount,
      report.data.summary.totalExpenseQuantity,
      report.data.summary.totalExpenseAmount,
      report.data.summary.totalClosingQuantity,
      report.data.summary.totalClosingAmount,
      '',
      '',
    ];
    worksheet.getRow(rowNum).font = { bold: true };

    // Format number columns
    for (let i = 4; i <= 12; i++) {
      worksheet.getColumn(i).numFmt = '#,##0.00';
    }

    // Auto-fit columns
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: false }, (cell) => {
        const cellLength = cell.value ? cell.value.toString().length : 10;
        if (cellLength > maxLength) {
          maxLength = cellLength;
        }
      });
      column.width = Math.min(maxLength + 2, 50);
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  /**
   * Export report to PDF
   */
  protected async generatePdfBuffer(report: {
    config: InventoryBalanceConfigDto;
    data: InventoryBalanceReportDto;
    generatedAt: Date;
  }): Promise<Buffer> {
    // For now, throw error - PDF generation can be added later with pdfkit
    throw new Error('PDF export not yet implemented. Use Excel export instead.');
  }
}
