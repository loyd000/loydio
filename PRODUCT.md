# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: freelance clients** (confirmed). Small businesses and individuals who need a website, a web or mobile app, a hardware/IoT build, or graphic design work (logos, pubmats, apparel), and are deciding whether to commission Loyd. They judge fast: does this person build real, working things, and can I reach them easily?

*Inferred, not yet confirmed:* clients are mostly in the Philippines, arrive from a shared link, referral or social media, and often browse on a phone. Recruiters still visit (the resume is linked) but the site is not tuned for them.

## Product Purpose

The personal portfolio of John Lloyd De Guzman ("Loyd"), a Computer Engineering graduate who builds across web, mobile, embedded hardware and graphic design. It exists to turn a curious visitor into a client conversation.

Success is a visitor who either **emails Loyd** (the email link or Copy in the Contact table) or **digs into the projects** (opens a project from Selected work). The resume download is a supporting path, not a success metric.

## Positioning

One person who can take a job from hardware to interface: TinyML firmware on an ESP32 (the award-winning CATOK thesis), a production company website (Lampara EIS), a Windows desktop app (Ignite), and the brand graphics around them. Most freelancers a client finds are web-only or design-only; Loyd's range across physical hardware, software and visual design is the thing a neighboring portfolio cannot truthfully copy.

## Operating Context

- Visitors browse on phones and laptops. The site is light only.
- Content is static: Loyd edits projects, work history, recognition, research and contact rows by hand in `src/lib/content.ts`, with images in `public/`. No CMS, no database.
- Live signals on the page: a Spotify "now playing" pill, a GitHub contribution calendar.

## Capabilities and Constraints

- Next.js 16 (App Router, Turbopack), React 19, Tailwind v4, Framer Motion; every page is statically prerendered.
- Routes: `/` and `/work/[id]` (one page per project). A single page: intro, Selected work, GitHub activity, Work, Recognition, Research, Contact.
- Content types: projects and info-table rows, all defined in `src/lib/content.ts` (projects and recognition are placeholders awaiting real entries).
- Accessibility work already shipped and must be preserved: 44px targets, keyboard-operable carousel and dock, reduced-motion paths.

## Brand Commitments

- Name and handle: **Loyd** (full name John Lloyd De Guzman); the "L" monogram.
- The site's visual identity must be **Loyd's own**. The owner chose a pixel / retro-hardware direction for the redesign, but it must be an original world, not a Pokémon look.
- Nothing in the identity borrows Pokémon assets, colors or UI.
- Voice: casual, self-deprecating and honest ("figuring out life one day at a time"), confident about the work.

## Evidence on Hand

- Dev projects: Lampara EIS (company website for a solar installer), Ignite (Windows desktop routine launcher).
- Design projects: Lampara EIS logo, pubmats, shirt design, "Hereafter, Pal".
- Thesis: CATOK, a TinyML + acoustic ESP32-S3 device that judges young coconut ripeness; **Best Thesis** award.
- Internship: AMTEC, UPLB (WordPress catalogue fed by Google Sheets; Python Word-report generator).
- Certifications (Reply Code Challenge participant, Best Thesis Design, The Innovation Lab 2026, and others).
- Resume: `public/RESUME_DE_GUZMAN.pdf`. Portrait: `public/me.jpg` (used for social previews).
- **Absent, never fabricate:** client testimonials, client logos, pricing, response-time promises, project metrics or traffic numbers.

## Product Principles

1. **Proof over polish.** Every section shows a real thing Loyd built; nothing decorative stands in for work.
2. **Two taps to talk.** Contacting Loyd is always obvious and never more than a scroll or tap away.
3. **The range is the pitch.** Hardware, software and design sit side by side, because the combination is the offer.
4. **Personality, not costume.** Playfulness is welcome (the companion, the voice), but it never hides the work or the way to reach him.
5. **Keep it honest.** Only real projects, real credentials and real words; no invented clients or numbers.

## Accessibility & Inclusion

WCAG 2.2 AA as the floor: 44px touch targets (24px minimum for dense dots), full keyboard operation including dialogs and carousels, `prefers-reduced-motion` honored, real alt text on images, and color contrast ≥4.5:1 for body text.
