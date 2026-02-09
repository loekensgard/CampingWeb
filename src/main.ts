import "./style.css";
import { showRentalForm } from "./form.ts";
import { applyTranslations, getLanguage, setLanguage } from "./i18n/i18n.ts";
import { initMap } from "./map.ts";
import { initModal, openModal } from "./modal.ts";
import type { Caravan, RentalFormData } from "./types.ts";

function handleMarkerClick(caravan: Caravan) {
  openModal(caravan);
}

function handleRentClick(caravan: Caravan) {
  showRentalForm(caravan, handleFormSubmit, handleBackToDetails);
}

function handleBackToDetails(caravan: Caravan) {
  openModal(caravan);
}

async function handleFormSubmit(data: RentalFormData) {
  console.log("Form submitted:", data);
  // EmailJS sending will be added in Task 9
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
