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
