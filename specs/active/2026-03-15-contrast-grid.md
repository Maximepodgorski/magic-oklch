---
title: Contrast Grid
status: active
created: 2026-03-15
estimate: 5h
tier: standard
---

# Contrast Grid

## Context

Users generate OKLCH palettes but have no way to verify which shade combinations are accessible. The Generator shows APCA contrast per shade (vs white/black) but not shade-to-shade contrast — which is what matters when picking text/background pairs for a design system. An 11×11 APCA contrast matrix integrated as a tab in the Generator solves this without requiring a new page or duplicating the color input UI.

## Prerequisites

- Generator page operational with `usePalette()` + `generatePalette()` + LCH sliders
- APCA contrast engine (`lib/contrast.ts`) with `getContrast()`, `getContrastLevel()`
- Tabs compound component (`components/ui/tabs.tsx`) with underline/pill variants

## Codebase Impact

| Area | Impact | Detail |
|------|--------|--------|
| `lib/contrast.ts` | MODIFY | Add `getContrastFromHex(fgHex, bgHex): number` — hex-to-hex APCA wrapper (current `getContrast` requires `OklchColor` input) |
| `lib/contrast-matrix.ts` | CREATE | `buildContrastMatrix(shades): ContrastMatrix` — pure function, computes N×N pairwise APCA scores |
| `components/palette/contrast-grid.tsx` | CREATE | `ContrastGrid` component — renders 11×11 matrix with hover preview |
| `components/palette/generator-shell.tsx` | MODIFY | Wrap palette swatches + contrast grid in `<Tabs>`, add tab state |

**Files:** 2 create | 2 modify | 0 affected
**Reuse:** `getContrast()` from contrast.ts, `getContrastLevel()` for badges, `useCopy()` for click-to-copy, `Tabs`/`Tooltip` from ui/, `PaletteShade` type
**Breaking changes:** None — `getContrast()` signature unchanged, new function added alongside
**New dependencies:** None

## User Journey

ACTOR: Designer/developer building a design system
GOAL: Find accessible shade combinations from their generated palette
PRECONDITION: User has a palette loaded in Generator (any shade count)

### Primary Journey

1. User generates/tweaks palette in Generator (sliders, color input)
   → System shows palette swatches (current behavior)
   → User sees 11 shade strip as before

2. User clicks "Contrast" tab (next to "Shades" tab)
   → System computes N×N APCA contrast matrix from visible shades
   → User sees a grid: rows = text color, columns = background color
   → Each cell shows Lc value + level icon (○/◐/●)
   → Diagonal cells (same shade) are empty/grayed

3. User hovers or focuses a cell (e.g., text 50 on bg 800)
   → System shows a preview panel: sample text rendered at multiple sizes on the background color
   → User sees the exact Lc score, level badges (body/large/decorative), and a live text preview
   → Axis labels clarify: rows = "Text ↓", columns = "Background →"

4. User clicks or presses Enter on a cell
   → System copies the CSS pair to clipboard:
     `/* 50 on 800 — Lc 84 ● body text */`
     `color: oklch(0.98 0.01 259);`
     `background-color: oklch(0.21 0.06 259);`
   → Toast confirms "Copied contrast pair"

5. User switches back to "Shades" tab
   → Palette swatches render as before (no state loss)

POSTCONDITION: User knows which shade combinations are accessible and has copied usable CSS pairs

### Error Journeys

E1. No palette loaded (empty state)
   Trigger: User visits Generator with no color params, no shades to compute
   → System shows "Shades" tab with empty state (existing behavior)
   → Contrast tab shows "Generate a palette first" message
   Recovery: User enters a color, palette generates, contrast grid populates

E2. Single shade (scale = 4 or fewer visible)
   Trigger: Scale filter leaves very few shades (e.g., 4)
   → System renders a smaller matrix (4×4), still functional
   Recovery: User increases scale to see more combinations

### Edge Cases

EC1. Achromatic palette (chroma ≈ 0): All shades are gray — contrast grid still works, values are valid
EC2. Same Lc in both directions: APCA is asymmetric — `getContrast(a, b) ≠ getContrast(b, a)`. Grid must NOT mirror across diagonal.
EC3. Scale changes while on Contrast tab: Grid should recompute with new visible shades
EC4. Slider live preview: Contrast grid should update as user drags sliders (uses `useDeferredValue` on `visibleShades` for non-blocking updates)
EC5. Matrix must use gamut-clamped `.hex` field from PaletteShade (not raw OKLCH→hex), ensuring APCA scores match what the user actually sees on screen

