import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';
import { MovementType } from '../../../../app/enums';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Base interface for accumulation register movements
 */
export interface BaseMovement {
  movementType: MovementType;
  quantity?: Decimal | number;
  amount?: Decimal | number;
}

/**
 * Base service for accumulation registers (1C-style)
 * Handles balance calculations and movement queries
 */
export abstract class BaseAccumulationRegisterService<
  TMovement extends BaseMovement,
  TBalance,
  TMovementDto,
  TBalanceDto,
> {
  protected abstract readonly logger: Logger;
  protected abstract readonly prisma: PrismaService;
  protected abstract readonly registerName: string; // e.g., 'inventoryRegister'

  /**
   * Get movements for a register
   */
  async getMovements(filters: any): Promise<TMovementDto[]> {
    this.logger.log(`Getting ${this.registerName} movements`);
    const movements = await this.findMovements(filters);
    return movements.map((m) => this.toMovementDto(m));
  }

  /**
   * Get balances (aggregated movements)
   */
  async getBalances(filters: any): Promise<TBalanceDto[]> {
    this.logger.log(`Calculating ${this.registerName} balances`);
    const balances = await this.calculateBalances(filters);
    return balances.map((b) => this.toBalanceDto(b));
  }

  /**
   * Create a movement (usually called during document posting)
   */
  async createMovement(
    recorder: string,
    recordType: string,
    date: Date,
    data: Partial<TMovement>,
    tx?: any,
  ): Promise<TMovement> {
    this.logger.log(`Creating ${this.registerName} movement for ${recordType}`);

    const prisma = tx || this.prisma;
    const register = prisma[this.registerName];

    return register.create({
      data: {
        recorder,
        recordType,
        date,
        ...data,
      },
    });
  }

  /**
   * Delete movements by recorder (used during unposting)
   */
  async deleteMovementsByRecorder(recorder: string, recordType: string, tx?: any): Promise<void> {
    this.logger.log(`Deleting ${this.registerName} movements for ${recordType}`);

    const prisma = tx || this.prisma;
    const register = prisma[this.registerName];

    await register.deleteMany({
      where: {
        recorder,
        recordType,
      },
    });
  }

  /**
   * Calculate balance as of a specific date
   */
  async getBalanceAsOfDate(dimensions: any, date: Date): Promise<number> {
    this.logger.log(`Calculating ${this.registerName} balance as of ${date.toISOString()}`);

    const movements = await this.findMovements({
      ...dimensions,
      date: { lte: date },
    });

    let balance = 0;
    for (const movement of movements) {
      if (movement.movementType === MovementType.RECEIPT) {
        balance += Number(movement.quantity || movement.amount);
      } else if (movement.movementType === MovementType.EXPENSE) {
        balance += Number(movement.quantity || movement.amount); // Already negative
      }
    }

    return balance;
  }

  /**
   * Find movements with filters
   * Must be implemented by subclasses
   */
  protected abstract findMovements(filters: any): Promise<TMovement[]>;

  /**
   * Calculate balances with aggregation
   * Must be implemented by subclasses
   */
  protected abstract calculateBalances(filters: any): Promise<TBalance[]>;

  /**
   * Convert movement entity to DTO
   * Must be implemented by subclasses
   */
  protected abstract toMovementDto(movement: TMovement): TMovementDto;

  /**
   * Convert balance result to DTO
   * Must be implemented by subclasses
   */
  protected abstract toBalanceDto(balance: TBalance): TBalanceDto;
}
