---
name: Loyd.io
description: Portfolio of Loyd De Guzman — computer engineer building web, mobile and embedded products. One quiet column of Inter on soft grey; light only, no glass.
colors:
  paper: "#f6f6f6"
  ink: "#0a0a0a"
  graphite: "#5c5c5c"
  faint: "#6e6e6e"
  sheet: "#ffffff"
  well: "#e9e9e9"
  hairline: "#e5e5e5"
  hairline-strong: "#d4d4d4"
  wash: "rgba(0, 0, 0, 0.04)"
  signal-green: "#22c55e"
  dock: "#18181b"
  dock-ink: "#fafafa"
typography:
  heading:
    fontFamily: "Inter, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "-0.03em"
  prose:
    fontFamily: "Inter, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.625
    letterSpacing: "-0.03em"
  tip:
    fontFamily: "Inter, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  sm: "2px"
  md: "16px"
  lg: "24px"
  full: "999px"
spacing:
  row: "4px"
  sm: "16px"
  md: "32px"
  section: "56px"
  block: "120px"
components:
  dock-item:
    backgroundColor: "{colors.dock}"
    textColor: "{colors.dock-ink}"
    rounded: "{rounded.full}"
    width: "40px"
    height: "44px"
  work-card:
    backgroundColor: "{colors.well}"
    rounded: "{rounded.lg}"
    width: "min(782px, 100vw - 32px)"
  info-row:
    textColor: "{colors.ink}"
    columns: "128px 1fr auto"
---

# Design System: Loyd.io

## Overview

**Creative North Star: "The Quiet Column"**

One narrow column of text on soft grey paper, read top to bottom like a well-set résumé. Everything is 15px Inter; hierarchy comes from weight (600 headings, 500 body) and ink tone (ink, graphite, faint), never from size. Images are the only large things on the page, and they live in a single sideways carousel. On phones and tablets a dark icon dock floats at the bottom as the one heavy object; on desktop a hairline section ruler on the right edge takes its place.

**Key Characteristics:**
- Light only. One paper tone (`#f6f6f6`), three ink tones, no dark mode.
- One typeface, one size: Inter 15px, tight tracking (`-0.03em`).
- A 576px reading column; the carousel and GitHub calendar widen to 782px.
- Flat: no blur, no glass, no shadows. Depth is tone plus a 1px hairline.
- Navigation is a dark dock at the bottom on touch and small screens, and a section ruler on the right edge on desktop; nothing pinned to the top.

## Colors

- **Paper** (`--bg` `#f6f6f6`): The page.
- **Ink** (`--fg` `#0a0a0a`): Headings, table values, inline links.
- **Graphite** (`--muted` `#5c5c5c`): Intro prose and meta lines.
- **Faint** (`--faint` `#6e6e6e`): Table labels, right-hand column, Copy button, link arrows at rest.
- **Sheet** (`--surface` `#fff`): The GitHub calendar card and round buttons.
- **Well** (`--well` `#e9e9e9`): Empty image wells in the carousel.
- **Hairline** (`--border` `#e5e5e5`) / **Strong** (`--border-strong` `#d4d4d4`): Card edges; button circles and link underlines.
- **Signal Green** (`--success`): Only the "now playing" equalizer.
- **Dock** (`--dock-bg` `#18181b`, filled at 90% as `--dock-capsule`; `--dock-fg` `#fafafa`; `--dock-border` 12% white): The bottom navigation dock only.

**The Three Inks Rule.** Text is ink, graphite or faint. Nothing else, no accent color.

## Typography

Everything is Inter (self-hosted via `next/font`, exposed as `--font-sans`) at **15px**, weight 500, tracking `-0.03em`.
- **Heading** (600, 1.5): Name and section titles. Table sections are left-aligned; wide sections (Selected work, GitHub activity) are centered.
- **Prose** (500, 1.625, graphite): The two intro paragraphs, max 512px wide.
- **Body** (500, 1.5): Table rows, card titles, meta.
- **Tip** (12px): Dock tooltips.

**The One Size Rule.** Don't add a bigger heading. Emphasis is weight or ink, never size.

## Layout

Routes: `/` and `/work/[id]`. Home, top to bottom: intro (`#about`) → Selected work (`#work`) → GitHub activity → info tables (`#experience`: Work, Recognition, Research, Contact `#contact`) → footer row → dock.

- **Column** (`.column`): `min(576px, 100vw - 32px)`, centered. Intro starts 148px from the top (96px on phones).
- **Wide** (`--card`): `min(782px, 100vw - 32px)` for carousel cards and the calendar.
- **Spacing**: 120px between blocks (88px on phones), 56px between info sections, 4px between table rows, 16px under a left heading, 32px under a centered one.
- **Info row** (`.info-row`): grid `128px 1fr auto` (96px label on phones), 16px column gap. Label and aside are faint; text is ink.
- **Breakpoint**: one, at 640px.

**Fixed chrome:**
| Layer | z-index | Element |
|---|---|---|
| Dock | 100 | Bottom icon dock |
| Ruler | 90 | Section ruler (desktop only) |
| Project bar | 40 | Back / Visit site on project pages |

The body pads its bottom by 120px so the dock never covers the footer (96px on desktop, where there is no dock).

