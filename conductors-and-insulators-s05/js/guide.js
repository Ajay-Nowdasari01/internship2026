/* =============================================
   guide.js — Sparky the guide character
   Controls the speech bubble content per screen.
   ============================================= */

const Guide = (() => {

  // Messages indexed by screen id
  const messages = {
    screen1: [
      "Hi! I'm Sparky ⚡ Let's save the city!",
      "The city is dark! We need to find the right materials!",
      "Click START MISSION when you're ready! 🚀"
    ],
    screen2: [
      "Welcome to the Lab! 🔬 Click a material to test it!",
      "If the bulb glows, electricity can flow through it!",
      "Try all 6 materials! Each one teaches you something! 🧪"
    ],
    screen4: [
      "Now it's your turn! Pick the RIGHT materials! 💪",
      "Metals let electricity flow. Plastic and rubber don't!",
      "Choose 3 conductors to fix the power line! ⚡"
    ],
    screen5: [
      "Look around! Conductors and insulators are everywhere! 🌍",
      "Click each item to learn why we use it!",
      "Copper inside, plastic outside — that's how wires work! 🔌"
    ],
    screen6: [
      "Final challenge! You're almost a hero! 🦸",
      "Drag or click the 3 conducting materials!",
      "You've got this! I believe in you! ⚡✨"
    ],
    success: [
      "AMAZING! 🎉 You restored power to the whole city!",
      "You're a real Power Restoration Hero! 🦸⚡",
      "Science is awesome — and so are you! 🌟"
    ]
  };

  let currentIndex  = 0;
  let currentScreen = 'screen1';
  let rotateTimer   = null;

  const bubbleEl = document.getElementById('guideBubble');
  const textEl   = document.getElementById('guideText');

  /**
   * Set a specific message immediately.
   */
  function say(text) {
    if (!textEl) return;
    textEl.textContent = text;
    // Bounce the bubble
    if (bubbleEl) {
      bubbleEl.style.animation = 'none';
      void bubbleEl.offsetWidth; // reflow
      bubbleEl.style.animation  = '';
    }
  }

  /**
   * Switch to messages for a given screen and start rotating them.
   * @param {string} screenId
   */
  function switchTo(screenId) {
    clearInterval(rotateTimer);
    currentScreen = screenId;
    currentIndex  = 0;

    const list = messages[screenId];
    if (!list || !list.length) return;

    say(list[0]);

    // Rotate every 5 seconds
    rotateTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % list.length;
      say(list[currentIndex]);
    }, 5000);
  }

  /**
   * One-time celebration message on success.
   */
  function celebrate() {
    clearInterval(rotateTimer);
    const list = messages.success;
    let i = 0;
    say(list[i]);
    rotateTimer = setInterval(() => {
      i = (i + 1) % list.length;
      say(list[i]);
    }, 4000);
  }

  return { say, switchTo, celebrate };
})();
