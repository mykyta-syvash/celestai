# ⚖️ CELESTAI — Five Seconds to Judge a Soul

A fast-paced, high-stakes low-poly 3D moral judgment game inspired by modern mobile arcade games. You play as the Celestial Arbiter presiding over an ethereal judgment dais, deciding the eternal fate of complex human souls through razor-sharp moral dilemmas under intense 5-second time pressure.

---

## ⚡ Complete Game Loop

```
MAIN MENU (Player Level, Rank, XP Bar)
         ↓  [JUDGE]
NEW JUDGMENT (Lives preview, Current Score, Abilities preview)
         ↓  [BEGIN]
GAMEPLAY (5s timer, Ability Bar, AI Defensibility Evaluation)
         ↓  (Mistake: -1 Life | Correct: +1 Score & +1 XP)
ALL LIVES LOST (3 mistakes or 4 with Extra Life perk)
         ↓
THE ARCHANGEL'S TRIBUNAL
         ↓  ("Now it is your turn...")
ANGEL DESTINY REVEAL (Heaven / Hell)
         ↓
RUN RESULTS (Score, High Score, XP Earned, Level Up, Moral Profile)
         ↓
THE JUDGE: SKILL TREE (Spend XP to unlock permanent divine powers)
         ↓
MAIN MENU / JUDGE AGAIN
```

---

## 🎮 Game Systems

### 1. Scoring & 3 Lives (♥ ♥ ♥)
- **Starting Lives**: 3 (`♥ ♥ ♥`).
- **Defensible Judgment**: Score $\ge 40 \to$ `+1 SCORE` with green floating popup and streak increment.
- **Indefensible Judgment**: Score $< 40 \to$ `-1 LIFE` with dramatic heart-break and screen shake.
- **High Score**: Persists locally across runs in `localStorage`.
- **Game Over**: Losing your 3rd life immediately halts the mortal soul queue and triggers **The Archangel's Tribunal**.

### 2. Multi-Tier Moral Complexity
Moral cases are not black-and-white. The dilemmas balance intent, collateral consequences, systemic necessity, sacrifice, and justice across three dynamic difficulty tiers:
- **Tier 1 (Early Game, Score 0–3)**: Obvious heroes with minor human flaws or predatory villains with token excuses.
- **Tier 2 (Mid Game, Score 4–8)**: Conflicting actions where both choices are defensible (e.g., Robin Hood thefts that fed thousands but accidentally killed a guard).
- **Tier 3 (Late Game, Score 9+)**: Profound dilemmas involving mass utilitarian triage, sacrifice of innocent lives to stop global catastrophe, military treason to expose hospital bombings, and artificial intelligence rights.

### 3. AI Defensibility Evaluation (0–100)
- Every case possesses separate defensibility ratings for **both** Heaven and Hell:
  - **70–100**: `STRONG JUDGMENT`
  - **40–69**: `DEFENSIBLE / DEBATABLE`
  - **0–39**: `WEAK JUDGMENT`
- **Controversial cases allow both choices to score!** (e.g. Heaven: 76, Hell: 82). The game rewards sound moral reasoning rather than guessing a developer's single hidden bias.
- After each verdict, a punchy 1-sentence AI explanation articulates the philosophical trade-off.

### 4. 5-Second Real-Time Countdown
- The player has 5 seconds per soul.
- At $\le 2$ seconds, the bar flashes urgent crimson accompanied by rapid audio ticks.
- **Hesitation Penalty**: Running out of time counts as an automatic failure (`-1 LIFE`), plunging the soul into the abyss with the lesson: *"Impartiality in the face of judgment is itself a moral failure."*

### 5. Background Pre-Generation
- While the player reviews the active soul, the subsequent case is pre-selected and cached in the background according to the player's score tier.
- Transitions between souls are instantaneous (0ms latency).

