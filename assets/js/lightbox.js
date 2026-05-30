const dialog = document.querySelector("[data-lightbox]");
const image = document.querySelector("[data-lightbox-image]");
const caption = document.querySelector("[data-lightbox-caption]");
const close = document.querySelector("[data-lightbox-close]");
let trigger = null;

if (dialog && image && caption && close) {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lightbox-src]");
    if (!button) return;
    trigger = button;
    image.src = button.dataset.lightboxSrc;
    image.alt = button.querySelector("img")?.alt || "";
    caption.textContent = button.dataset.lightboxCaption || "";
    dialog.showModal();
    close.focus();
  });

  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    image.removeAttribute("src");
    trigger?.focus();
  });
}
