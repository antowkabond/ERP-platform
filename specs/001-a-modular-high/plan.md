# Implementation Plan: Modular ERP/Accounting Platform

**Branch**: `001-a-modular-high` | **Date**: 2025-01-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-a-modular-high/spec.md`

**Note**: This plan details the technical architecture, database schema, API contracts, and implementation approach for the MVP.

## Summary

This plan implements a **1C-inspired ERP/Accounting platform** where all business operations are captured as **documents** that post to **registers** and generate **accounting entries**. The MVP focuses on core P1 functionality: document creation and posting with automatic register and accounting entry generation. The system uses **NestJS** for the backend API with **Prisma ORM** and **PostgreSQL** for data persistence, and **Next.js 14 (App Router)** for the frontend. The architecture emphasizes **universal procedures** for reusable business logic, **event-driven document posting**, and **real-time balance calculations** from register aggregations.


## Technical Context

**Language/Version**: TypeScript 5.3+ with Node.js 18+ LTS  
**Backend Framework**: NestJS 10.x with Express adapter  
**Frontend Framework**: Next.js 14.x with App Router (React 18+)  
**ORM**: Prisma 5.x for type-safe database access  
**Storage**: PostgreSQL 15+ (primary database), Redis 7+ (caching and Bull queues)  
**Testing**: Not implemented - tests skipped in build pipeline  
**Target Platform**: Docker containers (Linux), deployable to cloud platforms (AWS/GCP/Azure)  
**Project Type**: Full-stack web application (monorepo with separate backend/frontend)  
**API Architecture**: RESTful API with OpenAPI/Swagger documentation  
**Authentication**: Auth0 integration for user authentication and authorization  
**Monitoring**: Datadog APM with dd-trace for distributed tracing  
**Performance Goals**: 
  - Document posting: <10 seconds for 100 line items
  - Balance queries: <5 seconds for historical queries
  - Report generation: <15 seconds for quarterly reports with 500k entries
  - API response time: p95 <500ms for CRUD operations
**Constraints**: 
  - ACID transactions required for document posting
  - Real-time balance calculations (no eventual consistency)
  - Strict prevention of negative inventory balances
  - Support 200 concurrent users with <2s average response time
**Scale/Scope**: 
  - MVP: 5 catalog types, 3 document types, 2 register types, 3 reports
  - Target: 1M posted documents, 10M register entries
  - Users: 50-200 concurrent, 500-1000 total

**MVP Feature Scope**:
- **Catalogs**: Counterparty, Item, Warehouse
- **Documents**: Goods Receipt, Goods Sale, Payment Order
- **Registers**: Inventory (accumulation), Prices (information)
- **Reports**: Inventory Balance, Sales Analysis, Financial Summary
- **Core Features**: Document CRUD, posting/unposting, register management, basic reporting


## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on the constitution document, the following principles apply:

✅ **Modular Design**: System organized by domain (catalogs, documents, registers, reports) with clear module boundaries

✅ **Universal Procedures**: Shared services for posting, stock queries, and register management ensure code reuse

✅ **CQRS Architecture**: Commands and events for document posting align with event-driven architecture requirements

✅ **Performance Optimization**: Indexed queries, caching strategy, and atomic operations address performance goals

✅ **Simplicity**: Base abstract classes reduce duplication; universal components in frontend reduce UI code

✅ **Auditability**: Complete audit trails on documents and accounting entries meet compliance requirements

**No violations detected** - all architecture decisions align with constitutional principles.


## Project Structure

### Documentation (this feature)

```
specs/001-a-modular-high/
├── spec.md               # Feature specification (requirements)
├── plan.md              # This file - implementation plan
├── research.md          # Phase 0 output - technology decisions
├── data-model.md        # Phase 1 output - database schema design
├── quickstart.md        # Phase 1 output - developer onboarding
├── contracts/           # Phase 1 output - API contracts
│   ├── openapi.yaml    # OpenAPI 3.0 specification
│   └── schemas/        # JSON schemas for DTOs
└── tasks.md             # Phase 2 output - implementation tasks (created by /tasks)
```

### Source Code (repository root)

```
backend/
├── src/
│   ├── main.ts                          # Application entry point with Datadog tracer
│   ├── main.module.ts                   # Root module
│   ├── app/                             # Application layer
│   │   ├── app.module.ts
│   │   ├── controllers/                 # Generic REST controllers
│   │   ├── enums/                       # Shared enums (MovementType, etc.)
│   │   ├── exceptions/                  # Custom exceptions
│   │   └── pipes/                       # Validation pipes
│   ├── infrastructure/                   # Infrastructure layer
│   │   ├── infrastructure.module.ts
│   │   ├── configuration/               # Config management (env, validation)
│   │   ├── cqrs/                       # CQRS commands/queries/events
│   │   ├── crypto/                     # Encryption/hashing services
│   │   ├── database/                   # Prisma client and migrations
│   │   │   ├── prisma/
│   │   │   │   ├── schema.prisma       # Database schema
│   │   │   │   ├── migrations/         # Migration history
│   │   │   │   └── seed.ts             # Seed data
│   │   │   ├── prisma.module.ts
│   │   │   ├── prisma.service.ts
│   │   │   └── base.repository.ts      # Base repository pattern
│   │   ├── health/                     # Health check endpoints
│   │   └── queues/                     # Bull queue configuration
│   └── modules/                         # Business domain modules
│       ├── domains.module.ts            # Aggregate all domains
│       ├── catalogs/                    # Reference data (master data)
│       │   ├── counterparty/
│       │   │   ├── counterparty.module.ts
│       │   │   ├── controllers/
│       │   │   │   └── counterparty.controller.ts
│       │   │   ├── services/
│       │   │   │   └── counterparty.service.ts
│       │   │   ├── persistence/
│       │   │   │   └── counterparty.repository.ts
│       │   │   ├── dtos/
│       │   │   │   ├── create-counterparty.dto.ts
│       │   │   │   ├── update-counterparty.dto.ts
│       │   │   │   └── counterparty.response.ts
│       │   │   └── events/
│       │   │       └── counterparty-created.event.ts
│       │   ├── item/                    # Items/Products catalog
│       │   │   └── [same structure as counterparty]
│       │   └── warehouse/               # Warehouses catalog
│       │       └── [same structure]
│       ├── documents/                   # Business transactions
│       │   ├── goods-receipt/           # Incoming goods
│       │   │   ├── goods-receipt.module.ts
│       │   │   ├── controllers/
│       │   │   │   └── goods-receipt.controller.ts
│       │   │   ├── services/
│       │   │   │   ├── goods-receipt.service.ts
│       │   │   │   └── goods-receipt-posting.service.ts
│       │   │   ├── persistence/
│       │   │   │   └── goods-receipt.repository.ts
│       │   │   ├── dtos/
│       │   │   │   ├── create-goods-receipt.dto.ts
│       │   │   │   ├── goods-receipt-item.dto.ts
│       │   │   │   └── goods-receipt.response.ts
│       │   │   └── events/
│       │   │       ├── goods-receipt-posted.event.ts
│       │   │       └── goods-receipt-unposted.event.ts
│       │   ├── goods-sale/              # Sales documents
│       │   │   └── [same structure as goods-receipt]
│       │   ├── payment-order/           # Payment documents
│       │   │   └── [same structure]
│       │   └── base/                    # Base document abstractions
│       │       ├── base-document.service.ts
│       │       └── base-posting.service.ts
│       ├── registers/                   # Data accumulation
│       │   ├── accumulation/            # Movement registers
│       │   │   ├── inventory/           # Inventory movements
│       │   │   │   ├── inventory-register.module.ts
│       │   │   │   ├── services/
│       │   │   │   │   ├── inventory-register.service.ts
│       │   │   │   │   └── inventory-balance.service.ts
│       │   │   │   ├── persistence/
│       │   │   │   │   └── inventory-register.repository.ts
│       │   │   │   └── dtos/
│       │   │   │       └── inventory-movement.dto.ts
│       │   │   └── base/
│       │   │       └── base-accumulation-register.service.ts
│       │   └── information/             # Information registers
│       │       ├── prices/              # Price history
│       │       │   ├── prices-register.module.ts
│       │       │   ├── services/
│       │       │   │   └── prices-register.service.ts
│       │       │   ├── persistence/
│       │       │   │   └── prices-register.repository.ts
│       │       │   └── dtos/
│       │       │       └── price-record.dto.ts
│       │       └── base/
│       │           └── base-information-register.service.ts
│       ├── accounting/                  # Accounting entries
│       │   ├── accounting.module.ts
│       │   ├── services/
│       │   │   ├── accounting-entry.service.ts
│       │   │   └── chart-of-accounts.service.ts
│       │   ├── persistence/
│       │   │   ├── accounting-entry.repository.ts
│       │   │   └── chart-of-accounts.repository.ts
│       │   └── dtos/
│       │       └── accounting-entry.dto.ts
│       └── reports/                     # Business reports
│           ├── inventory-balance/
│           │   ├── inventory-balance-report.module.ts
│           │   ├── controllers/
│           │   │   └── inventory-balance-report.controller.ts
│           │   ├── services/
│           │   │   └── inventory-balance-report.service.ts
│           │   └── dtos/
│           │       ├── inventory-balance-config.dto.ts
│           │       └── inventory-balance-report.response.ts
│           ├── sales-analysis/
│           │   └── [same structure]
│           └── base/
│               └── base-report.service.ts
├── test/                                # Test directory (not implemented)
│   ├── unit/                            # Placeholder for unit tests
│   ├── integration/                     # Placeholder for integration tests
│   └── e2e/                            # Placeholder for E2E tests
│   └── README.md                       # Note: Tests ignored in build pipeline
├── prisma/
│   └── schema.prisma                   # Symlink to src/infrastructure/database/prisma/schema.prisma
├── package.json
├── nest-cli.json
├── tsconfig.json
└── Dockerfile

