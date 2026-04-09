import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';
import { ChartOfAccounts, AccountType } from '@prisma/client';

@Injectable()
export class ChartOfAccountsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ChartOfAccounts[]> {
    return this.prisma.chartOfAccounts.findMany({
      where: { isActive: true },
      orderBy: { code: 'asc' },
    });
  }

  async findById(id: string): Promise<ChartOfAccounts | null> {
    return this.prisma.chartOfAccounts.findUnique({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<ChartOfAccounts | null> {
    return this.prisma.chartOfAccounts.findFirst({
      where: { code, isActive: true },
    });
  }

  async create(data: {
    code: string;
    name: string;
    accountType: AccountType;
    description?: string;
    parentId?: string;
  }): Promise<ChartOfAccounts> {
    return this.prisma.chartOfAccounts.create({
      data: {
        code: data.code,
        name: data.name,
        accountType: data.accountType,
        description: data.description,
        parentId: data.parentId,
      },
    });
  }

  async update(id: string, data: Partial<{
    name: string;
    accountType: AccountType;
    description: string;
    parentId: string | null;
  }>): Promise<ChartOfAccounts> {
    return this.prisma.chartOfAccounts.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<ChartOfAccounts> {
    return this.prisma.chartOfAccounts.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
