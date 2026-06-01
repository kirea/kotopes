import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";

const root = process.cwd();

const rubrics = [
  { id: "reportazh", label: "Художній репортаж", count: 1 },
  { id: "interviu", label: "Інтервʼю", count: 1 },
  { id: "portrety", label: "Портретні нариси", count: 1 },
  { id: "oglyady", label: "Огляди", count: 2 },
];

const articleSources = [
  {
    slug: "oazys-posered-betonnyh-dzhungliv",
    short: "oazys",
    source: "sources/Усі матеріали/художній репортаж/художній репортаж.html",
    sourceImgDir: "sources/Усі матеріали/художній репортаж/художній репортаж.fld",
    imgDir: "assets/img/oazys",
    rubricId: "reportazh",
    description: "Художній репортаж про київський двір, де серед міського бетону живуть птахи й люди, які про них дбають.",
    coverAlt: "Павич на балконі у дворі в центрі Києва",
    excerpt: "Нарешті я повернулася до батьків. Київ як завжди зустрічає натовпом, бо всі поспішають по своїх справах.",
  },
  {
    slug: "ponad-1000-vryatovanyh",
    short: "ponad-1000",
    source: "sources/Усі матеріали/інтервʼю/інтервʼю.html",
    sourceImgDir: "sources/Усі матеріали/інтервʼю/інтервʼю.fld",
    imgDir: "assets/img/ponad-1000",
    rubricId: "interviu",
    description: "Інтервʼю про роботу Центру порятунку диких тварин під Києвом і тварин, яких рятують від війни та жорстокості.",
    coverAlt: "Засновниця Центру порятунку диких тварин Наталя Попова",
    excerpt: "Центр порятунку диких тварин — єдина в Україні організація, яка рятує великих хижаків, виключно завдяки пожертвам небайдужих.",
  },
  {
    slug: "lyubov-bez-kordoniv",
    short: "lyubov",
    source: "sources/Усі матеріали/портрети/портрети.html",
    sourceImgDir: "sources/Усі матеріали/портрети/портрети.fld",
    imgDir: "assets/img/lyubov",
    rubricId: "portrety",
    description: "Портретні історії людей і тварин про порятунок, втрати та повернення за своїми улюбленцями.",
    coverAlt: "Врятований кіт у новій домівці",
    coverOverride: "02.jpg",
    excerpt: "Шериф – кіт із французького притулку, якому родина Ніки подарувала справжню домівку.",
  },
  {
    slug: "zlochyn-bez-pokarannya",
    short: "zlochyn",
    source: "sources/Усі матеріали/екоцид/екоцид.html",
    sourceImgDir: "sources/Усі матеріали/екоцид/екоцид.fld",
    imgDir: "assets/img/zlochyn",
    rubricId: "oglyady",
    description: "Огляд про те, як російська війна шкодить тваринам, притулкам і природним територіям України.",
    coverAlt: "Комплекс відпочинку \"Казкова Діброва\" (м. Нова Каховка)",
    excerpt: "З перших днів повномасштабного вторгнення мільйони українців залишали свої домівки без особистих речей, але з хатніми улюбленцями.",
  },
  {
    slug: "hvosty-ta-lapy-na-sluzhbi",
    short: "hvosty",
    source: "sources/Усі матеріали/тварини в професії/тварини в професії.html",
    sourceImgDir: "sources/Усі матеріали/тварини в професії/тварини в професії.fld",
    imgDir: "assets/img/hvosty",
    rubricId: "oglyady",
    description: "Огляд про тварин, які допомагають людям у службі, порятунку та повсякденному житті.",
    coverAlt: "Службовий собака-рятувальник",
    excerpt: "Тварини допомагають нам не лише на побутовому рівні – іноді від них залежить наше життя.",
  },
];

const helpOrgs = [
  {
    name: "HAU — Help Animals of Ukraine",
    url: "https://en.hau.com.ua/",
    blurb: "Організація з порятунку й реабілітації тварин у Києві та області; сайт повідомляє про тимчасове призупинення роботи через нестачу фінансування.",
  },
  {
    name: "Домівка",
    url: "https://www.domivka.org.ua/",
    blurb: "Львівська «Домівка врятованих тварин» рятує, лікує й прилаштовує домашніх, диких і сільськогосподарських тварин.",
  },
  {
    name: "Happy Paw",
    url: "https://happypaw.ua/",
    blurb: "Всеукраїнський благодійний фонд допомагає безпритульним котам і собакам через опіку, лікування, стерилізацію, адопцію та підтримку притулків.",
  },
];

function abs(file) {
  return path.join(root, file);
}

function ensureDir(dir) {
  mkdirSync(abs(dir), { recursive: true });
}

function write(file, content) {
  ensureDir(path.dirname(file));
  writeFileSync(abs(file), `${content.trim()}\n`);
}

function read(file) {
  return readFileSync(abs(file), "utf8");
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function stripWord(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<o:p>[\s\S]*?<\/o:p>/gi, "")
    .replace(/<br[^>]*>/gi, " ");
}

