/**
 * Celestial Judgment - Complete Game Loop & Skill Tree Controller
 * Coordinates:
 * 1. Screen Flow: Main Menu -> New Run -> Gameplay -> Angel Climax -> Run Results -> Skill Tree -> Menu
 * 2. Permanent Judge Progression: Lifetime XP, Levels, and Skill Tree Unlocks
 * 3. In-Game Active & Passive Skills: True Sight, Time Pause, Second Chance, Extra Life, etc.
 * 4. Four celestial meters (mercy/justice/order/faith) — any meter at 0 or 100 ends the reign
 * 5. Optional TIMED MODE (8s per soul, localStorage celestai_timed)
 * 6. Procedural 3D WebGL scene integration
 */

const SOUL_TIMER_SECONDS = 5.0;
const TIMEOUT_EFFECTS = { order: -10, faith: -6 };

/** The 8 ways a reign can end (meter x low/high). */
const REIGN_ENDINGS = {
  mercy: {
    low: { title: "THE COLD GATES", cause: "Mercy ran dry", text: "Without mercy the gates of Heaven rusted shut. The angels turned their faces from your throne." },
    high: { title: "THE FLOODED PARADISE", cause: "Mercy overflowed", text: "You pardoned everyone. The unrepentant filled Paradise, and the saints rose up to cast you out." }
  },
  justice: {
    low: { title: "LUCIFER'S LAUGHTER", cause: "Justice collapsed", text: "Sin went unpunished for too long. Lucifer laughed in your courtroom and took your gavel as a trophy." },
    high: { title: "THE BURSTING PIT", cause: "Justice turned to cruelty", text: "Your sentences emptied Heaven. Hell overflowed until its gates burst and the damned marched on your throne." }
  },
  order: {
    low: { title: "THE LOST QUEUE", cause: "Order dissolved", text: "The celestial bureaucracy collapsed. Souls wandered lost between realms, and the Scribes deposed you." },
    high: { title: "THE PAPER TOMB", cause: "Order became tyranny", text: "Procedure devoured purpose. You were entombed in your own ledgers and replaced by a humble clerk." }
  },
  faith: {
    low: { title: "THE SILENT PRAYERS", cause: "Faith faded", text: "Mortals stopped believing in your verdicts. Their prayers fell silent, and your throne faded with them." },
    high: { title: "THE FALSE IDOL", cause: "Faith became worship", text: "Mortals worshipped you instead of the Divine. A jealous Heaven cast its idol down." }
  }
};

const METER_ICONS = { mercy: "", justice: "", order: "", faith: "" };

class CelestialGame {
  constructor() {
    this.container = document.getElementById("canvas-container");
    this.renderer = new SceneRenderer(this.container);
    this.environment = new CelestialEnvironment(this.renderer.scene);
    this.animator = window.characterAnimator;

    // Active Screen & Gameplay State
    this.currentScreen = "screen-main-menu";
    this.state = "MENU"; // "MENU", "PRE_RUN", "ENTERING", "JUDGING", "ANIMATING_RESULT", "SHOW_VERDICT", "ANGEL_SEQUENCE", "RESULTS"

    this.currentSoul = null;
    this.currentStory = null;
    this.currentAngel = null;

    // Timer & Mechanics (TIMED MODE is opt-in)
    this.timedMode = this.loadTimedMode();
    this.timerDuration = SOUL_TIMER_SECONDS;
    this.timeLeft = SOUL_TIMER_SECONDS;
    this.isTimeFrozen = false;
    this.timeFreezeRemaining = 0;
    this.lastUrgentTick = -1;

    // Run (Reign) Progression
    this.reign = window.skillManager.getReignNumber() || 0;
    this.reignOver = false;
    this.deathInfo = null;
    this.reignHistory = [];
    this.revealLevel = 0;
    this.finalWordArmed = false;
    this.score = 0;
    this.runXP = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.totalJudged = 0;
    this.activeBranchTab = "justice";

    // DOM Caching
    this.initDOM();
    this.initEvents();
    window.meterSystem?.mountHUD?.(this.dom.meterBar);
    this.applyTimedModeUI();

    // Initialize 3D Judge Character & Pedestal
    this.initJudge();

    this.clock = new THREE.Clock();

    // Start 3D rendering loop
    this.startLoop();

    // Initialize UI
    this.showScreen("screen-main-menu");
    this.refreshProgressionUI();
    window.soundEngine.playMenuMusic();
  }

  initDOM() {
    this.dom = {
      // Screens
      screens: {
        mainMenu: document.getElementById("screen-main-menu"),
        newRun: document.getElementById("screen-new-run"),
        gameplayLayer: document.getElementById("gameplay-layer"),
        angelScreen: document.getElementById("angel-screen"),
        runResults: document.getElementById("screen-run-results"),
        skillTree: document.getElementById("screen-skill-tree"),
        highScore: document.getElementById("screen-high-score"),
        settings: document.getElementById("screen-settings"),
        achievements: document.getElementById("screen-achievements")
      },

      // Overlays
      screenFlashHeaven: document.getElementById("flash-heaven"),
      screenFlashHell: document.getElementById("flash-hell"),
      scorePop: document.getElementById("score-pop"),
      abilityToast: document.getElementById("ability-toast"),

      // Main Menu Elements
      menuPlayerLevel: document.getElementById("menu-player-level"),
      menuPlayerTitle: document.getElementById("menu-player-title"),
      menuXpBar: document.getElementById("menu-xp-bar"),
      menuXpText: document.getElementById("menu-xp-text"),
      menuBtnJudge: document.getElementById("menu-btn-judge"),
      menuBtnSkills: document.getElementById("menu-btn-skills"),
      menuBtnHighScore: document.getElementById("menu-btn-highscore"),
      menuBtnSettings: document.getElementById("menu-btn-settings"),

      // Pre-Run Elements
      preRunMeters: document.getElementById("pre-run-meters"),
      preRunReign: document.getElementById("pre-run-reign"),
      preRunAbilitiesPreview: document.getElementById("pre-run-abilities-preview"),
      btnBeginRun: document.getElementById("btn-begin-run"),
      btnNewRunBack: document.getElementById("btn-new-run-back"),

      // In-Game HUD & Ability Bar
      topBar: document.getElementById("top-bar"),
      statScore: document.getElementById("stat-score"),
      statReign: document.getElementById("stat-reign"),
      statBest: document.getElementById("stat-best"),
      statHighScore: document.getElementById("stat-highscore"),
      meterBar: document.getElementById("meter-bar"),
      btnAudio: document.getElementById("btn-audio"),
      abilityBar: document.getElementById("ability-bar"),

      // Story Card
      storyCard: document.getElementById("story-card"),
      soulName: document.getElementById("soul-name"),
      soulTitle: document.getElementById("soul-title"),
      soulAge: document.getElementById("soul-age"),
      soulArchetype: document.getElementById("soul-archetype"),
      storyVirtue: document.getElementById("story-virtue"),
      storySin: document.getElementById("story-sin"),
      storyDilemma: document.getElementById("story-dilemma"),
      timerBar: document.getElementById("timer-bar"),
      timerText: document.getElementById("timer-text"),
      timerCircularContainer: document.getElementById("circular-timer-container"),
      timerRingProgress: document.getElementById("timer-ring-progress"),

      // Action Buttons
      btnHeaven: document.getElementById("btn-heaven"),
      btnHell: document.getElementById("btn-hell"),
      hintHeaven: document.getElementById("hint-heaven"),
      hintHell: document.getElementById("hint-hell"),

      // Verdict Modal
      verdictModal: document.getElementById("verdict-modal"),
      verdictBadge: document.getElementById("verdict-badge"),
      verdictScore: document.getElementById("verdict-score"),
      verdictDeltas: document.getElementById("verdict-deltas"),
      verdictNote: document.getElementById("verdict-note"),
      verdictReasoning: document.getElementById("verdict-reasoning"),
      verdictQuote: document.getElementById("verdict-quote"),

      // Angel Sequence Elements
      angelDialogueContent: document.getElementById("angel-dialogue-content"),
      angelDestinyContainer: document.getElementById("angel-destiny-container"),
      angelDestinyBanner: document.getElementById("angel-destiny-banner"),
      angelTapHint: document.getElementById("angel-tap-hint"),
      angelEndingTitle: document.getElementById("angel-ending-title"),

      // Run Results Elements
      resultsTitle: document.getElementById("results-title"),
      resultsCause: document.getElementById("results-cause"),
      resultsMeters: document.getElementById("results-meters"),
      resultsScore: document.getElementById("results-score"),
      resultsHighScore: document.getElementById("results-highscore"),
      resultsJudged: document.getElementById("results-judged"),
      resultsXpEarned: document.getElementById("results-xp-earned"),
      resultsTotalXp: document.getElementById("results-total-xp"),
      resultsRank: document.getElementById("results-rank"),
      resultsHighscoreTag: document.getElementById("results-highscore-tag"),
      resultsLevelupTag: document.getElementById("results-levelup-tag"),
      resultsProfileTitle: document.getElementById("results-profile-title"),
      resultsProfileDesc: document.getElementById("results-profile-desc"),
      resultsBtnSkills: document.getElementById("results-btn-skills"),
      resultsBtnReplay: document.getElementById("results-btn-replay"),
      resultsBtnMenu: document.getElementById("results-btn-menu"),

      // Skill Tree Elements
      treePlayerLevel: document.getElementById("tree-player-level"),
      treePlayerTitle: document.getElementById("tree-player-title"),
      treeXpBar: document.getElementById("tree-xp-bar"),
      treeXpCounter: document.getElementById("tree-xp-counter"),
      treeAvailableXp: document.getElementById("tree-available-xp"),
      branchContent: document.getElementById("branch-content"),
      tabJustice: document.getElementById("tab-justice"),
      tabAuthority: document.getElementById("tab-authority"),
      tabDivinity: document.getElementById("tab-divinity"),
      btnSkillsBack: document.getElementById("btn-skills-back"),

      // High Score Screen Elements
      recordBestScore: document.getElementById("record-best-score"),
      recordBestStreak: document.getElementById("record-best-streak"),
      recordSoulsJudged: document.getElementById("record-souls-judged"),
      recordLifetimeXp: document.getElementById("record-lifetime-xp"),
      btnHighScoreBack: document.getElementById("btn-highscore-back"),

      // Settings Screen Elements
      settingToggleSound: document.getElementById("setting-toggle-sound"),
      settingToggleMusic: document.getElementById("setting-toggle-music"),
      settingToggleTimed: document.getElementById("setting-toggle-timed"),
      settingBtnReset: document.getElementById("setting-btn-reset"),
      btnSettingsBack: document.getElementById("btn-settings-back"),

      // Achievements Screen Elements
      menuBtnAchievements: document.getElementById("menu-btn-achievements"),
      menuAchievementsCount: document.getElementById("menu-achievements-count"),
      btnAchievementsBack: document.getElementById("btn-achievements-back"),
      achievementsProgressCount: document.getElementById("achievements-progress-count"),
      achievementsProgressBar: document.getElementById("achievements-progress-bar"),
      achievementsCardsContainer: document.getElementById("achievements-cards-container")
    };
  }