## Elevation & Depth

None. Surfaces are flat fills with at most a 1px hairline. No `backdrop-filter`, no translucent surfaces, no box-shadows anywhere.

## Shapes

- **24px**: Carousel image wells and the calendar card (16px on phones).
- **Full**: The dock, its tooltips, round buttons, the now-playing pill.
- **2px**: Calendar cells.

## Components

- **Inline links** (intro, table values, calendar meta): Ink text with a 1px underline at 3px offset. Prose links rest on the strong hairline; table links rest invisible. Both turn ink on hover.
- **Selected work** (`SelectedWork.tsx`): Native scroll-snap track (`scroll-snap-type: x mandatory`, hidden scrollbar), cards centered, 20px gap. Each card is an image well (782:407, screenshot anchored to the top) with its title below, and the whole card links to its project page. On hover or focus the screenshot scales to 1.04 inside the clipped well (0.6s Settle); the card itself never moves. Prev/next are `.round-btn`s: a 44px hit area drawing a 32px sheet circle with a strong hairline. They scroll to the neighbouring card's center.
- **GitHub activity** (`GitHubContributions.tsx`): Centered heading, graphite meta line with the total and profile link, then the calendar in a sheet card.
- **Info tables** (`InfoSection` in `page.tsx`): `<dl>` rows of label / text / aside. Data lives in `src/lib/content.ts`.
- **Project page** (`src/app/work/[id]/page.tsx`, one static page per project in `content.ts`): Fixed bar with ← Back (to `/#work`) left and Visit site ↗ right (pinned from 1100px up, where it clears the column; below that it scrolls away). Then, in the 782px wide column: faint role / period, title, graphite summary, faint stack line joined with " · ", a `.pill-btn` Visit site (44px, strong hairline, ink on hover), the screenshot well, a "What I did" list in graphite, and a hairline-topped "Next project" row (title left, faint role right). No dock on this page.
- **Section ruler** (`ScrollMeter.tsx`, `.ruler`, mounted in the root layout): A 240px hairline ruler fixed at the right edge, vertically centered: a 1px spine with 6px minor ticks every 10px, a longer 14px tick for each `[data-section]` element (home: Intro, Work, GitHub, Experience; project pages: Overview, What I did, Next), and a 24×2px ink marker at scroll progress (`--p`). A section's tick sits where the marker will be when that section reaches the top; the section you're in turns its tick ink. On hover, 12px labels fade in to the left of the ticks (on a paper pill); clicking one scrolls there. Positions re-measure when the page height changes. Shown only at 1100px+ with a fine pointer that can hover. On desktop it replaces the dock, so it is real navigation: a `<nav aria-label="Page sections">` of tabbable buttons with `aria-current` on the active section, and labels also appear on keyboard focus (`:focus-within`).
- **Copy button** (`.text-btn`): Faint text "Copy" → "Copied" (polite live region), hit area grown to 44px with padding plus negative margin.
- **Footer**: One info row: © year / name / place.
- **Icon dock** (`Navbar.tsx`, `.dock`): A dark capsule at 90% opacity (`--dock-capsule`, no blur) fixed bottom-center, shown only below the desktop query (hidden at 1100px+ with a fine hover pointer, where the section ruler takes over), at `max(20px, safe-area + 12px)`, centered with auto margins so Framer can animate `y`. Order: the Loyd logo mark (back to top; `public/logo.svg` inlined at 20px with `currentColor`), a 20px divider, then Work, Experience and Contact as solid icons (hand-drawn filled folder, briefcase and envelope, 18px; lucide has no filled set). Padding 3px 6px; each item is a 40×44px target; icons rest at 55% white and go full white on hover or when their section crosses the viewport middle (Contact also wins at the bottom of the page). Icon-only, so every item has an `aria-label` plus a tooltip (`.dock-tip`) on hover and keyboard focus, hidden on touch. Inset 2px white focus ring.

## Motion

- **Settle** `cubic-bezier(0.16, 1, 0.3, 1)` (`--settle`) for every transition (0.2s), the dock entrance (0.5s fade + 20px rise) and the carousel screenshot zoom (0.6s, scale 1.04 inside its well).
- Anchor links scroll smoothly (`scroll-behavior: smooth`, `scroll-padding-top: 48px`).
- `MotionConfig reducedMotion="user"` wraps the app; the CSS reduced-motion block kills transitions, animations and smooth scrolling.

## Do's and Don'ts

### Do:
- **Do** keep content in `src/lib/content.ts` and pass it down as props, so the page stays fully static.
- **Do** stay at 15px Inter and say hierarchy with weight and ink tone.
- **Do** put new list-like content in an info table, not in cards.
- **Do** give every control a 44px target, a visible focus ring and an accessible name.

### Don't:
- **Don't** add dark mode, a theme toggle, or any accent color.
- **Don't** use `backdrop-filter`, glass, translucency, glows or shadows.
- **Don't** add headline sizes, numbered section kickers or uppercase labels.
- **Don't** lift or scale things on hover; change ink or hairline instead. The one exception is the screenshot inside a carousel well, which zooms within its clipped frame.
- **Don't** let fixed chrome cover content; pad for the dock.
