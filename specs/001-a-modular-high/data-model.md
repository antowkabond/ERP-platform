# Data Model Design

**Feature**: Modular ERP/Accounting Platform  
**Date**: 2025-01-26  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the complete database schema for the MVP using Prisma schema syntax. The model follows 1C architecture principles with clear separation between Catalogs (reference data), Documents (business transactions), Registers (accumulation and information), and Accounting Entries.

---

## Entity Relationship Diagram

```
┌─────────────────┐
│    Catalogs     │
│  (Master Data)  │
├─────────────────┤
│ Counterparty    │────┐
│ Item            │────┼──────┐
│ Warehouse       │────┘      │
└─────────────────┘           │
                              │ Referenced by
┌─────────────────┐           │
│    Documents    │◄──────────┘
│ (Transactions)  │
├─────────────────┤
│ GoodsReceipt    │───────┐
│ GoodsSale       │───────┼───┐
│ PaymentOrder    │───────┘   │
└─────────────────┘           │ Creates movements
                              │
┌─────────────────┐           │
│    Registers    │◄──────────┘
│  (Accumulation) │
├─────────────────┤
│ Inventory       │
│ Financial       │
└─────────────────┘           │
                              │ Generates entries
┌─────────────────┐           │
│   Accounting    │◄──────────┘
│    Entries      │
├─────────────────┤
│ AccountingEntry │
│ ChartOfAccounts │
└─────────────────┘
```

---

## Prisma Schema

### Base Enums

```prisma
// Movement types for accumulation registers
enum MovementType {
  RECEIPT  // Increases balance
  EXPENSE  // Decreases balance
}

// Document posting state
enum DocumentState {
  DRAFT    // Saved but not posted
  POSTED   // Posted, affects registers
  DELETED  // Soft deleted
}

// Price types
enum PriceType {
  RETAIL
  WHOLESALE
  PURCHASE
}

// Account types for chart of accounts
enum AccountType {
  ASSET
  LIABILITY
  EQUITY
  REVENUE
  EXPENSE
}

// User roles for RBAC
enum UserRole {
  ADMIN
  ACCOUNTANT
  MANAGER
  VIEWER
  AUDITOR
}
```

---

## 1. Catalogs (Master Data)

### 1.1 Counterparty (Customers & Suppliers)

```prisma
model Counterparty {
  id          String   @id @default(uuid())
  code        String   @unique
  description String   @db.VarChar(255)
  
  // Hierarchy support
  isFolder    Boolean  @default(false)
  parentId    String?
  parent      Counterparty?  @relation("CounterpartyHierarchy", fields: [parentId], references: [id], onDelete: Restrict)
  children    Counterparty[] @relation("CounterpartyHierarchy")
  
  // Counterparty-specific attributes
  taxNumber      String?    @db.VarChar(50)
  address        String?    @db.VarChar(500)
  contactPhone   String?    @db.VarChar(50)
  contactEmail   String?    @db.VarChar(255)
  isCustomer     Boolean    @default(true)
  isSupplier     Boolean    @default(false)
  creditLimit    Decimal?   @db.Decimal(15, 2)
  
  // Audit fields
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdBy   String?
  updatedBy   String?
  
  // Relations
  salesDocuments     GoodsSale[]
  receiptsDocuments  GoodsReceipt[]
  paymentsDocuments  PaymentOrder[]
  financialMovements FinancialRegister[]
  
  @@map("catalogs_counterparty")
  @@index([code, isActive])
  @@index([parentId])
  @@index([isCustomer, isSupplier])
}
```

### 1.2 Item (Products & Services)

