import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccountingEntryService } from '../services/accounting-entry.service';
import { AccountingEntryResponse, AccountingEntryFiltersDto } from '../dtos';

@ApiTags('Accounting - Entries')
@Controller('api/v1/accounting/entries')
export class AccountingEntryController {
  constructor(private readonly accountingEntryService: AccountingEntryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all accounting entries with optional filters' })
  @ApiResponse({ status: 200, description: 'List of accounting entries', type: [AccountingEntryResponse] })
  async findAll(@Query() filters: AccountingEntryFiltersDto): Promise<AccountingEntryResponse[]> {
    return this.accountingEntryService.findAll(filters);
  }
}
