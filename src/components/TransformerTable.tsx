import { useMemo, useState, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table';
import type { Transformer } from '@/types/transformer';
import { useTableStore } from '@/store/tableStore';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface TransformerTableProps {
  data: Transformer[];
}

const columnHelper = createColumnHelper<Transformer>();

const SORT_ICONS = {
  asc: ' ↑',
  desc: ' ↓',
} as const;

export function TransformerTable({ data }: TransformerTableProps) {
  const {
    searchQuery,
    regionFilter,
    healthFilter,
    setSearchQuery,
    setRegionFilter,
    setHealthFilter,
    resetFilters,
  } = useTableStore();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery]
  );

  const handleRegionChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRegionFilter(e.target.value);
    },
    [setRegionFilter]
  );

  const handleHealthChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setHealthFilter(e.target.value);
    },
    [setHealthFilter]
  );

  // Extract unique regions and health statuses for filters
  const regions = useMemo(() => {
    const uniqueRegions = new Set(data.map((t) => t.region));
    return Array.from(uniqueRegions).sort();
  }, [data]);

  const healthStatuses = useMemo(() => {
    const uniqueHealth = new Set(data.map((t) => t.health));
    return Array.from(uniqueHealth).sort();
  }, [data]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor('region', {
        header: 'Region',
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor('health', {
        header: 'Health',
        cell: (info) => <Badge variant={info.getValue()}>{info.getValue()}</Badge>,
      }),
    ],
    []
  );

  // Apply custom filters from Zustand store
  const filteredData = useMemo(() => {
    let filtered = data;

    if (searchQuery) {
      filtered = filtered.filter((transformer) =>
        transformer.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (regionFilter) {
      filtered = filtered.filter((transformer) => transformer.region === regionFilter);
    }

    if (healthFilter) {
      filtered = filtered.filter((transformer) => transformer.health === healthFilter);
    }

    return filtered;
  }, [data, searchQuery, regionFilter, healthFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transformers</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="max-w-sm"
            />
          </div>
          <div className="flex gap-2">
            <Select value={regionFilter} onChange={handleRegionChange} className="w-40">
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </Select>
            <Select value={healthFilter} onChange={handleHealthChange} className="w-40">
              <option value="">All Health</option>
              {healthStatuses.map((health) => (
                <option key={health} value={health}>
                  {health}
                </option>
              ))}
            </Select>
            {(searchQuery || regionFilter || healthFilter) && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left font-medium text-gray-700 cursor-pointer select-none hover:bg-gray-100"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {SORT_ICONS[header.column.getIsSorted() as keyof typeof SORT_ICONS] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                    No transformers found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredData.length} of {data.length} transformers
        </div>
      </CardContent>
    </Card>
  );
}
