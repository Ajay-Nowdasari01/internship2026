/* =============================================
   screen1.js — Power Outage screen logic
   ============================================= */

const Screen1 = (() => {

  function init() {
    // Populate the star field
    const starsEl = document.getElementById('stars');
    if (starsEl) createStars(starsEl, 60);

    // Wire up the Start Mission button
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        AudioFX.click();
        Game.goNext(); // advance to screen2
      });
    }
  }

  return { init };
})();
