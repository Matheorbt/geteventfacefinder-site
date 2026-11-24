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

/** Visual identity of each guide. A guide added later (by hand or by Grow Mentions) falls back to the default. */
export const topicStyle: Record<string, { icon: keyof typeof ICONS; tone: "coral" | "teal" | "gold" | "plum" }> = {
  "event-photographer-brief": { icon: "camera", tone: "coral" },
  "photo-consent-at-events": { icon: "shield", tone: "teal" },
  "event-day-checklist": { icon: "checklist", tone: "gold" },
  "guest-welcome-desk": { icon: "badge", tone: "plum" },
};
export const styleFor = (topic: string) => topicStyle[topic] ?? { icon: "note" as const, tone: "teal" as const };

// 24×24 stroke icons (paths only; the component draws the frame).
export const ICONS = {
  camera: "M4 8h3l2-3h6l2 3h3v11H4z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  shield: "M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z M9 12l2 2 4-4",
  checklist: "M9 6h11 M9 12h11 M9 18h11 M4 6l1 1 2-2 M4 12l1 1 2-2 M4 18l1 1 2-2",
  badge: "M7 3h10v18H7z M10 3v3h4V3 M9.5 12.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0 M9 18h6",
  note: "M6 3h9l3 3v15H6z M9 10h6 M9 14h6 M9 18h4",
} as const;

export function readingMinutes(body: string | undefined) {
  const words = (body ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 200));
}

export const ui = {
  en: { minutes: (n: number) => `${n} min read`, related: "Keep reading", heroKicker: "Free guides · English & French", heroTitle: "Run your next event without the last-minute scramble", heroText: "Short, practical guides for organisers of conferences, weddings and community events. Printable checklists, templates and the questions to settle before the day.", heroCta: "Browse the guides", aboutTitle: "About this site", aboutText: "This is a test site. The team behind Grow Mentions, an SEO automation tool, uses it to try automatic article publication from start to finish. New guides may be written or updated by that system. It is not the Event Face Finder product site.", latest: "Latest guides", home: "Home", checklistDemo: ["Venue confirmed in writing", "Photographer briefed", "Opt-out lanyards ordered", "Welcome desk staffed"], checklistTitle: "Day-before check" },
  fr: { minutes: (n: number) => `${n} min de lecture`, related: "À lire ensuite", heroKicker: "Guides gratuits · français & anglais", heroTitle: "Organisez votre prochain événement sans course de dernière minute", heroText: "Des guides courts et concrets pour organiser conférences, mariages et événements associatifs. Check-lists imprimables, modèles et les questions à régler avant le jour J.", heroCta: "Voir les guides", aboutTitle: "À propos de ce site", aboutText: "Ceci est un site de test. L’équipe de Grow Mentions, un outil d’automatisation SEO, l’utilise pour essayer la publication automatique d’articles de bout en bout. De nouveaux guides peuvent être rédigés ou mis à jour par ce système. Ce n’est pas le site du produit Event Face Finder.", latest: "Derniers guides", home: "Accueil", checklistDemo: ["Lieu confirmé par écrit", "Photographe briefé", "Tours de cou « sans photo » commandés", "Accueil staffé"], checklistTitle: "Vérification de la veille" },
};

/** French typography for display text: a non-breaking space before : ; ! ? » and after «, so they never start a line. */
export const typo = (text: string, locale: Locale) =>
  locale === "fr" ? text.replace(/ ([:;!?»])/g, "\u00a0$1").replace(/« /g, "«\u00a0") : text;
