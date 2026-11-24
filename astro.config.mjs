import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Pages are emitted as /path.html and served at /path (no trailing slash) by Cloudflare static assets.
export default defineConfig({
  site: "https://geteventfacefinder.com",
  trailingSlash: "never",
  build: { format: "file" },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/404"),
      i18n: { defaultLocale: "en", locales: { en: "en", fr: "fr" } },
    }),
  ],
});