## Acceptance Criteria

### Must Have (BLOCKING)

- [ ] AC-1: GIVEN user is on Generator with a palette WHEN they click "Contrast" tab THEN an N×N contrast grid renders showing APCA Lc values for all shade pairs
- [ ] AC-2: GIVEN contrast grid is visible WHEN user hovers OR focuses a cell THEN a preview panel shows sample text (foreground shade on background shade) with Lc score and level badges
- [ ] AC-3: GIVEN contrast grid is visible WHEN user clicks OR presses Enter on a cell THEN the CSS contrast pair (comment + color + background-color as OKLCH) is copied to clipboard with toast confirmation
- [ ] AC-4: GIVEN user is on Contrast tab WHEN they adjust sliders or change seed color THEN the contrast grid updates without blocking slider interaction (via `useDeferredValue`)
- [ ] AC-5: GIVEN two shades A and B WHEN grid renders cell [A,B] and cell [B,A] THEN the Lc values are different (APCA asymmetry preserved)
- [ ] AC-7: GIVEN contrast grid renders THEN it uses semantic `<table>` with `<th scope="col">` for background shades and `<th scope="row">` for text shades, axis labels "Text ↓" / "Background →"
- [ ] AC-8: GIVEN contrast grid renders THEN each cell is a focusable `<button>` with `aria-label` describing the pair (e.g., "Text 100 on background 900: Lc 87, body text")
- [ ] AC-9: GIVEN contrast grid renders THEN cells with Lc ≥ 60 (body text) are visually highlighted as passing pairs by default

### Error Criteria (BLOCKING)

- [ ] AC-E1: GIVEN no palette is loaded (0 shades) WHEN user switches to Contrast tab THEN a placeholder message shows instead of an empty/broken grid
- [ ] AC-E2: GIVEN a scale of 4 (4 visible shades) WHEN Contrast tab renders THEN a 4×4 grid displays correctly

### Should Have

- [ ] AC-6: GIVEN contrast grid is visible WHEN cells render THEN each cell shows Lc value + level label (Body ≥60 / Large ≥45 / Fail <45) — not icons alone

## Scope

- [x] 1. Add `getContrastFromHex(fg, bg)` to contrast.ts — hex-to-hex APCA wrapper → AC-5
- [x] 2. Create `contrast-matrix.ts` with `buildContrastMatrix(shades)` pure function → AC-1, AC-5, AC-E2
- [x] 3. Create `contrast-grid.tsx` component — semantic `<table>`, focusable `<button>` cells, hover/focus preview, click/Enter-to-copy, axis labels, passing-cell highlight, legend → AC-1, AC-2, AC-3, AC-6, AC-7, AC-8, AC-9, AC-E1
- [x] 4. Integrate tabs in `generator-shell.tsx` — Shades/Contrast toggle with `useDeferredValue` for non-blocking matrix updates → AC-4, AC-E1

### Out of Scope

- Exporting the contrast grid as image/PDF
- WCAG 2 ratio display (APCA only)
- Filtering grid by minimum contrast level
- Persisting tab selection in URL
- Custom text preview (fixed sample text)
- Arrow-key grid navigation (cells are tab-focusable but no arrow-key matrix nav)

## Quality Checklist

### Blocking

- [ ] All Must Have ACs passing
- [ ] All Error Criteria ACs passing
- [ ] All scope items implemented
- [ ] No regressions in existing tests (130 tests)
- [ ] Error states handled (empty palette, small scale)
- [ ] APCA asymmetry correct (grid is NOT symmetric across diagonal)
- [ ] Semantic `<table>` with `<th scope>` headers and axis labels
- [ ] All cells are focusable `<button>` elements with descriptive `aria-label`
- [ ] Matrix uses gamut-clamped `.hex` field (not raw conversion)
- [ ] `buildContrastMatrix` is a pure function with full test coverage
- [ ] Typecheck + lint + build clean

### Advisory

- [ ] All Should Have ACs passing
- [ ] Responsive: grid scrollable horizontally on mobile with sticky row headers
- [ ] Smooth tab transition (no layout shift)

## Test Strategy

### Test Environment

