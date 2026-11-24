import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { articlePath, articles, LOCALES, t, type Locale } from "../../lib/site";

export function getStaticPaths() {
  return LOCALES.map((lang) => ({ params: { lang } }));
}

export async function GET(context: APIContext) {
  const locale = context.params.lang as Locale;
  const strings = t[locale];
  return rss({
    title: strings.siteName,
    description: strings.blogDescription,
    site: context.site!,
    trailingSlash: false,
    customData: `<language>${locale}</language>`,
    items: (await articles(locale)).map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.publishedAt,
      link: articlePath(locale, entry.topic),
    })),
  });
}
