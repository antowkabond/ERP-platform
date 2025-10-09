import { Injectable, Logger } from '@nestjs/common';
import { AccountingEntryRepository } from '../persistence/accounting-entry.repository';
import { AccountingEntryResponse, AccountingEntryFiltersDto } from '../dtos';

@Injectable()
export class AccountingEntryService {
  private readonly logger = new Logger(AccountingEntryService.name);

  constructor(
    private readonly repository: AccountingEntryRepository,
  ) {}

  async findAll(filters: AccountingEntryFiltersDto): Promise<AccountingEntryResponse[]> {
    this.logger.log('Finding accounting entries with filters:', filters);
    const entries = await this.repository.findAll(filters);
    return entries.map(entry => new AccountingEntryResponse(entry));
  }

  async findByRecorder(recorder: string): Promise<AccountingEntryResponse[]> {
    this.logger.log(`Finding accounting entries for recorder: ${recorder}`);
    const entries = await this.repository.findByRecorder(recorder);
    return entries.map(entry => new AccountingEntryResponse(entry));
  }
}
