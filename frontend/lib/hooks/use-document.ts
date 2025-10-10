import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goodsSaleApi } from '../api/documents';
import type {
  GoodsSale,
  CreateGoodsSaleDto,
  UpdateGoodsSaleDto,
} from '../types/document.types';

// Goods Sale hooks
export function useGoodsSales() {
  return useQuery({
    queryKey: ['goods-sale', 'list'],
    queryFn: () => goodsSaleApi.list(),
  });
}

export function useGoodsSale(id: string | null) {
  return useQuery({
    queryKey: ['goods-sale', 'detail', id],
    queryFn: () => goodsSaleApi.get(id!),
    enabled: !!id,
  });
}

export function useCreateGoodsSale() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateGoodsSaleDto) => goodsSaleApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goods-sale'] });
    },
  });
}

export function useUpdateGoodsSale() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGoodsSaleDto }) =>
      goodsSaleApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['goods-sale'] });
      queryClient.invalidateQueries({ queryKey: ['goods-sale', 'detail', variables.id] });
    },
  });
}

export function useDeleteGoodsSale() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => goodsSaleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goods-sale'] });
    },
  });
}

export function usePostGoodsSale() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => goodsSaleApi.post(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['goods-sale'] });
      queryClient.invalidateQueries({ queryKey: ['goods-sale', 'detail', data.id] });
      // Also invalidate registers as they might have changed
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['accounting'] });
    },
  });
}

export function useUnpostGoodsSale() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => goodsSaleApi.unpost(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['goods-sale'] });
      queryClient.invalidateQueries({ queryKey: ['goods-sale', 'detail', data.id] });
      // Also invalidate registers as they might have changed
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['accounting'] });
    },
  });
}
