# Caravan Rental Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a static single-page website showing caravans on an interactive map with rental inquiry forms that send emails.

**Architecture:** Vanilla TypeScript + Vite static site. Leaflet/OpenStreetMap for the map, EmailJS for sending rental inquiries (no backend). Simple key-value i18n for Norwegian (default) and English. All caravan data hardcoded in a TypeScript file.

**Tech Stack:** Vite, TypeScript, Leaflet, EmailJS, Biome

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install Leaflet and its types**

Run: `npm install leaflet && npm install --save-dev @types/leaflet`

Leaflet is the map library. `@types/leaflet` provides TypeScript definitions.

**Step 2: Install EmailJS browser SDK**

Run: `npm install @emailjs/browser`

This is the client-side SDK for sending emails via EmailJS.

**Step 3: Verify build still passes**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add leaflet and emailjs dependencies"
```

---

### Task 2: Types and Config

**Files:**
- Create: `src/types.ts`
- Create: `src/config.ts`

**Step 1: Create the type definitions**

Create `src/types.ts`:

```ts
export type TranslatableString = {
  en: string;
  no: string;
};

export type Caravan = {
  id: string;
  name: TranslatableString;
  location: { lat: number; lng: number };
  address: string;
  description: TranslatableString;
  features: string[];
  price: string;
  images: string[];
  available: boolean;
};

export type Language = "en" | "no";

export type RentalFormData = {
  caravanId: string;
  caravanName: string;
  fullName: string;
  email: string;
  phone: string;
  driversLicense: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message: string;
};
```

**Step 2: Create the config file**

Create `src/config.ts`:

```ts
import type { Language } from "./types.ts";

export const MAP_CONFIG = {
  center: { lat: 59.4255, lng: 11.343 } as const,
  zoom: 12,
  tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  tileAttribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
} as const;

export const EMAILJS_CONFIG = {
  serviceId: "YOUR_SERVICE_ID",
  templateId: "YOUR_TEMPLATE_ID",
  publicKey: "YOUR_PUBLIC_KEY",
} as const;

export const DEFAULT_LANGUAGE: Language = "no";
```

**Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 4: Run linter**

Run: `npm run lint`
Expected: No errors.

**Step 5: Commit**

```bash
git add src/types.ts src/config.ts
git commit -m "feat: add type definitions and config"
```

---

### Task 3: i18n System

**Files:**
- Create: `src/i18n/en.ts`
- Create: `src/i18n/no.ts`
- Create: `src/i18n/i18n.ts`

**Step 1: Create English translations**

Create `src/i18n/en.ts`:

```ts
export const en: Record<string, string> = {
  "header.title": "Caravan Rental",
  "header.subtitle": "Find your perfect caravan in Rakkestad",
  "lang.toggle": "NO",
  "modal.features": "Features",
  "modal.price": "Price",
  "modal.rent_button": "Rent this caravan",
  "modal.unavailable": "Currently unavailable",
  "modal.close": "Close",
  "form.title": "Rental Inquiry",
  "form.full_name": "Full name",
  "form.email": "Email",
  "form.phone": "Phone number",
  "form.drivers_license": "Driver's license number",
  "form.check_in": "Check-in date",
  "form.check_out": "Check-out date",
  "form.guests": "Number of guests",
  "form.message": "Message (optional)",
  "form.submit": "Send inquiry",
  "form.sending": "Sending...",
  "form.success": "Your inquiry has been sent! We'll get back to you soon.",
  "form.error": "Something went wrong. Please try again or contact us directly.",
  "form.back": "Back to details",
};
```

**Step 2: Create Norwegian translations**

Create `src/i18n/no.ts`:

```ts
export const no: Record<string, string> = {
  "header.title": "Campingvogn Utleie",
  "header.subtitle": "Finn din perfekte campingvogn i Rakkestad",
  "lang.toggle": "EN",
  "modal.features": "Fasiliteter",
  "modal.price": "Pris",
  "modal.rent_button": "Lei denne campingvognen",
  "modal.unavailable": "Ikke tilgjengelig for øyeblikket",
  "modal.close": "Lukk",
  "form.title": "Leieforespørsel",
  "form.full_name": "Fullt navn",
  "form.email": "E-post",
  "form.phone": "Telefonnummer",
  "form.drivers_license": "Førerkortnummer",
  "form.check_in": "Innsjekk",
  "form.check_out": "Utsjekk",
  "form.guests": "Antall gjester",
  "form.message": "Melding (valgfritt)",
  "form.submit": "Send forespørsel",
  "form.sending": "Sender...",
  "form.success": "Din forespørsel er sendt! Vi tar kontakt snart.",
  "form.error": "Noe gikk galt. Vennligst prøv igjen eller kontakt oss direkte.",
  "form.back": "Tilbake til detaljer",
};
```

**Step 3: Create the i18n module**

Create `src/i18n/i18n.ts`:

```ts
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
```

**Step 4: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 5: Run linter**

Run: `npm run lint`
Expected: No errors.

**Step 6: Commit**

```bash
git add src/i18n/
git commit -m "feat: add i18n system with Norwegian and English translations"
```

---

### Task 4: Caravan Data

**Files:**
- Create: `src/data/caravans.ts`

**Step 1: Create caravan data with sample entries**

Create `src/data/caravans.ts`:

```ts
import type { Caravan } from "../types.ts";

