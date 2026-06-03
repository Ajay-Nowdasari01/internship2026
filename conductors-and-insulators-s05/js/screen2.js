/* =============================================
   screen2.js — Test the Materials Lab
   ============================================= */

const Screen2 = (() => {

  // Track which materials have been tested
  const tested = new Set();
  const TOTAL_MATERIALS = 6;

  // DOM references (populated lazily on first use)
  let bulbIcon, bulbGlow, wireLeft, wireRight, circuitSlot,
      resultPanel, resultIcon, resultMessage, resultRule,
      sparkContainer, nextBtn;

  function cacheDom() {
    bulbIcon      = document.getElementById('bulbIcon');
    bulbGlow      = document.getElementById('bulbGlow');
    wireLeft      = document.getElementById('wireLeft');
    wireRight     = document.getElementById('wireRight');
    circuitSlot   = document.getElementById('circuitSlot');
    resultPanel   = document.getElementById('resultPanel');
    resultIcon    = document.getElementById('resultIcon');
    resultMessage = document.getElementById('resultMessage');
    resultRule    = document.getElementById('resultRule');
    sparkContainer = document.getElementById('sparkContainer');
    nextBtn       = document.getElementById('nextToChallenge');
  }

  /**
   * Animate material appearing in the circuit slot.
   */
  function showInSlot(emoji, isConductor) {
    if (!circuitSlot) return;

    // Clear old content
    circuitSlot.innerHTML = `<span style="font-size:2.2rem;">${emoji}</span>`;
    circuitSlot.classList.add('anim-popIn');
    circuitSlot.addEventListener('animationend', () => {
      circuitSlot.classList.remove('anim-popIn');
    }, { once: true });

    // Wire colour
    if (isConductor) {
      circuitSlot.classList.add('active');
      wireLeft.classList.add('active');
      wireRight.classList.add('active');
    } else {
      circuitSlot.classList.remove('active');
      wireLeft.classList.remove('active');
      wireRight.classList.remove('active');
    }
  }

  /**
   * Light up or dim the bulb based on test result.
   */
  function animateBulb(isConductor) {
    if (!bulbIcon || !bulbGlow) return;

    if (isConductor) {
      bulbIcon.classList.remove('off');
      bulbIcon.classList.add('on');
      bulbGlow.classList.add('lit');

      // Play electric hum + success chime
      AudioFX.electricHum();
      setTimeout(() => AudioFX.success(), 200);

      // Spawn sparks near the bulb
      if (sparkContainer) {
        spawnSparks(sparkContainer, bulbIcon, '#FFE66D');
      }
    } else {
      bulbIcon.classList.remove('on');
      bulbIcon.classList.add('off');
      bulbGlow.classList.remove('lit');
      AudioFX.error();
    }
  }

  /**
   * Show the result message panel.
   */
  function showResult(isConductor, materialName) {
    if (!resultPanel) return;

    resultPanel.classList.remove('show', 'conductor-result', 'insulator-result');

    if (isConductor) {
      resultIcon.textContent    = '💡✅';
      resultMessage.textContent = `Electricity CAN flow through the ${materialName}!`;
      resultRule.textContent    = 'If the bulb glows → it is a CONDUCTOR';
      resultPanel.classList.add('conductor-result');
    } else {
      resultIcon.textContent    = '🌑❌';
      resultMessage.textContent = `Electricity CANNOT flow through the ${materialName}.`;
      resultRule.textContent    = 'If the bulb stays off → it is an INSULATOR';
      resultPanel.classList.add('insulator-result');
    }

    // Trigger transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resultPanel.classList.add('show'));
    });
  }

  /**
   * Mark a material card as tested with a badge.
   */
  function markCard(card, isConductor) {
    const material = card.dataset.material;
    const badge    = document.getElementById(`badge-${material}`);

    card.classList.add(isConductor ? 'tested-conductor' : 'tested-insulator');
    card.style.pointerEvents = 'none'; // can only test once

    if (badge) {
      badge.textContent = isConductor ? '✓' : '✗';
      badge.classList.add('show', isConductor ? 'conductor-badge' : 'insulator-badge');
    }
  }

  /**
   * Main handler when a material card is clicked.
   */
  function handleMaterialClick(card) {
    const material    = card.dataset.material;
    const isConductor = card.dataset.type === 'conductor';

    if (tested.has(material)) return;
    tested.add(material);

    // Map material to emoji for slot display
    const emojiMap = {
      coin:   '🪙',
      copper: '🔌',
      spoon:  '🥄',
      scale:  '📏',
      eraser: '🧹',
      wood:   '🪵'
    };

    const nameMap = {
      coin:   'Coin',
      copper: 'Copper Wire',
      spoon:  'Spoon',
      scale:  'Plastic Scale',
      eraser: 'Rubber Eraser',
      wood:   'Wooden Stick'
    };

    AudioFX.click();

    // Animate material into slot
    showInSlot(emojiMap[material] || '?', isConductor);

    // Small delay then animate bulb
    setTimeout(() => animateBulb(isConductor), 400);

    // Show result message
    setTimeout(() => showResult(isConductor, nameMap[material] || material), 500);

    // Mark the card
    markCard(card, isConductor);

    // If all tested, show "Next" button
    if (tested.size >= TOTAL_MATERIALS) {
      setTimeout(() => {
        if (nextBtn) showAnimated(nextBtn);
        Guide.say('Great work! You tested all materials! Click Next! 🚀');
      }, 800);
    }
  }

  function init() {
    cacheDom();

    // Attach click handlers to all material cards
    const cards = document.querySelectorAll('#materialsGrid .material-card');
    cards.forEach(card => {
      card.addEventListener('click', () => handleMaterialClick(card));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') handleMaterialClick(card);
      });
    });

    // Next button
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        AudioFX.click();
        Game.goNext();
      });
    }
  }

  return { init };
})();
