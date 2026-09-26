/**
 * CELESTAI - Permanent Achievement System & Event Tracking Engine
 * Manages 50 unique achievements across 5 categories:
 * JUDGMENT, STREAK & SPEED, SURVIVAL, SKILLS, SPECIAL.
 *
 * Persists unlocked achievements, progress counters, and lifetime stats.
 * Provides event-driven verification, non-intrusive toast notifications,
 * and category filtering.
 */

const ACHIEVEMENT_DEFINITIONS = [
  // ==========================================
  // 1. JUDGMENT (10 ACHIEVEMENTS)
  // ==========================================
  {
    id: "first_judgment",
    name: "FIRST JUDGMENT",
    description: "Judge your first soul.",
    category: "JUDGMENT",
    icon: "⚖️",
    secret: false,
    target: 1,
    xpReward: 2
  },
  {
    id: "judge_10",
    name: "JUDGE",
    description: "Judge 10 souls correctly.",
    category: "JUDGMENT",
    icon: "📜",
    secret: false,
    target: 10,
    xpReward: 2
  },
  {
    id: "just_beginning",
    name: "JUST BEGINNING",
    description: "Judge 25 souls correctly.",
    category: "JUDGMENT",
    icon: "✨",
    secret: false,
    target: 25,
    xpReward: 2
  },
  {
    id: "seasoned_judge",
    name: "SEASONED JUDGE",
    description: "Judge 50 souls correctly.",
    category: "JUDGMENT",
    icon: "🕯️",
    secret: false,
    target: 50,
    xpReward: 5
  },
  {
    id: "divine_judge",
    name: "DIVINE JUDGE",
    description: "Judge 100 souls correctly.",
    category: "JUDGMENT",
    icon: "👑",
    secret: false,
    target: 100,
    xpReward: 5
  },
  {
    id: "supreme_judge",
    name: "SUPREME JUDGE",
    description: "Judge 250 souls correctly.",
    category: "JUDGMENT",
    icon: "🏛️",
    secret: false,
    target: 250,
    xpReward: 10
  },
  {
    id: "judgment_day",
    name: "JUDGMENT DAY",
    description: "Judge 500 souls correctly.",
    category: "JUDGMENT",
    icon: "🌟",
    secret: false,
    target: 500,
    xpReward: 10
  },
  {
    id: "heavens_gatekeeper",
    name: "HEAVEN'S GATEKEEPER",
    description: "Send 100 souls to Heaven.",
    category: "JUDGMENT",
    icon: "🪽",
    secret: false,
    target: 100,
    xpReward: 5
  },
  {
    id: "hells_gatekeeper",
    name: "HELL'S GATEKEEPER",
    description: "Send 100 souls to Hell.",
    category: "JUDGMENT",
    icon: "🔥",
    secret: false,
    target: 100,
    xpReward: 5
  },
  {
    id: "equal_justice",
    name: "EQUAL JUSTICE",
    description: "Send 50 souls to Heaven and 50 souls to Hell.",
    category: "JUDGMENT",
    icon: "⚖️",
    secret: false,
    target: 50,
    xpReward: 5
  },

  // ==========================================
  // 2. STREAK & SPEED (10 ACHIEVEMENTS)
  // ==========================================
  {
    id: "on_fire",
    name: "ON FIRE",
    description: "Reach a 5 judgment streak.",
    category: "STREAK & SPEED",
    icon: "🔥",
    secret: false,
    target: 5,
    xpReward: 2
  },
  {
    id: "unstoppable",
    name: "UNSTOPPABLE",
    description: "Reach a 10 judgment streak.",
    category: "STREAK & SPEED",
    icon: "⚡",
    secret: false,
    target: 10,
    xpReward: 5
  },
  {
    id: "divine_streak",
    name: "DIVINE STREAK",
    description: "Reach a 20 judgment streak.",
    category: "STREAK & SPEED",
    icon: "☄️",
    secret: false,
    target: 20,
    xpReward: 10
  },
  {
    id: "perfect_judgment",
    name: "PERFECT JUDGMENT",
    description: "Judge 10 souls correctly in a row.",
    category: "STREAK & SPEED",
    icon: "🎯",
    secret: false,
    target: 10,
    xpReward: 5
  },
  {
    id: "no_mercy",
    name: "NO MERCY",
    description: "Send 10 souls to Hell in a row.",
    category: "STREAK & SPEED",
    icon: "🌋",
    secret: false,
    target: 10,
    xpReward: 5
  },
  {
    id: "guardian_angel",
    name: "GUARDIAN ANGEL",
    description: "Send 10 souls to Heaven in a row.",
    category: "STREAK & SPEED",
    icon: "🕊️",
    secret: false,
    target: 10,
    xpReward: 5
  },
  {
    id: "last_second",
    name: "LAST SECOND",
    description: "Make a correct judgment with less than 1 second remaining.",
    category: "STREAK & SPEED",
    icon: "⏱️",
    secret: false,
    target: 1,
    xpReward: 5
  },
  {
    id: "speed_judge",
    name: "SPEED JUDGE",
    description: "Make 5 correct judgments in a row in under 2 seconds each.",
    category: "STREAK & SPEED",
    icon: "💨",
    secret: false,
    target: 5,
    xpReward: 5
  },
  {
    id: "clutch",
    name: "CLUTCH",
    description: "Make a correct judgment with exactly 1 life remaining.",
    category: "STREAK & SPEED",
    icon: "🩸",
    secret: false,
    target: 1,
    xpReward: 5
  },
  {
    id: "against_the_clock",
    name: "AGAINST THE CLOCK",
    description: "Make 25 correct judgments under 2 seconds.",
    category: "STREAK & SPEED",
    icon: "⏳",
    secret: false,
    target: 25,
    xpReward: 5
  },

  // ==========================================
  // 3. SURVIVAL (10 ACHIEVEMENTS)
  // ==========================================
  {
    id: "survivor",
    name: "SURVIVOR",
    description: "Judge 20 souls in a single run.",
    category: "SURVIVAL",
    icon: "🛡️",
    secret: false,
    target: 20,
    xpReward: 5
  },
  {
    id: "endurance",
    name: "ENDURANCE",
    description: "Judge 50 souls in a single run.",
    category: "SURVIVAL",
    icon: "🗿",
    secret: false,
    target: 50,
    xpReward: 10
  },
  {
    id: "immortal",
    name: "IMMORTAL",
    description: "Judge 100 souls in a single run.",
    category: "SURVIVAL",
    icon: "🌌",
    secret: false,
    target: 100,
    xpReward: 10
  },
  {
    id: "three_lives",
    name: "THREE LIVES",
    description: "Judge 10 souls without losing a life.",
    category: "SURVIVAL",
    icon: "💎",
    secret: false,
    target: 10,
    xpReward: 5
  },
  {
    id: "untouchable",
    name: "UNTOUCHABLE",
    description: "Judge 25 souls without losing a life.",
    category: "SURVIVAL",
    icon: "✨",
    secret: false,
    target: 25,
    xpReward: 10
  },
  {
    id: "near_death",
    name: "NEAR DEATH",
    description: "Make a correct judgment with only one life remaining.",
    category: "SURVIVAL",
    icon: "❤️‍🔥",
    secret: false,
    target: 1,
    xpReward: 2
  },
  {
    id: "second_chance",
    name: "SECOND CHANCE",
    description: "Use Second Chance and make the second judgment correctly.",
    category: "SURVIVAL",
    icon: "🔄",
    secret: false,
    target: 1,
    xpReward: 5
  },
  {
    id: "divine_intervention",
    name: "DIVINE INTERVENTION",
    description: "Survive using Divine Intervention.",
    category: "SURVIVAL",
    icon: "💫",
    secret: false,
    target: 1,
    xpReward: 5
  },
  {
    id: "blessed",
    name: "BLESSED",
    description: "Be forgiven by the Divine.",
    category: "SURVIVAL",
    icon: "🕊️",
    secret: false,
    target: 1,
    xpReward: 5
  },
  {
    id: "immortal_soul",
    name: "IMMORTAL SOUL",
    description: "Survive a fatal mistake with Immortal Soul.",
    category: "SURVIVAL",
    icon: "🛡️",
    secret: false,
    target: 1,
    xpReward: 5
  },

  // ==========================================
  // 4. SKILLS (10 ACHIEVEMENTS)
  // ==========================================
  {
    id: "first_power",
    name: "FIRST POWER",
    description: "Unlock your first divine skill.",
    category: "SKILLS",
    icon: "🔮",
    secret: false,
    target: 1,
    xpReward: 2
  },
  {
    id: "time_lord",
    name: "TIME LORD",
    description: "Use Time Pause 10 times.",
    category: "SKILLS",
    icon: "⏸️",
    secret: false,
    target: 10,
    xpReward: 5
  },
  {
    id: "time_bender",
    name: "TIME BENDER",
    description: "Use Time Dilation 10 times.",
    category: "SKILLS",
    icon: "⏳",
    secret: false,
    target: 10,
    xpReward: 5
  },
  {
    id: "true_sight",
    name: "TRUE SIGHT",
    description: "Use True Sight 10 times.",
    category: "SKILLS",
    icon: "👁️",
    secret: false,
    target: 10,
    xpReward: 5
  },
  {
    id: "clarity",
    name: "CLARITY",
    description: "Use Moral Clarity 10 times.",
    category: "SKILLS",
    icon: "⚖️",
    secret: false,
    target: 10,
    xpReward: 5
  },
  {
    id: "double_vision",
    name: "DOUBLE VISION",
    description: "Use Double Judgment 10 times.",
    category: "SKILLS",
    icon: "⚡",
    secret: false,
    target: 10,
    xpReward: 5
  },
  {
    id: "final_word",
    name: "FINAL WORD",
    description: "Successfully activate Final Word.",
    category: "SKILLS",
    icon: "📜",
    secret: false,
    target: 1,
    xpReward: 5
  },
  {
    id: "full_authority",
    name: "FULL AUTHORITY",
    description: "Unlock every skill in the Authority branch.",
    category: "SKILLS",
    icon: "👑",
    secret: false,
    target: 4,
    xpReward: 10
  },
  {
    id: "full_justice",
    name: "FULL JUSTICE",
    description: "Unlock every skill in the Justice branch.",
    category: "SKILLS",
    icon: "⚖️",
    secret: false,
    target: 4,
    xpReward: 10
  },
  {
    id: "full_divinity",
    name: "FULL DIVINITY",
    description: "Unlock every skill in the Divinity branch.",
    category: "SKILLS",
    icon: "🕊️",
    secret: false,
    target: 4,
    xpReward: 10
  },

  // ==========================================
  // 5. SPECIAL (10 ACHIEVEMENTS)
  // ==========================================
  {
    id: "whoops",
    name: "WHOOPS",
    description: "Run out of time.",
    category: "SPECIAL",
    icon: "⏰",
    secret: true,
    target: 1,
    xpReward: 2
  },
  {
    id: "overthinker",
    name: "OVERTHINKER",
    description: "Take almost the entire timer and still make the correct judgment.",
    category: "SPECIAL",
    icon: "🤔",
    secret: true,
    target: 1,
    xpReward: 5
  },
  {
    id: "mercy",
    name: "MERCY",
    description: "Defend a morally controversial soul.",
    category: "SPECIAL",
    icon: "🕊️",
    secret: true,
    target: 1,
    xpReward: 5
  },
  {
    id: "executioner",
    name: "EXECUTIONER",
    description: "Condemn a morally controversial soul.",
    category: "SPECIAL",
    icon: "⚔️",
    secret: true,
    target: 1,
    xpReward: 5
  },
  {
    id: "the_gambler",
    name: "THE GAMBLER",
    description: "Correctly judge a difficult soul almost instantly.",
    category: "SPECIAL",
    icon: "🎲",
    secret: true,
    target: 1,
    xpReward: 5
  },
  {
    id: "contrarian",
    name: "CONTRARIAN",
    description: "Make an unexpected but defensible judgment.",
    category: "SPECIAL",
    icon: "🎭",
    secret: true,
    target: 1,
    xpReward: 5
  },
  {
    id: "coin_of_fate",
    name: "COIN OF FATE",
    description: "Make 10 Heaven and 10 Hell decisions in the same run.",
    category: "SPECIAL",
    icon: "🪙",
    secret: false,
    target: 10,
    xpReward: 5
  },
  {
    id: "the_impossible_choice",
    name: "THE IMPOSSIBLE CHOICE",
    description: "Correctly judge the hardest case.",
    category: "SPECIAL",
    icon: "🌌",
    secret: true,
    target: 1,
    xpReward: 10
  },
  {
    id: "judged_by_judgment",
    name: "JUDGED BY JUDGMENT",
    description: "Reach the Angel's final judgment.",
    category: "SPECIAL",
    icon: "👼",
    secret: false,
    target: 1,
    xpReward: 5
  },
  {
    id: "celestai",
    name: "CELESTAI",
    description: "Become the ultimate Judge.",
    category: "SPECIAL",
    icon: "🏆",
    secret: false,
    target: 49,
    xpReward: 25
  }
];