export const caravans: Caravan[] = [
  {
    id: "caravan-1",
    name: { en: "Sunny Meadow", no: "Soleng" },
    location: { lat: 59.428, lng: 11.345 },
    address: "Rakkestad Camping, Plass 12",
    description: {
      en: "Cozy 4-person caravan with a beautiful view of the countryside. Fully equipped kitchen and comfortable beds.",
      no: "Koselig campingvogn for 4 personer med vakker utsikt over landskapet. Fullt utstyrt kjøkken og komfortable senger.",
    },
    features: ["4 persons", "WiFi", "Kitchen", "Shower"],
    price: "450 NOK / night",
    images: [],
    available: true,
  },
  {
    id: "caravan-2",
    name: { en: "Forest Retreat", no: "Skogly" },
    location: { lat: 59.422, lng: 11.34 },
    address: "Rakkestad Camping, Plass 7",
    description: {
      en: "Spacious 6-person caravan nestled among the trees. Perfect for families with children.",
      no: "Romslig campingvogn for 6 personer omgitt av trær. Perfekt for familier med barn.",
    },
    features: ["6 persons", "WiFi", "Kitchen", "Shower", "Pet friendly"],
    price: "600 NOK / night",
    images: [],
    available: true,
  },
];
```

Note: The `images` arrays are empty for now — the owner will add their own photos later to `assets/images/caravans/`.

**Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Commit**

```bash
git add src/data/caravans.ts
git commit -m "feat: add caravan data with sample entries"
```

---

### Task 5: HTML Structure

**Files:**
- Modify: `index.html`

**Step 1: Add the full HTML structure**

Replace `index.html` content with the complete page structure including header, map container, modal shell, and language toggle. All user-visible text uses `data-i18n` attributes.

```html
<!doctype html>
<html lang="no">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Caravan Rental — Rakkestad</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      crossorigin=""
    />
    <link rel="stylesheet" href="/css/styles.css" />
  </head>
  <body>
    <header class="header">
      <div class="header__content">
        <div class="header__titles">
          <h1 data-i18n="header.title">Campingvogn Utleie</h1>
          <p data-i18n="header.subtitle">
            Finn din perfekte campingvogn i Rakkestad
          </p>
        </div>
        <button class="lang-toggle" id="lang-toggle" data-i18n="lang.toggle">
          EN
        </button>
      </div>
    </header>

    <main>
      <div id="map" class="map"></div>
    </main>

    <div class="modal-overlay" id="modal-overlay">
      <div class="modal" id="modal">
        <button class="modal__close" id="modal-close">&times;</button>
        <div class="modal__content" id="modal-content">
          <!-- Populated dynamically by modal.ts -->
        </div>
      </div>
    </div>

    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add HTML structure with header, map container, and modal"
```

---

### Task 6: Map Initialization

**Files:**
- Create: `src/map.ts`
- Modify: `src/main.ts`

**Step 1: Create the map module**

Create `src/map.ts`:

```ts
import L from "leaflet";
import { MAP_CONFIG } from "./config.ts";
import { caravans } from "./data/caravans.ts";
import { tt } from "./i18n/i18n.ts";
import type { Caravan } from "./types.ts";

let map: L.Map;

const availableIcon = L.icon({
  iconUrl: "/assets/icons/marker.svg",
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
});

const unavailableIcon = L.icon({
  iconUrl: "/assets/icons/marker.svg",
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
  className: "marker--unavailable",
});

export function initMap(onMarkerClick: (caravan: Caravan) => void): void {
  map = L.map("map").setView(
    [MAP_CONFIG.center.lat, MAP_CONFIG.center.lng],
    MAP_CONFIG.zoom,
  );

  L.tileLayer(MAP_CONFIG.tileUrl, {
    attribution: MAP_CONFIG.tileAttribution,
  }).addTo(map);

  for (const caravan of caravans) {
    const icon = caravan.available ? availableIcon : unavailableIcon;
    const marker = L.marker([caravan.location.lat, caravan.location.lng], {
      icon,
    }).addTo(map);

    marker.bindTooltip(tt(caravan.name));
    marker.on("click", () => onMarkerClick(caravan));
  }
}
```

**Step 2: Create the custom marker SVG**

Create `assets/icons/marker.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="32" height="40">
  <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0z" fill="#2d7a3a"/>
  <circle cx="16" cy="16" r="8" fill="white"/>
