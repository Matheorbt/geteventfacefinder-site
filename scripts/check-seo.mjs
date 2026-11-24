// seo: every article has usable metadata, a body worth publishing and internal links that resolve.
import { LOCALES, readArticles, report, urlPath } from "./articles.mjs";

const errors = [];
const warnings = [];
const articles = readArticles().filter((article) => article.valid);
const known = new Set(articles.map(urlPath));

for (const article of articles) {
  const { path, data, body } = article;
  if (!data) {
    errors.push(`${path}: missing front matter.`);
    continue;
  }
  const title = data.title ?? "";
  const description = data.description ?? "";
  if (title.length < 10 || title.length > 70) errors.push(`${path}: title must be 10–70 characters (${title.length}).`);
  if (description.length < 50 || description.length > 170) errors.push(`${path}: description must be 50–170 characters (${description.length}).`);
  for (const field of ["publishedAt", "updatedAt"]) {
    if (data[field] !== undefined && Number.isNaN(Date.parse(data[field]))) errors.push(`${path}: ${field} is not a date.`);
  }
  if (!data.publishedAt) errors.push(`${path}: publishedAt is required.`);
  const unknown = Object.keys(data).filter((key) => !["title", "description", "publishedAt", "updatedAt"].includes(key));
  if (unknown.length) errors.push(`${path}: unknown front matter field(s): ${unknown.join(", ")}.`);
  if (/^#\s/m.test(body)) errors.push(`${path}: the body must not contain a level-1 heading; the page title is the H1.`);
  const words = body.replace(/[#*_`>|[\]()-]/g, " ").split(/\s+/).filter(Boolean).length;
  if (words < 250) errors.push(`${path}: body too short (${words} words, minimum 250).`);
  if (!/^##\s/m.test(body)) warnings.push(`${path}: no level-2 heading.`);
  for (const [, href] of body.matchAll(/\]\((\/[^)\s#]*)/g)) {
    const target = href.replace(/\/$/, "");
    if (/^\/(en|fr)\/blog\//.test(target) && !known.has(target)) errors.push(`${path}: internal link ${href} points to no article.`);
    if (/^\/(en|fr)\//.test(target) && !target.startsWith(`/${article.locale}/`)) errors.push(`${path}: internal link ${href} leaves the article language.`);
  }
}
const topics = new Set(articles.map((article) => article.topic));
for (const topic of topics) {
  const missing = LOCALES.filter((locale) => !articles.some((article) => article.topic === topic && article.locale === locale));
  if (missing.length) warnings.push(`${topic}: no ${missing.join(", ")} version yet.`);
}
report("seo", errors, warnings);
