import type { Caravan } from "../types.ts";

export const caravans: Caravan[] = [
  {
    id: "caravan-1",
    name: { en: "Sunny Meadow", no: "Soleng" },
    location: { lat: 59.420605, lng: 11.3555844 },
    address: "Gressveien 6, 1890 Rakkestad",
    description: {
      en: "Cozy 2-person caravan with a beautiful view of the countryside. Fully equipped kitchen and comfortable beds.",
      no: "Koselig campingvogn for 2 personer med vakker utsikt over landskapet. Fullt utstyrt kjøkken og komfortable senger.",
    },
    features: ["2 persons", "WiFi", "Kitchen", "Shower"],
    price: { en: "450 NOK / night", no: "450 NOK / natt" },
    images: [`${import.meta.env.BASE_URL}images/caravans/camper1.png`],
    available: true,
  },
  {
    id: "caravan-2",
    name: { en: "Forest Retreat", no: "Skogly" },
    location: { lat: 59.418329, lng: 11.3249221 },
    address: "Tegleverksveien 28, 1894 Rakkestad",
    description: {
      en: "Spacious 2-person caravan nestled among the trees. Perfect for families with children.",
      no: "Romslig campingvogn for 2 personer omgitt av trær. Perfekt for familier med barn.",
    },
    features: ["2 persons", "WiFi", "Kitchen", "Shower", "Pet friendly"],
    price: { en: "600 NOK / night", no: "600 NOK / natt" },
    images: [`${import.meta.env.BASE_URL}images/caravans/camper2.jpg`],
    available: false,
  },
];
