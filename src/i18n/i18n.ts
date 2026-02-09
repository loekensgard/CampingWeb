import { DEFAULT_LANGUAGE } from "../config.ts";
import type { Language, TranslatableString } from "../types.ts";
import { en } from "./en.ts";
import { no } from "./no.ts";

const translations: Record<Language, Record<string, string>> = { en, no };

let currentLanguage: Language = loadLanguage();

function loadLanguage(): Language {
  const saved = localStorage.getItem("language");
  if (saved === "en" || saved === "no") {
    return saved;
  }
  return DEFAULT_LANGUAGE;
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function setLanguage(lang: Language): void {
  currentLanguage = lang;
  localStorage.setItem("language", lang);
  applyTranslations();
}

export function t(key: string): string {
  return translations[currentLanguage][key] ?? key;
}

export function tt(translatable: TranslatableString): string {
  return translatable[currentLanguage];
}

export function applyTranslations(): void {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key) {
      el.textContent = t(key);
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key && el instanceof HTMLInputElement) {
      el.placeholder = t(key);
    }
  });

  document.documentElement.lang = currentLanguage;
}
