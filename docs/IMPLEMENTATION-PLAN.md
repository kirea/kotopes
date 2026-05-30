# IMPLEMENTATION PLAN — «Котопес» static site

> How to build what [PRD.md](./PRD.md) specifies, styled per [DESIGN.md](./DESIGN.md). Plain static,
> no build step (D3). All decisions trace to [REQUIREMENTS-AND-QA.md](./REQUIREMENTS-AND-QA.md). Work
> items are enumerated in [TASKS.md](./TASKS.md).

## 1. Architecture overview
- **Plain multi-page static site.** Hand-authored `.html`, one shared `.css`, a tiny `.js` for the
  three interactive bits (dropdown if not native, lightbox, rubric filtering). No framework, bundler,
  package manager, or CI build (D3).
- **Single data model** (`assets/data/articles.js`) is imported by `index.html` (featured) and
  `materials.html` (grid + filter). Article pages are static HTML (content is hand-extracted), so they
  don't depend on the data model to render — the model is for listings only.
- **Relative paths everywhere** (D5) so it runs under `https://kirea.github.io/kotopes/`. No leading
  `/`. From `articles/*.html`, assets are `../assets/...`.

## 2. Built file tree

```
/                              (repo root = site root for Pages)
├── index.html                 # Домашня сторінка
├── materials.html             # Усі матеріали + rubric filter (?rubric=<id>)
├── help.html                  # Допомога притулкам
├── about.html                 # Про нас
├── 404.html                   # not found
├── articles/
│   ├── oazys-posered-betonnyh-dzhungliv.html
│   ├── ponad-1000-vryatovanyh.html
│   ├── lyubov-bez-kordoniv.html
│   ├── zlochyn-bez-pokarannya.html
│   └── hvosty-ta-lapy-na-sluzhbi.html
├── assets/
│   ├── css/
│   │   └── styles.css         # tokens + components + pages (single sheet; or a few @imported partials)
│   ├── js/
│   │   ├── articles.js        # exports ARTICLES array (the data model)
│   │   ├── listing.js         # renders grid + reads ?rubric, filters
│   │   ├── lightbox.js        # <dialog> open/close wiring
│   │   └── nav.js             # dropdown/mobile menu (only if native isn't enough)
│   ├── img/
│   │   ├── oazys/01.jpg … 15.jpg
│   │   ├── ponad-1000/01.jpg … 06.jpg
│   │   ├── lyubov/01.png 02.jpg … 10.jpg
│   │   ├── zlochyn/01.jpg
│   │   ├── hvosty/01.jpg
│   │   └── home/               # generated WebP hero + decorative bands
│   ├── fonts/                  # self-hosted woff2 (if not using Google Fonts CDN)
│   └── icons/                  # favicon.svg, apple-touch-icon.png, etc.
├── sitemap.xml
├── robots.txt
├── manifest.webmanifest
└── docs/                       # (this documentation set — not part of the deployed site content)
```

> The Pages site can be served from the repo root on a branch, or from `/docs` — **do not** use the
> `/docs` Pages mode here since `docs/` holds documentation. Serve from root of the chosen branch.

## 3. Slug map & content sources (D4)

Transliteration is fixed below — **keep these slugs stable** (they are public URLs). UI/visible titles
stay Ukrainian and verbatim.

| Rubric label | rubricId | Source HTML | Built page | Slug |
|---|---|---|---|---|
| Художній репортаж | `reportazh` | `sources/Усі матеріали/художній репортаж/художній репортаж.html` | `articles/oazys-posered-betonnyh-dzhungliv.html` | `oazys-posered-betonnyh-dzhungliv` |
| Інтервʼю | `interviu` | `sources/Усі матеріали/інтервʼю/інтервʼю.html` | `articles/ponad-1000-vryatovanyh.html` | `ponad-1000-vryatovanyh` |
| Портретні нариси | `portrety` | `sources/Усі матеріали/портрети/портрети.html` | `articles/lyubov-bez-kordoniv.html` | `lyubov-bez-kordoniv` |
| Огляди | `oglyady` | `sources/Усі матеріали/екоцид/екоцид.html` | `articles/zlochyn-bez-pokarannya.html` | `zlochyn-bez-pokarannya` |
| Огляди | `oglyady` | `sources/Усі матеріали/тварини в професії/тварини в професії.html` | `articles/hvosty-ta-lapy-na-sluzhbi.html` | `hvosty-ta-lapy-na-sluzhbi` |

