# Research & Technology Decisions

**Feature**: Modular ERP/Accounting Platform  
**Date**: 2025-01-26  
**Phase**: 0 - Outline & Research

## Overview

This document records the technology choices, architectural patterns, and best practices research for implementing a 1C-inspired ERP system with document-driven transactions, register-based accumulation, and automatic accounting entry generation.

---

## 1. Backend Framework Selection

### Decision: NestJS 10.x

**Rationale**:
- Built-in support for modular architecture aligns with domain-driven design requirements
- Dependency injection and decorators enable clean separation of concerns
- Native CQRS support (@nestjs/cqrs) perfect for event-driven document posting
- Strong TypeScript support ensures type safety across application
- Extensive ecosystem with official integrations (Prisma, Bull, Auth0, etc.)
- Production-proven for enterprise applications with complex business logic

**Alternatives Considered**:
- **Express.js**: Too low-level, would require significant custom architecture
- **Fastify**: Better performance but less opinionated structure and smaller ecosystem
- **AdonisJS**: Good ORM but weaker TypeScript ecosystem and community support

**Best Practices**:
- Use module-per-domain organization (catalogs, documents, registers, reports)
- Implement base abstract classes for shared behavior (BaseDocument, BaseRegister)
- Leverage guards for authentication and authorization
- Use interceptors for logging, transformation, and error handling
- Apply validation pipes with class-validator on all DTOs

---

## 2. ORM & Database Access

### Decision: Prisma 5.x with PostgreSQL 15+

**Rationale**:
- Type-safe database client generated from schema eliminates runtime errors
- Migrations system with clear history and rollback capabilities
- Excellent support for complex queries and aggregations needed for balance calculations
- Connection pooling and query optimization built-in
- Native support for transactions (critical for document posting atomicity)
- Prisma Studio provides visual database exploration during development

**Alternatives Considered**:
- **TypeORM**: More features but weaker TypeScript inference, verbose entity decorators
- **Sequelize**: Mature but JavaScript-first design, limited TypeScript benefits
- **Knex.js**: Query builder only, would require additional abstraction layer
- **Raw SQL with pg**: Maximum control but loses type safety and migration management

**Best Practices**:
- Define all models in single schema.prisma file with clear relationships
- Use `@@map` and `@map` to control actual database table/column names
- Implement soft delete pattern with `isActive` boolean for audit trail
- Create indexes on frequently queried dimensions (itemId, warehouseId, date)
- Use Prisma's `$transaction()` for multi-step operations (posting documents)
- Leverage Prisma's aggregate and groupBy for balance calculations
- Implement repository pattern with PrismaService for testability

---

## 3. Frontend Framework Selection

### Decision: Next.js 14 with App Router

**Rationale**:
- App Router provides server-side rendering for initial page loads (better performance)
- React Server Components reduce client bundle size for data-fetching components
- File-based routing simplifies organization by business domain
- Built-in API routes for BFF pattern if needed
- Excellent TypeScript support with type-safe routing
- Large community and extensive documentation
- Streaming and Suspense support for progressive report rendering

**Alternatives Considered**:
- **Next.js Pages Router**: Older approach, lacks Server Components benefits
- **Create React App**: Client-side only, no SSR benefits
- **Remix**: Good but smaller ecosystem, less mature
- **Vue.js + Nuxt**: Different framework paradigm, team already knows React

**Best Practices**:
- Use Server Components for data fetching and initial page loads
- Use Client Components for interactive forms and real-time updates
- Implement universal components for catalogs and documents (maximize reuse)
- Use React Hook Form with Zod for form validation matching backend DTOs
- Leverage TanStack Query (React Query) for client-side caching and mutations
- Implement optimistic updates for better perceived performance
- Use loading.tsx and error.tsx for consistent loading/error states

---

## 4. State Management

### Decision: TanStack Query (React Query) + React Context

**Rationale**:
- TanStack Query handles server state (API data, caching, refetching) excellently
- React Context sufficient for client-only UI state (theme, navigation)
- Avoids complexity of Redux/MobX for this use case
- Built-in devtools for debugging queries
- Optimistic updates support for document posting
- Automatic background refetching keeps balances up-to-date

**Alternatives Considered**:
- **Redux Toolkit**: Overkill for mostly server-state-driven app
- **Zustand**: Good for client state but still need separate solution for server state
- **MobX**: Different paradigm, team prefers hooks-based approach
- **Jotai/Recoil**: Atomic state management not needed for this application

