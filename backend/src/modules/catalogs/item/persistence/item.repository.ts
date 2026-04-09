import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';
import { BaseRepository } from '../../../../infrastructure/database/prisma/base.repository';
import { Item } from '@prisma/client';

@Injectable()
export class ItemRepository extends BaseRepository<Item> {
  constructor(private prisma: PrismaService) {
    super();
  }

  get model() {
    return this.prisma.item;
  }

  async search(query: string): Promise<Item[]> {
    return this.model.findMany({
      where: {
        OR: [
          { code: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
        ],
        isActive: true,
      },
      orderBy: { description: 'asc' },
    });
  }

  async findInventoryItems(): Promise<Item[]> {
    return this.findMany({
      where: { isInventory: true },
    });
  }

  async findServices(): Promise<Item[]> {
    return this.findMany({
      where: { isService: true },
    });
  }

  async findBySku(sku: string): Promise<Item | null> {
    return this.model.findFirst({
      where: { sku, isActive: true },
    });
  }
}