</svg>
```

**Step 3: Update main.ts to initialize the map**

Replace `src/main.ts` with:

```ts
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
```

**Step 4: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 5: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 6: Manual test**

Run: `npm run dev`
Open browser → verify the map loads centered on Rakkestad with 2 markers. Click a marker → check console for "Clicked caravan:" log. Click EN button → text should switch to English.

**Step 7: Commit**

```bash
git add src/map.ts src/main.ts assets/icons/marker.svg
git commit -m "feat: add interactive map with caravan markers and language toggle"
```

---

### Task 7: Info Modal

**Files:**
- Create: `src/modal.ts`
- Modify: `src/main.ts`

**Step 1: Create the modal module**

Create `src/modal.ts`:

```ts
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
```

**Step 2: Update main.ts to wire up the modal**

In `src/main.ts`, replace the `handleMarkerClick` function and add modal initialization:

```ts
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
```

**Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 4: Manual test**

Run: `npm run dev`
Click a marker → modal should appear with caravan info. Click X or outside → modal closes. Press Escape → modal closes.

**Step 5: Commit**

```bash
git add src/modal.ts src/main.ts
git commit -m "feat: add info modal with caravan details"
```

---

### Task 8: Rental Form

**Files:**
- Create: `src/form.ts`
- Modify: `src/main.ts`

**Step 1: Create the rental form module**

Create `src/form.ts`:

```ts
import { t } from "./i18n/i18n.ts";
import { setModalContent } from "./modal.ts";
import type { Caravan, RentalFormData } from "./types.ts";

export function showRentalForm(
  caravan: Caravan,
  onSubmit: (data: RentalFormData) => Promise<void>,
  onBack: (caravan: Caravan) => void,
): void {
  const html = `
    <h2 class="modal__title">${t("form.title")}</h2>
    <form id="rental-form" class="form" novalidate>
      <input type="hidden" name="caravanId" value="${caravan.id}" />
      <div class="form__field">
        <label for="fullName">${t("form.full_name")}</label>
        <input type="text" id="fullName" name="fullName" required />
      </div>
      <div class="form__field">
        <label for="email">${t("form.email")}</label>
        <input type="email" id="email" name="email" required />
      </div>
      <div class="form__field">
        <label for="phone">${t("form.phone")}</label>
        <input type="tel" id="phone" name="phone" required />
      </div>
      <div class="form__field">
        <label for="driversLicense">${t("form.drivers_license")}</label>
        <input type="text" id="driversLicense" name="driversLicense" required />
      </div>
      <div class="form__row">
        <div class="form__field">
          <label for="checkIn">${t("form.check_in")}</label>
          <input type="date" id="checkIn" name="checkIn" required />
        </div>
        <div class="form__field">
          <label for="checkOut">${t("form.check_out")}</label>
          <input type="date" id="checkOut" name="checkOut" required />
        </div>
      </div>
      <div class="form__field">
        <label for="guests">${t("form.guests")}</label>
        <input type="number" id="guests" name="guests" min="1" max="10" required />
      </div>
      <div class="form__field">
        <label for="message">${t("form.message")}</label>
        <textarea id="message" name="message" rows="3"></textarea>
      </div>
      <div class="form__actions">
        <button type="button" class="btn btn--secondary" id="form-back">${t("form.back")}</button>
        <button type="submit" class="btn btn--primary" id="form-submit">${t("form.submit")}</button>
      </div>
      <div id="form-status" class="form__status"></div>
    </form>
  `;

  setModalContent(html);

  const form = document.getElementById("rental-form") as HTMLFormElement;
  const submitBtn = document.getElementById("form-submit") as HTMLButtonElement;
  const statusDiv = document.getElementById("form-status") as HTMLDivElement;
  const backBtn = document.getElementById("form-back") as HTMLButtonElement;

  backBtn.addEventListener("click", () => onBack(caravan));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = t("form.sending");
    statusDiv.textContent = "";
    statusDiv.className = "form__status";

    const formData = new FormData(form);
    const data: RentalFormData = {
      caravanId: caravan.id,
      caravanName: caravan.name.en,
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      driversLicense: formData.get("driversLicense") as string,
      checkIn: formData.get("checkIn") as string,
      checkOut: formData.get("checkOut") as string,
      guests: Number(formData.get("guests")),
      message: formData.get("message") as string,
    };

    try {
      await onSubmit(data);
      statusDiv.textContent = t("form.success");
      statusDiv.classList.add("form__status--success");
      submitBtn.textContent = t("form.submit");
      submitBtn.disabled = false;
    } catch {
      statusDiv.textContent = t("form.error");
      statusDiv.classList.add("form__status--error");
      submitBtn.textContent = t("form.submit");
      submitBtn.disabled = false;
    }
  });
}
```

**Step 2: Update main.ts to wire up the form**

Replace `src/main.ts`:

```ts
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
```

**Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 4: Manual test**

Run: `npm run dev`
Click a marker → click "Rent" → form appears. Click "Back" → returns to caravan info. Submit form → check console for form data.

**Step 5: Commit**

```bash
git add src/form.ts src/main.ts
git commit -m "feat: add rental inquiry form with validation"
```

---

### Task 9: EmailJS Integration

**Files:**
- Create: `src/email.ts`
- Modify: `src/main.ts`

**Step 1: Create the email module**

Create `src/email.ts`:

```ts
import emailjs from "@emailjs/browser";
import { EMAILJS_CONFIG } from "./config.ts";
import type { RentalFormData } from "./types.ts";

