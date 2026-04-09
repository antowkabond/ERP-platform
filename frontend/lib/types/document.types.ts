import { DocumentEntity } from './common.types';

// Goods Sale Item
export interface GoodsSaleItem {
  id: string;
  lineNumber: number;
  itemId: string;
  quantity: number;
  price: number;
  amount: number;
}

export interface GoodsSaleItemInput {
  itemId: string;
  quantity: number;
  price: number;
}

// Goods Sale Document
export interface GoodsSale extends DocumentEntity {
  counterpartyId: string;
  warehouseId: string;
  totalAmount: number;
  totalQuantity: number;
  items: GoodsSaleItem[];
  
  // Populated relations
  counterparty?: {
    code: string;
    description: string;
  };
  warehouse?: {
    code: string;
    description: string;
  };
}

export interface CreateGoodsSaleDto {
  date: string;
  counterpartyId: string;
  warehouseId: string;
  items: GoodsSaleItemInput[];
}

export interface UpdateGoodsSaleDto {
  date?: string;
  counterpartyId?: string;
  warehouseId?: string;
  items?: GoodsSaleItemInput[];
}
