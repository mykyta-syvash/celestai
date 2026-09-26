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
// ==========================================
class MoralProfileTracker {
  constructor() {
    this.reset();
  }

  reset() {
    this.totalJudged = 0;
    this.heavenCount = 0;
    this.hellCount = 0;
    this.correctCount = 0;
    this.mistakeCount = 0;
    this.timeouts = 0;

    // Moral dimensions
    this.utilitarianWeight = 0;
    this.deontologyWeight = 0;
    this.mercyWeight = 0;
    this.punisherWeight = 0;
  }

  recordDecision(story, decision, isCorrect) {
    this.totalJudged++;
    if (decision === "HEAVEN") {
      this.heavenCount++;
      if (story && story.moralAxes) {
        this.mercyWeight += story.moralAxes.mercy || 0;
        this.utilitarianWeight += story.moralAxes.utilitarian || 0;
      }
    } else {
      this.hellCount++;
      if (story && story.moralAxes) {
        this.punisherWeight += story.moralAxes.punisher || 0;
        this.deontologyWeight += Math.abs(story.moralAxes.deontology || 0);
      }
    }

    if (isCorrect) {
      this.correctCount++;
    } else {
      this.mistakeCount++;
    }
  }

  recordTimeout() {
    this.totalJudged++;
    this.timeouts++;
    this.mistakeCount++;
  }

  getProfile() {
    const total = Math.max(1, this.totalJudged);
    const mercyRatio = this.mercyWeight / total;
    const punisherRatio = this.punisherWeight / total;
    const utilRatio = this.utilitarianWeight / total;
    const deonRatio = this.deontologyWeight / total;

    if (mercyRatio > 0.55 && this.heavenCount > this.hellCount * 1.5) {
      return {
        title: "THE MERCIFUL",
        reflection: "You consistently sought redemption and forgiveness, granting mercy to flawed souls who carried heavy burdens.",
        dominantTrait: "mercy over retribution"
      };
    } else if (punisherRatio > 0.55 && this.hellCount > this.heavenCount * 1.5) {
      return {
        title: "THE PUNISHER",
        reflection: "You wielded the eternal scales with an unyielding iron hand, refusing to excuse transgressions regardless of excuses.",
        dominantTrait: "uncompromising justice over mercy"
      };
    } else if (utilRatio > 0.5) {
      return {
        title: "THE UTILITARIAN",
        reflection: "You prioritized the greater good and lives preserved, willing to pardon dirty hands if the final outcome saved humanity.",
        dominantTrait: "consequences over rigid rules"
      };
    } else if (deonRatio > 0.5) {
      return {
        title: "THE ABSOLUTIST",
        reflection: "You held sacred the moral commandments, declaring that intentional evil can never be redeemed by post-hoc utility.",
        dominantTrait: "sacred principles over pragmatic calculation"
      };
    } else if (this.heavenCount > this.hellCount) {
      return {
        title: "THE FORGIVER",
        reflection: "You leaned towards compassion when souls showed sacrifice for family and community.",
        dominantTrait: "compassion in the face of human tragedy"
      };
    } else {
      return {
        title: "THE BALANCED JUDGE",
        reflection: "You weighed each soul on its individual merits, balancing justice and mercy without dogma.",
        dominantTrait: "measured impartiality across the celestial divide"
      };
    }
  }

  calculatePlayerDestiny(score) {
    if (score >= 6 && this.mistakeCount <= 3 && this.mercyWeight >= this.punisherWeight * 0.7) {
      return "HEAVEN";
    }
    return "HELL";
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

  evaluateDecision(story, decision, useFinalWord = false) {
    if (!story) return { score: 50, isCorrect: true, feedback: "A measured judgment." };

    let score = decision === "HEAVEN" ? story.heavenDefensibility : story.hellDefensibility;
    let feedback = decision === "HEAVEN" ? story.heavenFeedback : story.hellFeedback;
    let isCorrect = score >= 40;

    let ratingLabel = "DEFENSIBLE";
    if (score >= 70) ratingLabel = "STRONG JUDGMENT";
    else if (score < 40) ratingLabel = "WEAK JUDGMENT";

    // FINAL WORD perk: If AI rates decision as DEBATABLE (40-69), auto-accept as STRONG / correct!
    if (useFinalWord && score >= 40 && score < 70) {
      score = Math.max(score, 75);
      ratingLabel = "FINAL WORD (ACCEPTED)";
      isCorrect = true;
      feedback = "Invoking the Final Word, the Arbiter's decree is made absolute.";
    }

    // Record in profile
    this.profileTracker.recordDecision(story, decision, isCorrect);

    return {
      score,
      ratingLabel,
      isCorrect,
      feedback,
      bothDefensible: story.heavenDefensibility >= 40 && story.hellDefensibility >= 40
    };
  }
}

window.storyDeck = new StoryDeck();
