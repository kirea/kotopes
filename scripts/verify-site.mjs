import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const failures = [];

const requiredFiles = [
  ".nojekyll",
  "index.html",
  "materials.html",
  "help.html",
  "about.html",
  "404.html",
  "assets/css/styles.css",
  "assets/js/articles.js",
  "assets/js/listing.js",
  "assets/js/lightbox.js",
  "assets/icons/favicon.svg",
  "manifest.webmanifest",
  "sitemap.xml",
  "robots.txt",
];

const articles = [
  {
    slug: "oazys-posered-betonnyh-dzhungliv",
    source: "sources/Усі матеріали/художній репортаж/художній репортаж.html",
    html: "articles/oazys-posered-betonnyh-dzhungliv.html",
    imgDir: "assets/img/oazys",
    sourceImgDir: "sources/Усі матеріали/художній репортаж/художній репортаж.fld",
    rubricId: "reportazh",
  },
  {
    slug: "ponad-1000-vryatovanyh",
    source: "sources/Усі матеріали/інтервʼю/інтервʼю.html",
    html: "articles/ponad-1000-vryatovanyh.html",
    imgDir: "assets/img/ponad-1000",
    sourceImgDir: "sources/Усі матеріали/інтервʼю/інтервʼю.fld",
    rubricId: "interviu",
  },
  {
    slug: "lyubov-bez-kordoniv",
    source: "sources/Усі матеріали/портрети/портрети.html",
    html: "articles/lyubov-bez-kordoniv.html",
    imgDir: "assets/img/lyubov",
    sourceImgDir: "sources/Усі матеріали/портрети/портрети.fld",
    rubricId: "portrety",
  },
  {
    slug: "zlochyn-bez-pokarannya",
    source: "sources/Усі матеріали/екоцид/екоцид.html",
    html: "articles/zlochyn-bez-pokarannya.html",
    imgDir: "assets/img/zlochyn",
    sourceImgDir: "sources/Усі матеріали/екоцид/екоцид.fld",
    rubricId: "oglyady",
  },
  {
    slug: "hvosty-ta-lapy-na-sluzhbi",
    source: "sources/Усі матеріали/тварини в професії/тварини в професії.html",
    html: "articles/hvosty-ta-lapy-na-sluzhbi.html",
    imgDir: "assets/img/hvosty",
    sourceImgDir: "sources/Усі матеріали/тварини в професії/тварини в професії.fld",
    rubricId: "oglyady",
  },
];

function rel(file) {
  return path.join(root, file);
}

function read(file) {
  return readFileSync(rel(file), "utf8");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function normalizeText(value) {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, "\"")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/\s+/g, " ")
    .trim();
}

function sourceH1(file) {
  const html = read(file);
  const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return match ? normalizeText(match[1]) : "";
}

function sourceImageCount(dir) {
  return readdirSync(rel(dir)).filter((name) => /\.(jpe?g|png|webp)$/i.test(name)).length;
}

for (const file of requiredFiles) {
  assert(existsSync(rel(file)), `Missing required file: ${file}`);
}

for (const article of articles) {
  assert(existsSync(rel(article.html)), `Missing article page: ${article.html}`);
  assert(existsSync(rel(article.imgDir)), `Missing copied image dir: ${article.imgDir}`);
}

const htmlFiles = requiredFiles
  .filter((file) => file.endsWith(".html"))
  .concat(articles.map((article) => article.html))
  .filter((file) => existsSync(rel(file)));

