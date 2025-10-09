# Developer Quickstart Guide

**Feature**: Modular ERP/Accounting Platform  
**Date**: 2025-01-26  
**For**: New developers joining the project

## Overview

This guide helps you set up the development environment, understand the codebase structure, and make your first contribution to the ERP/Accounting platform.

---

## Prerequisites

### Required Software

- **Node.js**: 18+ LTS (use `nvm` to manage versions)
- **npm** or **pnpm**: Package manager (pnpm recommended for faster installs)
- **Docker & Docker Compose**: For PostgreSQL, Redis
- **Git**: Version control
- **VS Code** (recommended) or your preferred IDE

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "ms-azuretools.vscode-docker",
    "firsttris.vscode-jest-runner",
    "orta.vscode-jest"
  ]
}
```

---

## Initial Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd 1-с
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install  # or pnpm install

# Frontend
cd ../frontend
npm install  # or pnpm install
```

### 3. Environment Configuration

Create `.env` files from templates:

**Backend `.env`**:
```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL="postgresql://erp_user:erp_pass@localhost:5432/erp_dev"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Auth0
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://api.example.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# Datadog (optional for local dev)
DD_AGENT_HOST=localhost
DD_TRACE_ENABLED=false

# Application
PORT=3000
NODE_ENV=development
```

**Frontend `.env.local`**:
```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:
```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Auth0
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.example.com
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_CALLBACK_URL=http://localhost:3001/api/auth/callback
```

### 4. Start Infrastructure Services

```bash
# From project root
docker-compose up -d

# Check services are running
docker-compose ps
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379

### 5. Database Setup

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with initial data
npx prisma db seed
```

### 6. Start Development Servers

**Terminal 1 - Backend**:
```bash
cd backend
npm run start:dev
```

Backend will be available at `http://localhost:3000`

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

Frontend will be available at `http://localhost:3001`

### 7. Verify Setup

