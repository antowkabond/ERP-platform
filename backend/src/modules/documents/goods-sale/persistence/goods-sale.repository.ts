import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';
import { GoodsSale, GoodsSaleItem, Prisma } from '@prisma/client';

@Injectable()
export class GoodsSaleRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<(GoodsSale & { items: GoodsSaleItem[] })[]> {
    return this.prisma.goodsSale.findMany({
      where: { isActive: true },
      include: { items: { orderBy: { lineNumber: 'asc' } } },
      orderBy: { date: 'desc' },
    });
  }

  async findById(id: string): Promise<(GoodsSale & { items: GoodsSaleItem[] }) | null> {
    return this.prisma.goodsSale.findUnique({
      where: { id },
      include: { items: { orderBy: { lineNumber: 'asc' } } },
    });
  }

  async findByNumber(number: string): Promise<GoodsSale | null> {
    return this.prisma.goodsSale.findUnique({
      where: { number },
    });
  }

  async create(data: {
    number: string;
    date: Date;
    counterpartyId: string;
    warehouseId: string;
    totalAmount: number;
    totalQuantity: number;
    items: Array<{
      itemId: string;
      quantity: number;
      price: number;
      amount: number;
      lineNumber: number;
    }>;
  }): Promise<GoodsSale & { items: GoodsSaleItem[] }> {
    return this.prisma.goodsSale.create({
      data: {
        number: data.number,
        date: data.date,
        counterpartyId: data.counterpartyId,
        warehouseId: data.warehouseId,
        totalAmount: data.totalAmount,
        totalQuantity: data.totalQuantity,
        state: 'DRAFT',
        isActive: true,
        items: {
          create: data.items,
        },
      },
      include: { items: { orderBy: { lineNumber: 'asc' } } },
    });
  }

  async update(
    id: string,
    data: {
      date?: Date;
      counterpartyId?: string;
      warehouseId?: string;
      totalAmount?: number;
      totalQuantity?: number;
      items?: Array<{
        itemId: string;
        quantity: number;
        price: number;
        amount: number;
        lineNumber: number;
      }>;
    },
  ): Promise<GoodsSale & { items: GoodsSaleItem[] }> {
    // If items are provided, delete old items and create new ones
    if (data.items) {
      await this.prisma.goodsSaleItem.deleteMany({
        where: { documentId: id },
      });

      return this.prisma.goodsSale.update({
        where: { id },
        data: {
          date: data.date,
          counterpartyId: data.counterpartyId,
          warehouseId: data.warehouseId,
          totalAmount: data.totalAmount,
          totalQuantity: data.totalQuantity,
          items: {
            create: data.items,
          },
          updatedAt: new Date(),
        },
        include: { items: { orderBy: { lineNumber: 'asc' } } },
      });
    }

    return this.prisma.goodsSale.update({
      where: { id },
      data: {
        date: data.date,
        counterpartyId: data.counterpartyId,
        warehouseId: data.warehouseId,
        totalAmount: data.totalAmount,
        totalQuantity: data.totalQuantity,
        updatedAt: new Date(),
      },
      include: { items: { orderBy: { lineNumber: 'asc' } } },
    });
  }

  async markAsPosted(id: string): Promise<GoodsSale> {
    return this.prisma.goodsSale.update({
      where: { id },
      data: {
        state: 'POSTED',
        postedAt: new Date(),
      },
    });
  }

  async markAsUnposted(id: string): Promise<GoodsSale> {
    return this.prisma.goodsSale.update({
      where: { id },
      data: {
        state: 'DRAFT',
        postedAt: null,
      },
    });
  }

  async delete(id: string): Promise<GoodsSale> {
    return this.prisma.goodsSale.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });
  }

  async getNextNumber(): Promise<string> {
    const lastDocument = await this.prisma.goodsSale.findFirst({
      orderBy: { number: 'desc' },
      select: { number: true },
    });

    if (!lastDocument) {
      return 'GS-000001';
    }

    const match = lastDocument.number.match(/GS-(\d+)/);
    if (match) {
      const nextNum = parseInt(match[1], 10) + 1;
      return `GS-${nextNum.toString().padStart(6, '0')}`;
    }

    return 'GS-000001';
  }
}
