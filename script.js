const WHATSAPP_NUMBER = "56961069670";
const BUSINESS_NAME = "BBSCLUB' Barbería";

const header = document.querySelector("#siteHeader");
const form = document.querySelector("#bookingForm");
const bookingSection = document.querySelector("#reservas");
const serviceSelect = document.querySelector("#service");
const dateInput = document.querySelector("#date");
const note = document.querySelector("#bookingNote");
const floatingAction = document.querySelector("#floatingWhatsapp");
const directLinks = [
  document.querySelector("#directWhatsapp"),
  document.querySelector("#heroWhatsapp"),
  floatingAction
].filter(Boolean);

function setHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 18);

  const bookingRect = bookingSection.getBoundingClientRect();
  const bookingInView = bookingRect.top < window.innerHeight && bookingRect.bottom > 0;
  const shouldShowFloating = window.scrollY > window.innerHeight * 0.55 && !bookingInView;
  floatingAction.classList.toggle("is-visible", shouldShowFloating);
}

function todayIso() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

function buildMessage(values = {}) {
  const name = values.name || "mi nombre";
  const service = values.service || "un corte";
  const date = values.date ? `\nDía preferido: ${values.date}` : "";
  const time = values.time ? `\nHora preferida: ${values.time}` : "";
  const details = values.details ? `\nDetalle: ${values.details}` : "";

  return `Hola ${BUSINESS_NAME}, quiero reservar.\nNombre: ${name}\nServicio: ${service}${date}${time}${details}`;
}

function whatsappUrl(message) {
  const encoded = encodeURIComponent(message);
  const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, "");
  return cleanNumber ? `https://wa.me/${cleanNumber}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}

function currentFormValues() {
  return {
    name: document.querySelector("#clientName").value.trim(),
    service: serviceSelect.value,
    date: dateInput.value,
    time: document.querySelector("#time").value,
    details: document.querySelector("#details").value.trim()
  };
}

function updateDirectLinks() {
  const message = buildMessage({ service: serviceSelect.value || "un corte" });
  const url = whatsappUrl(message);

  directLinks.forEach((link) => {
    link.setAttribute("href", url);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
  });
}

function handleServicePick(event) {
  const button = event.target.closest(".service-pick");
  if (!button) return;

  serviceSelect.value = button.dataset.service;
  updateDirectLinks();
  form.scrollIntoView({ behavior: "smooth", block: "center" });
  note.textContent = `Servicio seleccionado: ${button.dataset.service}.`;
}

function handleSubmit(event) {
  event.preventDefault();

  if (!form.reportValidity()) return;

  const values = currentFormValues();
  const url = whatsappUrl(buildMessage(values));
  const hasNumber = WHATSAPP_NUMBER.replace(/\D/g, "").length > 0;

  note.textContent = hasNumber
    ? "Abriendo WhatsApp con el mensaje listo."
    : "Abriendo WhatsApp con el mensaje listo. Falta configurar el número del local.";

  window.open(url, "_blank", "noopener");
}

window.addEventListener("scroll", setHeaderState, { passive: true });
document.addEventListener("click", handleServicePick);
form.addEventListener("submit", handleSubmit);
serviceSelect.addEventListener("change", updateDirectLinks);

dateInput.min = todayIso();
setHeaderState();
updateDirectLinks();
