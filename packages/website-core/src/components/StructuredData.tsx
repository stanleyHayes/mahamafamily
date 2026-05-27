import type { ProfileDTO, NewsPostDTO, EventDTO } from "@mahama/shared-types";
import { resolveLocalized } from "@mahama/shared-types";

interface PersonSchemaProps {
  profile: ProfileDTO;
  baseUrl: string;
}

export function PersonSchema({ profile, baseUrl }: PersonSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: resolveLocalized(profile.fullName),
    jobTitle: resolveLocalized(profile.title),
    description: resolveLocalized(profile.bio)?.slice(0, 200),
    image: profile.portraitUrl || profile.heroImageUrl,
    url: baseUrl,
    sameAs: profile.socials?.map((s) => s.url).filter(Boolean),
    birthDate: profile.birthDate,
    birthPlace: profile.birthPlace
      ? { "@type": "Place", name: profile.birthPlace }
      : undefined,
    spouse: profile.spouse ? { "@type": "Person", name: profile.spouse } : undefined,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

interface OrganizationSchemaProps {
  profile: ProfileDTO;
  baseUrl: string;
}

export function OrganizationSchema({ profile, baseUrl }: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: `Office of ${resolveLocalized(profile.fullName)}`,
    url: baseUrl,
    logo: profile.portraitUrl || profile.heroImageUrl,
    sameAs: profile.socials?.map((s) => s.url).filter(Boolean),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

interface ArticleSchemaProps {
  post: NewsPostDTO;
  baseUrl: string;
  authorName: string;
}

export function ArticleSchema({ post, baseUrl, authorName }: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: resolveLocalized(post.title),
    description: resolveLocalized(post.excerpt),
    image: post.coverImageUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: `Office of ${authorName}`,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/favicon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/news/${post.slug}`,
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

interface EventSchemaProps {
  event: EventDTO;
  baseUrl: string;
}

export function EventSchema({ event, baseUrl }: EventSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: resolveLocalized(event.title),
    description: resolveLocalized(event.description),
    startDate: event.startsAt,
    endDate: event.endsAt,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city,
        addressCountry: "GH",
      },
    },
    image: event.imageUrl,
    url: `${baseUrl}/events`,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; path: string }>;
  baseUrl: string;
}

export function BreadcrumbSchema({ items, baseUrl }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.path}`,
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