1. **API Health Check**: http://localhost:3000/api/v1/health
2. **Swagger UI**: http://localhost:3000/api/docs
3. **Frontend**: http://localhost:3001
4. **Prisma Studio**: `npx prisma studio` (opens at http://localhost:5555)

**Note**: This project does not include automated tests. Quality assurance is performed through:
- Manual testing by QA team
- Code reviews
- TypeScript type checking
- ESLint linting
- Staging environment validation

---

## Project Structure Overview

```
backend/
├── src/
│   ├── main.ts                    # Entry point
│   ├── infrastructure/            # Cross-cutting concerns
│   │   ├── database/             # Prisma setup
│   │   ├── cqrs/                 # CQRS implementation
│   │   └── configuration/        # Config management
│   └── modules/                   # Business domains
│       ├── catalogs/             # Master data (Counterparty, Item, Warehouse)
│       ├── documents/            # Transactions (GoodsReceipt, GoodsSale, etc.)
│       ├── registers/            # Accumulation & Information registers
│       └── reports/              # Business reports

frontend/
├── app/                          # Next.js App Router
│   ├── catalogs/                # Catalog management UI
│   ├── documents/               # Document entry UI
│   └── reports/                 # Report viewers
├── components/                   # Reusable React components
│   ├── ui/                      # Base components
│   ├── catalogs/                # Catalog-specific
│   └── documents/               # Document-specific
└── lib/                         # Utilities
    ├── api/                     # API client
    ├── hooks/                   # Custom hooks
    └── types/                   # TypeScript types
```

---

## Development Workflow

### Code Quality Checks

**Linting**:
```bash
# Backend
cd backend
npm run lint
npm run lint:fix

# Frontend
cd frontend
npm run lint
npm run lint:fix
```

**Formatting** (Prettier):
```bash
npm run format
```

**TypeScript Type Checking**:
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

**Note**: This project does not implement automated tests. Tests are skipped in the build pipeline to focus on rapid development. Quality is ensured through manual QA, code reviews, and TypeScript type safety.

### Database Management

**View Database**:
```bash
cd backend
npx prisma studio
```

**Create Migration**:
```bash
npx prisma migrate dev --name add_new_field
```

**Reset Database** (⚠️ destroys all data):
```bash
npx prisma migrate reset
```

**Generate Prisma Client** (after schema changes):
```bash
npx prisma generate
```

### Debugging

**Backend (VS Code)**:

Add to `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeArgs": ["-r", "ts-node/register"],
      "args": ["${workspaceFolder}/backend/src/main.ts"],
      "cwd": "${workspaceFolder}/backend",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

**Frontend (Chrome DevTools)**:
- Frontend runs with sourcemaps enabled in dev mode
- Use Chrome DevTools for debugging React components

---

## Common Tasks

### 1. Adding a New Catalog

**Backend**:

1. Define Prisma model in `schema.prisma`
2. Run migration: `npx prisma migrate dev --name add_catalog_name`
3. Create module structure:
```bash
cd backend/src/modules/catalogs
mkdir catalog-name
cd catalog-name
mkdir controllers services persistence dtos events
```

4. Implement files following existing patterns (use Counterparty as template)
5. Register module in `domains.module.ts`

**Frontend**:

1. Create route: `frontend/app/catalogs/catalog-name/page.tsx`
2. Add API client methods: `frontend/lib/api/catalogs.ts`
3. Create types: `frontend/lib/types/catalog.types.ts`
4. Use universal components: `UniversalList`, `UniversalDetailForm`

### 2. Adding a New Document Type

**Backend**:

1. Define Prisma models (document header + items table)
2. Create module in `backend/src/modules/documents/document-name/`
3. Implement posting service that:
   - Creates register movements
   - Generates accounting entries
   - Uses transactions for atomicity
4. Add event handlers for posted/unposted events

**Frontend**:

1. Create routes in `frontend/app/documents/document-name/`
2. Implement document form with:
   - Header section (date, counterparty, warehouse)
   - Tabular section for line items
   - Post/Unpost buttons
3. Add status indicators

### 3. Adding a New Report

**Backend**:

1. Create report module in `backend/src/modules/reports/report-name/`
2. Implement report service with:
   - `generate(config)` method
   - Query optimization for large datasets
   - Export methods (Excel, PDF)

**Frontend**:

1. Create route: `frontend/app/reports/report-name/page.tsx`
2. Implement report viewer with:
   - Filter controls
   - Data table/chart
   - Drill-down capability
   - Export buttons

### 4. Running Specific Module Tests

**Note**: This project does not implement automated tests. The following commands are not applicable:

```bash
# Tests are not implemented
# npm run test -- --testPathPattern=counterparty
# npm run test:cov -- --testPathPattern=counterparty
```

Quality assurance is performed through:
- Manual testing by QA team
- Code reviews for quality control
- TypeScript type checking (npm run build)
- ESLint for code quality (npm run lint)
- Staging environment validation

---

## Key Concepts

### 1. Document-Driven Architecture

All business transactions are represented as **documents** (GoodsReceipt, GoodsSale, PaymentOrder). Documents have two states:
- **DRAFT**: Saved but not affecting registers
- **POSTED**: Finalized, creates register movements and accounting entries

### 2. Register System

**Accumulation Registers** track resource movements:
- InventoryRegister: tracks stock quantities and values
- FinancialRegister: tracks money flows

**Information Registers** store time-based reference data:
- PriceRegister: historical price data
- ExchangeRateRegister: currency conversion rates

### 3. Posting Process

When a document is posted:
1. Validate document data (all required fields, positive quantities)
2. Check business rules (sufficient inventory)
3. Begin database transaction
4. Create register movements
5. Generate accounting entries (double-entry bookkeeping)
6. Update document state to POSTED
7. Commit transaction
8. Publish events (DocumentPostedEvent)

### 4. Universal Procedures

Reusable services used across document types:
- `getInventoryBalance(itemId, warehouseId, date)`: Query balance
- `postToInventoryRegister(document, movements)`: Create movements
- `generateAccountingEntries(document, movements)`: Create journal entries

### 5. CQRS Pattern

Commands and events separate write and read operations:
- **Commands**: `PostDocumentCommand`, `CreateCounterpartyCommand`
- **Events**: `DocumentPostedEvent`, `CounterpartyCreatedEvent`
- **Handlers**: Process commands and react to events

---

## API Testing

### Using Swagger UI

1. Open http://localhost:3000/api/docs
2. Click "Authorize" and enter JWT token
3. Explore and test endpoints

### Using cURL

**Create Counterparty**:
```bash
curl -X POST http://localhost:3000/api/v1/catalogs/counterparty \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "code": "CUST001",
    "description": "Test Customer",
    "isCustomer": true
  }'
