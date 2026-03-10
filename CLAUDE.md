# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Magiklch — OKLCH color palette generator. Pure client-side Next.js app. Input any CSS color, get 11 perceptually uniform shades using OKLCH color science. No backend, no database.

Live: https://magiklch.vercel.app

## Commands

```bash
npm run dev          # Next.js dev server with Turbopack (port 3000)
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npx vitest           # Run all tests
npx vitest run path  # Run single test file
```

## Architecture

```
User Input (any CSS color) > color-parser > color-engine > Palette { 11 shades }
                                               |-- curves (L/C/H per step)
                                               |-- gamut (sRGB/P3 check + clamp)
                                               |-- contrast (APCA via apca-w3)
                                               +-- color-formatter (HEX/HSL/OKLCH/cssvar)
```

### Color Engine (`lib/`)

All functions are **pure** (no I/O, no state, no DOM). 84 test cases via Vitest.

| File | Purpose |
|------|---------|
| `color-parser.ts` | Parse any CSS color (hex, hsl, oklch, rgb, named) to OKLCH |
| `color-engine.ts` | Generate 11 shades from OKLCH input with gamut + APCA |
| `color-formatter.ts` | Format OKLCH to hex, hsl, CSS oklch, CSS var |
| `contrast.ts` | APCA contrast calculation (apca-w3) |
| `curves.ts` | L/C/H curves per shade step (50-975) |
| `gamut.ts` | Gamut check (sRGB vs P3) + sRGB clamping |
| `utils.ts` | Utility functions (round, clamp) |
| `setup-culori.ts` | Register culori modes/parsers (MUST import before using culori) |

Key design decisions:

- Input lightness is always **discarded** — `SHADE_LIGHTNESS` curve determines L for each shade
- Gamut check happens BEFORE sRGB mapping — `gamut` field reflects the original color
- HEX/HSL output comes from the sRGB-mapped (safe) version
- APCA uses absolute Lc values (`Math.abs`), not signed
- NaN hue guard for achromatic inputs (`h = isNaN(h) ? 0 : h`)
- Every file using culori must start with `import "./setup-culori"`

### culori Tree-Shaking

culori is imported via `culori/fn` (enforced by tsconfig + vitest aliases). Never import from `culori` directly.

```json
// tsconfig paths
"culori": ["./node_modules/culori/fn"]
```

### URL-First State

All palette state lives in URL search params (`?h=259&c=0.214&name=blue`). No global state store.

### Routes

| Route | Purpose |
|-------|---------|
| `/` | Generator: input color, see 11 shades, export |
| `/catalogue` | Browse 22 Tailwind + 7 curated palettes |
| `/catalogue/[palette]` | Palette detail with full specs |
| `/random` | Random palette generator |
| `/docs` | Interactive OKLCH guide with 5 live demos |

### Layout Structure

- **Header** (top): Logo + Beta badge, theme pill, GitHub link
- **Sidebar** (left, collapsible): Navigation (Generator, Catalogue, Shuffle, Docs, Built with Lyse, LinkedIn)
- **Main content**: Page-specific, scrollable
- **Export footer**: Only on generator + palette detail pages

## Component System

**Always use Lyse Registry components first.** If no Lyse component exists for a UI need, fall back to shadcn/ui + Radix.

### Dual-File Pattern

Every UI component has two files:
- `component.tsx` — Structure, variants (CVA), Radix primitives, `data-slot` attributes
- `component.css` — Visual theming only, uses semantic CSS tokens (no hardcoded colors)

Customize appearance by editing `.css` only — never hardcode colors in `.tsx`.

### Available Lyse Components (`components/ui/`)

action-card, avatar, badge, banner-info, button, callout-card, checkbox, chip, dropdown-menu, input, menu, modal, progress, radio, select, spinner, spotlight-card, tabs, tag, textarea, toast, toggle, tooltip

### Component Folders

