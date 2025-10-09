# Copilot Instructions for ERP/Accounting System

## Repository Overview

This is a **NestJS-based ERP and Accounting System API** following **1C:Enterprise architecture patterns**. The system provides comprehensive business management capabilities including accounting, inventory management, HR, financial operations, and reporting.

**Key Technologies:**
- **Backend Framework:** NestJS (Node.js 18+)
- **Frontend Framework:** Next.js (React 18+)
- **Language:** TypeScript (ES2020)
- **ORM:** Prisma with PostgreSQL
- **Message Queue:** Bull (Redis-based)
- **Testing:** Jest
- **Monitoring:** Datadog tracing (dd-trace)
- **Authentication:** Auth0
- **API Documentatio/n:** Swagger/OpenAPI

---

## Backend Architecture (NestJS)

### Core Principles from 1C:Enterprise

This system follows **1C:Enterprise architecture patterns**, which means:

1. **Metadata-Driven Design** - Business objects are defined declaratively
2. **Universal Procedures** - Reusable, polymorphic functions that work across object types
3. **Three-Tier Object Model** - Clear separation between Catalogs, Documents, and Registers
4. **Event-Driven Posting** - Documents generate register movements when posted
5. **Accumulation Registers** - Track resource movements (inventory, money, etc.)
6. **Information Registers** - Store periodic or independent data
7. **Hierarchical Catalogs** - Support for tree structures in reference data

### Backend Directory Structure

```
src/
├── main.ts                          # Application entry point
├── main.module.ts                   # Root module
├── tracer.ts                        # Datadog tracing setup
├── app/                             # Application layer
│   ├── app.module.ts
│   ├── controllers/                 # Generic controllers
│   ├── enums/                       # Shared enums
│   ├── exceptions/                  # Custom exceptions
│   └── pipes/                       # Global pipes
├── infrastructure/                   # Infrastructure layer
│   ├── infrastructure.module.ts
│   ├── configuration/               # Config management
│   │   ├── configuration.module.ts
│   │   ├── partials/               # Config partials
│   │   │   ├── app.config.ts
│   │   │   ├── auth.config.ts
│   │   │   └── database.config.ts
│   │   └── types/                  # Config interfaces
│   ├── cqrs/                       # CQRS implementation
│   │   ├── cqrs.module.ts
│   │   ├── commands/               # Command handlers
│   │   └── listeners/              # Event handlers
│   ├── crypto/                     # Encryption/hashing
│   │   ├── crypto.module.ts
│   │   └── services/
│   ├── database/                   # Database layer
│   │   └── prisma/
│   │       ├── prisma.module.ts
│   │       ├── prisma.service.ts
│   │       └── base.query.ts       # Base repository
│   ├── health/                     # Health checks
│   │   ├── health.module.ts
│   │   └── health.controller.ts
│   └── queues/                     # Background jobs
│       └── queues.module.ts
└── modules/                         # Business domain modules
    ├── domains.module.ts            # Domain container
    ├── catalogs/                    # Reference data (master data)
    │   ├── counterparty/
    │   │   ├── counterparty.module.ts
    │   │   ├── controllers/
    │   │   ├── services/
    │   │   ├── persistence/
    │   │   ├── dtos/
    │   │   └── events/
    │   ├── item/                    # Items/Products catalog
    │   └── employee/                # Employees catalog
    ├── documents/                   # Business transactions
    │   ├── goods-receipt/           # Incoming goods
    │   ├── goods-sale/              # Sales documents
    │   ├── payment-order/           # Payment documents
    │   └── invoice/                 # Invoices
    ├── registers/                   # Data accumulation
    │   ├── accumulation/            # Movement registers
    │   │   ├── inventory/           # Inventory movements
    │   │   ├── financials/          # Money movements
    │   │   └── accounting/          # Accounting entries
    │   └── information/             # Information registers
    │       ├── prices/              # Price history
    │       └── exchange-rates/      # Currency rates
    └── reports/                     # Business reports
        ├── inventory-balance/
        ├── sales-analysis/
        └── financial-statements/
```