| Component | Status | Detail |
|-----------|--------|--------|
| Test runner | detected | vitest |
| E2E framework | not configured | none — manual visual testing |
| Test DB | N/A | pure client-side |
| Mock inventory | 0 | no mocks — all pure functions |

### AC → Test Mapping

| AC | Test Type | Test Intention |
|----|-----------|----------------|
| AC-1 | Unit | `buildContrastMatrix` returns correct N×N matrix with valid Lc values |
| AC-2 | Manual | Hover OR focus cell → preview panel appears with text sample |
| AC-3 | Manual | Click OR Enter on cell → clipboard contains CSS pair (comment + oklch) + toast |
| AC-4 | Manual | Drag slider → grid updates without blocking slider (deferred) |
| AC-5 | Unit | Matrix[i][j] ≠ Matrix[j][i] for asymmetric shade pairs |
| AC-6 | Unit | `getContrastLevel` returns correct level for known Lc thresholds |
| AC-7 | Manual | Grid is a `<table>` with `<th scope>` headers and axis labels |
| AC-8 | Manual | Each cell is a focusable `<button>` with descriptive `aria-label` |
| AC-9 | Manual | Cells with Lc ≥ 60 are visually highlighted |
| AC-E1 | Unit | `buildContrastMatrix([])` returns empty matrix |
| AC-E2 | Unit | `buildContrastMatrix(4 shades)` returns 4×4 matrix |

### Failure Mode Tests

| Source | ID | Test Intention | Priority |
|--------|----|----------------|----------|
| Error Journey | E1 | Unit: empty shades → empty matrix, no crash | BLOCKING |
| Error Journey | E2 | Unit: small shade count → correct NxN | BLOCKING |
| Edge Case | EC2 | Unit: matrix asymmetry verified | BLOCKING |
| Failure Hypothesis | FH-1 | Unit: `getContrastFromHex` matches `getContrast` output for same colors | BLOCKING |
| Failure Hypothesis | FH-2 | Unit: matrix diagonal is all zeros (same color = no contrast) | BLOCKING |

### Mock Boundary

No mocks needed. All functions are pure (OKLCH → hex → APCA → number).

### TDD Commitment

All tests written BEFORE implementation (RED → GREEN → REFACTOR).
Unit tests for pure functions (`contrast-matrix.ts`, `getContrastFromHex`). Manual validation for UI interactions.

## Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Performance: 144 APCA computations stacked on generatePalette per slider frame | MED | MED | `useDeferredValue(visibleShades)` as matrix input — React interrupts matrix recompute when drag event arrives |
| `getContrast` requires `OklchColor` but grid needs hex-to-hex | LOW | HIGH | Add `getContrastFromHex` wrapper that calls `calcAPCA` directly |
| APCA asymmetry confuses users ("why are the values different?") | LOW | MED | Axis labels "Text ↓" / "Background →" + legend explaining asymmetry |
| Grid too large on mobile (11 columns) | MED | HIGH | Horizontal scroll with sticky row headers |
| 144 event listeners re-registered per render during drag | MED | MED | Single `onMouseMove`/`onFocus` on `<table>` with coordinate-based cell identification |
| Matrix uses wrong hex (raw vs gamut-clamped) | HIGH | LOW | Explicitly use `PaletteShade.hex` field (already sRGB-clamped by engine) |

**Kill criteria:** If deferred matrix computation still causes perceptible lag (>100ms) on slider drag, switch to compute-on-tab-switch only (no live updates on Contrast tab).

## State Machine

N/A — stateless feature. Tab selection is local UI state only.

## Analysis

### Assumptions Challenged

| Assumption | Evidence For | Evidence Against | Verdict |
|------------|-------------|-----------------|---------|
| `calcAPCA(hex, hex)` works for arbitrary hex pairs | apca-w3 docs confirm hex input support | Current `getContrast` converts OklchColor→hex→APCA, hex→hex is untested in our codebase | RISKY — need `getContrastFromHex` wrapper with tests |
| 144 computations per render won't cause lag | Each APCA calc is ~0.1ms, total ~15ms | Stacks on `generatePalette()` per frame; `visibleShades` ref changes every recompute | RISKY — mitigate with `useDeferredValue` (React interrupts when drag arrives) |
| Users understand APCA Lc values | Color tool users are familiar with contrast scores | APCA is newer than WCAG 2, Lc values are less known than 4.5:1 ratios | RISKY — show Lc value + text label (Body/Large/Fail) in every cell, not icons alone |
| Tab integration doesn't break existing swatch layout | Tabs component is standard compound pattern | ExportFooter and "Preview in Blocks" CTA need repositioning | VALID — CTA moves inside Shades tab, ExportFooter stays outside |
| Hover preview is sufficient for exploration | Common desktop pattern | Touch/keyboard users have no hover state | WRONG — fixed: cells are focusable `<button>`, `:focus` = same as `:hover` preview |
| An 11×11 matrix is readable | Covers all combos | 121 cells with equal visual weight = data dump, no entry point | RISKY — fixed: highlight passing cells (Lc ≥ 60) by default |

