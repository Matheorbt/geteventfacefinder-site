// render: the built site serves each article with the right language, canonical, reciprocal hreflang, JSON-LD,
// and lists it in the sitemap and the RSS feed. Run after `pnpm build`.
import { existsSync, readFileSync } from "node:fs";
import { SITE, readArticles, report, urlPath } from "./articles.mjs";

const errors = [];
const articles = readArticles().filter((article) => article.valid);
const sitemap = existsSync("dist/sitemap-0.xml") ? readFileSync("dist/sitemap-0.xml", "utf8") : "";
if (!sitemap) errors.push("dist/sitemap-0.xml missing: run pnpm build first.");
if (!existsSync("dist/robots.txt")) errors.push("dist/robots.txt missing.");

for (const article of articles) {
  const path = urlPath(article);
  const file = `dist${path}.html`;
  if (!existsSync(file)) {
    errors.push(`${file}: page not built.`);
    continue;
  }
  const html = readFileSync(file, "utf8");
  const url = `${SITE}${path}`;
  if (!html.includes(`<html lang="${article.locale}"`)) errors.push(`${file}: html lang is not ${article.locale}.`);
  if (!/<title>[^<]{10,}<\/title>/.test(html)) errors.push(`${file}: missing title.`);
  if (!/<meta name="description" content="[^"]{50,}"/.test(html)) errors.push(`${file}: missing description.`);
  if (!html.includes(`<link rel="canonical" href="${url}"`)) errors.push(`${file}: canonical is not ${url}.`);
  if (!/<main\b[\s\S]*<h1[^>]*>[\s\S]+<\/h1>[\s\S]*<\/main>/.test(html)) errors.push(`${file}: no H1 inside main.`);
  const siblings = articles.filter((other) => other.topic === article.topic);
  for (const other of siblings) {
    if (!html.includes(`<link rel="alternate" hreflang="${other.locale}" href="${SITE}${urlPath(other)}"`))
      errors.push(`${file}: hreflang ${other.locale} missing.`);
  }
  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  try {
    const graph = JSON.parse(ld ?? "")["@graph"] ?? [];
    if (!graph.some((node) => node["@type"] === "Article" && node.mainEntityOfPage === url)) errors.push(`${file}: Article JSON-LD missing.`);
  } catch {
    errors.push(`${file}: JSON-LD missing or invalid.`);
  }
  if (!sitemap.includes(`<loc>${url}</loc>`)) errors.push(`${url}: not in the sitemap.`);
  const rss = existsSync(`dist/${article.locale}/rss.xml`) ? readFileSync(`dist/${article.locale}/rss.xml`, "utf8") : "";
  if (!rss.includes(`<link>${url}</link>`)) errors.push(`${url}: not in the ${article.locale} RSS feed.`);
}
report("render", errors);
