import { Injectable, Logger } from '@nestjs/common';
import { InventoryRegisterRepository } from '../persistence/inventory-register.repository';
import { InventoryMovementResponse, InventoryMovementFiltersDto } from '../dtos';

@Injectable()
export class InventoryRegisterService {
  private readonly logger = new Logger(InventoryRegisterService.name);

  constructor(
    private readonly repository: InventoryRegisterRepository,
  ) {}

  async findMovements(filters: InventoryMovementFiltersDto): Promise<InventoryMovementResponse[]> {
    this.logger.log('Finding inventory movements with filters:', filters);
    
    const movements = await this.repository.findAll(filters);
    return movements.map(m => new InventoryMovementResponse(m));
  }

  async findMovementsByRecorder(recorder: string): Promise<InventoryMovementResponse[]> {
    this.logger.log(`Finding inventory movements for recorder: ${recorder}`);
    
    const movements = await this.repository.findByRecorder(recorder);
    return movements.map(m => new InventoryMovementResponse(m));
  }
}
