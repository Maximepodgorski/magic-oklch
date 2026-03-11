# Magiklch

OKLCH color palette generator. Input any CSS color, get 11 perceptually uniform shades.

**[magiklch.vercel.app](https://magiklch.vercel.app)**

## Features

- **Generator** — Paste any CSS color (hex, hsl, oklch, rgb, named), get 11 shades with APCA contrast scores
- **Catalogue** — Browse 22 Tailwind + 7 curated palettes ready to use
- **Shuffle** — Random palette inspiration, one click away
- **Steal** — Extract color palettes from any website with a bookmarklet
- **Docs** — Interactive guide to OKLCH color science with live demos
- **Dark mode** — Full light/dark theme support

## Quick Start

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 + React 19 + Tailwind v4 |
| UI | Lyse Registry + Radix UI + CVA |
| Color | culori (tree-shaken) + apca-w3 |
| Testing | Vitest |
| Deploy | Vercel |

## Architecture

```
User Input (any CSS color)
  ↓
color-parser ──▶ color-engine ──▶ Palette { 11 shades }
                      │
                      ├── curves (L/C/H per step)
                      ├── gamut (sRGB/P3 check + clamp)
                      ├── contrast (APCA via apca-w3)
                      └── color-formatter (HEX/HSL/OKLCH/CSS var)
```

All color functions are pure — no I/O, no state, no DOM. 84 test cases.

## Contributing

Issues and PRs welcome. Run `npm run lint && npm run typecheck && npx vitest` before submitting.

## License

MIT
