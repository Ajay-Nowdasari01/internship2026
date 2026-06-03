/* =============================================
   screen4.js — Choose Wisely Challenge
   ============================================= */

const Screen4 = (() => {

  let correctCount = 0;
  const REQUIRED   = 3;
  let nextBtn;

  const conductors = ['coin', 'copper', 'spoon'];

  function updateScore() {
    const el = document.getElementById('correctCount');
    if (el) el.textContent = correctCount;
  }

  /**
   * Flash the powerline gap to indicate it's being repaired.
   */
  function animatePowerlineProgress() {
    const gap = document.querySelector('.powerline-gap');
    if (!gap) return;

    if (correctCount >= REQUIRED) {
      gap.classList.add('repaired');
    }
  }

  /**
   * Handle a challenge card click.
   */
  function handleCardClick(card) {
    if (card.classList.contains('correct-pick') ||
        card.classList.contains('wrong-pick') ||
        card.classList.contains('disabled')) return;

    const material    = card.dataset.material;
    const isConductor = conductors.includes(material);
    const feedbackEl  = document.getElementById(`cf-${material}`);

    AudioFX.click();

    if (isConductor) {
      // Correct choice
      correctCount++;
      card.classList.add('correct-pick');
      card.classList.add('disabled');
      if (feedbackEl) feedbackEl.textContent = '✅';
      AudioFX.success();
      Guide.say("Great choice! That's a conductor! ⚡");
      updateScore();
      animatePowerlineProgress();

      // All 3 conductors found
      if (correctCount >= REQUIRED) {
        setTimeout(() => {
          if (nextBtn) showAnimated(nextBtn);
          Guide.say("You found all 3 conductors! Power line can be fixed! 🎉");
        }, 600);
      }

    } else {
      // Wrong choice
      card.classList.add('wrong-pick');
      if (feedbackEl) feedbackEl.textContent = '❌';
      AudioFX.error();
      Guide.say("That's an insulator — electricity can't flow through it! Try again! 💡");

      // Remove the wrong styling after a moment so they can try again
      setTimeout(() => {
        card.classList.remove('wrong-pick');
        if (feedbackEl) feedbackEl.textContent = '';
      }, 1200);
    }
  }

  /**
   * Toggle hint visibility.
   */
  function initHint() {
    const hintBtn  = document.getElementById('hintBtn4');
    const hintText = document.getElementById('hintText4');

    if (hintBtn && hintText) {
      hintBtn.addEventListener('click', () => {
        AudioFX.click();
        const visible = hintText.style.display !== 'none';
        if (visible) {
          hintText.style.display = 'none';
          hintBtn.textContent = '💡 Hint';
        } else {
          showAnimated(hintText);
          hintBtn.textContent = '🙈 Hide Hint';
        }
      });
    }
  }

  function init() {
    nextBtn = document.getElementById('nextToRealLife');

    // Attach click listeners
    const cards = document.querySelectorAll('#challengeGrid .challenge-card');
    cards.forEach(card => {
      card.addEventListener('click', () => handleCardClick(card));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') handleCardClick(card);
      });
    });

    initHint();

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        AudioFX.click();
        Game.goNext();
      });
    }
  }

  return { init };
})();
