# 70-CURSOR_SYSTEM.md

## Purpose

The cursor is part of the interface.

It should feel intelligent.

---

## Cursor Architecture

Default cursor hidden on desktop.

Replace with custom cursor.

### Core Cursor

Small glowing circle.

### Outer Ring

Transparent ring with lag effect.

### Cursor Glow

Adaptive color system:

- Wildfires → Orange
- Storms → Blue
- Volcanoes → Red
- Analytics → Cyan

---

## Context Labels

Dynamic labels:

- Explore
- Track Event
- Open Timeline
- View Map
- Inspect
- Zoom

---

## Hover States

Buttons:
- Cursor enlarges

Cards:
- View Details

Maps:
- Drag Earth

Timeline:
- Explore History

---

## Magnetic Behavior

Cursor attracts:

- Buttons
- CTA elements
- Event markers

Distance: 30px

---

## Performance

Target: 60 FPS

Use requestAnimationFrame.

Never trigger React rerenders every frame.
