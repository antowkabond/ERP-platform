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
- **API Documentation:** Swagger/OpenAPI

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
