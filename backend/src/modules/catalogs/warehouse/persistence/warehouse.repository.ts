import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';
import { BaseRepository } from '../../../../infrastructure/database/prisma/base.repository';
import { Warehouse } from '@prisma/client';

@Injectable()
export class WarehouseRepository extends BaseRepository<Warehouse> {
  constructor(private prisma: PrismaService) {
    super();
  }

  get model() {
    return this.prisma.warehouse;
  }

  async search(query: string): Promise<Warehouse[]> {
    return this.model.findMany({
      where: {
        OR: [
          { code: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } },
        ],
        isActive: true,
      },
      orderBy: { description: 'asc' },
    });
  }
}
