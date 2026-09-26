/**
 * CELESTAI consequence engine (flags, chains, eligibility, legacy flags). OWNER: consequences agent.
 * Exposes window.consequenceEngine — see module contract.
 *
 *  - Reign flags: reset every reign (resetReign()).
 *  - Legacy flags: persisted in localStorage "celestai_legacy", survive across reigns.
 *  - History: per-reign list of { id, side } verdicts.
 *  - pick(cards, ctx): weighted random among eligible cards. Chain follow-ups whose
 *    required flags were set 2-6 souls ago are strongly preferred, so consequences
 *    resurface a few souls after the verdict that caused them.
 */
(function () {
  const LEGACY_KEY = "celestai_legacy";
  const CHAIN_MIN_DELAY = 2; // souls between cause and consequence (default)
  const CHAIN_SWEET_MAX = 6; // consequences are most likely within this window

  function storage() {
    try {
      return typeof localStorage !== "undefined" ? localStorage : null;
    } catch (e) {
      return null;
    }
  }

  function loadLegacy() {
    const ls = storage();
    if (!ls) return new Set();
    try {
      const raw = JSON.parse(ls.getItem(LEGACY_KEY) || "[]");
      return new Set(Array.isArray(raw) ? raw.filter((x) => typeof x === "string") : []);
    } catch (e) {
      return new Set();
    }
  }

  function saveLegacy(set) {
    const ls = storage();
    if (!ls) return;
    try {
      ls.setItem(LEGACY_KEY, JSON.stringify([...set]));
    } catch (e) {
      /* quota / privacy mode: ignore */
    }
  }

  function normSide(side) {
    const s = String(side || "").toLowerCase();
    return s === "hell" ? "hell" : "heaven";
  }

  function arr(v) {
    return Array.isArray(v) ? v : [];
  }

  class ConsequenceEngine {
    constructor() {
      this.legacy = loadLegacy();
      this.resetReign();
    }

    resetReign() {
      this.flagMap = new Map(); // flag -> soul index when set
      this.history = []; // [{ id, side }]
      this.shown = new Set(); // ids shown this reign (incl. timeouts)
      // Legacy set during this reign only becomes eligible next reign (cross-reign callbacks).
      this.activeLegacy = new Set(this.legacy);
    }

    // ---- flags -------------------------------------------------------------
    hasFlag(f) {
      return this.flagMap.has(f);
    }

    flags() {
      return [...this.flagMap.keys()];
    }

    hasLegacy(f) {
      return this.legacy.has(f);
    }

    legacyFlags() {
      return [...this.legacy];
    }

    clearLegacy() {
      this.legacy.clear();
      this.activeLegacy.clear();
      saveLegacy(this.legacy);
    }

    soulsJudged() {
      return this.history.length;
    }

    getHistory() {
      return this.history.slice();
    }

    /** Mark a card as presented this reign (so once-cards don't repeat even on timeout). */
    markShown(card) {
      if (card && card.id) this.shown.add(card.id);
    }

    // ---- eligibility -------------------------------------------------------
    isEligible(card, ctx = {}) {
      if (!card || !card.id) return false;
      if (card.once !== false && this.shown.has(card.id)) return false;
      const req = card.requires || {};
      const flagSet = ctx.flags ? new Set(ctx.flags) : null;
      const has = (f) => (flagSet ? flagSet.has(f) || this.flagMap.has(f) : this.flagMap.has(f));
      for (const f of arr(req.flags)) if (!has(f)) return false;
      for (const f of arr(req.notFlags)) if (has(f)) return false;
      for (const f of arr(req.legacy)) if (!this.activeLegacy.has(f)) return false;
      for (const f of arr(req.notLegacy)) if (this.legacy.has(f)) return false;
      const souls = typeof ctx.soulsJudged === "number" ? ctx.soulsJudged : this.history.length;
      if (req.minSouls && souls < req.minSouls) return false;
      return true;
    }

    // ---- verdicts ----------------------------------------------------------
    applyChoice(card, side) {
      if (!card) return;
      const key = normSide(side);
      const outcome = card[key] || {};
      const idx = this.history.length;
      this.markShown(card);
      this.history.push({ id: card.id, side: key });

      for (const f of arr(outcome.clearFlags)) this.flagMap.delete(f);
      for (const f of arr(outcome.setFlags)) this.flagMap.set(f, idx);

      let legacyChanged = false;
      for (const f of arr(outcome.clearLegacy)) {
        if (this.legacy.delete(f)) legacyChanged = true;
      }
      for (const f of arr(outcome.setLegacy)) {
        if (!this.legacy.has(f)) {
          this.legacy.add(f);
          legacyChanged = true;
        }
      }
      if (legacyChanged) saveLegacy(this.legacy);
    }

    // ---- selection ---------------------------------------------------------
    tierWeight(tier, souls) {
      const t = tier || 1;
      if (souls < 4) return t === 1 ? 3 : t === 2 ? 1 : 0.25;
      if (souls < 10) return t === 1 ? 1 : t === 2 ? 3 : 1;
      return t === 1 ? 0.6 : t === 2 ? 1.5 : 3;
    }

    /** How many souls ago the most recent of this card's required flags was set (null if none). */
    chainAge(card, souls) {
      const req = arr(card.requires && card.requires.flags);
      if (!req.length) return null;
      let latest = -1;
      for (const f of req) {
        if (this.flagMap.has(f)) latest = Math.max(latest, this.flagMap.get(f));
      }
      if (latest < 0) return null; // flag came from ctx only
      return souls - 1 - latest;
    }

    weightOf(card, ctx, souls, recent) {
      let w = typeof card.weight === "number" && card.weight > 0 ? card.weight : 1;
      w *= this.tierWeight(card.tier, souls);
      const age = this.chainAge(card, souls);
      if (age !== null) {
        const minDelay = typeof card.delay === "number" ? card.delay : CHAIN_MIN_DELAY;
        if (age < minDelay) return 0; // let the consequence breathe
        w *= age <= CHAIN_SWEET_MAX ? 12 : 4;
      } else if (arr(card.requires && card.requires.legacy).length) {
        w *= 4; // legacy callbacks from past reigns should surface
      }
      if (recent.has(card.id)) w *= 0.02;
      return w;
    }

    weightedPick(list, weights) {
      const total = weights.reduce((a, b) => a + b, 0);
      if (!(total > 0)) return list[Math.floor(Math.random() * list.length)] || null;
      let r = Math.random() * total;
      for (let i = 0; i < list.length; i++) {
        r -= weights[i];
        if (r <= 0) return list[i];
      }
      return list[list.length - 1];
    }

    pick(cards, ctx = {}) {
      const pool = arr(cards).filter((c) => c && c.id && c.heaven && c.hell);
      if (!pool.length) return null;
      const souls = typeof ctx.soulsJudged === "number" ? ctx.soulsJudged : this.history.length;
      const recent = new Set(arr(ctx.recentIds));

      let eligible = pool.filter((c) => this.isEligible(c, ctx));
      let weights = eligible.map((c) => this.weightOf(c, ctx, souls, recent));
      if (!weights.some((w) => w > 0)) {
        // Nothing fresh: allow repeats of non-once cards, then of any requirement-free card.
        const shownBackup = this.shown;
        this.shown = new Set();
        eligible = pool.filter((c) => c.once === false && this.isEligible(c, ctx));
        if (!eligible.length) eligible = pool.filter((c) => this.isEligible(c, ctx));
        this.shown = shownBackup;
        if (!eligible.length) eligible = pool.filter((c) => !c.requires);
        if (!eligible.length) eligible = pool;
        weights = eligible.map((c) => (recent.has(c.id) ? 0.02 : 1) * this.tierWeight(c.tier, souls));
      }
      return this.weightedPick(eligible, weights);
    }
  }

  window.consequenceEngine = new ConsequenceEngine();
})();
