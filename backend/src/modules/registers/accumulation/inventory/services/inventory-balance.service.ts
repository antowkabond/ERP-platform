import { Injectable, Logger } from '@nestjs/common';
import { InventoryRegisterRepository } from '../persistence/inventory-register.repository';
import { InventoryBalanceResponse, InventoryBalanceFiltersDto } from '../dtos';

@Injectable()
export class InventoryBalanceService {
  private readonly logger = new Logger(InventoryBalanceService.name);

  constructor(
    private readonly repository: InventoryRegisterRepository,
  ) {}

  async calculateBalances(filters: InventoryBalanceFiltersDto): Promise<InventoryBalanceResponse[]> {
    this.logger.log('Calculating inventory balances with filters:', filters);
    
    const balances = await this.repository.calculateBalance({
      itemId: filters.itemId,
      warehouseId: filters.warehouseId,
      asOfDate: filters.asOfDate,
    });

    let result = balances.map(b => new InventoryBalanceResponse(b));

    // Filter by minimum quantity if specified
    if (filters.minQuantity !== undefined) {
      result = result.filter(b => b.quantity >= filters.minQuantity);
    }

    return result;
  }
}
