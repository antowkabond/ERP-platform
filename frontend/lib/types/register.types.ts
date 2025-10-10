import { MovementType } from './common.types';

export interface InventoryMovement {
  id: string;
  recorder: string;
  recordType: string;
  date: string;
  itemId: string;
  warehouseId: string;
  quantity: number;
  amount: number;
  movementType: MovementType;
  createdAt: string;
}

export interface InventoryBalance {
  itemId: string;
  itemCode: string;
  itemDescription: string;
  warehouseId: string;
  warehouseCode: string;
  warehouseDescription: string;
  quantity: number;
  amount: number;
}