class AchievementManager {
  constructor() {
    this.storageKey = "celestai_achievements_v1";
    this.statsKey = "celestai_achievement_stats_v1";

    this.unlocked = {};
    this.progress = {};
    this.stats = {
      totalJudged: 0,
      totalCorrect: 0,
      totalHeaven: 0,
      totalHell: 0,
      bestStreak: 0,
      fastCorrectCount: 0,
      timePauseUses: 0,
      timeDilationUses: 0,
      trueSightUses: 0,
      moralClarityUses: 0,
      doubleJudgmentUses: 0
    };

    // In-run ephemeral trackers (reset every run)
    this.runStats = {
      judgedCount: 0,
      livesLost: 0,
      heavenCount: 0,
      hellCount: 0,
      consecutiveHell: 0,
      consecutiveHeaven: 0,
      consecutiveFastCorrect: 0,
      secondChanceUsed: false
    };

    this.toastQueue = [];
    this.isToastShowing = false;
    this.currentCategoryFilter = "ALL";

    this.load();
  }

  load() {
    try {
      const savedUnlocked = localStorage.getItem(this.storageKey);
      if (savedUnlocked) {
        this.unlocked = JSON.parse(savedUnlocked);
      }
      const savedStats = localStorage.getItem(this.statsKey);
      if (savedStats) {
        this.stats = { ...this.stats, ...JSON.parse(savedStats) };
      }
    } catch (e) {
      console.warn("Could not read achievement storage:", e);
    }
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.unlocked));
      localStorage.setItem(this.statsKey, JSON.stringify(this.stats));
    } catch (e) {
      console.warn("Could not write achievement storage:", e);
    }
  }

  resetRun() {
    this.runStats = {
      judgedCount: 0,
      livesLost: 0,
      heavenCount: 0,
      hellCount: 0,
      consecutiveHell: 0,
      consecutiveHeaven: 0,
      consecutiveFastCorrect: 0,
      secondChanceUsed: false
    };
  }

  isUnlocked(id) {
    return !!this.unlocked[id];
  }

  getUnlockedCount() {
    return Object.keys(this.unlocked).length;
  }

  getTotalCount() {
    return ACHIEVEMENT_DEFINITIONS.length;
  }

  getProgress(id) {
    const ach = ACHIEVEMENT_DEFINITIONS.find((a) => a.id === id);
    if (!ach) return 0;
    if (this.isUnlocked(id)) return ach.target;

    switch (id) {
      case "first_judgment":
        return Math.min(ach.target, this.stats.totalJudged);
      case "judge_10":
      case "just_beginning":
      case "seasoned_judge":
      case "divine_judge":
      case "supreme_judge":
      case "judgment_day":
        return Math.min(ach.target, this.stats.totalCorrect);
      case "heavens_gatekeeper":
        return Math.min(ach.target, this.stats.totalHeaven);
      case "hells_gatekeeper":
        return Math.min(ach.target, this.stats.totalHell);
      case "equal_justice":
        return Math.min(ach.target, Math.min(this.stats.totalHeaven, this.stats.totalHell));
      case "on_fire":
      case "unstoppable":
      case "divine_streak":
        return Math.min(ach.target, this.stats.bestStreak);
      case "speed_judge":
        return Math.min(ach.target, this.runStats.consecutiveFastCorrect);
      case "against_the_clock":
        return Math.min(ach.target, this.stats.fastCorrectCount);
      case "survivor":
      case "endurance":
      case "immortal":
        return Math.min(ach.target, this.runStats.judgedCount);
      case "three_lives":
      case "untouchable":
        return this.runStats.livesLost === 0 ? Math.min(ach.target, this.runStats.judgedCount) : 0;
      case "time_lord":
        return Math.min(ach.target, this.stats.timePauseUses);
      case "time_bender":
        return Math.min(ach.target, this.stats.timeDilationUses);
      case "true_sight":
        return Math.min(ach.target, this.stats.trueSightUses);
      case "clarity":
        return Math.min(ach.target, this.stats.moralClarityUses);
      case "double_vision":
        return Math.min(ach.target, this.stats.doubleJudgmentUses);
      case "full_authority":
        return this.getBranchUnlockedCount("authority");
      case "full_justice":
        return this.getBranchUnlockedCount("justice");
      case "full_divinity":
        return this.getBranchUnlockedCount("divinity");
      case "coin_of_fate":
        return Math.min(ach.target, Math.min(this.runStats.heavenCount, this.runStats.hellCount));
      case "celestai":
        return Math.min(49, this.getUnlockedCount());
      default:
        return 0;
    }
  }

  getBranchUnlockedCount(branch) {
    if (!window.skillManager) return 0;
    const branchSkills = Object.values(SKILLS_DATA).filter((s) => s.branch === branch);
    return branchSkills.filter((s) => window.skillManager.isUnlocked(s.id)).length;
  }

  unlock(id) {
    if (this.unlocked[id]) return false;

    const ach = ACHIEVEMENT_DEFINITIONS.find((a) => a.id === id);
    if (!ach) return false;

    this.unlocked[id] = {
      unlockedAt: Date.now()
    };
    this.save();

    // Award bonus XP if skill manager is present
    if (window.skillManager && ach.xpReward) {
      window.skillManager.addXP(ach.xpReward);
    }

    // Queue non-intrusive unlock notification
    this.queueToast(ach);

    // Check meta-achievement: CELESTAI (#50)
    if (id !== "celestai" && this.getUnlockedCount() >= 49) {
      this.unlock("celestai");
    }

    // Update menu badge if present
    this.updateMenuBadge();

    return true;
  }

  // ==========================================
  // EVENT-DRIVEN ACHIEVEMENT CHECKS
  // ==========================================
  emit(eventName, data = {}) {
    switch (eventName) {
      case "RUN_STARTED":
        this.resetRun();
        break;

      case "SOUL_JUDGED":
        this.handleSoulJudged(data);
        break;

      case "SKILL_USED":
        this.handleSkillUsed(data);
        break;

      case "SKILL_UNLOCKED":
        this.handleSkillUnlocked(data);
        break;

      case "LIFE_SAVED":
        this.handleLifeSaved(data);
        break;

      case "LIFE_LOST":
        this.runStats.livesLost++;
        break;

      case "TIMER_EXPIRED":
        this.unlock("whoops");
        break;

      case "ANGEL_JUDGMENT":
        this.unlock("judged_by_judgment");
        break;

      default:
        break;
    }
  }

  handleSoulJudged(data) {
    const { story, decision, evaluation, timeLeft, decisionTime, lives, streak } = data;
    const isCorrect = evaluation && evaluation.isCorrect;

    this.stats.totalJudged++;
    this.runStats.judgedCount++;

    if (decision === "HEAVEN") {
      this.stats.totalHeaven++;
      this.runStats.heavenCount++;
      this.runStats.consecutiveHeaven++;
      this.runStats.consecutiveHell = 0;
    } else {
      this.stats.totalHell++;
      this.runStats.hellCount++;
      this.runStats.consecutiveHell++;
      this.runStats.consecutiveHeaven = 0;
    }

    // Check basic judgment counters
    if (this.stats.totalJudged >= 1) this.unlock("first_judgment");

    if (isCorrect) {
      this.stats.totalCorrect++;

      if (this.stats.totalCorrect >= 10) this.unlock("judge_10");
      if (this.stats.totalCorrect >= 25) this.unlock("just_beginning");
      if (this.stats.totalCorrect >= 50) this.unlock("seasoned_judge");
      if (this.stats.totalCorrect >= 100) this.unlock("divine_judge");
      if (this.stats.totalCorrect >= 250) this.unlock("supreme_judge");
      if (this.stats.totalCorrect >= 500) this.unlock("judgment_day");

      // 1-life clutch
      if (lives === 1) {
        this.unlock("clutch");
        this.unlock("near_death");
      }

      // Timing checks
      if (timeLeft < 1.0) {
        this.unlock("last_second");
      }
      if (timeLeft >= 0.1 && timeLeft <= 0.5) {
        this.unlock("overthinker");
      }

      if (decisionTime < 2.0) {
        this.stats.fastCorrectCount++;
        this.runStats.consecutiveFastCorrect++;
        if (this.stats.fastCorrectCount >= 25) this.unlock("against_the_clock");
        if (this.runStats.consecutiveFastCorrect >= 5) this.unlock("speed_judge");
      } else {
        this.runStats.consecutiveFastCorrect = 0;
      }

      // Second Chance success
      if (this.runStats.secondChanceUsed) {
        this.unlock("second_chance");
        this.runStats.secondChanceUsed = false;
      }

      // Special case complexity checks
      const isControversial =
        story &&
        (Math.abs(story.heavenDefensibility - story.hellDefensibility) <= 25 ||
          (story.heavenDefensibility >= 45 && story.hellDefensibility >= 45));

      if (isControversial) {
        if (decision === "HEAVEN") this.unlock("mercy");
        if (decision === "HELL") this.unlock("executioner");
      }

      // Gambler: correct on hard case (tier >= 2) in under 1 second
      if (story && story.tier >= 2 && decisionTime < 1.0) {
        this.unlock("the_gambler");
      }

      // Contrarian: unexpected but defensible
      if (evaluation.ratingLabel && evaluation.ratingLabel.includes("DEFENSIBLE")) {
        this.unlock("contrarian");
      }

      // The Impossible Choice: tier >= 3 correct judgment
      if (story && story.tier >= 3) {
        this.unlock("the_impossible_choice");
      }
    } else {
      this.runStats.consecutiveFastCorrect = 0;
    }

    // Gatekeeper checks
    if (this.stats.totalHeaven >= 100) this.unlock("heavens_gatekeeper");
    if (this.stats.totalHell >= 100) this.unlock("hells_gatekeeper");
    if (this.stats.totalHeaven >= 50 && this.stats.totalHell >= 50) this.unlock("equal_justice");

    // Streak checks
    if (streak > this.stats.bestStreak) {
      this.stats.bestStreak = streak;
    }
    if (streak >= 5) this.unlock("on_fire");
    if (streak >= 10) {
      this.unlock("unstoppable");
      this.unlock("perfect_judgment");
    }
    if (streak >= 20) this.unlock("divine_streak");

    // Consecutive choices
    if (this.runStats.consecutiveHell >= 10) this.unlock("no_mercy");
    if (this.runStats.consecutiveHeaven >= 10) this.unlock("guardian_angel");

    // In-run survival checks
    if (this.runStats.judgedCount >= 20) this.unlock("survivor");
    if (this.runStats.judgedCount >= 50) this.unlock("endurance");
    if (this.runStats.judgedCount >= 100) this.unlock("immortal");

    if (this.runStats.livesLost === 0) {
      if (this.runStats.judgedCount >= 10) this.unlock("three_lives");
      if (this.runStats.judgedCount >= 25) this.unlock("untouchable");
    }

    if (this.runStats.heavenCount >= 10 && this.runStats.hellCount >= 10) {
      this.unlock("coin_of_fate");
    }

    this.save();
  }

  handleSkillUsed(data) {
    const { skillId } = data;
    switch (skillId) {
      case "time_pause":
        this.stats.timePauseUses++;
        if (this.stats.timePauseUses >= 10) this.unlock("time_lord");
        break;
      case "time_dilation":
        this.stats.timeDilationUses++;
        if (this.stats.timeDilationUses >= 10) this.unlock("time_bender");
        break;
      case "true_sight":
        this.stats.trueSightUses++;
        if (this.stats.trueSightUses >= 10) this.unlock("true_sight");
        break;
      case "moral_clarity":
        this.stats.moralClarityUses++;
        if (this.stats.moralClarityUses >= 10) this.unlock("clarity");
        break;
      case "double_judgment":
        this.stats.doubleJudgmentUses++;
        if (this.stats.doubleJudgmentUses >= 10) this.unlock("double_vision");
        break;
      default:
        break;
    }
    this.save();
  }

  handleSkillUnlocked(data) {
    this.unlock("first_power");

    // Check full branches
    if (this.getBranchUnlockedCount("authority") >= 4) this.unlock("full_authority");
    if (this.getBranchUnlockedCount("justice") >= 4) this.unlock("full_justice");
    if (this.getBranchUnlockedCount("divinity") >= 4) this.unlock("full_divinity");
  }

  handleLifeSaved(data) {
    const { perk } = data;
    switch (perk) {
      case "second_chance":
        this.runStats.secondChanceUsed = true;
        break;
      case "divine_intervention":
        this.unlock("divine_intervention");
        break;
      case "forgiveness":
        this.unlock("blessed");
        break;
      case "immortal_soul":
        this.unlock("immortal_soul");
        break;
      case "final_word":
        this.unlock("final_word");
        break;
      default:
        break;
    }
  }

  // ==========================================
  // NON-INTRUSIVE TOAST NOTIFICATION QUEUE
  // ==========================================
  queueToast(ach) {
    this.toastQueue.push(ach);
    if (!this.isToastShowing) {
      this.displayNextToast();
    }
  }

  displayNextToast() {
    if (this.toastQueue.length === 0) {
      this.isToastShowing = false;
      return;
    }

    this.isToastShowing = true;
    const ach = this.toastQueue.shift();

    let container = document.getElementById("achievement-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "achievement-toast-container";
      container.className = "achievement-toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "achievement-toast";
    toast.innerHTML = `
      <div class="toast-pedestal"></div>
      <div class="toast-content">
        <span class="toast-badge">🏆 ACHIEVEMENT UNLOCKED</span>
        <div class="toast-main">
          <span class="toast-icon">${ach.icon}</span>
          <div class="toast-info">
            <span class="toast-title">${ach.name}</span>
            <span class="toast-desc">${ach.description}</span>
          </div>
        </div>
      </div>
    `;

    container.appendChild(toast);

    // Audio cue
    if (window.soundEngine && window.soundEngine.playLevelUp) {
      window.soundEngine.playLevelUp();
    }

    // Entrance animation
    const raf = typeof requestAnimationFrame === "function" ? requestAnimationFrame : setTimeout;
    raf(() => {
      toast.classList.add("visible");
    });

    // Dismissal
    setTimeout(() => {
      toast.classList.remove("visible");
      toast.classList.add("fade-out");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
        this.displayNextToast();
      }, 350);
    }, 1800);
  }

  updateMenuBadge() {
    const badge = document.getElementById("menu-achievements-count");
    if (badge) {
      badge.textContent = `${this.getUnlockedCount()} / ${this.getTotalCount()}`;
    }
  }

  // ==========================================
  // ACHIEVEMENT SCREEN RENDERING
  // ==========================================
  renderScreen() {
    const unlockedCount = this.getUnlockedCount();
    const totalCount = this.getTotalCount();
    const pct = Math.round((unlockedCount / totalCount) * 100);

    const countEl = document.getElementById("achievements-progress-count");
    if (countEl) countEl.textContent = `${unlockedCount} / ${totalCount} UNLOCKED`;

    const barEl = document.getElementById("achievements-progress-bar");
    if (barEl) barEl.style.width = `${pct}%`;

    const container = document.getElementById("achievements-cards-container");
    if (!container) return;

    const filtered =
      this.currentCategoryFilter === "ALL"
        ? ACHIEVEMENT_DEFINITIONS
        : ACHIEVEMENT_DEFINITIONS.filter((a) => a.category === this.currentCategoryFilter);

    let html = "";
    filtered.forEach((ach) => {
      const isUnlocked = this.isUnlocked(ach.id);
      const isSecretLocked = ach.secret && !isUnlocked;
      const progress = this.getProgress(ach.id);
      const target = ach.target;

      let cardClass = "achievement-card";
      if (isUnlocked) cardClass += " unlocked";
      else if (isSecretLocked) cardClass += " secret-locked";
      else cardClass += " locked";

      let icon = isSecretLocked ? "🔒" : ach.icon;
      let name = isSecretLocked ? "???" : ach.name;
      let desc = isSecretLocked ? "SECRET ACHIEVEMENT" : ach.description;

      let statusHtml = "";
      if (isUnlocked) {
        statusHtml = `<span class="ach-status-badge unlocked">✓ UNLOCKED</span>`;
      } else if (isSecretLocked) {
        statusHtml = `<span class="ach-status-badge secret">LOCKED</span>`;
      } else if (target > 1) {
        const progPct = Math.min(100, Math.round((progress / target) * 100));
        statusHtml = `
          <div class="ach-prog-block">
            <span class="ach-prog-text">${progress} / ${target}</span>
            <div class="ach-prog-track">
              <div class="ach-prog-fill" style="width: ${progPct}%"></div>
            </div>
          </div>
        `;
      } else {
        statusHtml = `<span class="ach-status-badge locked">LOCKED</span>`;
      }

      html += `
        <div class="${cardClass}">
          <div class="ach-card-glow"></div>
          <div class="ach-card-body">
            <div class="ach-card-left">
              <span class="ach-card-icon">${icon}</span>
            </div>
            <div class="ach-card-center">
              <div class="ach-card-title-row">
                <span class="ach-card-title">${name}</span>
                <span class="ach-card-cat">${ach.category}</span>
              </div>
              <p class="ach-card-desc">${desc}</p>
            </div>
            <div class="ach-card-right">
              ${statusHtml}
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  setCategoryFilter(category) {
    this.currentCategoryFilter = category;
    this.renderScreen();
  }
}

// Global Singleton Instance
window.ACHIEVEMENT_DEFINITIONS = ACHIEVEMENT_DEFINITIONS;
window.AchievementManager = AchievementManager;
window.achievementManager = new AchievementManager();
