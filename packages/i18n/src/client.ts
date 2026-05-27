import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next, useTranslation as useT } from "react-i18next";

import en from "./locales/en.json";
import tw from "./locales/tw.json";
import ha from "./locales/ha.json";
import ee from "./locales/ee.json";
import fr from "./locales/fr.json";

let initialized = false;

export function initI18n() {
  if (initialized) return i18n;
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        tw: { translation: tw },
        ha: { translation: ha },
        ee: { translation: ee },
        fr: { translation: fr },
      },
      fallbackLng: "en",
      supportedLngs: ["en", "tw", "ha", "ee", "fr"],
      interpolation: { escapeValue: false },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "mahama_lang",
      },
    });
  initialized = true;
  return i18n;
}

export const useTranslation = useT;
