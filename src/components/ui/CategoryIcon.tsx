import {
  Flame,
  CloudLightning,
  Mountain,
  Activity,
  Waves,
  Sun,
  Snowflake,
  Anchor,
  MountainSnow,
  Cloud,
  Thermometer,
  Droplets,
  Factory,
  Globe,
  type LucideProps,
} from "lucide-react";
import { cn, getCategoryColor } from "@/lib/utils";

// ---------------------------------------------------------------------------
// CategoryIcon – Maps EONET category IDs to Lucide icons
// ---------------------------------------------------------------------------

interface CategoryIconProps {
  categoryId: string;
  size?: number;
  className?: string;
  showGlow?: boolean;
}

type IconComponent = React.FC<LucideProps>;

const ICON_MAP: Record<string, IconComponent> = {
  wildfires: Flame,
  severeStorms: CloudLightning,
  volcanoes: Mountain,
  earthquakes: Activity,
  floods: Waves,
  drought: Sun,
  snow: Snowflake,
  seaLakeIce: Anchor,
  landslides: MountainSnow,
  dustHaze: Cloud,
  tempExtremes: Thermometer,
  waterColor: Droplets,
  manmade: Factory,
};

export function CategoryIcon({
  categoryId,
  size = 18,
  className,
  showGlow = false,
}: CategoryIconProps) {
  const Icon = ICON_MAP[categoryId] ?? Globe;
  const color = getCategoryColor(categoryId);

  return (
    <span
      className={cn("relative inline-flex items-center justify-center", className)}
      style={
        showGlow
          ? { filter: `drop-shadow(0 0 6px ${color}80)` }
          : undefined
      }
    >
      <Icon size={size} color={color} strokeWidth={2} aria-hidden="true" />
    </span>
  );
}
