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
    this.allCases = [...MORAL_CASES];
    this.profileTracker = new MoralProfileTracker();
    this.usedIds = new Set();
    this.nextPreparedSoul = null;

    // Pre-generate initial soul
    this.prefetchNext(0);
  }

  reset() {
    this.usedIds.clear();
    this.profileTracker.reset();
    this.nextPreparedSoul = null;
    this.prefetchNext(0);
  }

  getTierCases(currentScore) {
    let tier = 1;
    if (currentScore >= 9) {
      tier = 3;
    } else if (currentScore >= 4) {
      tier = 2;
    }

    let cases = this.allCases.filter((c) => c.tier === tier && !this.usedIds.has(c.id));
    if (cases.length === 0) {
      cases = this.allCases.filter((c) => !this.usedIds.has(c.id));
    }
    if (cases.length === 0) {
      this.usedIds.clear();
      cases = this.allCases.filter((c) => c.tier === tier);
    }
    return cases;
  }

  prefetchNext(currentScore) {
    const candidates = this.getTierCases(currentScore);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)] || this.allCases[0];
    this.nextPreparedSoul = chosen;
    return chosen;
  }

  nextStory(currentScore = 0) {
    let story = this.nextPreparedSoul;
    if (!story) {
      story = this.prefetchNext(currentScore);
    }
    this.usedIds.add(story.id);

    // Immediately prefetch the NEXT soul in background!
    setTimeout(() => {
      this.prefetchNext(currentScore + 1);
    }, 10);

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
