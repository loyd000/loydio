---
name: Loyd.io
description: Portfolio of Loyd De Guzman — computer engineer building web, mobile and embedded products. Monochrome editorial layout under liquid glass.
colors:
  paper: "#fafafa"
  ink: "#09090b"
  sheet: "#ffffff"
  graphite: "#71717a"
  hairline: "oklch(0.922 0 0)"
  hairline-strong: "rgba(0, 0, 0, 0.18)"
  wash: "rgba(0, 0, 0, 0.04)"
  signal-green: "#22c55e"
  paper-night: "#131316"
  ink-night: "#f4f4f5"
  sheet-night: "#1a1a1d"
  graphite-night: "#a1a1aa"
  hairline-night: "rgba(255, 255, 255, 0.08)"
  hairline-strong-night: "rgba(255, 255, 255, 0.18)"
  wash-night: "rgba(255, 255, 255, 0.06)"
  glass-fill: "rgba(255, 255, 255, 0.14)"
  glass-fill-night: "rgba(255, 255, 255, 0.04)"
  glass-rim: "rgba(255, 255, 255, 0.65)"
  glass-rim-night: "rgba(255, 255, 255, 0.25)"
typography:
  display:
    fontFamily: "Syne, sans-serif"
    fontSize: "clamp(24px, 3vw, 32px)"
    fontWeight: 400
    lineHeight: 1.15
  headline:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(28px, 5vw, 40px)"
    fontWeight: 700
    lineHeight: 1
  title:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(18px, 3vw, 24px)"
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: "Geist, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.8
  kicker:
    fontFamily: "Syne, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.1em"
  label:
    fontFamily: "Geist Mono, monospace"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.18em"
  tag:
    fontFamily: "Geist Mono, monospace"
    fontSize: "10px"
    fontWeight: 500
    letterSpacing: "0.15em"
rounded:
  none: "0px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  2xl: "18px"
  3xl: "20px"
  full: "999px"
spacing:
  section: "5rem"
  section-mobile: "3.5rem"
  gutter: "clamp(1.5rem, 6vw, 5rem)"
  gutter-mobile: "1.25rem"
  target: "44px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 28px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 28px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.wash}"
  button-glass:
    backgroundColor: "{colors.glass-fill}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "12px 32px"
  tag:
    backgroundColor: "{colors.glass-fill}"
    textColor: "{colors.ink}"
    typography: "{typography.tag}"
    rounded: "{rounded.none}"
    padding: "6px 14px"
  card-glass:
    backgroundColor: "{colors.glass-fill}"
    rounded: "{rounded.3xl}"
    padding: "clamp(0.9rem, 1.4vw, 1.15rem)"
  nav-link:
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0 14px"
    height: "44px"
---

# Design System: Loyd.io

## Overview

**Creative North Star: "The Glass Workbench"**

An engineer's bench under a sheet of liquid glass. The work (web platforms, mobile apps, embedded hardware, graphic design) is laid out on a quiet monochrome surface with the precision of a spec sheet, and every control you can touch is a piece of beveled, lit glass sitting on top of it. The bench is paper-white by day and graphite by night; the glass is the same in both, only its light changes.

The system is two materials meeting. **The bench** is editorial and brutalist: square mono buttons and tags, lowercase Syne kickers with an em dash, numbered sections, generous whitespace, no decoration that isn't typography. **The glass** is tactile: capsules and cards with a razor top highlight, a left bevel, a darker bottom edge and a soft drop shadow, blurred and saturated over whatever sits behind. Glass means *you can touch or read this*; the bench is where the content rests.

One thing breaks the monochrome on purpose: **Gengar**, the pixel-art AI companion who roams the page, throws Shadow Balls at the cursor and opens a full-screen chat. He is the only chromatic voice on the site, and his mischief is the personality; the rest of the interface stays out of his way.

