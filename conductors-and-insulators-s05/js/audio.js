/* =============================================
   audio.js — Web Audio API sound effects
   No external files needed; tones are synthesised.
   ============================================= */

const AudioFX = (() => {
  // Create audio context lazily (requires user gesture first)
  let ctx = null;

  function getCtx() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio not supported');
        return null;
      }
    }
    // Resume if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /**
   * Play a simple synthesised tone.
   * @param {number} frequency - Hz
   * @param {string} type      - oscillator wave type
   * @param {number} duration  - seconds
   * @param {number} volume    - 0..1
   */
  function playTone(frequency, type = 'sine', duration = 0.2, volume = 0.3) {
    const c = getCtx();
    if (!c) return;

    const osc  = c.createOscillator();
    const gain = c.createGain();

    osc.type      = type;
    osc.frequency.setValueAtTime(frequency, c.currentTime);

    gain.gain.setValueAtTime(volume, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);

    osc.connect(gain);
    gain.connect(c.destination);

    osc.start(c.currentTime);
    osc.stop(c.currentTime + duration);
  }

  /**
   * Play a short success jingle (two rising notes).
   */
  function success() {
    playTone(523, 'triangle', 0.15, 0.3);             // C5
    setTimeout(() => playTone(659, 'triangle', 0.2, 0.3), 120); // E5
    setTimeout(() => playTone(784, 'triangle', 0.3, 0.4), 260); // G5
  }

  /**
   * Play a short error buzz.
   */
  function error() {
    playTone(220, 'sawtooth', 0.18, 0.25);
    setTimeout(() => playTone(180, 'sawtooth', 0.22, 0.20), 140);
  }

  /**
   * Play a "click" UI tap sound.
   */
  function click() {
    playTone(880, 'sine', 0.07, 0.15);
  }

  /**
   * Play the big victory fanfare.
   */
  function victory() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 'triangle', 0.35, 0.40), i * 130);
    });
    setTimeout(() => playTone(1047, 'triangle', 0.7, 0.50), 600);
  }

  /**
   * Play a soft "electricity hum" for the circuit test.
   */
  function electricHum() {
    playTone(100, 'sawtooth', 0.4, 0.18);
    playTone(200, 'sine', 0.4, 0.12);
  }

  return { success, error, click, victory, electricHum };
})();
