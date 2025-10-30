import { apiClient } from './client';

export interface InventoryBalanceConfig {
  warehouseId?: string;
  itemId?: string;
  dateFrom?: string;
  dateTo?: string;
  minimumQuantity?: number;
  showOnlyNonZero?: boolean;
  page?: number;
  perPage?: number;
}

export interface InventoryBalanceRow {
  itemId: string;
  itemCode: string;
  itemDescription: string;
  warehouseId: string;
  warehouseCode: string;
  warehouseDescription: string;
  openingQuantity: number;
  openingAmount: number;
  receiptQuantity: number;
  receiptAmount: number;
  expenseQuantity: number;
  expenseAmount: number;
  closingQuantity: number;
  closingAmount: number;
  averageCost: number;
  unitOfMeasure: string;
}

export interface InventoryBalanceReport {
  data: InventoryBalanceRow[];
  config: InventoryBalanceConfig;
  generatedAt: string;
  pagination?: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalItems: number;
    totalOpeningQuantity: number;
    totalOpeningAmount: number;
    totalReceiptQuantity: number;
    totalReceiptAmount: number;
    totalExpenseQuantity: number;
    totalExpenseAmount: number;
    totalClosingQuantity: number;
    totalClosingAmount: number;
  };
}

export interface InventoryBalanceDrillDown {
  itemId: string;
  itemDescription: string;
  warehouseId: string;
  warehouseDescription: string;
  movements: {
    id: string;
    date: string;
    recorder: string;
    recordType: string;
    quantity: number;
    amount: number;
    movementType: string;
    runningBalance: number;
  }[];
  currentBalance: number;
}

export const reportsApi = {
  inventoryBalance: {
    generate: async (config: InventoryBalanceConfig): Promise<{
      config: InventoryBalanceConfig;
      data: InventoryBalanceReport;
      generatedAt: string;
    }> => {
      return apiClient.post('/reports/inventory-balance/generate', config);
    },

    drillDown: async (
      config: InventoryBalanceConfig,
      itemId: string,
      warehouseId: string,
    ): Promise<InventoryBalanceDrillDown> => {
      return apiClient.post(
        `/reports/inventory-balance/drill-down?itemId=${itemId}&warehouseId=${warehouseId}`,
        config,
      );
    },

    exportExcel: async (config: InventoryBalanceConfig): Promise<Blob> => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/reports/inventory-balance/export/excel`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to export Excel');
      }

      return response.blob();
    },

    exportPdf: async (config: InventoryBalanceConfig): Promise<Blob> => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/reports/inventory-balance/export/pdf`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to export PDF');
      }

      return response.blob();
    },
  },
};
