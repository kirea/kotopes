# TASKS — implementation checklist

> Ordered, granular work breakdown for building the «Котопес» site. Each task has a done-criterion.
> Context: [PRD.md](./PRD.md) · [DESIGN.md](./DESIGN.md) · [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md)
> · binding intent: [REQUIREMENTS-AND-QA.md](./REQUIREMENTS-AND-QA.md). Decision tags (Dn) reference
> the master table in REQUIREMENTS-AND-QA §3.

## Phase 0 — Scaffold
- [ ] **0.1 Repo layout** — create the file tree from IMPLEMENTATION-PLAN §2 (`index.html`,
  `materials.html`, `help.html`, `about.html`, `404.html`, `articles/`, `assets/{css,js,img,fonts,icons}`).
  *Done: tree exists, empty pages have valid `<!doctype html><html lang="uk">` skeletons.*
- [ ] **0.2 `.nojekyll` + base meta** — add root `.nojekyll`; set charset/viewport on every page. *Done:
  files present.*
- [ ] **0.3 Relative-path rule (D5)** — establish that no link/asset uses a leading `/`. *Done: lint
  note in repo / confirmed in review.*

## Phase 1 — Design system / shared CSS (DESIGN.md)
- [ ] **1.1 Tokens** — `:root` custom properties for palette (D7), type scale, spacing, radii, shadows,
  breakpoints (DESIGN §2–4). *Done: tokens defined, single light theme, no dark-mode.*
- [ ] **1.2 Fonts (D8)** — load Lora (headings) + Inter (body), Cyrillic subset, `font-display: swap`;
  verify `ʼ` (U+02BC) renders. *Done: fonts render incl. «інтервʼю» apostrophe.*
- [ ] **1.3 Base/reset + typography** — modern reset, body/prose styles, `68ch` measure, links in
  `--teal-700`. *Done: readable defaults.*
- [ ] **1.4 Components CSS** — header/nav/dropdown, footer, button, chip, card, rubric tile, hero,
  CTA band, figure, lightbox `<dialog>` (DESIGN §5). *Done: styles for each component.*
- [ ] **1.5 Contrast pass** — verify all text/UI combos ≥ AA (DESIGN §2). *Done: checker confirms.*

## Phase 2 — Shared layout & interactions
- [ ] **2.1 Header + nav** — paw SVG mark + «Котопес» wordmark (D11); 5-item nav; active state;
  responsive hamburger. *Done: header on a test page, links correct.*
- [ ] **2.2 Рубрики dropdown (D1, native-first)** — `<details>`/`popover` menu with 4 rubric `<a>`s →
  `materials.html?rubric=<id>`; keyboard + `aria-expanded`; Esc closes. *Done: works mouse + keyboard.*
- [ ] **2.3 Footer** — wordmark, condensed nav, help prompt → `help.html`, project line. *Done.*
- [ ] **2.4 Skip-link + landmarks** — skip-to-content; `header/nav/main/footer` on every page. *Done.*
- [ ] **2.5 Lightbox (D9)** — `assets/js/lightbox.js`: clicking a `<figure>` img opens native
  `<dialog>` with full image + caption; Esc/backdrop/✕ close; focus trap + return. *Done: keyboard
  operable.*

## Phase 3 — Data model & listing (D2, D3)
- [ ] **3.1 `articles.js`** — `RUBRICS` + `ARTICLES` arrays per IMPLEMENTATION-PLAN §5; verbatim titles
  (incl. «істории»), verified excerpts, cover paths. *Done: 5 records, 4 rubrics.*
- [ ] **3.2 Card render** — function producing the card markup (cover, chip, title, excerpt) used by
  home + materials. *Done: matches DESIGN §5.4.*
- [ ] **3.3 `listing.js` + filter** — `materials.html` renders all; reads `?rubric=`, filters, sets H1
  + reset link; unknown → all; `oglyady` → 2 cards. Resilient with JS off (PRD §6.2 / IMPL §6).
  *Done: `?rubric=oglyady` shows 2, others show 1, none shows 5.*

## Phase 4 — Pages
- [ ] **4.1 Home `index.html` (D12, D18)** — hero (slogan «Своїх не кидають» + subtitle + verbatim
  intro + CTA + generated warm bg) → featured cards (3–4) → 4 rubric tiles → UA-blue help CTA band →
  about teaser → footer. *Done: all sections, verbatim hero text.*