---

## 1C:Enterprise Object Types

### 1. **Catalogs (Справочники)**
Catalogs store **reference/master data** - relatively static information that other objects reference.

**Characteristics:**
- Have unique `code` and `description` fields
- Can be hierarchical (parent-child relationships)
- Support predefined items
- Used for: counterparties, items, employees, warehouses, currencies, etc.

**Example Prisma Schema:**
```prisma
model Counterparty {
  id           String   @id @default(uuid())
  code         String   @unique
  description  String
  isFolder     Boolean  @default(false)
  parentId     String?
  parent       Counterparty?  @relation("CounterpartyHierarchy", fields: [parentId], references: [id])
  children     Counterparty[] @relation("CounterpartyHierarchy")
  
  // Catalog-specific fields
  taxNumber    String?
  address      String?
  contactPhone String?
  
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  @@map("catalogs_counterparty")
}
```

**Catalog Module Structure:**
```typescript
// catalogs/counterparty/counterparty.module.ts
@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [CounterpartyController],
  providers: [CounterpartyService, CounterpartyRepository],
  exports: [CounterpartyService],
})
export class CounterpartyModule {}

// catalogs/counterparty/dtos/create-counterparty.dto.ts
export class CreateCounterpartyDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsString()
  taxNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

// catalogs/counterparty/services/counterparty.service.ts
@Injectable()
export class CounterpartyService {
  constructor(
    private readonly repository: CounterpartyRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async findAll(): Promise<CounterpartyResponse[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<CounterpartyResponse> {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundException('Counterparty not found');
    return new CounterpartyResponse(item);
  }

  async create(dto: CreateCounterpartyDto): Promise<CounterpartyResponse> {
    // Validate code uniqueness
    const existing = await this.repository.findByCode(dto.code);
    if (existing) throw new ConflictException('Code already exists');

    const item = await this.repository.create(dto);
    
    // Publish event
    await this.commandBus.execute(
      new PublishEventCommand(new CounterpartyCreatedEvent(item.id))
    );

    return new CounterpartyResponse(item);
  }
}
```

---

### 2. **Documents (Документы)**
Documents represent **business transactions** that change the state of the system.

**Characteristics:**
- Have `number` and `date` fields
- Can be **posted** or **unposted**
- When posted, generate movements in registers
- Support document chains (one document can be based on another)
- Contain **tabular sections** (line items)

**Example Prisma Schema:**
```prisma
model GoodsSale {
  id             String   @id @default(uuid())
  number         String   @unique
  date           DateTime
  posted         Boolean  @default(false)
  postedAt       DateTime?
  
  // Document references
  counterpartyId String
  counterparty   Counterparty @relation(fields: [counterpartyId], references: [id])
  warehouseId    String
  warehouse      Warehouse    @relation(fields: [warehouseId], references: [id])
  
  // Tabular section
  items          GoodsSaleItem[]
  
  totalAmount    Decimal  @db.Decimal(15, 2)
  
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  @@map("documents_goods_sale")
}

model GoodsSaleItem {
  id            String   @id @default(uuid())
  documentId    String
  document      GoodsSale @relation(fields: [documentId], references: [id], onDelete: Cascade)
  lineNumber    Int
  
  itemId        String
  item          Item     @relation(fields: [itemId], references: [id])
  
  quantity      Decimal  @db.Decimal(15, 3)
  price         Decimal  @db.Decimal(15, 2)
  amount        Decimal  @db.Decimal(15, 2)
  
  @@map("documents_goods_sale_items")
  @@unique([documentId, lineNumber])
}
```