**Best Practices**:
- Define query keys consistently (e.g., `['catalog', 'counterparty', id]`)
- Implement custom hooks per domain (useCatalog, useDocument, useReport)
- Use mutation callbacks for cache invalidation after posting
- Configure staleTime and cacheTime appropriately per data type
- Enable refetchOnWindowFocus for critical data (balances)

---

## 5. API Architecture Pattern

### Decision: RESTful API with OpenAPI/Swagger

**Rationale**:
- REST is well-understood by development team
- Clear mapping of CRUD operations to HTTP methods
- OpenAPI spec generation with @nestjs/swagger provides living documentation
- Swagger UI enables API exploration and testing
- Compatible with existing tooling and monitoring systems
- Simpler than GraphQL for straightforward CRUD operations

**Alternatives Considered**:
- **GraphQL**: More flexible queries but adds complexity, no clear benefit for this use case
- **gRPC**: Better performance but requires additional tooling, harder debugging
- **JSON-RPC**: Less standardized, lacks ecosystem tooling

**API Design Patterns**:
```
Catalogs:
  GET    /api/v1/catalogs/:catalogType
  POST   /api/v1/catalogs/:catalogType
  GET    /api/v1/catalogs/:catalogType/:id
  PATCH  /api/v1/catalogs/:catalogType/:id
  DELETE /api/v1/catalogs/:catalogType/:id

Documents:
  GET    /api/v1/documents/:documentType
  POST   /api/v1/documents/:documentType
  GET    /api/v1/documents/:documentType/:id
  PATCH  /api/v1/documents/:documentType/:id
  POST   /api/v1/documents/:documentType/:id/post
  POST   /api/v1/documents/:documentType/:id/unpost
  DELETE /api/v1/documents/:documentType/:id

Registers:
  GET    /api/v1/registers/:registerType/movements
  GET    /api/v1/registers/:registerType/balances
  POST   /api/v1/registers/:registerType/query

Reports:
  POST   /api/v1/reports/:reportType/generate
  POST   /api/v1/reports/:reportType/export/:format
  POST   /api/v1/reports/:reportType/drill-down
```

---

## 6. Authentication & Authorization

### Decision: Auth0 with RBAC

**Rationale**:
- Managed authentication service reduces security implementation burden
- Built-in support for social login, MFA, and password policies
- Role-Based Access Control (RBAC) maps well to user roles (Accountant, Manager, Admin)
- Extensive NestJS integration via passport-jwt strategy
- SDKs for both backend and frontend (Next.js)
- Compliance with security standards (SOC 2, GDPR)

**Alternatives Considered**:
- **Custom JWT**: More control but significant security implementation effort
- **Keycloak**: Self-hosted option but adds operational complexity
- **Firebase Auth**: Good for startups but less enterprise features
- **AWS Cognito**: Vendor lock-in, less flexible than Auth0

**Best Practices**:
- Define roles: Admin, Accountant, Manager, Viewer, Auditor
- Use permissions for fine-grained control (e.g., `post:documents`, `view:reports`)
- Implement guards in NestJS for route-level authorization
- Store user metadata (company, department) in Auth0 user profile
- Use refresh tokens for long-lived sessions
- Implement middleware in Next.js for client-side route protection

---

## 7. Background Job Processing

### Decision: Bull (Redis-based queue)

**Rationale**:
- Native NestJS integration (@nestjs/bull)
- Reliable job queue with retry logic and failure handling
- Perfect for deferred operations (report generation, bulk imports)
- Dashboard (Bull Board) for monitoring and debugging
- Support for job prioritization and scheduled jobs
- Distributed processing for horizontal scaling

**Use Cases**:
- Large report generation (quarterly financial statements)
- Bulk document imports from external systems
- Scheduled balance recalculations
- Email notifications after document posting

**Best Practices**:
- Define processor per job type (ReportGenerationProcessor, ImportProcessor)
- Configure retry limits and backoff strategies
- Store job results in database for user retrieval
- Implement progress tracking for long-running jobs
- Use separate queues for different priorities (critical, normal, low)

---

## 8. Caching Strategy

### Decision: Redis with strategic caching

**Rationale**:
- Shared cache across application instances
- Fast in-memory access for frequently queried data
- TTL support for automatic expiration
- Already used for Bull, reuse same infrastructure

**Caching Candidates**:
- **Catalog data**: Cache for 5 minutes (changes infrequently)
- **Balance queries**: Cache for 1 minute with tag-based invalidation
- **Report results**: Cache for 10 minutes with user-specific keys
- **Chart of accounts**: Cache for 1 hour (rarely changes)
- **Exchange rates**: Cache for 1 day (updated daily)