```prisma
model Item {
  id          String   @id @default(uuid())
  code        String   @unique
  description String   @db.VarChar(255)
  
  // Hierarchy support
  isFolder    Boolean  @default(false)
  parentId    String?
  parent      Item?   @relation("ItemHierarchy", fields: [parentId], references: [id], onDelete: Restrict)
  children    Item[]  @relation("ItemHierarchy")
  
  // Item-specific attributes
  sku              String?   @db.VarChar(100)
  barcode          String?   @db.VarChar(100)
  unitOfMeasure    String    @default("pcs") @db.VarChar(20)
  isInventory      Boolean   @default(true)
  isService        Boolean   @default(false)
  defaultPrice     Decimal?  @db.Decimal(15, 2)
  costPrice        Decimal?  @db.Decimal(15, 2)
  minimumQuantity  Decimal?  @db.Decimal(15, 3)
  
  // Audit fields
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdBy   String?
  updatedBy   String?
  
  // Relations
  saleItems           GoodsSaleItem[]
  receiptItems        GoodsReceiptItem[]
  inventoryMovements  InventoryRegister[]
  priceRecords        PriceRegister[]
  
  @@map("catalogs_item")
  @@index([code, isActive])
  @@index([parentId])
  @@index([sku])
  @@index([isInventory])
}
```

### 1.3 Warehouse (Storage Locations)

```prisma
model Warehouse {
  id          String   @id @default(uuid())
  code        String   @unique
  description String   @db.VarChar(255)
  
  // Hierarchy support
  isFolder    Boolean  @default(false)
  parentId    String?
  parent      Warehouse?  @relation("WarehouseHierarchy", fields: [parentId], references: [id], onDelete: Restrict)
  children    Warehouse[] @relation("WarehouseHierarchy")
  
  // Warehouse-specific attributes
  address          String?  @db.VarChar(500)
  responsiblePerson String? @db.VarChar(255)
  isDefault        Boolean  @default(false)
  
  // Audit fields
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdBy   String?
  updatedBy   String?
  
  // Relations
  salesDocuments     GoodsSale[]
  receiptsDocuments  GoodsReceipt[]
  inventoryMovements InventoryRegister[]
  
  @@map("catalogs_warehouse")
  @@index([code, isActive])
  @@index([parentId])
  @@index([isDefault])
}
```

---

## 2. Documents (Business Transactions)

### 2.1 Goods Receipt (Incoming Stock)

```prisma
model GoodsReceipt {
  id             String        @id @default(uuid())
  number         String        @unique
  date           DateTime
  state          DocumentState @default(DRAFT)
  
  // Document references
  counterpartyId String
  counterparty   Counterparty  @relation(fields: [counterpartyId], references: [id], onDelete: Restrict)
  warehouseId    String
  warehouse      Warehouse     @relation(fields: [warehouseId], references: [id], onDelete: Restrict)
  
  // Document metadata
  comment        String?       @db.VarChar(1000)
  totalAmount    Decimal       @db.Decimal(15, 2)
  totalQuantity  Decimal       @db.Decimal(15, 3)
  
  // Posting information
  postedAt       DateTime?
  postedBy       String?
  
  // Audit fields
  isActive       Boolean       @default(true)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  createdBy      String?
  updatedBy      String?
  
  // Relations
  items              GoodsReceiptItem[]
  inventoryMovements InventoryRegister[]
  accountingEntries  AccountingEntry[]
  
  @@map("documents_goods_receipt")
  @@index([number])
  @@index([date, state])
  @@index([counterpartyId])
  @@index([warehouseId])
  @@index([state, date])
}

model GoodsReceiptItem {
  id            String       @id @default(uuid())
  documentId    String
  document      GoodsReceipt @relation(fields: [documentId], references: [id], onDelete: Cascade)
  lineNumber    Int
  
  // Item reference
  itemId        String
  item          Item         @relation(fields: [itemId], references: [id], onDelete: Restrict)
  
  // Line item data
  quantity      Decimal      @db.Decimal(15, 3)
  price         Decimal      @db.Decimal(15, 2)
  amount        Decimal      @db.Decimal(15, 2)
  
  @@map("documents_goods_receipt_items")
  @@unique([documentId, lineNumber])
  @@index([documentId])
  @@index([itemId])
}
```

### 2.2 Goods Sale (Outgoing Stock)