**Document Module Structure:**
```typescript
// documents/goods-sale/services/goods-sale.service.ts
@Injectable()
export class GoodsSaleService {
  constructor(
    private readonly repository: GoodsSaleRepository,
    private readonly commandBus: CommandBus,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateGoodsSaleDto): Promise<GoodsSaleResponse> {
    // Generate document number
    const number = await this.generateNumber();
    
    const document = await this.repository.create({
      ...dto,
      number,
      posted: false,
    });

    return new GoodsSaleResponse(document);
  }

  async post(id: string): Promise<GoodsSaleResponse> {
    const document = await this.repository.findById(id);
    if (!document) throw new NotFoundException('Document not found');
    if (document.posted) throw new BadRequestException('Already posted');

    // Start transaction
    return this.prisma.$transaction(async (tx) => {
      // 1. Mark document as posted
      const posted = await this.repository.post(id);

      // 2. Generate register movements
      await this.generateInventoryMovements(posted, tx);
      await this.generateFinancialMovements(posted, tx);

      // 3. Publish event
      await this.commandBus.execute(
        new PublishEventCommand(new GoodsSalePostedEvent(posted.id))
      );

      return new GoodsSaleResponse(posted);
    });
  }

  async unpost(id: string): Promise<GoodsSaleResponse> {
    const document = await this.repository.findById(id);
    if (!document) throw new NotFoundException('Document not found');
    if (!document.posted) throw new BadRequestException('Not posted');

    return this.prisma.$transaction(async (tx) => {
      // 1. Delete register movements
      await this.deleteRegisterMovements(id, tx);

      // 2. Mark as unposted
      const unposted = await this.repository.unpost(id);

      return new GoodsSaleResponse(unposted);
    });
  }

  private async generateInventoryMovements(document: GoodsSale, tx: any) {
    for (const item of document.items) {
      await tx.inventoryRegister.create({
        data: {
          documentId: document.id,
          date: document.date,
          item: { connect: { id: item.itemId } },
          warehouse: { connect: { id: document.warehouseId } },
          quantity: -item.quantity, // Negative for sales
          movementType: 'EXPENSE',
        },
      });
    }
  }

  private async generateFinancialMovements(document: GoodsSale, tx: any) {
    await tx.financialRegister.create({
      data: {
        documentId: document.id,
        date: document.date,
        counterparty: { connect: { id: document.counterpartyId } },
        amount: document.totalAmount,
        movementType: 'INCOME',
      },
    });
  }
}
```

---

### 3. **Registers (Регистры)**
Registers store **accumulated data** generated by posted documents.

#### 3.1 Accumulation Registers (Регистры накопления)
Track **resource movements** (inventory, money, etc.) with receipts and expenses.

**Example Prisma Schema:**
```prisma
enum MovementType {
  RECEIPT
  EXPENSE
}

model InventoryRegister {
  id           String       @id @default(uuid())
  recorder     String       // Document that created this movement
  date         DateTime
  
  // Dimensions (what we track)
  itemId       String
  item         Item         @relation(fields: [itemId], references: [id])
  warehouseId  String
  warehouse    Warehouse    @relation(fields: [warehouseId], references: [id])
  
  // Resources (what we measure)
  quantity     Decimal      @db.Decimal(15, 3)
  amount       Decimal      @db.Decimal(15, 2)
  
  movementType MovementType
  
  createdAt    DateTime     @default(now())
  
  @@map("registers_inventory")
  @@index([itemId, warehouseId, date])
}
```

#### 3.2 Information Registers (Регистры сведений)
Store **periodic or independent data** (prices, exchange rates, settings).

**Example Prisma Schema:**
```prisma
model PricesRegister {
  id        String   @id @default(uuid())
  date      DateTime
  
  itemId    String
  item      Item     @relation(fields: [itemId], references: [id])
  
  priceType String   // "Retail", "Wholesale", etc.
  price     Decimal  @db.Decimal(15, 2)
  currency  String
  
  createdAt DateTime @default(now())
  
  @@map("registers_prices")
  @@unique([itemId, priceType, date])
  @@index([itemId, priceType])
}
```

---

### 4. **Reports (Отчеты)**
Reports query registers and provide business intelligence.

