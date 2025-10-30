import { Module } from '@nestjs/common';
// Catalogs
import { CounterpartyModule } from './catalogs/counterparty/counterparty.module';
import { ItemModule } from './catalogs/item/item.module';
import { WarehouseModule } from './catalogs/warehouse/warehouse.module';
// Documents
import { GoodsSaleModule } from './documents/goods-sale/goods-sale.module';
// Registers
import { InventoryRegisterModule } from './registers/accumulation/inventory/inventory-register.module';
// Accounting
import { AccountingModule } from './accounting/accounting.module';
// Reports
import { InventoryBalanceReportModule } from './reports/inventory-balance/inventory-balance-report.module';

@Module({
  imports: [
    // Catalogs
    CounterpartyModule,
    ItemModule,
    WarehouseModule,
    // Documents
    GoodsSaleModule,
    // Registers
    InventoryRegisterModule,
    // Accounting
    AccountingModule,
    // Reports
    InventoryBalanceReportModule,
  ],
})
export class DomainsModule {}