**Key Characteristics:**
- Monochrome paper/ink palette with a single semantic green; purple belongs to Gengar alone.
- Three type voices: Syne for headings and kickers, Geist for reading, Geist Mono for anything pressed or measured.
- Two shape families: square mono controls (0 radius) vs. fully round glass capsules.
- Depth from multi-layer glass bevels, not from stacked drop shadows.
- One easing curve for everything, with a small spring allowed only in hover/press feedback.
- 44px touch targets and full keyboard reach, including the companion and every carousel.

## Colors

A neutral zinc scale on near-white paper, inverted wholesale for night; color carries meaning, never mood.

### Primary
- **Ink** (`ink` / `ink-night`): Headings, body emphasis, primary button fill, active nav text, focus ring (via `--accent`, which equals ink in both themes). Inverted in dark mode rather than tinted.

### Neutral
- **Paper** (`paper` / `paper-night`): Page background (`--bg`). Every section sets it explicitly so full-bleed carousels and edge fades match.
- **Sheet** (`sheet` / `sheet-night`): Small opaque surfaces that must not blur what's behind, e.g. the scroll-to-top button (`--surface`). Large opaque surfaces like the project modal use Paper instead.
- **Graphite** (`graphite` / `graphite-night`): Secondary text: descriptions, kickers, timestamps, placeholder-weight copy (`--muted`). Passes 4.5:1 on paper in both themes.
- **Hairline** (`hairline`, `hairline-strong` + night variants): Dividers and outlines (`--border`, `--border-strong`). The base layer defaults every border to `--border`, so a bare `border: 1px solid` is already a hairline.
- **Wash** (`wash` / `wash-night`): Hover and inset fills (`--subtle-bg`, `--hover-bg`, `--accent-subtle`).
- **Glass Fill / Glass Rim** (`glass-fill`, `glass-rim` + night variants): The translucent body and bright 1px rim of every liquid-glass surface.