**Report Service Pattern:**
```typescript
// reports/inventory-balance/services/inventory-balance.service.ts
@Injectable()
export class InventoryBalanceService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(config: InventoryBalanceConfig): Promise<InventoryBalanceReport> {
    const { warehouseId, itemId, dateFrom, dateTo } = config;

    // Query accumulation register with balance calculation
    const movements = await this.prisma.$queryRaw`
      SELECT 
        item_id,
        warehouse_id,
        SUM(CASE WHEN movement_type = 'RECEIPT' THEN quantity ELSE -quantity END) as balance_quantity,
        SUM(CASE WHEN movement_type = 'RECEIPT' THEN amount ELSE -amount END) as balance_amount
      FROM registers_inventory
      WHERE date <= ${dateTo}
        ${warehouseId ? Prisma.sql`AND warehouse_id = ${warehouseId}` : Prisma.empty}
        ${itemId ? Prisma.sql`AND item_id = ${itemId}` : Prisma.empty}
      GROUP BY item_id, warehouse_id
      HAVING SUM(CASE WHEN movement_type = 'RECEIPT' THEN quantity ELSE -quantity END) > 0
    `;

    return {
      config,
      data: movements,
      generatedAt: new Date(),
    };
  }

  async drillDown(itemId: string, warehouseId: string, date: Date) {
    // Return source documents for this balance
    return this.prisma.inventoryRegister.findMany({
      where: { itemId, warehouseId, date: { lte: date } },
      include: { item: true, warehouse: true },
      orderBy: { date: 'desc' },
    });
  }

  async exportToExcel(config: InventoryBalanceConfig): Promise<Buffer> {
    const report = await this.generate(config);
    // Use exceljs or similar library to create Excel file
    return excelBuffer;
  }
}
```

---

## Best Practices & Patterns

### 1. **Module Organization**
Every business object (catalog, document, register) should be a separate NestJS module with:
- `module.ts` - Module definition
- `controllers/` - REST API endpoints
- `services/` - Business logic
- `persistence/` - Repository layer (Prisma queries)
- `dtos/` - Data transfer objects (input/output)
- `events/` - Domain events
- `cqrs/listeners/` - Event handlers

### 2. **Universal CRUD Pattern**
Create reusable base classes for common operations:

```typescript
// infrastructure/database/prisma/base.repository.ts
export abstract class BaseRepository<T> {
  constructor(protected readonly prisma: PrismaService) {}

  abstract get model(): any;

  async findAll(): Promise<T[]> {
    return this.model.findMany({ where: { isActive: true } });
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async create(data: any): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: any): Promise<T> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string): Promise<T> {
    return this.model.update({ 
      where: { id }, 
      data: { isActive: false } 
    });
  }
}
```

### 3. **Document Posting Transaction**
Always use Prisma transactions for posting/unposting:

```typescript
async post(id: string): Promise<Document> {
  return this.prisma.$transaction(async (tx) => {
    // 1. Validate document can be posted
    // 2. Mark as posted
    // 3. Generate register movements
    // 4. Publish events
    return posted;
  });
}
```

### 4. **Event-Driven Architecture**
Use CQRS for decoupling:

```typescript
// After creating/posting a document, publish events
await this.commandBus.execute(
  new PublishEventCommand(new DocumentPostedEvent(documentId))
);

// Other modules can listen to these events
@EventsHandler(DocumentPostedEvent)
export class DocumentPostedHandler extends BaseEventHandler<DocumentPostedEvent> {
  async execute(event: DocumentPostedEvent) {
    // Update related data, send notifications, etc.
  }
}
```

### 5. **Validation Rules**
- Catalogs: `code` must be unique
- Documents: `number` must be unique, can only post if valid
- Registers: movements can only be created by posted documents
- All objects: soft delete with `isActive` flag