for (const file of htmlFiles) {
  const html = read(file);
  assert(html.includes("<!doctype html>"), `${file} must use a modern doctype`);
  assert(html.includes('lang="uk"'), `${file} must declare Ukrainian language`);
  assert((html.match(/<h1\b/gi) || []).length === 1, `${file} must contain exactly one h1`);
  assert(/<header\b/i.test(html) && /<main\b/i.test(html) && /<footer\b/i.test(html), `${file} must include header/main/footer landmarks`);
  assert(/class="skip-link" href="#main"/i.test(html), `${file} must include a skip-to-content link`);
  assert(!/Mso|WordSection1|mso-|<o:p|panose|@font-face/i.test(html), `${file} contains Word-export artifacts`);
  assert(!/\s(?:href|src)=["']\/(?!\/)/i.test(html), `${file} contains a leading-slash relative URL`);
  assert(/<meta name="description"/i.test(html), `${file} missing meta description`);
  assert(/og:title/i.test(html), `${file} missing Open Graph tags`);
  assert(/<link rel="canonical"/i.test(html), `${file} missing canonical URL`);

  for (const img of html.match(/<img\b[^>]*>/gi) || []) {
    const hasDynamicLightboxAlt = /\bdata-lightbox-image\b/i.test(img);
    const altMatch = img.match(/\balt=["']([^"']*)["']/i);
    assert(hasDynamicLightboxAlt || Boolean(altMatch?.[1]?.trim()), `${file} contains an image without meaningful alt text: ${img}`);
  }

  for (const link of html.match(/<a\b[^>]*target=["']_blank["'][^>]*>/gi) || []) {
    assert(/\brel=["'][^"']*noopener[^"']*noreferrer[^"']*["']/i.test(link), `${file} target=_blank link must use rel="noopener noreferrer": ${link}`);
  }

  for (const button of html.match(/<button\b[\s\S]*?<\/button>/gi) || []) {
    const hasText = normalizeText(button).length > 0;
    const hasLabel = /\baria-label=["'][^"']+["']/i.test(button);
    const hasImageAlt = /<img\b[^>]*\balt=["'][^"']+["']/i.test(button);
    assert(hasText || hasLabel || hasImageAlt, `${file} contains an unlabeled button`);
  }
}

for (const article of articles) {
  if (!existsSync(rel(article.html))) continue;

  const html = read(article.html);
  const title = sourceH1(article.source);
  const copiedImages = existsSync(rel(article.imgDir))
    ? readdirSync(rel(article.imgDir)).filter((name) => /\.(jpe?g|png|webp)$/i.test(name))
    : [];
  const sourceImages = sourceImageCount(article.sourceImgDir);

  assert(html.includes(title), `${article.html} must contain source H1 verbatim: ${title}`);
  assert(copiedImages.length === sourceImages, `${article.imgDir} has ${copiedImages.length} images, expected ${sourceImages}`);
  assert((html.match(/<figure\b/gi) || []).length === sourceImages, `${article.html} must render ${sourceImages} figures`);
  assert((html.match(/data-lightbox-src=/gi) || []).length === sourceImages, `${article.html} must wire every figure to lightbox`);
  assert(html.includes('"@type": "Article"'), `${article.html} missing JSON-LD Article`);
  assert(!/datePublished|author/i.test(html), `${article.html} must not invent author/date metadata`);
}

if (existsSync(rel("assets/js/articles.js"))) {
  const moduleUrl = pathToFileURL(rel("assets/js/articles.js")).href;
  const { ARTICLES, RUBRICS } = await import(`${moduleUrl}?cache=${Date.now()}`);
  assert(Array.isArray(RUBRICS) && RUBRICS.length === 4, "RUBRICS must contain 4 entries");
  assert(Array.isArray(ARTICLES) && ARTICLES.length === 5, "ARTICLES must contain 5 entries");
  assert(ARTICLES.filter((article) => article.rubricId === "oglyady").length === 2, "oglyady must contain 2 articles");
  for (const article of ARTICLES || []) {
    assert(article.slug && article.title && article.rubricId && article.excerpt && article.cover && article.coverAlt && article.href, `Article record incomplete: ${JSON.stringify(article)}`);
    assert(!article.cover.startsWith("/"), `Article cover must be relative: ${article.cover}`);
    assert(!article.href.startsWith("/"), `Article href must be relative: ${article.href}`);
  }
}

if (existsSync(rel("help.html"))) {
  const help = read("help.html");
  assert(help.includes("https://en.hau.com.ua/"), "Help page missing HAU link");
  assert(help.includes("https://www.domivka.org.ua/"), "Help page missing Домівка link");
  assert(help.includes("https://happypaw.ua/"), "Help page must use clean Happy Paw URL");
  assert(!help.includes("gad_source"), "Help page must not keep ad-tracking params");
}

if (existsSync(rel("assets/css/styles.css"))) {
  const css = read("assets/css/styles.css");
  assert(css.includes("#2A6F6B") && css.includes("#FBF6EC"), "CSS must include Honey + teal tokens");
  assert(css.includes("prefers-reduced-motion"), "CSS must respect prefers-reduced-motion");
}

if (existsSync(rel("sitemap.xml"))) {
  const sitemap = read("sitemap.xml");
  for (const article of articles) {
    assert(sitemap.includes(article.html), `Sitemap missing ${article.html}`);
  }
}

for (const file of requiredFiles.concat(articles.map((article) => article.html))) {
  if (existsSync(rel(file)) && statSync(rel(file)).isFile()) {
    assert(statSync(rel(file)).size > 0, `${file} is empty`);
  }
}

if (failures.length) {
  console.error(`verify-site failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("verify-site passed");
