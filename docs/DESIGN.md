# DESIGN — visual system & look-and-feel

> The complete visual brief for «Котопес». Pair with [PRD.md](./PRD.md) (what each page must do) and
> [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) (how to build it). Design decisions trace to
> [REQUIREMENTS-AND-QA.md](./REQUIREMENTS-AND-QA.md).

## 1. Design principles
1. **Warm & hopeful** (D6) — humane, compassionate, optimistic. The subject is heavy; the treatment is
   gentle and dignified, never exploitative.
2. **Photo-forward but restrained** — documentary photos carry the emotion; the UI stays calm so they
   breathe.
3. **Readable long-reads** — generous measure, line-height, and rhythm for article bodies.
4. **Native-first** (brief) — use native HTML/CSS (`<dialog>`, `<details>`/`popover`, CSS
   scroll-driven animations, view transitions) before reaching for JS, when it costs no design quality.
5. **One light theme** (D7) — no dark-mode toggle. Single, warm, consistent palette.
6. **Accessible by construction** — AA contrast, keyboard paths, focus states baked into every
   component (see PRD §8).

## 2. Color palette — "Honey + teal" (D7)

Single light theme. Define as CSS custom properties on `:root`.

### Core tokens
| Token | Hex | Role |
|---|---|---|
| `--bg` | `#FBF6EC` | Page background — warm ivory/honey |
| `--bg-alt` | `#F4E9D6` | Alternating section band (honey) |
| `--surface` | `#FFFDF8` | Cards / raised surfaces |
| `--ink` | `#2A2420` | Primary text — warm near-black |
| `--ink-soft` | `#5C5248` | Secondary text / captions |
| `--line` | `#E7DCC8` | Borders, dividers, hairlines |
| `--teal` | `#2A6F6B` | Brand teal — fills, icons, large UI |
| `--teal-700` | `#1F5350` | Teal for **text/links on light** and primary buttons |
| `--teal-50` | `#E2EFEE` | Teal tint — chips, hovers, soft fills |
| `--amber` | `#E8A33D` | Warm amber highlight (use ink text on it) |
| `--honey` | `#F2C14E` | Honey/yellow accent |

### Ukrainian accent (sparing — CTA only, D7/D12)
| Token | Hex | Role |
|---|---|---|
| `--ua-blue` | `#2B5BA8` | Help-shelters CTA band background |
| `--ua-yellow` | `#F2C14E` | Accent details on the CTA band (= `--honey`) |

> The UA blue/yellow pairing is reserved for the **Допомога притулкам CTA band** (home + page) and the
> help-page accents. Do not scatter it across the site — its scarcity is what gives it meaning.

### Contrast guidance (target WCAG AA: 4.5:1 text, 3:1 large/UI)
- `--ink` on `--bg`/`--surface`/`--bg-alt`: ~12–13:1 ✓ (body text).
- `--ink-soft` on `--bg`: ~6:1 ✓ (captions, meta).
- **Links/teal text on light:** use `--teal-700` (#1F5350 ≈ 6.7:1), **not** `--teal` (#2A6F6B ≈ 4.6:1,
  borderline) for normal-size text.