Verbatim H1 titles (use exactly; note intentional «істории»):
- Оазис посеред бетонних джунглів
- Понад 1000 врятованих: як працює Центр порятунку диких тварин під Києвом
- Любов, що не має кордонів: істории порятунку, втрат та повернення за своїми улюбленцями
- Злочин без покарання: як росія веде війну проти беззахисних тварин
- Хвости та лапи на службі: як тварини допомагають і рятують людей

Other sources:
- Home hero: `sources/Домашня сторінка/Домашня сторінка.html` → H1 «Своїх не кидають», subtitle
  «Захистимо тварин під час війни», intro paragraph «Тема взаємодії людини і тварини…» (verbatim).
- About: `sources/Про нас/Про нас.html` → paragraph beginning bold «Актуальність проєкту…» (verbatim).
- Help: `sources/Допомога притулкам/Допомога притулкам.txt` → 3 URLs (see PRD §6.6).

## 4. Image rename map (D4)

Copy each source `*.fld/imageNNN.ext` to `assets/img/<slug>/NN.ext`, preserving order. **Ignore**
`editdata.mso`. Keep the source extension (`.png` stays `.png`).

| Article slug | Source folder | Source files | Target |
|---|---|---|---|
| `oazys-posered-betonnyh-dzhungliv` | `художній репортаж.fld/` | `image001..image015.jpg` (some are intentionally small inline photos) | `assets/img/oazys/01..15.jpg` |
| `ponad-1000-vryatovanyh` | `інтервʼю.fld/` | `image001..image006.jpg` | `assets/img/ponad-1000/01..06.jpg` |
| `lyubov-bez-kordoniv` | `портрети.fld/` | `image001.png`, `image002..image010.jpg` | `assets/img/lyubov/01.png`, `02..10.jpg` |
| `zlochyn-bez-pokarannya` | `екоцид.fld/` | `image001.jpg` | `assets/img/zlochyn/01.jpg` |
| `hvosty-ta-lapy-na-sluzhbi` | `тварини в професії.fld/` | `image001.jpg` | `assets/img/hvosty/01.jpg` |

**Cover/preview image** (for cards/OG): default to the article's `01` image; if `01` is a poor preview
(e.g. lyubov `01.png` is a tall portrait), pick the most representative photo and record it in the data
model's `cover`. Within article pages, image order/positions must match the source.

> Article body image references in source use percent-encoded Word paths like
> `src="художній%20репортаж.fld/image001.jpg"` and table-based placement (інтервʼю) or `align=left`
> floats. Re-author these as clean `<figure>` with the new `../assets/img/<slug>/NN.ext` paths.

## 5. The data model — `assets/js/articles.js`