frontend/
├── app/                                 # Next.js App Router
│   ├── layout.tsx                      # Root layout with Auth0Provider
│   ├── page.tsx                        # Dashboard/Home page
│   ├── (auth)/                         # Auth routes group
│   │   ├── login/
│   │   └── callback/
│   ├── catalogs/                       # Catalog views
│   │   ├── counterparty/
│   │   │   ├── page.tsx               # List view (Server Component)
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx           # Detail view
│   │   │   └── new/
│   │   │       └── page.tsx           # Create form
│   │   ├── item/
│   │   │   └── [similar structure]
│   │   └── warehouse/
│   │       └── [similar structure]
│   ├── documents/                      # Document views
│   │   ├── goods-receipt/
│   │   │   ├── page.tsx               # Document list
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx           # Document detail/edit
│   │   │   └── new/
│   │   │       └── page.tsx           # Create document
│   │   ├── goods-sale/
│   │   │   └── [similar structure]
│   │   └── payment-order/
│   │       └── [similar structure]
│   └── reports/                        # Report views
│       ├── inventory-balance/
│       │   └── page.tsx               # Report viewer
│       ├── sales-analysis/
│       │   └── page.tsx
│       └── financial-summary/
│           └── page.tsx
├── components/                         # Reusable components
│   ├── ui/                            # Base UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── [other primitives]
│   ├── catalogs/                      # Catalog-specific components
│   │   ├── universal-list.tsx         # Generic list component
│   │   ├── universal-detail-form.tsx  # Generic detail form
│   │   └── catalog-selector.tsx       # Lookup/autocomplete
│   ├── documents/                     # Document-specific components
│   │   ├── document-header-form.tsx   # Header section form
│   │   ├── tabular-section.tsx        # Line items table
│   │   ├── document-status-badge.tsx  # Status indicator
│   │   └── post-button.tsx            # Post/Unpost actions
│   ├── reports/                       # Report components
│   │   ├── report-viewer.tsx          # Universal report viewer
│   │   ├── report-filters.tsx         # Filter controls
│   │   └── drill-down-modal.tsx       # Drill-down display
│   └── layout/                        # Layout components
│       ├── navigation.tsx             # Main navigation
│       ├── breadcrumbs.tsx
│       └── header.tsx
├── lib/                               # Utilities and helpers
│   ├── api/                          # API client
│   │   ├── client.ts                 # Base fetch client
│   │   ├── catalogs.ts               # Catalog endpoints
│   │   ├── documents.ts              # Document endpoints
│   │   ├── registers.ts              # Register endpoints
│   │   └── reports.ts                # Report endpoints
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-catalog.ts
│   │   ├── use-document.ts
│   │   └── use-report.ts
│   ├── utils/                        # Helper functions
│   │   ├── format.ts                 # Date/number formatting
│   │   ├── validation.ts             # Client-side validation
│   │   └── cn.ts                     # Class name utilities
│   └── types/                        # TypeScript types
│       ├── catalog.types.ts
│       ├── document.types.ts
│       ├── register.types.ts
│       └── report.types.ts
├── public/                            # Static assets
│   └── [images, fonts, etc.]
├── styles/                            # Global styles
│   └── globals.css                   # Tailwind directives
├── middleware.ts                      # Auth middleware
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js

