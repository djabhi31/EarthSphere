# EarthSphere Design System

The EarthSphere design system prioritizes a premium, cinematic, dark-mode first, glassmorphic aesthetic. The system relies heavily on CSS variables configured in `globals.css` and strongly-typed tokens in `src/lib/design-tokens.ts`.

## Color Palette

### Brand & Atmospheric Colors
- **Space Black**: `#050714` (dark), `#fafaf8` (light)
- **Deep Blue**: `#101936` (dark), `#dceafa` (light)
- **Electric Cyan**: `#00d4aa` (dark), `#00a884` (light)
- **Electric Blue**: `#45b8ff` (dark), `#2196f3` (light)
- **Solar Orange**: `#ff6b35` (dark), `#ea580c` (light)
- **Cosmic Purple**: `#7c3aed` (dark), `#6d28d9` (light)
- **Ice Blue**: `#38bdf8` (dark), `#0ea5e9` (light)
- **Warning Red**: `#ef4444` (dark), `#dc2626` (light)
- **Aurora Mint**: `#6ee7d0` (dark), `#34d399` (light)

### Surfaces
Layered depth mapped across varying shades from canvas, elevated, secondary to overlays, built primarily using `#050714` as the base canvas color.

### Text
Optimized for contrast: Primary, Secondary, Muted, and Accent categories.

### Category Colors
Special semantic color mapping applied for the 13 NASA EONET categories (e.g., `#ff6b35` for wildfires, `#3b82f6` for floods).

## Typography
- **Display (`--font-display`)**: IBM Plex Sans
- **Body (`--font-body`)**: Inter
- **Code (`--font-code`)**: JetBrains Mono
- **Tracking**: Tight tracking with `-0.045em` for display and `-0.025em` for headings.
- **Leading**: Display is set to `0.98` and Heading to `1.08`.

## Spacing Scale
A 4-point spacing rhythm (`spacing`) combined with responsive CSS clamp configurations (`gutter`, `section`, `sectionLg`) mapping from `0.25rem` up to `6rem`.

## Border Radius
Sizes scale from `sm` (`0.5rem`) to `3xl` (`2rem`) and `pill` (`9999px`).

## Shadow & Depth System
Five distinct levels of progressive layering (`depth[1]` to `depth[5]`) employing multi-layered `box-shadow` properties. Colored shadows (`cyan`, `blue`, `violet`) are available for hero sections or focused components. Glow presets also add interactive elevation.

## Glass System
Values available for standard `default`, `strong`, and `subtle` variants. Configured with a `blur()` up to 24px and saturation filters to mimic a frosted, glassmorphic overlay.

## Motion & Animations
- **Timing**: Split into `micro` (120-180ms), `standard` (220-320ms), `complex` (450-650ms), and `cinematic` (800-1200ms) presets.
- **Easing**: Built on specialized cubic beziers: `premium`, `emphasized`, and `bounce`.
- **Springs**: Defined spring presets for physical and natural movement behaviors (`gentle`, `snappy`, `bouncy`, `heavy`, `micro`).

## Component Variants
Special custom UI patterns built directly on top of the design system:
- `text-gradient`: Uses aurora sweep (`linear-gradient(125deg, #00d4aa 0%, #45b8ff 50%, #8b5cf6 100%)`)
- `border-beam`: Animated border tracking effect
- `glass`, `glass-strong`, `glass-subtle`: Quick application of the frost overlays.