```js
export const RUBRICS = [
  { id: "reportazh", label: "Художній репортаж" },
  { id: "interviu",  label: "Інтервʼю" },
  { id: "portrety",  label: "Портретні нариси" },
  { id: "oglyady",   label: "Огляди" },
];

export const ARTICLES = [
  {
    slug: "oazys-posered-betonnyh-dzhungliv",
    title: "Оазис посеред бетонних джунглів",
    rubricId: "reportazh",
    excerpt: "Нарешті я повернулася до батьків. Київ як завжди зустрічає натовпом, бо всі поспішають по своїх справах.",
    cover: "assets/img/oazys/01.jpg",
    coverAlt: "Павич на балконі у дворі в центрі Києва",
    href: "articles/oazys-posered-betonnyh-dzhungliv.html",
  },
  {
    slug: "ponad-1000-vryatovanyh",
    title: "Понад 1000 врятованих: як працює Центр порятунку диких тварин під Києвом",
    rubricId: "interviu",
    excerpt: "Центр порятунку диких тварин — єдина в Україні організація, яка рятує великих хижаків, виключно завдяки пожертвам небайдужих.",
    cover: "assets/img/ponad-1000/01.jpg",
    coverAlt: "Засновниця Центру порятунку диких тварин Наталя Попова",
    href: "articles/ponad-1000-vryatovanyh.html",
  },
  {
    slug: "lyubov-bez-kordoniv",
    title: "Любов, що не має кордонів: істории порятунку, втрат та повернення за своїми улюбленцями",
    rubricId: "portrety",
    excerpt: "Шериф – кіт із французького притулку, якому родина Ніки подарувала справжню домівку.",
    cover: "assets/img/lyubov/02.jpg",
    coverAlt: "Врятований кіт у новій домівці",
    href: "articles/lyubov-bez-kordoniv.html",
  },
  {
    slug: "zlochyn-bez-pokarannya",
    title: "Злочин без покарання: як росія веде війну проти беззахисних тварин",
    rubricId: "oglyady",
    excerpt: "З перших днів повномасштабного вторгнення мільйони українців залишали свої домівки без особистих речей, але з хатніми улюбленцями.",
    cover: "assets/img/zlochyn/01.jpg",
    coverAlt: "Комплекс відпочинку «Казкова Діброва» (м. Нова Каховка)",
    href: "articles/zlochyn-bez-pokarannya.html",
  },
  {
    slug: "hvosty-ta-lapy-na-sluzhbi",
    title: "Хвости та лапи на службі: як тварини допомагають і рятують людей",
    rubricId: "oglyady",
    excerpt: "Тварини допомагають нам не лише на побутовому рівні – іноді від них залежить наше життя.",
    cover: "assets/img/hvosty/01.jpg",
    coverAlt: "Службовий собака-рятувальник",
    href: "articles/hvosty-ta-lapy-na-sluzhbi.html",
  },
];
```

> **Excerpts above are taken from the source opening sentences and should be re-verified verbatim**
> against the article body during extraction (do not paraphrase). `coverAlt` is descriptive alt text
> (allowed — not "source text"); keep it factual.

## 6. Listing & rubric filtering — `assets/js/listing.js` (D2)
- `materials.html` includes an empty grid container and `<script type="module">` importing
  `ARTICLES`/`RUBRICS` and `listing.js`.
- On load: read `new URLSearchParams(location.search).get("rubric")`.
  - none / unknown → render all 5 cards, page H1 = «Усі матеріали».
  - valid id → render only matching cards, H1 = rubric label, show a «← Усі матеріали» reset link.
- `oglyady` matches 2 articles (екоцид + тварини в професії); others match 1 — still render as a list.
- **Progressive enhancement:** server can't filter (static), but to keep content visible with JS off,
  either (a) hardcode all 5 cards in the HTML and let JS hide non-matching, or (b) accept JS-required
  listing and ensure article pages + nav still work without JS. Prefer (a) for resilience.
- The Рубрики dropdown items are plain `<a href="materials.html?rubric=<id>">` — no JS needed to
  navigate.

## 7. Word-HTML → clean HTML extraction procedure
For each source article (and home/about):
1. **Strip all Word artifacts:** remove `<style>` blocks, `class="Mso*"`, `div.WordSection1`, inline
   `style="..."`, `lang=` attributes, `<o:p>`, `&nbsp;`-only spacer paragraphs, `panose`/`@font-face`.
   Keep only meaningful structure.
