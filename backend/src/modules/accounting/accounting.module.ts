import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';
import { ChartOfAccountsService } from './services/chart-of-accounts.service';
import { AccountingEntryService } from './services/accounting-entry.service';
import { ChartOfAccountsRepository } from './persistence/chart-of-accounts.repository';
import { AccountingEntryRepository } from './persistence/accounting-entry.repository';
import { ChartOfAccountsController } from './controllers/chart-of-accounts.controller';
import { AccountingEntryController } from './controllers/accounting-entry.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ChartOfAccountsController, AccountingEntryController],
  providers: [
    ChartOfAccountsService,
    AccountingEntryService,
    ChartOfAccountsRepository,
    AccountingEntryRepository,
  ],
  exports: [ChartOfAccountsService, AccountingEntryService],
})
export class AccountingModule {}