```prisma
model GoodsSale {
  id             String        @id @default(uuid())
  number         String        @unique
  date           DateTime
  state          DocumentState @default(DRAFT)
  
  // Document references
  counterpartyId String
  counterparty   Counterparty  @relation(fields: [counterpartyId], references: [id], onDelete: Restrict)
  warehouseId    String
  warehouse      Warehouse     @relation(fields: [warehouseId], references: [id], onDelete: Restrict)
  
  // Document metadata
  comment        String?       @db.VarChar(1000)
  totalAmount    Decimal       @db.Decimal(15, 2)
  totalQuantity  Decimal       @db.Decimal(15, 3)
  
  // Posting information
  postedAt       DateTime?
  postedBy       String?
  
  // Audit fields
  isActive       Boolean       @default(true)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  createdBy      String?
  updatedBy      String?
  
  // Relations
  items              GoodsSaleItem[]
  inventoryMovements InventoryRegister[]
  financialMovements FinancialRegister[]
  accountingEntries  AccountingEntry[]
  
  @@map("documents_goods_sale")
  @@index([number])
  @@index([date, state])
  @@index([counterpartyId])
  @@index([warehouseId])
  @@index([state, date])
}

model GoodsSaleItem {
  id            String    @id @default(uuid())
  documentId    String
  document      GoodsSale @relation(fields: [documentId], references: [id], onDelete: Cascade)
  lineNumber    Int
  
  // Item reference
  itemId        String
  item          Item      @relation(fields: [itemId], references: [id], onDelete: Restrict)
  
  // Line item data
  quantity      Decimal   @db.Decimal(15, 3)
  price         Decimal   @db.Decimal(15, 2)
  amount        Decimal   @db.Decimal(15, 2)
  
  @@map("documents_goods_sale_items")
  @@unique([documentId, lineNumber])
  @@index([documentId])
  @@index([itemId])
}
```

### 2.3 Payment Order (Financial Transactions)

```prisma
model PaymentOrder {
  id             String        @id @default(uuid())
  number         String        @unique
  date           DateTime
  state          DocumentState @default(DRAFT)
  
  // Document references
  counterpartyId String
  counterparty   Counterparty  @relation(fields: [counterpartyId], references: [id], onDelete: Restrict)
  
  // Payment details
  amount         Decimal       @db.Decimal(15, 2)
  currency       String        @default("USD") @db.VarChar(3)
  paymentPurpose String?       @db.VarChar(500)
  isIncoming     Boolean       // true = receipt, false = payment
  
  // Document metadata
  comment        String?       @db.VarChar(1000)
  
  // Posting information
  postedAt       DateTime?
  postedBy       String?
  
  // Audit fields
  isActive       Boolean       @default(true)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  createdBy      String?
  updatedBy      String?
  
  // Relations
  financialMovements FinancialRegister[]
  accountingEntries  AccountingEntry[]
  
  @@map("documents_payment_order")
  @@index([number])
  @@index([date, state])
  @@index([counterpartyId])
  @@index([state, date])
  @@index([isIncoming, date])
}
```

---

## 3. Registers

### 3.1 Accumulation Registers

#### Inventory Register (Stock Movements)

```prisma
model InventoryRegister {
  id           String       @id @default(uuid())
  
  // Source document
  recorder     String       // Document ID that created this movement
  recordType   String       // Document type (GoodsReceipt, GoodsSale, etc.)
  date         DateTime
  
  // Dimensions (what we track)
  itemId       String
  item         Item         @relation(fields: [itemId], references: [id], onDelete: Restrict)
  warehouseId  String
  warehouse    Warehouse    @relation(fields: [warehouseId], references: [id], onDelete: Restrict)
  
  // Resources (what we measure)
  quantity     Decimal      @db.Decimal(15, 3)  // Can be negative for EXPENSE
  amount       Decimal      @db.Decimal(15, 2)  // Value in base currency
  
  // Movement type
  movementType MovementType
  
  // Audit
  createdAt    DateTime     @default(now())
  
  // Relations
  goodsReceipt GoodsReceipt? @relation(fields: [recorder], references: [id], onDelete: Cascade)
  goodsSale    GoodsSale?    @relation(fields: [recorder], references: [id], onDelete: Cascade)
  
  @@map("registers_inventory")
  @@index([itemId, warehouseId, date])
  @@index([recorder])
  @@index([date, movementType])
  @@index([itemId, date])
  @@index([warehouseId, date])
}
```

