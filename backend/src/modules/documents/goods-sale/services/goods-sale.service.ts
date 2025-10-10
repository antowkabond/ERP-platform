import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';
import { GoodsSaleRepository } from '../persistence/goods-sale.repository';
import { CreateGoodsSaleDto, UpdateGoodsSaleDto, GoodsSaleResponse } from '../dtos';
import { MovementType } from '../../../../app/enums';

@Injectable()
export class GoodsSaleService {
  private readonly logger = new Logger(GoodsSaleService.name);

  constructor(
    private readonly repository: GoodsSaleRepository,
    private readonly prisma: PrismaService,
  ) {}

  async findAll(): Promise<GoodsSaleResponse[]> {
    this.logger.log('Finding all goods sales');
    const documents = await this.repository.findAll();
    return documents.map((doc) => new GoodsSaleResponse(doc));
  }

  async findById(id: string): Promise<GoodsSaleResponse> {
    this.logger.log(`Finding goods sale by id: ${id}`);
    const document = await this.repository.findById(id);
    if (!document) {
      throw new NotFoundException(`GoodsSale document with id ${id} not found`);
    }
    return new GoodsSaleResponse(document);
  }

  async create(dto: CreateGoodsSaleDto): Promise<GoodsSaleResponse> {
    this.logger.log('Creating goods sale document');

    // Generate document number
    const number = await this.repository.getNextNumber();

    // Calculate line numbers, amounts, and total quantity
    let totalAmount = 0;
    let totalQuantity = 0;
    const items = dto.items.map((item, index) => {
      const amount = item.quantity * item.price;
      totalAmount += amount;
      totalQuantity += item.quantity;
      return {
        ...item,
        lineNumber: index + 1,
        amount,
      };
    });

    const document = await this.repository.create({
      number,
      date: new Date(dto.date),
      counterpartyId: dto.counterpartyId,
      warehouseId: dto.warehouseId,
      totalAmount,
      totalQuantity,
      items,
    });

    this.logger.log(`Goods sale created with number: ${document.number}`);
    return new GoodsSaleResponse(document);
  }

  async update(id: string, dto: UpdateGoodsSaleDto): Promise<GoodsSaleResponse> {
    this.logger.log(`Updating goods sale with id: ${id}`);

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException(`GoodsSale document with id ${id} not found`);
    }

    if (existing.state === 'POSTED') {
      throw new BadRequestException('Cannot update posted document. Unpost it first.');
    }

    const updateData: any = {};

    if (dto.date) {
      updateData.date = new Date(dto.date);
    }

    if (dto.counterpartyId) {
      updateData.counterpartyId = dto.counterpartyId;
    }

    if (dto.warehouseId) {
      updateData.warehouseId = dto.warehouseId;
    }

    if (dto.items) {
      let totalAmount = 0;
      let totalQuantity = 0;
      const items = dto.items.map((item, index) => {
        const amount = item.quantity * item.price;
        totalAmount += amount;
        totalQuantity += item.quantity;
        return {
          ...item,
          lineNumber: index + 1,
          amount,
        };
      });
      updateData.items = items;
      updateData.totalAmount = totalAmount;
      updateData.totalQuantity = totalQuantity;
    }

    const document = await this.repository.update(id, updateData);
    this.logger.log(`Goods sale updated with id: ${id}`);

