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
  price: TranslatableString;
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
