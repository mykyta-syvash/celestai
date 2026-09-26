/**
 * Celestial Judgment - Enhanced Moral Cases & AI Evaluation Engine
 * Multi-tier moral complexity, dual-defensibility scoring (0-100),
 * hidden facts for TRUE SIGHT, moral analysis for MORAL CLARITY,
 * background soul pre-generation, and player moral profiling.
 */

// Legacy MORAL_CASES array removed: all cards now live in window.CELESTAI_CARDS (js/cards/*.js).
const MORAL_CASES = window.CELESTAI_CARDS || [];

// ==========================================
// PLAYER MORAL PROFILING TRACKER
// Profile = which meters the player's chosen verdicts pushed (cumulative deltas).
// ==========================================
const PROFILE_ARCHETYPES = {
  mercy: {
    up: { title: "THE MERCIFUL", dominantTrait: "compassion over retribution", reflection: "Your verdicts poured mercy into Heaven, lifting souls that had not always earned the light." },
    down: { title: "THE STERN", dominantTrait: "discipline over compassion", reflection: "You starved Heaven of mercy, demanding that every soul pay the full price of its deeds." }
  },
  justice: {
    up: { title: "THE PUNISHER", dominantTrait: "uncompromising justice", reflection: "You wielded the scales with an iron hand; no sin went unanswered in your court." },
    down: { title: "THE LENIENT", dominantTrait: "pardon over punishment", reflection: "Sin slipped through your court unpunished; you forgave what others would have condemned." }
  },
  order: {
    up: { title: "THE LAWGIVER", dominantTrait: "celestial order and procedure", reflection: "You kept the heavenly ledgers balanced and the gates orderly, even when the heart argued otherwise." },
    down: { title: "THE REVOLUTIONARY", dominantTrait: "conscience over procedure", reflection: "You tore through celestial procedure, judging by conscience while the Scribes despaired." }
  },
  faith: {
    up: { title: "THE PROPHET", dominantTrait: "the faith of mortals", reflection: "Mortals below believed in your verdicts; every judgment was a sermon they could understand." },
    down: { title: "THE HERETIC", dominantTrait: "truth over popularity", reflection: "Your verdicts shook the faith of mortals; you judged what was right, not what they wanted to hear." }
  }
};

class MoralProfileTracker {
  constructor() {
    this.reset();
  }

  reset() {
    this.totalJudged = 0;
    this.heavenCount = 0;
    this.hellCount = 0;
    this.timeouts = 0;
    this.cumulative = { mercy: 0, justice: 0, order: 0, faith: 0 };
  }

  _addDeltas(deltas) {
    if (!deltas) return;
    Object.keys(this.cumulative).forEach((k) => {
      this.cumulative[k] += Number(deltas[k]) || 0;
    });
  }

  /** deltas = meter changes actually applied by this verdict (meterSystem.apply(...).deltas). */
  recordDecision(story, decision, deltas) {
    this.totalJudged++;
    if (decision === "HEAVEN") this.heavenCount++;
    else this.hellCount++;
    this._addDeltas(deltas);
  }

  recordTimeout(deltas) {
    this.totalJudged++;
    this.timeouts++;
    this._addDeltas(deltas);
  }

  getProfile() {
    let bestKey = null;
    let bestAbs = 0;
    Object.entries(this.cumulative).forEach(([k, v]) => {
      if (Math.abs(v) > bestAbs) {
        bestAbs = Math.abs(v);
        bestKey = k;
      }
    });

    if (!bestKey || bestAbs < 15) {
      return {
        title: "THE BALANCED JUDGE",
        reflection: "You weighed each soul on its own merits, never letting one virtue of Heaven swallow the others.",
        dominantTrait: "measured balance across the celestial divide",
        meter: null
      };
    }
    const dir = this.cumulative[bestKey] > 0 ? "up" : "down";
    return { ...PROFILE_ARCHETYPES[bestKey][dir], meter: bestKey, dir };
  }

  /**
   * Destiny from the final balance of the meters: a long reign that kept the
   * surviving meters near the center earns Heaven.
   */
  calculatePlayerDestiny(score, meters, deathMeter) {
    const m = meters || (window.meterSystem ? window.meterSystem.values() : null);
    if (!m) return score >= 8 ? "HEAVEN" : "HELL";
    const keys = Object.keys(m).filter((k) => k !== deathMeter);
    const dev = keys.reduce((sum, k) => sum + Math.abs(m[k] - 50), 0) / Math.max(1, keys.length);
    return score >= 8 && dev <= 22 ? "HEAVEN" : "HELL";
  }
}

// ==========================================
// STORY DECK WITH TIER PROGRESSION & PRE-GENERATION
// ==========================================
class StoryDeck {
  constructor() {
    this.profileTracker = new MoralProfileTracker();
    this.usedIds = new Set();
    this.recentIds = [];
    this.nextPreparedSoul = null;
    this.preparedAt = null;
    this.soulsServed = 0;
    this.fallbackCase = {
      id: "fallback_soul", tier: 1, archetype: "farmer", name: "Nameless Wanderer", age: 40, title: "Lost Soul",
      dilemma: "A quiet life, neither cruel nor kind. The ledger is nearly blank.",
      virtue: "Never harmed anyone on purpose.", sin: "Never helped anyone either.",
      once: false,
      heaven: { effects: { mercy: 5, justice: -5 }, feedback: "A gentle verdict for a gentle nobody.", quote: "Thank you... I think." },
      hell: { effects: { justice: 5, mercy: -5 }, feedback: "Indifference judged harshly.", quote: "I did nothing wrong!" }
    };
    this.prefetchNext();
  }

