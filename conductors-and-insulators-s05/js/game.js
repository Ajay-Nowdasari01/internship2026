/* =============================================
   game.js — Main game controller
   Handles screen flow, scoring, and init.
   ============================================= */

const Game = (() => {

  // ---- Screen order & config ----
  const SCREENS = [
    { id: 'screen1', progress: 14,  label: 'Step 1 of 6', guide: 'screen1' },
    { id: 'screen2', progress: 32,  label: 'Step 2 of 6', guide: 'screen2' },
    { id: 'screen4', progress: 54,  label: 'Step 3 of 6', guide: 'screen4' },
    { id: 'screen5', progress: 76,  label: 'Step 4 of 6', guide: 'screen5' },
    { id: 'screen6', progress: 95,  label: 'Step 5 of 6', guide: 'screen6' },
  ];

  let currentIndex = 0;

  // Running score (awarded by individual screens)
  let score = 0;

  // ---- Navigation ----

  /**
   * Go to the next screen in the flow.
   */
  function goNext() {
    if (currentIndex >= SCREENS.length - 1) return;
    currentIndex++;
    showScreen(currentIndex);
  }

  /**
   * Activate a screen by index.
   */
  function showScreen(index) {
    const cfg = SCREENS[index];
    if (!cfg) return;

    goToScreen(cfg.id);          // utils.js transition
    setProgress(cfg.progress, cfg.label); // utils.js progress
    Guide.switchTo(cfg.guide);   // guide.js messages
  }

  // ---- Score helpers ----

  function addPoints(pts) {
    score += pts;
  }

  function getScore() {
    return score;
  }

  // ---- Restart ----

  /**
   * Full game reset: reload the page so all state is fresh.
   */
  function restart() {
    window.location.reload();
  }

  // ---- Init ----

  function init() {
    // Initialise each screen module
    Screen1.init();
    Screen2.init();
    Screen4.init();
    Screen5.init();
    Screen6.init();

    // Pass a score reference into Screen6 so final summary is correct
    // (Screen6 accumulates its own sub-score; Game provides the base)
    Screen6.setGameScore(0);

    // Show first screen
    showScreen(0);
  }

  // Boot once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { goNext, addPoints, getScore, restart };
})();
