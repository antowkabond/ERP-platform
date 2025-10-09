# Implementation Guide

## 🎯 Current Status

✅ **Phase 1 Completed**: Setup scripts and foundational structure created

### What's Been Done

1. **Project Structure**
   - ✅ Backend directory structure created (`backend/src/`)
   - ✅ Frontend directory structure created (`frontend/`)
   - ✅ Existing code migrated from root `src/` to `backend/src/`
   - ✅ Old files cleaned up

2. **Setup Scripts Created**
   - ✅ `setup-all.sh` - Complete setup (runs backend + frontend)
   - ✅ `setup-backend.sh` - Backend initialization  
   - ✅ `setup-frontend.sh` - Frontend initialization
   - ✅ `docker-start.sh` - Start PostgreSQL + Redis services
   - All scripts are executable

3. **Configuration Files**
   - ✅ `backend/.env.example` - Backend environment template
   - ✅ `frontend/.env.example` - Frontend environment template
   - ✅ Updated `README.md` with project documentation

4. **Database Schema**
   - ✅ Complete Prisma schema with all 23 models
   - ✅ Includes: Catalogs (3), Documents (3), Registers (3), Accounting (2), System (2)
   - ✅ All indexes, relationships, and enums defined

## 🚀 Next Steps to Get Running

### Step 1: Run Setup

```bash
# From project root
./setup-all.sh
```

This will:
- Install all backend dependencies
- Install all frontend dependencies  
- Generate Prisma Client
- Create .env files from examples

### Step 2: Configure Environment

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://erp_user:erp_pass@localhost:5432/erp_dev"
REDIS_HOST=localhost
REDIS_PORT=6379

# Update these with your Auth0 credentials:
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://api.example.com
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Match backend Auth0 config:
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.example.com
AUTH0_CLIENT_SECRET=your-client-secret
```

### Step 3: Start Services

```bash
# Start PostgreSQL and Redis
./docker-start.sh

# Wait for services to be ready (check with docker-compose ps)
```

### Step 4: Initialize Database

```bash
cd backend

# Create initial migration
npx prisma migrate dev --name init

# Prisma Client is automatically generated during migration
```

### Step 5: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```
Access at: http://localhost:3000
Swagger at: http://localhost:3000/api/docs

**Terminal 2 - Frontend:**
```bash
cd frontend  
npm run dev
```
Access at: http://localhost:3001

## 📋 Implementation Tasks Remaining

According to `specs/001-a-modular-high/tasks.md`, you have **274 tasks** total.

### Completed So Far
- ✅ T001: Backend project structure
- ✅ T002: Frontend project structure
- ✅ T007: docker-compose.yml (already exists)
- ✅ T008: Backend .env.example
- ✅ T009: Frontend .env.example
- ✅ T011: Complete Prisma schema

### Ready to Implement Next

**Phase 2: Foundational (Blocking Prerequisites) - T011-T051**

These are CRITICAL and must be complete before any business logic:

1. **Database & Prisma** (T012-T016)
   - Create seed script
   - Create PrismaModule, PrismaService
   - Create BaseRepository class

2. **Configuration** (T017-T019)
   - ConfigurationModule
   - Config partials (app, database, auth, redis)

3. **Authentication** (T020-T024)
   - AuthModule with Auth0 JWT strategy
   - Guards (JwtAuthGuard, RolesGuard)
   - User service

4. **CQRS** (T025-T028)
   - CQRSModule setup
   - Base handlers

5. **API Infrastructure** (T029-T034)
   - AppModule updates
   - Exception filters
   - Validation pipes
   - Swagger configuration
   - Health module

6. **Other Infrastructure** (T035-T051)
   - Queue module (Bull)
   - Datadog monitoring
   - Frontend infrastructure
   - Base domain classes

## 🎯 Recommended Implementation Order

### Option 1: Manual Implementation (Following tasks.md)
Go through each task in `specs/001-a-modular-high/tasks.md` sequentially.

**Pros**: Full control, learn the architecture deeply
**Cons**: Time-consuming (274 tasks)
**Timeline**: 20-30 days with full team

