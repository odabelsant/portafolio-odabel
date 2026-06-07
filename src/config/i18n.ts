import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationES from "../translations/es.json";
import translationEN from "../translations/en.json";
import backofficeTexts from "../data/backoffice_texts.json";
import type { TranslationSchema } from "../data/types";

// Merge backofficeTexts into translationES dynamically
const texts = backofficeTexts as any;

const mergedES: TranslationSchema = {
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
  skills: {
    ...translationES.skills,
    categories: {
      ...translationES.skills.categories,
      ...(texts.skills?.categories || {}),
    },
  },
  education: {
    ...translationES.education,
    ...(texts.education || {}),
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
} as any;

const resources = {
  es: {
    translation: mergedES,
  },
  en: {
    translation: translationEN as any,
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

// Extender tipos de i18next para autocompletado y tipado estricto
declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: TranslationSchema;
    };
  }
}

export default i18n;

