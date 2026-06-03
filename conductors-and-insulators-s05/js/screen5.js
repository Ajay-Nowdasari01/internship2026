/* =============================================
   screen5.js — Where Do We Use Them? (Real Life)
   ============================================= */

const Screen5 = (() => {

  const emojiMap = {
    'Charging Cable':  '🔋',
    'House Wiring':    '🏠',
    'Electric Fan':    '🌀',
    'Safety Gloves':   '🧤',
    'Wire Covering':   '🔌',
    'Plastic Handle':  '🪛'
  };

  function openPopup(card) {
    const overlay = document.getElementById('popupOverlay');
    const textEl  = document.getElementById('popupText');
    const iconEl  = document.getElementById('popupIcon');

    const message = card.dataset.popup;
    const name    = card.querySelector('.reallife-name')?.textContent || '';
    const emoji   = emojiMap[name] || '📖';

    if (!overlay || !textEl) return;

    iconEl.textContent  = emoji;
    textEl.textContent  = message;

    overlay.classList.add('show');
    AudioFX.click();
  }

  function closePopup() {
    const overlay = document.getElementById('popupOverlay');
    if (overlay) overlay.classList.remove('show');
  }

  function init() {
    // Open popup on card click
    const cards = document.querySelectorAll('.reallife-card');
    cards.forEach(card => {
      card.addEventListener('click', () => openPopup(card));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') openPopup(card);
      });
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
    });

    // Close button inside popup
    const closeBtn = document.getElementById('popupClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        AudioFX.click();
        closePopup();
      });
    }

    // Click overlay background to close
    const overlay = document.getElementById('popupOverlay');
    if (overlay) {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) closePopup();
      });
    }

    // Next button
    const nextBtn = document.getElementById('nextToFinal');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        AudioFX.click();
        Game.goNext();
      });
    }
  }

  return { init };
})();
