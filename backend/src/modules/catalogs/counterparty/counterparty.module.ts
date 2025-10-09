import { Module } from '@nestjs/common';
import { CounterpartyController } from './controllers/counterparty.controller';
import { CounterpartyService } from './services/counterparty.service';
import { CounterpartyRepository } from './persistence/counterparty.repository';
import { PrismaModule } from '../../../infrastructure/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CounterpartyController],
  providers: [CounterpartyService, CounterpartyRepository],
  exports: [CounterpartyService],
})
export class CounterpartyModule {}
