import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { counterpartyApi, itemApi, warehouseApi } from '../api/catalogs';
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

type CatalogType = 'counterparty' | 'item' | 'warehouse';

const catalogApis = {
  counterparty: counterpartyApi,
  item: itemApi,
  warehouse: warehouseApi,
};

// Generic catalog hook
export function useCatalogList<T>(catalogType: CatalogType) {
  return useQuery({
    queryKey: [catalogType, 'list'],
    queryFn: () => catalogApis[catalogType].list() as Promise<T[]>,
  });
}

export function useCatalogItem<T>(catalogType: CatalogType, id: string | null) {
  return useQuery({
    queryKey: [catalogType, 'detail', id],
    queryFn: () => catalogApis[catalogType].get(id!) as Promise<T>,
    enabled: !!id,
  });
}

// Counterparty hooks
export function useCounterparties() {
  return useCatalogList<Counterparty>('counterparty');
}

export function useCounterparty(id: string | null) {
  return useCatalogItem<Counterparty>('counterparty', id);
}

export function useCreateCounterparty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCounterpartyDto) => counterpartyApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counterparty'] });
    },
  });
}

export function useUpdateCounterparty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCounterpartyDto }) =>
      counterpartyApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['counterparty'] });
      queryClient.invalidateQueries({ queryKey: ['counterparty', 'detail', variables.id] });
    },
  });
}

export function useDeleteCounterparty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => counterpartyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counterparty'] });
    },
  });
}

// Item hooks
export function useItems() {
  return useCatalogList<Item>('item');
}

export function useItem(id: string | null) {
  return useCatalogItem<Item>('item', id);
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateItemDto) => itemApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item'] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateItemDto }) =>
      itemApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['item'] });
      queryClient.invalidateQueries({ queryKey: ['item', 'detail', variables.id] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => itemApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item'] });
    },
  });
}

// Warehouse hooks
export function useWarehouses() {
  return useCatalogList<Warehouse>('warehouse');
}

export function useWarehouse(id: string | null) {
  return useCatalogItem<Warehouse>('warehouse', id);
}

export function useCreateWarehouse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateWarehouseDto) => warehouseApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse'] });
    },
  });
}

export function useUpdateWarehouse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWarehouseDto }) =>
      warehouseApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['warehouse'] });
      queryClient.invalidateQueries({ queryKey: ['warehouse', 'detail', variables.id] });
    },
  });
}

export function useDeleteWarehouse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => warehouseApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse'] });
    },
  });
}
