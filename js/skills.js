/**
 * Celestial Judgment - Permanent Judge Skill Tree & Progression Engine
 * Manages XP, Level calculation, Skill Tree branches (Justice, Authority, Divinity),
 * persistence in localStorage, and one-charge-per-run runtime state.
 */

const PLAYER_LEVELS = [
  { level: 1, title: "MORTAL", minXP: 0, nextXP: 10 },
  { level: 2, title: "ACOLYTE", minXP: 10, nextXP: 25 },
  { level: 3, title: "JUDGE", minXP: 25, nextXP: 50 },
  { level: 4, title: "ARCHJUDGE", minXP: 50, nextXP: 100 },
  { level: 5, title: "DIVINE JUDGE", minXP: 100, nextXP: 200 },
  { level: 6, title: "CELESTIAL", minXP: 200, nextXP: 500 },
  { level: 7, title: "ETERNAL", minXP: 500, nextXP: null }
];

const SKILLS_DATA = {
  // ==========================================
  // JUSTICE BRANCH (Understanding souls & cases)
  // NOTE: ids + costs are frozen (saved unlocks stay valid); effects follow the 4-meter model.
  // ==========================================
  true_sight: {
    id: "true_sight",
    branch: "justice",
    name: "TRUE SIGHT",
    cost: 10,
    prerequisite: null,
    icon: "I",
    type: "active",
    shortDesc: "Reveal the hidden truth the current soul never confessed.",
    runCharges: 1
  },
  moral_clarity: {
    id: "moral_clarity",
    branch: "justice",
    name: "MORAL CLARITY",
    cost: 25,
    prerequisite: "true_sight",
    icon: "II",
    type: "active",
    shortDesc: "Reveal intent vs consequences, and which way each verdict pushes every meter.",
    runCharges: 1
  },
  double_judgment: {
    id: "double_judgment",
    branch: "justice",
    name: "DOUBLE JUDGMENT",
    cost: 50,
    prerequisite: "moral_clarity",
    icon: "III",
    type: "active",
    shortDesc: "Reveal the exact meter changes of BOTH verdicts before deciding.",
    runCharges: 1
  },
  final_word: {
    id: "final_word",
    branch: "justice",
    name: "FINAL WORD",
    cost: 100,
    prerequisite: "double_judgment",
    icon: "IV",
    type: "active",
    shortDesc: "Arm before a verdict: every change pushing a meter toward its brink is cancelled.",
    runCharges: 1
  },

  // ==========================================
  // AUTHORITY BRANCH (Control over time & decisions)
  // ==========================================
  time_pause: {
    id: "time_pause",
    branch: "authority",
    name: "TIME PAUSE",
    cost: 10,
    prerequisite: null,
    icon: "I",
    type: "active",
    shortDesc: "Timed: freeze the countdown 3s. Untimed: ease your most extreme meter 10 toward balance.",
    runCharges: 1
  },
  time_dilation: {
    id: "time_dilation",
    branch: "authority",
    name: "TIME DILATION",
    cost: 25,
    prerequisite: "time_pause",
    icon: "II",
    type: "active",
    shortDesc: "Timed: +3 seconds on the clock. Untimed: defer this soul unjudged (no meter changes).",
    runCharges: 1
  },
  second_chance: {
    id: "second_chance",
    branch: "authority",
    name: "SECOND CHANCE",
    cost: 50,
    prerequisite: "time_dilation",
    icon: "III",
    type: "trigger",
    shortDesc: "When a verdict would end your reign, it is undone (meters restored) and you judge again.",
    runCharges: 1
  },
  absolute_judgment: {
    id: "absolute_judgment",
    branch: "authority",
    name: "ABSOLUTE JUDGMENT",
    cost: 100,
    prerequisite: "second_chance",
    icon: "IV",
    type: "active",
    shortDesc: "Timed: freeze time for 10s. Untimed: pull all four meters halfway back to balance.",
    runCharges: 1
  },

  // ==========================================
  // DIVINITY BRANCH (Survival & divine intervention)
  // ==========================================
  extra_life: {
    id: "extra_life",
    branch: "divinity",
    name: "EXTRA LIFE",
    cost: 15,
    prerequisite: null,
    icon: "I",
    type: "permanent",
    shortDesc: "Permanent ward: the first time each meter hits its brink in a reign, it stops at 6/94.",
    runCharges: 0
  },
  forgiveness: {
    id: "forgiveness",
    branch: "divinity",
    name: "FORGIVENESS",
    cost: 30,
    prerequisite: "extra_life",
    icon: "II",
    type: "trigger",
    shortDesc: "The first meter collapse of your reign is forgiven: that meter returns to 50.",
    runCharges: 1
  },
  immortal_soul: {
    id: "immortal_soul",
    branch: "divinity",
    name: "IMMORTAL SOUL",
    cost: 75,
    prerequisite: "forgiveness",
    icon: "III",
    type: "trigger",
    shortDesc: "A second collapse is survived too: ALL four meters return to 50.",
    runCharges: 1
  },
  divine_intervention: {
    id: "divine_intervention",
    branch: "divinity",
    name: "DIVINE INTERVENTION",
    cost: 150,
    prerequisite: "immortal_soul",
    icon: "IV",
    type: "trigger",
    shortDesc: "Timed: +3s instead of a hesitation penalty. Untimed: first meter to enter the danger zone is pulled back to 30/70.",
    runCharges: 1
  }
};

class SkillTreeManager {
  constructor() {
    this.load();
    this.resetRunCharges();
  }

