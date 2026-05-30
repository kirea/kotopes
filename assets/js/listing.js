import { ARTICLES, RUBRICS } from "./articles.js";

const rubricLabel = new Map(RUBRICS.map((rubric) => [rubric.id, rubric.label]));

function card(article) {
  return `<a class="article-card" href="${article.href}" data-rubric="${article.rubricId}">
  <span class="card-media"><img src="${article.cover}" alt="${article.coverAlt}" loading="lazy" width="640" height="426"></span>
  <span class="chip">${article.rubricLabel}</span>
  <h3>${article.title}</h3>
  <p>${article.excerpt}</p>
</a>`;
}

const featuredGrid = document.querySelector("[data-featured-grid]");
if (featuredGrid) {
  featuredGrid.innerHTML = ARTICLES.slice(0, 4).map(card).join("");
}

const grid = document.querySelector("[data-article-grid]");
if (grid) {
  const params = new URLSearchParams(window.location.search);
  const rubric = params.get("rubric");
  const validRubric = rubricLabel.has(rubric) ? rubric : "";
  const visible = validRubric ? ARTICLES.filter((article) => article.rubricId === validRubric) : ARTICLES;
  const title = document.querySelector("[data-listing-title]");
  const note = document.querySelector("[data-listing-note]");
  const reset = document.querySelector("[data-reset-link]");

  if (title) title.textContent = validRubric ? rubricLabel.get(validRubric) : "Усі матеріали";
  if (note) note.textContent = validRubric ? `Матеріали рубрики «${rubricLabel.get(validRubric)}».` : "Пʼять історій у чотирьох рубриках. Оберіть матеріал або відкрийте рубрику з меню.";
  if (reset) reset.hidden = !validRubric;

  grid.innerHTML = visible.map(card).join("");
}