docker-compose.yml                      # Local development services
Dockerfile                              # Multi-stage build
.env.example                           # Environment variables template
```

**Structure Decision**: 

This is a **full-stack web application** with separated backend and frontend. The structure follows:

1. **Backend** (NestJS): Modular architecture organized by business domain (catalogs, documents, registers, reports) with infrastructure and application layers separated. Each module follows consistent structure with controllers, services, repositories (persistence), DTOs, and events.

2. **Frontend** (Next.js): App Router structure with route-based organization. Universal components maximize reuse across catalogs and documents. Server Components used for initial data fetching, Client Components for interactivity.

3. **Shared**: Docker Compose orchestrates PostgreSQL, Redis, and application services for local development.


## Complexity Tracking

*No Constitution violations - complexity table not needed.*

The architecture follows constitutional principles:
- Modular design with clear domain boundaries
- Universal procedures for code reuse
- Simple, testable patterns throughout
- Performance optimization through indexing and caching
- Complete auditability with event sourcing

---

## Phase 0: Research (Complete)

✅ **Output**: `research.md` - All technology decisions documented with rationale

Key decisions:
- **Backend**: NestJS 10.x with Prisma ORM and PostgreSQL
- **Frontend**: Next.js 14 with App Router, TanStack Query for state management
- **Authentication**: Auth0 with RBAC
- **Background Jobs**: Bull (Redis-based queues)
- **Monitoring**: Datadog APM with dd-trace

---

## Phase 1: Design (Complete)

✅ **Output**: `data-model.md` - Complete database schema with Prisma models
✅ **Output**: `contracts/openapi.yaml` - Full REST API specification
✅ **Output**: `quickstart.md` - Developer onboarding guide

### MVP Scope

**Catalogs** (3):
- Counterparty (customers/suppliers)
- Item (products/services)
- Warehouse (storage locations)

**Documents** (3):
- Goods Receipt (incoming stock)
- Goods Sale (outgoing stock/revenue)
- Payment Order (financial transactions)

**Registers** (2):
- Inventory Register (accumulation - stock movements)
- Price Register (information - price history)

**Reports** (3):
- Inventory Balance Report
- Sales Analysis Report
- Financial Summary Report

### Database Schema Highlights

- **23 Prisma models** covering catalogs, documents, registers, accounting, and system tables
- **60+ indexes** for query optimization
- **ACID transactions** for document posting atomicity
- **Audit trail** with createdAt, updatedAt, createdBy, updatedBy fields
- **Soft delete** pattern with isActive flags
- **Hierarchical support** for catalogs (parent-child relationships)

### API Design

- **50+ REST endpoints** following RESTful conventions
- **JWT authentication** with Auth0
- **Pagination** support on all list endpoints
- **Filtering** by state, date range, catalog references
- **Posting actions** as dedicated POST endpoints
- **Export capabilities** for reports (Excel, PDF)

---

## Implementation Guidelines

### Backend Development

1. **Module Creation**:
   - Each business domain is a NestJS module
   - Consistent structure: controllers, services, repositories, DTOs, events
   - Base classes for shared behavior (BaseDocument, BaseRegister)

2. **Document Posting**:
   - Always use Prisma transactions ($transaction)
   - Validate data before posting
   - Check business rules (inventory availability)
   - Create register movements
   - Generate accounting entries
   - Publish events

3. **Code Quality**:
   - Follow TypeScript strict mode
   - Use ESLint for code consistency
   - Prettier for code formatting
   - **Note**: Tests are not implemented - testing skipped in CI/CD pipeline

### Frontend Development

1. **Universal Components**:
   - `UniversalList` for catalog/document lists
   - `UniversalDetailForm` for CRUD forms
   - `TabularSection` for document line items
   - `ReportViewer` for reports

2. **State Management**:
   - TanStack Query for server state (API data)
   - React Context for client state (UI preferences)
   - Custom hooks per domain (useCatalog, useDocument)

3. **Routing**:
   - Server Components for initial data fetching
   - Client Components for interactivity
   - Loading states with loading.tsx
   - Error handling with error.tsx

### Performance Optimization

1. **Database**:
   - Index all foreign keys and frequently queried columns
   - Use composite indexes for multi-column queries
   - Implement pagination with cursor-based approach
   - Cache catalog data (5-minute TTL)

2. **API**:
   - Enable HTTP response compression
   - Implement rate limiting
   - Use connection pooling (Prisma default)
   - Monitor query performance with Datadog

3. **Frontend**:
   - Code splitting with dynamic imports
   - Image optimization with Next.js Image
   - Virtual scrolling for large tables
   - React.memo for expensive renders

---

## Deployment Strategy

### Development Environment
- Docker Compose for PostgreSQL and Redis
- Local NestJS dev server (hot reload)
- Local Next.js dev server (fast refresh)

### Staging Environment
- Docker containers for backend and frontend
- Managed PostgreSQL (AWS RDS or similar)
- Managed Redis (AWS ElastiCache or similar)
- Load balancer for backend instances
- CDN for frontend static assets

### Production Environment
- Kubernetes or ECS for container orchestration
- Horizontal scaling for backend (multiple replicas)
- Read replicas for reporting queries
- Full Datadog monitoring and alerting
- Automated database backups (daily + point-in-time recovery)

---

## Migration Path

### Phase 1: MVP (Current)
- 3 catalogs, 3 documents, 2 registers, 3 reports
- Core posting logic and register calculations
- Basic reporting with drill-down
- Authentication and authorization

### Phase 2: Expansion
- Additional catalogs (Employee, Department, Currency, Account)
- More document types (Invoice, Purchase Order, Payroll)
- Financial register for cash flow tracking
- Advanced reports (Trial Balance, Income Statement, Balance Sheet)

### Phase 3: Advanced Features
- Document chains (Sales Order → Shipment → Invoice)
- Multi-currency support with exchange rates
- Cost center and project tracking
- Batch operations and imports
- Advanced analytics dashboards

### Phase 4: Enterprise Features
- Multi-company support
- Role-based data access (row-level security)
- Workflow approvals
- External integrations (CRM, payment gateways)
- Mobile app support

---

## Success Metrics

### Performance Targets
- Document posting: <10 seconds for 100 line items ✓
- Balance queries: <5 seconds for historical queries ✓
- Report generation: <15 seconds for quarterly reports ✓
- API p95 response time: <500ms ✓

### Quality Metrics
- Code coverage: Not applicable (tests not implemented)
- Zero critical security vulnerabilities
- <5% error rate in production
- 99.5% uptime during business hours
- Manual QA validation before deployment

### User Metrics
- 90% first-attempt posting success rate
- 85% report generation success on first try
- <5% user error rate requiring correction
- 80% user satisfaction after 1 month

---

## Risk Assessment

### Technical Risks

**Risk**: Database performance degrades with large datasets  
**Mitigation**: 
- Proper indexing strategy implemented
- Query optimization during development
- Regular performance testing with production-sized datasets
- Read replicas for reporting queries

**Risk**: Concurrent posting conflicts  
**Mitigation**:
- Database transactions with appropriate isolation levels
- Optimistic locking on document updates
- Retry logic for transient failures
- Comprehensive concurrency testing

**Risk**: Complex balance calculations become slow  
**Mitigation**:
- Aggregation queries optimized with covering indexes
- Redis caching for frequently accessed balances
- Background job for precomputed balance snapshots
- Query performance monitoring with Datadog

### Business Risks

**Risk**: MVP scope creep delays launch  
**Mitigation**:
- Clear MVP scope documented (3 catalogs, 3 documents, 2 registers, 3 reports)
- Additional features deferred to Phase 2
- Weekly scope reviews with stakeholders

**Risk**: User adoption issues  
**Mitigation**:
- Comprehensive quickstart guide for developers
- User training materials
- Intuitive UI with universal components
- Clear error messages and validation feedback

---

## Next Steps

1. **Review & Approval**: Technical lead reviews plan, spec, and contracts
2. **Task Breakdown**: Run `/tasks` command to generate implementation tasks
3. **Sprint Planning**: Prioritize tasks and assign to team members
4. **Development**: Begin implementation following this plan
5. **Testing**: Continuous testing throughout development
6. **Deployment**: Deploy to staging for QA validation
7. **Production**: Launch MVP and monitor metrics

---

## Appendices

### Related Documentation
- [Feature Specification](./spec.md) - Business requirements
- [Clarifications](./spec.md#clarifications) - Requirements clarifications
- [Research](./research.md) - Technology research and decisions
- [Data Model](./data-model.md) - Database schema design
- [API Contract](./contracts/openapi.yaml) - REST API specification
- [Quickstart](./quickstart.md) - Developer onboarding

### External References
- [1C:Enterprise Documentation](https://1c-dn.com/library/) - Architecture inspiration
- [NestJS Documentation](https://docs.nestjs.com/) - Backend framework
- [Next.js Documentation](https://nextjs.org/docs) - Frontend framework
- [Prisma Documentation](https://www.prisma.io/docs) - ORM and migrations

---

**Plan Status**: ✅ Complete - Ready for `/tasks` phase  
**Last Updated**: 2025-01-26  
**Next Command**: `/tasks` to generate implementation task breakdown