### 6. The Archangel Tribunal & Player Destiny
When the player exhausts all 3 lives:
1. The courtroom plunges into atmospheric darkness under a stark celestial spotlight.
2. The **Archangel** descends onto the dais with spread faceted wings, floating golden halo, and the judgment staff.
3. The Angel reflects upon the player's overarching judicial habits (mercy vs retribution, utility vs principle).
4. The Angel assigns a **Player Moral Profile**:
   - `THE UTILITARIAN`: Prioritized net lives saved and greater good despite dirty hands.
   - `THE ABSOLUTIST`: Upheld moral commandments, refusing to excuse intentional evil.
   - `THE MERCIFUL`: Consistently granted redemption and forgiveness to suffering souls.
   - `THE PUNISHER`: Strictly condemned transgressions with an iron hand.
   - `THE FORGIVER`: Pardoned souls who sacrificed for loved ones.
   - `THE BALANCED JUDGE`: Balanced scales without dogma.
5. The Angel issues the final verdict: **YOUR SOUL BELONGS IN HEAVEN OR HELL**.

---

### 6. Permanent Judge Skill Tree ("THE JUDGE")

Earn **+1 XP** for every correct judgment. XP is permanent, persists in `localStorage`, and determines Player Rank:
- **Level 1**: MORTAL (0 XP)
- **Level 2**: ACOLYTE (10 XP)
- **Level 3**: JUDGE (25 XP)
- **Level 4**: ARCHJUDGE (50 XP)
- **Level 5**: DIVINE JUDGE (100 XP)
- **Level 6**: CELESTIAL (200 XP)
- **Level 7**: ETERNAL (500 XP)

#### ✦ JUSTICE BRANCH (Understanding Souls & Cases)
1. **TRUE SIGHT (10 XP)**: 1 charge/run. Reveal one additional hidden truth about the current soul.
2. **MORAL CLARITY (25 XP)**: 1 charge/run. Reveal simplified moral analysis of intent vs consequences.
3. **DOUBLE JUDGMENT (50 XP)**: 1 charge/run. Reveal exact defensibility % for both Heaven and Hell.
4. **FINAL WORD (100 XP)**: 1 charge/run. If AI rates your choice as DEBATABLE (40–69%), auto-accept as correct.

#### ✦ AUTHORITY BRANCH (Control Over Time & Decisions)
1. **TIME PAUSE (10 XP)**: 1 charge/run. Freeze countdown timer for 3 seconds.
2. **TIME DILATION (25 XP)**: 1 charge/run. Extend countdown timer from 5s to 8s (+3s).
3. **SECOND CHANCE (50 XP)**: 1 charge/run. After a wrong judgment, choose Heaven or Hell again before losing a life.
4. **ABSOLUTE JUDGMENT (100 XP)**: 1 charge/run. Completely freeze time for 10 seconds with celestial stillness.

#### ✦ DIVINITY BRANCH (Survival & Divine Intervention)
1. **EXTRA LIFE (15 XP)**: Permanent. Start every run with 4 lives (♥ ♥ ♥ ♥) instead of 3.
2. **FORGIVENESS (30 XP)**: 1 charge/run. First wrong judgment of the run is forgiven with 0 life loss.
3. **IMMORTAL SOUL (75 XP)**: 1 charge/run. When you would lose your final life, prevent Game Over and continue with 1 life.
4. **DIVINE INTERVENTION (150 XP)**: 1 charge/run. When timer reaches zero, grant +3 seconds instead of losing a life.

---

## 🕹️ Controls

| Action | Touch / Mouse | Keyboard |
| :--- | :--- | :--- |
| **Send to Heaven** | Tap **HEAVEN** button | `[A]` or `[Left Arrow]` |
| **Send to Hell** | Tap **HELL** button | `[D]` or `[Right Arrow]` |
| **Skip Verdict Wait** | Tap modal | `[Space]` or Click |
| **Toggle Sound** | Tap **🔊** / **🔇** | Top-right button |

---

## 🚀 Running the Game

```bash
# from the repo root
npm start            # or: python3 -m http.server 8090
```

Open:
```
http://localhost:8090/
```
