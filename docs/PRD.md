# PRD — «Котопес» static site

> Product Requirements Document. Read together with [DESIGN.md](./DESIGN.md) (visual system),
> [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) (architecture/how), [TASKS.md](./TASKS.md)
> (work breakdown), and [REQUIREMENTS-AND-QA.md](./REQUIREMENTS-AND-QA.md) (binding intent).
> When this PRD and REQUIREMENTS-AND-QA disagree on *intent*, the latter wins. For *content*, the
> `sources/` folder is the source of truth.

## 1. Overview

**«Котопес»** is a static, Ukrainian-only website presenting documentary journalism about the fate of
animals during russia's full-scale war against Ukraine — rescue, loss, ecocide, and the roles animals
play in wartime. It is a journalism diploma project. The site publishes five long-read articles
organised into four rubrics, plus a home page, a "help the shelters" page, and an about page.

- **Audience:** Ukrainian-reading general public; readers interested in the humanitarian/ecological
  dimension of the war; potential donors to animal shelters; academic reviewers of the diploma.
- **Tone:** warm and hopeful, compassionate, credible. Serious subject, humane treatment.
- **Hosting:** GitHub Pages, repo `kirea/kotopes`, served at `https://kirea.github.io/kotopes/`.

## 2. Goals & non-goals

### Goals
- Present the 5 articles with strong, readable, photo-forward article pages.
- Let users reach any article two ways: via **Усі матеріали** (full grid) and via **Рубрики** (filtered
  by category). Both routes lead to the same article pages.
- Surface a clear call to action to **help shelters** (3 external organisations).
- Communicate the project's mission (**Про нас**).
- Be fast, accessible (WCAG 2.2 AA), SEO-friendly, and deployable with zero build step.

### Non-goals
- No CMS, no backend, no database, no comments, no search (not required for 5 articles).
- No multi-language / i18n — **Ukrainian only**.
- No user accounts, donations processing, or forms (help links go to external sites).
- No legacy-browser support.
- No build/bundler/framework (explicit decision **D3**).

## 3. Information architecture & site map

Top navigation (5 entries, exact Ukrainian labels):

```
Домашня сторінка  |  Усі матеріали  |  Рубрики ▾  |  Допомога притулкам  |  Про нас
```

`Рубрики ▾` is a **dropdown menu**, not a page (**D1**). Its 4 options:

| Dropdown label | Rubric id | Source folder(s) | Articles |
|---|---|---|---|
| Художній репортаж | `reportazh` | `художній репортаж` | 1 |
| Інтервʼю | `interviu` | `інтервʼю` | 1 |
| Портретні нариси | `portrety` | `портрети` | 1 |
| Огляди | `oglyady` | `екоцид`, `тварини в професії` | 2 |

Page inventory (9 content pages + 404):

| # | Page | Built path (relative) | Purpose |
|---|---|---|---|
| 1 | Домашня сторінка (Home) | `index.html` | Hero + featured + rubric tiles + help CTA + about teaser |
| 2 | Усі матеріали (All materials) | `materials.html` | Full grid of all 5 article cards; also hosts the filtered rubric views via `?rubric=` |
| 3 | Рубрики (4 filtered views) | `materials.html?rubric=<id>` | Same page as #2, filtered to one rubric (**D2**) |
| 4 | Допомога притулкам (Help) | `help.html` | 3 external-org cards |
| 5 | Про нас (About) | `about.html` | Mission statement, editorial layout |
| 6–10 | 5 article pages | `articles/<slug>.html` | One per source article |
| — | 404 | `404.html` | Friendly not-found, links back home (GitHub Pages serves this automatically) |

> **Why one listing page for both Усі матеріали and Рубрики:** decision **D2/D3** — a single
> `materials.html` reads the `articles` data model and filters client-side on a `?rubric=<id>` query
> param. The dropdown links point to `materials.html?rubric=<id>`; "Усі матеріали" points to
> `materials.html` (no param = show all). This guarantees both routes forward to the same article
> links, as the brief requires.

