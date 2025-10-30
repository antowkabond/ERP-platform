import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../infrastructure/database/prisma/prisma.module';
import { InventoryBalanceReportController } from './controllers/inventory-balance-report.controller';
import { InventoryBalanceReportService } from './services/inventory-balance-report.service';

@Module({
  imports: [PrismaModule],
  controllers: [InventoryBalanceReportController],
  providers: [InventoryBalanceReportService],
  exports: [InventoryBalanceReportService],
})
export class InventoryBalanceReportModule {}
