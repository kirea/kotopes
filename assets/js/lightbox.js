// Article image lightbox (D9). Progressive enhancement: each article photo is
// authored as <figure><button class="figure-btn">…<img>…</button><figcaption>.
// Without JS the button is inert and the image still shows. With JS, clicking a
// figure opens a single shared native <dialog> showing the full image + caption.
// Native modal <dialog> handles focus trap; Esc + backdrop + ✕ all close; focus
// returns to the triggering button.

(function () {
  const buttons = Array.from(document.querySelectorAll(".figure-btn"));
  if (!buttons.length) return;

  // Build one shared dialog, injected once.
  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.innerHTML = `
    <div class="lightbox__frame">
      <button type="button" class="lightbox__close" aria-label="Закрити">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18"/>
        </svg>
      </button>
      <img class="lightbox__img" alt="">
      <p class="lightbox__caption"></p>
    </div>`;
  document.body.appendChild(dialog);

  const img = dialog.querySelector(".lightbox__img");
  const caption = dialog.querySelector(".lightbox__caption");
  const closeBtn = dialog.querySelector(".lightbox__close");
  let lastTrigger = null;

  function open(trigger) {
    const sourceImg = trigger.querySelector("img");
    if (!sourceImg) return;
    lastTrigger = trigger;
    img.src = sourceImg.currentSrc || sourceImg.src;
    img.alt = sourceImg.alt || "";

    // Prefer the figure's own caption; fall back to alt text.
    const fig = trigger.closest("figure");
    const cap = fig && fig.querySelector("figcaption");
    const text = cap ? cap.textContent.trim() : (sourceImg.alt || "");
    caption.textContent = text;
    caption.hidden = !text;

    dialog.showModal();
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => open(btn));
  });

  closeBtn.addEventListener("click", () => dialog.close());

  // Click on the backdrop (outside the frame) closes.
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });

  // Restore focus to the triggering figure on close.
  dialog.addEventListener("close", () => {
    img.removeAttribute("src");
    if (lastTrigger && typeof lastTrigger.focus === "function") lastTrigger.focus();
  });
})();
