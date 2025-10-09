import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { ChartOfAccountsRepository } from '../persistence/chart-of-accounts.repository';
import { CreateChartOfAccountsDto, UpdateChartOfAccountsDto, ChartOfAccountsResponse } from '../dtos';

@Injectable()
export class ChartOfAccountsService {
  private readonly logger = new Logger(ChartOfAccountsService.name);

  constructor(
    private readonly repository: ChartOfAccountsRepository,
  ) {}

  async findAll(): Promise<ChartOfAccountsResponse[]> {
    this.logger.log('Finding all chart of accounts');
    const accounts = await this.repository.findAll();
    return accounts.map(acc => new ChartOfAccountsResponse(acc));
  }

  async findById(id: string): Promise<ChartOfAccountsResponse> {
    this.logger.log(`Finding chart of accounts by id: ${id}`);
    const account = await this.repository.findById(id);
    if (!account) {
      throw new NotFoundException(`Chart of Accounts with id ${id} not found`);
    }
    return new ChartOfAccountsResponse(account);
  }

  async findByCode(code: string): Promise<ChartOfAccountsResponse | null> {
    const account = await this.repository.findByCode(code);
    return account ? new ChartOfAccountsResponse(account) : null;
  }

  async create(dto: CreateChartOfAccountsDto): Promise<ChartOfAccountsResponse> {
    this.logger.log('Creating chart of accounts entry');

    // Check for duplicate code
    const existing = await this.repository.findByCode(dto.code);
    if (existing) {
      throw new ConflictException(`Chart of Accounts with code ${dto.code} already exists`);
    }

    const account = await this.repository.create(dto);
    this.logger.log(`Chart of accounts created with code: ${account.code}`);
    return new ChartOfAccountsResponse(account);
  }

  async update(id: string, dto: UpdateChartOfAccountsDto): Promise<ChartOfAccountsResponse> {
    this.logger.log(`Updating chart of accounts with id: ${id}`);

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Chart of Accounts with id ${id} not found`);
    }

    const account = await this.repository.update(id, dto);
    this.logger.log(`Chart of accounts updated with id: ${id}`);
    return new ChartOfAccountsResponse(account);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting chart of accounts with id: ${id}`);

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Chart of Accounts with id ${id} not found`);
    }

    await this.repository.delete(id);
    this.logger.log(`Chart of accounts deleted with id: ${id}`);
  }
}
