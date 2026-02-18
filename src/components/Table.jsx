/**
 * Table Component
 * Reusable table with pagination, sorting, filtering, and accessibility
 */

import React, { useState, useMemo, useCallback } from 'react';

const Table = ({
  columns = [],
  data = [],
  onRowClick,
  pageSize = 10,
  searchable = true,
  sortable = true,
  loading = false,
  emptyMessage = 'No data available',
}) => {
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  // Validate data is an array
  const safeData = Array.isArray(data) ? data : [];

  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm || safeData.length === 0) return safeData;
    
    return safeData.filter(row => {
      if (!row) return false;
      return columns.some(col => {
        const value = row[col.key];
        return value ? String(value).toLowerCase().includes(searchTerm.toLowerCase()) : false;
      });
    });
  }, [safeData, searchTerm, columns, searchable]);

  const sortedData = useMemo(() => {
    if (!sortable || !sortField || filteredData.length === 0) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      if (!a || !b) return 0;
      
      const aVal = a[sortField];
      const bVal = b[sortField];

      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortOrder === 'asc' ? 1 : -1;
      if (bVal == null) return sortOrder === 'asc' ? -1 : 1;

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredData, sortField, sortOrder, sortable]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  
  // Reset to first page if current page exceeds totalPages
  const currentPage = Math.min(page, totalPages);
  
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = useCallback((key) => {
    if (!sortable) return;
    if (sortField === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(key);
      setSortOrder('asc');
    }
    setPage(1); // Reset to first page on sort
  }, [sortField, sortOrder, sortable]);

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page on search
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  }, [totalPages]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Search Bar */}
      {searchable && (
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search table"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" role="grid">
          <thead className="bg-gray-50 border-b border-gray-200" role="rowgroup">
            <tr role="row">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-left text-sm font-semibold text-gray-900 ${
                    sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => handleSort(col.key)}
                  role="columnheader"
                  aria-sort={sortField === col.key ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {sortable && sortField === col.key && (
                      <span aria-hidden="true">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody role="rowgroup">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-gray-200 hover:bg-gray-50 ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  role="row"
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className="px-6 py-4 text-sm text-gray-600"
                      role="gridcell"
                    >
                      {col.render ? col.render(row[col.key], row) : String(row[col.key] || '-')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {safeData.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {paginatedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}{' '}
            to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
