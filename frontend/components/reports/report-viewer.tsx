'use client';

import { InventoryBalanceRow } from '@/lib/api/reports';

interface ReportViewerProps {
  data: InventoryBalanceRow[] | null | undefined;
  onRowClick?: (row: InventoryBalanceRow) => void;
}

export function ReportViewer({ data, onRowClick }: ReportViewerProps) {
  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Ensure data is an array
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Warehouse
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Opening Qty
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Receipt Qty
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Expense Qty
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Closing Qty
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Avg Cost
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Closing Amt
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {safeData.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            safeData.map((row, idx) => (
              <tr
                key={`${row.itemId}-${row.warehouseId}`}
                className={`hover:bg-gray-50 ${
                  onRowClick ? 'cursor-pointer' : ''
                } ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                onClick={() => onRowClick?.(row)}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{row.itemCode}</div>
                  <div className="text-sm text-gray-500">{row.itemDescription}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{row.warehouseCode}</div>
                  <div className="text-sm text-gray-500">{row.warehouseDescription}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                  {formatNumber(row.openingQuantity, 3)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-green-600">
                  {formatNumber(row.receiptQuantity, 3)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-red-600">
                  {formatNumber(row.expenseQuantity, 3)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  {formatNumber(row.closingQuantity, 3)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                  ${formatNumber(row.averageCost)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  ${formatNumber(row.closingAmount)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
