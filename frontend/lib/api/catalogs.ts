import { api } from './client';
import type {
  Counterparty,
  CreateCounterpartyDto,
  UpdateCounterpartyDto,
  Item,
  CreateItemDto,
  UpdateItemDto,
  Warehouse,
  CreateWarehouseDto,
  UpdateWarehouseDto,
} from '../types/catalog.types';

// Counterparty API
export const counterpartyApi = {
  list: () => api.get<Counterparty[]>('/catalogs/counterparty'),
  get: (id: string) => api.get<Counterparty>(`/catalogs/counterparty/${id}`),
  create: (data: CreateCounterpartyDto) =>
    api.post<Counterparty>('/catalogs/counterparty', data),
  update: (id: string, data: UpdateCounterpartyDto) =>
    api.patch<Counterparty>(`/catalogs/counterparty/${id}`, data),
  delete: (id: string) => api.delete(`/catalogs/counterparty/${id}`),
  getHierarchy: () => api.get<Counterparty[]>('/catalogs/counterparty/hierarchy'),
};

// Item API
export const itemApi = {
  list: () => api.get<Item[]>('/catalogs/item'),
  get: (id: string) => api.get<Item>(`/catalogs/item/${id}`),
  create: (data: CreateItemDto) => api.post<Item>('/catalogs/item', data),
  update: (id: string, data: UpdateItemDto) =>
    api.patch<Item>(`/catalogs/item/${id}`, data),
  delete: (id: string) => api.delete(`/catalogs/item/${id}`),
  getHierarchy: () => api.get<Item[]>('/catalogs/item/hierarchy'),
};

// Warehouse API
export const warehouseApi = {
  list: () => api.get<Warehouse[]>('/catalogs/warehouse'),
  get: (id: string) => api.get<Warehouse>(`/catalogs/warehouse/${id}`),
  create: (data: CreateWarehouseDto) =>
    api.post<Warehouse>('/catalogs/warehouse', data),
  update: (id: string, data: UpdateWarehouseDto) =>
    api.patch<Warehouse>(`/catalogs/warehouse/${id}`, data),
  delete: (id: string) => api.delete(`/catalogs/warehouse/${id}`),
  getHierarchy: () => api.get<Warehouse[]>('/catalogs/warehouse/hierarchy'),
};
