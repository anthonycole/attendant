'use client';

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type PaginationState,
} from '@tanstack/react-table';
import { useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  IconButton,
  Text,
  Select,
} from '@chakra-ui/react';
import {
  FiChevronUp,
  FiChevronDown,
  FiChevronsLeft,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
} from 'react-icons/fi';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  enableSorting?: boolean;
  enablePagination?: boolean;
  enableFiltering?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  enableSorting = true,
  enablePagination = false,
  enableFiltering = false,
  pageSize = 10,
  emptyMessage = 'No data available',
  onRowClick,
  isLoading = false,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
  });

  return (
    <Box>
      {/* Table */}
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDirection = header.column.getIsSorted();

                  return (
                    <Th
                      key={header.id}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      cursor={canSort ? 'pointer' : 'default'}
                      userSelect={canSort ? 'none' : 'auto'}
                      _hover={canSort ? { bg: 'gray.50' } : undefined}
                      textTransform="none"
                      fontSize="sm"
                      fontWeight="600"
                      color="gray.700"
                      letterSpacing="normal"
                      py={3}
                      px={4}
                    >
                      <HStack spacing={2} justify="space-between">
                        <Text>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </Text>
                        {canSort && (
                          <Box>
                            {sortDirection === 'asc' && <FiChevronUp size={14} />}
                            {sortDirection === 'desc' && <FiChevronDown size={14} />}
                          </Box>
                        )}
                      </HStack>
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={columns.length} textAlign="center" py={8}>
                  <Text color="gray.500">Loading...</Text>
                </Td>
              </Tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <Tr>
                <Td colSpan={columns.length} textAlign="center" py={8}>
                  <Text color="gray.500">{emptyMessage}</Text>
                </Td>
              </Tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <Tr
                  key={row.id}
                  _hover={{ bg: 'gray.50' }}
                  cursor={onRowClick ? 'pointer' : 'default'}
                  onClick={() => onRowClick?.(row.original)}
                  transition="background-color 0.15s ease"
                >
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id} py={3} px={4}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      {enablePagination && data.length > 0 && (
        <HStack justify="space-between" mt={4} px={2}>
          <HStack spacing={2}>
            <Text fontSize="sm" color="gray.600">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                data.length
              )}{' '}
              of {data.length} results
            </Text>
          </HStack>

          <HStack spacing={2}>
            <IconButton
              aria-label="First page"
              icon={<FiChevronsLeft />}
              size="sm"
              onClick={() => table.setPageIndex(0)}
              isDisabled={!table.getCanPreviousPage()}
              variant="ghost"
            />
            <IconButton
              aria-label="Previous page"
              icon={<FiChevronLeft />}
              size="sm"
              onClick={() => table.previousPage()}
              isDisabled={!table.getCanPreviousPage()}
              variant="ghost"
            />
            <HStack spacing={1}>
              <Text fontSize="sm" color="gray.600">
                Page
              </Text>
              <Text fontSize="sm" fontWeight="500">
                {table.getState().pagination.pageIndex + 1}
              </Text>
              <Text fontSize="sm" color="gray.600">
                of {table.getPageCount()}
              </Text>
            </HStack>
            <IconButton
              aria-label="Next page"
              icon={<FiChevronRight />}
              size="sm"
              onClick={() => table.nextPage()}
              isDisabled={!table.getCanNextPage()}
              variant="ghost"
            />
            <IconButton
              aria-label="Last page"
              icon={<FiChevronsRight />}
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              isDisabled={!table.getCanNextPage()}
              variant="ghost"
            />
            <Select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              size="sm"
              w="auto"
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </Select>
          </HStack>
        </HStack>
      )}
    </Box>
  );
}
