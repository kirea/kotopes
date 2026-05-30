// Rubric filtering for materials.html (D2, IMPLEMENTATION-PLAN §6).
//
// Resilience: all 5 article cards are authored as static HTML in the page, so
// with JS OFF the page still shows every card (PRD §6.2). With JS ON this module
// reads ?rubric=<id> and HIDES the non-matching cards, makes the page H1
// state-aware, and reveals a «← Усі матеріали» reset link.
//
// Each static card carries data-rubric="<id>". `oglyady` matches 2 cards; the
// other rubrics match 1 — still rendered as a (1-card) list. Unknown / empty
// rubric → show all (graceful fallback).

import { RUBRICS, rubricLabel } from "./articles.js";

(function () {
  const grid = document.querySelector("[data-listing]");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll("[data-rubric]"));
  const titleEl = document.querySelector("[data-listing-title]");
  const introEl = document.querySelector("[data-listing-intro]");
  const resetEl = document.querySelector("[data-listing-reset]");
  const emptyEl = document.querySelector("[data-listing-empty]");

  const validIds = new Set(RUBRICS.map((r) => r.id));
  const param = new URLSearchParams(location.search).get("rubric");
  const isFiltered = param && validIds.has(param);

  if (isFiltered) {
    let shown = 0;
    cards.forEach((card) => {
      const match = card.getAttribute("data-rubric") === param;
      card.hidden = !match;
      if (match) shown += 1;
    });
    if (titleEl) titleEl.textContent = rubricLabel(param);
    if (introEl) {
      introEl.textContent =
        shown === 1 ? "1 матеріал у цій рубриці." : `${shown} матеріали у цій рубриці.`;
    }
    if (resetEl) resetEl.hidden = false;
    if (emptyEl) emptyEl.hidden = shown !== 0;
    // Reflect the filtered state in the document title for orientation.
    document.title = `${rubricLabel(param)} — Котопес`;
  } else {
    // No filter (or unknown id): show everything.
    cards.forEach((card) => (card.hidden = false));
    if (resetEl) resetEl.hidden = true;
    if (emptyEl) emptyEl.hidden = true;
  }
})();
