import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';

/**
 * Base service for information registers (1C-style)
 * Handles periodic or independent data (prices, exchange rates, settings)
 */
export abstract class BaseInformationRegisterService<
  TRecord,
  TCreateDto,
  TResponseDto,
> {
  protected abstract readonly logger: Logger;
  protected abstract readonly prisma: PrismaService;
  protected abstract readonly registerName: string; // e.g., 'priceRegister'

  /**
   * Get all records with filters
   */
  async findAll(filters: any): Promise<TResponseDto[]> {
    this.logger.log(`Finding all ${this.registerName} records`);
    const records = await this.findRecords(filters);
    return records.map((r) => this.toResponseDto(r));
  }

  /**
   * Get effective record as of a specific date
   * Returns the most recent record before or on the specified date
   */
  async getEffectiveRecord(dimensions: any, date: Date): Promise<TResponseDto | null> {
    this.logger.log(`Getting effective ${this.registerName} record as of ${date.toISOString()}`);

    const prisma = this.prisma;
    const register = prisma[this.registerName];

    const record = await register.findFirst({
      where: {
        ...dimensions,
        date: { lte: date },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return record ? this.toResponseDto(record) : null;
  }

  /**
   * Get history of records within a date range
   */
  async getHistory(
    dimensions: any,
    dateFrom: Date,
    dateTo: Date,
  ): Promise<TResponseDto[]> {
    this.logger.log(`Getting ${this.registerName} history from ${dateFrom.toISOString()} to ${dateTo.toISOString()}`);

    const records = await this.findRecords({
      ...dimensions,
      date: {
        gte: dateFrom,
        lte: dateTo,
      },
    });

    return records.map((r) => this.toResponseDto(r));
  }

  /**
   * Create a new record
   */
  async create(dto: TCreateDto, tx?: any): Promise<TResponseDto> {
    this.logger.log(`Creating ${this.registerName} record`);

    const prisma = tx || this.prisma;
    const register = prisma[this.registerName];

    const record = await register.create({
      data: this.toCreateData(dto),
    });

    this.logger.log(`${this.registerName} record created`);
    return this.toResponseDto(record);
  }

  /**
   * Update an existing record
   */
  async update(id: string, dto: Partial<TCreateDto>, tx?: any): Promise<TResponseDto> {
    this.logger.log(`Updating ${this.registerName} record with id: ${id}`);

    const prisma = tx || this.prisma;
    const register = prisma[this.registerName];

    const record = await register.update({
      where: { id },
      data: this.toUpdateData(dto),
    });

    this.logger.log(`${this.registerName} record updated`);
    return this.toResponseDto(record);
  }

  /**
   * Delete a record
   */
  async delete(id: string, tx?: any): Promise<void> {
    this.logger.log(`Deleting ${this.registerName} record with id: ${id}`);

    const prisma = tx || this.prisma;
    const register = prisma[this.registerName];

    await register.delete({
      where: { id },
    });

    this.logger.log(`${this.registerName} record deleted`);
  }

  /**
   * Bulk create records (useful for imports)
   */
  async bulkCreate(dtos: TCreateDto[], tx?: any): Promise<number> {
    this.logger.log(`Bulk creating ${dtos.length} ${this.registerName} records`);

    const prisma = tx || this.prisma;
    const register = prisma[this.registerName];

    const result = await register.createMany({
      data: dtos.map((dto) => this.toCreateData(dto)),
      skipDuplicates: true,
    });

    this.logger.log(`${result.count} ${this.registerName} records created`);
    return result.count;
  }

  /**
   * Find records with filters
   * Must be implemented by subclasses
   */
  protected abstract findRecords(filters: any): Promise<TRecord[]>;

  /**
   * Convert DTO to create data
   * Must be implemented by subclasses
   */
  protected abstract toCreateData(dto: TCreateDto): any;

  /**
   * Convert DTO to update data
   * Must be implemented by subclasses
   */
  protected abstract toUpdateData(dto: Partial<TCreateDto>): any;

  /**
   * Convert record entity to response DTO
   * Must be implemented by subclasses
   */
  protected abstract toResponseDto(record: TRecord): TResponseDto;
}
