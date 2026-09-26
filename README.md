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

### 1. The Four Meters (Reigns-style)
Every verdict moves the balance of Heaven. Four meters start at **50** and live in **0–100**:

| Meter | Meaning |
|---|---|
| 🕊️ **MERCY** | The compassion of Heaven |
| ⚖️ **JUSTICE** | Whether sin is punished |
| 📜 **ORDER** | The celestial bureaucracy / balance of Heaven–Hell intake |
| 🙏 **FAITH** | Mortals' belief in your verdicts |

Each card's Heaven and Hell sides touch 2–3 meters. **Any meter reaching 0 or 100 ends your reign** — 8 distinct endings (each meter × low/high, e.g. *The Cold Gates*, *The Paper Tomb*, *The False Idol*). Hovering / dragging toward a verdict shows Reigns-style dots over the meters it will move (small dot < 8, big dot ≥ 8; direction hidden).

### 2. Reigns, Score & XP
- Every soul judged = **+1 score** (reign length) and **+1 XP**. No right or wrong answers — only consequences.
- The verdict tablet shows per-meter delta chips (↑/↓ with numbers), the verdict's feedback and the soul's last words.
- Reigns are numbered and persisted ("**Judge #N**", `localStorage.celestai_reign`). Best = longest reign.

### 3. Optional Timed Mode
Default is **untimed**. *Settings → TIMED MODE* (`localStorage.celestai_timed`) gives 8 s per soul; hesitating costs 📜 −10 and 🙏 −6.

### 4. The Archangel Tribunal & Destiny
When the scales break, the Archangel recounts your reign: the death-specific ending, then a 2–3 sentence reflection (AI via `aiSouls.tribunal()` when available, static fallback otherwise). Destiny: **HEAVEN** if you judged ≥ 8 souls and kept the surviving meters near balance (avg. deviation ≤ 22), otherwise **HELL**. The results screen shows the cause of your fall, final meters and your **moral profile**, derived from which meters your verdicts pushed (The Merciful / The Stern / The Punisher / The Lenient / The Lawgiver / The Revolutionary / The Prophet / The Heretic / The Balanced Judge).

### 5. Permanent Judge Skill Tree ("THE JUDGE")
Skill ids and XP costs are unchanged (old saves stay valid). All active skills are 1 charge per reign.

#### ✦ JUSTICE BRANCH (Understanding Souls)
1. **TRUE SIGHT (10 XP)**: Reveal the soul's hidden fact.
2. **MORAL CLARITY (25 XP)**: Intent vs consequences + the *direction* each verdict pushes every meter (preview dots show ↑/↓).
3. **DOUBLE JUDGMENT (50 XP)**: Exact meter deltas of both verdicts (preview dots show numbers).
4. **FINAL WORD (100 XP)**: Arm before a verdict — every change that would push a meter away from balance is cancelled.

#### ✦ AUTHORITY BRANCH (Time & Decisions — each has an untimed alternative)
1. **TIME PAUSE (10 XP)**: Timed: freeze 3 s. Untimed: ease your most extreme meter 10 toward 50.
2. **TIME DILATION (25 XP)**: Timed: +3 s. Untimed: defer the current soul without a verdict.
3. **SECOND CHANCE (50 XP)**: Trigger. A verdict that would end your reign is undone (meters restored) and you judge again.
4. **ABSOLUTE JUDGMENT (100 XP)**: Timed: freeze 10 s. Untimed: all four meters move halfway back to 50.

#### ✦ DIVINITY BRANCH (Survival)
1. **EXTRA LIFE (15 XP)**: Permanent ward — the first time each meter hits its brink in a reign it stops at 6/94.
2. **FORGIVENESS (30 XP)**: Trigger. The first collapse of your reign is forgiven; that meter returns to 50.
3. **IMMORTAL SOUL (75 XP)**: Trigger. A further collapse is survived; all four meters return to 50.
4. **DIVINE INTERVENTION (150 XP)**: Timed: +3 s instead of the hesitation penalty. Untimed: the first meter to enter the danger zone (≤10 / ≥90) is pulled back to 30/70.

Rescue order when a verdict would be fatal: Ward → Second Chance → Forgiveness → Immortal Soul.

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
