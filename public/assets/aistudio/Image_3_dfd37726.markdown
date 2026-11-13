---
name: ImpactConnect Design System
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3d4947'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#b90538'
  on-tertiary: '#ffffff'
  tertiary-container: '#dc2c4f'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.5rem
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.625rem
    fontWeight: '700'
    lineHeight: 2.125rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.375rem
    fontWeight: '600'
    lineHeight: 1.875rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.625rem
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  label-lg:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
  stat-numeric:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 1.75rem
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes a welcoming, ultra-credible visual framework engineered for mobile micro-philanthropy, grassroots community initiatives, and corporate CSR matching. The brand personality balances transparent stewardship with warm human optimism. It avoids transactional coldness while steering clear of performative, overly-sentimental charity aesthetics.

### Visual Aesthetic & Movement
The design combines **Modern Corporate Clarity** with **Soft Humanist Tactility**:
- **Pristine, Airy Base:** Clean, soft-slate backgrounds establish institutional rigor and legibility.
- **Friendly Authority:** Rounded sans-serif typography paired with controlled 8px base radiuses (`roundedness: 2`) project approachability without looking juvenile.
- **High-Impact Stewardship:** Financial metrics, matching multipliers, and tax-deductible verification tokens receive high-contrast visual framing to convert hesitation into committed micro-donations.

## Colors

The palette directly anchors user sentiment around institutional safety and visible impact:

- **Primary Teal (`#0D9488`):** The core anchor for primary CTAs, active campaign highlights, and core donation funnels. Represents financial transparency, vitality, and ethical governance.
- **Secondary Trust Blue (`#2563EB`):** Applied to corporate matching badges, partner CSR credentials, verification checkmarks, and formal receipts.
- **Tertiary Accent Coral (`#F43F5E`):** Reserved for urgent crisis response, time-sensitive matching deadlines, and immediate volunteer dispatches. Must not be used for generic actions.
- **Neutral Deep Slate (`#0F172A`):** Ensures uncompromising contrast against light backgrounds. Body text rests at `#1E293B`, while muted metadata settles at `#64748B`.
- **Surfaces:** Pure White (`#FFFFFF`) card surfaces sit over tinted background planes (`#F8FAFC` and `#F1F5F9`) with crisp architectural dividers (`#E2E8F0`).

## Typography

Typography pairs **Plus Jakarta Sans** for expressive, warm headlines and numeric callouts with **Inter** for dense transactional UI, verification badges, and form interactions.

- **Tabular Figures for Impact:** All metrics, donation tallies, volunteer counters, and progress displays must enable OpenType tabular numbers (`tnum`) to eliminate layout jitter during dynamic live updates.
- **Hierarchy Rules:** Campaign titles strictly employ `headline-md` or `headline-lg` to retain narrative punch on compact displays.
- **Micro-Copy Restraint:** Badges and legal transparency notices leverage `label-md` in semi-bold weight to preserve legibility at sub-14px sizes.

## Layout & Spacing

The layout model is anchored on an 8-point spatial grid with a 4-point sub-grid for dense micro-components:

- **Mobile First Framework:** Mobile devices (base canvas <640px) utilize a single-column fluid layout with a rigid `margin` of `1rem` (16px) and `gutter` of `1rem` (16px), maximizing tap accessibility and edge-to-edge readability.
- **Tablet Reflow (640px - 1024px):** Shifts to a 6-to-8 column adaptive fluid structure with `margin-tablet` of `2rem` (32px), allowing split views for project exploration and sticky donation sheets.
- **Desktop CSR Hub (>1024px):** Centers content inside a max-width container (1200px) with 12 columns, `1.5rem` gutters, and structured sidebar widgets.
- **Vertical Rhythm:** Related data elements (donor avatars, match labels) sit within `space-xs` (4px) to `space-sm` (8px). Standalone interactive panels and input groups separate along `space-md` (16px) and `space-lg` (24px).

## Elevation & Depth

Visual hierarchy relies on crisp, low-opacity layered surfaces rather than aggressive drop shadows.

- **Base Layer (Level 0):** Tinted app canvas (`#F8FAFC`). Flat, non-interactive.
- **Surface Layer (Level 1):** Campaign cards, profile modules, and input blocks in `#FFFFFF` with a crisp 1px perimeter outline (`#E2E8F0`). Shadow is minimal: `0 1px 3px rgba(15, 23, 42, 0.05)`.
- **Raised Interactive (Level 2):** Floating contribution bars, active card states, and category chips: `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Overlay & Sheets (Level 3):** Bottom-sheet donation workflows, modal confirmations, and fixed navigation bars: `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)`.
- **Teal Focus Halo:** Focus rings and selected donation tiers utilize a soft, 3px outer ring tinted with `rgba(13, 148, 136, 0.25)` to eliminate ambiguity while respecting accessibility requirements.

## Shapes

The roundedness level of `2` provides an approachable, ergonomic interface ideal for one-handed mobile interaction:

- **Base UI Radius (0.5rem / 8px):** Applied to standard text fields, micro-cards, and segmented toggle containers.
- **Secondary Large Radius (1rem / 16px):** Standard for primary campaign overview cards, modal dialogs, and bottom sheets.
- **Pill Radius (Full `9999px`):** Reserved exclusively for status indicators (e.g., "Verified 501(c)(3)"), corporate match badges, category filters, and primary round CTA triggers.

## Components

### Buttons & Quick-Give Controls
- **Primary Action (Donate Now / Join):** Height 48px min touch target. Filled `#0D9488` with `#FFFFFF` label text. Font weight 600. `rounded-lg` (16px) for major buttons, or pill-shaped for floating action bars. Pressed state dims to `#0F766E`.
- **Preset Amount Chips:** Quick selector buttons ($10, $25, $50, $100) feature a 1px border in `#E2E8F0` on white. Selected state fills with `#F0FDFA` (Teal 50), borders in `#0D9488`, with primary teal text.
- **Secondary / Match Action:** Filled `#2563EB` or subtle `#EFF6FF` background with `#1D4ED8` text for corporate partner interactions.

### Progress & Dual-Track Meters
- **Track Geometry:** 8px height, continuous pill track (`rounded-full`) on a `#E2E8F0` ground.
- **Dual-State Progression:** Collected funds run in solid `#0D9488`. Pending corporate match pledges layer directly adjacent using a soft diagonal hatch or secondary tint (`#2563EB`), giving immediate visual proof of match potential.

### Badges & Pill Indicators
- **Verified 501(c)(3):** Pill shape, `#EFF6FF` background, `#1D4ED8` text, accompanied by a verified shield icon.
- **Urgent Response:** Pill shape, `#FFF1F2` background, `#E11D48` text, pulse indicator icon.
- **Match Multiplier:** High-visibility chip with `#FEF3C7` background and `#B45309` text (e.g., "2x Match by Google").

### Cards & Feed Tiles
- Elevated white containers (`#FFFFFF`) with 1px border (`#E2E8F0`) and `rounded-lg` corners. Content structured systematically: Category badge + Time remaining at top, headline, dual-track progress bar, impact summary stat, and direct one-tap donation CTA.

### Form Inputs & Currency Fields
- **Amount Field:** Prominent numerical entry featuring a fixed currency symbol ($) in muted slate, font size `1.5rem` (`stat-numeric`), 48px container height, and a 1.5px border transitioning from `#CBD5E1` to `#0D9488` upon focus.
- **Toggles & Role Switchers:** Segmented slider switches allowing instant transitions between "Donor View" and "Volunteer View". Selected segment takes `#FFFFFF` with Level 1 elevation over a `#F1F5F9` track.