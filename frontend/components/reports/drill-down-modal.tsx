'use client';

import { InventoryBalanceDrillDown } from '@/lib/api/reports';

interface DrillDownModalProps {
  data: InventoryBalanceDrillDown | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DrillDownModal({ data, isOpen, onClose }: DrillDownModalProps) {
  if (!isOpen || !data) return null;

  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Movement Details
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  <strong>Item:</strong> {data.itemDescription}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Warehouse:</strong> {data.warehouseDescription}
                </p>
                <p className="text-sm text-gray-700 font-medium mt-2">
                  <strong>Current Balance:</strong> {formatNumber(data.currentBalance, 3)} units
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Movements Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Document Type
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Document ID
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.movements.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-3 text-center text-gray-500">
                        No movements found
                      </td>
                    </tr>
                  ) : (
                    data.movements.map((movement) => (
                      <tr key={movement.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(movement.date)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {movement.recordType}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 font-mono text-xs">
                          {movement.recorder.substring(0, 8)}...
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-center">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              movement.movementType === 'RECEIPT'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {movement.movementType}
                          </span>
                        </td>
                        <td
                          className={`px-4 py-2 whitespace-nowrap text-right text-sm font-medium ${
                            movement.quantity >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {formatNumber(movement.quantity, 3)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right text-sm text-gray-900">
                          ${formatNumber(Math.abs(movement.amount))}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                          {formatNumber(movement.runningBalance, 3)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
