import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-md bg-[var(--surface-secondary)]",
        "before:absolute before:inset-0 before:-translate-x-[150%]",
        "before:animate-[shimmer_2s_infinite_ease-in-out]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
