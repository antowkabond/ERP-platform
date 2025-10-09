import { Module } from '@nestjs/common';
// Catalogs
import { CounterpartyModule } from './catalogs/counterparty/counterparty.module';
import { ItemModule } from './catalogs/item/item.module';
import { WarehouseModule } from './catalogs/warehouse/warehouse.module';
// Documents
import { GoodsSaleModule } from './documents/goods-sale/goods-sale.module';

@Module({
  imports: [
    // Catalogs
    CounterpartyModule,
    ItemModule,
    WarehouseModule,
    // Documents
    GoodsSaleModule,
  ],
})
export class DomainsModule {}