function textFromHtml(html) {
  return decodeEntities(stripWord(html).replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineHtml(html) {
  const links = [];
  let prepared = stripWord(html).replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (full, attrs, inner) => {
    const href = attrs.match(/\bhref=["']([^"']+)["']/i)?.[1];
    const label = textFromHtml(inner);
    if (!href || !label) return label;
    const token = `%%LINK_${links.length}%%`;
    links.push(`<a href="${escapeHtml(decodeEntities(href))}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`);
    return token;
  });

  prepared = decodeEntities(prepared.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();

  let escaped = escapeHtml(prepared);
  links.forEach((link, index) => {
    escaped = escaped.replace(`%%LINK_${index}%%`, link);
  });
  return escaped;
}

function sourceBody(file) {
  const html = read(file);
  return html.match(/<div class=WordSection1[^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
}

function sourceH1(file) {
  return textFromHtml(read(file).match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
}

function homeContent() {
  const body = sourceBody("sources/Домашня сторінка/Домашня сторінка.html");
  const title = textFromHtml(body.match(/<p class=MsoTitle[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? "Своїх не кидають");
  const subtitle = textFromHtml(body.match(/<p class=MsoSubtitle[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? "Захистімо тварин під час війни");
  const paragraphs = [...body.matchAll(/<p\b[\s\S]*?<\/p>/gi)]
    .map((match) => textFromHtml(match[0]))
    .filter((text) => text && text !== title && text !== subtitle);
  return { title, subtitle, intro: paragraphs[0] };
}

function aboutContent() {
  const body = sourceBody("sources/Про нас/Про нас.html");
  const raw = body.match(/<p\b[\s\S]*?<\/p>/i)?.[0] ?? body;
  const full = textFromHtml(raw);
  const lead = "Актуальність проєкту";
  const rest = full.startsWith(lead) ? full.slice(lead.length).trim() : full;
  const pull = "журналістика зобов'язана фіксувати не лише людські втрати, а й ширший контекст – екологічний, моральний, гуманітарний.";
  return { lead, rest, pull };
}

function attr(tag, name) {
  return tag.match(new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"))?.slice(1).find(Boolean) ?? "";
}

function imageMap(article) {
  const files = readdirSync(abs(article.sourceImgDir))
    .filter((name) => /\.(jpe?g|png)$/i.test(name))
    .sort((a, b) => a.localeCompare(b, "en"));
  ensureDir(article.imgDir);
  return new Map(files.map((file, index) => {
    const ext = path.extname(file).toLowerCase();
    const targetName = `${String(index + 1).padStart(2, "0")}${ext}`;
    copyFileSync(abs(path.join(article.sourceImgDir, file)), abs(path.join(article.imgDir, targetName)));
    return [file.toLowerCase(), { src: `../${article.imgDir}/${targetName}`, listingSrc: `${article.imgDir}/${targetName}`, name: targetName }];
  }));
}

function isCaption(text) {
  return /Фото:|Світлина:|Джерело:/i.test(text);
}

function firstImageTarget(article, map) {
  if (article.coverOverride) return `${article.imgDir}/${article.coverOverride}`;
  return map.values().next().value.listingSrc;
}

function convertArticle(article, map) {
  const body = sourceBody(article.source);
  const blocks = [...body.matchAll(/<(h1|h2|p|table)\b[\s\S]*?<\/\1>/gi)];
  const parts = [];
  let lastFigure = null;
  let pendingCaption = "";
  let figureCount = 0;

  for (const block of blocks) {
    const tag = block[1].toLowerCase();
    const html = block[0];
    if (tag === "h1") continue;
    if (tag === "h2") {
      const text = textFromHtml(html);
      if (text) {
        parts.push(`<h2>${escapeHtml(text)}</h2>`);
        lastFigure = null;
        pendingCaption = "";
      }
      continue;
    }

    const imgRegex = /<img\b[^>]*>/gi;
    let cursor = 0;
    let match;
    let sawImage = false;
    while ((match = imgRegex.exec(html))) {
      const before = html.slice(cursor, match.index);
      const beforeText = inlineHtml(before);
      if (beforeText) {
        if (isCaption(beforeText)) {
          pendingCaption = beforeText;
        } else {
          parts.push(`<p>${beforeText}</p>`);
        }
      }

      const imgTag = match[0];
      const original = decodeURIComponent(attr(imgTag, "src")).split("/").pop().toLowerCase();
      const mapped = map.get(original);
      if (mapped) {
        figureCount += 1;
        const width = attr(imgTag, "width") || "";
        const height = attr(imgTag, "height") || "";
        const sourceAlt = decodeEntities(attr(imgTag, "alt"));
        const alt = sourceAlt || `${sourceH1(article.source)} — фото ${figureCount}`;
        const figure = { caption: pendingCaption };
        pendingCaption = "";
        const dimAttrs = width && height ? ` width="${escapeHtml(width)}" height="${escapeHtml(height)}"` : "";
        const htmlFigure = () => `<figure class="article-figure">
  <button class="figure-button" type="button" data-lightbox-src="${escapeHtml(mapped.src)}" data-lightbox-caption="${escapeHtml(figure.caption)}">
    <img src="${escapeHtml(mapped.src)}" alt="${escapeHtml(alt)}" loading="lazy"${dimAttrs}>
  </button>${figure.caption ? `
  <figcaption>${figure.caption}</figcaption>` : ""}
</figure>`;
        parts.push(figure);
        figure.toString = htmlFigure;
        lastFigure = figure;
      }
      cursor = imgRegex.lastIndex;
      sawImage = true;
    }

    const after = html.slice(cursor);
    const text = inlineHtml(after);
    if (text) {
      if (isCaption(text) && lastFigure) {
        if (!lastFigure.caption) {
          lastFigure.caption = text;
        } else {
          pendingCaption = text;
        }
      } else if (!sawImage || text.length > 3) {
        const strong = /<(strong|b)\b/i.test(html) && /^—/.test(text);
        parts.push(strong ? `<p><strong>${text}</strong></p>` : `<p>${text}</p>`);
      }
    }
  }

  return parts.map(String).join("\n\n");
}

function rubricFor(id) {
  return rubrics.find((rubric) => rubric.id === id);
}

const imageMaps = new Map();
for (const article of articleSources) {
  imageMaps.set(article.slug, imageMap(article));
}

const articles = articleSources.map((article) => {
  const title = sourceH1(article.source);
  const rubric = rubricFor(article.rubricId);
  const cover = firstImageTarget(article, imageMaps.get(article.slug));
  return {
    slug: article.slug,
    title,
    rubricId: article.rubricId,
    rubricLabel: rubric.label,
    excerpt: article.excerpt,
    cover,
    coverAlt: article.coverAlt,
    href: `articles/${article.slug}.html`,
    description: article.description,
  };
});

function articleCard(article, prefix = "") {
  return `<a class="article-card" href="${prefix}${article.href}" data-rubric="${article.rubricId}">
  <span class="card-media"><img src="${prefix}${article.cover}" alt="${escapeHtml(article.coverAlt)}" loading="lazy" width="640" height="426"></span>
  <span class="chip">${article.rubricLabel}</span>
  <h3>${escapeHtml(article.title)}</h3>
  <p>${escapeHtml(article.excerpt)}</p>
</a>`;
}

function logo(prefix = "") {
  return `<a class="brand" href="${prefix}index.html" aria-label="Котопес — Домашня сторінка">
  <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M24 26c6.2 0 11 4.1 11 9.2 0 4.1-3.2 6.8-7.4 5.4-1.7-.6-2.5-1-3.6-1s-1.9.4-3.6 1C16.2 42 13 39.3 13 35.2 13 30.1 17.8 26 24 26Zm-12.2-7.2c2.5-.8 5.4 1.4 6.3 4.9.9 3.5-.5 6.9-3 7.6-2.6.7-5.4-1.5-6.3-5-.9-3.4.4-6.8 3-7.5Zm24.4 0c2.6.7 3.9 4.1 3 7.5-.9 3.5-3.7 5.7-6.3 5-2.5-.7-3.9-4.1-3-7.6.9-3.5 3.8-5.7 6.3-4.9ZM19.5 7c2.8-.2 5.2 2.7 5.4 6.5.2 3.7-1.9 6.9-4.7 7.1-2.8.1-5.2-2.8-5.4-6.5-.2-3.8 1.9-6.9 4.7-7.1Zm9 0c2.8.2 4.9 3.3 4.7 7.1-.2 3.7-2.6 6.6-5.4 6.5-2.8-.2-4.9-3.4-4.7-7.1.2-3.8 2.6-6.7 5.4-6.5Z"/></svg>
  <span>Котопес</span>
</a>`;
}

function header(current, prefix = "") {
  const item = (id, href, label) => `<a ${current === id ? 'aria-current="page"' : ""} href="${prefix}${href}">${label}</a>`;
  const rubricLinks = rubrics.map((rubric) => `<a href="${prefix}materials.html?rubric=${rubric.id}">${rubric.label}</a>`).join("");
  const navLinks = `${item("home", "index.html", "Домашня сторінка")}
${item("materials", "materials.html", "Усі матеріали")}
<details class="rubric-menu" data-disclosure>
  <summary ${current === "rubrics" ? 'aria-current="page"' : ""}>Рубрики</summary>
  <div class="dropdown" role="menu" aria-label="Рубрики">${rubricLinks}</div>
</details>
${item("help", "help.html", "Допомога притулкам")}
${item("about", "about.html", "Про нас")}`;
  return `<a class="skip-link" href="#main">Перейти до змісту</a>
<header class="site-header">
  <div class="header-inner">
    ${logo(prefix)}
    <nav class="desktop-nav" aria-label="Головна навігація">${navLinks}</nav>
    <details class="mobile-nav" data-disclosure>
      <summary aria-label="Відкрити меню"><span></span><span></span><span></span></summary>
      <nav aria-label="Мобільна навігація">${navLinks}</nav>
    </details>
  </div>
</header>`;
}

function footer(prefix = "") {
  return `<footer class="site-footer">
  <div class="footer-inner">
    ${logo(prefix)}
    <nav aria-label="Навігація внизу сторінки">
      <a href="${prefix}materials.html">Усі матеріали</a>
      <a href="${prefix}help.html">Допомога притулкам</a>
      <a href="${prefix}about.html">Про нас</a>
    </nav>
    <p><a href="${prefix}help.html">Підтримайте притулки</a> та тих, хто щодня рятує тварин.</p>
    <p class="project-line">Журналістський дипломний проєкт «Котопес» · 2026</p>
  </div>
</footer>`;
}

const siteBase = "https://kirea.github.io/kotopes/";

function head({ title, description, image = "assets/img/home/hero-rescue.webp", type = "website", prefix = "", canonical = "index.html" }) {
  const canonicalUrl = new URL(canonical, siteBase).href;
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${canonicalUrl}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:type" content="${type}">
<meta property="og:locale" content="uk_UA">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:image" content="${prefix}${image}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${prefix}${image}">
<link rel="icon" href="${prefix}assets/icons/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${prefix}assets/icons/favicon.svg">
<link rel="manifest" href="${prefix}manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:wght@500;600;700&display=swap&subset=cyrillic" rel="stylesheet">
<link rel="stylesheet" href="${prefix}assets/css/styles.css">`;
}

function page({ current, title, description, main, scripts = "", prefix = "", type = "website", image, canonical }) {
  return `<!doctype html>
<html lang="uk">
<head>
${head({ title, description, prefix, type, image, canonical })}
</head>
<body>
${header(current, prefix)}
<main id="main">
${main}
</main>
${footer(prefix)}
<script src="${prefix}assets/js/nav.js" type="module"></script>
${scripts}
</body>
</html>`;
}

const home = homeContent();
const about = aboutContent();

const featured = articles.slice(0, 4).map((article) => articleCard(article)).join("\n");
const allCards = articles.map((article) => articleCard(article)).join("\n");

write("index.html", page({
  current: "home",
  canonical: "index.html",
  title: "Котопес — Своїх не кидають",
  description: "Документальні матеріали про тварин під час війни, порятунок, втрати, екоцид і людей, які не залишають своїх.",
  main: `<section class="hero">
  <div class="hero-content reveal">
    <p class="eyebrow">Документальний проєкт</p>
    <h1>${escapeHtml(home.title)}</h1>
    <p class="hero-subtitle">${escapeHtml(home.subtitle)}</p>
    <p>${escapeHtml(home.intro)}</p>
    <a class="button primary" href="materials.html">Усі матеріали</a>
  </div>
</section>

<section class="section">
  <div class="section-heading">
    <p class="eyebrow">Вибір редакції</p>
    <h2>Рекомендовані матеріали</h2>
  </div>
  <div class="article-grid featured-grid" data-featured-grid>${featured}</div>
</section>

<section class="section band">
  <div class="section-heading">
    <p class="eyebrow">Навігація за темами</p>
    <h2>Рубрики</h2>
  </div>
  <div class="rubric-grid">
    ${rubrics.map((rubric) => `<a class="rubric-tile" href="materials.html?rubric=${rubric.id}">
      <span>${rubric.label}</span>
      <strong>${rubric.count}</strong>
    </a>`).join("\n")}
  </div>
</section>

<section class="cta-band">
  <div>
    <p class="eyebrow">Підтримка</p>
    <h2>Допомога притулкам</h2>
    <p>Кілька надійних напрямів, де можна підтримати тварин і людей, які ними опікуються.</p>
  </div>
  <a class="button light" href="help.html">Перейти до допомоги</a>
</section>

<section class="section about-teaser">
  <div>
    <p class="eyebrow">Про проєкт</p>
    <h2>Журналістика, що бачить ширший контекст війни</h2>
    <p>${escapeHtml(about.lead)} ${escapeHtml(about.rest)}</p>
  </div>
  <a class="button secondary" href="about.html">Про нас</a>
</section>`,
  scripts: `<script src="assets/js/listing.js" type="module"></script>`,
}));

write("materials.html", page({
  current: "materials",
  canonical: "materials.html",
  title: "Усі матеріали — Котопес",
  description: "Усі пʼять матеріалів про тварин під час війни: репортаж, інтервʼю, портретні нариси та огляди.",
  main: `<section class="page-hero compact">
  <p class="eyebrow">Архів</p>
  <h1 data-listing-title>Усі матеріали</h1>
  <p data-listing-note>Пʼять історій у чотирьох рубриках. Оберіть матеріал або відкрийте рубрику з меню.</p>
  <a class="reset-link" href="materials.html" data-reset-link hidden>← Усі матеріали</a>
</section>
<section class="section">
  <div class="article-grid" data-article-grid>${allCards}</div>
</section>`,
  scripts: `<script src="assets/js/listing.js" type="module"></script>`,
}));

write("help.html", page({
  current: "help",
  canonical: "help.html",
  title: "Допомога притулкам — Котопес",
  description: "Посилання на організації, які допомагають тваринам, притулкам і волонтерам.",
  main: `<section class="page-hero compact">
  <p class="eyebrow">Підтримка</p>
  <h1>Допомога притулкам</h1>
  <p>Три зовнішні ресурси, де можна дізнатися більше про допомогу тваринам і підтримати відповідні ініціативи.</p>
</section>
<section class="section help-grid">
  ${helpOrgs.map((org) => `<article class="help-card">
    <h2>${escapeHtml(org.name)}</h2>
    <p>${escapeHtml(org.blurb)}</p>
    <a class="button primary" href="${org.url}" target="_blank" rel="noopener noreferrer">Перейти на сайт ↗</a>
  </article>`).join("\n")}
</section>`,
}));

write("about.html", page({
  current: "about",
  canonical: "about.html",
  title: "Про нас — Котопес",
  description: "Місія документального проєкту «Котопес» про тварин, людей і гуманітарний вимір війни.",
  main: `<section class="mission">
  <p class="eyebrow">Місія</p>
  <h1>Про нас</h1>
  <div class="mission-text">
    <p><strong>${escapeHtml(about.lead)}</strong> ${escapeHtml(about.rest)}</p>
    <blockquote>${escapeHtml(about.pull)}</blockquote>
  </div>
</section>
<section class="cta-band">
  <div>
    <p class="eyebrow">Дія</p>
    <h2>Допомога притулкам</h2>
    <p>Підтримайте тих, хто щодня лікує, годує, евакуює й прилаштовує тварин.</p>
  </div>
  <a class="button light" href="help.html">Допомогти</a>
</section>`,
}));

write("404.html", page({
  current: "",
  canonical: "404.html",
  title: "Сторінку не знайдено — Котопес",
  description: "Сторінку не знайдено. Поверніться на головну або відкрийте всі матеріали проєкту «Котопес».",
  main: `<section class="not-found">
  <div class="paw-large" aria-hidden="true">${logo()}</div>
  <h1>Сторінку не знайдено</h1>
  <p>Можливо, матеріал переїхав або посилання містить помилку.</p>
  <div class="button-row">
    <a class="button primary" href="index.html">Домашня сторінка</a>
    <a class="button secondary" href="materials.html">Усі матеріали</a>
  </div>
</section>`,
}));

for (const articleSource of articleSources) {
  const article = articles.find((item) => item.slug === articleSource.slug);
  const map = imageMaps.get(article.slug);
  const body = convertArticle(articleSource, map);
  const sameRubric = articles.filter((item) => item.rubricId === article.rubricId && item.slug !== article.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    image: `../${article.cover}`,
    articleSection: article.rubricLabel,
    inLanguage: "uk",
  };
  write(`articles/${article.slug}.html`, page({
    current: "rubrics",
    prefix: "../",
    type: "article",
    canonical: `articles/${article.slug}.html`,
    title: `${article.title} — Котопес`,
    description: article.description,
    image: article.cover,
    main: `<article class="article-shell">
  <header class="article-header">
    <a class="back-link" href="../materials.html">← Назад до матеріалів</a>
    <p class="chip">${article.rubricLabel}</p>
    <h1>${escapeHtml(article.title)}</h1>
    <p class="article-lead">${escapeHtml(article.excerpt)}</p>
  </header>
  <div class="article-body">
${body}
  </div>
  <footer class="article-foot">
    <a class="button secondary" href="../materials.html">Назад до матеріалів</a>
    ${sameRubric.length ? `<div class="related"><p class="eyebrow">Ще у рубриці</p>${sameRubric.map((item) => `<a href="../${item.href}">${escapeHtml(item.title)}</a>`).join("")}</div>` : ""}
  </footer>
</article>
<dialog class="lightbox" data-lightbox>
  <button class="lightbox-close" type="button" data-lightbox-close aria-label="Закрити">×</button>
  <img alt="" data-lightbox-image>
  <p data-lightbox-caption></p>
</dialog>
<script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>`,
    scripts: `<script src="../assets/js/lightbox.js" type="module"></script>`,
  }));
}

write("assets/js/articles.js", `export const RUBRICS = ${JSON.stringify(rubrics.map(({ id, label }) => ({ id, label })), null, 2)};

export const ARTICLES = ${JSON.stringify(articles.map(({ slug, title, rubricId, rubricLabel, excerpt, cover, coverAlt, href }) => ({
  slug,
  title,
  rubricId,
  rubricLabel,
  excerpt,
  cover,
  coverAlt,
  href,
})), null, 2)};`);

write("assets/js/listing.js", `import { ARTICLES, RUBRICS } from "./articles.js";

const rubricLabel = new Map(RUBRICS.map((rubric) => [rubric.id, rubric.label]));

function card(article) {
  return \`<a class="article-card" href="\${article.href}" data-rubric="\${article.rubricId}">
  <span class="card-media"><img src="\${article.cover}" alt="\${article.coverAlt}" loading="lazy" width="640" height="426"></span>
  <span class="chip">\${article.rubricLabel}</span>
  <h3>\${article.title}</h3>
  <p>\${article.excerpt}</p>
</a>\`;
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
  if (note) note.textContent = validRubric ? \`Матеріали рубрики «\${rubricLabel.get(validRubric)}».\` : "Пʼять історій у чотирьох рубриках. Оберіть матеріал або відкрийте рубрику з меню.";
  if (reset) reset.hidden = !validRubric;

  grid.innerHTML = visible.map(card).join("");
}`);

write("assets/js/nav.js", `const disclosures = document.querySelectorAll("[data-disclosure]");

for (const disclosure of disclosures) {
  const summary = disclosure.querySelector("summary");
  if (!summary) continue;
  summary.setAttribute("aria-expanded", disclosure.open ? "true" : "false");
  disclosure.addEventListener("toggle", () => {
    summary.setAttribute("aria-expanded", disclosure.open ? "true" : "false");
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  for (const disclosure of disclosures) {
    if (disclosure.open) {
      disclosure.open = false;
      disclosure.querySelector("summary")?.focus();
    }
  }
});

document.addEventListener("click", (event) => {
  for (const disclosure of disclosures) {
    if (disclosure.open && !disclosure.contains(event.target)) {
      disclosure.open = false;
    }
  }
});`);

write("assets/js/lightbox.js", `const dialog = document.querySelector("[data-lightbox]");
const image = document.querySelector("[data-lightbox-image]");
const caption = document.querySelector("[data-lightbox-caption]");
const close = document.querySelector("[data-lightbox-close]");
let trigger = null;

if (dialog && image && caption && close) {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lightbox-src]");
    if (!button) return;
    trigger = button;
    image.src = button.dataset.lightboxSrc;
    image.alt = button.querySelector("img")?.alt || "";
    caption.textContent = button.dataset.lightboxCaption || "";
    dialog.showModal();
    close.focus();
  });

  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    image.removeAttribute("src");
    trigger?.focus();
  });
}`);

write("assets/css/styles.css", `:root {
  color-scheme: light;
  --bg: #FBF6EC;
  --bg-alt: #F4E9D6;
  --surface: #FFFDF8;
  --ink: #2A2420;
  --ink-soft: #5C5248;
  --line: #E7DCC8;
  --teal: #2A6F6B;
  --teal-700: #1F5350;
  --teal-50: #E2EFEE;
  --amber: #E8A33D;
  --honey: #F2C14E;
  --ua-blue: #2B5BA8;
  --ua-yellow: #F2C14E;
  --container: 1180px;
  --radius-sm: 8px;
  --radius: 14px;
  --radius-lg: 24px;
  --shadow-1: 0 2px 8px rgba(42, 36, 32, .06);
  --shadow-2: 0 18px 40px rgba(42, 36, 32, .14);
  --font-serif: "Lora", Georgia, serif;
  --font-sans: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font: 400 1.0625rem/1.7 var(--font-sans);
  text-rendering: optimizeLegibility;
}
img { display: block; max-width: 100%; height: auto; }
a { color: var(--teal-700); text-decoration-thickness: .08em; text-underline-offset: .2em; }
a:hover { color: var(--teal); }
:focus-visible { outline: 3px solid var(--amber); outline-offset: 4px; }
.skip-link {
  position: fixed;
  left: 1rem;
  top: 1rem;
  z-index: 1000;
  transform: translateY(-150%);
  background: var(--ink);
  color: #fff;
  padding: .75rem 1rem;
  border-radius: var(--radius-sm);
}
.skip-link:focus { transform: translateY(0); }

.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(231, 220, 200, .9);
  background: color-mix(in srgb, var(--surface) 88%, transparent);
  backdrop-filter: blur(16px);
}
.header-inner,
.footer-inner,
.section,
.page-hero,
.mission,
.article-shell,
.not-found {
  width: min(var(--container), calc(100% - clamp(2rem, 6vw, 5rem)));
  margin-inline: auto;
}
.header-inner {
  min-height: 74px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: .65rem;
  color: var(--ink);
  font: 700 1.35rem/1 var(--font-serif);
  text-decoration: none;
}
.brand svg { width: 2.2rem; height: 2.2rem; fill: var(--teal); flex: none; }
.desktop-nav,
.mobile-nav nav {
  display: flex;
  align-items: center;
  gap: .25rem;
}
.desktop-nav a,
.desktop-nav summary,
.mobile-nav a,
.mobile-nav summary {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: .55rem .85rem;
  color: var(--ink);
  font-size: .95rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}
.desktop-nav a[aria-current="page"],
.desktop-nav summary[aria-current="page"],
.desktop-nav a:hover,
.desktop-nav summary:hover,
.mobile-nav a:hover,
.mobile-nav summary:hover {
  background: var(--teal-50);
  color: var(--teal-700);
}
.rubric-menu { position: relative; }
.rubric-menu summary { list-style: none; }
.rubric-menu summary::-webkit-details-marker,
.mobile-nav summary::-webkit-details-marker { display: none; }
.rubric-menu summary::after {
  content: "";
  width: .45rem;
  height: .45rem;
  flex: 0 0 auto;
  margin-left: .5rem;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateY(-.12em) rotate(45deg);
}
.dropdown {
  position: absolute;
  top: calc(100% + .35rem);
  right: 0;
  min-width: 14rem;
  display: grid;
  gap: .2rem;
  padding: .45rem;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow-2);
}
.dropdown a { justify-content: flex-start; }
.mobile-nav { display: none; position: relative; }
.mobile-nav > summary {
  width: 46px;
  height: 46px;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
  border: 1px solid var(--line);
  background: var(--surface);
}
.mobile-nav summary span {
  width: 20px;
  height: 2px;
  background: var(--ink);
  border-radius: 1px;
}
.mobile-nav nav {
  position: absolute;
  right: 0;
  top: calc(100% + .5rem);
  width: min(82vw, 22rem);
  align-items: stretch;
  display: grid;
  padding: .75rem;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow-2);
}
.mobile-nav .rubric-menu .dropdown {
  position: static;
  box-shadow: none;
  margin: .25rem 0 .5rem 1rem;
}

.hero {
  width: min(calc(100% - 2rem), 1360px);
  min-height: clamp(560px, 78vh, 780px);
  display: grid;
  align-items: center;
  margin: 1rem auto 0;
  padding: clamp(2rem, 6vw, 5rem);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(90deg, rgba(24, 32, 29, .86), rgba(31, 83, 80, .55) 42%, rgba(42, 36, 32, .05) 74%),
    url("../img/home/hero-rescue.webp") center / cover;
  color: #fff;
  overflow: hidden;
}
.hero-content { max-width: 45rem; }
.eyebrow {
  margin: 0 0 .7rem;
  color: var(--teal-700);
  font-size: .8rem;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.hero .eyebrow,
.cta-band .eyebrow { color: var(--honey); }
h1, h2, h3 {
  margin: 0;
  font-family: var(--font-serif);
  line-height: 1.14;
  letter-spacing: 0;
}
h1 { font-size: clamp(2.4rem, 5.5vw, 4.8rem); }
h2 { font-size: clamp(1.75rem, 3vw, 2.7rem); }
h3 { font-size: 1.24rem; }
.hero-subtitle {
  margin: .7rem 0 1.2rem;
  font-size: clamp(1.2rem, 2vw, 1.55rem);
  font-weight: 700;
}
.hero p:not(.eyebrow):not(.hero-subtitle) {
  max-width: 42rem;
  color: rgba(255, 255, 255, .9);
}
.button {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .45rem;
  border-radius: 999px;
  padding: .75rem 1.1rem;
  border: 1px solid transparent;
  font-weight: 800;
  text-decoration: none;
}
.button.primary { background: var(--teal-700); color: #fff; }
.button.secondary { border-color: var(--teal-700); color: var(--teal-700); background: transparent; }
.button.light { background: #fff; color: var(--teal-700); }
.button:hover { transform: translateY(-1px); box-shadow: var(--shadow-1); }

.section { padding: clamp(3.5rem, 8vw, 6rem) 0; }
.section.band {
  width: 100%;
  max-width: none;
  padding-inline: max(1rem, calc((100vw - var(--container)) / 2));
  background: linear-gradient(180deg, var(--bg-alt), transparent);
}
.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 1.25rem;
}
.article-card {
  position: relative;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: .8rem;
  min-height: 100%;
  padding: .8rem;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow-1);
  color: var(--ink);
  text-decoration: none;
  transition: transform .22s ease, box-shadow .22s ease;
}
.article-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-2); color: var(--ink); }
.card-media {
  aspect-ratio: 3 / 2;
  overflow: hidden;
  border-radius: 10px;
  background: var(--bg-alt);
}
.card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .35s ease;
}
.article-card:hover img { transform: scale(1.035); }
.chip {
  width: fit-content;
  border-radius: 999px;
  background: var(--teal-50);
  color: var(--teal-700);
  padding: .28rem .65rem;
  font-size: .82rem;
  font-weight: 800;
}
.article-card p {
  margin: 0;
  color: var(--ink-soft);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.rubric-grid,
.help-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr));
  gap: 1rem;
}
.rubric-tile,
.help-card {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow-1);
}
.rubric-tile {
  min-height: 150px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 1.25rem;
  color: var(--ink);
  text-decoration: none;
  background: linear-gradient(135deg, var(--surface), var(--teal-50));
}
.rubric-tile span { font-family: var(--font-serif); font-size: 1.35rem; font-weight: 700; }
.rubric-tile strong { color: var(--teal-700); font-size: 2.4rem; }
.cta-band {
  width: min(var(--container), calc(100% - clamp(2rem, 6vw, 5rem)));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin: clamp(2rem, 5vw, 4rem) auto;
  padding: clamp(1.5rem, 4vw, 3rem);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(135deg, rgba(242, 193, 78, .18), transparent 34%),
    var(--ua-blue);
  color: #fff;
}
.cta-band p { max-width: 42rem; color: rgba(255, 255, 255, .88); }
.about-teaser {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}
.about-teaser p { max-width: 66ch; color: var(--ink-soft); }
.page-hero {
  padding: clamp(3rem, 7vw, 5.5rem) 0 2rem;
}
.page-hero.compact h1 { max-width: 900px; }
.page-hero p:not(.eyebrow) { max-width: 760px; color: var(--ink-soft); }
.reset-link[hidden] { display: none; }
.help-card {
  display: grid;
  grid-template-rows: auto 1fr auto;
  align-content: start;
  gap: 1rem;
  padding: 1.25rem;
}
.help-card .button {
  align-self: end;
  justify-self: start;
}
.help-card p { color: var(--ink-soft); margin: 0; }
.mission {
  min-height: 60vh;
  display: grid;
  align-content: center;
  padding: clamp(3rem, 8vw, 7rem) 0;
}
.mission-text {
  max-width: 880px;
  padding: clamp(1.3rem, 4vw, 2.5rem);
  border-left: 5px solid var(--teal);
  background: linear-gradient(135deg, var(--surface), var(--bg-alt));
  border-radius: var(--radius-lg);
}
.mission-text p {
  margin-top: 0;
  font-size: clamp(1.25rem, 2.2vw, 1.8rem);
  line-height: 1.55;
}
blockquote {
  margin: 1.5rem 0 0;
  padding-left: 1rem;
  border-left: 3px solid var(--amber);
  color: var(--teal-700);
  font-family: var(--font-serif);
  font-size: clamp(1.2rem, 2vw, 1.6rem);
  font-style: italic;
}
.article-shell {
  max-width: 920px;
  padding: clamp(2rem, 6vw, 4rem) 0;
}
.article-header {
  display: grid;
  gap: .9rem;
  margin-bottom: clamp(2rem, 5vw, 3.5rem);
}
.back-link { width: fit-content; font-weight: 800; }
.article-lead { max-width: 68ch; color: var(--ink-soft); font-size: 1.18rem; }
.article-body {
  max-width: 68ch;
  margin-inline: auto;
}
.article-body p { margin: 0 0 1.25rem; }
.article-body h2 { margin: 2.3rem 0 1rem; color: var(--teal-700); }
.article-body a { font-weight: 700; }
.article-figure {
  margin: 2rem min(-8vw, -2rem);
}
.figure-button {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  border-radius: var(--radius);
  background: transparent;
  cursor: zoom-in;
  overflow: hidden;
}
.figure-button img {
  width: 100%;
  max-height: 720px;
  object-fit: contain;
  background: var(--bg-alt);
  border-radius: var(--radius);
}
figcaption {
  max-width: 68ch;
  margin: .6rem auto 0;
  color: var(--ink-soft);
  font-size: .92rem;
}
.article-foot {
  max-width: 68ch;
  display: grid;
  gap: 1.5rem;
  margin: 3rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid var(--line);
}
.related { display: grid; gap: .4rem; }
.lightbox {
  width: min(96vw, 1100px);
  border: 0;
  border-radius: var(--radius);
  padding: 1rem;
  background: var(--surface);
  box-shadow: var(--shadow-2);
}
.lightbox::backdrop { background: rgba(24, 22, 20, .72); }
.lightbox img {
  max-height: 78vh;
  margin-inline: auto;
  object-fit: contain;
}
.lightbox-close {
  position: absolute;
  right: .7rem;
  top: .7rem;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 999px;
  background: var(--ink);
  color: #fff;
  font-size: 1.6rem;
  cursor: pointer;
}
.not-found {
  min-height: 65vh;
  display: grid;
  place-items: center;
  align-content: center;
  text-align: center;
}
.paw-large .brand {
  pointer-events: none;
  justify-content: center;
  font-size: 1.8rem;
}
.button-row { display: flex; flex-wrap: wrap; gap: .75rem; justify-content: center; }
.site-footer {
  margin-top: 4rem;
  padding: 2.5rem 0;
  background: var(--bg-alt);
  border-top: 1px solid var(--line);
}
.footer-inner {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem 2rem;
  align-items: center;
}
.footer-inner nav { display: flex; flex-wrap: wrap; gap: 1rem; }
.footer-inner p { margin: 0; color: var(--ink-soft); }
.project-line { grid-column: 1 / -1; font-size: .92rem; }

@media (max-width: 900px) {
  .desktop-nav { display: none; }
  .mobile-nav { display: block; }
  .hero { min-height: 620px; background-position: 62% center; }
  .cta-band,
  .about-teaser,
  .section-heading { align-items: flex-start; flex-direction: column; }
  .footer-inner { grid-template-columns: 1fr; }
  .article-figure { margin-inline: 0; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: .001ms !important;
  }
  .article-card:hover,
  .button:hover,
  .article-card:hover img { transform: none; }
}`);

write("assets/icons/favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="12" fill="#FBF6EC"/>
  <path fill="#2A6F6B" d="M24 26c6.2 0 11 4.1 11 9.2 0 4.1-3.2 6.8-7.4 5.4-1.7-.6-2.5-1-3.6-1s-1.9.4-3.6 1C16.2 42 13 39.3 13 35.2 13 30.1 17.8 26 24 26Zm-12.2-7.2c2.5-.8 5.4 1.4 6.3 4.9.9 3.5-.5 6.9-3 7.6-2.6.7-5.4-1.5-6.3-5-.9-3.4.4-6.8 3-7.5Zm24.4 0c2.6.7 3.9 4.1 3 7.5-.9 3.5-3.7 5.7-6.3 5-2.5-.7-3.9-4.1-3-7.6.9-3.5 3.8-5.7 6.3-4.9ZM19.5 7c2.8-.2 5.2 2.7 5.4 6.5.2 3.7-1.9 6.9-4.7 7.1-2.8.1-5.2-2.8-5.4-6.5-.2-3.8 1.9-6.9 4.7-7.1Zm9 0c2.8.2 4.9 3.3 4.7 7.1-.2 3.7-2.6 6.6-5.4 6.5-2.8-.2-4.9-3.4-4.7-7.1.2-3.8 2.6-6.7 5.4-6.5Z"/>
</svg>`);

write("manifest.webmanifest", JSON.stringify({
  name: "Котопес",
  short_name: "Котопес",
  lang: "uk",
  start_url: "./index.html",
  display: "standalone",
  background_color: "#FBF6EC",
  theme_color: "#2A6F6B",
  icons: [
    { src: "assets/icons/favicon.svg", sizes: "any", type: "image/svg+xml" },
  ],
}, null, 2));

write("robots.txt", `User-agent: *
Allow: /

Sitemap: https://kirea.github.io/kotopes/sitemap.xml`);

const sitemapUrls = ["index.html", "materials.html", "help.html", "about.html", ...articles.map((article) => article.href)];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((url) => `  <url><loc>https://kirea.github.io/kotopes/${url}</loc></url>`).join("\n")}
</urlset>`);

write(".nojekyll", "");

ensureDir("assets/img/home");
const generatedRoot = path.join(os.homedir(), ".codex/generated_images");
if (existsSync(generatedRoot)) {
  const latest = readdirSync(generatedRoot)
    .map((dir) => path.join(generatedRoot, dir))
    .filter((dir) => existsSync(dir))
    .flatMap((dir) => readdirSync(dir).filter((file) => file.endsWith(".png")).map((file) => path.join(dir, file)))
    .sort()
    .at(-1);
  if (latest) {
    const webpTarget = abs("assets/img/home/hero-rescue.webp");
    try {
      execFileSync("cwebp", ["-quiet", "-q", "82", latest, "-o", webpTarget]);
    } catch {
      copyFileSync(latest, webpTarget);
    }
  }
}

console.log("Built static site files.");
