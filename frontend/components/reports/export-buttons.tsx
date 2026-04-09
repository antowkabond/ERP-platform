'use client';

import { InventoryBalanceConfig } from '@/lib/api/reports';
import { useReportExport } from '@/lib/hooks/use-report';

interface ExportButtonsProps {
  config: InventoryBalanceConfig;
}

export function ExportButtons({ config }: ExportButtonsProps) {
  const { exportExcel, exportPdf, isExporting, error } = useReportExport();

  const handleExcelExport = async () => {
    try {
      await exportExcel(config);
    } catch (err) {
      console.error('Excel export failed:', err);
    }
  };

  const handlePdfExport = async () => {
    try {
      await exportPdf(config);
    } catch (err) {
      console.error('PDF export failed:', err);
      // PDF might not be implemented yet
      alert('PDF export is not yet available. Please use Excel export.');
    }
  };

  return (
    <div className="flex gap-3 items-center">
      <button
        onClick={handleExcelExport}
        disabled={isExporting}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Exporting...
          </>
        ) : (
          <>
            <svg
              className="-ml-1 mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export to Excel
          </>
        )}
      </button>

      <button
        onClick={handlePdfExport}
        disabled={isExporting}
        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          className="-ml-1 mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        Export to PDF
      </button>

      {error && (
        <span className="text-sm text-red-600">Export failed: {error}</span>
      )}
    </div>
  );
}
