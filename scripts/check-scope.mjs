// content-scope: an automated pull request may only add or edit article files. Everything else (layout, config,
// workflows, this script) is out of scope and fails the check. On main, it validates file placement only.
import { execFileSync } from "node:child_process";
import { ARTICLE_PATH, readArticles, report } from "./articles.mjs";

const errors = [];
const base = process.env.SEARCH_LOOP_BASE;
if (process.env.GITHUB_EVENT_NAME === "pull_request" || base) {
  const ref = base || "origin/main";
  const changes = execFileSync("git", ["diff", "--name-status", "--no-renames", `${ref}...HEAD`], { encoding: "utf8" })
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split("\t"));
  if (!changes.length) errors.push("The pull request changes no file.");
  for (const [status, path] of changes) {
    if (!ARTICLE_PATH.test(path)) errors.push(`${path}: outside the allowed article paths (src/content/blog/{topic}/{en|fr}.md).`);
    else if (status === "D") errors.push(`${path}: deleting an article is not allowed in an automated change.`);
  }
  if (changes.length > 4) errors.push(`${changes.length} files changed; an automated change may touch at most 4 article files.`);
}
for (const article of readArticles()) if (!article.valid) errors.push(`${article.path}: misplaced file in the article folder.`);
report("content-scope", errors);
