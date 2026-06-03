# ⚡ Blackout City: Conductors & Insulators

An interactive educational game for 5th-grade students to learn about
electrical conductors and insulators through a story-driven, game-like simulation.

---

## 📁 Folder Structure

```
blackout-city/
│
├── index.html               ← Entry point — all screens live here as <section> tags
│
├── css/
│   ├── reset.css            ← Browser normalisation
│   ├── variables.css        ← Design tokens (colours, fonts, spacing, shadows)
│   ├── layout.css           ← Page structure, screen transitions, progress bar, guide
│   ├── components.css       ← Buttons, cards, circuit board, badges, popups, repair zone
│   ├── animations.css       ← All @keyframes + utility animation classes
│   └── screens.css          ← Per-screen visual scenes (city, lab, powerline, final city)
│
└── js/
    ├── audio.js             ← Web Audio API synth — no external audio files needed
    ├── utils.js             ← Shared helpers: stars, confetti, sparks, screen transitions
    ├── guide.js             ← Sparky the guide — rotating messages per screen
    ├── screen1.js           ← Screen 1 logic: Power Outage + Start Mission
    ├── screen2.js           ← Screen 2 logic: Test the Materials Lab
    ├── screen4.js           ← Screen 4 logic: Choose Wisely challenge
    ├── screen5.js           ← Screen 5 logic: Real Life examples + popups
    ├── screen6.js           ← Screen 6 logic: Final mission, drag-drop, city lights
    └── game.js              ← Master controller: routing, scoring, init (loads last)
```

> **Why no screen3.js?** Screen 3 (Observe the Results) is embedded directly inside
> screen2.js — results appear inline in the lab after each material test.
> Screens are numbered to match the specification document.

---

## 🏗️ Architecture

### Rendering Model
- **Single HTML file** — all 5 screens exist as `<section class="screen">` tags.
  Only one has `class="active"` at a time; transitions use CSS opacity + translateX.
- **No framework** — pure vanilla HTML, CSS, and JavaScript (ES6 IIFEs).
- **No backend, no build step** — open `index.html` and it runs.

### Module Pattern
Every JS file exposes a single frozen IIFE object (e.g. `const Screen2 = (() => { ... })()`).
This avoids global variable collisions while keeping the code simple enough for beginners to read.

### Script Load Order (in index.html)
```
audio.js  →  utils.js  →  guide.js
→  screen1–6.js  →  game.js  (bootstraps everything)
```
`game.js` is loaded last and calls `Screen*.init()` for each module.

### Scoring
Each screen module calls `Game.addPoints(n)` or accumulates its own sub-score
(Screen6 awards 2 pts per correct conductor). The final score is shown on the
success panel. Maximum possible score: ~12 points.

---

## 🚀 How to Run Locally

### Option A — Direct open (simplest)
1. Download or unzip the project.
2. Double-click `index.html` — it opens in your default browser.
3. That's it! No server needed.

### Option B — VS Code Live Server (recommended for development)
1. Open VS Code.
2. Install the **Live Server** extension (Ritwick Dey).
3. Open the `blackout-city/` folder in VS Code.
4. Right-click `index.html` → **"Open with Live Server"**.
5. The game opens at `http://127.0.0.1:5500/`.

### Option C — Python simple server
```bash
cd blackout-city
python -m http.server 8080
# then open http://localhost:8080
```

---

## 🎮 Game Flow

| Screen | Title               | What the student does                          |
|--------|---------------------|------------------------------------------------|
| 1      | Power Outage        | Reads the story, clicks Start Mission          |
| 2      | Test the Lab        | Clicks 6 materials to test conductivity        |
| 3      | (inline in Screen 2)| Sees bulb glow / stay off + explanation        |
| 4      | Choose Wisely       | Identifies 3 conductors from 6 options         |
| 5      | Real Life Examples  | Taps items; reads one-sentence explanations    |
| 6      | Restore the City    | Drags/clicks 3 conductors into repair slots    |

---

## 🧑‍💻 Extending the Game

### Add a new material to Screen 2
1. In `index.html`, duplicate a `.material-card` div inside `#materialsGrid`.
2. Set `data-material="yourname"` and `data-type="conductor"` or `"insulator"`.
3. In `screen2.js`, add an entry to `emojiMap` and `nameMap`.

### Change guide messages
Open `guide.js` and edit the `messages` object — each key is a screen id.

### Add more real-life examples (Screen 5)
Duplicate a `.reallife-card` div in `index.html` inside the correct column.
Set `data-popup="Your explanation sentence."` on the card.

---

## 🌐 Browser Support
Works in all modern browsers (Chrome, Firefox, Safari, Edge).
Web Audio API is used for sound — no external files required.
Drag-and-drop uses native HTML5 drag events.

---

## 📚 Learning Objectives Covered
- ✅ What conductors are (metals that allow current to flow)
- ✅ What insulators are (materials that block current)
- ✅ Why conductors work (free electrons in metals)
- ✅ Why insulators work (no free electrons)
- ✅ Real-world conductor examples (copper wire, charging cable, fan)
- ✅ Real-world insulator examples (rubber gloves, plastic covers, handles)
- ✅ Independent identification via interactive challenge
