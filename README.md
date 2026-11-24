# geteventfacefinder.com — Grow Mentions test site

A small, honest test site: practical guides for event organisers in English and French, used to exercise the
Grow Mentions automatic publication loop end to end (observe, plan, draft, pull request, checks, preview, publish,
verify live). It is not the Event Face Finder product site. Mistakes here are acceptable.

## Structure

- Articles: `src/content/blog/{topic}/{locale}.md` (`en`, `fr`). The topic is the URL slug in both languages.
- Front matter: `title` (10–70 chars), `description` (50–170), `publishedAt`, optional `updatedAt`. No H1 in the body.
- Pages: `/`, `/fr`, `/{locale}/blog`, `/{locale}/blog/{topic}`, `/{locale}/rss.xml`, `/sitemap-index.xml`, `/robots.txt`.

## Checks (`.github/workflows/ci.yml`)

| Check | What it proves |
| --- | --- |
| `build` | The site builds. |
| `content-scope` | A pull request only adds or edits `src/content/blog/{topic}/{en,fr}.md` (max 4 files, no deletion). |
| `seo` | Front matter limits, body length, internal links that resolve and stay in the article language. |
| `render` | Each built article has its `lang`, canonical, reciprocal hreflang, Article JSON-LD, sitemap and RSS entry. |
| `preview` | Uploads the pull request head as a Worker version aliased `p<sha8>` (noindex header). |
| `deploy` | Deploys `main` to production. |

Preview: `https://p<sha8>-geteventfacefinder-site.matheo-rbt-pro-cloudfaire.workers.dev/<path>`.

Hosting: Cloudflare Worker with static assets (`wrangler.jsonc`), free plan. Never use `wrangler pages` here.
The CI needs the `CLOUDFLARE_API_TOKEN` secret (Workers Scripts: Edit on this account only).

## Local

```bash
pnpm install
pnpm build && pnpm check:seo && pnpm check:render
```