### 6. **API Endpoint Patterns**
```
Catalogs:
GET    /api/catalogs/:catalogName
POST   /api/catalogs/:catalogName
GET    /api/catalogs/:catalogName/:id
PATCH  /api/catalogs/:catalogName/:id
DELETE /api/catalogs/:catalogName/:id

Documents:
GET    /api/documents/:documentName
POST   /api/documents/:documentName
GET    /api/documents/:documentName/:id
PATCH  /api/documents/:documentName/:id
POST   /api/documents/:documentName/:id/post
POST   /api/documents/:documentName/:id/unpost
DELETE /api/documents/:documentName/:id

Reports:
POST   /api/reports/:reportName
POST   /api/reports/:reportName/export/excel
POST   /api/reports/:reportName/export/pdf
POST   /api/reports/:reportName/drill-down
```

### 7. **Error Handling**
Use NestJS built-in exceptions:
```typescript
throw new NotFoundException('Document not found');
throw new BadRequestException('Document already posted');
throw new ConflictException('Code already exists');
throw new UnauthorizedException('Invalid credentials');
```

### 8. **Testing Strategy**
- **Unit Tests**: Service logic, calculations
- **Integration Tests**: Repository, database queries
- **E2E Tests**: Full API workflows (create → post → generate report)

---

## Development Workflow

### Adding a New Catalog
1. Define Prisma model with `code`, `description`, hierarchy support
2. Run `npx prisma migrate dev --name add-catalog-name`
3. Generate module: `nest g module modules/catalogs/catalog-name`
4. Create controller, service, repository, DTOs
5. Import required modules (CqrsModule, PrismaModule)
6. Register in `DomainsModule`
7. Add Swagger decorators
8. Write tests

### Adding a New Document
1. Define Prisma models (header + tabular sections)
2. Add `posted` boolean, `postedAt` timestamp
3. Create module structure
4. Implement `post()` and `unpost()` methods
5. Define register movement generation logic
6. Create events for posting
7. Add validation rules
8. Write transaction tests

### Adding a New Register
1. Define Prisma model with dimensions and resources
2. Add indexes for query performance
3. Create repository with balance calculation queries
4. Ensure only posted documents can create movements
5. Implement cascade deletion when document is unposted
6. Add aggregation queries for reports

### Adding a New Report
1. Create report service with `generate()` method
2. Implement drill-down to source documents
3. Add export methods (Excel, PDF)
4. Create DTO for report configuration
5. Add controller endpoints
6. Optimize queries with indexes

---

## Frontend Architecture (Next.js)

### Framework & Technologies
- **Framework:** Next.js 14+ (App Router)
- **UI Library:** React 18+
- **Language:** TypeScript
- **Styling:** Tailwind CSS / CSS Modules
- **State Management:** React Context API / Zustand / TanStack Query
- **Form Handling:** React Hook Form with Zod validation
- **API Communication:** Fetch API / Axios with TypeScript types
- **UI Components:** shadcn/ui or custom component library

### Frontend Directory Structure
```
frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── (auth)/              # Auth group
│   │   ├── login/
│   │   └── register/
│   ├── catalogs/            # Catalog views
│   │   ├── counterparty/
│   │   ├── item/
│   │   └── employee/
│   ├── documents/           # Document views
│   │   ├── goods-sale/
│   │   ├── goods-receipt/
│   │   └── payment-order/
│   └── reports/             # Report views
│       ├── inventory/
│       └── sales-analysis/
├── components/              # Reusable components
│   ├── ui/                 # Base UI components
│   ├── catalogs/           # Catalog-specific components
│   │   ├── universal-list.tsx
│   │   └── universal-detail.tsx
│   ├── documents/          # Document-specific components
│   │   ├── document-header.tsx
│   │   └── tabular-section.tsx
│   └── reports/            # Report components
│       └── report-viewer.tsx
├── lib/                    # Utilities
│   ├── api/               # API client
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Helper functions
│   └── types/             # TypeScript types/interfaces
├── public/                # Static assets
└── styles/                # Global styles
```

### Frontend Principles

#### 1. **Universal Components Pattern**
Following the backend's universal procedures approach, create reusable frontend components:

