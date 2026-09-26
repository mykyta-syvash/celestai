/**
 * CELESTAI meters (mercy / justice / order / faith). OWNER: meters/core-loop agent.
 * Exposes window.meterSystem — see module contract.
 *
 * Contract: METERS [{key,label,icon}], reset(), get(k), values(), apply(effects) -> { values, deltas, deaths }
 * Extras (core loop only): snapshot()/restore(), set(k,v), setWards(bool), mountHUD(el), renderHUD(),
 * showPreview(effects, revealLevel), clearPreview(), dangerZone(k).
 */
(function () {
  const METERS = [
    { key: "mercy", label: "MERCY", icon: "🕊️" },
    { key: "justice", label: "JUSTICE", icon: "⚖️" },
    { key: "order", label: "ORDER", icon: "📜" },
    { key: "faith", label: "FAITH", icon: "🙏" }
  ];
  const KEYS = METERS.map((m) => m.key);
  const MIN = 0;
  const MAX = 100;
  const START = 50;
  const WARD_LOW = 6;
  const WARD_HIGH = 94;

  let vals = {};
  let wardsEnabled = false;
  let wards = {};
  let hudEl = null;

  const clamp = (v) => Math.max(MIN, Math.min(MAX, Math.round(v)));

  function reset() {
    vals = {};
    wards = {};
    KEYS.forEach((k) => {
      vals[k] = START;
      wards[k] = wardsEnabled;
    });
    renderHUD();
    return values();
  }

  function values() {
    return { ...vals };
  }

  function get(k) {
    return vals[k];
  }

  function set(k, v) {
    if (!KEYS.includes(k)) return;
    vals[k] = clamp(v);
    renderHUD();
  }

  /** WARDS (EXTRA LIFE perk): first time each meter would hit its brink this reign it stops at 6/94. */
  function setWards(enabled) {
    wardsEnabled = !!enabled;
    KEYS.forEach((k) => (wards[k] = wardsEnabled));
  }

  function snapshot() {
    return { values: values(), wards: { ...wards } };
  }

  function restore(snap) {
    if (!snap) return;
    vals = { ...snap.values };
    wards = { ...snap.wards };
    renderHUD();
  }

  function apply(effects) {
    const deltas = {};
    const deaths = [];
    const warded = [];
    const src = effects || {};
    KEYS.forEach((k) => {
      const raw = Number(src[k]) || 0;
      const before = vals[k];
      let after = clamp(before + raw);
      if (raw !== 0 && (after <= MIN || after >= MAX)) {
        if (wards[k]) {
          wards[k] = false;
          after = after <= MIN ? WARD_LOW : WARD_HIGH;
          warded.push(k);
        } else {
          deaths.push({ meter: k, dir: after <= MIN ? "low" : "high" });
        }
      }
      vals[k] = after;
      deltas[k] = after - before;
    });
    renderHUD(deltas);
    return { values: values(), deltas, deaths, warded };
  }

  /** Distance-from-center helper: 0 = balanced, 50 = at the brink. */
  function dangerZone(k) {
    const v = vals[k];
    return v <= 15 || v >= 85;
  }

  // ---------------- HUD ----------------
  function mountHUD(el) {
    hudEl = el || null;
    if (!hudEl) return;
    hudEl.innerHTML = METERS.map(
      (m) => `
      <div class="meter" data-meter="${m.key}" title="${m.label}">
        <span class="meter-dot" aria-hidden="true"></span>
        <div class="meter-glyph">
          <div class="meter-fill"></div>
          <span class="meter-icon">${m.icon}</span>
        </div>
        <span class="meter-label">${m.label}</span>
      </div>`
    ).join("");
    renderHUD();
  }

  function renderHUD(deltas) {
    if (!hudEl) return;
    METERS.forEach((m) => {
      const node = hudEl.querySelector(`[data-meter="${m.key}"]`);
      if (!node) return;
      const v = vals[m.key];
      const fill = node.querySelector(".meter-fill");
      if (fill) fill.style.height = `${v}%`;
      node.classList.toggle("danger", v <= 15 || v >= 85);
      node.setAttribute("aria-label", `${m.label} ${v}`);
      const d = deltas && deltas[m.key];
      if (d) {
        node.classList.remove("pulse-up", "pulse-down");
        void node.offsetWidth; // restart animation
        node.classList.add(d > 0 ? "pulse-up" : "pulse-down");
      }
    });
  }

  /**
   * Reigns-style preview: dot over each meter the side would change.
   * revealLevel 0 = size only (small <8, big >=8), 1 = + direction, 2 = + exact number.
   */
  function showPreview(effects, revealLevel = 0) {
    if (!hudEl) return;
    METERS.forEach((m) => {
      const node = hudEl.querySelector(`[data-meter="${m.key}"]`);
      if (!node) return;
      const dot = node.querySelector(".meter-dot");
      const d = Number(effects && effects[m.key]) || 0;
      node.classList.toggle("previewing", d !== 0);
      if (!dot) return;
      dot.className = "meter-dot";
      dot.textContent = "";
      if (d === 0) return;
      dot.classList.add(Math.abs(d) >= 8 ? "big" : "small");
      if (revealLevel >= 1) {
        dot.classList.add("revealed", d > 0 ? "up" : "down");
        dot.textContent = revealLevel >= 2 ? `${d > 0 ? "+" : ""}${d}` : d > 0 ? "↑" : "↓";
      }
    });
  }

  function clearPreview() {
    showPreview(null);
  }

  reset();

  window.meterSystem = {
    METERS,
    KEYS,
    START,
    reset,
    get,
    set,
    values,
    apply,
    snapshot,
    restore,
    setWards,
    dangerZone,
    mountHUD,
    renderHUD,
    showPreview,
    clearPreview
  };
})();