## 4. Content sourcing rules (binding)

1. **All visible text comes from `sources/`** and is reproduced **verbatim** — including spelling/
   grammar that looks wrong. Some mistakes are intentional (e.g. the портрети title contains
   «істории»; the home hero markup splits «кидають» into a separate span — the rendered text is still
   «Своїх не кидають»). **Never "fix" source text.**
2. **Do NOT copy the MS-Word CSS/classes** (`MsoNormal`, `MsoTitle`, `WordSection1`, inline
   `style="..."`, `lang=` attrs, `&nbsp;` padding paragraphs, `panose`/`@font-face` blocks, etc.).
   Re-author clean semantic HTML. HTML *tags* may be reused; Word *styling* may not.
3. **Images:** use the attached pictures from each article's `*.fld/` folder. `editdata.mso` is a Word
   junk file — ignore it. Image **captions and photo credits** that appear in the source (e.g. «Фото:
   Євгеній Кірвас», «Засновниця Центру… Фото: …») and any `alt` text already present (e.g. екоцид
   `image001` has `alt="Комплекс відпочинку \"Казкова Діброва\" (м. Нова Каховка)"`) **must be
   preserved verbatim** as `<figcaption>` / `alt`.
4. **Additive text is allowed only where the source provides none** and only if factual: the
   Допомога-притулкам org names and one-line blurbs (**D13**). No invented dates, authors, or facts
   anywhere else (**D14**).
5. **Generated imagery** (home hero + decorative bands only, **D18**) is additive decoration, never a
   substitute for or misrepresentation of documentary article photos.

## 5. The `articles` data model

A single source-of-truth data file (`assets/data/articles.js` exporting a JS array, or
`articles.json` fetched at runtime — see IMPLEMENTATION-PLAN) drives the home featured section, the
Усі-матеріали grid, and rubric filtering. Each article record:

```
{
  slug:        "oazys-posered-betonnyh-dzhungliv",   // ASCII, used in articles/<slug>.html
  title:       "Оазис посеред бетонних джунглів",     // verbatim H1 (UI text, Ukrainian)
  rubricId:    "reportazh",                            // one of: reportazh|interviu|portrety|oglyady
  rubricLabel: "Художній репортаж",                    // display label for the chip
  excerpt:     "…",                                    // 1–2 line verbatim opening sentence(s)
  cover:       "assets/img/<slug>/01.jpg",             // preview/representative photo (relative path)
  coverAlt:    "…",                                    // descriptive Ukrainian alt text
  href:        "articles/oazys-posered-betonnyh-dzhungliv.html"
}
```

The five records (titles verbatim from source H1s; see IMPLEMENTATION-PLAN for the full slug/image
map and confirmed excerpts):

| slug | title | rubricId / label |
|---|---|---|
| `oazys-posered-betonnyh-dzhungliv` | Оазис посеред бетонних джунглів | `reportazh` / Художній репортаж |
| `ponad-1000-vryatovanyh` | Понад 1000 врятованих: як працює Центр порятунку диких тварин під Києвом | `interviu` / Інтервʼю |
| `lyubov-bez-kordoniv` | Любов, що не має кордонів: істории порятунку, втрат та повернення за своїми улюбленцями | `portrety` / Портретні нариси |
| `zlochyn-bez-pokarannya` | Злочин без покарання: як росія веде війну проти беззахисних тварин | `oglyady` / Огляди |
| `hvosty-ta-lapy-na-sluzhbi` | Хвости та лапи на службі: як тварини допомагають і рятують людей | `oglyady` / Огляди |

> Note the title «істории» (портрети) is an intentional source spelling — keep it.

## 6. Per-page functional requirements

### 6.1 Домашня сторінка — `index.html`
Sections in order (**D12**):
1. **Hero** — slogan **«Своїх не кидають»** (H1), subtitle **«Захистімо тварин під час війни»**, then
   the intro paragraph (verbatim from `Домашня сторінка.html`, beginning «Тема взаємодії людини і
   тварини…»), a primary CTA button to «Усі матеріали», warm generated photographic background (**D18**).
