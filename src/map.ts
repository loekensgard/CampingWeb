import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerSvg from "/assets/icons/marker.svg";
import { MAP_CONFIG } from "./config.ts";
import { caravans } from "./data/caravans.ts";
import { tt } from "./i18n/i18n.ts";
import type { Caravan } from "./types.ts";

let map: L.Map;

const availableIcon = L.icon({
  iconUrl: markerSvg,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
});

const unavailableIcon = L.icon({
  iconUrl: markerSvg,
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
