# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Magiklch — OKLCH color palette generator. Pure client-side Next.js app. Input any CSS color, get 11 perceptually uniform shades using OKLCH color science. No backend, no database.

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
User Input (any CSS color) → color-parser → color-engine → Palette { 11 shades }
                                               ├── curves (L/C/H per step)
                                               ├── gamut (sRGB/P3 check + clamp)
                                               ├── contrast (APCA via apca-w3)
                                               └── color-formatter (HEX/HSL/OKLCH/cssvar)
```

### Color Engine (`lib/`)

All functions are **pure** — no I/O, no state, no DOM. Key design decisions:

- Input lightness is always **discarded** — `SHADE_LIGHTNESS` curve determines L for each shade
- Gamut check happens BEFORE sRGB mapping — `gamut` field reflects the original color
- HEX/HSL output comes from the sRGB-mapped (safe) version
- APCA uses absolute Lc values (`Math.abs`), not signed
- NaN hue guard for achromatic inputs (`h = isNaN(h) ? 0 : h`)
- Every file using culori must start with `import "./setup-culori"` (registers modes/parsers)

### culori Tree-Shaking

culori is imported via `culori/fn` (enforced by tsconfig + vitest aliases). Never import from `culori` directly — it would bundle the entire library.

```json
// tsconfig paths
"culori": ["./node_modules/culori/fn"]
```

### URL-First State

All palette state lives in URL search params (`?h=259&c=0.214&name=blue`). No global state store.

### Routes

| Route | Purpose |
|-------|---------|
| `/` | Generator — input color, see 11 shades |
| `/catalogue` | Browse Tailwind + curated palettes |
| `/random` | Random palette generator |

## Component System

**Always use Lyse Registry components first.** If no Lyse component exists for a UI need, fall back to shadcn/ui + Radix.

### Dual-File Pattern

Every UI component has two files:
- `component.tsx` — Structure, variants (CVA), Radix primitives, `data-slot` attributes
- `component.css` — Visual theming only, uses semantic CSS tokens (no hardcoded colors)

Customize appearance by editing `.css` only — never hardcode colors in `.tsx`.

### Available Lyse Components (`components/ui/`)

action-card, avatar, badge, banner-info, button, callout-card, checkbox, chip, dropdown-menu, input, menu, modal, progress, radio, select, spinner, spotlight-card, tabs, tag, textarea, toast, toggle, tooltip

### Component Conventions

- Named exports only (no `default` exports)
- `data-slot="component-name"` on root elements
- CVA for variant management, CSS classes for theming
- Focus ring: `box-shadow` double-layer (white gap + color ring), not `outline`
- `isIconOnly` prop adds `aspect-square px-0`
- Compound components share context (e.g., Tabs → TabsContext stores variant + size)

## CSS Token Architecture

Three-layer system in `styles/lyse/`:

```
Layer 1: Primitives      root-colors.css, root-typography.css, root-layout.css
         (raw values)    --root-color-brand-500, --root-font-size-md, --root-space-4

Layer 2: Semantics       semantic-colors.css, semantic-global.css
         (mode-aware)    --background-brand-strong-default (flips in .dark)

Layer 3: shadcn Bridge   shadcn-bridge.css
         (integration)   --background, --primary → maps to Layer 2 tokens
```

**Always use semantic tokens (Layer 2)** in component CSS. Use primitives only when semantic tokens don't cover the case. Never use raw color values.

## Dark Mode

- `next-themes` with `attribute="class"` and `@custom-variant dark (&:is(.dark *))`
- Semantic tokens auto-flip in `.dark {}` blocks
- Color swatches render at actual color regardless of theme

## Tailwind v4

No `tailwind.config.ts` — configured via `@theme inline {}` in `globals.css`. CSS custom properties are mapped to Tailwind utilities there.

## Types (`types/color.ts`)

Core types: `OklchColor`, `ShadeStep` (50-950), `GamutStatus`, `ContrastLevel`, `PaletteShade`, `Palette`, `ColorInput`, `ColorFormat`

## Specs

Implementation is driven by specs in `specs/active/`. Reference docs in `docs/` for color science (`COLORS.md`), engineering (`ENGINEERING.md`), design (`DESIGN.md`), and palette algorithms (`PALETTES.md`).

## Status

Spec 1 (Foundations) and Spec 2 (Color Engine) are complete. Specs 3-5 (Generator Page, Catalogue, Random + Polish) are pending.
