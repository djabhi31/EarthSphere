import { cn, formatDate, getCategoryColor } from "@/lib/utils";
import { colors, cssVars } from "@/lib/design-tokens";

// ---------------------------------------------------------------------------
// StatusBadge – Active / Closed status indicator
// ---------------------------------------------------------------------------

interface StatusBadgeProps {
  status: "active" | "closed";
  closedDate?: string;
  className?: string;
  categoryId?: string;
}

export function StatusBadge({ status, closedDate, className, categoryId }: StatusBadgeProps) {
  const isActive = status === "active";
  const activeColor = categoryId ? getCategoryColor(categoryId) : colors.auroraMint;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border",
        isActive
          ? "border-transparent bg-[var(--surface-elevated)]"
          : "border-[var(--border-subtle)] bg-[var(--surface-secondary)] text-[var(--text-muted)]",
        className,
      )}
      style={isActive ? { color: activeColor, boxShadow: `0 0 10px ${activeColor}33` } : undefined}
    >
      {/* Status dot */}
      <span
        className={cn(
          "relative inline-block h-1.5 w-1.5 rounded-full",
          !isActive && "bg-[var(--text-muted)]"
        )}
        style={isActive ? { backgroundColor: activeColor, boxShadow: `0 0 8px ${activeColor}` } : undefined}
        aria-hidden="true"
      >
        {isActive && (
          <span 
            className="absolute inset-0 animate-ping rounded-full opacity-75" 
            style={{ backgroundColor: activeColor }}
          />
        )}
      </span>

      {/* Label */}
      <span>{isActive ? "Active" : "Closed"}</span>

      {/* Optional closed date */}
      {!isActive && closedDate && (
        <span className="text-[var(--text-muted)] opacity-80">· {formatDate(closedDate)}</span>
      )}
    </span>
  );
}
