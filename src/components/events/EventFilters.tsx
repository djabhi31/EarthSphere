"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, SlidersHorizontal, Grid3X3, List, Download } from "lucide-react";
import {
  CATEGORY_CONFIG,
  getCategoryColor,
  getCategoryLabel,
  cn,
} from "@/lib/utils";
import { durations } from "@/lib/design-tokens";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import type { EventStatus, DateRange } from "@/lib/types";

export interface EventFiltersProps {
  /** Current search input value */
  searchInput: string;
  /** Callback when search input changes */
  onSearchChange: (value: string) => void;
  /** Current active status filter */
  status: EventStatus;
  /** Callback when status filter changes */
  onStatusChange: (status: EventStatus) => void;
  /** Current date range filter */
  dateRange: DateRange;
  /** Callback when date range changes */
  onDateRangeChange: (start: string | null, end: string | null) => void;
  /** Callback for export */
  onExport?: () => void;
  /** List of selected category IDs */
  selectedCategories: string[];
  /** Callback to toggle a category selection */
  onToggleCategory: (categoryId: string) => void;
  /** Current view mode */
  viewMode: "grid" | "list";
  /** Callback to change view mode */
  onViewModeChange: (mode: "grid" | "list") => void;
  /** Whether mobile filters are visible */
  showMobileFilters: boolean;
  /** Callback to toggle mobile filters */
  onToggleMobileFilters: () => void;
  /** Whether any filters are currently active */
  hasActiveFilters: boolean;
  /** Callback to clear all active filters */
  onClearAll: () => void;
  /** Debounced search string for badge display */
  debouncedSearch: string;
}

const STATUS_OPTIONS: { value: EventStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
  { value: "all", label: "All" },
];

const CATEGORY_ENTRIES = Object.entries(CATEGORY_CONFIG);

function FilterBadge({
  label,
  color,
  onRemove,
}: {
  label: string;
  color?: string;
  onRemove: () => void;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: durations.fast }}
      className="inline-flex items-center gap-1 rounded-full border border-[var(--border-default)] bg-[var(--surface-secondary)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)] shadow-sm"
    >
      {color && (
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      )}
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]"
        aria-label={`Remove ${label} filter`}
      >
        <X size={10} />
      </button>
    </motion.span>
  );
}

/**
 * Sticky filter bar allowing users to filter events by search term, status,
 * and category, as well as toggle between grid and list views.
 */
export function EventFilters({
  searchInput,
  onSearchChange,
  status,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  onExport,
  selectedCategories,
  onToggleCategory,
  viewMode,
  onViewModeChange,
  showMobileFilters,
  onToggleMobileFilters,
  hasActiveFilters,
  onClearAll,
  debouncedSearch,
}: EventFiltersProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--surface-overlay)] backdrop-blur-xl transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Desktop filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative min-w-0 flex-1 lg:w-72 lg:flex-none">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchInput}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search events... (Press '/')"
                className="h-9 w-full rounded-lg border border-[var(--border-default)] bg-[var(--surface-secondary)] pl-9 pr-8 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors focus:border-[var(--electric-cyan)] focus:outline-none focus:ring-1 focus:ring-[var(--electric-cyan)]"
                aria-label="Search events"
              />
              {searchInput && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <span className="hidden xl:inline-flex items-center gap-1 text-[10px] text-[var(--text-muted)] font-mono">
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-secondary)] border border-[var(--border-default)] text-[var(--electric-cyan)] font-bold">?</kbd> for shortcuts
            </span>

            {/* Mobile filter toggle */}
            <button
              onClick={onToggleMobileFilters}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-primary)] hover:text-[var(--text-primary)] lg:hidden shadow-sm"
              aria-label="Toggle filters"
              aria-expanded={showMobileFilters}
            >
              <SlidersHorizontal size={14} />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--electric-cyan)] text-[10px] font-bold text-white">
                  {selectedCategories.length + (status !== "open" ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Status toggle */}
            <div className="flex rounded-lg border border-[var(--border-default)] bg-[var(--surface-secondary)] p-0.5 shadow-sm">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onStatusChange(opt.value)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-semibold transition-all",
                    status === opt.value
                      ? "bg-[var(--electric-cyan)]/15 text-[var(--electric-cyan)] shadow-sm border border-[var(--electric-cyan)]/30"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                  aria-pressed={status === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Date Range Picker */}
            <div className="hidden lg:block">
              <DateRangePicker 
                startDate={dateRange.start} 
                endDate={dateRange.end} 
                onDateChange={onDateRangeChange} 
              />
            </div>

            {/* View & Export toggle */}
            <div className="hidden items-center gap-0.5 rounded-lg border border-[var(--border-default)] bg-[var(--surface-secondary)] p-0.5 sm:flex shadow-sm">
              <button
                onClick={() => onViewModeChange("grid")}
                className={cn(
                  "rounded-md p-1.5 transition-all",
                  viewMode === "grid"
                    ? "bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => onViewModeChange("list")}
                className={cn(
                  "rounded-md p-1.5 transition-all",
                  viewMode === "list"
                    ? "bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
              >
                <List size={16} />
              </button>
              {onExport && (
                <>
                  <div className="h-4 w-px bg-[var(--border-subtle)] mx-0.5" />
                  <button
                    onClick={onExport}
                    className="rounded-md p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
                    aria-label="Export Data"
                  >
                    <Download size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div
          className={cn(
            "mt-4 overflow-hidden transition-all duration-300",
            showMobileFilters
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 lg:max-h-96 lg:opacity-100"
          )}
        >
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORY_ENTRIES.map(([id, config]) => {
              const isSelected = selectedCategories.includes(id);
              const color = config.color;
              return (
                <button
                  key={id}
                  onClick={() => onToggleCategory(id)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all shadow-sm",
                    isSelected
                      ? "border-transparent shadow-md"
                      : "border-[var(--border-default)] bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-primary)]"
                  )}
                  style={
                    isSelected
                      ? {
                          backgroundColor: `${color}18`,
                          color: color,
                          borderColor: `${color}40`,
                        }
                      : undefined
                  }
                  aria-pressed={isSelected}
                >
                  <CategoryIcon categoryId={id} size={12} />
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active filter badges */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: durations.standard }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap items-center gap-2 pt-3">
                <span className="text-xs text-[var(--text-muted)] font-medium">Active filters:</span>

                {selectedCategories.map((catId) => (
                  <FilterBadge
                    key={catId}
                    label={getCategoryLabel(catId)}
                    color={getCategoryColor(catId)}
                    onRemove={() => onToggleCategory(catId)}
                  />
                ))}

                {status !== "open" && (
                  <FilterBadge
                    label={`Status: ${status}`}
                    onRemove={() => onStatusChange("open")}
                  />
                )}

                {(dateRange.start || dateRange.end) && (
                  <FilterBadge
                    label={`${dateRange.start || "..."} to ${dateRange.end || "..."}`}
                    onRemove={() => onDateRangeChange(null, null)}
                  />
                )}

                {debouncedSearch.trim() && (
                  <FilterBadge
                    label={`"${debouncedSearch.trim()}"`}
                    onRemove={() => onSearchChange("")}
                  />
                )}

                <button
                  onClick={onClearAll}
                  className="ml-1 text-xs text-[var(--text-muted)] underline underline-offset-2 transition-colors hover:text-[var(--text-primary)]"
                >
                  Clear all
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
