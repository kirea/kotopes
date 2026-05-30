// Header enhancements (progressive — header works without JS).
// 1. Mobile hamburger toggles the nav panel.
// 2. The Рубрики dropdown is a native <details>/<summary> disclosure; JS only
//    adds nicety: reflect aria-expanded, close on outside-click / Esc, and
//    return focus to the summary on Esc.

(function () {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primary-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });
    // Collapse the mobile panel after navigating.
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    // Reset state when leaving mobile width.
    const mq = window.matchMedia("(min-width: 901px)");
    mq.addEventListener("change", (ev) => {
      if (ev.matches) {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const dropdown = document.querySelector(".dropdown");
  if (dropdown) {
    const summary = dropdown.querySelector(".dropdown__summary");

    const syncExpanded = () =>
      summary && summary.setAttribute("aria-expanded", String(dropdown.open));
    syncExpanded();
    dropdown.addEventListener("toggle", syncExpanded);

    // Close when clicking outside the menu.
    document.addEventListener("click", (e) => {
      if (dropdown.open && !dropdown.contains(e.target)) dropdown.open = false;
    });
    // Esc closes and returns focus to the trigger.
    dropdown.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && dropdown.open) {
        dropdown.open = false;
        if (summary) summary.focus();
      }
    });
  }
})();