2. **«Рекомендовані матеріали»** — 3–4 article cards (reuse the card component).
3. **Rubric shortcut tiles** — 4 tiles, one per rubric, each linking to `materials.html?rubric=<id>`.
4. **«Допомога притулкам» CTA band** — the only place that leans on the UA blue/yellow accent; short
   call to action + button to `help.html`.
5. **«Про нас» teaser** — a few lines + link to `about.html`.
6. Footer.

### 6.2 Усі матеріали — `materials.html`
- Renders **all 5** article cards from the data model in a responsive grid.
- Reads `?rubric=<id>`; if present, filters to that rubric and shows a heading like the rubric label
  plus a "show all"/«Усі матеріали» reset link. If a single article remains, still render it as a
  1-card list (**D2**).
- Page H1 reflects state: «Усі матеріали» (no filter) or the rubric label (filtered).
- Empty/unknown `rubric` value → show all (graceful fallback).
- Filtering is client-side, JS optional-degradation: with JS off, the page still shows all cards.

### 6.3 Рубрики (dropdown behaviour)
- Hover/focus/click opens a menu of the 4 rubrics. Must be **keyboard operable** and screen-reader
  labelled (see a11y, §8). Prefer native: a `<details>`/`<summary>` disclosure or a button +
  `popover` attribute; avoid bespoke JS if a native control gives the same UX (**D-native**).
- Each item navigates to `materials.html?rubric=<id>`.

### 6.4 Article cards (used on home + materials)
Each card shows (**D10**): cover image (lazy), rubric chip, H1 title, 1–2 line verbatim excerpt. Entire
card is a link to the article. Consistent aspect-ratio cover, hover elevation.

### 6.5 Article pages — `articles/<slug>.html`
- Article header: rubric chip, H1 title (verbatim), optional lead.
- Body: clean semantic re-authoring of the source — `<p>`, `<h2>` subheads (sources use them),
  `<blockquote>`/`<em>` for the italic pull-quotes, `<figure>`+`<figcaption>` for photos **in their
  original positions** with captions/credits preserved (**D9**).
- Each `<figure>` image is lazy-loaded, responsive, and clicking it opens a **native `<dialog>`
  lightbox** showing the full image; closeable by Esc/backdrop/✕; focus-trapped.
- "Назад до матеріалів" link and prev/next or related-by-rubric links at the foot (nice-to-have).
- JSON-LD `Article` structured data (§8).

### 6.6 Допомога притулкам — `help.html`
- Intro line, then **3 cards** (**D13**), one per organisation:

  | Org (derive name from site) | URL |
  |---|---|
  | HAU — Help Animals of Ukraine | `https://en.hau.com.ua/` |
  | Домівка | `https://www.domivka.org.ua/` |
  | Happy Paw | `https://happypaw.ua/` (the source URL carries ad-tracking query params — link to the clean canonical URL) |

