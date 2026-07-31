# 69-INTERACTION_ENGINE.md

## Purpose

The entire application must react to the user.

Nothing should feel static.

---

## Mouse System

Mouse movement influences:

- Cards
- Buttons
- Earth
- Background gradients
- Particles

---

## Depth Layers

### Layer 1
Background particles (0.2x movement)

### Layer 2
Aurora gradients (0.4x movement)

### Layer 3
Earth visualization (0.8x movement)

### Layer 4
UI elements (1.0x movement)

---

## Card Interactions

- Spotlight glow follows cursor
- 3D tilt
- Lift on hover
- Dynamic shadow movement

---

## Button Interactions

- Magnetic attraction
- Spring scaling
- Glow expansion
- Ripple effect

No static buttons allowed.

---

## Earth Reactions

- Hover
- Scroll
- Drag

Behaviors:

- Rotate
- Tilt
- Focus regions
- Highlight events

---

## Event Interactions

Hover Event:

- Marker expands
- Related lines illuminate
- Tooltip animates

Click Event:

- Camera focuses
- Sidebar reveals

---

## Motion Principles

Fast: 150ms

Normal: 300ms

Complex: 600ms

Cinematic: 1000ms

All interactions must use spring physics.
