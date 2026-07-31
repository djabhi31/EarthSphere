'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cssVars, spacing, radii, glass } from '@/lib/design-tokens';
import { springs } from '@/lib/motion-presets';

export interface Column<T> {
  key: Extract<keyof T, string>;
  header: string;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
}

/**
 * Premium data table component with sortable columns and zebra striping.
 *
 * @example
 * ```tsx
 * <DataTable columns={[{ key: 'id', header: 'ID', sortable: true }]} data={[{ id: 1 }]} />
 * ```
 */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  className = '',
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: Extract<keyof T, string>;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSort = (key: Extract<keyof T, string>) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  return (
    <div
      className={`w-full overflow-x-auto ${className}`}
      style={{
        ...glass.subtle,
        borderRadius: radii.md,
      }}
    >
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr
            style={{
              background: cssVars.surfaceElevated,
              borderBottom: `1px solid ${cssVars.border}`,
            }}
          >
            {columns.map((col) => (
              <th
                key={col.key}
                className={`p-4 font-medium transition-colors ${
                  col.sortable ? 'cursor-pointer hover:bg-white/5' : ''
                }`}
                style={{ color: cssVars.textSecondary }}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-2">
                  {col.header}
                  {col.sortable && (
                    <span className="flex flex-col text-[10px] leading-[0.5]">
                      <motion.span
                        animate={{
                          opacity: sortConfig?.key === col.key && sortConfig.direction === 'asc' ? 1 : 0.3,
                        }}
                      >
                        ▲
                      </motion.span>
                      <motion.span
                        animate={{
                          opacity: sortConfig?.key === col.key && sortConfig.direction === 'desc' ? 1 : 0.3,
                        }}
                      >
                        ▼
                      </motion.span>
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, i) => (
            <tr
              key={i}
              className="transition-colors hover:bg-white/5"
              style={{
                background: i % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                borderBottom: i === sortedData.length - 1 ? 'none' : `1px solid ${cssVars.borderSubtle}`,
              }}
            >
              {columns.map((col) => (
                <td key={col.key} className="p-4" style={{ color: cssVars.text }}>
                  {row[col.key] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
