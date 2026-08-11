import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Filter, Menu } from 'lucide-react';
import { cn, getCategoryColor, getCategoryLabel, formatDate } from '@/lib/utils';
import type { EONETEvent } from '@/lib/types';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { slideUp } from '@/lib/motion-presets';

/**
 * Props for MapSidebar component
 */
export interface MapSidebarProps {
  events: readonly EONETEvent[];
  selectedEvent: EONETEvent | null;
  onSelectEvent: (event: EONETEvent) => void;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: "open" | "closed" | "all";
  setStatusFilter: (status: "open" | "closed" | "all") => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  filteredEvents: readonly EONETEvent[];
  dateStart?: string | null;
  dateEnd?: string | null;
  onDateChange?: (start: string | null, end: string | null) => void;
}

/**
 * MapSidebar Component
 * Left sidebar containing search, filters, and a list of EONET events.
 */
export function MapSidebar({ 
  events, 
  selectedEvent, 
  onSelectEvent, 
  isLoading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  selectedCategories,
  setSelectedCategories,
  filteredEvents,
  dateStart = null,
  dateEnd = null,
  onDateChange = () => {},
}: MapSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Mobile drawer toggle
  const toggleOpen = () => setIsOpen(!isOpen);

  // Derive categories and counts from the provided events list
  const availableCategories = useMemo(() => {
    const catSet = new Map<string, number>();
    for (const event of events) {
      for (const cat of event.categories) {
        catSet.set(cat.id, (catSet.get(cat.id) ?? 0) + 1);
      }
    }
    return Array.from(catSet.entries())
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count);
  }, [events]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(
      selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...selectedCategories, categoryId]
    );
  };

  return (
    <>
      {/* Mobile Trigger */}
      <button 
        className="md:hidden absolute top-20 left-4 z-40 p-2 glass rounded-lg text-text-primary"
        onClick={toggleOpen}
        aria-label="Toggle Sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : 0 }}
        className={cn(
          "fixed top-16 bottom-0 left-0 w-80 z-50 glass-strong border-r border-border-subtle flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0",
          !isOpen && "-translate-x-full"
        )}
      >
        {/* Header / Search */}
        <div className="p-4 border-b border-border-subtle shrink-0 flex flex-col gap-4">
          <div className="flex items-center justify-between md:hidden">
            <h2 className="text-lg font-display text-text-primary">Events</h2>
            <button onClick={() => setIsOpen(false)} className="text-text-secondary">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-base border border-border-subtle rounded-xl pl-9 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-electric-cyan/50"
            />
          </div>

          {/* Status Toggle */}
          <div className="flex bg-surface-elevated rounded-lg p-1">
            {(["open", "closed", "all"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-200 capitalize",
                  statusFilter === status
                    ? "bg-electric-cyan/20 text-electric-cyan"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {status}
              </button>
            ))}
          </div>
          
          {/* Date Range Picker */}
          <div className="flex">
            <DateRangePicker 
              startDate={dateStart} 
              endDate={dateEnd} 
              onDateChange={onDateChange} 
            />
          </div>
        </div>

        {/* Categories (horizontal scroll or wrap) */}
        <div className="p-4 border-b border-border-subtle shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {availableCategories.map(cat => {
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryToggle(cat.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border",
                    isSelected 
                      ? "bg-surface-elevated text-text-primary border-border-strong" 
                      : "bg-transparent text-text-secondary border-border-subtle hover:bg-surface-base"
                  )}
                >
                  <CategoryIcon categoryId={cat.id} size={12} />
                  <span>{getCategoryLabel(cat.id)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Event List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {isLoading ? (
            <div className="p-4 text-center text-text-muted text-sm">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-4 text-center text-text-muted text-sm">No events found.</div>
          ) : (
            filteredEvents.map(event => {
              const isSelected = selectedEvent?.id === event.id;
              const catId = event.categories[0]?.id;
              
              return (
                <button
                  key={event.id}
                  onClick={() => {
                    onSelectEvent(event);
                    if (window.innerWidth < 768) setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-xl transition-colors border flex flex-col gap-2",
                    isSelected
                      ? "bg-surface-elevated border-border-strong"
                      : "border-transparent hover:bg-surface-base hover:border-border-subtle"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getCategoryColor(catId) }} />
                      <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                        {getCategoryLabel(catId)}
                      </span>
                    </div>
                    {event.closed && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-base text-text-muted">Closed</span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-text-primary line-clamp-2">
                    {event.title}
                  </h3>
                  {event.geometry[0] && (
                    <p className="text-xs text-text-secondary">
                      {formatDate(event.geometry[0].date)}
                    </p>
                  )}
                </button>
              );
            })
          )}
        </div>
      </motion.aside>
    </>
  );
}
