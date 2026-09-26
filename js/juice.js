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
