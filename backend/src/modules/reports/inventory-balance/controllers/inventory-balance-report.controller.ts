import {
  Controller,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Header,
  StreamableFile,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InventoryBalanceReportService } from '../services/inventory-balance-report.service';
import {
  InventoryBalanceConfigDto,
  InventoryBalanceReportDto,
  InventoryBalanceDrillDownDto,
} from '../dtos';

@ApiTags('Reports - Inventory Balance')
@Controller('api/v1/reports/inventory-balance')
export class InventoryBalanceReportController {
  private readonly logger = new Logger(InventoryBalanceReportController.name);

  constructor(private readonly reportService: InventoryBalanceReportService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate inventory balance report',
    description: 'Generates a report showing opening, receipt, expense, and closing balances for inventory items',
  })
  @ApiResponse({
    status: 200,
    description: 'Report generated successfully',
    type: InventoryBalanceReportDto,
  })
  async generate(@Body() config: InventoryBalanceConfigDto): Promise<{
    config: InventoryBalanceConfigDto;
    data: InventoryBalanceReportDto;
    generatedAt: Date;
  }> {
    this.logger.log('Generating inventory balance report');
    return this.reportService.generate(config);
  }

  @Post('drill-down')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Drill down to see source documents',
    description: 'Shows all inventory movements for a specific item and warehouse with running balance',
  })
  @ApiResponse({
    status: 200,
    description: 'Drill-down data retrieved successfully',
    type: InventoryBalanceDrillDownDto,
  })
  async drillDown(
    @Body() config: InventoryBalanceConfigDto,
    @Query('itemId') itemId: string,
    @Query('warehouseId') warehouseId: string,
  ): Promise<InventoryBalanceDrillDownDto> {
    this.logger.log(`Drill-down for item: ${itemId}, warehouse: ${warehouseId}`);
    return this.reportService.drillDown(config, { itemId, warehouseId });
  }

  @Post('export/excel')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="inventory-balance-report.xlsx"')
  @ApiOperation({
    summary: 'Export report to Excel',
    description: 'Exports the inventory balance report as an Excel file',
  })
  @ApiResponse({
    status: 200,
    description: 'Excel file generated successfully',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async exportToExcel(
    @Body() config: InventoryBalanceConfigDto,
  ): Promise<StreamableFile> {
    this.logger.log('Exporting inventory balance report to Excel');
    const buffer = await this.reportService.exportToExcel(config);
    return new StreamableFile(buffer);
  }

  @Post('export/pdf')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="inventory-balance-report.pdf"')
  @ApiOperation({
    summary: 'Export report to PDF',
    description: 'Exports the inventory balance report as a PDF file',
  })
  @ApiResponse({
    status: 200,
    description: 'PDF file generated successfully',
    content: {
      'application/pdf': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async exportToPdf(
    @Body() config: InventoryBalanceConfigDto,
  ): Promise<StreamableFile> {
    this.logger.log('Exporting inventory balance report to PDF');
    const buffer = await this.reportService.exportToPdf(config);
    return new StreamableFile(buffer);
  }
}
