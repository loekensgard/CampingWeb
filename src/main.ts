import "./style.css";
import { applyTranslations, getLanguage, setLanguage } from "./i18n/i18n.ts";
import { initMap } from "./map.ts";
import { initModal, openModal } from "./modal.ts";
import type { Caravan } from "./types.ts";

function handleMarkerClick(caravan: Caravan) {
  openModal(caravan);
}

function handleRentClick(caravan: Caravan) {
  console.log("Rent clicked:", caravan.id);
  // Rental form will be added in Task 8
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
  initModal(handleRentClick);
  initMap(handleMarkerClick);
}

document.addEventListener("DOMContentLoaded", init);
