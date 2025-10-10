import { api } from './client';
import type {
  GoodsSale,
  CreateGoodsSaleDto,
  UpdateGoodsSaleDto,
} from '../types/document.types';

// Goods Sale API
export const goodsSaleApi = {
  list: () => api.get<GoodsSale[]>('/documents/goods-sale'),
  get: (id: string) => api.get<GoodsSale>(`/documents/goods-sale/${id}`),
  create: (data: CreateGoodsSaleDto) =>
    api.post<GoodsSale>('/documents/goods-sale', data),
  update: (id: string, data: UpdateGoodsSaleDto) =>
    api.patch<GoodsSale>(`/documents/goods-sale/${id}`, data),
  delete: (id: string) => api.delete(`/documents/goods-sale/${id}`),
  post: (id: string) =>
    api.post<GoodsSale>(`/documents/goods-sale/${id}/post`),
  unpost: (id: string) =>
    api.post<GoodsSale>(`/documents/goods-sale/${id}/unpost`),
};
