# 🚀 START HERE - ERP/Accounting Platform Setup

Welcome! This guide gets you from zero to running development environment in **5 minutes**.

## ✅ What's Already Done

Your project has been bootstrapped with:

1. ✅ **Complete Project Structure**
   - Backend (NestJS) in `backend/`
   - Frontend (Next.js) in `frontend/`
   - Your existing code migrated and preserved

2. ✅ **Database Schema**
   - 23 Prisma models ready to use
   - All relationships, indexes, enums defined
   - Located at: `backend/prisma/schema.prisma`

3. ✅ **Setup Scripts**
   - Automated installation scripts
   - Docker service management
   - All ready to run

4. ✅ **Configuration Templates**
   - Environment variable examples
   - Docker Compose ready
   - All config files in place

## 🏃 Quick Start (5 Minutes)

### Step 1: Run Complete Setup (2 min)

```bash
./setup-all.sh
```

This installs everything and generates Prisma Client.

### Step 2: Start Docker Services (30 sec)

```bash
./docker-start.sh
```

Starts PostgreSQL and Redis in Docker containers.

### Step 3: Configure Auth0 (1 min)

**Get Auth0 credentials** (or skip for now - see below):
1. Go to https://auth0.com
2. Create free account
3. Create Application
4. Get: Domain, Client ID, Client Secret, API Audience

**Update configs:**

`backend/.env`:
```env
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-secret
AUTH0_AUDIENCE=https://api.example.com
```

`frontend/.env.local`:
```env
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.example.com
AUTH0_CLIENT_SECRET=your-secret
```

> **Skip Auth0?** Comment out Auth0 guards in controllers to test without auth initially.

### Step 4: Initialize Database (1 min)

```bash
cd backend
npx prisma migrate dev --name init
```

Creates all 23 database tables.

### Step 5: Start Development Servers (30 sec)

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🎉 You're Running!

- **Backend API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs  
- **Frontend**: http://localhost:3001
- **Prisma Studio**: `cd backend && npx prisma studio`

## 📋 What's Next?

You have **274 implementation tasks** in `specs/001-a-modular-high/tasks.md`.

### Option 1: Follow the Task List
Implement features step-by-step following the task breakdown.

**Completed so far**: 6/274 tasks (Phase 1 Setup)
**Next**: Phase 2 Foundational (T012-T051) - Infrastructure modules

### Option 2: Jump to Business Logic
Skip ahead and implement your first feature:

1. **Counterparty Catalog** (T052-T069)
   - Create module, controller, service, repository
   - Test with Swagger UI

2. **Goods Sale Document** (T081-T091)
   - Full document with posting logic
   - Automatic register entries

### Option 3: Use AI Coding Assistant
Generate boilerplate code using the patterns in existing code:

```bash
# Example using GitHub Copilot or Cursor:
"Generate a NestJS module for Counterparty catalog following the pattern in backend/src/modules/"
```

## 📚 Documentation

- **[README.md](./README.md)** - Project overview
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Detailed implementation guide
- **[specs/001-a-modular-high/](./specs/001-a-modular-high/)** - All specification docs
  - `spec.md` - Requirements
  - `plan.md` - Technical plan
  - `data-model.md` - Database schema  
  - `tasks.md` - 274 implementation tasks
  - `quickstart.md` - Developer onboarding

## 🐛 Troubleshooting

### Docker won't start
```bash
# Check if Docker is running
docker ps

# If not, start Docker Desktop
# Then run: ./docker-start.sh
```

### Port already in use
```bash
# Backend (3000)
lsof -ti:3000 | xargs kill -9

# Frontend (3001)  
lsof -ti:3001 | xargs kill -9
```

### Prisma errors
```bash
cd backend

# Regenerate Prisma Client
npx prisma generate

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Dependencies issues
```bash
# Backend
cd backend && rm -rf node_modules && npm install

# Frontend
cd frontend && rm -rf node_modules && npm install
```

## 🎯 Milestones

### Milestone 1: API Running ✅
- [x] Setup complete
- [x] Database schema created
- [x] Servers running
- [ ] Auth0 configured

### Milestone 2: First Module
- [ ] Counterparty CRUD working
- [ ] Tested via Swagger
- [ ] Data visible in Prisma Studio

### Milestone 3: First Document
- [ ] Goods Sale document created
- [ ] Document posts successfully
- [ ] Register entries generated
- [ ] Accounting entries created

### Milestone 4: First Report
- [ ] Inventory balance report
- [ ] Drill-down working
- [ ] Excel export

### Milestone 5: MVP Complete
- [ ] 3 Catalogs
- [ ] 3 Documents  
- [ ] 2 Registers
- [ ] 3 Reports
- [ ] All working end-to-end

## 💡 Tips

1. **Use Prisma Studio** - Visual database browser: `cd backend && npx prisma studio`
2. **Test with Swagger** - Interactive API docs at http://localhost:3000/api/docs
3. **Check logs** - Both servers show detailed logs in terminals
4. **Follow patterns** - Look at existing code structure for examples
5. **Commit often** - Git commit after each working feature

## 🆘 Need Help?

- **Setup issues**: Check [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
- **Architecture questions**: Review `specs/001-a-modular-high/plan.md`
- **Database questions**: Review `specs/001-a-modular-high/data-model.md`
- **API questions**: Review `specs/001-a-modular-high/contracts/openapi.yaml`

## 🚀 Ready to Code!

Everything is set up. You can now:

1. **Explore the code** - Check out `backend/src/` structure
2. **Create your first module** - Follow Task T052-T069 for Counterparty
3. **Test immediately** - Use Swagger UI to test endpoints as you build
4. **Iterate quickly** - Hot reload enabled on both backend and frontend

**Happy coding!** 🎉
