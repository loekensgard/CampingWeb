import { t, tt } from "./i18n/i18n.ts";
import type { Caravan } from "./types.ts";

const overlay = () =>
  document.getElementById("modal-overlay") as HTMLDivElement;
const content = () =>
  document.getElementById("modal-content") as HTMLDivElement;
const closeBtn = () =>
  document.getElementById("modal-close") as HTMLButtonElement;

let onRentClick: ((caravan: Caravan) => void) | null = null;

export function initModal(rentHandler: (caravan: Caravan) => void): void {
  onRentClick = rentHandler;

  closeBtn().addEventListener("click", closeModal);
  overlay().addEventListener("click", (e) => {
    if (e.target === overlay()) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });
}

export function openModal(caravan: Caravan): void {
  const imagesHtml =
    caravan.images.length > 0
      ? `<div class="modal__images">
          ${caravan.images.map((src) => `<img src="${src}" alt="${tt(caravan.name)}" class="modal__image" />`).join("")}
        </div>`
      : "";

  const featuresHtml = caravan.features
    .map((f) => `<span class="modal__feature">${f}</span>`)
    .join("");

  const rentButtonHtml = caravan.available
    ? `<button class="btn btn--primary" id="rent-button">${t("modal.rent_button")}</button>`
    : `<p class="modal__unavailable">${t("modal.unavailable")}</p>`;

  content().innerHTML = `
    ${imagesHtml}
    <h2 class="modal__title">${tt(caravan.name)}</h2>
    <p class="modal__address">${caravan.address}</p>
    <p class="modal__description">${tt(caravan.description)}</p>
    <div class="modal__features">
      <h3>${t("modal.features")}</h3>
      <div class="modal__features-list">${featuresHtml}</div>
    </div>
    <div class="modal__price">
      <h3>${t("modal.price")}</h3>
      <p>${caravan.price}</p>
    </div>
    ${rentButtonHtml}
  `;

  if (caravan.available) {
    document.getElementById("rent-button")?.addEventListener("click", () => {
      onRentClick?.(caravan);
    });
  }

  overlay().classList.add("modal-overlay--visible");
}

export function closeModal(): void {
  overlay().classList.remove("modal-overlay--visible");
}

export function setModalContent(html: string): void {
  content().innerHTML = html;
}
