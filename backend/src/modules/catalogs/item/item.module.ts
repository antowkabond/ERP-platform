import { Module } from '@nestjs/common';
import { ItemController } from './controllers/item.controller';
import { ItemService } from './services/item.service';
import { ItemRepository } from './persistence/item.repository';
import { PrismaModule } from '../../../infrastructure/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ItemController],
  providers: [ItemService, ItemRepository],
  exports: [ItemService],
})
export class ItemModule {}
