# «Котопес»

Static, Ukrainian-only website of documentary journalism about the fate of animals during
russia's full-scale war against Ukraine — rescue, loss, ecocide, and the roles animals play in
wartime. Plain HTML/CSS/JS, **no build step**, deployed to GitHub Pages at
`https://kirea.github.io/kotopes/`.

The full specification lives in [`docs/`](./docs/). This README covers running and deploying the
built site.

## Structure

```
index.html            Домашня сторінка (hero + featured + rubric tiles + help CTA + about teaser)
materials.html        Усі матеріали (+ ?rubric=<id> client-side filter)
help.html             Допомога притулкам (3 org cards)
about.html            Про нас (editorial mission)
404.html              not found
articles/*.html       5 article long-reads
assets/css/styles.css design system (Honey + teal, §DESIGN)
assets/js/            articles.js (data model) · listing.js (rubric filter) · lightbox.js · nav.js
assets/fonts/         self-hosted Lora + Inter (Cyrillic+Latin woff2 subsets) + fonts.css
assets/img/           source article photos (renamed) + (home/decor is CSS, no rasters)
assets/icons/         paw favicon.svg + PNG app icons
manifest.webmanifest · robots.txt · sitemap.xml · .nojekyll
```

## Run locally

No dependencies. The site uses ES modules, so serve it over HTTP (not `file://`). To reproduce the
production sub-path (`/kotopes/`), serve the **parent** directory:

```sh
# from the repo root
cd ..
python3 -m http.server 8000
# open http://localhost:8000/kotopes/
```

## Deploy to GitHub Pages

The repository is ready to deploy as-is. **This step must be done in the GitHub UI:**

1. Push this branch to GitHub (e.g. `main`).
2. Repo **Settings → Pages → Build and deployment**:
   - **Source:** *Deploy from a branch*
   - **Branch:** your branch, **folder: `/ (root)`** — **not** `/docs` (that folder holds the spec).
3. Save. The site goes live at `https://kirea.github.io/kotopes/`.
4. No GitHub Actions are needed (no build step). `.nojekyll` is committed so Pages serves files as-is.

After it's live, verify: the `?rubric=` filter, the article `<dialog>` lightbox, that the 404 page
renders, and run Lighthouse for a final performance/SEO/a11y pass.

## Build notes & deviations from `docs/`

The site follows `docs/` (PRD, DESIGN, IMPLEMENTATION-PLAN, TASKS, REQUIREMENTS-AND-QA). Three
points where reality required a deliberate choice:

1. **Title spelling «історії», not «істории».** The docs repeatedly state the портрети title
   contains an *intentional misspelling* «істор**ии**». The actual source H1
   (`sources/Усі матеріали/портрети/портрети.html`) reads «істор**ії**» (the correct spelling,
   verified at the byte level). The binding precedence rule is *sources win for content; reproduce
   verbatim; never alter source text* — so the verbatim-correct «історії» is used everywhere
   (article H1, listing cards, data model, `<title>`, OG, JSON-LD). Writing «истории» would have
   *introduced* a misspelling absent from the source.

2. **Hero/decor imagery is CSS/SVG, not generated photorealistic rasters.** DESIGN §7 / D18 calls
   for warm photoreal generated images for the home hero + decorative bands. These were rendered as
   a layered honey→teal gradient with a subtle paw-print texture instead (chosen with the project
   owner). The hero is structured so a real WebP can be dropped in later by setting the `--hero-photo`
   custom property in `styles.css`. Article pages use **only** source documentary photos, as required.

3. **`404.html` uses `/kotopes/`-rooted absolute paths** (the one documented exception to the
   relative-paths-only rule). GitHub Pages serves the 404 for any missing URL at arbitrary depth,
   where relative asset paths would not resolve; a minimal critical CSS is also inlined as a fallback.

### Verification performed
- **Verbatim fidelity:** automated source-vs-built word diff for all 5 articles — every source word
  is present in the built page (only Word-artifact merges and figure-caption repositioning differ).
- **Routing:** served under `/kotopes/`; `?rubric=oglyady` → exactly 2 cards, other rubrics → 1,
  no filter → 5; both Усі матеріали and Рубрики reach the same `articles/<slug>.html` URLs.
- **Interactions:** dropdown (keyboard + `aria-expanded` + Esc + focus return), `<dialog>` lightbox
  (open, correct image/caption, focus trap, close) — verified live, no console errors.
- **A11y:** one `<h1>`/page, `lang="uk"`, skip-link, `<main>` landmark, every `<img>` has `alt`.
- **Structure:** figure counts match source exactly; no broken links/assets; JSON-LD valid on every
  article (real source byline «Кірвас Дарʼя», no fabricated dates).

> Help-page org blurbs (HAU / Домівка / Happy Paw) were fact-checked against each organisation's
> live site (D13). Re-verify them before relaunch, as charities' details change.
