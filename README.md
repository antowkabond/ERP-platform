# ERP/Accounting Platform

A modular, high-performance ERP and Accounting platform inspired by 1C:Enterprise architecture, built with NestJS, Next.js, and PostgreSQL.

## 🏗️ Architecture

- **Backend**: NestJS 10.x with TypeScript
- **Frontend**: Next.js 14 with App Router  
- **Database**: PostgreSQL 15+ with Prisma ORM
- **Cache/Queue**: Redis 7+
- **Authentication**: Auth0
- **Monitoring**: Datadog APM

## 📋 Features

### Core Principles (1C-Inspired)
- **Document-Driven**: All business operations as documents
- **Register-Based**: Accumulation and information registers
- **Automatic Accounting**: Double-entry bookkeeping generated automatically
- **Universal Procedures**: Reusable business logic across document types

### MVP Scope
- **3 Catalogs**: Counterparty, Item, Warehouse
- **3 Documents**: Goods Receipt, Goods Sale, Payment Order
- **2 Registers**: Inventory (accumulation), Prices (information)
- **3 Reports**: Inventory Balance, Sales Analysis, Financial Summary

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Redis (for queues)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your database connection and other settings

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run start:dev
```

The API will be available at:
- **API**: http://localhost:3000
- **Swagger UI**: http://localhost:3000/swagger-ui
- **Health Check**: http://localhost:3000/health

## 📁 Project Structure

```
src/
├── main.ts                 # Application entry point
├── main.module.ts          # Root module
├── tracer.ts              # Datadog configuration
├── app/                   # Core application layer
│   ├── controllers/       # Root controllers
│   ├── pipes/            # Custom pipes (TrimStrings)
│   ├── exceptions/       # Custom exceptions (Validation)
│   └── enums/            # Global enums
├── infrastructure/        # Infrastructure layer
│   ├── configuration/    # Config management (app, db, auth)
│   ├── database/         # Prisma setup & base classes
│   ├── cqrs/            # CQRS base handlers
│   ├── queues/          # Bull queue configuration
│   ├── crypto/          # Hashing & encryption services
│   └── health/          # Health check endpoints
└── modules/             # Business domain modules
    └── users/           # Example users module
        ├── controllers/
        ├── services/
        ├── persistence/
        ├── dtos/
        ├── events/
        └── cqrs/
```

## 🔧 Available Scripts

```bash
# Development
npm run start:dev        # Start with watch mode
npm run start:debug      # Start with debug mode

# Build
npm run build           # Build production bundle

# Production
npm run start:prod      # Run production server

# Testing
npm run test           # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage

# Linting
npm run lint           # Lint and fix code

# Prisma
npm run prisma:generate        # Generate Prisma client
npm run prisma:migrate         # Create and apply migration
npm run prisma:migrate:deploy  # Apply migrations (production)
npm run prisma:studio          # Open Prisma Studio GUI
npm run prisma:seed            # Seed database
```

## 📝 Architecture Patterns

### CQRS Pattern
All event handlers **MUST** extend `BaseEventHandler<T>`:

```typescript
import { EventsHandler } from '@nestjs/cqrs';
import { BaseEventHandler } from '../../../infrastructure/cqrs/listeners/base-event.handler';

@EventsHandler(YourEvent)
export class YourEventHandler extends BaseEventHandler<YourEvent> {
  async execute(event: YourEvent): Promise<void> {
    this.logger.log('Event received');
    // Your logic here
  }
}
```

**Benefits:**
- Automatic error handling (no app crashes)
- Built-in logger instance
- Clean separation of concerns

### Module Structure
Each business module should follow this structure:

```
module-name/
├── module-name.module.ts    # Module definition
├── controllers/             # REST endpoints
├── services/               # Business logic
├── persistence/            # Database repositories
├── dtos/                   # Data Transfer Objects
├── events/                 # Domain events
├── cqrs/                   # Event handlers
├── exceptions/             # Custom exceptions
└── enums/                  # Module enums
```

## 🗄️ Database

### Prisma Commands

```bash
# Generate Prisma Client (required after schema changes)
npm run prisma:generate

# Create a new migration
npm run prisma:migrate

# Apply migrations to production
npm run prisma:migrate:deploy

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Adding a New Model

1. Edit `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Prisma Client is automatically regenerated

## 🔐 Environment Variables

Key variables in `.env`:

```bash
# App
APP_ENV=local
PORT=3000

# Database
DB_URL=postgresql://user:password@localhost:5432/mydb

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Auth0 (optional)
AUTH_ZERO_DOMAIN=your-tenant.us.auth0.com
AUTH_ZERO_CLIENT_ID=your-client-id
AUTH_ZERO_CLIENT_SECRET=your-secret

# Swagger
SWAGGER_ENABLED=true
SWAGGER_BASIC_AUTH_ENABLED=false

# Encryption
ENCRYPTION_KEY=your-32-char-encryption-key
```

## 📚 API Documentation

Swagger documentation is automatically generated and available at:
- http://localhost:3000/swagger-ui

To enable basic authentication for Swagger:
```bash
SWAGGER_BASIC_AUTH_ENABLED=true
SWAGGER_BASIC_AUTH_USERNAME=admin
SWAGGER_BASIC_AUTH_PASSWORD=secure-password
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov
```

Tests should be placed next to the files they test with `.spec.ts` extension.

## 🎯 Example: Creating a New Module

1. **Create module structure:**
```bash
mkdir -p src/modules/posts/{controllers,services,persistence,dtos,events,cqrs/listeners}
```

2. **Create Prisma model:**
```prisma
model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("posts")
}
```

3. **Generate Prisma client:**
```bash
npm run prisma:migrate
```

4. **Create module files** (controller, service, repository, DTOs)

5. **Register in DomainsModule:**
```typescript
// src/modules/domains.module.ts
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [UsersModule, PostsModule],
})
export class DomainsModule {}
```

## 🚢 Deployment

### Docker
```bash
# Build image
docker build -t api .

# Run container
docker run -p 3000:3000 --env-file .env api
```

### Production Checklist
- [ ] Set `APP_ENV=production`
- [ ] Configure production database URL
- [ ] Set secure `ENCRYPTION_KEY`
- [ ] Configure Auth0 credentials
- [ ] Run `npm run prisma:migrate:deploy`
- [ ] Set up Redis for queues
- [ ] Configure CORS origins
- [ ] Enable Swagger basic auth or disable it

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting: `npm run lint`
4. Run tests: `npm run test`
5. Create a pull request

## 📄 License

MIT

