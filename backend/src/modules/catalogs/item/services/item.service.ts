import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { ItemRepository } from '../persistence/item.repository';
import { CreateItemDto, UpdateItemDto, ItemResponse } from '../dtos';

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name);

  constructor(private readonly repository: ItemRepository) {}

  async findAll(): Promise<ItemResponse[]> {
    this.logger.log('Finding all items');
    const items = await this.repository.findAll();
    return items.map((item) => new ItemResponse(item));
  }

  async findById(id: string): Promise<ItemResponse> {
    this.logger.log(`Finding item by id: ${id}`);
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    return new ItemResponse(item);
  }

  async search(query: string): Promise<ItemResponse[]> {
    this.logger.log(`Searching items with query: ${query}`);
    const items = await this.repository.search(query);
    return items.map((item) => new ItemResponse(item));
  }

  async findInventoryItems(): Promise<ItemResponse[]> {
    this.logger.log('Finding inventory items');
    const items = await this.repository.findInventoryItems();
    return items.map((item) => new ItemResponse(item));
  }

  async findServices(): Promise<ItemResponse[]> {
    this.logger.log('Finding service items');
    const items = await this.repository.findServices();
    return items.map((item) => new ItemResponse(item));
  }

  async create(dto: CreateItemDto): Promise<ItemResponse> {
    this.logger.log(`Creating item with code: ${dto.code}`);

    const existing = await this.repository.findByCode(dto.code);
    if (existing) {
      throw new ConflictException(`Item with code ${dto.code} already exists`);
    }

    if (dto.sku) {
      const existingSku = await this.repository.findBySku(dto.sku);
      if (existingSku) {
        throw new ConflictException(`Item with SKU ${dto.sku} already exists`);
      }
    }

    const item = await this.repository.create(dto);
    this.logger.log(`Item created with id: ${item.id}`);

    return new ItemResponse(item);
  }

  async update(id: string, dto: UpdateItemDto): Promise<ItemResponse> {
    this.logger.log(`Updating item with id: ${id}`);

    await this.findById(id);

    if (dto.sku) {
      const existingSku = await this.repository.findBySku(dto.sku);
      if (existingSku && existingSku.id !== id) {
        throw new ConflictException(`Item with SKU ${dto.sku} already exists`);
      }
    }

    const item = await this.repository.update(id, dto);
    this.logger.log(`Item updated with id: ${item.id}`);

    return new ItemResponse(item);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting item with id: ${id}`);
    await this.findById(id);
    await this.repository.delete(id);
    this.logger.log(`Item deleted with id: ${id}`);
  }

  async getHierarchy(parentId: string | null = null): Promise<ItemResponse[]> {
    this.logger.log(`Getting hierarchy for parentId: ${parentId}`);
    const items = await this.repository.findHierarchy(parentId);
    return items.map((item) => new ItemResponse(item));
  }
}
