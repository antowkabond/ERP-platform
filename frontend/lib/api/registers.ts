import { api } from './client';
import type { InventoryMovement, InventoryBalance } from '../types/register.types';

// Inventory Register API
export const inventoryRegisterApi = {
  getMovements: () => api.get<InventoryMovement[]>('/registers/inventory/movements'),
  getBalances: () => api.get<InventoryBalance[]>('/registers/inventory/balances'),
};
