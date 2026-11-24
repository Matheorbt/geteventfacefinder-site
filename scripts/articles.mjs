// Shared reader for the content checks. An article lives at src/content/blog/{topic}/{locale}.md.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export const SITE = "https://geteventfacefinder.com";
export const LOCALES = ["en", "fr"];
export const ROOT = "src/content/blog";
export const ARTICLE_PATH = /^src\/content\/blog\/([a-z0-9]+(?:-[a-z0-9]+)*)\/(en|fr)\.md$/;

function value(raw) {
  const text = raw.trim();
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    return text.startsWith('"') ? JSON.parse(text) : text.slice(1, -1).replaceAll("''", "'");
  }
  return text;
}

export function parse(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: null, body: source };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (field) data[field[1]] = value(field[2]);
  }
  return { data, body: match[2] };
}

export function readArticles() {
  if (!existsSync(ROOT)) return [];
  return readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((dir) =>
      readdirSync(join(ROOT, dir.name)).map((file) => {
        const path = `${ROOT}/${dir.name}/${file}`;
        const found = path.match(ARTICLE_PATH);
        return { path, topic: found?.[1] ?? dir.name, locale: found?.[2] ?? null, valid: Boolean(found), ...parse(readFileSync(path, "utf8")) };
      }),
    );
}

export const urlPath = (article) => `/${article.locale}/blog/${article.topic}`;

export function report(name, errors, warnings = []) {
  for (const warning of warnings) console.log(`::warning::${warning}`);
  for (const error of errors) console.log(`::error::${error}`);
  if (errors.length) {
    console.error(`${name}: ${errors.length} problem(s).`);
    process.exit(1);
  }
  console.log(`${name}: ok.`);
}