### Option 2: MVP Fast Track (User Story 1 Only)
Focus only on Phase 1, Phase 2, and Phase 3 (User Story 1).

**Tasks**: T001-T122 (122 tasks)
**Result**: Working system with core document posting
**Timeline**: 10-15 days

### Option 3: AI-Assisted Implementation
Use AI coding assistants (GitHub Copilot, Cursor, etc.) to generate boilerplate code following the patterns established in the existing codebase.

**Strategy**:
1. Implement foundational infrastructure (Phase 2) manually
2. Use AI to generate modules following patterns
3. Test and validate each module

## 🏗️ Architecture Patterns to Follow

### Module Structure
Every business module should follow this structure:
```
module-name/
├── module-name.module.ts
├── controllers/
│   └── module-name.controller.ts
├── services/
│   └── module-name.service.ts
├── persistence/
│   └── module-name.repository.ts
├── dtos/
│   ├── create-module-name.dto.ts
│   ├── update-module-name.dto.ts
│   └── module-name.response.ts
└── events/
    └── module-name-created.event.ts
```

### Repository Pattern
Extend BaseRepository:
```typescript
export class CounterpartyRepository extends BaseRepository<Counterparty> {
  constructor(private prisma: PrismaService) {
    super();
  }
  
  get model() {
    return this.prisma.counterparty;
  }
  
  // Add custom methods
  async findByCode(code: string) {
    return this.model.findUnique({ where: { code } });
  }
}
```

### Service Pattern
```typescript
@Injectable()
export class CounterpartyService {
  constructor(
    private readonly repository: CounterpartyRepository,
    private readonly commandBus: CommandBus,
  ) {}
  
  async findAll(): Promise<CounterpartyResponse[]> {
    const items = await this.repository.findAll();
    return items.map(item => new CounterpartyResponse(item));
  }
  
  async create(dto: CreateCounterpartyDto): Promise<CounterpartyResponse> {
    const item = await this.repository.create(dto);
    await this.commandBus.execute(
      new PublishEventCommand(new CounterpartyCreatedEvent(item.id))
    );
    return new CounterpartyResponse(item);
  }
}
```

### Controller Pattern
```typescript
@Controller('api/v1/catalogs/counterparty')
@UseGuards(JwtAuthGuard)
@ApiTags('Catalogs')
export class CounterpartyController {
  constructor(private readonly service: CounterpartyService) {}
  
  @Get()
  @ApiOperation({ summary: 'List counterparties' })
  async findAll() {
    return this.service.findAll();
  }
  
  @Post()
  @ApiOperation({ summary: 'Create counterparty' })
  async create(@Body() dto: CreateCounterpartyDto) {
    return this.service.create(dto);
  }
}
```

## 🧪 Testing Strategy

**Note**: Tests are not implemented per project requirements. Use manual QA:

1. **After each module**: Test CRUD operations via Swagger UI
2. **After documents**: Test posting/unposting workflow
3. **After registers**: Verify data in Prisma Studio
4. **After reports**: Verify calculations match expectations

## 📊 Progress Tracking

Update `specs/001-a-modular-high/tasks.md` by marking completed tasks:
```markdown
- [x] T001 Create backend project structure
- [ ] T002 Create frontend project structure  
```

## 🆘 Getting Help

1. **Architecture Questions**: Review `specs/001-a-modular-high/plan.md`
2. **Data Model**: Review `specs/001-a-modular-high/data-model.md`
3. **API Contracts**: Review `specs/001-a-modular-high/contracts/openapi.yaml`
4. **Setup Issues**: Review `specs/001-a-modular-high/quickstart.md`

## 📞 Support Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **NestJS Docs**: https://docs.nestjs.com
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

## 🎉 Quick Wins

Want to see something working quickly? Start with:

1. **Setup** (Steps 1-5 above) - Get services running
2. **Create seed data** - Add sample counterparties/items via Prisma Studio
3. **Test API** - Use Swagger UI to test existing endpoints
4. **Build first catalog** - Implement Counterparty module (T052-T069)

Good luck with implementation! 🚀