```typescript
// Universal List Component (works for any catalog/document)
interface UniversalListProps<T> {
  objectType: 'catalog' | 'document' | 'register';
  columns: ColumnDef<T>[];
  fetchData: () => Promise<T[]>;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onPost?: (item: T) => void; // For documents
}

function UniversalList<T>({ ... }: UniversalListProps<T>) {
  // Standard features:
  // - Filtering
  // - Sorting
  // - Pagination
  // - Search
  // - CRUD actions
  // - Export
}

// Universal Detail Form (works for any business object)
interface UniversalDetailProps<T> {
  objectType: 'catalog' | 'document';
  schema: ZodSchema<T>;
  fields: FieldConfig[];
  tabularSections?: TabularSectionConfig[];
  onSave: (data: T) => Promise<void>;
  onPost?: (data: T) => Promise<void>; // For documents
}

function UniversalDetail<T>({ ... }: UniversalDetailProps<T>) {
  // Standard features:
  // - Form validation
  // - Field rendering based on type
  // - Tabular sections (for documents)
  // - Save/Post/Delete actions
  // - Status indicators
}
```

#### 2. **Type-Safe API Integration**
Generate TypeScript types from backend DTOs for type-safe API calls:

```typescript
// lib/api/client.ts
import type { CreateCounterpartyDto, CounterpartyResponse } from './types';

export const api = {
  catalogs: {
    counterparty: {
      list: () => fetch<CounterpartyResponse[]>('/api/catalogs/counterparty'),
      get: (id: string) => fetch<CounterpartyResponse>(`/api/catalogs/counterparty/${id}`),
      create: (data: CreateCounterpartyDto) => post('/api/catalogs/counterparty', data),
      update: (id: string, data: Partial<CreateCounterpartyDto>) => 
        patch(`/api/catalogs/counterparty/${id}`, data),
      delete: (id: string) => del(`/api/catalogs/counterparty/${id}`),
    },
  },
  documents: {
    goodsSale: {
      list: () => fetch<GoodsSaleResponse[]>('/api/documents/goods-sale'),
      get: (id: string) => fetch<GoodsSaleResponse>(`/api/documents/goods-sale/${id}`),
      create: (data: CreateGoodsSaleDto) => post('/api/documents/goods-sale', data),
      post: (id: string) => post(`/api/documents/goods-sale/${id}/post`, {}),
      unpost: (id: string) => post(`/api/documents/goods-sale/${id}/unpost`, {}),
    },
  },
  reports: {
    inventory: {
      generate: (config: ReportConfig) => post('/api/reports/inventory', config),
      export: (format: 'excel' | 'pdf', config: ReportConfig) => 
        post(`/api/reports/inventory/export/${format}`, config),
    },
  },
};
```

#### 3. **Server Components & Client Components Balance**
- **Server Components** (default): For data fetching, static content, SEO
- **Client Components**: For interactivity, forms, real-time updates

```typescript
// app/catalogs/counterparty/page.tsx (Server Component)
export default async function CounterpartyPage() {
  const counterparties = await api.catalogs.counterparty.list();
  
  return (
    <div>
      <h1>Counterparties</h1>
      <CounterpartyList initialData={counterparties} />
    </div>
  );
}

// components/catalogs/counterparty-list.tsx (Client Component)
'use client';

export function CounterpartyList({ initialData }: { initialData: CounterpartyResponse[] }) {
  const [data, setData] = useState(initialData);
  // Interactive features: filtering, sorting, CRUD
}
```

#### 4. **Form Handling Best Practices**
Use React Hook Form with Zod for validation matching backend DTOs:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema matching backend DTO
const counterpartySchema = z.object({
  code: z.string().min(1),
  description: z.string().min(1),
  taxNumber: z.string().optional(),
  address: z.string().optional(),
});

type CounterpartyFormData = z.infer<typeof counterpartySchema>;

function CounterpartyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<CounterpartyFormData>({
    resolver: zodResolver(counterpartySchema),
  });
  
  const onSubmit = async (data: CounterpartyFormData) => {
    await api.catalogs.counterparty.create(data);
  };
  
  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

#### 5. **Document-Specific UI Patterns**
Documents require special UI considerations:

```typescript
// components/documents/document-form.tsx
interface DocumentFormProps {
  documentType: 'goods-sale' | 'goods-receipt' | 'payment-order';
  onSave: (data: any) => Promise<void>;
  onPost: (data: any) => Promise<void>;
}

function DocumentForm({ documentType, onSave, onPost }: DocumentFormProps) {
  return (
    <div>
      {/* Header section */}
      <DocumentHeader />
      
      {/* Tabular sections with add/remove/edit rows */}
      <TabularSection 
        items={items}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onEdit={handleEdit}
      />
      
      {/* Actions */}
      <div className="actions">
        <Button onClick={() => handleSave()}>Save</Button>
        <Button onClick={() => handlePost()} variant="primary">
          Post
        </Button>
        <StatusIndicator posted={posted} />
      </div>
    </div>
  );
}
```

#### 6. **Report Viewer with Drill-Down**
Reports must support drill-down navigation:

```typescript
// components/reports/report-viewer.tsx
interface ReportViewerProps {
  reportType: string;
  config: ReportConfig;
}

function ReportViewer({ reportType, config }: ReportViewerProps) {
  const { data } = useQuery(['report', reportType, config], 
    () => api.reports[reportType].generate(config)
  );
  
  const handleDrillDown = async (value: any, dimension: string) => {
    // Navigate to detailed view or show modal with source documents
    const details = await api.reports[reportType].drillDown(value, dimension);
    setDrillDownData(details);
  };
  
  return (
    <div>
      <ReportControls config={config} onConfigChange={setConfig} />
      <ReportTable 
        data={data} 
        onCellClick={handleDrillDown}
      />
      <ExportButtons reportType={reportType} config={config} />
    </div>
  );
}
```

#### 7. **Performance Optimization**
- **Server-side rendering** for initial page loads
- **React Server Components** for non-interactive content
- **Lazy loading** for large lists and reports
- **Optimistic updates** for better UX
- **Caching** with TanStack Query or SWR
- **Virtualization** for large tables (react-virtual)

#### 8. **Authentication & Authorization**
Integrate with Auth0:

```typescript
// lib/auth/auth-provider.tsx
'use client';

import { Auth0Provider } from '@auth0/auth0-react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
      }}
    >
      {children}
    </Auth0Provider>
  );
}

// middleware.ts (Route protection)
import { withAuth } from '@auth0/nextjs-auth0';

export default withAuth();

export const config = {
  matcher: ['/catalogs/:path*', '/documents/:path*', '/reports/:path*'],
};
```

### Frontend Development Guidelines

#### When Creating New Frontend Features

**New Catalog View:**
1. Create page in `app/catalogs/[catalog-name]/page.tsx`
2. Use UniversalList component with catalog-specific configuration
3. Create detail page in `app/catalogs/[catalog-name]/[id]/page.tsx`
4. Use UniversalDetail component with form schema
5. Add API client methods in `lib/api/client.ts`
6. Define TypeScript types from backend DTOs

**New Document View:**
1. Create page in `app/documents/[document-name]/page.tsx`
2. Use DocumentForm component with document-specific configuration
3. Implement tabular section components
4. Add post/unpost actions
5. Show document status indicators
6. Support document chains (fill from base document)

**New Report View:**
1. Create page in `app/reports/[report-name]/page.tsx`
2. Use ReportViewer component
3. Implement report configuration form
4. Add drill-down handlers
5. Support export to Excel/PDF
6. Add charts/visualizations if needed

### UI/UX Best Practices

1. **Consistency**: Use universal components for consistent look and feel
2. **Feedback**: Show loading states, success/error messages
3. **Validation**: Client-side validation matching backend rules
4. **Accessibility**: Proper ARIA labels, keyboard navigation
