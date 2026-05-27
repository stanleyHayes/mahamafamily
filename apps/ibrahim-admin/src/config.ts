import { ApiClient } from "@mahama/api-client";
import type { SubjectKey } from "@mahama/shared-types";

export const SUBJECT: SubjectKey = (import.meta.env.VITE_SUBJECT as SubjectKey) ?? "ibrahim";

const TOKEN_KEY = "mahama_admin_token";
const REFRESH_KEY = "mahama_admin_refresh";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
  refreshGet: () => localStorage.getItem(REFRESH_KEY),
  refreshSet: (t: string) => localStorage.setItem(REFRESH_KEY, t),
};

export const api = new ApiClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4001",
  getToken: () => tokenStore.get(),
  onUnauthorized: () => {
    tokenStore.clear();
    if (location.pathname !== "/login") location.href = "/login";
  },
});
