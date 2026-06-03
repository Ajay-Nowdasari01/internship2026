/* =============================================
   screen6.js — Final Mission: Restore the City
   ============================================= */

const Screen6 = (() => {

  // Track how many correct conductors were placed
  let slotsFilledCorrect = 0;
  const SLOTS_NEEDED     = 3;

  // Track score across whole game (injected by Game module)
  let gameScore = 0;

  // Which material is being dragged right now
  let draggingCard = null;

  // -------- City light-up animation --------

  function lightUpCity() {
    // Stagger each window lighting up
    const windows = document.querySelectorAll('.fwin');
    windows.forEach(win => {
      const delay = parseFloat(win.dataset.delay || 0) * 1000;
      setTimeout(() => win.classList.add('lit'), delay * 1000 + 200);
    });

    // City glow
    const city = document.getElementById('finalCity');
    if (city) city.classList.add('lit');
  }

  // -------- Success sequence --------

  function triggerSuccess() {
    AudioFX.victory();
    Guide.celebrate();
    lightUpCity();
    launchConfetti(document.getElementById('confettiContainer'), 100);

    // Hide challenge, show success panel
    const challenge = document.getElementById('finalChallenge');
    const panel     = document.getElementById('successPanel');
    if (challenge) challenge.style.display = 'none';
    if (panel) {
      panel.style.display = '';
      panel.classList.add('anim-fadeInUp');
    }

    // Populate score summary
    const scoreSummary = document.getElementById('scoreSummary');
    if (scoreSummary) {
      const stars = gameScore >= 9 ? '⭐⭐⭐' : gameScore >= 6 ? '⭐⭐' : '⭐';
      scoreSummary.innerHTML = `
        <div style="font-size:2.5rem;">${stars}</div>
        <div>Score: ${gameScore} / 12 points</div>
        <div style="font-size:0.85rem; margin-top:4px; font-family: var(--font-body); font-weight:600; opacity:0.75;">Great job, scientist! 🔬</div>
      `;
    }
  }

  // -------- Slot helpers --------

  /**
   * Place a material into a repair slot.
   * @param {HTMLElement} slot - .repair-slot
   * @param {HTMLElement} card - .final-mat-card
   */
  function fillSlot(slot, card) {
    const isConductor = card.dataset.type === 'conductor';
    const text        = card.textContent.trim();

    slot.innerHTML = `<span style="font-size:1.5rem;">${text}</span>`;
    slot.classList.add('anim-slotBounce');
    slot.setAttribute('data-filled', 'true');

    slot.addEventListener('animationend', () => {
      slot.classList.remove('anim-slotBounce');
    }, { once: true });

    if (isConductor) {
      slot.classList.add('filled-correct');
      slotsFilledCorrect++;
      gameScore += 2; // award 2 points per correct conductor
      AudioFX.success();
      Guide.say("Perfect! That's a conductor! ⚡");
    } else {
      slot.classList.add('filled-wrong');
      AudioFX.error();
      Guide.say("Oops! That's an insulator — try a metal next time! 💡");

      // Reject after brief delay: reset slot and card
      setTimeout(() => {
        slot.innerHTML = `<span class="slot-num">${slot.id.replace('slot', '')}</span>`;
        slot.classList.remove('filled-wrong');
        slot.setAttribute('data-filled', 'false');
        card.classList.remove('used');
      }, 1000);
      return; // Don't mark card as used permanently
    }

    // Mark the card as used
    card.classList.add('used');

    // Check win condition
    if (slotsFilledCorrect >= SLOTS_NEEDED) {
      setTimeout(triggerSuccess, 600);
    }
  }

  // -------- Drag & Drop --------

  function initDragDrop() {
    const cards = document.querySelectorAll('#finalMaterials .draggable');
    const slots = document.querySelectorAll('#repairZone .repair-slot');

    // --- Cards: drag events ---
    cards.forEach(card => {
      card.addEventListener('dragstart', e => {
        draggingCard = card;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        draggingCard = null;
      });

      // Also allow click-to-fill (auto-finds first empty slot)
      card.addEventListener('click', () => {
        if (card.classList.contains('used')) return;
        const emptySlot = [...slots].find(s => s.getAttribute('data-filled') === 'false');
        if (emptySlot) {
          AudioFX.click();
          fillSlot(emptySlot, card);
        } else {
          Guide.say("All repair slots are filled! Great work! 🔧");
        }
      });

      card.addEventListener('keydown', e => {
        if ((e.key === 'Enter' || e.key === ' ') && !card.classList.contains('used')) {
          e.preventDefault();
          const emptySlot = [...slots].find(s => s.getAttribute('data-filled') === 'false');
          if (emptySlot) {
            AudioFX.click();
            fillSlot(emptySlot, card);
          }
        }
      });
    });

    // --- Slots: drop events ---
    slots.forEach(slot => {
      slot.addEventListener('dragover', e => {
        if (slot.getAttribute('data-filled') === 'false') {
          e.preventDefault();
          slot.classList.add('dragover');
        }
      });

      slot.addEventListener('dragleave', () => {
        slot.classList.remove('dragover');
      });

      slot.addEventListener('drop', e => {
        e.preventDefault();
        slot.classList.remove('dragover');

        if (slot.getAttribute('data-filled') === 'true') return;
        if (!draggingCard) return;

        fillSlot(slot, draggingCard);
      });
    });
  }

  // -------- Hint --------

  function initHint() {
    const hintBtn  = document.getElementById('hintBtn6');
    const hintText = document.getElementById('hintText6');

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

  // -------- Star generation for final sky --------

  function initFinalStars() {
    const starsEl = document.getElementById('finalStars');
    if (starsEl) createStars(starsEl, 50);
  }

  // -------- Play Again --------

  function initPlayAgain() {
    const btn = document.getElementById('playAgainBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        AudioFX.click();
        Game.restart();
      });
    }
  }

  /**
   * Called by Game module to inject score from previous screens.
   */
  function setGameScore(score) {
    gameScore = score;
  }

  function init() {
    initFinalStars();
    initDragDrop();
    initHint();
    initPlayAgain();
  }

  return { init, setGameScore };
})();
