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
