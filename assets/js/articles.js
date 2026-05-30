// Single source-of-truth data model (IMPLEMENTATION-PLAN §5).
// Drives the home "Рекомендовані матеріали" section, the Усі матеріали grid,
// and client-side rubric filtering on materials.html. Article pages are static
// HTML and do not depend on this model to render.
//
// Titles + excerpts are VERBATIM from the source articles — keep any intentional
// spelling/grammar quirks exactly as the source has them. (Note: the docs claimed
// the портрети title contains «істории», but the actual source H1 reads «історії»
// — sources win for content, so the correct verbatim title is used here.)
// `coverAlt` is descriptive alt text (additive, factual — not source text).
// Paths are relative (D5); from articles/*.html prepend "../".

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
    coverAlt: "Павич на подвір’ї житлового двору в центрі Києва",
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
    title: "Любов, що не має кордонів: історії порятунку, втрат та повернення за своїми улюбленцями",
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
    coverAlt: "Службовий собака-рятувальник на роботі",
    href: "articles/hvosty-ta-lapy-na-sluzhbi.html",
  },
];

/** Count of articles per rubric id. */
export function rubricCount(id) {
  return ARTICLES.filter((a) => a.rubricId === id).length;
}

/** Look up a rubric label by id. */
export function rubricLabel(id) {
  return (RUBRICS.find((r) => r.id === id) || {}).label || "";
}