### Semantic
- **Signal Green** (`signal-green`): The live/online dot, the chat status dot and the "now playing" equalizer bars (`var(--success)`, not Spotify's own green). Nothing decorative is ever green.

### Named Rules
**The One Companion Color Rule.** Gengar's purples (`#9333ea` glows, `#f3e8ff` speech text, the sprite itself) live inside the companion and its chat stage only. No button, link, tag or section ever borrows them.

**The Invert, Don't Tint Rule.** Dark mode swaps the neutral tokens under `[data-theme="dark"]`; components never ship their own dark colors except the glass recipes, whose light physics differ at night. The single exception is the chat stage, which is always night (see Components).

**The Token-Only Rule.** Layout and text colors come from `var(--bg)`, `var(--fg)`, `var(--muted)`, `var(--border)` and friends. Raw hex in a component is a bug unless it is glass physics (rgba white/black highlights), Gengar, or text over a photo. Text over photos is always white on a dark frosted chip (`rgba(0,0,0,0.42)` + 6px blur), as on project year labels, so it reads on any image. Marks inside an inverted button use `currentColor`.

## Typography

**Display Font:** Syne (self-hosted via `next/font`, weights 400–800)
**Body Font:** Geist (self-hosted via `next/font`)
**Label/Mono Font:** Geist Mono (self-hosted via `next/font`)

**Character:** Syne's wide, slightly eccentric geometry gives headings and kickers an editorial, poster-like voice; Geist reads clean and technical at paragraph length; Geist Mono turns every control and number into a spec-sheet annotation.

### Hierarchy
- **Display** (Syne 400, `clamp(24px, 3vw, 32px)`, 1.15): Section headings ("Photo Gallery", "Selected Works"), project titles, modal titles.
- **Headline** (Geist 700, `clamp(28px, 5vw, 40px)`, 1): The hero name only.
- **Title** (Geist 500, `clamp(18px, 3vw, 24px)`, 1.3): The hero role line ("Computer Engineer — Full-Stack, Mobile & Embedded").
- **Body** (Geist 500, 15px, 1.8): Bio, descriptions, modal copy, in `--muted`. Keep measure under ~70ch; cards clamp descriptions to 2 lines.
- **Kicker** (Syne 400, 11px, 0.1em, lowercase): Section labels in the form `— projects` or `01 — projects`, in `--muted`.
- **Label** (Geist Mono 500, 11px, 0.18em, UPPERCASE): Buttons, CTAs ("VIEW PROJECT ↗"), counters.
- **Tag** (Geist Mono, 10px, 0.15em, UPPERCASE): Tech chips, years, metadata.

### Named Rules
**The Three Voices Rule.** Syne names things, Geist explains them, Mono is anything you press, count or date. If a string is interactive or numeric, it's Mono; if it's a heading or kicker, it's Syne; everything you read is Geist.

**The Kicker Grammar Rule.** Kickers are lowercase Syne with a leading em dash (`— certifications`); numbered sections put the index before the dash (`03 — certifications`). A section's kicker *is* its heading: render it as the `h2` (sub-blocks `h3`) with `.section-kicker`, and wrap the index and dash in `aria-hidden` so screen readers hear "Certifications", not "zero three dash".

## Layout

A single centered column on a wide field. Sections use `.lean-section` (`5rem` vertical padding, `3.5rem` at ≤640px) wrapping `.section-container` (max-width 960px, side gutter `clamp(1.5rem, 6vw, 5rem)`, `1.25rem` on phones). Carousels and marquees break out with `.full-bleed` / `.design-carousel-bleed` and fade into the page with `--bg` gradients at both edges.

**Fixed chrome, by layer:**
| Layer | z-index | Element |
|---|---|---|
| Chat stage | 999998–999999 | Gengar's full-screen chat (portal) |
| Modals | 10090 | Project modal backdrop + shell |
| Corner badges | 10070 | Logo monogram (top-left), visitor counter (top-right) |
| Nav | 10060 | Floating pill nav |
| Projectiles | 10050 | Shadow Ball sprite |
| Companion | 10045 | Roaming Gengar button |
| Utility | 7990 | Scroll-to-top |

**Responsive behavior.** Content-driven breakpoints: 900px (tablet reflow), 640px (the phone switch: nav docks to the bottom, grids go single-column), 600px (legacy synonym still used by many rules; treat as 640), 480/380px (tight phones). At ≤640px the pill nav docks to `bottom: max(14px, env(safe-area-inset-bottom))` at `calc(100vw - 32px)` wide with equal-width links. Headings always use `clamp()`.

**The 44px Rule.** Every tap target is at least 44×44px: nav links, theme toggle, logo, carousel arrows, social icons, buttons, close buttons. Where the visual must stay small (the 34px logo badge, 6px carousel dots), the hit area grows invisibly with padding plus negative margin, never with a bigger visual. Dots may drop to the WCAG AA floor of 24px.

## Elevation & Depth

Depth comes from **glass physics, not stacked shadows**. Every glass surface is a lens with the same anatomy, layered in one `box-shadow`:

1. Razor top specular line: `inset 0 2px 0 0 rgba(255,255,255,0.95)` (0.72 at night)
2. Soft upper reflection: `inset 0 4px 10px -2px rgba(255,255,255,0.16)`
3. Left bevel: `inset 2px 0 0 0 rgba(255,255,255,0.45)`
4. Bottom anchor: `inset 0 -1px 0 0 rgba(0,0,0,0.05)` (0.65 black at night, so the edge reads)
5. Right edge: `inset -1px 0 0 0 rgba(0,0,0,0.03)`
6. Crystal rim: `0 0 0 1px rgba(255,255,255,0.38)`
7. Aura: `0 0 16px 0 rgba(255,255,255,0.16)`
8. One drop shadow, scaled to the object's size: `0 3px 12px` (list rows) → `0 6px 26px` (contact frame) → `0 12px 36px` (cards) at 6–8% black (40%+ at night)

…over `backdrop-filter: blur(14–28px) saturate(170–210%)`: smaller objects blur less. The bench itself is flat.

### Named Rules
**The Bevel Before Shadow Rule.** A surface earns depth from its highlights and rim first; the single outer drop shadow is the last layer and grows with size, never stacks. The only exception is the opaque project modal, which floats on a deep two-layer shadow because it replaces the page rather than sitting on it.

**The Glass Means Touch Rule.** Liquid glass is for things you interact with or read inside (buttons, pills, tags, cards, the nav, the contact frame). Plain text sections, headings and backgrounds stay on the flat bench.

## Shapes

Two families that never mix on one element:
- **Square** (0 radius): `.btn` mono buttons and `.tag` chips. Editorial, brutalist, spec-sheet.
- **Capsule** (999px / 50%): glass buttons, the nav pill and its active highlight, the visitor counter, icon buttons, carousel dots.

Containers sit between, softening with size: 4px (small media), 8px (journey rows), 12px (contact frame, media wells), 16px (modal shell, design carousel cards, gallery photos), 18px (58px tech-logo tiles), 20px (dev project cards). The logo monogram is a square badge rotated 12°, straightening on hover.

**The Square-Or-Capsule Rule.** A control is either a square mono button or a round glass capsule. A rounded-rectangle button is off-system.

## Components

### Buttons
Tactile and confident; the press is felt.
- **Primary** (`.btn.btn-accent` / `.btn-primary`): Ink fill, paper text, 1px ink border, square, Mono label, `12px 28px`, min-height 44px. Hover inverts to a transparent outline and lifts `translateY(-2px) scale(1.02)` with a soft `--border-mid` shadow.
- **Outline** (`.btn.btn-outline`): Transparent with a `--border-strong` hairline; hover darkens the border to ink and fills with wash.
- **Glass capsule** (`.liquid-glass-btn`): The hero CTA ("View Resume >") and round icon buttons (carousel arrows, 44px). Hover brightens the glass and scales to 1.08.
- **Motion:** colors ease over 0.22s; the transform uses the Tactile Spring (see Motion under Do's).

### Chips / Tags
- **Style** (`.tag`): Square frosted glass, Mono 10px UPPERCASE 0.15em, `6px 14px`. Used for tech stacks, categories, years.

### Cards / Containers
- **Dev project card** (`.dev-project-card.liquid-glass-card`): 20px radius glass card with a 16:9 media well (12px radius, `--subtle-bg`), a Syne title clamped to 2 lines, a 2-line Geist description, and a centered Mono "VIEW PROJECT ↗" CTA. Hover lifts 3px; a cursor spotlight follows inside.
- **Design carousel** (`.design-carousel-card`): 16px radius glass cards on a 3D stage. Neighbors sit at 0.76 scale, 34% opacity and desaturated; the active card carries a 2px ink progress bar that grows with `scaleX`. Controls: 44px round glass arrows plus 24px dot targets drawing a 6px mark.
- **Journey rows** (`.exp-glass-card`, 8px) and the **contact frame** (`.contact-glass-wrapper`, 12px, `3rem 2.5rem`).

### Inputs / Fields
- **Search/filter** (`.subpage-search-input`): Capsule, `--subtle-bg` fill, `--border-strong` hairline; focus turns the border ink with a 1px ink ring.
- **Chat input** (`.gengar-input`): Borderless Mono 16px on the dark chat stage; the underline brightens from 22% to 85% white as its focus indicator.

### Navigation
- **Pill nav** (`.pill-nav`): A floating glass capsule, top-center on desktop, docked bottom on phones. Links are Syne 13px at 55% opacity, 90% on hover, 100% when active, with a spring-animated 32px active highlight (`layoutId`) inside a 44px-tall target. A hairline divider separates the 44px theme toggle.
- **Corner chrome:** rotated monogram badge top-left (scrolls to top), visitor counter capsule top-right.

### Dialogs
- **Project modal** (`.pm-shell`): A solid `--bg` shell (max 640px wide, 88vh tall, 16px radius, `--border-strong` hairline) over a 72% black backdrop; screenshot gallery on top, details below. It is the one elevated surface that is *not* glass: it lifts on a deep two-layer shadow (`0 32px 80px` + `0 8px 20px` black) because it must be fully opaque over busy content. `role="dialog"`, focus trapped (`useFocusTrap`), starts on Close, returns focus to the opener, Escape and ←/→ supported.

### Gengar, the companion (signature)
A 76px pixel-art ghost who wanders the viewport, faces his direction of travel, and every ~12s may charge and throw a Shadow Ball (16-frame WebP sprite played with CSS `steps(16, jump-none)`, 3.2s) at the cursor. He is a real `<button>` ("Chat with Gengar, Loyd's AI assistant"), draggable, and pauses on hover/focus.
- **Chat stage:** always-dark full-screen overlay (`rgba(8,8,12,0.96)` + 32px blur) with a giant looming Gengar, a Geist speech line, and a Mono `>` prompt. It is a modal dialog: labelled, focus-trapped, a 44px Close capsule, replies announced once via a polite live region, input stays focusable (read-only) while streaming.
- **Reduced motion:** Gengar parks in his corner as a still sprite (`/gengar-still.png`); no roaming, no Shadow Balls.

## Do's and Don'ts

### Do:
- **Do** use `var(--bg)`, `var(--fg)`, `var(--muted)`, `var(--border)`, `var(--surface)`, `var(--subtle-bg)` for every layout and text color.
- **Do** build new containers from `.liquid-glass-card` / `.liquid-glass-btn` / `.tag`, or reproduce the full 8-layer glass shadow with both light and `[data-theme="dark"]` values.
- **Do** ease everything with the **Settle** curve `cubic-bezier(0.16, 1, 0.3, 1)` (Framer: `[0.16, 1, 0.3, 1]`): 0.2–0.35s for state changes, 0.5–0.6s for entrances (fade + 20px rise, `useInView` once, `margin: "-60px"`), staggered ~0.07s per item.
- **Do** keep the **Tactile Spring** `cubic-bezier(0.34, 1.56, 0.64, 1)` for small hover/press transforms on controls only (the `.btn` lift, the logo badge straightening), at ≤0.35s and ≤1.08 scale. Framer springs are allowed for the same job (nav active highlight, photo stack).
- **Do** animate with `transform` and `opacity`; grow bars with `scaleX`, not `width`; leave `will-change` off at rest.
- **Do** wrap motion in the global `MotionConfig reducedMotion="user"` (already in `layout.tsx`) and give custom JS motion an explicit reduced path, as Gengar and the photo stack do.
- **Do** give every control a 44px target, a visible `:focus-visible` ring (2px `--accent`, 3px offset), and keyboard parity: dialogs use `useFocusTrap`, carousels and stacks take arrow keys.
- **Do** fetch content on the server (`page.tsx`, `revalidate = 60`) and pass it down as props, so it ships in the HTML.

### Don't:
- **Don't** use the Tactile Spring (or any overshoot) on entrances, page transitions, layout, cards or modals. Only controls spring.
- **Don't** introduce a second accent color, gradients as decoration, or Gengar's purple outside the companion.
- **Don't** hardcode `#000`, `#fff`, `#111` for layout or text in components; glass highlights and the always-dark chat stage are the only exceptions.
- **Don't** make a rounded-rectangle button; controls are square mono or round glass.
- **Don't** add sound or autoplaying audio; the site is silent.
- **Don't** stack multiple drop shadows or put glass on non-interactive text sections.
- **Don't** fetch page content client-side in a `useEffect` when the server can render it.
- **Don't** let fixed chrome sit above a modal; new overlays go at or above z-index 10090.
