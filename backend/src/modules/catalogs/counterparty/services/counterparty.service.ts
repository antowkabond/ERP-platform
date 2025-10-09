import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { CounterpartyRepository } from '../persistence/counterparty.repository';
import { CreateCounterpartyDto, UpdateCounterpartyDto, CounterpartyResponse } from '../dtos';

@Injectable()
export class CounterpartyService {
  private readonly logger = new Logger(CounterpartyService.name);

  constructor(private readonly repository: CounterpartyRepository) {}

  async findAll(): Promise<CounterpartyResponse[]> {
    this.logger.log('Finding all counterparties');
    const items = await this.repository.findAll();
    return items.map((item) => new CounterpartyResponse(item));
  }

  async findById(id: string): Promise<CounterpartyResponse> {
    this.logger.log(`Finding counterparty by id: ${id}`);
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Counterparty with id ${id} not found`);
    }
    return new CounterpartyResponse(item);
  }

  async search(query: string): Promise<CounterpartyResponse[]> {
    this.logger.log(`Searching counterparties with query: ${query}`);
    const items = await this.repository.search(query);
    return items.map((item) => new CounterpartyResponse(item));
  }

  async findCustomers(): Promise<CounterpartyResponse[]> {
    this.logger.log('Finding all customers');
    const items = await this.repository.findCustomers();
    return items.map((item) => new CounterpartyResponse(item));
  }

  async findSuppliers(): Promise<CounterpartyResponse[]> {
    this.logger.log('Finding all suppliers');
    const items = await this.repository.findSuppliers();
    return items.map((item) => new CounterpartyResponse(item));
  }

  async create(dto: CreateCounterpartyDto): Promise<CounterpartyResponse> {
    this.logger.log(`Creating counterparty with code: ${dto.code}`);

    // Check if code already exists
    const existing = await this.repository.findByCode(dto.code);
    if (existing) {
      throw new ConflictException(`Counterparty with code ${dto.code} already exists`);
    }

    const item = await this.repository.create(dto);
    this.logger.log(`Counterparty created with id: ${item.id}`);

    return new CounterpartyResponse(item);
  }

  async update(id: string, dto: UpdateCounterpartyDto): Promise<CounterpartyResponse> {
    this.logger.log(`Updating counterparty with id: ${id}`);

    // Check if exists
    await this.findById(id);

    const item = await this.repository.update(id, dto);
    this.logger.log(`Counterparty updated with id: ${item.id}`);

    return new CounterpartyResponse(item);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting counterparty with id: ${id}`);

    // Check if exists
    await this.findById(id);

    await this.repository.delete(id);
    this.logger.log(`Counterparty deleted with id: ${id}`);
  }

  async getHierarchy(parentId: string | null = null): Promise<CounterpartyResponse[]> {
    this.logger.log(`Getting hierarchy for parentId: ${parentId}`);
    const items = await this.repository.findHierarchy(parentId);
    return items.map((item) => new CounterpartyResponse(item));
  }
}