  /** Card source: window.CELESTAI_CARDS (deck.js + chains.js + generated.js). */
  get allCases() {
    const cards = Array.isArray(window.CELESTAI_CARDS) ? window.CELESTAI_CARDS : [];
    return cards.length ? cards : [this.fallbackCase];
  }

  reset() {
    this.usedIds.clear();
    this.recentIds = [];
    this.soulsServed = 0;
    this.profileTracker.reset();
    window.consequenceEngine?.resetReign?.();
    this.nextPreparedSoul = null;
    this.preparedAt = null;
    this.prefetchNext();
  }

  /** Selection context, computed at call time (never assumed from a stale score). */
  buildContext() {
    const judged = window.consequenceEngine?.soulsJudged?.();
    return {
      meters: window.meterSystem?.values?.() || {},
      flags: window.consequenceEngine?.flags?.() || [],
      soulsJudged: typeof judged === "number" ? Math.max(judged, this.soulsServed) : this.soulsServed,
      recentIds: this.recentIds.slice(-6)
    };
  }

  /** Legacy tier filter (fallback only); real selection goes through consequenceEngine.pick. */
  getTierCases(soulsJudged) {
    const ctx = this.buildContext();
    const souls = typeof soulsJudged === "number" ? soulsJudged : ctx.soulsJudged;
    const tier = souls >= 10 ? 3 : souls >= 4 ? 2 : 1;
    const engine = window.consequenceEngine;
    const ok = (c) => (engine?.isEligible ? engine.isEligible(c, ctx) : !this.usedIds.has(c.id));
    let cases = this.allCases.filter((c) => c.tier === tier && ok(c));
    if (cases.length === 0) cases = this.allCases.filter(ok);
    if (cases.length === 0) cases = this.allCases.filter((c) => c.once === false || !this.usedIds.has(c.id));
    if (cases.length === 0) cases = this.allCases.filter((c) => !c.requires);
    return cases.length ? cases : this.allCases;
  }

  pickCard(ctx) {
    let card = null;
    try {
      card = window.consequenceEngine?.pick?.(this.allCases, ctx) || null;
    } catch (e) {
      console.warn("[StoryDeck] consequenceEngine.pick failed", e);
    }
    if (!card) {
      const cases = this.getTierCases(ctx.soulsJudged);
      card = cases[Math.floor(Math.random() * cases.length)];
    }
    return card || this.fallbackCase;
  }

  stateKey(ctx) {
    return ctx.soulsJudged + "|" + ctx.flags.join(",");
  }

  /** Prepares a soul for the CURRENT state; nextStory re-picks if the state changed since. */
  prefetchNext() {
    const ctx = this.buildContext();
    this.nextPreparedSoul = this.pickCard(ctx);
    this.preparedAt = this.stateKey(ctx);
    return this.nextPreparedSoul;
  }

  takeAiSoul() {
    try {
      const card = window.aiSouls?.take?.();
      if (card && card.id && card.name && card.archetype && card.heaven && card.hell) return card;
    } catch (e) {
      /* AI souls are optional */
    }
    return null;
  }

  nextStory() {
    const ctx = this.buildContext();
    let story = null;

    // Every ~3rd soul, try an AI-generated soul.
    if ((this.soulsServed + 1) % 3 === 0) story = this.takeAiSoul();

    if (!story) {
      const prepared = this.nextPreparedSoul;
      const engine = window.consequenceEngine;
      const stillValid =
        prepared && this.preparedAt === this.stateKey(ctx) && (!engine?.isEligible || engine.isEligible(prepared, ctx));
      story = stillValid ? prepared : this.pickCard(ctx);
    }

    this.nextPreparedSoul = null;
    this.preparedAt = null;
    this.soulsServed++;
    this.usedIds.add(story.id);
    this.recentIds.push(story.id);
    if (this.recentIds.length > 12) this.recentIds.shift();
    window.consequenceEngine?.markShown?.(story);

    // Warm the AI queue with the context at call time.
    try {
      window.aiSouls?.prefetch?.(this.buildContext());
    } catch (e) {
      /* optional */
    }

    return story;
  }

  /**
   * Returns what a verdict WOULD do (pure; the core loop applies + records it).
   * { side, effects, feedback, quote, setFlags, clearFlags }
   */
  evaluateDecision(story, decision) {
    const side = decision === "HEAVEN" ? "heaven" : "hell";
    const branch = story && story[side];
    if (branch && branch.effects) {
      return {
        side,
        effects: { ...branch.effects },
        feedback: branch.feedback || "",
        quote: branch.quote || "",
        setFlags: branch.setFlags || [],
        clearFlags: branch.clearFlags || []
      };
    }
    // Legacy fallback (pre-schema cases): tiny symmetric effects so the loop never breaks.
    const legacyFeedback = story ? story[side + "Feedback"] : "";
    const legacyQuote = story ? story[side + "Quote"] : "";
    return {
      side,
      effects: side === "heaven" ? { mercy: 6, justice: -6 } : { mercy: -6, justice: 6 },
      feedback: legacyFeedback || "A measured judgment.",
      quote: legacyQuote || "",
      setFlags: [],
      clearFlags: []
    };
  }
}

window.storyDeck = new StoryDeck();
