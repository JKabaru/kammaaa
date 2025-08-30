import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  FunnelIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';
import Button from './Button';
import Badge from './Badge';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  searchable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: any) => void;
  className?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  loading = false,
  searchable = true,
  pagination = true,
  pageSize = 10,
  onRowClick,
  className
}) => {
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Filter data based on search
  const filteredData = data.filter(row => {
    if (!searchQuery) return true;
    return Object.values(row).some(value => 
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = pagination ? sortedData.slice(startIndex, startIndex + pageSize) : sortedData;

  if (loading) {
    return (
      <Card className={className}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-quantum-ember/20 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-quantum-ember/10 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Search and Actions */}
      {searchable && (
        <div className="p-4 border-b border-quantum-ember/20">
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="Search table data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 bg-charcoal border border-quantum-ember/20 rounded-lg text-text-primary placeholder-text-secondary focus:border-quantum-ember focus:ring-2 focus:ring-quantum-ember/20 focus:outline-none"
            />
            <div className="flex items-center space-x-2">
              <Badge variant="default" size="sm">
                {filteredData.length} results
              </Badge>
              <Button variant="ghost" size="sm" icon={<FunnelIcon className="w-4 h-4" />}>
                Filter
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-quantum-ember/20 bg-deep-void/30">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'text-left py-4 px-6 text-text-secondary text-sm uppercase tracking-wide font-medium',
                    column.sortable && 'cursor-pointer hover:text-text-primary transition-colors',
                    column.width && `w-${column.width}`
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        {sortKey === column.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUpIcon className="w-3 h-3 text-quantum-ember" />
                          ) : (
                            <ChevronDownIcon className="w-3 h-3 text-quantum-ember" />
                          )
                        ) : (
                          <ArrowsUpDownIcon className="w-3 h-3 opacity-50" />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className={cn(
                  'border-b border-quantum-ember/10 hover:bg-deep-void/30 transition-colors',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="py-4 px-6 text-text-primary">
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="p-4 border-t border-quantum-ember/20 flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, sortedData.length)} of {sortedData.length} results
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            
            <div className="flex space-x-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      
      {paginatedData.length === 0 && !loading && (
        <div className="text-center py-12 text-text-secondary">
          {searchQuery ? 'No results found for your search' : 'No data available'}
        </div>
      )}
    </Card>
  );
};

export default DataTable;