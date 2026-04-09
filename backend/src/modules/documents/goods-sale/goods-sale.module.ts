import { Module } from '@nestjs/common';
import { GoodsSaleController } from './controllers/goods-sale.controller';
import { GoodsSaleService } from './services/goods-sale.service';
import { GoodsSaleRepository } from './persistence/goods-sale.repository';
import { PrismaModule } from '../../../infrastructure/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GoodsSaleController],
  providers: [GoodsSaleService, GoodsSaleRepository],
  exports: [GoodsSaleService],
})
export class GoodsSaleModule {}
