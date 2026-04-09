import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';
import { AccountingEntry } from '@prisma/client';

@Injectable()
export class AccountingEntryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: {
    dateFrom?: Date;
    dateTo?: Date;
    debitAccountId?: string;
    creditAccountId?: string;
  }): Promise<AccountingEntry[]> {
    return this.prisma.accountingEntry.findMany({
      where: {
        date: {
          ...(filters?.dateFrom && { gte: filters.dateFrom }),
          ...(filters?.dateTo && { lte: filters.dateTo }),
        },
        debitAccountId: filters?.debitAccountId,
        creditAccountId: filters?.creditAccountId,
      },
      include: {
        debitAccount: true,
        creditAccount: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findByRecorder(recorder: string): Promise<AccountingEntry[]> {
    return this.prisma.accountingEntry.findMany({
      where: { recorder },
      include: {
        debitAccount: true,
        creditAccount: true,
      },
    });
  }

  async create(data: {
    recorder: string;
    recordType: string;
    date: Date;
    debitAccountId: string;
    creditAccountId: string;
    amount: number;
    currency: string;
    description?: string;
  }): Promise<AccountingEntry> {
    return this.prisma.accountingEntry.create({
      data,
    });
  }

  async deleteByRecorder(recorder: string): Promise<void> {
    await this.prisma.accountingEntry.deleteMany({
      where: { recorder },
    });
  }
}
