import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationES from "../translations/es.json";
import translationEN from "../translations/en.json";
import backofficeTexts from "../data/backoffice_texts.json";

// Merge backofficeTexts into translationES dynamically
const texts = backofficeTexts as any;

const mergedES = {
  ...translationES,
  nav: {
    ...translationES.nav,
    ...(texts.nav || {}),
  },
  hero: {
    ...translationES.hero,
    ...(texts.hero || {}),
  },
  about: {
    ...translationES.about,
    ...(texts.about || {}),
  },
  contact: {
    ...translationES.contact,
    ...(texts.contact || {}),
  },
  certifications: {
    ...translationES.certifications,
    ...Object.fromEntries(
      Object.entries(translationES.certifications || {}).map(([key, value]) => [
        key,
        typeof value === "object" && value !== null
          ? {
              ...value,
              ...(texts.certifications?.[key] || {}),
            }
          : value,
      ])
    ),
  },
};

const resources = {
  es: {
    translation: mergedES,
  },
  en: {
    translation: translationEN,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "es",
    interpolation: {
      escapeValue: false, // React already safeguards against XSS
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