### Blind Spots

1. **[a11y]** No semantic table structure — screen readers hear flat list of 121 numbers with no row/col context
   Why it matters: Feature for checking accessibility must itself be accessible → FIXED: `<table>` with `<th scope>` headers

2. **[a11y]** Keyboard users can't reach cells — primary action (copy) is mouse-only = WCAG 2.1.1 failure
   Why it matters: Tool credibility → FIXED: cells are `<button>`, Enter = copy, focus = preview

3. **[UX]** No axis labels — users don't know which dimension is foreground vs background in asymmetric grid
   Why it matters: Wrong pair = wrong a11y guidance → FIXED: axis labels "Text ↓" / "Background →"

4. **[UX]** 121 cells with equal weight = no signal-to-noise hierarchy
   Why it matters: Users scan everything to find 5 useful pairs → FIXED: highlight passing cells (Lc ≥ 60)

5. **[Perf]** `visibleShades` ref is unstable — changes on every `activePalette` recompute
   Why it matters: Matrix memoization key is unstable → FIXED: use `useDeferredValue` to decouple from drag

6. **[Data]** Matrix must use gamut-clamped `.hex` field, not raw OKLCH→hex conversion
   Why it matters: Out-of-gamut colors produce APCA scores for colors users never see → documented in EC5

### Failure Hypotheses

| IF | THEN | BECAUSE | Severity | Mitigation |
|----|------|---------|----------|------------|
| Screen reader user navigates to grid | Hears garbled numbers with no context | No semantic table structure | CRITICAL | FIXED: `<table>` with `<th scope>`, `aria-label` per cell |
| User drags slider rapidly on Contrast tab | Grid blocks slider interaction | 144 calcs + generatePalette stacked synchronously | HIGH | FIXED: `useDeferredValue(visibleShades)` — React interrupts matrix for drag |
| Grid renders symmetric values across diagonal | Users get wrong a11y guidance | APCA is asymmetric, untested in pairwise mode | HIGH | Unit test: verify matrix[i][j] ≠ matrix[j][i] |
| Keyboard user tries to copy a pair | Can't — primary action inaccessible | Click-only with no focusable elements | HIGH | FIXED: cells are `<button>`, Enter = copy |
| User reads grid without axis labels | Copies wrong pair (swapped fg/bg) | No "Text" / "Background" labels | MED | FIXED: axis labels mandatory |
| "Preview in Blocks" CTA disappears when switching tabs | Feature regression | CTA is after swatches, tabs hide it | MED | CTA inside Shades tab content |

### The Real Question

Confirmed — the grid solves a real gap: shade-to-shade accessibility verification. The Skeptic challenge ("designers verify specific pairs, not matrices") is valid but addressed: highlighting passing cells makes the grid scannable, and focusable cells make the primary action accessible. The grid is the power-user audit view — not a replacement for the existing per-shade APCA badges.

The spec-review caught 4 critical gaps now fixed: semantic table, keyboard access, axis labels, deferred rendering.

### Open Items

None — all blockers resolved in merge.

## Notes

## Progress

| # | Scope Item | Status | Iteration |
|---|-----------|--------|-----------|
| 1 | getContrastFromHex | [x] Complete | 1 |
| 2 | contrast-matrix.ts | [x] Complete | 2 |
| 3 | contrast-grid.tsx | [x] Complete | 3 |
| 4 | Tabs integration | [x] Complete | 4 |

## Timeline

| Action | Timestamp | Duration | Notes |
|--------|-----------|----------|-------|
| plan | 2026-03-15T14:00:00 | - | Created |
| spec-review | 2026-03-15T14:30:00 | - | 4 perspectives (UX Designer, Perf Engineer, A11y Specialist, Skeptic). 4 critical gaps found + fixed: semantic table, keyboard access, axis labels, deferred rendering. |