  initEvents() {
    // Main Menu Buttons
    this.dom.menuBtnJudge.addEventListener("click", () => {
      this.dom.menuBtnJudge.classList.add("pressed");
      window.soundEngine.playClick();
      this.triggerJudgeAltarEffect();
      setTimeout(() => {
        this.dom.menuBtnJudge.classList.remove("pressed");
        this.openNewRunScreen();
      }, 240);
    });
    this.dom.menuBtnSkills.addEventListener("click", () => this.openSkillTreeScreen());
    this.dom.menuBtnHighScore.addEventListener("click", () => this.openHighScoreScreen());
    if (this.dom.menuBtnAchievements) {
      this.dom.menuBtnAchievements.addEventListener("click", () => this.openAchievementsScreen());
    }
    this.dom.menuBtnSettings.addEventListener("click", () => this.openSettingsScreen());

    // Pre-Run Screen Buttons

    // Achievements Screen Listeners
    if (this.dom.btnAchievementsBack) {
      this.dom.btnAchievementsBack.addEventListener("click", () => {
        window.soundEngine.playClick();
        this.showScreen("screen-main-menu");
      });
    }

    document.querySelectorAll(".achievement-tabs .ach-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".achievement-tabs .ach-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        window.soundEngine.playClick();
        const cat = tab.dataset.category;
        if (window.achievementManager) {
          window.achievementManager.setCategoryFilter(cat);
        }
      });
    });

    // In-Game Decision Buttons
    // Reigns-style preview: hovering/focusing a verdict shows which meters it moves
    const bindPreview = (btn, side) => {
      btn.addEventListener("mouseenter", () => this.previewDecision(side));
      btn.addEventListener("focus", () => this.previewDecision(side));
      btn.addEventListener("mouseleave", () => this.previewDecision(null));
      btn.addEventListener("blur", () => this.previewDecision(null));
    };
    bindPreview(this.dom.btnHeaven, "HEAVEN");
    bindPreview(this.dom.btnHell, "HELL");

    this.dom.btnHeaven.addEventListener("mouseenter", () => window.soundEngine.playHover());
    this.dom.btnHeaven.addEventListener("click", () => {
      if (this.state !== "JUDGING") return;
      this.dom.btnHeaven.classList.add("pressed");
      setTimeout(() => this.dom.btnHeaven.classList.remove("pressed"), 240);
      this.handleDecision("HEAVEN");
    });

    this.dom.btnHell.addEventListener("mouseenter", () => window.soundEngine.playHover());
    this.dom.btnHell.addEventListener("click", () => {
      if (this.state !== "JUDGING") return;
      this.dom.btnHell.classList.add("pressed");
      setTimeout(() => this.dom.btnHell.classList.remove("pressed"), 240);
      this.handleDecision("HELL");
    });

    // Audio Button
    this.dom.btnAudio.addEventListener("click", () => {
      const enabled = window.soundEngine.toggle(this.isMenuScreen());
      this.dom.btnAudio.textContent = enabled ? "SOUND" : "MUTED";
      this.dom.btnAudio.classList.toggle("muted", !enabled);
      if (this.dom.settingToggleSound) {
        this.dom.settingToggleSound.textContent = enabled ? "ENABLED" : "MUTED";
        this.dom.settingToggleSound.classList.toggle("active", enabled);
      }
    });

    // Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
      const advanceKey = e.key === "Enter" || e.key === " ";
      if (advanceKey && this.state === "SHOW_VERDICT" && this.dom.verdictModal.onclick) {
        e.preventDefault();
        this.dom.verdictModal.onclick();
        return;
      }
      if (advanceKey && this.state === "ANGEL_SEQUENCE" && this.dom.screens.angelScreen.onclick) {
        e.preventDefault();
        this.dom.screens.angelScreen.onclick();
        return;
      }
      if (this.state !== "JUDGING" || e.repeat) return;
      if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
        this.dom.btnHeaven.classList.add("pressed");
        setTimeout(() => this.dom.btnHeaven.classList.remove("pressed"), 240);
        this.handleDecision("HEAVEN");
      } else if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
        this.dom.btnHell.classList.add("pressed");
        setTimeout(() => this.dom.btnHell.classList.remove("pressed"), 240);
        this.handleDecision("HELL");
      }
    });

    // Run Results Buttons
    this.dom.resultsBtnReplay.addEventListener("click", () => this.openNewRunScreen());
    this.dom.resultsBtnSkills.addEventListener("click", () => this.openSkillTreeScreen());
    this.dom.resultsBtnMenu.addEventListener("click", () => this.showScreen("screen-main-menu"));

    // Skill Tree Tab Switching
    this.dom.tabJustice.addEventListener("click", () => this.switchBranchTab("justice"));
    this.dom.tabAuthority.addEventListener("click", () => this.switchBranchTab("authority"));
    this.dom.tabDivinity.addEventListener("click", () => this.switchBranchTab("divinity"));
    this.dom.btnSkillsBack.addEventListener("click", () => this.showScreen("screen-main-menu"));

    // High Score Back
    this.dom.btnHighScoreBack.addEventListener("click", () => this.showScreen("screen-main-menu"));

    // Settings Buttons
    this.dom.settingToggleSound.addEventListener("click", () => {
      const enabled = window.soundEngine.toggle(this.isMenuScreen());
      this.dom.settingToggleSound.textContent = enabled ? "ENABLED" : "MUTED";
      this.dom.settingToggleSound.classList.toggle("active", enabled);
      this.dom.btnAudio.textContent = enabled ? "SOUND" : "MUTED";
      this.dom.btnAudio.classList.toggle("muted", !enabled);
    });
    this.dom.settingToggleMusic.addEventListener("click", () => {
      const enabled = window.soundEngine.toggleMusic(this.isMenuScreen());
      this.dom.settingToggleMusic.textContent = enabled ? "ENABLED" : "MUTED";
      this.dom.settingToggleMusic.classList.toggle("active", enabled);
    });
    if (this.dom.settingToggleTimed) {
      this.dom.settingToggleTimed.addEventListener("click", () => {
        window.soundEngine.playClick();
        this.setTimedMode(!this.timedMode);
      });
    }
    this.dom.settingBtnReset.addEventListener("click", () => {
      if (confirm("Reset all permanent XP, Level, and Skill Tree progress?")) {
        window.skillManager.resetProgress();
        this.refreshProgressionUI();
        alert("Progress reset to Level 1 (Mortal).");
      }
    });
    this.dom.btnSettingsBack.addEventListener("click", () => this.showScreen("screen-main-menu"));

    // Audio Context Initializer on First User Gesture
    const startAudio = () => {
      window.soundEngine.ensureContext();
      if (this.isMenuScreen()) {
        window.soundEngine.playMenuMusic();
      }
      window.removeEventListener("pointerdown", startAudio);
      window.removeEventListener("keydown", startAudio);
    };
    window.addEventListener("pointerdown", startAudio);
    window.addEventListener("keydown", startAudio);
  }

  // ==========================================
  // SCREEN NAVIGATION
  // ==========================================
  showScreen(targetId) {
    this.currentScreen = targetId;

    // Hide all full-screen overlays
    Object.values(this.dom.screens).forEach((screen) => {
      if (screen) {
        screen.classList.remove("active");
        screen.classList.remove("visible");
      }
    });

    // Reset gameplay layer visibility
    if (targetId === "gameplay-layer") {
      this.dom.screens.gameplayLayer.classList.remove("hidden");
    } else {
      this.dom.screens.gameplayLayer.classList.add("hidden");
    }

    const target = document.getElementById(targetId);
    if (target) {
      target.classList.add("active");
    }

    // Toggle 3D Judge character visibility
    if (this.judgeCharacter) {
      this.judgeCharacter.root.visible = targetId !== "gameplay-layer";
    }

    // Refresh menu progression if entering main menu
    if (targetId === "screen-main-menu") {
      this.state = "MENU";
      this.renderer.resetLighting();
      this.refreshProgressionUI();
      window.soundEngine.playMenuMusic();
    }
  }

  isMenuScreen() {
    const menuScreens = [
      "screen-main-menu",
      "screen-new-run",
      "screen-skill-tree",
      "screen-high-score",
      "screen-settings",
      "screen-achievements"
    ];
    return menuScreens.includes(this.currentScreen);
  }

  openAchievementsScreen() {
    window.soundEngine.playClick();
    this.showScreen("screen-achievements");
    if (window.achievementManager) {
      window.achievementManager.renderScreen();
    }
  }

  refreshProgressionUI() {
    const lvl = window.skillManager.getPlayerLevel();

    // Menu Card
    if (this.dom.menuPlayerLevel) this.dom.menuPlayerLevel.textContent = lvl.level;
    if (this.dom.menuPlayerTitle) this.dom.menuPlayerTitle.textContent = lvl.title;
    if (this.dom.menuXpBar) this.dom.menuXpBar.style.width = `${lvl.progressPct}%`;
    if (this.dom.menuXpText) {
      this.dom.menuXpText.textContent = lvl.nextXP
        ? `${lvl.currentInLevel} / ${lvl.neededInLevel} XP`
        : `${window.skillManager.totalXP} XP (MAX)`;
    }

    // Dynamic Best Score on Menu High Score Plaque
    const menuBestScore = document.getElementById("menu-best-score");
    if (menuBestScore) {
      menuBestScore.textContent = `BEST: ${window.skillManager.highScore}`;
    }

    // Dynamic Achievements Unlocked Count on Menu
    if (window.achievementManager) {
      window.achievementManager.updateMenuBadge();
    }

    // Tree Header
    if (this.dom.treePlayerLevel) this.dom.treePlayerLevel.textContent = lvl.level;
    if (this.dom.treePlayerTitle) this.dom.treePlayerTitle.textContent = lvl.title;
    if (this.dom.treeXpBar) this.dom.treeXpBar.style.width = `${lvl.progressPct}%`;
    if (this.dom.treeXpCounter) {
      this.dom.treeXpCounter.textContent = lvl.nextXP
        ? `${lvl.currentInLevel} / ${lvl.neededInLevel} XP`
        : `${window.skillManager.totalXP} XP`;
    }
    if (this.dom.treeAvailableXp) {
      this.dom.treeAvailableXp.textContent = window.skillManager.availableXP;
    }
  }

  // ==========================================
  // PRE-RUN SCREEN
  // ==========================================
  openNewRunScreen() {
    // No pre-run screen: straight into the action
    this.startRun();
  }

  startRun() {
    if (this.currentScreen === "gameplay-layer") return;
    window.soundEngine.playClick();
    window.soundEngine.fadeAndStopMenuMusic(400);

    // Hide Judge character so judged souls take center dais
    if (this.judgeCharacter) {
      this.judgeCharacter.root.visible = false;
    }

    // Reset Reign Parameters
    this.reign = window.skillManager.nextReign();
    this.score = 0;
    this.runXP = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.totalJudged = 0;
    this.reignOver = false;
    this.deathInfo = null;
    this.lastEnding = null;
    this.reignHistory = [];
    this.revealLevel = 0;
    this.finalWordArmed = false;
    this.isTimeFrozen = false;
    this.timeFreezeRemaining = 0;
    if (this.verdictTimeout) clearTimeout(this.verdictTimeout);

    window.skillManager.resetRunCharges();
    if (window.meterSystem) {
      window.meterSystem.setWards?.(window.skillManager.hasMeterWards());
      window.meterSystem.reset();
    }
    window.consequenceEngine?.resetReign?.();
    window.storyDeck.reset();
    window.swipeController?.reset?.();

    if (window.achievementManager) {
      window.achievementManager.emit("RUN_STARTED");
    }

    this.showScreen("gameplay-layer");
    this.applyTimedModeUI();
    this.updateHUD();
    this.renderAbilityBar();

    // Spawn first soul
    this.spawnNextSoul();
  }

  // ==========================================
  // TIMED MODE (opt-in) & EVENTS
  // ==========================================
  loadTimedMode() {
    try {
      // 5 seconds per soul is the core of the game — always timed
      return true;
    } catch (e) {
      return false;
    }
  }

  setTimedMode(enabled) {
    this.timedMode = true; // untimed mode removed: always 5s
    try {
      localStorage.setItem("celestai_timed", this.timedMode ? "1" : "0");
    } catch (e) { /* ignore */ }
    this.refreshTimedToggle();
    this.applyTimedModeUI();
  }

  refreshTimedToggle() {
    if (!this.dom.settingToggleTimed) return;
    this.dom.settingToggleTimed.textContent = this.timedMode ? "ON (5s)" : "OFF";
    this.dom.settingToggleTimed.classList.toggle("active", this.timedMode);
  }

  applyTimedModeUI() {
    if (this.dom.timerCircularContainer) {
      this.dom.timerCircularContainer.classList.toggle("timer-off", !this.timedMode);
    }
  }

  dispatch(name, detail) {
    try {
      window.dispatchEvent(new CustomEvent(name, { detail }));
    } catch (e) {
      console.warn(`[celestai] ${name} listener failed`, e);
    }
  }

  // ==========================================
  // IN-GAME ABILITY BAR & SYSTEM
  // ==========================================
  renderAbilityBar() {
    const activeAbilities = window.skillManager.getActiveAbilities();
    if (activeAbilities.length === 0) {
      this.dom.abilityBar.innerHTML = "";
      this.dom.abilityBar.classList.add("hidden");
      return;
    }

    this.dom.abilityBar.classList.remove("hidden");
    let html = "";
    activeAbilities.forEach((ability) => {
      const isAvailable = ability.chargesLeft > 0;
      const statusClass = isAvailable ? "available" : "used";
      const statusText = isAvailable ? "1x" : "USED";

      html += `
        <button class="ability-token ${statusClass}" data-skill-id="${ability.id}" ${!isAvailable ? "disabled" : ""} type="button" title="${ability.name}: ${ability.shortDesc}">
          <div class="token-pedestal"></div>
          <div class="token-surface">
            <span class="token-glyph">${ability.icon}</span>
            <span class="token-name">${ability.name}</span>
            <span class="token-charge-pill">${statusText}</span>
          </div>
        </button>
      `;
    });

    this.dom.abilityBar.innerHTML = html;

    // Attach click listeners to ability buttons
    this.dom.abilityBar.querySelectorAll(".ability-token.available").forEach((btn) => {
      btn.addEventListener("click", () => {
        const skillId = btn.dataset.skillId;
        this.triggerAbility(skillId);
      });
    });
  }

  triggerAbility(skillId) {
    if (this.state !== "JUDGING") return;
    if (!window.skillManager.hasCharge(skillId)) return;

    window.achievementManager?.emit("SKILL_USED", { skillId });

    const story = this.currentStory;
    if (!story) return;

    const consume = () => {
      window.skillManager.useCharge(skillId);
      this.renderAbilityBar();
    };

    switch (skillId) {
      case "true_sight":
        consume();
        window.soundEngine.playAbility();
        this.showAbilityToast(
          ` TRUE SIGHT: "${story.hiddenFact || "This soul hides nothing. What you see is all there is."}"`,
          5000
        );
        break;

      case "moral_clarity": {
        consume();
        window.soundEngine.playAbility();
        this.revealLevel = Math.max(this.revealLevel, 1);
        const ma = story.moralAnalysis || {};
        this.showAbilityToast(
          ` MORAL CLARITY: [INTENT: ${ma.intent || "UNCLEAR"}] • [CONSEQUENCES: ${ma.consequences || "UNCLEAR"}] — ` +
            `HEAVEN ${this.describeEffects(story.heaven && story.heaven.effects, false)} | ` +
            `HELL ${this.describeEffects(story.hell && story.hell.effects, false)}`,
          6000
        );
        break;
      }

      case "double_judgment":
        consume();
        window.soundEngine.playAbility();
        this.revealLevel = 2;
        this.showAbilityToast(
          ` DOUBLE JUDGMENT — HEAVEN: ${this.describeEffects(story.heaven && story.heaven.effects, true)} | ` +
            `HELL: ${this.describeEffects(story.hell && story.hell.effects, true)}`,
          6500
        );
        break;

      case "final_word":
        consume();
        window.soundEngine.playAbility();
        this.finalWordArmed = true;
        this.showAbilityToast(` FINAL WORD: your next verdict cannot push any meter toward its brink.`, 3500);
        break;

      case "time_pause":
        if (this.timedMode) {
          consume();
          window.soundEngine.playTimeFreeze();
          this.freezeTime(3.0);
          this.showAbilityToast(` TIME PAUSED FOR 3 SECONDS`, 2500);
        } else {
          const eased = this.easeMeters("extreme");
          if (!eased) {
            this.showAbilityToast(` The scales are already at rest.`, 2000);
            return;
          }
          consume();
          window.soundEngine.playTimeFreeze();
          this.showAbilityToast(` STILLNESS: ${this.describeEffects(eased, true)} toward balance`, 3000);
        }
        break;

      case "time_dilation":
        consume();
        window.soundEngine.playAbility();
        if (this.timedMode) {
          this.timeLeft += 3.0;
          this.timerDuration = Math.max(this.timerDuration, this.timeLeft);
          this.updateTimerUI();
          this.showAbilityToast(` TIME EXTENDED (+3s)`, 2500);
        } else {
          this.showAbilityToast(` DEFERRAL: ${story.name} is sent back to wait. No verdict, no change.`, 3000);
          this.deferSoul();
        }
        break;

      case "absolute_judgment":
        if (this.timedMode) {
          consume();
          window.soundEngine.playTimeFreeze();
          this.freezeTime(10.0);
          this.showAbilityToast(` ABSOLUTE JUDGMENT: TIME HAS STOPPED (10s)`, 3500);
        } else {
          const eased = this.easeMeters("all");
          if (!eased) {
            this.showAbilityToast(` The scales are already at rest.`, 2000);
            return;
          }
          consume();
          window.soundEngine.playTimeFreeze();
          this.showAbilityToast(` ABSOLUTE JUDGMENT: Heaven rebalances ${this.describeEffects(eased, true)}`, 3500);
        }
        break;

      default:
        break;
    }

    // Re-render an active hover preview with the new reveal level
    if (this.previewSide && this.state === "JUDGING") this.previewDecision(this.previewSide);
  }

  /** "↑11 ↓4" (exact) or "↑ ↓" (direction only). */
  describeEffects(effects, exact) {
    const parts = [];
    Object.keys(METER_ICONS).forEach((k) => {
      const d = Number(effects && effects[k]) || 0;
      if (!d) return;
      parts.push(`${METER_ICONS[k]}${d > 0 ? "↑" : "↓"}${exact ? Math.abs(d) : ""}`);
    });
    return parts.join(" ") || "no change";
  }

  /** Untimed authority skills: ease meters toward 50. mode "extreme" (10 pts on the worst) | "all" (halfway). */
  easeMeters(mode) {
    const ms = window.meterSystem;
    if (!ms) return null;
    const vals = ms.values();
    const effects = {};
    if (mode === "extreme") {
      let key = null;
      let dev = 0;
      Object.entries(vals).forEach(([k, v]) => {
        if (Math.abs(v - 50) > dev) {
          dev = Math.abs(v - 50);
          key = k;
        }
      });
      if (!key) return null;
      const step = Math.min(10, dev);
      effects[key] = vals[key] > 50 ? -step : step;
    } else {
      Object.entries(vals).forEach(([k, v]) => {
        const d = Math.trunc((50 - v) / 2);
        if (d) effects[k] = d;
      });
      if (!Object.keys(effects).length) return null;
    }
    // Moving toward 50 can never cross a brink.
    const res = ms.apply(effects);
    this.updateHUD();
    return res.deltas;
  }

  /** TIME DILATION (untimed): dismiss the current soul without a verdict. */
  deferSoul() {
    this.state = "ENTERING";
    this.setButtonsDisabled(true);
    this.previewDecision(null);
    setTimeout(() => this.spawnNextSoul(), 350);
  }

  /** Reigns-style preview: dots over the meters this side changes (size only unless revealed by a skill). */
  previewDecision(side) {
    const ms = window.meterSystem;
    if (!ms) return;
    if (!side || this.state !== "JUDGING" || !this.currentStory) {
      this.previewSide = null;
      ms.clearPreview?.();
      return;
    }
    this.previewSide = side;
    const branch = this.currentStory[side === "HEAVEN" ? "heaven" : "hell"];
    ms.showPreview?.((branch && branch.effects) || null, this.revealLevel);
  }

  freezeTime(seconds) {
    this.isTimeFrozen = true;
    this.timeFreezeRemaining = seconds;
    if (this.dom.timerBar) this.dom.timerBar.classList.add("frozen");
    if (this.dom.timerCircularContainer) this.dom.timerCircularContainer.classList.add("frozen");
  }

  showAbilityToast(message, duration = 3000) {
    this.dom.abilityToast.textContent = message;
    this.dom.abilityToast.className = "ability-toast active";
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.dom.abilityToast.className = "ability-toast";
    }, duration);
  }

  // ==========================================
  // GAMEPLAY CORE LOOP
  // ==========================================
  setButtonsDisabled(disabled) {
    this.dom.btnHeaven.disabled = disabled;
    this.dom.btnHell.disabled = disabled;
    if (disabled) {
      this.dom.btnHeaven.classList.add("disabled");
      this.dom.btnHell.classList.add("disabled");
    } else {
      this.dom.btnHeaven.classList.remove("disabled");
      this.dom.btnHell.classList.remove("disabled");
    }
  }

  updateHUD() {
    const best = window.skillManager.highScore;
    if (this.dom.statScore) this.dom.statScore.textContent = this.score;
    if (this.dom.statBest) this.dom.statBest.textContent = best;
    if (this.dom.statHighScore) this.dom.statHighScore.textContent = best;
    if (this.dom.statReign) this.dom.statReign.textContent = `JUDGE #${this.reign || 1}`;
    window.meterSystem?.renderHUD?.();
  }

  showScorePopup(text, isPositive) {
    this.dom.scorePop.textContent = text;
    this.dom.scorePop.className = `score-popup active ${isPositive ? "pos" : "neg"}`;
    if (this.scorePopTimeout) clearTimeout(this.scorePopTimeout);
    this.scorePopTimeout = setTimeout(() => {
      this.dom.scorePop.className = "score-popup";
    }, 750);
  }

  spawnNextSoul() {
    if (this.reignOver) {
      this.triggerAngelClimax();
      return;
    }
    if (this.verdictTimeout) {
      clearTimeout(this.verdictTimeout);
      this.verdictTimeout = null;
    }
    this.dom.verdictModal.onclick = null;

    this.state = "ENTERING";
    this.setButtonsDisabled(true);
    this.environment.resetEffects();
    this.renderer.resetLighting();
    // verdict toast stays up on its own timer (non-blocking)
    this.previewDecision(null);
    this.revealLevel = 0;

    // Reset (optional) timer
    this.isTimeFrozen = false;
    this.timeFreezeRemaining = 0;
    this.timerDuration = SOUL_TIMER_SECONDS;
    this.timeLeft = SOUL_TIMER_SECONDS;
    this.lastUrgentTick = -1;
    if (this.dom.timerBar) this.dom.timerBar.classList.remove("frozen");
    this.updateTimerUI();

    // 1. Remove prior soul model
    if (this.currentSoul) {
      this.renderer.scene.remove(this.currentSoul.root);
      this.currentSoul = null;
    }

    // 2. Obtain next card (selection is owned by StoryDeck / consequence engine)
    const story = window.storyDeck.nextStory(this.score);
    if (!story) {
      console.warn("[celestai] deck returned no card; ending reign");
      this.reignOver = true;
      this.triggerAngelClimax();
      return;
    }
    this.currentStory = story;

    // 3. Populate Soul Tablet
    const upper = (v) => String(v == null ? "" : v).toUpperCase();
    this.dom.soulName.textContent = upper(story.name);
    this.dom.soulTitle.textContent = upper(story.title);
    this.dom.soulAge.textContent = story.age != null && story.age !== "" ? `AGE ${story.age}` : "";
    if (this.dom.soulArchetype) this.dom.soulArchetype.textContent = upper(story.archetype);
    if (this.dom.storyVirtue) this.dom.storyVirtue.textContent = story.virtue || "";
    if (this.dom.storySin) this.dom.storySin.textContent = story.sin || "";
    this.dom.storyDilemma.textContent = `"${story.dilemma || ""}"`;
    if (this.dom.storyCard) this.dom.storyCard.dataset.speaker = story.speaker || "soul";

    // Reset button hints (clean, single key)
    this.dom.hintHeaven.textContent = "[A]";
    this.dom.hintHell.textContent = "[D]";

    // 4. Create procedural 3D soul
    this.currentSoul = window.characterFactory.createSoul(story.archetype);
    this.renderer.scene.add(this.currentSoul.root);
    this.animator.setSoul(this.currentSoul);

    // 5. Play entrance animation
    this.animator.playEntrance(() => {
      if (this.state !== "ENTERING" || this.currentStory !== story) return;
      this.state = "JUDGING";
      this.soulSpawnTime = Date.now();
      this.setButtonsDisabled(false);
      this.dispatch("celestai:soul", story);
    });
  }

  /**
   * Death rescue perks. Mutates result (deaths/values), returns a note string or null.
   * FORGIVENESS: first collapse -> collapsing meter(s) back to 50.
   * IMMORTAL SOUL: next collapse -> all four meters back to 50.
   */
  resolveDeaths(result) {
    const ms = window.meterSystem;
    if (!ms || !result.deaths || !result.deaths.length) return null;
    const names = result.deaths.map((d) => d.meter.toUpperCase()).join(" & ");

    if (window.skillManager.hasCharge("forgiveness")) {
      window.skillManager.useCharge("forgiveness");
      result.deaths.forEach((d) => ms.set(d.meter, 50));
      result.saved = result.deaths.map((d) => d.meter);
      result.deaths = [];
      result.values = ms.values();
      window.soundEngine.playAbility();
      const note = ` FORGIVENESS: ${names} would have collapsed — restored to 50.`;
      this.showAbilityToast(note, 3500);
      return note;
    }

    if (window.skillManager.hasCharge("immortal_soul")) {
      window.skillManager.useCharge("immortal_soul");
      ms.KEYS.forEach((k) => ms.set(k, 50));
      result.saved = result.deaths.map((d) => d.meter);
      result.deaths = [];
      result.values = ms.values();
      window.soundEngine.playAbility();
      const note = ` IMMORTAL SOUL: ${names} collapsed, but the Angels restored every meter to 50.`;
      this.showAbilityToast(note, 4000);
      return note;
    }
    return null;
  }

  /** DIVINE INTERVENTION (untimed): first meter in the danger zone is pulled back to 30/70. */
  maybeDivineIntervention() {
    const ms = window.meterSystem;
    if (this.timedMode || !ms || !window.skillManager.hasCharge("divine_intervention")) return null;
    const vals = ms.values();
    const key = ms.KEYS.find((k) => vals[k] <= 10 || vals[k] >= 90);
    if (!key) return null;
    window.skillManager.useCharge("divine_intervention");
    ms.set(key, vals[key] <= 10 ? 30 : 70);
    window.soundEngine.playAbility();
    const note = ` DIVINE INTERVENTION: ${key.toUpperCase()} pulled back from the brink.`;
    this.showAbilityToast(note, 3500);
    return note;
  }

  handleDecision(decision) {
    if (this.state !== "JUDGING") return;
    if (decision !== "HEAVEN" && decision !== "HELL") return;
    const card = this.currentStory;
    if (!card) return;

    this.state = "ANIMATING_RESULT";
    this.setButtonsDisabled(true);
    this.previewDecision(null);

    const decisionTime = this.soulSpawnTime ? (Date.now() - this.soulSpawnTime) / 1000 : 0;

    const ms = window.meterSystem;
    const verdict = window.storyDeck.evaluateDecision(card, decision);
    const effects = { ...verdict.effects };

    // FINAL WORD: cancel every change that would push a meter away from the center
    const cancelled = [];
    const wasArmed = this.finalWordArmed;
    if (this.finalWordArmed && ms) {
      this.finalWordArmed = false;
      const cur = ms.values();
      Object.keys(effects).forEach((k) => {
        const d = Number(effects[k]) || 0;
        const v = cur[k] != null ? cur[k] : 50;
        if (d && Math.abs(v + d - 50) > Math.abs(v - 50)) {
          cancelled.push(k);
          delete effects[k];
        }
      });
    }

    const snap = ms?.snapshot?.();
    const result = ms ? ms.apply(effects) : { deltas: {}, deaths: [], warded: [], values: {} };

    // SECOND CHANCE: a fatal verdict is undone entirely (meters restored) and the soul is judged again
    if (result.deaths.length && snap && window.skillManager.hasCharge("second_chance")) {
      window.skillManager.useCharge("second_chance");
      ms.restore(snap);
      this.finalWordArmed = wasArmed;
      window.soundEngine.playAbility();
      this.showAbilityToast(` SECOND CHANCE: That verdict would have ended your reign. It is undone — judge again.`, 4000);
      this.updateHUD();
      this.state = "JUDGING";
      this.setButtonsDisabled(false);
      this.dispatch("celestai:soul", card);
      return;
    }

    const notes = [];
    if (result.warded && result.warded.length) {
      notes.push(` WARD: ${result.warded.map((k) => k.toUpperCase()).join(" & ")} stopped at the brink.`);
    }
    const rescue = this.resolveDeaths(result);
    if (rescue) notes.push(rescue);
    if (!result.deaths.length) {
      const divine = this.maybeDivineIntervention();
      if (divine) notes.push(divine);
    }
    if (cancelled.length) notes.push(` FINAL WORD cancelled: ${cancelled.map((k) => k.toUpperCase()).join(", ")}`);

    // Judgment sound synchronized with the visual sequence
    if (decision === "HEAVEN") window.soundEngine.playHeaven();
    else window.soundEngine.playHell();

    // Every soul judged: +1 score (reign length), +1 XP
    this.totalJudged++;
    this.score++;
    this.runXP++;
    this.streak = this.score;
    this.bestStreak = this.score;

    window.consequenceEngine?.applyChoice?.(card, verdict.side);
    window.storyDeck.profileTracker.recordDecision(card, decision, result.deltas);
    this.reignHistory.push({ name: card.name, side: decision });
    this.dispatch("celestai:verdict", { side: decision, card, deltas: result.deltas });

    // Achievements: in the meter model every verdict counts; streak = reign length
    window.achievementManager?.emit("SOUL_JUDGED", {
      story: card,
      decision,
      evaluation: { isCorrect: true, ratingLabel: "" },
      timeLeft: this.timedMode ? this.timeLeft : 99,
      decisionTime,
      lives: null,
      streak: this.score
    });

    if (result.deaths.length) {
      this.reignOver = true;
      this.deathInfo = result.deaths[0];
      this.renderer.shakeIntensity = 0.14;
      window.soundEngine.playLifeLost();
      this.showScorePopup("THE SCALES BREAK", false);
    } else {
      this.showScorePopup("+1 SOUL  +1 XP", true);
    }
    this.updateHUD();

    const evaluation = {
      decision,
      card,
      deltas: result.deltas,
      deaths: result.deaths,
      cancelled,
      notes,
      feedback: verdict.feedback,
      quote: verdict.quote
    };

    if (decision === "HEAVEN") {
      this.triggerHeavenSequence(evaluation);
    } else {
      this.triggerHellSequence(evaluation);
    }
  }

  handleTimeout() {
    if (this.state !== "JUDGING" || !this.timedMode) return;

    // DIVINE INTERVENTION (timed): +3s instead of the hesitation penalty
    if (window.skillManager.hasCharge("divine_intervention")) {
      window.skillManager.useCharge("divine_intervention");
      window.soundEngine.playAbility();
      if (window.achievementManager) {
        window.achievementManager.emit("LIFE_SAVED", { perk: "divine_intervention" });
      }
      this.timeLeft = 3.0;
      this.updateTimerUI();
      this.showAbilityToast(` DIVINE INTERVENTION: +3 SECONDS GRANTED`, 3000);
      return;
    }

    this.state = "ANIMATING_RESULT";
    this.setButtonsDisabled(true);
    this.previewDecision(null);

    const card = this.currentStory;
    const ms = window.meterSystem;
    const result = ms ? ms.apply(TIMEOUT_EFFECTS) : { deltas: {}, deaths: [], warded: [], values: {} };
    const notes = [];
    if (result.warded && result.warded.length) {
      notes.push(` WARD: ${result.warded.map((k) => k.toUpperCase()).join(" & ")} stopped at the brink.`);
    }
    const rescue = this.resolveDeaths(result);
    if (rescue) notes.push(rescue);

    if (window.achievementManager) {
      window.achievementManager.emit("TIMER_EXPIRED");
      window.achievementManager.emit("LIFE_LOST");
    }

    this.totalJudged++;
    window.soundEngine.playTimeout();
    window.storyDeck.profileTracker.recordTimeout(result.deltas);
    this.reignHistory.push({ name: card ? card.name : "Unknown soul", side: "TIMEOUT" });
    this.dispatch("celestai:verdict", { side: null, timeout: true, card, deltas: result.deltas });

    if (result.deaths.length) {
      this.reignOver = true;
      this.deathInfo = result.deaths[0];
      this.renderer.shakeIntensity = 0.14;
      window.soundEngine.playLifeLost();
      this.showScorePopup("THE SCALES BREAK", false);
    } else {
      this.showScorePopup("HESITATION  ↓ ↓", false);
    }
    this.updateHUD();

    this.triggerHellSequence({
      decision: "HELL",
      timeout: true,
      card,
      deltas: result.deltas,
      deaths: result.deaths,
      cancelled: [],
      notes,
      feedback: "Hesitation is itself a verdict. The Scribes lose patience and mortals lose faith.",
      quote: ""
    });
  }

  triggerHeavenSequence(evaluation) {
    this.environment.triggerHeavenFX();
    this.renderer.triggerHeavenLighting();

    this.dom.screenFlashHeaven.classList.add("active");
    setTimeout(() => this.dom.screenFlashHeaven.classList.remove("active"), 450);

    this.animator.playHeaven(() => {
      this.showVerdictPopup("HEAVEN", evaluation);
    });
  }

  triggerHellSequence(evaluation) {
    this.environment.triggerHellFX();
    this.renderer.triggerHellLighting();

    this.dom.screenFlashHell.classList.add("active");
    setTimeout(() => this.dom.screenFlashHell.classList.remove("active"), 450);

    this.animator.playHell(() => {
      this.showVerdictPopup("HELL", evaluation);
    });
  }

  showVerdictPopup(decision, evaluation) {
    this.state = "SHOW_VERDICT";
    const ev = evaluation || {};
    const dying = this.reignOver;
    const badge = this.dom.verdictBadge;

    if (dying) {
      badge.textContent = " THE SCALES HAVE BROKEN";
      badge.className = "badge-wrong";
    } else if (ev.timeout) {
      badge.textContent = " HESITATION";
      badge.className = "badge-wrong";
    } else if (decision === "HEAVEN") {
      badge.textContent = "✦ ASCENDED TO HEAVEN · +1 XP";
      badge.className = "badge-heaven";
    } else {
      badge.textContent = "✦ CAST INTO HELL · +1 XP";
      badge.className = "badge-hell";
    }

    const ending = dying && this.deathInfo ? (REIGN_ENDINGS[this.deathInfo.meter] || {})[this.deathInfo.dir] : null;
    this.dom.verdictScore.textContent = ending
      ? ending.cause.toUpperCase()
      : String((ev.card && ev.card.name) || "").toUpperCase();

    // Per-meter delta chips
    if (this.dom.verdictDeltas) {
      const fatal = new Set((ev.deaths || []).map((d) => d.meter));
      const cancelled = ev.cancelled || [];
      let html = "";
      Object.keys(METER_ICONS).forEach((k) => {
        const d = Number(ev.deltas && ev.deltas[k]) || 0;
        if (d) {
          html += `<span class="delta-chip ${d > 0 ? "up" : "down"}${fatal.has(k) ? " fatal" : ""}">${METER_ICONS[k]} ${d > 0 ? "↑" : "↓"}${Math.abs(d)}</span>`;
        } else if (cancelled.includes(k)) {
          html += `<span class="delta-chip cancelled">${METER_ICONS[k]} ✕</span>`;
        }
      });
      this.dom.verdictDeltas.innerHTML = html || `<span class="delta-chip">The scales did not move</span>`;
    }

    if (this.dom.verdictNote) {
      const notes = ev.notes || [];
      this.dom.verdictNote.textContent = notes.join(" ");
      this.dom.verdictNote.classList.toggle("hidden", notes.length === 0);
    }

    this.dom.verdictReasoning.textContent = ev.feedback ? `"${ev.feedback}"` : "";
    this.dom.verdictQuote.textContent = ev.quote ? `"${ev.quote}"` : "";
    const tapHint = document.getElementById("verdict-tap-hint");
    if (tapHint) tapHint.textContent = dying ? "Tap to face the Archangel" : "";

    this.dom.verdictModal.classList.toggle("dying", !!dying);
    this.dom.verdictModal.classList.add("visible");

    let advanced = false;
    const advance = () => {
      if (advanced) return;
      advanced = true;
      if (this.verdictTimeout) clearTimeout(this.verdictTimeout);
      this.verdictTimeout = null;
      this.dom.verdictModal.onclick = null;
      if (dying) {
        this.hideVerdictModal();
        this.triggerAngelClimax();
      } else {
        this.spawnNextSoul();
      }
    };

    if (this.verdictTimeout) clearTimeout(this.verdictTimeout);
    if (this.verdictToastTimer) clearTimeout(this.verdictToastTimer);
    if (dying) {
      this.verdictTimeout = setTimeout(advance, 1500);
      this.dom.verdictModal.onclick = advance;
    } else {
      // Non-blocking: next soul immediately, verdict shows as a toast that fades by itself
      this.verdictToastTimer = setTimeout(() => this.hideVerdictModal(), 1800);
      advance();
    }
  }

  hideVerdictModal() {
    this.dom.verdictModal.classList.remove("visible");
  }

  updateTimerUI() {
    const pct = Math.max(0, Math.min(100, (this.timeLeft / this.timerDuration) * 100));
    
    // Sync fallback linear bar if present
    if (this.dom.timerBar) {
      this.dom.timerBar.style.width = `${pct}%`;
      if (this.timeLeft <= 2.0 && !this.isTimeFrozen) {
        this.dom.timerBar.classList.add("urgent");
      } else {
        this.dom.timerBar.classList.remove("urgent");
      }
    }

    // Circular Countdown SVG Ring
    // Radius = 36 -> Circumference = 2 * Math.PI * 36 = 226.195
    const circumference = 226.195;
    if (this.dom.timerRingProgress) {
      const offset = circumference * (1 - (this.timeLeft / this.timerDuration));
      this.dom.timerRingProgress.style.strokeDashoffset = Math.max(0, offset);
    }

    if (this.dom.timerText) {
      this.dom.timerText.textContent = Math.ceil(Math.max(0, this.timeLeft));
    }

    // Color progression & visual states on circular timer container:
    // Normal (> 2s): warm gold / ivory
    // Warning (1s - 2s): orange
    // Critical (<= 1s): red with pulse
    // Frozen: cyan frost
    if (this.dom.timerCircularContainer) {
      this.dom.timerCircularContainer.classList.remove("warning", "critical");
      if (this.isTimeFrozen) {
        this.dom.timerCircularContainer.classList.add("frozen");
      } else {
        this.dom.timerCircularContainer.classList.remove("frozen");
        if (this.timeLeft <= 1.0) {
          this.dom.timerCircularContainer.classList.add("critical");
        } else if (this.timeLeft <= 2.0) {
          this.dom.timerCircularContainer.classList.add("warning");
        }
      }
    }
  }

  // ==========================================
  // ARCHANGEL CLIMAX SEQUENCE
  // ==========================================
  triggerAngelClimax() {
    if (this.state === "ANGEL_SEQUENCE" || this.state === "RESULTS") return;
    this.state = "ANGEL_SEQUENCE";
    if (this.verdictTimeout) clearTimeout(this.verdictTimeout);
    this.verdictTimeout = null;
    this.dom.verdictModal.onclick = null;
    this.hideVerdictModal();
    this.setButtonsDisabled(true);
    this.previewDecision(null);

    if (window.achievementManager) {
      window.achievementManager.emit("ANGEL_JUDGMENT");
    }

    if (this.currentSoul) {
      this.renderer.scene.remove(this.currentSoul.root);
      this.currentSoul = null;
    }

    // Hide the gameplay HUD/card so it doesn't bleed through the tribunal overlay
    this.dom.screens.gameplayLayer.classList.add("hidden");

    this.renderer.triggerAngelLighting();
    this.environment.resetEffects();

    if (this.currentAngel) {
      this.renderer.scene.remove(this.currentAngel.root);
    }
    this.currentAngel = window.characterFactory.createAngel();
    this.renderer.scene.add(this.currentAngel.root);
    this.animator.setAngel(this.currentAngel);

    window.soundEngine.playAngelIntro();

    const meters = window.meterSystem ? window.meterSystem.values() : {};
    const death = this.deathInfo;
    const ending = death ? (REIGN_ENDINGS[death.meter] || {})[death.dir] || null : null;
    this.lastEnding = ending;

    const summary = {
      reign: this.reign,
      soulsJudged: this.score,
      deathMeter: death ? death.meter : null,
      deathDir: death ? death.dir : null,
      meters,
      history: this.reignHistory.slice(-12)
    };
    this.dispatch("celestai:run-end", summary);

    // Archangel reflection: AI first (self-times-out), static fallback
    let tribunal = Promise.resolve(null);
    try {
      const p = window.aiSouls?.tribunal?.(summary);
      if (p && typeof p.then === "function") {
        tribunal = Promise.race([
          p.catch(() => null),
          new Promise((resolve) => setTimeout(() => resolve(null), 6000))
        ]);
      }
    } catch (e) {
      tribunal = Promise.resolve(null);
    }

    const profile = window.storyDeck.profileTracker.getProfile();
    const destiny = window.storyDeck.profileTracker.calculatePlayerDestiny(this.score, meters, death ? death.meter : null);

    this.runAngelDialogueSequence(profile, destiny, ending, tribunal);
  }

  runAngelDialogueSequence(profile, destiny, ending, tribunal) {
    const screen = this.dom.screens.angelScreen;
    const dialogueBox = this.dom.angelDialogueContent;
    const destinyBox = this.dom.angelDestinyContainer;
    const destinyBanner = this.dom.angelDestinyBanner;
    const tapHint = this.dom.angelTapHint;

    const setBeat = (text) => {
      dialogueBox.innerHTML = "";
      const p = document.createElement("p");
      p.className = "beat-text";
      p.textContent = text;
      dialogueBox.appendChild(p);
    };

    dialogueBox.innerHTML = "";
    destinyBox.classList.add("hidden");
    screen.classList.add("visible");
    tapHint.classList.remove("hidden");
    if (this.dom.angelEndingTitle) {
      this.dom.angelEndingTitle.textContent = ending ? ending.title : "";
      this.dom.angelEndingTitle.classList.toggle("hidden", !ending);
    }

    const n = this.score;
    const staticReflection = `In your court, you consistently valued ${profile.dominantTrait}. ${profile.reflection}`;
    const beats = [
      `"Judge #${this.reign || 1}. You weighed ${n} ${n === 1 ? "soul" : "souls"} before ${ending ? ending.cause.toLowerCase() : "the scales fell silent"}."`,
      ending ? `"${ending.text}"` : `"${profile.reflection}"`,
      { pending: tribunal || Promise.resolve(null), fallback: staticReflection },
      `"Now... it is your turn."`
    ];

    let currentBeat = 0;
    let isRevealing = false;

    const showBeat = () => {
      if (isRevealing) return;

      if (currentBeat < beats.length) {
        const beat = beats[currentBeat];
        currentBeat++;
        window.soundEngine.playClick();
        if (typeof beat === "string") {
          setBeat(beat);
        } else {
          isRevealing = true;
          setBeat("The Archangel weighs your reign...");
          beat.pending
            .then((text) => text, () => null)
            .then((text) => {
              const line = (typeof text === "string" && text.trim()) || beat.fallback;
              setBeat(`"${line.replace(/^"+|"+$/g, "")}"`);
              isRevealing = false;
            });
        }
      } else if (currentBeat === beats.length) {
        // Angel delivers final judgment line
        setBeat(`"The scales have weighed your own conscience."`);
        tapHint.classList.add("hidden");
        isRevealing = true;
        currentBeat++;

        // Short dramatic pause (550ms) before final audio & reveal
        setTimeout(() => {
          window.soundEngine.playFinal();

          setTimeout(() => {
            destinyBox.classList.remove("hidden");
            destinyBanner.textContent = destiny;
            destinyBanner.className = `destiny-banner ${destiny.toLowerCase()}`;
            tapHint.classList.remove("hidden");
            isRevealing = false;

            if (destiny === "HEAVEN") {
              this.dom.screenFlashHeaven.classList.add("active");
              setTimeout(() => this.dom.screenFlashHeaven.classList.remove("active"), 700);
            } else {
              this.dom.screenFlashHell.classList.add("active");
              setTimeout(() => this.dom.screenFlashHell.classList.remove("active"), 700);
            }
          }, 350);
        }, 550);
      } else {
        // Transition to Run Results Screen
        screen.onclick = null;
        screen.classList.remove("visible");
        this.openRunResultsScreen(profile);
      }
    };

    showBeat();

    screen.onclick = () => {
      if (isRevealing) return;
      if (currentBeat <= beats.length + 1) {
        showBeat();
      }
    };
  }

  // ==========================================
  // RUN RESULTS SCREEN
  // ==========================================
  openRunResultsScreen(profile) {
    this.state = "RESULTS";

    // Clean up Angel
    if (this.currentAngel) {
      this.renderer.scene.remove(this.currentAngel.root);
      this.currentAngel = null;
      this.animator.setAngel(null);
    }

    // Save stats and grant XP (score = souls judged this reign)
    const isNewHighScore = this.score > window.skillManager.highScore;
    const levelResult = window.skillManager.addXP(this.runXP);
    window.skillManager.recordRunStats(this.score, this.totalJudged, this.bestStreak);

    // Cause of fall
    const ending = this.lastEnding;
    if (this.dom.resultsTitle) {
      this.dom.resultsTitle.textContent = `JUDGE #${this.reign || 1} HAS FALLEN`;
    }
    if (this.dom.resultsCause) {
      this.dom.resultsCause.textContent = ending
        ? `CAUSE OF FALL: ${ending.cause.toUpperCase()} — ${ending.title}`
        : "";
    }
    if (this.dom.resultsMeters && window.meterSystem) {
      const vals = window.meterSystem.values();
      const dead = this.deathInfo ? this.deathInfo.meter : null;
      this.dom.resultsMeters.innerHTML = window.meterSystem.METERS.map(
        (m) => `<span class="${m.key === dead ? "dead" : ""}" title="${m.label}">${m.icon} ${vals[m.key]}</span>`
      ).join("");
    }

    // Populate Results Screen
    this.dom.resultsScore.textContent = this.score;
    this.dom.resultsHighScore.textContent = window.skillManager.highScore;
    this.dom.resultsJudged.textContent = this.totalJudged;
    this.dom.resultsXpEarned.textContent = `+${this.runXP}`;
    this.dom.resultsTotalXp.textContent = window.skillManager.totalXP;
    this.dom.resultsRank.textContent = window.skillManager.getPlayerLevel().title;

    if (isNewHighScore && this.score > 0) {
      this.dom.resultsHighscoreTag.classList.remove("hidden");
    } else {
      this.dom.resultsHighscoreTag.classList.add("hidden");
    }

    if (levelResult.leveledUp) {
      this.dom.resultsLevelupTag.classList.remove("hidden");
      this.dom.resultsLevelupTag.textContent = `★ LEVEL UP! LEVEL ${levelResult.oldLevel} → LEVEL ${levelResult.newLevel}! ★`;
      window.soundEngine.playLevelUp();
    } else {
      this.dom.resultsLevelupTag.classList.add("hidden");
    }

    const p = profile || window.storyDeck.profileTracker.getProfile();
    this.dom.resultsProfileTitle.textContent = p.title;
    this.dom.resultsProfileDesc.textContent = p.reflection;

    this.showScreen("screen-run-results");
  }

  // ==========================================
  // PERMANENT SKILL TREE SCREEN
  // ==========================================
  openSkillTreeScreen() {
    window.soundEngine.playClick();
    this.showScreen("screen-skill-tree");
    this.refreshProgressionUI();
    this.renderBranchContent();
  }

  switchBranchTab(branchKey) {
    window.soundEngine.playClick();
    this.activeBranchTab = branchKey;

    this.dom.tabJustice.classList.toggle("active", branchKey === "justice");
    this.dom.tabAuthority.classList.toggle("active", branchKey === "authority");
    this.dom.tabDivinity.classList.toggle("active", branchKey === "divinity");

    this.renderBranchContent();
  }

  renderBranchContent() {
    const branchKey = this.activeBranchTab;
    const container = this.dom.branchContent;

    // Filter skills belonging to active branch
    const branchSkills = Object.values(SKILLS_DATA).filter((s) => s.branch === branchKey);

    let html = `<div class="skill-nodes-list">`;

    branchSkills.forEach((skill, idx) => {
      const isUnlocked = window.skillManager.isUnlocked(skill.id);
      const canUnlock = window.skillManager.canUnlock(skill.id);
      const hasPrereq = !skill.prerequisite || window.skillManager.isUnlocked(skill.prerequisite);

      let statusBadge = "";
      let buttonHtml = "";

      if (isUnlocked) {
        statusBadge = `<span class="badge unlocked">✓ UNLOCKED</span>`;
        buttonHtml = `<button class="btn-unlock unlocked" disabled>UNLOCKED</button>`;
      } else if (canUnlock) {
        statusBadge = `<span class="badge ready">READY TO UNLOCK</span>`;
        buttonHtml = `<button class="btn-unlock ready" data-unlock-id="${skill.id}">✦ UNLOCK (${skill.cost} XP) ✦</button>`;
      } else {
        const reason = !hasPrereq ? "REQUIRES PREVIOUS SKILL" : `NEED ${skill.cost} XP`;
        statusBadge = `<span class="badge locked"> LOCKED</span>`;
        buttonHtml = `<button class="btn-unlock locked" disabled>${reason}</button>`;
      }

      html += `
        <div class="skill-node-card ${isUnlocked ? "unlocked" : ""} ${canUnlock ? "can-unlock" : ""}">
          <div class="node-left">
            <div class="node-icon-box">${skill.icon}</div>
          </div>
          <div class="node-center">
            <div class="node-title-row">
              <span class="node-name">${skill.name}</span>
              ${statusBadge}
            </div>
            <p class="node-desc">${skill.shortDesc}</p>
            <div class="node-cost-row">COST: <strong class="xp-highlight">${skill.cost} XP</strong></div>
          </div>
          <div class="node-right">
            ${buttonHtml}
          </div>
        </div>
      `;

      // Draw celestial branch connector line if not last node
      if (idx < branchSkills.length - 1) {
        const nextSkill = branchSkills[idx + 1];
        const connectorActive = isUnlocked;
        html += `<div class="node-connector ${connectorActive ? "active" : ""}"></div>`;
      }
    });

    html += `</div>`;
    container.innerHTML = html;

    // Wire unlock buttons
    container.querySelectorAll(".btn-unlock.ready").forEach((btn) => {
      btn.addEventListener("click", () => {
        const skillId = btn.dataset.unlockId;
        if (window.skillManager.unlockSkill(skillId)) {
          window.soundEngine.playLevelUp();
          this.refreshProgressionUI();
          this.renderBranchContent();
        }
      });
    });
  }

  // ==========================================
  // HIGH SCORE SCREEN
  // ==========================================
  openHighScoreScreen() {
    window.soundEngine.playClick();
    this.showScreen("screen-high-score");

    this.dom.recordBestScore.textContent = window.skillManager.highScore;
    this.dom.recordBestStreak.textContent = window.skillManager.bestStreak;
    this.dom.recordSoulsJudged.textContent = window.skillManager.lifetimeSouls;
    this.dom.recordLifetimeXp.textContent = window.skillManager.totalXP;
  }

  // ==========================================
  // SETTINGS SCREEN
  // ==========================================
  openSettingsScreen() {
    window.soundEngine.playClick();
    this.showScreen("screen-settings");
    this.dom.settingToggleSound.textContent = window.soundEngine.enabled ? "ENABLED" : "MUTED";
    this.dom.settingToggleSound.classList.toggle("active", window.soundEngine.enabled);
    this.dom.settingToggleMusic.textContent = window.soundEngine.musicEnabled ? "ENABLED" : "MUTED";
    this.dom.settingToggleMusic.classList.toggle("active", window.soundEngine.musicEnabled);
    this.refreshTimedToggle();
  }

  // ==========================================
  // MAIN ANIMATION & RENDERING LOOP
  // ==========================================
  startLoop() {
    const loop = () => {
      requestAnimationFrame(loop);
      const delta = Math.min(this.clock.getDelta(), 0.1);
      const time = this.clock.getElapsedTime();

      // Countdown Timer during JUDGING phase
      if (this.state === "JUDGING" && this.timedMode) {
        if (this.isTimeFrozen) {
          this.timeFreezeRemaining -= delta;
          if (this.timeFreezeRemaining <= 0) {
            this.isTimeFrozen = false;
            if (this.dom.timerBar) this.dom.timerBar.classList.remove("frozen");
            this.updateTimerUI();
          }
        } else {
          this.timeLeft -= delta;
          this.updateTimerUI();

          const currentSec = Math.ceil(this.timeLeft);
          if (currentSec !== this.lastUrgentTick) {
            this.lastUrgentTick = currentSec;
            if (this.timeLeft <= 2.0 && this.timeLeft > 0) {
              window.soundEngine.playUrgentTick();
            } else if (this.timeLeft > 2.0) {
              window.soundEngine.playTick();
            }
          }

          if (this.timeLeft <= 0) {
            this.handleTimeout();
          }
        }
      }

      // Update 3D environment & character animations
      this.environment.update(delta, time);
      this.animator.update(delta);
      if (this.judgeCharacter && this.judgeCharacter.root.visible) {
        this.updateJudgeIdle(time, delta);
      }
      this.renderer.render(delta);
    };
    requestAnimationFrame(loop);
  }

  // ==========================================
  // CELESTAI - JUDGE CHARACTER & ALTAR EFFECTS
  // ==========================================
  initJudge() {
    if (window.characterFactory && window.characterFactory.createJudge) {
      this.judgeCharacter = window.characterFactory.createJudge();
      this.judgeCharacter.root.position.set(0, 0, 0);
      this.renderer.scene.add(this.judgeCharacter.root);
    }
  }

  triggerJudgeAltarEffect() {
    if (this.renderer && this.renderer.judgeSpot) {
      const origIntensity = this.renderer.judgeSpot.intensity;
      this.renderer.judgeSpot.intensity = 3.2;
      setTimeout(() => {
        if (this.renderer && this.renderer.judgeSpot) {
          this.renderer.judgeSpot.intensity = origIntensity;
        }
      }, 250);
    }

    if (this.dom.screenFlashHeaven) {
      this.dom.screenFlashHeaven.classList.add("active");
      setTimeout(() => {
        this.dom.screenFlashHeaven.classList.remove("active");
      }, 200);
    }
  }

  updateJudgeIdle(time, delta) {
    if (!this.judgeCharacter) return;
    const j = this.judgeCharacter;

    // Subtle authoritative breathing animation
    const breath = Math.sin(time * 2.2);
    j.torso.position.y = 1.18 + breath * 0.016;
    j.torso.rotation.x = breath * 0.012;

    // Subtle head movement
    j.head.position.y = 1.2 + Math.sin(time * 2.2 + 0.3) * 0.012;
    j.head.rotation.y = Math.sin(time * 0.7) * 0.04;

    // Halo floating counter-phase
    j.halo.position.y = 0.68 + Math.sin(time * 2.4) * 0.035;
    j.halo.rotation.z = time * 0.35;

    // Miniature scales gentle balance sway
    if (j.sBeam) {
      j.sBeam.rotation.z = Math.sin(time * 1.5) * 0.07;
    }

    // Pedestal gentle floating debris rocks
    if (j.debris) {
      j.debris.forEach((item, idx) => {
        item.mesh.position.y = item.baseY + Math.sin(time * item.speed + idx) * 0.024;
        item.mesh.rotation.x += delta * 0.4;
        item.mesh.rotation.y += delta * 0.6;
      });
    }

    // Celestial rune ring subtle luminescence pulse
    if (j.runeRing && j.runeRing.material) {
      j.runeRing.material.opacity = 0.78 + Math.sin(time * 2.8) * 0.2;
    }
  }
}

// Bootstrap on DOM ready
window.addEventListener("DOMContentLoaded", () => {
  if (typeof THREE !== "undefined") {
    window.game = new CelestialGame();
  } else {
    const checkInterval = setInterval(() => {
      if (typeof THREE !== "undefined") {
        clearInterval(checkInterval);
        window.game = new CelestialGame();
      }
    }, 50);
  }
});
