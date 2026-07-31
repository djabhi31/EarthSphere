# 75-MOTION_BIBLE.md

# EarthPulse AI Motion Bible

## Philosophy

Motion must communicate purpose, hierarchy, and spatial relationships.
Every animation should feel premium, smooth, and intentional.

---

## Global Rules

- Use spring animations by default.
- Prefer transform and opacity over layout-changing properties.
- Target 60 FPS.
- Respect `prefers-reduced-motion`.
- Avoid decorative infinite animations.

---

## Timing

| Type | Duration |
|------|---------:|
| Micro | 120–180ms |
| Standard | 220–320ms |
| Complex | 450–650ms |
| Cinematic | 800–1200ms |

---

## Easing

- Primary: Spring
- Secondary: easeOut
- Never use linear for UI transitions.

---

## Page Transitions

- Fade + slight scale
- Shared layout transitions
- Preserve scroll where appropriate

---

## Scroll Storytelling

Hero → Earth → Events → Analytics → CTA

Use:
- useScroll
- useTransform
- useSpring

---

## Hover

Buttons:
- Scale 1.03
- Glow
- Magnetic movement

Cards:
- Spotlight
- Tilt
- Dynamic shadow

Maps:
- Marker pulse
- Fly-to animation

---

## Loading

- Skeleton shimmer
- Progressive reveal
- No blocking spinners unless unavoidable

---

## Accessibility

Disable heavy motion for reduced-motion users.
