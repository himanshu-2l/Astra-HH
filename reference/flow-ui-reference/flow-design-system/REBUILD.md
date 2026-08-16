# REBUILD.md

> Design reference brief for **Flow Design System** (captured 2026-08-17T14:37:28.456Z)

## What you're rebuilding

- **Source**: Flow Design System
- **Page title**: flow | voice-guided 3d exploration
- **Detected stack**: three.js
- **Recommended stack**: Next.js (App Router) + TypeScript + Tailwind CSS + Motion (framer-motion) + react-three-fiber
- **Sections**: 1
- **Animations captured**: 289
- **Assets**: 2

## Reference folder layout

```
reference/flow-ui-reference/flow-design-system/
├── meta.json                  # this capture's metadata
├── REBUILD.md                 # ← you are here
├── dom/full.html              # complete inlined dom
├── dom/sections/*.html        # per-section subtrees
├── screenshots/{desktop,tablet,mobile}-full.png
├── screenshots/sections/      # per-section, per-viewport
├── motion/animations.json     # raw capture
├── motion/motion-specs.md     # ★ READ THIS — durations + easings
├── assets/{images,videos,fonts}/  # everything harvested (hash-prefixed names)
├── assets/manifest.json       # original urls -> on-disk local paths
├── tokens/{colors,typography,spacing}.json
├── tokens/tokens.css          # ready-to-import css vars
├── tokens/fonts.css           # @font-face for captured fonts
└── stack/detected.md          # framework detection notes
```

## Rules of engagement (95%+ fidelity required)

This is a **1:1 reproduction**, not a "spiritually similar" rebuild. Concrete rules:

1. **Use the actual text.** Every headline, paragraph, button label, link is in `content/text.md` and `content/sections.json`. Do not paraphrase, do not "improve" copy, do not make up filler.
2. **Use the actual images.** Each section block below lists the **exact on-disk path** for every image (hash-prefixed, with the real detected extension — e.g. `assets/images/930cdbce-name.avif`). Copy those files into your project's `public/` and reference them. The bare original filenames do NOT exist on disk; use the paths as written, or `assets/manifest.json` (`originalUrl` → `localPath`) to resolve. If a section has a hero image, your section MUST have that exact image — not a CSS gradient stand-in.
3. **Use the actual fonts.** `tokens/fonts.css` has `@font-face` declarations for every captured woff2/ttf. Import it. Don't substitute Google Fonts unless the source font wasn't captured.
4. **For motion: EXACT values from `motion/motion-specs.md`.** No "ease-out", no "0.5s". Use the bezier arrays and durations as captured.
5. **For tokens: import `tokens/tokens.css`.** Don't pick new colors, font sizes, or spacing values.
6. **Build section-by-section.** Don't move on until your section matches the reference at all 3 viewports. Screenshot diff after each.
7. **Use the layout tree.** `content/layouts.json` has the structural skeleton — flex/grid directions, gaps, child order. Match it.
8. **Smooth scroll**: consider adding Lenis for that "Framer feel" if the source has any scroll-linked motion.
9. **No placeholder content.** No "Lorem ipsum", no "Project Name", no fake stats. The real numbers, names, and copy are extracted.

## Sections — exact content (build verbatim)

> Every section below has its **exact text, images, fonts, and computed styles** captured. Do not rewrite copy. Do not pick new assets. Do not invent font sizes. Use what's here.


### 1. `01-homelibrarysign-inbuilt-with-reactthree-`
**Background:** `rgb(5, 10, 20)`

- screenshot (desktop): `screenshots/sections/01-homelibrarysign-inbuilt-with-reactthree--desktop.png`
- screenshot (tablet): `screenshots/sections/01-homelibrarysign-inbuilt-with-reactthree--tablet.png`
- screenshot (mobile): `screenshots/sections/01-homelibrarysign-inbuilt-with-reactthree--mobile.png`
- dom subtree: `dom/sections/01-homelibrarysign-inbuilt-with-reactthree-.html`
- structural layout tree: `content/layouts.json` → find `"slug": "01-homelibrarysign-inbuilt-with-reactthree-"`

**Motion (284 animated · 5 fired during scroll):**
- defaults: 300ms × `ease`
- 49 hover state(s): transform, color, backgroundColor, filter, opacity (timing typically 0.15s cubic-bezier(0.4, 0, 0.2, 1))

**Scroll-linked motion (6 elements):**
- `nav` `pinned` over scrollY 0→843px
- `h1` `pinned` over scrollY 0→843px
- `footer` `pinned` over scrollY 0→843px
- `canvas` `pinned` over scrollY 0→843px
- `div` `pinned` over scrollY 0→843px
- `div` `pinned` over scrollY 0→843px