let initialized = false;

function ensureInitialized(): void {
  if (!initialized) {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    initialized = true;
  }
}

export async function sendRentalInquiry(data: RentalFormData): Promise<void> {
  ensureInitialized();

  await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
    caravan_name: data.caravanName,
    caravan_id: data.caravanId,
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    drivers_license: data.driversLicense,
    check_in: data.checkIn,
    check_out: data.checkOut,
    guests: data.guests.toString(),
    message: data.message || "No message",
  });
}
```

**Step 2: Update main.ts to use email sending**

In `src/main.ts`, replace `handleFormSubmit`:

```ts
import "./style.css";
import { sendRentalInquiry } from "./email.ts";
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
  await sendRentalInquiry(data);
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
```

**Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 4: Commit**

```bash
git add src/email.ts src/main.ts
git commit -m "feat: add EmailJS integration for rental inquiries"
```

Note: EmailJS won't actually send until you replace the placeholder values in `src/config.ts` with real credentials from https://www.emailjs.com/. This is documented separately and should NOT be committed to git.

---

### Task 10: Styling

**Files:**
- Modify: `css/styles.css`
- Modify: `src/style.css`

**Step 1: Write the main stylesheet**

Replace `css/styles.css` with the complete stylesheet covering: header, map, modal, form, responsive breakpoints, language toggle, and marker styles. Key design decisions:

- Green accent: `#2d7a3a`
- Font: system font stack
- Modal: max-width 500px on desktop, full screen on mobile (breakpoint 600px)
- Map: fills remaining viewport height below header
- Form fields: full width, consistent padding

The CSS should include:
- `.header` — fixed-height bar with title + language toggle
- `.map` — fills viewport below header
- `.modal-overlay` / `.modal` — centered overlay, hidden by default, shown via `.modal-overlay--visible`
- `.modal__*` — all modal content styles (title, images, features, price)
- `.form` / `.form__*` — form layout, field styles, status messages
- `.btn` — button base, `.btn--primary` green, `.btn--secondary` outlined
- `.lang-toggle` — small button in header
- `.marker--unavailable` — CSS filter to mute unavailable markers
- `@media (max-width: 600px)` — responsive overrides

**Step 2: Remove src/style.css if unused, or use it for Vite-processed styles**

If all styles are in `css/styles.css` (loaded via HTML), `src/style.css` can remain empty or contain any Vite-processed styles. Remove the import from `main.ts` if `src/style.css` is empty.

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 4: Manual test**

Run: `npm run dev`
Verify: Header with title and language toggle, full map, clickable markers, modal opens/closes with proper styling, form layout is clean, responsive on mobile viewport.

**Step 5: Run linter**

Run: `npm run lint`
Expected: No errors.

**Step 6: Commit**

```bash
git add css/styles.css src/style.css src/main.ts
git commit -m "feat: add complete responsive styling"
```

---

### Task 11: Final Verification

**Step 1: Clean build**

Run: `rm -rf dist && npm run build`
Expected: Build succeeds with no warnings.

**Step 2: Run linter**

Run: `npm run lint`
Expected: No errors.

**Step 3: Preview production build**

Run: `npm run preview`
Open browser → walk through full flow: view map, click marker, see modal, click rent, fill form, submit (will fail without real EmailJS keys — that's expected). Toggle language. Test on mobile viewport.

**Step 4: Commit any final fixes**

```bash
git add -A
git commit -m "chore: final cleanup and verification"
```
