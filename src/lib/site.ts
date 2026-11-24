import { getCollection, type CollectionEntry } from "astro:content";

export const SITE = "https://geteventfacefinder.com";
export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const homePath = (locale: Locale) => (locale === "en" ? "/" : "/fr");
export const blogPath = (locale: Locale) => `/${locale}/blog`;
export const articlePath = (locale: Locale, topic: string) => `/${locale}/blog/${topic}`;
export const absolute = (path: string) => `${SITE}${path}`;

export const t = {
  en: {
    siteName: "Event organiser guide",
    tagline: "Practical checklists for people who run conferences, weddings and community events.",
    blog: "Guides",
    allGuides: "All guides",
    readGuide: "Read the guide",
    published: "Published",
    updated: "Updated",
    switchTo: "Français",
    notice:
      "Test site. This guide is run by the team behind Grow Mentions to test automatic article publication. Articles may be added or edited by that system. It is not the Event Face Finder product site.",
    homeTitle: "Event organiser guide: practical checklists",
    homeDescription:
      "Free, practical guides for event organisers: photographer briefs, photo consent, guest welcome and day-of checklists.",
    blogTitle: "Guides for event organisers",
    blogDescription: "Every guide on planning, photographing and running an event, in plain language.",
    rss: "RSS feed",
  },
  fr: {
    siteName: "Guide de l’organisateur",
    tagline: "Des check-lists concrètes pour organiser conférences, mariages et événements associatifs.",
    blog: "Guides",
    allGuides: "Tous les guides",
    readGuide: "Lire le guide",
    published: "Publié le",
    updated: "Mis à jour le",
    switchTo: "English",
    notice:
      "Site de test. Ce guide est géré par l’équipe de Grow Mentions pour tester la publication automatique d’articles. Des articles peuvent être ajoutés ou modifiés par ce système. Ce n’est pas le site du produit Event Face Finder.",
    homeTitle: "Guide de l’organisateur : check-lists d’événement",
    homeDescription:
      "Guides gratuits pour organisateurs d’événements : brief photographe, droit à l’image, accueil des invités et check-list du jour J.",
    blogTitle: "Guides pour organisateurs d’événements",
    blogDescription: "Tous les guides pour préparer, photographier et animer un événement, sans jargon.",
    rss: "Flux RSS",
  },
} satisfies Record<Locale, Record<string, string>>;

export type Article = CollectionEntry<"blog"> & { topic: string; locale: Locale };

export async function articles(locale?: Locale): Promise<Article[]> {
  const entries = await getCollection("blog");
  return entries
    .map((entry) => {
      const [topic, locale] = entry.id.split("/") as [string, Locale];
      return Object.assign(entry, { topic, locale });
    })
    .filter((entry) => !locale || entry.locale === locale)
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export const formatDate = (date: Date, locale: Locale) =>
  date.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", { year: "numeric", month: "long", day: "numeric" });

export const isoDate = (date: Date) => date.toISOString().slice(0, 10);