#### Financial Register (Money Movements)

```prisma
model FinancialRegister {
  id              String       @id @default(uuid())
  
  // Source document
  recorder        String       // Document ID that created this movement
  recordType      String       // Document type
  date            DateTime
  
  // Dimensions (what we track)
  counterpartyId  String
  counterparty    Counterparty @relation(fields: [counterpartyId], references: [id], onDelete: Restrict)
  
  // Resources (what we measure)
  amount          Decimal      @db.Decimal(15, 2)  // Can be negative for EXPENSE
  currency        String       @default("USD") @db.VarChar(3)
  
  // Movement type
  movementType    MovementType
  
  // Audit
  createdAt       DateTime     @default(now())
  
  // Relations
  goodsSale       GoodsSale?   @relation(fields: [recorder], references: [id], onDelete: Cascade)
  paymentOrder    PaymentOrder? @relation(fields: [recorder], references: [id], onDelete: Cascade)
  
  @@map("registers_financial")
  @@index([counterpartyId, date])
  @@index([recorder])
  @@index([date, movementType])
  @@index([currency, date])
}
```

### 3.2 Information Registers

#### Price Register (Price History)

```prisma
model PriceRegister {
  id        String    @id @default(uuid())
  date      DateTime  // Effective date
  
  // Dimensions
  itemId    String
  item      Item      @relation(fields: [itemId], references: [id], onDelete: Restrict)
  priceType PriceType
  
  // Resources
  price     Decimal   @db.Decimal(15, 2)
  currency  String    @default("USD") @db.VarChar(3)
  
  // Audit
  createdAt DateTime  @default(now())
  createdBy String?
  
  @@map("registers_prices")
  @@unique([itemId, priceType, date])
  @@index([itemId, priceType])
  @@index([date])
}
```

---

## 4. Accounting

### 4.1 Chart of Accounts

```prisma
model ChartOfAccounts {
  id          String      @id @default(uuid())
  code        String      @unique
  name        String      @db.VarChar(255)
  accountType AccountType
  
  // Hierarchy
  parentId    String?
  parent      ChartOfAccounts?  @relation("AccountHierarchy", fields: [parentId], references: [id], onDelete: Restrict)
  children    ChartOfAccounts[] @relation("AccountHierarchy")
  
  // Account configuration
  isActive    Boolean     @default(true)
  description String?     @db.VarChar(500)
  
  // Relations
  debitEntries  AccountingEntry[] @relation("DebitAccount")
  creditEntries AccountingEntry[] @relation("CreditAccount")
  
  @@map("accounting_chart_of_accounts")
  @@index([code, isActive])
  @@index([accountType])
  @@index([parentId])
}
```

### 4.2 Accounting Entry (Journal Entries)

```prisma
model AccountingEntry {
  id              String   @id @default(uuid())
  
  // Source document
  recorder        String   // Document ID
  recordType      String   // Document type
  date            DateTime // Accounting date
  
  // Entry data
  debitAccountId  String
  debitAccount    ChartOfAccounts @relation("DebitAccount", fields: [debitAccountId], references: [id], onDelete: Restrict)
  creditAccountId String
  creditAccount   ChartOfAccounts @relation("CreditAccount", fields: [creditAccountId], references: [id], onDelete: Restrict)
  
  // Amount
  amount          Decimal  @db.Decimal(15, 2)
  currency        String   @default("USD") @db.VarChar(3)
  
  // Analytics (optional dimensions)
  costCenterId    String?
  projectId       String?
  departmentId    String?
  
  // Description
  description     String?  @db.VarChar(500)
  
  // Audit
  createdAt       DateTime @default(now())
  
  // Relations
  goodsReceipt    GoodsReceipt? @relation(fields: [recorder], references: [id], onDelete: Cascade)
  goodsSale       GoodsSale?    @relation(fields: [recorder], references: [id], onDelete: Cascade)
  paymentOrder    PaymentOrder? @relation(fields: [recorder], references: [id], onDelete: Cascade)
  
  @@map("accounting_entries")
  @@index([recorder])
  @@index([date, debitAccountId])
  @@index([date, creditAccountId])
  @@index([debitAccountId, date])
  @@index([creditAccountId, date])
}
```

