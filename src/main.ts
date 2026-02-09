import "./style.css";
import { applyTranslations, getLanguage, setLanguage } from "./i18n/i18n.ts";
import { initMap } from "./map.ts";
import type { Caravan } from "./types.ts";

function handleMarkerClick(caravan: Caravan) {
  console.log("Clicked caravan:", caravan.id);
  // Modal opening will be added in Task 7
}

function initLanguageToggle() {
  const toggle = document.getElementById("lang-toggle");
  toggle?.addEventListener("click", () => {
    const newLang = getLanguage() === "no" ? "en" : "no";
    setLanguage(newLang);
  });
}

function init() {
  applyTranslations();
  initLanguageToggle();
  initMap(handleMarkerClick);
}

document.addEventListener("DOMContentLoaded", init);