- Each card: org name + a **short, factual** Ukrainian blurb (written by the implementer; must be
  accurate and verifiable — verify against each org's site before publishing) + «Перейти на сайт ↗»
  button opening in a new tab with `target="_blank" rel="noopener noreferrer"`.

### 6.7 Про нас — `about.html`
- **Editorial mission layout** (**D14**): the source paragraph (verbatim, beginning «**Актуальність
  проєкту** полягає…»; keep the bold lead) set as a centered large-type mission statement over a warm
  backdrop; one strong line rendered as a pull-quote; closing «Допомога притулкам» CTA. No invented
  facts (no author/year unless the user supplies them later).

### 6.8 404 — `404.html`
- Warm, on-brand not-found page; short message in Ukrainian; link home and to «Усі матеріали».

## 7. Global UI requirements
- **Header** on every page: paw SVG mark + wordmark **«Котопес»** (links home), the 5-item nav with
  the Рубрики dropdown, current-page indication, responsive (mobile hamburger). Slogan «Своїх не
  кидають» appears **only** in the home hero, not the header.
- **Footer** on every page: wordmark, condensed nav, a one-line help-shelters prompt, and a project
  line (no invented org details). Year may be shown.
- Skip-to-content link; visible focus styles; consistent container width and spacing tokens
  (see DESIGN.md).

## 8. Non-functional requirements

### Accessibility — WCAG 2.2 AA (acceptance criteria, **D16**)
- Semantic landmarks (`header`/`nav`/`main`/`footer`), one `<h1>` per page, logical heading order.
- Dropdown and lightbox fully keyboard operable; focus visible; focus trapped in open `<dialog>`;
  Esc closes; focus returns to the trigger.
- All photos have meaningful `alt`; decorative/generated backgrounds are `alt=""`/CSS.
- Colour contrast ≥ AA (4.5:1 text, 3:1 large text/UI) — see DESIGN.md contrast notes.
- `<html lang="uk">`. Hit targets ≥ 24×24px. Respect `prefers-reduced-motion`.

### Performance
- No build step, but images must not bloat: source photos are large (~6MB total; художній репортаж
  ~3MB). Lazy-load below-the-fold images (`loading="lazy"`), set explicit `width`/`height` (or
  `aspect-ratio`) to avoid layout shift, serve responsibly sized images. Generated home/decor images
  shipped as optimized WebP. (Image-conversion of source photos is optional and manual — see
  IMPLEMENTATION-PLAN; not mandated since D3 = no build.)
- Fonts: `font-display: swap`; subset to Cyrillic+Latin if self-hosting.

### SEO & social (**D17**)
- Per-page `<title>` and meta description (Ukrainian). Open Graph + Twitter card tags (title, desc,
  image — use the article cover or a home OG image). `lang="uk"`. Canonical relative-safe links.
- `sitemap.xml`, `robots.txt`, favicon + app icons (paw mark). JSON-LD `Article` on each article page
  (headline, image, articleSection = rubric; no fabricated author/date).

### Platform constraints
- **Relative paths only** (`./`, `../`) so the site works under `/kotopes/` (**D5**).
- **No build step / no dependencies at runtime** (**D3**). Plain `.html`/`.css`/`.js`. Prefer native
  HTML/CSS over JS where it doesn't cause a design regression (brief).
- Deploy from a branch via GitHub repo **Settings → Pages**.

## 9. Acceptance criteria (definition of done for the site)
- [ ] All 5 nav destinations work; Рубрики dropdown opens via mouse + keyboard and lists 4 rubrics.
- [ ] `materials.html` shows all 5 cards; `?rubric=oglyady` shows exactly 2 (екоцид + тварини в
      професії); each other rubric shows its 1 card.
- [ ] Every card links to the correct `articles/<slug>.html`; both Усі матеріали and Рубрики reach the
      same article URLs.
- [ ] Each article renders all source images in original positions with captions/credits/alt verbatim;
      lightbox works with keyboard.
- [ ] Home shows hero (slogan/subtitle/intro verbatim), featured cards, 4 rubric tiles, help CTA band,
      about teaser.
- [ ] Help page lists the 3 orgs with factual blurbs and new-tab links.
- [ ] About page shows the mission text verbatim in the editorial layout.
- [ ] No MS-Word CSS/classes remain anywhere; no source text altered.
- [ ] Works correctly when served from `/kotopes/` (relative paths verified).
- [ ] A11y AA checks pass; SEO/meta/sitemap/robots/favicon/JSON-LD present.
- [ ] Lighthouse: no broken links/images; reasonable performance given un-rebuilt photos.

## 10. Risks & open items
- **Large source images** could hurt performance; mitigated by lazy-load + dimensions, optional manual
  WebP conversion (IMPLEMENTATION-PLAN documents the procedure if the implementer opts in).
- **Help-page blurbs** must be fact-checked against the orgs' current sites before publishing.
- **Slugs** are proposed in this doc; finalize in IMPLEMENTATION-PLAN and keep them stable (they become
  public URLs).
- **No author/date metadata** in sources → JSON-LD/About omit them rather than invent.