| Folder | Contents |
|--------|----------|
| `components/ui/` | 20+ Lyse Registry components (dual-file pattern) |
| `components/layout/` | header, sidebar, sidebar-context, page-header, theme-pill, footer, export-footer, logo-svg |
| `components/palette/` | color-input, lch-sliders, palette-grid, shade-card, format-toggle, export-palette, generator-shell |
| `components/catalogue/` | catalogue-grid, catalogue-filter, palette-preview, palette-detail-shell |
| `components/docs/` | section-nav, channel-explorer, uniformity-demo, gradient-comparison, gamut-explorer, live-palette-demo |
| `components/random/` | random-shell |
| `components/shared/` | copy-button, gamut-badge, contrast-badge |

### Component Conventions

- Named exports only (no `default` exports)
- `data-slot="component-name"` on root elements
- CVA for variant management, CSS classes for theming
- Focus ring: `box-shadow` double-layer (white gap + color ring), not `outline`
- `isIconOnly` prop adds `aspect-square px-0`
- Compound components share context (e.g., Tabs > TabsContext stores variant + size)

## Hooks

| Hook | Purpose |
|------|---------|
| `use-palette.ts` | Manage palette state from URL params (h, c, l, name) |
| `use-color-format.ts` | Manage output format preference (hex/hsl/oklch/cssvar) |
| `use-copy.ts` | Copy-to-clipboard with toast notification |

## Data (`data/`)

| File | Purpose |
|------|---------|
| `all-palettes.ts` | Union of tailwind + curated palettes |
| `tailwind-palettes.ts` | 22 Tailwind-inspired palettes |
| `curated-palettes.ts` | 7 curated palettes |

## Types (`types/color.ts`)

Core types: `OklchColor`, `ShadeStep` (50-975), `GamutStatus`, `ContrastLevel`, `PaletteShade`, `Palette`, `ColorInput`, `ColorFormat`, `PaletteUrlState`

## CSS Token Architecture

Three-layer system in `styles/lyse/`:

```
Layer 1: Primitives      root-colors.css, root-typography.css, root-layout.css
         (raw values)    --root-color-brand-500, --root-font-size-md, --root-space-4

Layer 2: Semantics       semantic-colors.css, semantic-global.css
         (mode-aware)    --background-brand-strong-default (flips in .dark)

Layer 3: shadcn Bridge   shadcn-bridge.css
         (integration)   --background, --primary > maps to Layer 2 tokens
```

**Always use semantic tokens (Layer 2)** in component CSS. Use primitives only when semantic tokens don't cover the case. Never use raw color values.

## Dark Mode

- `next-themes` with `attribute="class"` and `@custom-variant dark (&:is(.dark *))`
- Semantic tokens auto-flip in `.dark {}` blocks
- Color swatches render at actual color regardless of theme

## Tailwind v4

No `tailwind.config.ts` — configured via `@theme inline {}` in `globals.css`. CSS custom properties are mapped to Tailwind utilities there.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 + React 19 + Tailwind v4 |
| UI | Lyse Registry + Radix UI + CVA |
| Color | culori (tree-shaken) + apca-w3 |
| Fonts | DM Sans (headings) + Inter (body) |
| Icons | react-icons/bi (BoxIcons) + lucide-react |
| Theme | next-themes |
| Testing | Vitest (84 tests on pure functions) |
| Deploy | Vercel |

## Docs Page (`/docs`)

Interactive OKLCH guide with 7 sections and 5 client-side demo components:

| Section | Demo Component | What it does |
|---------|---------------|--------------|
| Introduction | (static) | Hero, OKLCH spectrum bar, badges |
| Problem with HSL | `uniformity-demo.tsx` | Single lightness slider, 8 hues HSL vs OKLCH |
| Three channels | `channel-explorer.tsx` | L/C/H sliders with live color bar + CSS output |
| Better gradients | `gradient-comparison.tsx` | 4 HSL vs OKLCH gradient pairs side by side |
| Wide gamut | `gamut-explorer.tsx` | Hue + chroma sliders with sRGB/P3 badge |
| Build palettes | `live-palette-demo.tsx` | Color input with 4 presets, instant 11-shade output |
| Use in CSS | (static) | Single code block with syntax examples |

Right-side sticky anchor nav (`section-nav.tsx`) visible on xl+ screens, uses IntersectionObserver on `#main-content`.

## Specs

All specs shipped. Reference docs in `docs/` for color science (`COLORS.md`), engineering (`ENGINEERING.md`), design (`DESIGN.md`), and palette algorithms (`PALETTES.md`).
