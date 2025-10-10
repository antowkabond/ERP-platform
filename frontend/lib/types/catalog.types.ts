import { CatalogEntity } from './common.types';

// Counterparty
export interface Counterparty extends CatalogEntity {
  taxNumber: string | null;
  address: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  isCustomer: boolean;
  isSupplier: boolean;
  creditLimit: number | null;
}

export interface CreateCounterpartyDto {
  code: string;
  description: string;
  parentId?: string;
  taxNumber?: string;
  address?: string;
  contactPhone?: string;
  contactEmail?: string;
  isCustomer?: boolean;
  isSupplier?: boolean;
  creditLimit?: number;
}

export interface UpdateCounterpartyDto extends Partial<CreateCounterpartyDto> {}

// Item
export interface Item extends CatalogEntity {
  unitOfMeasure: string;
  defaultPrice: number;
  costPrice: number | null;
  sku: string | null;
  barcode: string | null;
  isInventory: boolean;
  isService: boolean;
}

export interface CreateItemDto {
  code: string;
  description: string;
  parentId?: string;
  unitOfMeasure: string;
  defaultPrice: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  isInventory?: boolean;
  isService?: boolean;
}

export interface UpdateItemDto extends Partial<CreateItemDto> {}

// Warehouse
export interface Warehouse extends CatalogEntity {
  address: string | null;
  responsiblePerson: string | null;
  isDefault: boolean;
}

export interface CreateWarehouseDto {
  code: string;
  description: string;
  parentId?: string;
  address?: string;
  responsiblePerson?: string;
  isDefault?: boolean;
}

export interface UpdateWarehouseDto extends Partial<CreateWarehouseDto> {}
