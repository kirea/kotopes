document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.getElementById('lightbox-dialog');
  if (!dialog) return;

  const lightboxImg = dialog.querySelector('.lightbox-img');
  const lightboxCaption = dialog.querySelector('.lightbox-caption');
  const closeBtn = dialog.querySelector('.lightbox-close');

  let activeTrigger = null;

  // Add click handler to all article images that open the lightbox
  const articleImages = document.querySelectorAll('.article-body figure img');
  articleImages.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      activeTrigger = img;
      
      // Retrieve the caption text from the figcaption sibling
      const figcaption = img.parentElement.querySelector('figcaption');
      const captionText = figcaption ? figcaption.innerHTML : '';
      
      // Update lightbox content
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
      lightboxCaption.innerHTML = captionText;
      
      // Open dialog modal
      dialog.showModal();
    });
  });

  // Close button handler
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      dialog.close();
    });
  }

  // Backdrop click handler to close the dialog
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.close();
    }
  });

  // Focus return logic upon closing
  dialog.addEventListener('close', () => {
    if (activeTrigger) {
      activeTrigger.focus();
      activeTrigger = null;
    }
    // Clear content for clean exit animation or loading next
    lightboxImg.src = '';
    lightboxCaption.innerHTML = '';
  });
});
