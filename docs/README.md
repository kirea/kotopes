# «Котопес» — documentation set

This `docs/` folder is the **complete specification** for building the «Котопес» website. The site
itself is **not yet built** — these documents are the brief that a future AI-agent session (or human)
implements from. They are written to lose **nothing** from the original request or the planning
conversation.

## What the project is
A **static, Ukrainian-only website** of documentary journalism about animals during russia's full-scale
war against Ukraine — rescue, loss, ecocide, and the roles animals play in wartime. Five long-read
articles in four rubrics, plus home, "help the shelters", and about pages. **Plain HTML/CSS/JS, no
build step, deployed to GitHub Pages** at `https://kirea.github.io/kotopes/`. All content comes from
the repo's `sources/` folder and must be used **verbatim**.

## Read in this order
1. **[REQUIREMENTS-AND-QA.md](./REQUIREMENTS-AND-QA.md)** — the binding source of intent: the original
   brief verbatim, every clarifying question + chosen answer, and the master decisions table (D1–D20).
   **Start here.**
2. **[PRD.md](./PRD.md)** — product requirements: goals/non-goals, information architecture, per-page
   functional requirements, the articles data model, content-sourcing rules, acceptance criteria, NFRs
   (a11y, SEO, performance, platform).
3. **[DESIGN.md](./DESIGN.md)** — the visual system: mood, Honey+teal palette (with hex + contrast),
   typography, tokens, component specs, motion, generated imagery, logo, per-page layouts.
4. **[IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md)** — architecture, built file tree, slug map,
   image-rename map, the data-model file, client-side rubric filtering, the Word-HTML extraction
   procedure, image handling, SEO/meta plan, and GitHub Pages deployment.
5. **[TASKS.md](./TASKS.md)** — the ordered, granular build checklist (Phases 0–9) with done-criteria.

## Precedence (resolve conflicts this way)
- **Intent / decisions:** `REQUIREMENTS-AND-QA.md` wins.
- **Content (text, images, titles):** the repo's `sources/` folder wins — always reproduce verbatim.
- **How to build:** `IMPLEMENTATION-PLAN.md`; **what it must do:** `PRD.md`; **how it looks:**
  `DESIGN.md`.

## The hard rules (never violate)
- **Source texts verbatim** — keep apparent spelling/grammar mistakes (some are intentional; e.g.
  «істории» in the портрети title). Never "correct" them.
- **Do not reuse the MS-Word CSS/classes** (`Mso*`, `WordSection1`, inline styles, `&nbsp;` spacers).
  Re-author clean semantic HTML; tags may be reused.
- **Relative paths only** (`./`, `../`) so the site works under `/kotopes/`.
- **No build step, no runtime dependencies.** Prefer native HTML/CSS over JS where it costs no design.
- **Ukrainian only.** Article pages use **only source photos**; generated imagery is home/decor only.
- **Single light theme** (no dark-mode toggle).

## Source material map (in repo root `sources/`)
| Source | Used for |
|---|---|
| `Домашня сторінка/Домашня сторінка.html` | Home hero (slogan «Своїх не кидають», subtitle, intro) |
| `Усі матеріали/<rubric>/*.html` (5 files) | The 5 article pages (H1 = title) |
| `Усі матеріали/<rubric>/*.fld/` | Article photos (rename per IMPLEMENTATION-PLAN §4) |
| `Допомога притулкам/Допомога притулкам.txt` | 3 external shelter links |
| `Про нас/Про нас.html` | About mission text |

## Status
- ✅ Documentation set complete (this folder).
- ⛔ Site implementation not started — begin at TASKS.md Phase 0.

## Status legend (for TASKS.md checkboxes)
`[ ]` not started · `[~]` in progress (annotate) · `[x]` done & verified against its done-criterion.
