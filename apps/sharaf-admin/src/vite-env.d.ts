/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SUBJECT: "ibrahim" | "john" | "sharaf";
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
