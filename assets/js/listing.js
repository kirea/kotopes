import { RUBRICS } from './articles.js';

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('materials-grid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.card');
  const h1 = document.getElementById('materials-title');
  const resetContainer = document.getElementById('materials-reset-container');
  
  function applyFilter() {
    const params = new URLSearchParams(window.location.search);
    const rubricId = params.get('rubric');

    if (!rubricId) {
      // Show all cards
      cards.forEach(card => {
        card.style.display = 'flex';
      });
      if (h1) h1.textContent = 'Усі матеріали';
      if (resetContainer) resetContainer.style.display = 'none';
      document.title = 'Усі матеріали — «Котопес»';
      return;
    }

    // Find the rubric info
    const rubric = RUBRICS.find(r => r.id === rubricId);
    if (!rubric) {
      // Fallback if invalid rubric parameter
      cards.forEach(card => {
        card.style.display = 'flex';
      });
      if (h1) h1.textContent = 'Усі матеріали';
      if (resetContainer) resetContainer.style.display = 'none';
      document.title = 'Усі матеріали — «Котопес»';
      return;
    }

    // Filter cards
    let matchCount = 0;
    cards.forEach(card => {
      const cardRubric = card.getAttribute('data-rubric');
      if (cardRubric === rubricId) {
        card.style.display = 'flex';
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update page heading and reset link
    if (h1) h1.textContent = rubric.label;
    if (resetContainer) resetContainer.style.display = 'block';
    document.title = `${rubric.label} — «Котопес»`;
  }

  // Initial load
  applyFilter();

  // Listen to popstate for history navigation if the user filters using back/forward
  window.addEventListener('popstate', applyFilter);
});