  load() {
    try {
      this.totalXP = parseInt(localStorage.getItem("celestial_total_xp") || "0", 10);
      this.availableXP = parseInt(localStorage.getItem("celestial_available_xp") || "0", 10);
      const rawSkills = localStorage.getItem("celestial_unlocked_skills");
      this.unlockedSkills = new Set(rawSkills ? JSON.parse(rawSkills) : []);
      this.lifetimeSouls = parseInt(localStorage.getItem("celestial_lifetime_souls") || "0", 10);
      this.highScore = parseInt(localStorage.getItem("celestial_high_score") || "0", 10);
      this.bestStreak = parseInt(localStorage.getItem("celestial_best_streak") || "0", 10);
    } catch (e) {
      this.totalXP = 0;
      this.availableXP = 0;
      this.unlockedSkills = new Set();
      this.lifetimeSouls = 0;
      this.highScore = 0;
      this.bestStreak = 0;
    }
  }

  save() {
    try {
      localStorage.setItem("celestial_total_xp", this.totalXP.toString());
      localStorage.setItem("celestial_available_xp", this.availableXP.toString());
      localStorage.setItem("celestial_unlocked_skills", JSON.stringify([...this.unlockedSkills]));
      localStorage.setItem("celestial_lifetime_souls", this.lifetimeSouls.toString());
      localStorage.setItem("celestial_high_score", this.highScore.toString());
      localStorage.setItem("celestial_best_streak", this.bestStreak.toString());
    } catch (e) {
      console.warn("Error saving to localStorage", e);
    }
  }

  addXP(amount) {
    const oldLevel = this.getPlayerLevel().level;
    this.totalXP += amount;
    this.availableXP += amount;
    this.save();
    const newLevel = this.getPlayerLevel().level;
    return {
      leveledUp: newLevel > oldLevel,
      oldLevel,
      newLevel
    };
  }

  /** Reign counter ("Judge #N"), persisted separately from progression. */
  getReignNumber() {
    try {
      return parseInt(localStorage.getItem("celestai_reign") || "0", 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  nextReign() {
    const n = this.getReignNumber() + 1;
    try {
      localStorage.setItem("celestai_reign", String(n));
    } catch (e) { /* ignore */ }
    return n;
  }

  recordRunStats(score, judged, streak) {
    if (score > this.highScore) {
      this.highScore = score;
    }
    if (streak > this.bestStreak) {
      this.bestStreak = streak;
    }
    this.lifetimeSouls += judged;
    this.save();
  }

  getPlayerLevel(xp = this.totalXP) {
    for (let i = PLAYER_LEVELS.length - 1; i >= 0; i--) {
      if (xp >= PLAYER_LEVELS[i].minXP) {
        const lvl = PLAYER_LEVELS[i];
        const next = lvl.nextXP;
        const currentInLevel = xp - lvl.minXP;
        const neededInLevel = next ? next - lvl.minXP : 0;
        const progressPct = next ? Math.min(100, Math.floor((currentInLevel / neededInLevel) * 100)) : 100;
        return {
          ...lvl,
          currentInLevel,
          neededInLevel,
          progressPct
        };
      }
    }
    return { ...PLAYER_LEVELS[0], currentInLevel: xp, neededInLevel: 10, progressPct: 0 };
  }

  isUnlocked(skillId) {
    return this.unlockedSkills.has(skillId);
  }

  canUnlock(skillId) {
    const skill = SKILLS_DATA[skillId];
    if (!skill) return false;
    if (this.isUnlocked(skillId)) return false;
    if (this.availableXP < skill.cost) return false;
    if (skill.prerequisite && !this.isUnlocked(skill.prerequisite)) return false;
    return true;
  }

  unlockSkill(skillId) {
    if (!this.canUnlock(skillId)) return false;
    const skill = SKILLS_DATA[skillId];
    this.availableXP -= skill.cost;
    this.unlockedSkills.add(skillId);
    this.save();
    if (window.achievementManager) {
      window.achievementManager.emit("SKILL_UNLOCKED", { skillId });
    }
    return true;
  }

  resetRunCharges() {
    this.activeCharges = {};
    for (const [id, skill] of Object.entries(SKILLS_DATA)) {
      if (this.isUnlocked(id)) {
        this.activeCharges[id] = skill.runCharges;
      } else {
        this.activeCharges[id] = 0;
      }
    }
  }

  hasCharge(skillId) {
    return (this.activeCharges[skillId] || 0) > 0;
  }

  useCharge(skillId) {
    if (!this.hasCharge(skillId)) return false;
    this.activeCharges[skillId]--;
    return true;
  }

  /** EXTRA LIFE (permanent) now grants one brink-ward per meter per reign. */
  hasMeterWards() {
    return this.isUnlocked("extra_life");
  }

  getActiveAbilities() {
    // Returns list of unlocked active/clickable abilities for the in-game ability bar
    const list = [];
    for (const [id, skill] of Object.entries(SKILLS_DATA)) {
      if (skill.type === "active" && this.isUnlocked(id)) {
        list.push({
          ...skill,
          chargesLeft: this.activeCharges[id] || 0
        });
      }
    }
    return list;
  }

  resetProgress() {
    this.totalXP = 0;
    this.availableXP = 0;
    this.unlockedSkills.clear();
    this.lifetimeSouls = 0;
    this.highScore = 0;
    this.bestStreak = 0;
    this.save();
    this.resetRunCharges();
  }
}

window.skillManager = new SkillTreeManager();
