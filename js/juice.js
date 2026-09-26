/**
 * CELESTAI juice: purely visual feedback (verdict stamp, panic vignette, card pop).
 * Listens to game events only — no gameplay logic here.
 */
(function () {
  const wrapper = () => document.getElementById("game-wrapper");

  function el(cls) {
    const d = document.createElement("div");
    d.className = cls;
    wrapper().appendChild(d);
    return d;
  }

  let stamp, vignette;
  window.addEventListener("DOMContentLoaded", () => {
    stamp = el("juice-stamp");
    vignette = el("juice-vignette");
  });

  // Giant slam stamp on every verdict
  window.addEventListener("celestai:verdict", (e) => {
    const side = e.detail && e.detail.side;
    if (!stamp || !side) return;
    stamp.textContent = side === "HEAVEN" ? "HEAVEN" : "HELL";
    stamp.className = "juice-stamp " + (side === "HEAVEN" ? "heaven" : "hell");
    void stamp.offsetWidth; // restart animation
    stamp.classList.add("slam");
    const w = wrapper();
    w.classList.remove("juice-shake");
    void w.offsetWidth;
    w.classList.add("juice-shake");
  });

  // Card pops in for every new soul
  window.addEventListener("celestai:soul", () => {
    const card = document.getElementById("story-card");
    if (!card) return;
    card.classList.remove("juice-pop");
    void card.offsetWidth;
    card.classList.add("juice-pop");
  });

  // Red panic vignette in the last 2 seconds
  (function loop() {
    const g = window.game;
    if (vignette && g) {
      const panic = g.state === "JUDGING" && g.timedMode && !g.isTimeFrozen && g.timeLeft <= 2;
      vignette.classList.toggle("on", !!panic);
    }
    requestAnimationFrame(loop);
  })();
})();

/* Cringe voices: Animal-Crossing-style gibberish for every soul + "nooo"/"yaaay" on verdicts */
(function () {
  let ctx;
  const audio = () => {
    if (window.soundEngine && window.soundEngine.enabled === false) return null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = ctx || (window.soundEngine && window.soundEngine.ctx) || new AC();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };
  const hash = (s) => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); };

  // One vocal "syllable": buzzy oscillator through a formant-ish bandpass with a quick pitch wobble
  function syllable(a, t, freq, dur, vol) {
    const osc = a.createOscillator(); const bp = a.createBiquadFilter(); const g = a.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq * 1.15, t);
    osc.frequency.exponentialRampToValueAtTime(freq * (0.85 + Math.random() * 0.3), t + dur);
    bp.type = "bandpass"; bp.frequency.value = 700 + Math.random() * 1400; bp.Q.value = 2.5;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(bp); bp.connect(g); g.connect(a.destination);
    osc.start(t); osc.stop(t + dur + 0.02);
  }

  function babble(card) {
    const a = audio(); if (!a || !card) return;
    const h = hash(card.name || card.id);
    const base = 140 + (h % 260);                      // every soul gets its own voice
    const words = 6 + (h % 6);
    let t = a.currentTime + 0.05;
    for (let i = 0; i < words; i++) {
      const dur = 0.05 + Math.random() * 0.06;
      syllable(a, t, base * (0.8 + Math.random() * 0.5), dur, 0.09);
      t += dur + 0.015 + (Math.random() < 0.2 ? 0.08 : 0);
    }
  }

  function slide(from, to, dur, type) {
    const a = audio(); if (!a) return;
    const t = a.currentTime;
    const osc = a.createOscillator(); const g = a.createGain(); const vib = a.createOscillator(); const vg = a.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t);
    osc.frequency.exponentialRampToValueAtTime(to, t + dur);
    vib.frequency.value = 7; vg.gain.value = from * 0.04; vib.connect(vg); vg.connect(osc.frequency);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(a.destination);
    osc.start(t); vib.start(t); osc.stop(t + dur + 0.05); vib.stop(t + dur + 0.05);
  }

  window.addEventListener("celestai:soul", (e) => babble(e.detail));
  window.addEventListener("celestai:verdict", (e) => {
    const side = e.detail && e.detail.side;
    if (side === "HELL") slide(420, 90, 0.7, "square");      // "noooooo"
    else if (side === "HEAVEN") slide(300, 900, 0.45, "triangle"); // "yaaaay"
  });
})();
