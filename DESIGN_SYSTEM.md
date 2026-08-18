# Loyd.io Portfolio — Design System & UI/UX Rules

> **Purpose:** This document is the single source of truth for the visual design, typography, color system, layout structure, liquid-glass aesthetic, animations, sound engine, and component conventions across the **loydio** portfolio.
> 
> **Rule for AI Agents & Developers:** Whenever adding new sections, components, pages, modals, or widgets, refer to and follow the rules and code recipes in this document to preserve pixel-perfect aesthetic consistency.

---

## Table of Contents
1. [Design Philosophy & Core Aesthetics](#1-design-philosophy--core-aesthetics)
2. [Color Palette & Theme Tokens](#2-color-palette--theme-tokens)
3. [Typography Hierarchy](#3-typography-hierarchy)
4. [The Liquid Glass Architecture](#4-the-liquid-glass-architecture)
5. [Layout & Container Structure](#5-layout--container-structure)
6. [Button & Interactive Element System](#6-button--interactive-element-system)
7. [Motion & Animation Guidelines](#7-motion--animation-guidelines)
8. [Audio Synthesizer Engine (Sound UX)](#8-audio-synthesizer-engine-sound-ux)
9. [Component Blueprints & Recipes](#9-component-blueprints--recipes)
10. [Responsive Design & Mobile Rules](#10-responsive-design--mobile-rules)
11. [Checklist for Adding New Features](#11-checklist-for-adding-new-features)

---

## 1. Design Philosophy & Core Aesthetics

The visual language of **loydio** is defined by **Editorial Brutalism meets Tactile Liquid Glass Craftsmanship**:

- **Editorial Brutalism:** Monospaced technical labels, lowercase kickers (`— technologies & tools`), high-contrast monochrome layout, structured typography with `Syne` and `Geist`.
- **Liquid Glass Craftsmanship:** Hyper-polished glassmorphism featuring multi-layer specular highlights, realistic bevel reflections, subtle inner drop shadows, and high-saturation background blurs (`backdrop-filter: blur(...) saturate(...)`).
- **Tactile Micro-Interactions:** Custom Web Audio synthesizer sound effects, 3D tilt effects, springy cubic-bezier hovers (`[0.34, 1.56, 0.64, 1]`), and View Transition diagonal wipes.
- **Strict Cleanliness:** No noisy, cheap gradients or uncurated bright colors. Color is used strictly for semantic indicators (e.g. green online indicator `#22c55e`), while the rest of the UI relies on refined light/dark monochromatic surfaces.

---

## 2. Color Palette & Theme Tokens

The app supports **Light** and **Dark** themes switched via `data-theme` on the `<html>` element.

### Core CSS Variables (`src/app/globals.css`)

| Token | Light Mode (`:root`) | Dark Mode (`[data-theme="dark"]`) | Description |
|---|---|---|---|
| `--bg` | `#fafafa` | `#131316` | Main page background |
| `--fg` | `#09090b` | `#f4f4f5` | Main text & high-contrast elements |
| `--surface` | `#ffffff` | `#1a1a1d` | Card / surface backgrounds |
| `--border` | `oklch(0.922 0 0)` / `rgba(0,0,0,0.1)` | `rgba(255, 255, 255, 0.08)` | Standard dividers & borders |
| `--border-strong` | `rgba(0, 0, 0, 0.18)` | `rgba(255, 255, 255, 0.18)` | Prominent borders & pill outlines |
| `--border-mid` | `rgba(0, 0, 0, 0.10)` | `rgba(255, 255, 255, 0.10)` | Intermediate border tone |
| `--border-heavy` | `rgba(0, 0, 0, 0.22)` | `rgba(255, 255, 255, 0.22)` | Heavy edge definition |
| `--hover-bg` | `rgba(0, 0, 0, 0.025)` | `rgba(255, 255, 255, 0.04)` | Subtle hover background |
| `--subtle-bg` | `rgba(0, 0, 0, 0.04)` | `rgba(255, 255, 255, 0.06)` | Secondary background tints |
| `--muted` | `#71717a` | `#a1a1aa` | Secondary body text & descriptions |
| `--accent` | `#09090b` | `#f4f4f5` | Main accent (inverted in light/dark) |
| `--accent-subtle`| `rgba(0, 0, 0, 0.05)` | `rgba(255, 255, 255, 0.08)` | Accent wash / pill hover |
| `--success` | `#22c55e` | `#22c55e` | Active state / online dot indicator |

### ⚠️ Critical Color Rules
1. **NEVER hardcode hex codes** like `#000`, `#fff`, `#111` in components for layout or text. Always use `var(--bg)`, `var(--fg)`, `var(--muted)`, `var(--border)`, etc.
2. For semi-transparent shades of foreground/background, use `color-mix(in srgb, var(--fg) 20%, transparent)` or `rgba(255, 255, 255, ...)` with dark mode overrides.

---

## 3. Typography Hierarchy

Fonts are loaded via `next/font/google` in [layout.tsx](file:///c:/Users/deguz/OneDrive/Pictures/PROJECTS/loydio/src/app/layout.tsx) and exposed via CSS variables and [src/lib/fonts.ts](file:///c:/Users/deguz/OneDrive/Pictures/PROJECTS/loydio/src/lib/fonts.ts).

### Font Families
1. **Display / Editorial Font:** `Syne` (`--font-display` / `DISPLAY_FONT`)
   - Weights: 400, 500, 600, 700, 800
   - Usage: Section kickers, project titles, modal headers, timeline dates, badges, pill nav links, quote highlights.
2. **Sans Body Font:** `Geist` (`--font-sans` / `SANS_FONT`)
   - Usage: Main body paragraphs, bio, descriptions, roles, modal content, chat messages.
3. **Monospace Font:** `Geist Mono` (`--font-mono` / `MONO_FONT`)
   - Usage: Buttons, uppercase tags, year labels, tech tags, metrics/visitor counters, timestamps, thinking indicator.

```ts
// Import helper constants from "@/lib/fonts"
import { DISPLAY_FONT, MONO_FONT, SANS_FONT } from "@/lib/fonts";
```

### Typography Styling Standards

| Element | Font Family | Size / Leading | Case & Tracking | Example |
|---|---|---|---|---|
| **Section Kicker** | `var(--font-display)` | `11px`, `line-height: 1` | lowercase, `letter-spacing: 0.1em`, color `var(--muted)` | `— technologies & tools` |
| **Eyebrow Label** | `var(--font-mono)` | `10px` | UPPERCASE, `letter-spacing: 0.28em`, color `var(--muted)` | `LET'S WORK TOGETHER` |
| **Section Heading** | `var(--font-display)` | `clamp(24px, 3vw, 36px)`, `line-height: 1.15` | Normal, weight `400` or `700`, color `var(--fg)` | `Selected Works` |
| **Hero Title** | `var(--font-sans)` | `clamp(28px, 5vw, 40px)`, `line-height: 1` | Normal, weight `700`, color `var(--fg)` | `Loyd De Guzman` |
| **Role Subheading** | `var(--font-sans)` | `clamp(18px, 3vw, 24px)`, `line-height: 1.3` | Normal, weight `500`, color `var(--fg)` | `Computer Engineer — Full-Stack` |
| **Body Paragraph** | `var(--font-sans)` | `15px` - `16px`, `line-height: 1.75 - 1.8` | Normal, weight `500`, color `var(--muted)` | Bio and explanations |
| **Mono Tag / Pill** | `var(--font-mono)` | `10px` - `11px` | UPPERCASE, `letter-spacing: 0.15em` | `NEXT.JS`, `TYPESCRIPT` |
| **Button Text** | `var(--font-mono)` | `11px` - `13px` | UPPERCASE / Normal, `letter-spacing: 0.18em` | `VIEW RESUME >` |

---

## 4. The Liquid Glass Architecture

Liquid glass is the signature visual feature of the portfolio. It simulates a 3D physical glass lens with multi-point specular highlights and edge bevels.

### Anatomy of Liquid Glass CSS
```css
/* Signature Multi-Layer Highlight & Bevel Box-Shadow Formula */
.liquid-glass-card {
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(28px) saturate(210%);
  -webkit-backdrop-filter: blur(28px) saturate(210%);
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow: 
    /* 1. Razor-sharp top specular shine */
    inset 0 2px 0 0 rgba(255, 255, 255, 0.95),
    /* 2. Subtle soft upper glass gradient */
    inset 0 4px 10px -2px rgba(255, 255, 255, 0.16),
    /* 3. Left-edge bevel shine */
    inset 2px 0 0 0 rgba(255, 255, 255, 0.45),
    /* 4. Bottom-edge shadow anchor */
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.05),
    /* 5. Right-edge shadow */
    inset -1px 0 0 0 rgba(0, 0, 0, 0.03),
    /* 6. Luminous crystal outer rim */
    0 0 0 1px rgba(255, 255, 255, 0.38),
    /* 7. Outer ambient glass shine aura */
    0 0 16px 0 rgba(255, 255, 255, 0.16),
    /* 8. Drop shadow */
    0 12px 36px 0 rgba(0, 0, 0, 0.08);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

[data-theme="dark"] .liquid-glass-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(28px) saturate(190%);
  -webkit-backdrop-filter: blur(28px) saturate(190%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 
    inset 0 2px 0 0 rgba(255, 255, 255, 0.72),
    inset 0 4px 10px -2px rgba(255, 255, 255, 0.06),
    inset 2px 0 0 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.65),
    inset -1px 0 0 0 rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.16),
    0 0 16px 0 rgba(255, 255, 255, 0.06),
    0 12px 36px 0 rgba(0, 0, 0, 0.42);
}
```

### Pre-built Liquid Glass CSS Classes
- `.liquid-glass-card`: Large featured project cards & carousels.
- `.liquid-glass-btn`: Rounded capsule buttons with hover expansion (`scale(1.08)`).
- `.liquid-glass-pill`: Small status chips or counters.
- `.pill-nav`: Floating navigation pill at the top/bottom.
- `.tag`: Monospace pill tag with frosted glass reflections.
- `.contact-glass-wrapper`: The framed container for contact and call-to-actions.
- `.exp-glass-card`: Journey / experience list containers.
- `.github-calendar-glass`: Frosted background container for contribution calendars.
- `.tech-logo-item`: 58×58px frosted glass rounded square for tech logo carousels.

---

## 5. Layout & Container Structure

### Section Layout Standard
Every new section should be structured with `.lean-section` and `.section-container`:

```tsx
<section id="section-id" className="lean-section" style={{ background: "var(--bg)" }}>
  <div className="section-container">
    {/* 1. Section Kicker */}
    <p className="section-kicker">— section title</p>

    {/* 2. Optional Section Heading */}
    <h2 className="section-heading" style={{ fontSize: "clamp(24px, 3vw, 32px)", marginBottom: "1.5rem" }}>
      Section Headline
    </h2>

    {/* 3. Section Content */}
    <div>{/* Content here */}</div>
  </div>
</section>
```

### Layout Specifications
- **Section Spacing:** `.lean-section` has `padding: 5rem 0` on desktop, reducing to `3.5rem 0` on mobile (`<= 640px`).
- **Container Sizing:** `.section-container` has `max-width: 960px`, centered with `margin-left: auto; margin-right: auto;`, and dynamic side padding: `padding-left: clamp(1.5rem, 6vw, 5rem); padding-right: clamp(1.5rem, 6vw, 5rem);` (mobile: `1.25rem`).
- **Full-Bleed Elements:** If a carousel or marquee must span screen edge-to-edge, use `.full-bleed` (`width: 100vw; margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw);`) or `.design-carousel-bleed`.

### Fixed Corner Anchors (Z-Index Scale)
| Element | Position | Z-Index | Class / Component |
|---|---|---|---|
| **Corner Monogram** | Fixed Top-Left (`20px, 24px`) | `10070` | `.logo-corner` (`.logo-badge` rotated 12deg) |
| **Live Visitor Counter** | Fixed Top-Right (`14px, 24px`) | `10070` | `.visit-counter-corner` |
| **Floating Pill Nav** | Fixed Top-Center (Desktop) / Bottom-Center (Mobile) | `10060` | `.pill-nav-wrapper` |
| **Scroll-To-Top** | Fixed Bottom-Right | `10050` | `.scroll-to-top-btn` |
| **Modal Backdrops** | Fullscreen Fixed Overlay | `10090` | `.pm-backdrop` |

---

## 6. Button & Interactive Element System

### 1. Liquid Glass Capsule Button (Primary Hero CTA)
```tsx
<a 
  href="/resume.pdf" 
  target="_blank" 
  rel="noopener noreferrer" 
  className="liquid-glass-btn" 
  style={{ 
    display: "inline-flex", 
    alignItems: "center", 
    gap: "0.5rem", 
    padding: "12px 32px", 
    fontSize: "13px", 
    fontWeight: 600, 
    borderRadius: 999 
  }}
>
  View Resume <span style={{ fontFamily: "var(--font-mono)" }}>&gt;</span>
</a>
```

### 2. Monospace Action Buttons (`.btn`)
All monospace buttons share: `font-family: var(--font-mono)`, `font-size: 11px`, `letter-spacing: 0.18em`, `text-transform: uppercase`, `min-height: 44px`, `padding: 12px 28px`.

- **`.btn.btn-accent` / `.btn.btn-primary`:** Solid high-contrast inverted button (`background: var(--fg); color: var(--bg); border: 1px solid var(--fg)`). Inverts to transparent outline on hover with translateY(-2px).
- **`.btn.btn-outline`:** Minimalist outline button (`background: transparent; color: var(--fg); border: 1px solid var(--border-strong)`). Highlights border and glows on hover.

### 3. Frosted Pill Tags (`.tag`)
Used for project categories, skills, and technology chips:
```tsx
<span className="tag">Next.js 16</span>
```

---

## 7. Motion & Animation Guidelines

All animations should feel fluid, crisp, and weighted (avoid bouncy cartoonish easing).

### Standard Framer Motion Easings
- **Smooth Deceleration (Quint-like):** `ease: [0.16, 1, 0.3, 1]`
- **Spring Overshoot (Interactive Micro-hovers):** `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Standard Fade-Up Transition:**
  ```tsx
  import { motion, useInView } from "framer-motion";

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  <motion.div
    ref={ref}
    initial={{ opacity: 0, y: 20 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
  >
    {/* Content */}
  </motion.div>
  ```

### Hover Transformations
- Buttons/Cards: `transform: translateY(-2px) scale(1.02);`
- Glass pills/icons: `transform: scale(1.08);`

### Reduced Motion
All animations must respect `prefers-reduced-motion: reduce`. The global CSS handles automatic resetting of animation durations to `0.001ms`.

---

## 8. Audio Synthesizer Engine (Sound UX)

The website features an onboard Web Audio API synthesizer in [src/lib/sound.ts](file:///c:/Users/deguz/OneDrive/Pictures/PROJECTS/loydio/src/lib/sound.ts). **No external audio MP3/WAV files are required.**

### Available Sound Types
| Sound ID | Frequency / Character | Use Case |
|---|---|---|
| `"click"` | 1200Hz short pop | Tab clicks, carousel navigation, minor buttons |
| `"pop"` | 400Hz -> 800Hz chirp | Modal opening, expansion |
| `"close"` | 700Hz -> 300Hz soft drop | Modal closing, dismissing panels |
| `"hover"` | 2400Hz ultra-subtle tick | Hovering over interactive icons/chips |
| `"themeDark"` | Low resonant warm chord | Switching to dark mode |
| `"themeLight"`| Bright shimmering chime | Switching to light mode |
| `"send"` | Fast ascending chirp | Sending chat message |
| `"receive"` | Two-tone bell | Receiving AI response |
| `"success"` | Major third chord | Copying email / completing form |
| `"error"` | Low dual buzz | Action failed |

### How to Play Sounds in Code
```tsx
import { sound } from "@/lib/sound";

// Play on action
const handleClick = () => {
  sound.play("click");
  // your action
};
```
*Note: Global click listeners in `Navbar.tsx` automatically trigger sounds for links and standard buttons, so only add explicit `sound.play()` calls for custom canvas/gesture controls or state toggles.*

---

## 9. Component Blueprints & Recipes

### Blueprint A: A New Portfolio Section
```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { DISPLAY_FONT } from "@/lib/fonts";

export default function NewSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="new-section" ref={ref} className="lean-section" style={{ background: "var(--bg)" }}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Section Kicker */}
          <p className="section-kicker">— explore</p>

          {/* Section Heading */}
          <h2 className="section-heading" style={{ fontSize: "clamp(24px, 3vw, 32px)", marginBottom: "1.5rem" }}>
            Section Heading
          </h2>

          {/* Content Card with Liquid Glass */}
          <div className="liquid-glass-card" style={{ padding: "2rem", borderRadius: "18px" }}>
            <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: "1.7" }}>
              Your content goes here...
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

### Blueprint B: Liquid Glass Interactive Card
```tsx
<div 
  className="liquid-glass-card" 
  style={{ 
    padding: "1.5rem", 
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  }}
>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--muted)" }}>
      2026
    </span>
    <span className="tag">FEATURED</span>
  </div>
  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--fg)" }}>
    Project Title
  </h3>
  <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.6 }}>
    Clean description of the project and technologies used.
  </p>
</div>
```

---

## 10. Responsive Design & Mobile Rules

### Breakpoint Matrix
- **Desktop:** `> 900px`
- **Tablet:** `601px - 900px`
- **Mobile:** `<= 600px` / `<= 640px`

### Mobile Layout Adaptations
1. **Pill Navigation:**
   - Desktop: Floats at the top center (`top: 18px`).
   - Mobile (`<= 640px`): Automatically docks to the bottom center (`bottom: max(14px, env(safe-area-inset-bottom))`) with full width (`calc(100vw - 32px)`).
2. **Fixed Header Badges:**
   - Logo monogram stays top-left (`top: 14px, left: 16px`).
   - Live visitor counter stays top-right (`top: 12px, right: 16px`).
3. **Touch Targets:**
   - All interactive controls, nav buttons, and pills MUST maintain a minimum height/width of `44px` or `touch-action: manipulation` for effortless tapping on phones.
4. **Fluid Typography:**
   - Always use CSS `clamp()` for responsive headings (e.g. `fontSize: "clamp(24px, 4vw, 36px)"`).

---

## 11. Checklist for Adding New Features

Before completing any new feature or modifying existing code, verify against this checklist:

- [ ] **Theme Integrity:** Did you use CSS variables (`var(--bg)`, `var(--fg)`, `var(--muted)`, `var(--border)`) instead of hardcoded hex colors?
- [ ] **Typography Consistency:**
  - `Syne` (`var(--font-display)`) for kickers, headers, badges, titles.
  - `Geist` (`var(--font-sans)`) for body and descriptions.
  - `Geist Mono` (`var(--font-mono)`) for tags, metrics, and buttons.
- [ ] **Liquid Glass Authenticity:** Any new cards or panels include the multi-layer specular highlight box-shadows or use `.liquid-glass-card` / `.liquid-glass-btn`.
- [ ] **Smooth Motion:** All entrances use Framer Motion with `ease: [0.16, 1, 0.3, 1]` or smooth CSS transitions (`0.25s - 0.35s`).
- [ ] **Sound Feedback:** Critical interactive triggers have corresponding sound synth triggers if needed.
- [ ] **Mobile Usability:** Tested under `<= 640px` — bottom nav padding respected, no horizontal overflow (`max-width: 100vw`), minimum 44px touch targets.
- [ ] **Accessibility:** Clean semantic tags, aria-labels for icon buttons, and high contrast ratios.
