"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, SlidersHorizontal, Grid3X3, List } from "lucide-react";
import {
  CATEGORY_CONFIG,
  getCategoryColor,
  getCategoryLabel,
  cn,
} from "@/lib/utils";
import { durations } from "@/lib/design-tokens";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import type { EventStatus } from "@/lib/types";

export interface EventFiltersProps {
  /** Current search input value */
  searchInput: string;
  /** Callback when search input changes */
  onSearchChange: (value: string) => void;
  /** Current active status filter */
  status: EventStatus;
  /** Callback when status filter changes */
  onStatusChange: (status: EventStatus) => void;
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
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/70"
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
        className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-white/10"
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
    <section className="sticky top-0 z-30 border-b border-white/5 bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Desktop filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative min-w-0 flex-1 lg:w-72 lg:flex-none">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchInput}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search events... (Press '/')"
                className="h-9 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-8 text-sm text-white placeholder:text-white/30 transition-colors focus:border-electric-cyan/50 focus:outline-none focus:ring-1 focus:ring-electric-cyan/30"
                aria-label="Search events"
              />
              {searchInput && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-white/30 transition-colors hover:text-white/60"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={onToggleMobileFilters}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/60 transition-colors hover:bg-white/10 lg:hidden"
              aria-label="Toggle filters"
              aria-expanded={showMobileFilters}
            >
              <SlidersHorizontal size={14} />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-electric-cyan text-[10px] font-bold text-canvas">
                  {selectedCategories.length + (status !== "open" ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Status toggle */}
            <div className="flex rounded-lg border border-white/10 bg-white/5 p-0.5">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onStatusChange(opt.value)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                    status === opt.value
                      ? "bg-electric-cyan/15 text-electric-cyan shadow-sm"
                      : "text-white/40 hover:text-white/60"
                  )}
                  aria-pressed={status === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div className="hidden items-center gap-0.5 rounded-lg border border-white/10 bg-white/5 p-0.5 sm:flex">
              <button
                onClick={() => onViewModeChange("grid")}
                className={cn(
                  "rounded-md p-1.5 transition-all",
                  viewMode === "grid"
                    ? "bg-white/10 text-white"
                    : "text-white/30 hover:text-white/60"
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
                    ? "bg-white/10 text-white"
                    : "text-white/30 hover:text-white/60"
                )}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
              >
                <List size={16} />
              </button>
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
                    "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                    isSelected
                      ? "border-transparent shadow-md"
                      : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70"
                  )}
                  style={
                    isSelected
                      ? {
                          backgroundColor: `${color}20`,
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
                <span className="text-xs text-white/30">Active filters:</span>

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

                {debouncedSearch.trim() && (
                  <FilterBadge
                    label={`"${debouncedSearch.trim()}"`}
                    onRemove={() => onSearchChange("")}
                  />
                )}

                <button
                  onClick={onClearAll}
                  className="ml-1 text-xs text-white/30 underline underline-offset-2 transition-colors hover:text-white/60"
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
