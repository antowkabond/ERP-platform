import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';
import { BaseRepository } from '../../../../infrastructure/database/prisma/base.repository';
import { Counterparty } from '@prisma/client';

@Injectable()
export class CounterpartyRepository extends BaseRepository<Counterparty> {
  constructor(private prisma: PrismaService) {
    super();
  }

  get model() {
    return this.prisma.counterparty;
  }

  /**
   * Search counterparties by text
   */
  async search(query: string): Promise<Counterparty[]> {
    return this.model.findMany({
      where: {
        OR: [
          { code: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { taxNumber: { contains: query, mode: 'insensitive' } },
        ],
        isActive: true,
      },
      orderBy: { description: 'asc' },
    });
  }

  /**
   * Find customers only
   */
  async findCustomers(): Promise<Counterparty[]> {
    return this.findMany({
      where: { isCustomer: true },
    });
  }

  /**
   * Find suppliers only
   */
  async findSuppliers(): Promise<Counterparty[]> {
    return this.findMany({
      where: { isSupplier: true },
    });
  }
}
