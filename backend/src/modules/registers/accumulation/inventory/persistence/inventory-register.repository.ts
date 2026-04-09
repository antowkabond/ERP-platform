import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../infrastructure/database/prisma/prisma.service';
import { InventoryRegister, Prisma } from '@prisma/client';

@Injectable()
export class InventoryRegisterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: {
    itemId?: string;
    warehouseId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<InventoryRegister[]> {
    return this.prisma.inventoryRegister.findMany({
      where: {
        itemId: filters?.itemId,
        warehouseId: filters?.warehouseId,
        date: {
          ...(filters?.dateFrom && { gte: filters.dateFrom }),
          ...(filters?.dateTo && { lte: filters.dateTo }),
        },
      },
      include: {
        item: true,
        warehouse: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findByRecorder(recorder: string): Promise<InventoryRegister[]> {
    return this.prisma.inventoryRegister.findMany({
      where: { recorder },
      include: {
        item: true,
        warehouse: true,
      },
    });
  }

  async calculateBalance(filters: {
    itemId?: string;
    warehouseId?: string;
    asOfDate?: Date;
  }): Promise<any[]> {
    const { itemId, warehouseId, asOfDate } = filters;

    // Build WHERE conditions dynamically
    const itemFilter = itemId ? Prisma.sql`ir."itemId" = ${itemId}` : Prisma.sql`1=1`;
    const warehouseFilter = warehouseId ? Prisma.sql`ir."warehouseId" = ${warehouseId}` : Prisma.sql`1=1`;
    const dateFilter = asOfDate ? Prisma.sql`ir.date <= ${asOfDate}` : Prisma.sql`1=1`;

    // Raw SQL for balance calculation
    return this.prisma.$queryRaw`
      SELECT 
        i.id as "itemId",
        i.code as "itemCode",
        i.description as "itemDescription",
        w.id as "warehouseId",
        w.code as "warehouseCode",
        w.description as "warehouseDescription",
        SUM(ir.quantity) as quantity,
        SUM(ir.amount) as amount
      FROM "registers_inventory" ir
      INNER JOIN "catalogs_item" i ON ir."itemId" = i.id
      INNER JOIN "catalogs_warehouse" w ON ir."warehouseId" = w.id
      WHERE 
        ${itemFilter}
        AND ${warehouseFilter}
        AND ${dateFilter}
      GROUP BY i.id, i.code, i.description, w.id, w.code, w.description
      HAVING SUM(ir.quantity) != 0
      ORDER BY i.description, w.description
    `;
  }
}
