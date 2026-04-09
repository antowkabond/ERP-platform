# Base Document Services

This directory contains abstract base classes for implementing document types in the 1C-style ERP system.

## Overview

All document types (GoodsSale, GoodsReceipt, PaymentOrder, etc.) should extend these base classes to inherit common functionality and ensure consistent behavior.

## BaseDocumentService

Provides standard CRUD operations for all documents.

### Usage

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { BaseDocumentService } from '../base';
import { GoodsSaleRepository } from '../persistence/goods-sale.repository';
import { CreateGoodsSaleDto, UpdateGoodsSaleDto, GoodsSaleResponse } from '../dtos';
import { GoodsSale } from '@prisma/client';

@Injectable()
export class GoodsSaleService extends BaseDocumentService<
  GoodsSale,
  CreateGoodsSaleDto,
  UpdateGoodsSaleDto,
  GoodsSaleResponse
> {
  protected readonly logger = new Logger(GoodsSaleService.name);
  protected readonly repository: GoodsSaleRepository;

  constructor(repository: GoodsSaleRepository) {
    super();
    this.repository = repository;
  }

  protected toResponse(document: GoodsSale): GoodsSaleResponse {
    return new GoodsSaleResponse(document);
  }
}
```

### Provided Methods

- `findAll()` - Get all documents
- `findById(id)` - Get document by ID
- `create(dto)` - Create new document
- `update(id, dto)` - Update document (prevents updating posted documents)
- `delete(id)` - Soft delete document (prevents deleting posted documents)

## BasePostingService

Provides transaction-based posting/unposting logic for documents that affect registers.

### Usage

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { BasePostingService } from '../base';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';
import { GoodsSaleRepository } from '../persistence/goods-sale.repository';
import { GoodsSale } from '@prisma/client';
import { GoodsSaleResponse } from '../dtos';
import { MovementType } from '../../../app/enums';

@Injectable()
export class GoodsSalePostingService extends BasePostingService<
  GoodsSale,
  GoodsSaleResponse
> {
  protected readonly logger = new Logger(GoodsSalePostingService.name);
  
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly repository: GoodsSaleRepository,
  ) {
    super();
  }

  protected async generateRegisterMovements(document: GoodsSale, tx: any): Promise<void> {
    // Create inventory register movements
    for (const item of document.items) {
      await tx.inventoryRegister.create({
        data: {
          recorder: document.id,
          recordType: 'GoodsSale',
          date: document.date,
          itemId: item.itemId,
          warehouseId: document.warehouseId,
          quantity: -item.quantity,
          amount: -item.amount,
          movementType: MovementType.EXPENSE,
        },
      });
    }
  }

  protected async generateAccountingEntries(document: GoodsSale, tx: any): Promise<void> {
    // Find accounts
    const receivablesAccount = await tx.chartOfAccounts.findFirst({
      where: { code: '1200' },
    });
    const revenueAccount = await tx.chartOfAccounts.findFirst({
      where: { code: '4000' },
    });

    // Create accounting entry
    await tx.accountingEntry.create({
      data: {
        recorder: document.id,
        recordType: 'GoodsSale',
        date: document.date,
        debitAccountId: receivablesAccount.id,
        creditAccountId: revenueAccount.id,
        amount: document.totalAmount,
        currency: 'USD',
        description: `Sale: ${document.number}`,
      },
    });
  }

  protected async deleteRegisterMovements(document: GoodsSale, tx: any): Promise<void> {
    await tx.inventoryRegister.deleteMany({
      where: { recorder: document.id },
    });
  }

  protected async deleteAccountingEntries(document: GoodsSale, tx: any): Promise<void> {
    await tx.accountingEntry.deleteMany({
      where: { recorder: document.id },
    });
  }

  protected toResponse(document: GoodsSale): GoodsSaleResponse {
    return new GoodsSaleResponse(document);
  }
}
```

### Provided Methods

- `post(id)` - Post document (creates register movements and accounting entries)
- `unpost(id)` - Unpost document (removes all generated data)

### Transaction Flow

The posting process is fully transactional:

1. **Validate** - Check document state and data
2. **Mark as Posted** - Update document state
3. **Generate Movements** - Create register entries (inventory, financial, etc.)
4. **Generate Accounting** - Create accounting entries (double-entry bookkeeping)
5. **After Posting Hook** - Custom post-posting logic
6. **Commit** - All or nothing

If any step fails, the entire transaction is rolled back.

### Hooks

Override these methods for custom behavior:

- `validateBeforePosting(document)` - Pre-transaction validation
- `validateInTransaction(document, tx)` - Validation that needs DB access
- `afterPosting(document, tx)` - Post-posting logic (e.g., send notifications)
- `afterUnposting(document, tx)` - Post-unposting logic

## Best Practices

1. **Always use transactions** - The BasePostingService handles this automatically
2. **Validate before posting** - Override `validateBeforePosting` for custom checks
3. **Check inventory availability** - Prevent negative balances
4. **Log all operations** - Use the logger for audit trail
5. **Handle errors gracefully** - Let transactions roll back on failure
6. **Use consistent recorder format** - Document ID for traceability

## Example: Complete Document Implementation

See `backend/src/modules/documents/goods-sale/` for a complete working example that uses these base classes.
