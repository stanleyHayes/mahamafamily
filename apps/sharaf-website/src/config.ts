import { ApiClient } from "@mahama/api-client";
import type { SubjectKey } from "@mahama/shared-types";

const SUBJECT_KEY = (import.meta.env.VITE_SUBJECT as SubjectKey) ?? "ibrahim";
export const SUBJECT: SubjectKey = SUBJECT_KEY;

export const api = new ApiClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4001",
});

export const SUBJECT_LABELS: Record<SubjectKey, { name: string; role: string; tagline: string }> = {
  ibrahim: {
    name: "Ibrahim Mahama",
    role: "Industrialist · Founder, Engineers & Planners",
    tagline: "Ad astra per aspera — to the sky through thick and thin.",
  },
  john: {
    name: "John Dramani Mahama",
    role: "President of the Republic of Ghana",
    tagline: "Reset Ghana — the work begins immediately.",
  },
  sharaf: {
    name: "Sharaf Mahama",
    role: "Sports Entrepreneur · Boxing Promoter",
    tagline: "African fighters on the global stage. Ghana is ready.",
  },
  lordina: {
    name: "Lordina Mahama",
    role: "First Lady of Ghana · Founder, the Lordina Foundation",
    tagline: "The more we share, the more we have.",
  },
};