2. **Re-author semantically:** title → `<h1>` (in the article header), subheads → `<h2>` (sources
   already use `<h2>`, e.g. «Знайомство з Юрієм Борисовичем»), paragraphs → `<p>`, italic
   speaker/quote runs → `<em>` or `<blockquote>` (pull-quote treatment), Q&A interview turns → keep the
   `—` dashes and bold questions as `<p><strong>…</strong></p>`.
3. **Text is verbatim** — copy the Ukrainian text exactly, including intentional mistakes and mixed
   `lang=UK/RU/EN` runs (just drop the attributes, keep the characters). Merge Word's mid-word line
   breaks back into continuous text.
4. **Images → `<figure>`** in their original positions: `<img src="../assets/img/<slug>/NN.ext"
   alt="…" loading="lazy" width=… height=…>` + `<figcaption>` when the source has a caption/credit.
   Preserve existing captions/credits **verbatim** (e.g. «Фото: Євгеній Кірвас»; «Засновниця Центру
   порятунку диких тварин Наталя Попова. Фото: Центр порятунку диких тварин») and existing `alt` (e.g.
   екоцид `image001` alt «Комплекс відпочинку "Казкова Діброва" (м. Нова Каховка)»). Drop Word's
   table/`align=left` float scaffolding; use CSS for placement.
5. **External links** found in source bodies (e.g. ursaua.com.ua in інтервʼю) → keep as
   `<a target="_blank" rel="noopener noreferrer">`.
6. Wrap each `<figure>` image to open the **lightbox** (`<dialog>`).

## 8. Image handling
- Copy + rename per §4. Set explicit `width`/`height` (or CSS `aspect-ratio`) to prevent CLS.
- `loading="lazy"` on all below-the-fold images; the home hero LCP image eager + `fetchpriority="high"`.
- **Source photos are used as-is** (no build step). **Optional, manual optimization** (implementer may
  do it once, not in CI): downscale oversized JPGs and/or produce WebP with `<picture>` fallbacks —
  худож. репортаж (~3MB) and портрети (~1.6MB) benefit most. If skipped, lazy-load + dimensions keep it
  acceptable; **log any optimization done in the commit**.
- **Generated home/decor images:** export as optimized WebP into `assets/img/home/` (§DESIGN 7).

## 9. SEO / meta / structured data (D17)
- Per page: unique `<title>` (Ukrainian) + `<meta name="description">`. `<html lang="uk">`,
  `<meta charset="utf-8">`, viewport.
- Open Graph + Twitter card: `og:title`, `og:description`, `og:image` (article cover or home OG image),
  `og:type` (`article` for articles, `website` otherwise), `og:locale="uk_UA"`.
- `sitemap.xml` listing all 9 pages; `robots.txt` allowing all + sitemap reference.
- `favicon.svg` + apple-touch + `manifest.webmanifest` (paw mark, theme color = teal/honey).
- **JSON-LD `Article`** on each article page: `headline` (= H1), `image` (cover), `articleSection` (=
  rubric label), `inLanguage: "uk"`. **Omit** `author`/`datePublished` (not in sources — don't invent).

## 10. Deployment (GitHub Pages, D5)
1. Ensure the site files are at the repo root of the deploy branch (e.g. `main`).
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch**; pick the branch
   and **root** folder (NOT `/docs`).
3. Site goes live at `https://kirea.github.io/kotopes/`.
4. **Verify relative paths** by browsing the live sub-path: no leading-`/` links, assets resolve, the
   `?rubric=` filter works, the `<dialog>` lightbox works, 404 page renders.
5. No GitHub Actions needed (no build step). A `.nojekyll` file at root is recommended so Pages serves
   files as-is without Jekyll processing.

## 11. Conventions
- Indent 2 spaces; UTF-8; lowercase ASCII file/asset names; kebab-case slugs.
- One shared `styles.css` with `:root` tokens (DESIGN §2–4); component classes BEM-ish, no Word classes.
- JS as ES modules (`<script type="module">`); progressive enhancement; no global libraries.
- Every page: skip-link, header, `<main>`, footer; exactly one `<h1>`.
