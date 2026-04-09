export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface CatalogEntity extends BaseEntity {
  code: string;
  description: string;
  isFolder: boolean;
  parentId: string | null;
}

export interface DocumentEntity extends BaseEntity {
  number: string;
  date: string;
  state: DocumentState;
  postedAt: string | null;
}

export enum DocumentState {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
}

export enum MovementType {
  RECEIPT = 'RECEIPT',
  EXPENSE = 'EXPENSE',
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
