import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { deepMerge } from "../utils/deepMerge";
import translationES from "../translations/es.json";
import translationEN from "../translations/en.json";
import backofficeTexts from "../data/backoffice_texts.json";
import type { TranslationSchema } from "../data/types";

const mergedES = deepMerge(translationES, backofficeTexts) as TranslationSchema;

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

