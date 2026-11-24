import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// One article = one folder: src/content/blog/{topic}/{locale}.md. The topic is the URL slug in every language;
// the locale comes from the file name, so an article never declares its language twice.
const blog = defineCollection({
  loader: glob({ pattern: "*/{en,fr}.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string().min(10).max(70),
    description: z.string().min(50).max(170),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
  }),
});

export const collections = { blog };
