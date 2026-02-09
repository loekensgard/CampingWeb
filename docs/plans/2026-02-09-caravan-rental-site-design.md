# Caravan Rental Website — Design Document

## Overview

A static, single-page website displaying caravans on an interactive map. Visitors can view caravan details and submit rental inquiries via email.

## Architecture

- **Static site** built with Vite + TypeScript
- **Leaflet + OpenStreetMap** for the interactive map
- **EmailJS** for sending rental inquiry emails (no backend)
- **Free hosting** on GitHub Pages or Netlify
- **Biome** for linting and formatting

No backend, no database, no authentication.

## Project Structure

```
CaravanWeb/
├── src/
│   ├── main.ts              # Entry point, initializes app
│   ├── config.ts            # EmailJS keys, map defaults
│   ├── data/
│   │   └── caravans.ts      # Caravan data array
│   ├── map.ts               # Map initialization, markers
│   ├── modal.ts             # Info modal and rental form
│   ├── email.ts             # EmailJS integration
│   └── i18n/
│       ├── en.ts            # English translations
│       ├── no.ts            # Norwegian translations
│       └── i18n.ts          # Language switcher logic
├── index.html
├── css/
│   └── styles.css
├── assets/
│   ├── images/caravans/     # Caravan photos
│   └── icons/
│       └── marker.svg       # Custom map marker
├── docs/
│   └── plans/
├── package.json
├── tsconfig.json
├── biome.json
└── .gitignore
```

## Data Model

Each caravan is represented as:

```ts
interface Caravan {
    id: string;
    name: { en: string; no: string };
    location: { lat: number; lng: number };
    address: string;
    description: { en: string; no: string };
    features: string[];
    price: string;
    images: string[];
    available: boolean;
}
```

## Map

- Leaflet map centered on Rakkestad, Norway (59.4255, 11.3430)
- Custom markers for each caravan
- Muted marker style for unavailable caravans
- Clicking a marker opens the info modal

## Info Modal

Displays when a marker is clicked:
- Caravan name, images, description, features, price
- "Rent this caravan" button
- Close via X button or clicking outside

## Rental Form

Fields:
| Field             | Type     | Required |
|-------------------|----------|----------|
| Full name         | text     | yes      |
| Email             | email    | yes      |
| Phone number      | tel      | yes      |
| Driver's license  | text     | yes      |
| Check-in date     | date     | yes      |
| Check-out date    | date     | yes      |
| Number of guests  | number   | yes      |
| Message           | textarea | no       |

Caravan name is included automatically as a hidden field.

Submission via EmailJS. Shows success/error message. Submit button disabled during sending.

## i18n

- Simple key-value translation files for Norwegian (default) and English
- `data-i18n` attributes on translatable HTML elements
- EN | NO toggle in top-right corner
- Language preference saved to localStorage
- Caravan data includes both languages inline

## Styling

- Clean, minimal design with green accent color
- Full-width map, small header/banner
- Fully responsive: modal is full-screen on mobile, centered card on desktop
- Hand-written CSS, no framework