```

**Create Goods Receipt**:
```bash
curl -X POST http://localhost:3000/api/v1/documents/goods-receipt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "date": "2025-01-26T10:00:00Z",
    "counterpartyId": "uuid-here",
    "warehouseId": "uuid-here",
    "items": [
      {
        "itemId": "uuid-here",
        "quantity": 10,
        "price": 100
      }
    ]
  }'
```

**Post Document**:
```bash
curl -X POST http://localhost:3000/api/v1/documents/goods-receipt/{id}/post \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using REST Client (VS Code Extension)

Create `test.http` file:
```http
### Variables
@baseUrl = http://localhost:3000/api/v1
@token = YOUR_JWT_TOKEN

### Create Counterparty
POST {{baseUrl}}/catalogs/counterparty
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "code": "CUST001",
  "description": "Test Customer",
  "isCustomer": true
}

### Get Counterparties
GET {{baseUrl}}/catalogs/counterparty
Authorization: Bearer {{token}}
```

---

## Troubleshooting

### Database Connection Issues

**Error**: `Can't reach database server`

**Solution**:
```bash
# Check Docker services
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# Check connection string in .env
echo $DATABASE_URL
```

### Migration Issues

**Error**: `Database schema is not in sync`

**Solution**:
```bash
# Reset database (⚠️ destroys data)
npx prisma migrate reset

# Or apply pending migrations
npx prisma migrate deploy
```

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Find and kill process using port
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run start:dev
```

### Auth0 Issues

**Error**: `Invalid token`

**Solution**:
1. Verify Auth0 configuration in `.env`
2. Check token hasn't expired
3. Ensure audience matches API audience
4. Test token at https://jwt.io

### Module Import Errors

**Error**: `Cannot find module '@/lib/utils'`

**Solution**:
```bash
# Regenerate TypeScript paths
npm run build

# Check tsconfig.json paths configuration
cat tsconfig.json | grep paths
```

---

## Additional Resources

### Documentation
- [NestJS Docs](https://docs.nestjs.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Auth0 Docs](https://auth0.com/docs)

### Internal Docs
- [Spec](./spec.md) - Feature requirements
- [Data Model](./data-model.md) - Database schema
- [API Contract](./contracts/openapi.yaml) - API specification
- [Research](./research.md) - Technology decisions

### Architecture Patterns
- CQRS: Command Query Responsibility Segregation
- Repository Pattern: Data access abstraction
- Universal Procedures: Reusable business logic
- Event-Driven: Decoupled document posting

---

## Getting Help

### Before Asking

1. Check this quickstart guide
2. Search existing issues on GitHub
3. Review relevant documentation links
4. Check test files for usage examples

### Where to Ask

- **Technical Questions**: Team Slack #erp-dev channel
- **Bug Reports**: GitHub Issues
- **Feature Requests**: GitHub Discussions
- **Architecture Decisions**: Weekly team meeting

---

## Next Steps

Once your environment is set up:

1. **Explore the Codebase**: Read through existing modules (start with Counterparty catalog)
2. **Run Tests**: Make sure all tests pass locally
3. **Make a Small Change**: Try adding a field to a catalog
4. **Create a PR**: Follow the PR template and checklist
5. **Review Code**: Participate in code reviews to learn patterns

Welcome to the team! 🚀
