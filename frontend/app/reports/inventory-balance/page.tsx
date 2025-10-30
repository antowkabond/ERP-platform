'use client';

import { useState } from 'react';
import { ReportViewer } from '@/components/reports/report-viewer';
import { ReportFilters } from '@/components/reports/report-filters';
import { DrillDownModal } from '@/components/reports/drill-down-modal';
import { ExportButtons } from '@/components/reports/export-buttons';
import { useInventoryBalanceReport, useInventoryBalanceDrillDown } from '@/lib/hooks/use-report';
import { InventoryBalanceConfig, InventoryBalanceRow } from '@/lib/api/reports';

export default function InventoryBalanceReportPage() {
  const [config, setConfig] = useState<InventoryBalanceConfig>({
    showOnlyNonZero: true,
    minimumQuantity: 0,
  });
  const [shouldGenerate, setShouldGenerate] = useState(false);
  const [drillDownOpen, setDrillDownOpen] = useState(false);

  // Fetch report data
  const {
    data: reportResponse,
    isLoading,
    error,
    refetch,
  } = useInventoryBalanceReport(shouldGenerate ? config : ({} as InventoryBalanceConfig));

  // Debug logging
  if (reportResponse) {
    console.log('Report Response:', reportResponse);
    console.log('Report Data:', reportResponse.data);
    console.log('Report Data.data:', reportResponse.data?.data);
    console.log('Is Array:', Array.isArray(reportResponse.data?.data));
  }

  // Drill-down mutation
  const drillDownMutation = useInventoryBalanceDrillDown();

  const handleFilter = (newConfig: InventoryBalanceConfig) => {
    setConfig(newConfig);
    setShouldGenerate(true);
  };

  const handleRowClick = async (row: InventoryBalanceRow) => {
    try {
      await drillDownMutation.mutateAsync({
        config,
        itemId: row.itemId,
        warehouseId: row.warehouseId,
      });
      setDrillDownOpen(true);
    } catch (err) {
      console.error('Failed to fetch drill-down data:', err);
      alert('Failed to load movement details. Please try again.');
    }
  };

  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Balance Report</h1>
        <p className="mt-2 text-sm text-gray-600">
          View current inventory balances with opening, receipt, expense, and closing quantities
        </p>
      </div>

      {/* Filters */}
      <ReportFilters onFilter={handleFilter} />

      {/* Report Content */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Generating report...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error generating report</h3>
              <p className="mt-1 text-sm text-red-700">
                {error instanceof Error ? error.message : 'An unknown error occurred'}
              </p>
            </div>
          </div>
        </div>
      )}

      {reportResponse && reportResponse.data && (
        <div>
          {/* Report Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Report Results</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Generated at:{' '}
                  {new Date(reportResponse.generatedAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <ExportButtons config={config} />
            </div>

            {/* Summary */}
            {reportResponse.data.summary && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Total Items</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {reportResponse.data.summary.totalItems}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-700">Opening Balance</p>
                  <p className="mt-1 text-2xl font-semibold text-blue-900">
                    {formatNumber(reportResponse.data.summary.totalOpeningQuantity, 0)}
                  </p>
                  <p className="text-sm text-blue-600">
                    ${formatNumber(reportResponse.data.summary.totalOpeningAmount)}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-700">Total Receipts</p>
                  <p className="mt-1 text-2xl font-semibold text-green-900">
                    +{formatNumber(reportResponse.data.summary.totalReceiptQuantity, 0)}
                  </p>
                  <p className="text-sm text-green-600">
                    ${formatNumber(reportResponse.data.summary.totalReceiptAmount)}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-purple-700">Closing Balance</p>
                  <p className="mt-1 text-2xl font-semibold text-purple-900">
                    {formatNumber(reportResponse.data.summary.totalClosingQuantity, 0)}
                  </p>
                  <p className="text-sm text-purple-600">
                    ${formatNumber(reportResponse.data.summary.totalClosingAmount)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Report Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ReportViewer
              data={Array.isArray(reportResponse.data.data) ? reportResponse.data.data : []}
              onRowClick={handleRowClick}
            />

            {/* Pagination Info */}
            {reportResponse.data.pagination && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(reportResponse.data.pagination.page - 1) *
                      reportResponse.data.pagination.perPage +
                      1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(
                      reportResponse.data.pagination.page * reportResponse.data.pagination.perPage,
                      reportResponse.data.pagination.total,
                    )}
                  </span>{' '}
                  of <span className="font-medium">{reportResponse.data.pagination.total}</span>{' '}
                  results
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <p>
              💡 <strong>Tip:</strong> Click on any row to see detailed movement history for that
              item and warehouse.
            </p>
          </div>
        </div>
      )}

      {!isLoading && !error && !reportResponse && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-blue-900">No report generated yet</h3>
          <p className="mt-1 text-sm text-blue-700">
            Configure your filters above and click "Generate Report" to view inventory balances.
          </p>
        </div>
      )}

      {/* Drill-Down Modal */}
      <DrillDownModal
        data={drillDownMutation.data || null}
        isOpen={drillDownOpen}
        onClose={() => setDrillDownOpen(false)}
      />
    </div>
  );
}