---

## 5. System Tables

### 5.1 User Management

```prisma
model User {
  id        String   @id @default(uuid())
  auth0Id   String   @unique  // Auth0 user ID
  email     String   @unique
  name      String?
  role      UserRole @default(VIEWER)
  
  // User metadata
  companyId    String?
  departmentId String?
  
  // Audit
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  lastLogin DateTime?
  
  @@map("system_users")
  @@index([auth0Id])
  @@index([email])
  @@index([role, isActive])
}
```

### 5.2 Audit Log

```prisma
model AuditLog {
  id         String   @id @default(uuid())
  timestamp  DateTime @default(now())
  
  // Who
  userId     String
  userName   String
  
  // What
  entityType String   @db.VarChar(100)  // Counterparty, GoodsSale, etc.
  entityId   String
  action     String   @db.VarChar(50)   // CREATE, UPDATE, DELETE, POST, UNPOST
  
  // Details
  oldValues  Json?    // Previous state
  newValues  Json?    // New state
  
  // Context
  ipAddress  String?  @db.VarChar(50)
  userAgent  String?  @db.VarChar(500)
  
  @@map("system_audit_log")
  @@index([entityType, entityId])
  @@index([userId, timestamp])
  @@index([timestamp])
  @@index([action, timestamp])
}
```

---

## Validation Rules

### Catalog Validation
- `code` must be unique within catalog type
- `description` required, min 1 character
- Parent references must exist and not create circular hierarchies
- Cannot delete if referenced in posted documents

### Document Validation
- `number` must be unique within document type
- `date` cannot be in future
- Line items must have positive quantities
- Referenced catalog entries must exist and be active
- Posting requires all line items valid
- Cannot modify posted documents (must unpost first)
- Total amounts must match sum of line items

### Register Validation
- Movement records must reference valid source document
- Inventory movements require valid item + warehouse combination
- Date must match source document date
- Negative balances prevented by pre-posting validation
- Cannot manually create movements (only through document posting)

### Accounting Validation
- Debit and credit accounts must exist and be active
- Amount must be positive
- Currency must be valid (USD, EUR, etc.)
- Entries always created in balanced pairs
- Cannot manually create entries (generated by posting rules)

---

## State Transitions

### Document States
```
DRAFT ──post()──> POSTED ──unpost()──> DRAFT
  │                  │
  └──delete()──> DELETED
```

### Posting Workflow
1. Validate document data
2. Check business rules (inventory availability)
3. Begin database transaction
4. Create register movements
5. Generate accounting entries
6. Update document state to POSTED
7. Commit transaction
8. Publish events

### Unposting Workflow
1. Begin database transaction
2. Delete accounting entries
3. Delete register movements
4. Update document state to DRAFT
5. Commit transaction
6. Publish events

---

## Performance Considerations

### Indexing Strategy
- All foreign keys indexed automatically
- Composite indexes on frequently queried dimension combinations
- Date columns indexed for historical queries
- State/status columns indexed for filtering
- Unique constraints on code/number fields

### Query Optimization
- Balance calculations use aggregation with WHERE date <=
- Report queries use covering indexes
- Pagination implemented with cursor-based approach
- Denormalized totals on document headers

### Scaling Considerations
- Partition large tables by date (future: yearly partitions for registers)
- Read replicas for reporting queries
- Connection pooling (Prisma handles automatically)
- Cache frequently accessed catalogs

---

## Migration Strategy

### Initial Migration
```sql
-- Creates all tables with indexes
-- Seeds chart of accounts
-- Creates default admin user
```

### Future Migrations
- Always backward compatible when possible
- Use transactions for data migrations
- Test against staging database first
- Maintain rollback scripts

---

This data model provides the foundation for MVP implementation with clear extension points for additional catalogs, documents, and registers as the system grows.