    return new GoodsSaleResponse(document);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting goods sale with id: ${id}`);

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException(`GoodsSale document with id ${id} not found`);
    }

    if (existing.state === 'POSTED') {
      throw new BadRequestException('Cannot delete posted document. Unpost it first.');
    }

    await this.repository.delete(id);
    this.logger.log(`Goods sale deleted with id: ${id}`);
  }

  /**
   * POST DOCUMENT - This is the core 1C-style posting logic
   * Generates movements in registers and accounting entries
   */
  async post(id: string): Promise<GoodsSaleResponse> {
    this.logger.log(`Posting goods sale with id: ${id}`);

    const document = await this.repository.findById(id);
    if (!document) {
      throw new NotFoundException(`GoodsSale document with id ${id} not found`);
    }

    if (document.state === 'POSTED') {
      throw new BadRequestException('Document is already posted');
    }

    if (document.items.length === 0) {
      throw new BadRequestException('Cannot post document without items');
    }

    // Use transaction to ensure atomicity
    return this.prisma.$transaction(async (tx) => {
      // 1. Validate inventory availability (prevent negative balances)
      this.logger.log('Validating inventory availability...');
      for (const item of document.items) {
        // Calculate current balance for this item in this warehouse
        const movements = await tx.inventoryRegister.findMany({
          where: {
            itemId: item.itemId,
            warehouseId: document.warehouseId,
            date: { lte: document.date },
          },
        });

        let balance = 0;
        for (const movement of movements) {
          if (movement.movementType === MovementType.RECEIPT) {
            balance += Number(movement.quantity);
          } else if (movement.movementType === MovementType.EXPENSE) {
            balance += Number(movement.quantity); // Already negative
          }
        }

        // Check if we have enough inventory
        if (balance < Number(item.quantity)) {
          const itemDetails = await tx.item.findUnique({ where: { id: item.itemId } });
          throw new BadRequestException(
            `Insufficient inventory for item "${itemDetails?.description || item.itemId}". ` +
              `Available: ${balance}, Required: ${item.quantity}`,
          );
        }
      }

      // 2. Mark document as posted
      await this.repository.markAsPosted(id);

      // 3. Generate Inventory Register movements (EXPENSE for sales)
      this.logger.log('Generating inventory register movements...');
      for (const item of document.items) {
        await tx.inventoryRegister.create({
          data: {
            recorder: document.id,
            recordType: 'GoodsSale',
            date: document.date,
            itemId: item.itemId,
            warehouseId: document.warehouseId,
            quantity: -Number(item.quantity), // Negative for EXPENSE
            amount: -Number(item.amount),
            movementType: MovementType.EXPENSE,
          },
        });
      }

      // 4. Generate Financial Register movement (RECEIPT - customer owes us)
      this.logger.log('Generating financial register movement...');
      await tx.financialRegister.create({
        data: {
          recorder: document.id,
          recordType: 'GoodsSale',
          date: document.date,
          counterpartyId: document.counterpartyId,
          amount: Number(document.totalAmount), // Positive - customer debt
          currency: 'USD',
          movementType: MovementType.RECEIPT,
        },
      });

      // 5. Generate Accounting Entries (double-entry bookkeeping)
      this.logger.log('Generating accounting entries...');

      // Find default accounts (simplified - in real system would use chart of accounts mapping)
      const receivablesAccount = await tx.chartOfAccounts.findFirst({
        where: { code: '1200', isActive: true }, // Accounts Receivable
      });

      const revenueAccount = await tx.chartOfAccounts.findFirst({
        where: { code: '4000', isActive: true }, // Revenue
      });

      if (receivablesAccount && revenueAccount) {
        // Debit: Accounts Receivable, Credit: Revenue
        await tx.accountingEntry.create({
          data: {
            recorder: document.id,
            recordType: 'GoodsSale',
            date: document.date,
            debitAccountId: receivablesAccount.id,
            creditAccountId: revenueAccount.id,
            amount: Number(document.totalAmount),
            currency: 'USD',
            description: `Sale to customer, Doc: ${document.number}`,
          },
        });
      }

      this.logger.log(`✅ Goods sale posted successfully: ${document.number}`);

      // Return updated document
      const posted = await this.repository.findById(id);
      return new GoodsSaleResponse(posted);
    });
  }

  /**
   * UNPOST DOCUMENT - Reverse all register movements
   */
  async unpost(id: string): Promise<GoodsSaleResponse> {
    this.logger.log(`Unposting goods sale with id: ${id}`);

    const document = await this.repository.findById(id);
    if (!document) {
      throw new NotFoundException(`GoodsSale document with id ${id} not found`);
    }

    if (document.state !== 'POSTED') {
      throw new BadRequestException('Document is not posted');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Delete inventory register movements
      await tx.inventoryRegister.deleteMany({
        where: {
          recorder: document.id,
          recordType: 'GoodsSale',
        },
      });

      // 2. Delete financial register movements
      await tx.financialRegister.deleteMany({
        where: {
          recorder: document.id,
          recordType: 'GoodsSale',
        },
      });

      // 3. Delete accounting entries
      await tx.accountingEntry.deleteMany({
        where: {
          recorder: document.id,
          recordType: 'GoodsSale',
        },
      });

      // 4. Mark document as unposted
      await this.repository.markAsUnposted(id);

      this.logger.log(`✅ Goods sale unposted successfully: ${document.number}`);

      const unposted = await this.repository.findById(id);
      return new GoodsSaleResponse(unposted);
    });
  }
}
