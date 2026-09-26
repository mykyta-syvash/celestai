/**
 * Celestial Judgment - Complete Game Loop & Skill Tree Controller
 * Coordinates:
 * 1. Screen Flow: Main Menu -> New Run -> Gameplay -> Angel Climax -> Run Results -> Skill Tree -> Menu
 * 2. Permanent Judge Progression: Lifetime XP, Levels, and Skill Tree Unlocks
 * 3. In-Game Active & Passive Skills: True Sight, Time Pause, Second Chance, Extra Life, etc.
 * 4. Real-time 5-Second Timer with pauses and dilations
 * 5. Procedural 3D WebGL scene integration
 */

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

    // Timer & Mechanics
    this.timerDuration = 5.0;
    this.timeLeft = 5.0;
    this.isTimeFrozen = false;
    this.timeFreezeRemaining = 0;
    this.lastUrgentTick = -1;

    // Run Progression
    this.lives = 3;
    this.score = 0;
    this.runXP = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.totalJudged = 0;
    this.pendingSecondChance = false;
    this.activeBranchTab = "justice";

    // DOM Caching
    this.initDOM();
    this.initEvents();

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
        settings: document.getElementById("screen-settings")
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
      preRunLives: document.getElementById("pre-run-lives"),
      preRunAbilitiesPreview: document.getElementById("pre-run-abilities-preview"),
      btnBeginRun: document.getElementById("btn-begin-run"),
      btnNewRunBack: document.getElementById("btn-new-run-back"),

      // In-Game HUD & Ability Bar
      topBar: document.getElementById("top-bar"),
      statScore: document.getElementById("stat-score"),
      statLives: document.getElementById("stat-lives"),
      statStreak: document.getElementById("stat-streak"),
      statHighScore: document.getElementById("stat-highscore"),
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
      verdictReasoning: document.getElementById("verdict-reasoning"),
      verdictQuote: document.getElementById("verdict-quote"),

      // Angel Sequence Elements
      angelDialogueContent: document.getElementById("angel-dialogue-content"),
      angelDestinyContainer: document.getElementById("angel-destiny-container"),
      angelDestinyBanner: document.getElementById("angel-destiny-banner"),
      angelTapHint: document.getElementById("angel-tap-hint"),

      // Run Results Elements
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
      settingBtnReset: document.getElementById("setting-btn-reset"),
      btnSettingsBack: document.getElementById("btn-settings-back")
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
    this.dom.menuBtnSettings.addEventListener("click", () => this.openSettingsScreen());

    // Pre-Run Screen Buttons
    this.dom.btnBeginRun.addEventListener("click", () => this.startRun());
    this.dom.btnNewRunBack.addEventListener("click", () => this.showScreen("screen-main-menu"));

    // In-Game Decision Buttons
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
      this.dom.btnAudio.textContent = enabled ? "🔊" : "🔇";
      this.dom.btnAudio.classList.toggle("muted", !enabled);
      if (this.dom.settingToggleSound) {
        this.dom.settingToggleSound.textContent = enabled ? "ENABLED" : "MUTED";
        this.dom.settingToggleSound.classList.toggle("active", enabled);
      }
    });

    // Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
      if (this.state !== "JUDGING") return;
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
      this.dom.btnAudio.textContent = enabled ? "🔊" : "🔇";
      this.dom.btnAudio.classList.toggle("muted", !enabled);
    });
    this.dom.settingToggleMusic.addEventListener("click", () => {
      const enabled = window.soundEngine.toggleMusic(this.isMenuScreen());
      this.dom.settingToggleMusic.textContent = enabled ? "ENABLED" : "MUTED";
      this.dom.settingToggleMusic.classList.toggle("active", enabled);
    });
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
      "screen-settings"
    ];
    return menuScreens.includes(this.currentScreen);
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
    window.soundEngine.playClick();
    this.showScreen("screen-new-run");

    const maxLives = window.skillManager.getMaxLives();
    let heartsHtml = "";
    for (let i = 0; i < maxLives; i++) {
      heartsHtml += `<span class="heart active">♥</span>`;
    }
    this.dom.preRunLives.innerHTML = heartsHtml;

    // Preview unlocked active skills
    const activeSkills = window.skillManager.getActiveAbilities();
    if (activeSkills.length > 0) {
      let previewHtml = `<span class="preview-title">UNLOCKED RUN ABILITIES</span><div class="preview-badges">`;
      activeSkills.forEach((s) => {
        previewHtml += `<span class="ability-pill-preview">${s.icon} ${s.name}</span>`;
      });
      previewHtml += `</div>`;
      this.dom.preRunAbilitiesPreview.innerHTML = previewHtml;
    } else {
      this.dom.preRunAbilitiesPreview.innerHTML = `
        <span class="preview-hint">No active skills unlocked yet. Earn XP to unlock abilities in the Skill Tree!</span>
      `;
    }
  }

  startRun() {
    window.soundEngine.playClick();
    window.soundEngine.fadeAndStopMenuMusic(400);

    // Hide Judge character so judged souls take center dais
    if (this.judgeCharacter) {
      this.judgeCharacter.root.visible = false;
    }

    // Reset Run Parameters
    this.lives = window.skillManager.getMaxLives();
    this.score = 0;
    this.runXP = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.totalJudged = 0;
    this.pendingSecondChance = false;
    this.isTimeFrozen = false;
    this.timeFreezeRemaining = 0;

    window.skillManager.resetRunCharges();
    window.storyDeck.reset();

    this.showScreen("gameplay-layer");
    this.updateHUD();
    this.renderAbilityBar();

    // Spawn first soul
    this.spawnNextSoul();
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

    window.skillManager.useCharge(skillId);
    this.renderAbilityBar();

    const story = this.currentStory;

    switch (skillId) {
      case "true_sight":
        window.soundEngine.playAbility();
        this.showAbilityToast(`👁️ TRUE SIGHT: "${story.hiddenFact}"`, 4500);
        break;

      case "moral_clarity":
        window.soundEngine.playAbility();
        this.showAbilityToast(
          `⚖️ MORAL CLARITY: [INTENT: ${story.moralAnalysis.intent}] • [CONSEQUENCES: ${story.moralAnalysis.consequences}]`,
          4500
        );
        break;

      case "double_judgment":
        window.soundEngine.playAbility();
        this.showAbilityToast(
          `⚡ DOUBLE JUDGMENT: [HEAVEN: ${story.heavenDefensibility}%] • [HELL: ${story.hellDefensibility}%]`,
          4500
        );
        break;

      case "time_pause":
        window.soundEngine.playTimeFreeze();
        this.freezeTime(3.0);
        this.showAbilityToast(`⏸️ TIME PAUSED FOR 3 SECONDS`, 2500);
        break;

      case "time_dilation":
        window.soundEngine.playAbility();
        this.timeLeft = Math.min(8.0, this.timeLeft + 3.0);
        this.timerDuration = Math.max(this.timerDuration, 8.0);
        this.updateTimerUI();
        this.showAbilityToast(`⏳ TIME EXTENDED (+3s)`, 2500);
        break;

      case "absolute_judgment":
        window.soundEngine.playTimeFreeze();
        this.freezeTime(10.0);
        this.showAbilityToast(`👑 ABSOLUTE JUDGMENT: TIME HAS STOPPED (10s)`, 3500);
        break;

      default:
        break;
    }
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
    this.dom.statScore.textContent = this.score;
    this.dom.statHighScore.textContent = window.skillManager.highScore;
    this.dom.statStreak.textContent = `🔥 ${this.streak}`;

    const maxLives = window.skillManager.getMaxLives();
    let heartsHtml = "";
    for (let i = 0; i < maxLives; i++) {
      if (i < this.lives) {
        heartsHtml += `<span class="hud-heart active">♥</span>`;
      } else {
        heartsHtml += `<span class="hud-heart lost">♡</span>`;
      }
    }
    this.dom.statLives.innerHTML = heartsHtml;
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
    if (this.lives <= 0) {
      this.triggerAngelClimax();
      return;
    }

    this.state = "ENTERING";
    this.setButtonsDisabled(true);
    this.environment.resetEffects();
    this.renderer.resetLighting();
    this.hideVerdictModal();

    // Unfreeze time
    this.isTimeFrozen = false;
    this.timeFreezeRemaining = 0;
    this.timerDuration = 5.0;
    this.timeLeft = 5.0;
    this.lastUrgentTick = -1;
    this.dom.timerBar.classList.remove("frozen");
    this.updateTimerUI();

    // 1. Remove prior soul model
    if (this.currentSoul) {
      this.renderer.scene.remove(this.currentSoul.root);
      this.currentSoul = null;
    }

    // 2. Obtain pre-generated soul
    this.currentStory = window.storyDeck.nextStory(this.score);

    // 3. Populate Dilemma Card
    this.dom.soulName.textContent = this.currentStory.name;
    this.dom.soulTitle.textContent = this.currentStory.title;
    this.dom.soulAge.textContent = `Age ${this.currentStory.age}`;
    this.dom.soulArchetype.textContent = this.currentStory.archetype.toUpperCase();
    this.dom.storyVirtue.textContent = this.currentStory.virtue;
    this.dom.storySin.textContent = this.currentStory.sin;
    this.dom.storyDilemma.textContent = this.currentStory.dilemma;

    // Reset button hints
    this.dom.hintHeaven.textContent = "[A] or [←]";
    this.dom.hintHell.textContent = "[D] or [→]";

    // 4. Create procedural 3D soul
    this.currentSoul = window.characterFactory.createSoul(this.currentStory.archetype);
    this.renderer.scene.add(this.currentSoul.root);
    this.animator.setSoul(this.currentSoul);

    // 5. Play entrance animation
    this.animator.playEntrance(() => {
      this.state = "JUDGING";
      this.setButtonsDisabled(false);
    });
  }

  handleDecision(decision) {
    if (this.state !== "JUDGING") return;
    this.state = "ANIMATING_RESULT";
    this.setButtonsDisabled(true);

    // Play judgment sound immediately upon decision, synchronized with button animation & visual effects
    if (decision === "HEAVEN") {
      window.soundEngine.playHeaven();
    } else {
      window.soundEngine.playHell();
    }

    this.totalJudged++;

    // Check FINAL WORD perk
    const hasFinalWord = window.skillManager.hasCharge("final_word");
    const evaluation = window.storyDeck.evaluateDecision(this.currentStory, decision, hasFinalWord);

    if (hasFinalWord && evaluation.ratingLabel.includes("FINAL WORD")) {
      window.skillManager.useCharge("final_word");
      this.showAbilityToast(`📜 FINAL WORD: Debatable judgment accepted as correct!`, 3000);
    }

    const isCorrect = evaluation.isCorrect;

    if (isCorrect) {
      // SUCCESS: +1 Score, +1 XP
      this.score++;
      this.runXP++;
      this.streak++;
      if (this.streak > this.bestStreak) {
        this.bestStreak = this.streak;
      }
      window.soundEngine.playCorrect();
      this.showScorePopup("+1 SCORE  +1 XP", true);
      this.updateHUD();

      // Streak milestone pulse (5, 10, 15...)
      if (this.streak > 0 && this.streak % 5 === 0) {
        this.showAbilityToast(`🔥 STREAK MILESTONE: ${this.streak} SOULS IN A ROW! 🔥`, 2200);
      }

      if (decision === "HEAVEN") {
        this.triggerHeavenSequence(evaluation);
      } else {
        this.triggerHellSequence(evaluation);
      }
    } else {
      // WRONG DECISION: Check perks (Second Chance, Forgiveness, Immortal Soul)

      // 1. SECOND CHANCE Check
      if (window.skillManager.hasCharge("second_chance") && !this.pendingSecondChance) {
        window.skillManager.useCharge("second_chance");
        this.pendingSecondChance = true;
        this.renderAbilityBar();
        window.soundEngine.playAbility();
        this.showAbilityToast(`🔄 SECOND CHANCE: That judgment was incorrect. Choose again!`, 3500);

        // Allow picking again!
        this.state = "JUDGING";
        this.setButtonsDisabled(false);
        return;
      }

      this.pendingSecondChance = false;

      // 2. FORGIVENESS Check
      if (window.skillManager.hasCharge("forgiveness")) {
        window.skillManager.useCharge("forgiveness");
        this.renderAbilityBar();
        window.soundEngine.playAbility();
        this.showAbilityToast(`🕊️ FORGIVEN: Your first transgression is pardoned without penalty.`, 3500);

        evaluation.feedback = "Transgression was forgiven by the Archangel's grace.";
        this.updateHUD();

        if (decision === "HEAVEN") {
          this.triggerHeavenSequence(evaluation);
        } else {
          this.triggerHellSequence(evaluation);
        }
        return;
      }

      // 3. IMMORTAL SOUL Check (Prevent lethal loss on final life)
      if (this.lives === 1 && window.skillManager.hasCharge("immortal_soul")) {
        window.skillManager.useCharge("immortal_soul");
        this.renderAbilityBar();
        window.soundEngine.playAbility();
        this.showAbilityToast(`🛡️ IMMORTAL SOUL: The Angels have granted you one last chance.`, 4000);

        this.streak = 0;
        this.updateHUD();

        if (decision === "HEAVEN") {
          this.triggerHeavenSequence(evaluation);
        } else {
          this.triggerHellSequence(evaluation);
        }
        return;
      }

      // Standard life loss
      this.lives = Math.max(0, this.lives - 1);
      this.streak = 0;
      window.soundEngine.playLifeLost();
      this.showScorePopup("WRONG JUDGMENT  -1 LIFE", false);
      this.renderer.shakeIntensity = 0.14;
      this.updateHUD();

      if (decision === "HEAVEN") {
        this.triggerHeavenSequence(evaluation);
      } else {
        this.triggerHellSequence(evaluation);
      }
    }
  }

  handleTimeout() {
    if (this.state !== "JUDGING") return;

    // Check DIVINE INTERVENTION perk
    if (window.skillManager.hasCharge("divine_intervention")) {
      window.skillManager.useCharge("divine_intervention");
      this.renderAbilityBar();
      window.soundEngine.playAbility();
      this.timeLeft = 3.0;
      this.updateTimerUI();
      this.showAbilityToast(`✨ DIVINE INTERVENTION: +3 SECONDS GRANTED`, 3000);
      return;
    }

    this.state = "ANIMATING_RESULT";
    this.setButtonsDisabled(true);

    this.totalJudged++;
    this.lives = Math.max(0, this.lives - 1);
    this.streak = 0;
    this.updateHUD();

    window.soundEngine.playTimeout();
    this.showScorePopup("-1 LIFE (TIMEOUT)", false);
    window.storyDeck.profileTracker.recordTimeout();

    const timeoutEvaluation = {
      score: 0,
      ratingLabel: "HESITATION PENALTY",
      isCorrect: false,
      feedback: "Impartiality in the face of judgment is itself a moral failure. Hesitation costs an innocent soul."
    };

    this.triggerHellSequence(timeoutEvaluation);
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
    const story = this.currentStory;
    const isCorrect = evaluation.isCorrect;

    if (isCorrect) {
      this.dom.verdictBadge.textContent = "CORRECT JUDGMENT  +1 SCORE +1 XP";
      this.dom.verdictBadge.className = "badge-correct";
    } else {
      this.dom.verdictBadge.textContent = "WRONG JUDGMENT  -1 LIFE";
      this.dom.verdictBadge.className = "badge-wrong";
    }

    this.dom.verdictScore.textContent = `${evaluation.ratingLabel} (${evaluation.score}/100)`;
    this.dom.verdictReasoning.textContent = `"${evaluation.feedback}"`;
    this.dom.verdictQuote.textContent = story
      ? `"${decision === "HEAVEN" ? story.heavenQuote : story.hellQuote}"`
      : "";

    this.dom.verdictModal.classList.add("visible");

    if (this.lives <= 0) {
      if (this.verdictTimeout) clearTimeout(this.verdictTimeout);
      this.verdictTimeout = setTimeout(() => {
        this.hideVerdictModal();
        this.triggerAngelClimax();
      }, 1600);
      return;
    }

    if (this.verdictTimeout) clearTimeout(this.verdictTimeout);
    this.verdictTimeout = setTimeout(() => {
      this.spawnNextSoul();
    }, 1600);

    this.dom.verdictModal.onclick = () => {
      if (this.verdictTimeout) clearTimeout(this.verdictTimeout);
      this.spawnNextSoul();
    };
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
    this.state = "ANGEL_SEQUENCE";
    this.hideVerdictModal();
    this.setButtonsDisabled(true);

    if (this.currentSoul) {
      this.renderer.scene.remove(this.currentSoul.root);
      this.currentSoul = null;
    }

    this.renderer.triggerAngelLighting();
    this.environment.resetEffects();

    if (this.currentAngel) {
      this.renderer.scene.remove(this.currentAngel.root);
    }
    this.currentAngel = window.characterFactory.createAngel();
    this.renderer.scene.add(this.currentAngel.root);
    this.animator.setAngel(this.currentAngel);

    window.soundEngine.playAngelIntro();

    const profile = window.storyDeck.profileTracker.getProfile();
    const destiny = window.storyDeck.profileTracker.calculatePlayerDestiny(this.score);

    this.runAngelDialogueSequence(profile, destiny);
  }

  runAngelDialogueSequence(profile, destiny) {
    const screen = this.dom.screens.angelScreen;
    const dialogueBox = this.dom.angelDialogueContent;
    const destinyBox = this.dom.angelDestinyContainer;
    const destinyBanner = this.dom.angelDestinyBanner;
    const tapHint = this.dom.angelTapHint;

    dialogueBox.innerHTML = "";
    destinyBox.classList.add("hidden");
    screen.classList.add("visible");
    tapHint.classList.remove("hidden");

    const beats = [
      `"You have judged ${this.totalJudged} souls with a final score of ${this.score}."`,
      `"In your court, you consistently valued ${profile.dominantTrait}."`,
      `"${profile.reflection}"`,
      `"Now... it is your turn."`
    ];

    let currentBeat = 0;
    let isRevealing = false;

    const showBeat = () => {
      if (isRevealing) return;

      if (currentBeat < beats.length) {
        dialogueBox.innerHTML = `<p class="beat-text">${beats[currentBeat]}</p>`;
        window.soundEngine.playClick();
        currentBeat++;
      } else if (currentBeat === beats.length) {
        // Angel delivers final judgment line
        dialogueBox.innerHTML = `<p class="beat-text">"The scales have weighed your own conscience."</p>`;
        tapHint.classList.add("hidden");
        isRevealing = true;
        currentBeat++;

        // Short dramatic pause (550ms) before final audio & reveal
        setTimeout(() => {
          // Play final.mp3 at the dramatic reveal moment
          window.soundEngine.playFinal();

          // Synchronize reveal with audio swell
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

    // Save stats and grant XP
    const isNewHighScore = this.score > window.skillManager.highScore;
    const levelResult = window.skillManager.addXP(this.runXP);
    window.skillManager.recordRunStats(this.score, this.totalJudged, this.bestStreak);

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
        statusBadge = `<span class="badge locked">🔒 LOCKED</span>`;
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
      if (this.state === "JUDGING") {
        if (this.isTimeFrozen) {
          this.timeFreezeRemaining -= delta;
          if (this.timeFreezeRemaining <= 0) {
            this.isTimeFrozen = false;
            this.dom.timerBar.classList.remove("frozen");
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
    j.head.position.y = 0.98 + Math.sin(time * 2.2 + 0.3) * 0.012;
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