**Hover states (49):**
- "home" — changes: transform — 0.15s `cubic-bezier(0.4, 0, 0.2, 1)`
- "library" — changes: color, backgroundColor, transform — 0.15s `cubic-bezier(0.4, 0, 0.2, 1)`
- "library" — changes: color — 0.15s `cubic-bezier(0.4, 0, 0.2, 1)`
- "library" — changes: color — 0.15s `cubic-bezier(0.4, 0, 0.2, 1)`
- "library" — changes: color — 0.15s `cubic-bezier(0.4, 0, 0.2, 1)`
- "library" — changes: color — 0.15s `cubic-bezier(0.4, 0, 0.2, 1)`
- "library" — changes: color — 0.15s `cubic-bezier(0.4, 0, 0.2, 1)`
- "library" — changes: color — 0.15s `cubic-bezier(0.4, 0, 0.2, 1)`
- "sign in" — changes: color, backgroundColor, transform — 0.15s `cubic-bezier(0.4, 0, 0.2, 1)`
- "sign in" — changes: color — 0.15s `cubic-bezier(0.4, 0, 0.2, 1)`
- "sign in" — changes: color — 0.15s `cubic-bezier(0.4, 0, 0.2, 1)`
- "sign in" — changes: color — 0.15s `cubic-bezier(0.4, 0, 0.2, 1)`
- "sign in" — changes: color — 0.15s `cubic-bezier(0.4, 0, 0.2, 1)`
- "sign in" — changes: color — 0.15s `cubic-bezier(0.4, 0, 0.2, 1)`
- "Firebase" — changes: color, filter — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "Firebase" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "Firebase" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "Firebase" — changes: opacity — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "Gemini AI" — changes: color, filter — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "Gemini AI" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "Gemini AI" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "Gemini AI" — changes: opacity — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "MongoDB" — changes: color, filter — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "MongoDB" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "MongoDB" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "MongoDB" — changes: opacity — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "Vultr" — changes: color, filter — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "Vultr" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "Vultr" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "Vultr" — changes: opacity — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "Vercel" — changes: color, filter — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "Vercel" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "Vercel" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "Vercel" — changes: opacity — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "Socket.IO" — changes: color, filter — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "Socket.IO" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "Socket.IO" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "Socket.IO" — changes: opacity — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "World Labs" — changes: color, filter — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "World Labs" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "World Labs" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "World Labs" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "World Labs" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "World Labs" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "World Labs" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "World Labs" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "World Labs" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "World Labs" — changes: color — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`
- "World Labs" — changes: opacity — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)`

**Headings:**
- h1: "flow" — 72px / 400 / rgba(0, 0, 0, 0) / family: `"Space Mono"`

**Paragraphs:**
- "built with:" — 12px / oklab(0.999994 0.0000455678 0.0000200868 / 0.4)
- "built at sb hacks xii" — 12px / oklab(0.999994 0.0000455678 0.0000200868 / 0.5)
- "voice-guided 3d exploration powered by ai" — 12px / oklab(0.999994 0.0000455678 0.0000200868 / 0.3)

**Buttons:** `home` · `library` · `sign in` · `voice` · `text` · `advanced options`

**Links:** `React` · `Three.js` · `TypeScript` · `Vite` · `Tailwind CSS` · `Firebase` · `Gemini AI` · `MongoDB` · `Vultr` · `Vercel` · `Socket.IO` · `World Labs`

**Inline SVGs:** 40 (full markup in `content/sections.json`)

## Per-section build prompt (paste into Claude Code)

```text
Build the "01-homelibrarysign-inbuilt-with-reactthree-" section.

Reference (look at all three viewports):
  - reference/flow-stephenhung-me/screenshots/sections/01-homelibrarysign-inbuilt-with-reactthree--desktop.png
  - reference/flow-stephenhung-me/screenshots/sections/01-homelibrarysign-inbuilt-with-reactthree--tablet.png
  - reference/flow-stephenhung-me/screenshots/sections/01-homelibrarysign-inbuilt-with-reactthree--mobile.png

Source DOM subtree (for structure hints, do NOT copy verbatim):
  - reference/flow-stephenhung-me/dom/sections/01-homelibrarysign-inbuilt-with-reactthree-.html

Tokens to use:
  - reference/flow-stephenhung-me/tokens/tokens.css

Motion specs (use EXACT durations/easings):
  - reference/flow-stephenhung-me/motion/motion-specs.md

Stack: Next.js (App Router) + TypeScript + Tailwind CSS + Motion (framer-motion) + react-three-fiber

Build, then take a screenshot of your output at 1440×900 and diff it against the desktop reference. Iterate until pixel-close. Then handle tablet (768) and mobile (390).
```

## Framer-tier polish checklist

- [ ] No "default" easings — every transition uses a specific cubic-bezier from `motion-specs.md`.
- [ ] Hero copy enters with word-by-word stagger (`staggerChildren: 0.1-0.15`).
- [ ] Section enters use `whileInView` with `viewport={{ once: true, margin: "-10%" }}`.
- [ ] Smooth scroll is wired (Lenis if the source uses it).
- [ ] All images are local (in `public/`), converted to webp.
- [ ] All fonts are self-hosted from `assets/fonts/` (don't rely on Framer's CDN).
- [ ] Hover states are 0.2-0.3s ease-out, not snappy/instant.
- [ ] Mobile layout actually works — not just a squished desktop.
- [ ] No console errors. No layout shift on load.