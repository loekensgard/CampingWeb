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
