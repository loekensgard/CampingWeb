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
