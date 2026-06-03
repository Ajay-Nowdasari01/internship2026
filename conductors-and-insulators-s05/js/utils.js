/* =============================================
   utils.js — Shared utility helpers
   ============================================= */

/**
 * Animate a progress bar to a target percentage.
 * @param {number} pct  - 0 to 100
 * @param {string} label - e.g. "Step 2 of 6"
 */
function setProgress(pct, label) {
  const fill  = document.getElementById('progressFill');
  const lbl   = document.getElementById('progressLabel');
  if (fill) fill.style.width = pct + '%';
  if (lbl)  lbl.textContent  = label;
}

/**
 * Transition from the current active screen to a new one.
 * @param {string} nextId - e.g. "screen2"
 */
function goToScreen(nextId) {
  const current = document.querySelector('.screen.active');
  const next    = document.getElementById(nextId);
  if (!next || !current) return;

  // Exit animation on current
  current.classList.add('exit-left');

  setTimeout(() => {
    current.classList.remove('active', 'exit-left');
    next.classList.add('active');
  }, 450);
}

/**
 * Create N star elements inside a container.
 * @param {HTMLElement} container
 * @param {number} count
 */
function createStars(container, count = 50) {
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'star';
    s.style.cssText = `
      top:  ${Math.random() * 90}%;
      left: ${Math.random() * 100}%;
      animation: twinkle ${1.5 + Math.random() * 3}s ease-in-out infinite;
      animation-delay: ${Math.random() * 3}s;
      opacity: ${0.3 + Math.random() * 0.7};
      width:  ${1 + Math.random() * 3}px;
      height: ${1 + Math.random() * 3}px;
    `;
    container.appendChild(s);
  }
}

/**
 * Launch confetti particles from the top of the viewport.
 * @param {HTMLElement} container
 * @param {number} count
 */
function launchConfetti(container, count = 80) {
  const colors = ['#FF6B35','#4ECDC4','#FFE66D','#2ECC71','#E74C3C','#9B59B6','#3498DB','#F39C12'];
  container.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';

    const color    = colors[Math.floor(Math.random() * colors.length)];
    const left     = Math.random() * 100;
    const duration = 2 + Math.random() * 3;
    const delay    = Math.random() * 1.5;
    const size     = 6 + Math.random() * 10;
    const rotate   = Math.random() * 360;

    piece.style.cssText = `
      left:             ${left}%;
      background:       ${color};
      width:            ${size}px;
      height:           ${size}px;
      animation-duration:  ${duration}s;
      animation-delay:     ${delay}s;
      transform:        rotate(${rotate}deg);
      border-radius:    ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    container.appendChild(piece);
  }

  // Auto-clear after all pieces have fallen
  setTimeout(() => { container.innerHTML = ''; }, 6000);
}

/**
 * Spawn spark particles around a given element.
 * @param {HTMLElement} container - absolute-positioned parent
 * @param {HTMLElement} origin    - element to spark around
 * @param {string}      color     - CSS colour
 */
function spawnSparks(container, origin, color = '#FFE66D') {
  const rect    = origin.getBoundingClientRect();
  const contRect = container.getBoundingClientRect();
  const cx = rect.left - contRect.left + rect.width  / 2;
  const cy = rect.top  - contRect.top  + rect.height / 2;

  for (let i = 0; i < 10; i++) {
    const p = document.createElement('div');
    p.className = 'spark-particle';
    const angle = (Math.random() * Math.PI * 2);
    const dist  = 30 + Math.random() * 60;
    const tx    = Math.cos(angle) * dist;
    const ty    = Math.sin(angle) * dist;

    p.style.cssText = `
      left:       ${cx}px;
      top:        ${cy}px;
      background: ${color};
      --tx:       ${tx}px;
      --ty:       ${ty}px;
      animation-delay: ${Math.random() * 0.15}s;
    `;
    container.appendChild(p);
    // Remove after animation
    setTimeout(() => p.remove(), 800);
  }
}

/**
 * Show an element with a fade-in-up animation.
 * @param {HTMLElement} el
 */
function showAnimated(el) {
  el.style.display = '';
  el.classList.add('anim-fadeInUp');
  el.addEventListener('animationend', () => {
    el.classList.remove('anim-fadeInUp');
  }, { once: true });
}
