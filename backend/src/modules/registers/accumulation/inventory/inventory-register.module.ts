import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../../infrastructure/database/prisma/prisma.module';
import { InventoryRegisterService } from './services/inventory-register.service';
import { InventoryBalanceService } from './services/inventory-balance.service';
import { InventoryRegisterController } from './controllers/inventory-register.controller';
import { InventoryRegisterRepository } from './persistence/inventory-register.repository';

@Module({
  imports: [PrismaModule],
  controllers: [InventoryRegisterController],
  providers: [
    InventoryRegisterService,
    InventoryBalanceService,
    InventoryRegisterRepository,
  ],
  exports: [InventoryRegisterService, InventoryBalanceService],
})
export class InventoryRegisterModule {}
