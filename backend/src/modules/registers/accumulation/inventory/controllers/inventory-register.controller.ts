import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InventoryRegisterService } from '../services/inventory-register.service';
import { InventoryBalanceService } from '../services/inventory-balance.service';
import {
  InventoryMovementResponse,
  InventoryMovementFiltersDto,
  InventoryBalanceResponse,
  InventoryBalanceFiltersDto,
} from '../dtos';

@ApiTags('Registers - Inventory')
@Controller('api/v1/registers/inventory')
export class InventoryRegisterController {
  constructor(
    private readonly inventoryRegisterService: InventoryRegisterService,
    private readonly inventoryBalanceService: InventoryBalanceService,
  ) {}

  @Get('movements')
  @ApiOperation({ summary: 'Get inventory movements with optional filters' })
  @ApiResponse({ status: 200, description: 'List of inventory movements', type: [InventoryMovementResponse] })
  async getMovements(@Query() filters: InventoryMovementFiltersDto): Promise<InventoryMovementResponse[]> {
    return this.inventoryRegisterService.findMovements(filters);
  }

  @Get('balances')
  @ApiOperation({ summary: 'Calculate inventory balances' })
  @ApiResponse({ status: 200, description: 'List of inventory balances', type: [InventoryBalanceResponse] })
  async getBalances(@Query() filters: InventoryBalanceFiltersDto): Promise<InventoryBalanceResponse[]> {
    return this.inventoryBalanceService.calculateBalances(filters);
  }
}
