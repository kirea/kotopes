document.addEventListener('DOMContentLoaded', () => {
  // Mobile Hamburger Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.contains('nav--open');
      if (isOpen) {
        nav.classList.remove('nav--open');
        menuToggle.setAttribute('aria-expanded', 'false');
      } else {
        nav.classList.add('nav--open');
        menuToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close mobile nav when clicking a link (helps on single-page-like behavior or filters)
    const navLinks = nav.querySelectorAll('.nav__link, .dropdown__item');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          nav.classList.remove('nav--open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Close <details> dropdown when clicking outside
  const dropdowns = document.querySelectorAll('.dropdown');
  document.addEventListener('click', (e) => {
    dropdowns.forEach(dropdown => {
      if (dropdown.hasAttribute('open') && !dropdown.contains(e.target)) {
        dropdown.removeAttribute('open');
      }
    });
  });

  // Esc key closes the dropdown
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdowns.forEach(dropdown => {
        if (dropdown.hasAttribute('open')) {
          dropdown.removeAttribute('open');
          const summary = dropdown.querySelector('.dropdown__summary');
          if (summary) summary.focus();
        }
      });
    }
  });
});
