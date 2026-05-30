const disclosures = document.querySelectorAll("[data-disclosure]");

for (const disclosure of disclosures) {
  const summary = disclosure.querySelector("summary");
  if (!summary) continue;
  summary.setAttribute("aria-expanded", disclosure.open ? "true" : "false");
  disclosure.addEventListener("toggle", () => {
    summary.setAttribute("aria-expanded", disclosure.open ? "true" : "false");
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  for (const disclosure of disclosures) {
    if (disclosure.open) {
      disclosure.open = false;
      disclosure.querySelector("summary")?.focus();
    }
  }
});

document.addEventListener("click", (event) => {
  for (const disclosure of disclosures) {
    if (disclosure.open && !disclosure.contains(event.target)) {
      disclosure.open = false;
    }
  }
});
