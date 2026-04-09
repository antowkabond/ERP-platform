'use client';

import { useState } from 'react';
import { InventoryBalanceConfig } from '@/lib/api/reports';

interface ReportFiltersProps {
  onFilter: (config: InventoryBalanceConfig) => void;
  warehouses?: Array<{ id: string; code: string; description: string }>;
  items?: Array<{ id: string; code: string; description: string }>;
}

export function ReportFilters({ onFilter, warehouses, items }: ReportFiltersProps) {
  const [config, setConfig] = useState<InventoryBalanceConfig>({
    showOnlyNonZero: true,
    minimumQuantity: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(config);
  };

  const handleReset = () => {
    const resetConfig: InventoryBalanceConfig = {
      showOnlyNonZero: true,
      minimumQuantity: 0,
    };
    setConfig(resetConfig);
    onFilter(resetConfig);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Report Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Date From */}
        <div>
          <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
            Date From
          </label>
          <input
            type="date"
            id="dateFrom"
            value={config.dateFrom || ''}
            onChange={(e) => setConfig({ ...config, dateFrom: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Date To */}
        <div>
          <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
            Date To
          </label>
          <input
            type="date"
            id="dateTo"
            value={config.dateTo || ''}
            onChange={(e) => setConfig({ ...config, dateTo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Warehouse */}
        {warehouses && warehouses.length > 0 && (
          <div>
            <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700 mb-1">
              Warehouse
            </label>
            <select
              id="warehouse"
              value={config.warehouseId || ''}
              onChange={(e) => setConfig({ ...config, warehouseId: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Warehouses</option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.code} - {wh.description}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Item */}
        {items && items.length > 0 && (
          <div>
            <label htmlFor="item" className="block text-sm font-medium text-gray-700 mb-1">
              Item
            </label>
            <select
              id="item"
              value={config.itemId || ''}
              onChange={(e) => setConfig({ ...config, itemId: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Items</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.code} - {item.description}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Minimum Quantity */}
        <div>
          <label htmlFor="minQty" className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Quantity
          </label>
          <input
            type="number"
            id="minQty"
            min="0"
            step="1"
            value={config.minimumQuantity || 0}
            onChange={(e) =>
              setConfig({ ...config, minimumQuantity: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Show Only Non-Zero */}
        <div className="flex items-center pt-6">
          <input
            type="checkbox"
            id="showNonZero"
            checked={config.showOnlyNonZero}
            onChange={(e) => setConfig({ ...config, showOnlyNonZero: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="showNonZero" className="ml-2 block text-sm text-gray-900">
            Show only non-zero balances
          </label>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Generate Report
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Reset Filters
        </button>
      </div>
    </form>
  );
}