- **Primary button:** `--teal-700` fill + white text (≈ 6.7:1) ✓.
- **`--teal` fill** (#2A6F6B) + white text (≈ 4.6:1): acceptable only for large text / icon buttons.
- **CTA band:** `--ua-blue` fill + white text (≈ 5.9:1) ✓; `--honey`/`--ua-yellow` for non-text accents
  or with ink text (yellow + white fails — never white text on yellow).
- **Amber/honey:** always pair with `--ink` text, never white.
- Always re-verify final values with a contrast checker; adjust shades but keep the palette identity.

## 3. Typography (D8)

Serif headings + sans body, full Ukrainian Cyrillic (incl. the `ʼ` modifier apostrophe in «інтервʼю»).

- **Headings:** **Lora** (humanist serif, full Cyrillic) — warm, editorial. Fallback: `Georgia, serif`.
  (Alternative: PT Serif.)
- **Body / UI:** **Inter** (full Cyrillic, excellent screen legibility). Fallback:
  `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`. (Alternative: Onest — Ukrainian-designed.)
- Loading: Google Fonts `<link>` **or** self-hosted woff2 (preferred for the no-build constraint and
  privacy). Use `font-display: swap`; subset to Cyrillic + Latin; `preconnect`/`preload` the primary
  weights. Verify the glyph `ʼ` (U+02BC) renders in both families.

### Type scale (fluid, `clamp()`)
| Token | Use | Size (clamp) | Family / weight |
|---|---|---|---|
| `--fs-display` | Home hero H1 | `clamp(2.5rem, 6vw, 4.5rem)` | Lora 600 |
| `--fs-h1` | Page/article H1 | `clamp(2rem, 4vw, 3rem)` | Lora 600 |
| `--fs-h2` | Section / article subhead | `clamp(1.5rem, 2.5vw, 2rem)` | Lora 600 |
| `--fs-h3` | Card title | `1.25rem` | Lora 600 |
| `--fs-lead` | Lead / subtitle | `1.25rem` | Inter 400 |
| `--fs-body` | Body | `1.0625rem`–`1.125rem` | Inter 400 |
| `--fs-small` | Caption / meta / chip | `0.875rem` | Inter 500 |

- Body line-height `1.7` for article prose; headings `1.15`. Article measure: `max-width: 68ch`.
- Pull-quotes: Lora italic, `--fs-h3`–`--fs-h2`, teal accent rule on the side.

## 4. Spacing, grid & other tokens
- **Spacing scale** (`--space-*`): 4, 8, 12, 16, 24, 32, 48, 64, 96 px.
- **Container:** `--container: 1200px` max; article reading column `68ch`; side gutters
  `clamp(1rem, 4vw, 3rem)`.
- **Radii:** `--radius-sm: 8px`, `--radius: 14px` (cards), `--radius-lg: 24px` (hero/bands), pill for
  chips/buttons.
- **Shadows:** soft, warm-tinted — `--shadow-1: 0 2px 8px rgba(42,36,32,.06)`,
  `--shadow-2: 0 8px 24px rgba(42,36,32,.10)` (card hover).
- **Breakpoints:** mobile ≤640, tablet 641–1024, desktop ≥1025. Grids use CSS Grid
  `repeat(auto-fill, minmax(280px, 1fr))`.
- **Z-index:** header sticky `100`, dropdown `200`, dialog/lightbox top (native `<dialog>` handles it).

## 5. Components

### 5.1 Header (all pages)
- Sticky top bar on `--surface`/translucent honey, hairline `--line` bottom.
- Left: **logo** = paw SVG mark (teal) + wordmark **«Котопес»** in Lora 600; links to `index.html`.
- Right: nav — `Домашня сторінка · Усі матеріали · Рубрики ▾ · Допомога притулкам · Про нас`. Active
  page underlined/teal. `Допомога притулкам` may render as a subtle teal-outlined pill to nudge.
- **Mobile:** hamburger → slide-in/`popover` panel; nav stacks; dropdown becomes an expandable group.

### 5.2 Рубрики dropdown
- Prefer **native**: a `<details><summary>Рубрики</summary>…</details>` disclosure, or a
  `<button popovertarget>` + `[popover]` menu. Items are real `<a href="materials.html?rubric=…">`.
- Opens on click; keyboard: Enter/Space toggles, arrow keys move (if scripted), Esc closes, focus
  returns to trigger. `aria-expanded` on the trigger; menu labelled. Hover-open allowed on desktop but
  must also work click-only and keyboard-only.

### 5.3 Footer (all pages)
- Honey `--bg-alt`. Wordmark + paw mark; condensed nav; one-line «Підтримайте притулки» prompt linking
  to `help.html`; project line + year. No invented org info.

### 5.4 Article card (home featured + materials grid)
- `--surface`, `--radius`, `--shadow-1`; the whole card is an `<a>`.
- Top: cover image, fixed `aspect-ratio: 3/2`, `object-fit: cover`, `loading="lazy"`, width/height set.
- Rubric **chip** overlaid or above title (`--teal-50` bg, `--teal-700` text, pill).
- H3 title (Lora). 1–2 line excerpt (`--ink-soft`, clamp to 2–3 lines with `line-clamp`).
- Hover: lift to `--shadow-2`, subtle scale on image (reduced-motion: none). Visible focus ring.

### 5.5 Rubric tile (home)
- 4 compact tiles, teal-tinted or photo-backed, label + small count, link to
  `materials.html?rubric=<id>`. Icon/paw motif optional.

### 5.6 Hero (home)
- Full-bleth band, `--radius-lg`, warm **generated photographic** background (§7) with a honey/teal
  gradient scrim for text contrast. Slogan H1 «Своїх не кидають», subtitle «Захистимо тварин під час
  війни», intro paragraph (verbatim), primary CTA → `materials.html`. Ensure text contrast over the
  image (scrim/overlay) meets AA.

### 5.7 CTA band — "Допомога притулкам"
- The signature accent moment: `--ua-blue` background, white headline + short text, `--honey` accent
  detail (rule, paw, or button border), white/teal button → `help.html`. Used on home and as the
  closing band on About.

### 5.8 Lightbox (article images, D9)
- Native `<dialog>`. Clicking a `<figure>` image opens it showing the full-size image + caption.
- Close: ✕ button, Esc, backdrop click. Focus trapped (native `<dialog>` modal does this); focus
  returns to the triggering image. Minimal JS: `dialog.showModal()` / set `src`. No external lib.

### 5.9 Buttons & chips
- **Primary button:** `--teal-700` fill, white text, pill, hover darken, focus ring.
- **Secondary/outline:** teal outline, teal-700 text, honey hover tint.
- **Chip (rubric):** `--teal-50` bg, `--teal-700` text, pill, `--fs-small`.
- All interactive targets ≥ 24×24px (AA 2.2); ≥ 44px on mobile preferred.

### 5.10 Figure (article body)
- `<figure>` with responsive `<img loading="lazy">` (explicit dimensions/`aspect-ratio`),
  `<figcaption>` for caption/credit (`--ink-soft`, `--fs-small`). Cursor-zoom affordance; opens lightbox.

## 6. Motion (D15)
- **Subtle, purposeful.** Scroll-reveal (fade/translate-up) for sections and cards; hover lifts;
  smooth dropdown/lightbox transitions; optional **View Transitions API** for page navigation.
- **Native-first:** prefer CSS **scroll-driven animations** (`animation-timeline: view()`) over
  IntersectionObserver where supported; fall back gracefully.
- **`prefers-reduced-motion: reduce`** → disable transforms/parallax/reveal; keep instant, no large
  motion. Never block content on animation.
- Durations 150–400ms; easing `cubic-bezier(.2,.7,.2,1)`-ish. No autoplaying carousels.

## 7. Imagery (D18)
- **Generated/custom imagery is allowed only on the home page (hero background + decorative section
  bands) and generic decoration** — never on article pages (those use source photos only).
- **Style:** warm, photoreal, soft natural light; subjects = animals and rescue/hope themes (cats,
  dogs, wildlife, volunteers, shelters) consistent with the Honey+teal palette. Hopeful, dignified —
  **avoid graphic/violent war imagery**. No text baked into images.
- **Format:** optimized **WebP**, responsive sizes, `loading="lazy"` (except the LCP hero, which may be
  eager + `fetchpriority="high"`). Decorative backgrounds get `alt=""` or are pure CSS.
- Source documentary photos keep their own `alt`/captions verbatim (PRD §4).

## 8. Logo & favicon (D11)
- **Wordmark:** «Котопес» in Lora 600, `--ink` (or teal on light surfaces).
- **Mark:** a **simple paw** drawn as inline SVG (one pad + 3–4 toes), single-color `--teal`,
  scalable, no external asset. Sits left of the wordmark; usable standalone as favicon/app icon.
- **Favicon/app icons:** export the paw mark to `favicon.svg` + PNG sizes (32/180/192/512) + manifest.
- The hero slogan «Своїх не кидають» is **not** part of the logo (D11) — home hero only.

## 9. Per-page layout notes
- **Home:** hero → featured cards grid → 4 rubric tiles → UA-blue CTA band → about teaser → footer.
  Alternate `--bg` / `--bg-alt` section bands for rhythm.
- **Усі матеріали:** page H1 (state-aware) + optional rubric filter heading/reset → responsive card
  grid → footer.
- **Article:** narrow reading column (68ch) centered; full-bleed allowed for the lead image; figures
  inline; pull-quotes break the measure with a teal side-rule; foot links back to materials.
- **Допомога притулкам:** short intro → 3 org cards (logo-less, name + blurb + button) in a row/grid →
  optional reassurance line → footer.
- **Про нас:** centered mission column over warm backdrop; bold lead «Актуальність проєкту»; one
  pull-quote line; closing UA-blue CTA band.
- **404:** centered, warm, paw mark, short message, links home + materials.
