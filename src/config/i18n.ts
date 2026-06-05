import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationES from "../translations/es.json";
import translationEN from "../translations/en.json";
import backofficeTexts from "../data/backoffice_texts.json";

// Merge backofficeTexts into translationES dynamically
const mergedES = {
  ...translationES,
  hero: {
    ...translationES.hero,
    ...(backofficeTexts.hero || {}),
  },
  about: {
    ...translationES.about,
    ...(backofficeTexts.about || {}),
  },
  contact: {
    ...translationES.contact,
    ...(backofficeTexts.contact || {}),
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