- [ ] **4.2 Усі матеріали `materials.html`** — grid + filter UI from Phase 3; state-aware H1. *Done.*
- [ ] **4.3 Help `help.html` (D13)** — intro + 3 org cards (HAU / Домівка / Happy Paw) with factual
  blurbs + «Перейти на сайт ↗» (`target=_blank rel="noopener noreferrer"`, clean Happy Paw URL).
  *Done: blurbs fact-checked against each org site.*
- [ ] **4.4 About `about.html` (D14)** — editorial mission layout, verbatim «Актуальність проєкту…»
  text, one pull-quote line, closing UA-blue CTA. No invented facts. *Done.*
- [ ] **4.5 404 `404.html`** — warm not-found, links home + materials. *Done.*

## Phase 5 — Article pages (×5, IMPLEMENTATION-PLAN §7)
For each slug (`oazys-posered-betonnyh-dzhungliv`, `ponad-1000-vryatovanyh`, `lyubov-bez-kordoniv`,
`zlochyn-bez-pokarannya`, `hvosty-ta-lapy-na-sluzhbi`):
- [ ] **5.x.a Extract & clean** — strip all Word CSS/classes; re-author semantic HTML; text verbatim
  (keep intentional mistakes + Q&A dashes). *Done: no `Mso*`/inline Word styles remain.*
- [ ] **5.x.b Images** — copy/rename per §4; inline `<figure>` in original positions; preserve
  captions/credits/alt verbatim; lazy + dimensions; wired to lightbox. *Done: image count matches
  source.*
- [ ] **5.x.c Header/meta** — rubric chip, H1, "← Назад до матеріалів", per-page title/description,
  JSON-LD Article (no author/date). *Done.*

## Phase 6 — SEO, icons, assets (D17)
- [ ] **6.1 Per-page meta + OG/Twitter** — unique titles/descriptions, `og:*`, `og:locale="uk_UA"`.
  *Done on all 9 pages.*
- [ ] **6.2 Favicon / icons / manifest** — paw `favicon.svg` + PNGs + `manifest.webmanifest`. *Done.*
- [ ] **6.3 `sitemap.xml` + `robots.txt`** — all pages listed; robots allows all + sitemap. *Done.*
- [ ] **6.4 Generated imagery (D18)** — produce warm photoreal WebP for home hero + decor bands; alt=""
  for decorative; LCP hero eager. *Done: images in `assets/img/home/`.*

## Phase 7 — Motion (D15)
- [ ] **7.1 Subtle motion** — scroll-reveal (native CSS scroll-driven where possible), hover lifts,
  dropdown/lightbox transitions, optional View Transitions for nav. *Done.*
- [ ] **7.2 Reduced-motion** — `prefers-reduced-motion: reduce` disables transforms/reveals. *Done:
  verified with OS setting on.*

## Phase 8 — Accessibility pass (D16, PRD §8)
- [ ] **8.1 Keyboard** — full keyboard path through nav, dropdown, cards, lightbox; focus visible;
  focus returns after dialog. *Done.*
- [ ] **8.2 Semantics & alt** — one `<h1>`/page, heading order, all photos have meaningful alt,
  decorative = `alt=""`. *Done.*
- [ ] **8.3 Audit** — run axe/Lighthouse a11y; fix to AA; targets ≥24px. *Done: no AA violations.*

## Phase 9 — Verify & deploy (D5)
- [ ] **9.1 Content fidelity** — diff every page's text against `sources/` (verbatim; intentional
  mistakes intact); confirm no Word CSS leaked. *Done.*
- [ ] **9.2 Link/route check** — all nav works; both Усі матеріали and Рубрики reach the same article
  URLs; images load; 404 works. *Done.*
- [ ] **9.3 Sub-path check** — serve under `/kotopes/` (or `python -m http.server` in a `/kotopes/`
  folder) and confirm relative paths + `?rubric=` + lightbox. *Done.*
- [ ] **9.4 Lighthouse** — performance/SEO/best-practices/a11y sane; no broken assets. *Done.*
- [ ] **9.5 Deploy** — Settings → Pages → branch + root (not `/docs`); confirm live at
  `https://kirea.github.io/kotopes/`. *Done: live and verified.*

## Cross-cutting reminders (must hold throughout)
- Source **text verbatim**, never "corrected" (D20). **No Word CSS/classes** reused (D20).
- **Relative paths only** (D5). **No build step / no runtime deps** (D3). **Ukrainian only.**
- Article pages use **only source photos**; generated imagery is **home/decor only** (D18).
- «Своїх не кидають» = home hero only; header wordmark = «Котопес» + paw (D11).
