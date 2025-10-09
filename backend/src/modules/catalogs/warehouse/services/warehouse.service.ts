import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { WarehouseRepository } from '../persistence/warehouse.repository';
import { CreateWarehouseDto, UpdateWarehouseDto, WarehouseResponse } from '../dtos';

@Injectable()
export class WarehouseService {
  private readonly logger = new Logger(WarehouseService.name);

  constructor(private readonly repository: WarehouseRepository) {}

  async findAll(): Promise<WarehouseResponse[]> {
    this.logger.log('Finding all warehouses');
    const items = await this.repository.findAll();
    return items.map((item) => new WarehouseResponse(item));
  }

  async findById(id: string): Promise<WarehouseResponse> {
    this.logger.log(`Finding warehouse by id: ${id}`);
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Warehouse with id ${id} not found`);
    }
    return new WarehouseResponse(item);
  }

  async search(query: string): Promise<WarehouseResponse[]> {
    this.logger.log(`Searching warehouses with query: ${query}`);
    const items = await this.repository.search(query);
    return items.map((item) => new WarehouseResponse(item));
  }

  async create(dto: CreateWarehouseDto): Promise<WarehouseResponse> {
    this.logger.log(`Creating warehouse with code: ${dto.code}`);

    const existing = await this.repository.findByCode(dto.code);
    if (existing) {
      throw new ConflictException(`Warehouse with code ${dto.code} already exists`);
    }

    const item = await this.repository.create(dto);
    this.logger.log(`Warehouse created with id: ${item.id}`);

    return new WarehouseResponse(item);
  }

  async update(id: string, dto: UpdateWarehouseDto): Promise<WarehouseResponse> {
    this.logger.log(`Updating warehouse with id: ${id}`);
    await this.findById(id);

    const item = await this.repository.update(id, dto);
    this.logger.log(`Warehouse updated with id: ${item.id}`);

    return new WarehouseResponse(item);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting warehouse with id: ${id}`);
    await this.findById(id);
    await this.repository.delete(id);
    this.logger.log(`Warehouse deleted with id: ${id}`);
  }

  async getHierarchy(parentId: string | null = null): Promise<WarehouseResponse[]> {
    this.logger.log(`Getting hierarchy for parentId: ${parentId}`);
    const items = await this.repository.findHierarchy(parentId);
    return items.map((item) => new WarehouseResponse(item));
  }
}
