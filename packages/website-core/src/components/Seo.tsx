import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SubjectKey } from "@mahama/shared-types";
import type { ApiClient } from "@mahama/api-client";
import { resolveLocalized } from "@mahama/shared-types";

interface SeoProps {
  subject: SubjectKey;
  labels: Record<SubjectKey, { name: string; role: string; tagline: string} >;
  api: ApiClient;
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  type?: "website" | "article" | "profile";
}

function upsertMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  if (!href) return;
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function Seo({ subject, labels, api, title, description, image, path = "", type = "website" }: SeoProps) {
  const settings = useQuery({ queryKey: ["settings"], queryFn: () => api.getSettings() });
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => api.getProfile() });

  const fallback = labels[subject];
  const fullTitle = title
    ? `${title} · ${fallback.name}`
    : settings.data?.metaTitle ?? `${fallback.name} — ${fallback.role}`;
  const desc =
    description ?? settings.data?.metaDescription ?? resolveLocalized(profile.data?.bio).split("\n\n")[0] ?? fallback.tagline ?? "";
  const ogImage = image ?? settings.data?.metaImage ?? profile.data?.heroImageUrl ?? profile.data?.portraitUrl ?? "";
  const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : "";

  useEffect(() => {
    document.title = fullTitle;
    upsertMeta('meta[name="description"]', "name", "description", desc);
    upsertMeta('meta[property="og:type"]', "property", "og:type", type);
    upsertMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    upsertMeta('meta[property="og:description"]', "property", "og:description", desc);
    upsertMeta('meta[property="og:url"]', "property", "og:url", url);
    upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", fallback.name);
    upsertMeta('meta[property="og:locale"]', "property", "og:locale", "en_GH");
    if (ogImage) upsertMeta('meta[property="og:image"]', "property", "og:image", ogImage);
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", desc);
    if (ogImage) upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", ogImage);
    upsertCanonical(url);
  }, [fullTitle, desc, ogImage, url, type, fallback.name]);

  return null;
}