**Best Practices**:
- Use cache-aside pattern (check cache, query DB if miss, populate cache)
- Implement cache invalidation on relevant mutations (document posting)
- Use cache keys with version numbers for schema changes
- Monitor cache hit rate and adjust TTLs accordingly
- Implement circuit breaker pattern if Redis unavailable

---

## 9. Testing Strategy

### Decision: Tests Not Implemented

**Rationale**:
- Focus on rapid MVP delivery without testing overhead
- Manual QA validation will be performed instead
- Code quality maintained through TypeScript strict mode and linting
- Build pipeline configured to skip test execution

**Testing Infrastructure Setup** (for future reference if needed):
- Test frameworks available but not used: Jest, Supertest, React Testing Library
- Test directories created as placeholders
- Can be enabled later if requirements change

**Quality Assurance Approach**:
- Manual testing by QA team
- Code reviews for quality control
- TypeScript type checking prevents common errors
- ESLint catches code quality issues
- Staging environment for validation before production
- Datadog monitoring for production issue detection

**Build Pipeline Configuration**:
```json
// package.json
{
  "scripts": {
    "build": "nest build",  // No test step
    "start": "nest start",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\""
  }
}
```

---

## 10. Caching Strategy

### Database Optimization

**Indexes**:
```sql
-- Accumulation registers
CREATE INDEX idx_inventory_register_lookup 
  ON inventory_register(item_id, warehouse_id, date);

CREATE INDEX idx_inventory_register_document 
  ON inventory_register(recorder_id);

-- Documents
CREATE INDEX idx_documents_date ON documents_goods_sale(date DESC);
CREATE INDEX idx_documents_posted ON documents_goods_sale(posted, date DESC);

-- Catalogs
CREATE INDEX idx_catalog_code ON catalogs_counterparty(code) 
  WHERE is_active = true;
```

**Query Optimization**:
- Use aggregation queries for balance calculations
- Implement pagination for large result sets (limit/offset)
- Use SELECT specific columns, avoid SELECT *
- Implement read replicas for reporting queries (future scaling)

**Application Optimization**:
- Enable Prisma query logging in development
- Use DataLoader pattern for N+1 query prevention
- Implement batch operations for bulk register entries
- Use database transactions only when necessary (minimize lock time)

**Frontend Optimization**:
- Code splitting with Next.js dynamic imports
- Image optimization with Next.js Image component
- Implement virtual scrolling for large tables (react-virtual)
- Use React.memo for expensive component renders
- Lazy load reports and heavy components

---

## 11. Monitoring & Observability

### Decision: Datadog APM with custom metrics

**Rationale**:
- Distributed tracing across microservices (if needed)
- Custom metrics for business KPIs (documents posted/hour, avg posting time)
- Log aggregation and search
- Infrastructure monitoring (CPU, memory, database)
- Alerting on performance degradation

**Key Metrics to Track**:
- Document posting duration (p50, p95, p99)
- Balance query duration
- Report generation time
- API response times
- Database connection pool usage
- Cache hit rate
- Error rate by endpoint

**Best Practices**:
- Tag all spans with document type, user role
- Log all document posting events with metadata
- Implement custom dashboard for business metrics
- Set up alerts for SLO violations (p95 > 500ms)
- Use trace sampling to reduce costs while maintaining visibility

---

## 12. Data Migration & Seeding

### Decision: Prisma Migrations + Seed Scripts

**Migration Strategy**:
- Use Prisma migration commands for schema changes
- Maintain migration history in version control
- Test migrations against staging database before production
- Document breaking changes and provide rollback procedures
- Use database backups before major migrations

**Seed Data**:
```typescript
// prisma/seed.ts
- Chart of accounts (standard accounting accounts)
- Default warehouses
- Sample counterparties for demo
- Exchange rates (USD, EUR)
- Price types (Retail, Wholesale)
```

**Best Practices**:
- Separate seed data into master data (required) and demo data (optional)
- Use transactions for seed script consistency
- Make seed scripts idempotent (can run multiple times)
- Version seed data with schema migrations

---

## Summary

All technology decisions align with the requirements for:
- **Modularity**: NestJS modules, Next.js route-based organization
- **Performance**: PostgreSQL indexes, Redis caching, query optimization
- **Scalability**: Horizontal scaling with Bull queues, read replicas
- **Type Safety**: TypeScript + Prisma throughout stack
- **Developer Experience**: Strong tooling (Prisma Studio, Swagger UI, React DevTools)
- **Production Readiness**: Auth0, Datadog, comprehensive testing

Next phase: Detailed data model design and API contracts.
