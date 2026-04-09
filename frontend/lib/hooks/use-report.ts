import { useQuery, useMutation } from '@tanstack/react-query';
import { reportsApi, InventoryBalanceConfig } from '../api/reports';
import { useState } from 'react';

export function useInventoryBalanceReport(config: InventoryBalanceConfig) {
  return useQuery({
    queryKey: ['inventoryBalanceReport', config],
    queryFn: () => reportsApi.inventoryBalance.generate(config),
    enabled: !!config, // Only run when config is provided
  });
}

export function useInventoryBalanceDrillDown() {
  return useMutation({
    mutationFn: ({
      config,
      itemId,
      warehouseId,
    }: {
      config: InventoryBalanceConfig;
      itemId: string;
      warehouseId: string;
    }) => reportsApi.inventoryBalance.drillDown(config, itemId, warehouseId),
  });
}

export function useReportExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportExcel = async (config: InventoryBalanceConfig, filename?: string) => {
    setIsExporting(true);
    setError(null);
    try {
      const blob = await reportsApi.inventoryBalance.exportExcel(config);
      downloadBlob(blob, filename || 'inventory-balance-report.xlsx');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
      throw err;
    } finally {
      setIsExporting(false);
    }
  };

  const exportPdf = async (config: InventoryBalanceConfig, filename?: string) => {
    setIsExporting(true);
    setError(null);
    try {
      const blob = await reportsApi.inventoryBalance.exportPdf(config);
      downloadBlob(blob, filename || 'inventory-balance-report.pdf');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
      throw err;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportExcel,
    exportPdf,
    isExporting,
    error,
  };
}

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
