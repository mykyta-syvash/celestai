/**
 * CELESTAI chain / recurring-character cards. OWNER: consequences agent.
 * Push cards (same schema as deck.js) that use `requires` / `setFlags` to form story chains.
 *
 * Recurring characters (speaker):
 *   archangel - Gabriel, your stern advisor (soldier model)
 *   lucifer   - the Prosecutor, who offers bargains (businessman model)
 *   scribe    - Clerk Ossian, keeper of the ledgers, warns about order (scientist model)
 * For speaker cards, LEFT/Heaven = side with Heaven's way, RIGHT/Hell = side with the darker option.
 *
 * Chains:
 *   1. The Poisoned Cup       (poisoner -> widow / daughter -> Lucifer collects)
 *   2. Malphas the Penitent   (pardoned demon returns with a bargain; Gabriel reacts)
 *   3. Lucifer's Ledger       (a pact made early comes due later)
 *   4. The Fast-Track Decree  (scribe's shortcut lets a smuggler slip in / backlog riot)
 *   5. Gabriel's Fallen Brother
 *   6. The Crown of Varenne   (LEGACY: spans reigns via setLegacy / requires.legacy)
 */
window.CELESTAI_CARDS = window.CELESTAI_CARDS || [];

(function () {
  function side(effects, feedback, quote, extra) {
    return Object.assign(
      { effects, setFlags: [], clearFlags: [], setLegacy: [], feedback, quote },
      extra || {}
    );
  }

  window.CELESTAI_CARDS.push(
    // ================= CHAIN 1: THE POISONED CUP =================
    {
      id: "ch_poison_1_cook",
      tier: 1,
      archetype: "chef",
      name: "Marta Illes",
      age: 51,
      title: "Manor Cook",
      dilemma: "Poisoned the lord who beat his servants for decades. The beatings stopped. So did his heart.",
      virtue: "Sheltered three runaway kitchen girls from the lord's fists.",
      sin: "Laced her master's wine with hemlock and served it smiling.",
      heaven: side({ mercy: 9, justice: -10, faith: 4 }, "You weighed the lives she protected above the one she ended.", "I only did what no one else dared.", { setFlags: ["poisoner_pardoned"] }),
      hell: side({ justice: 10, mercy: -7, order: 4 }, "Murder is murder, even of a cruel man.", "Then who would have saved those girls?", { setFlags: ["poisoner_damned"] }),
      hiddenFact: "The lord had already signed papers to sell two of the girls.",
      moralAnalysis: { intent: "PROTECT THE HELPLESS", consequences: "ONE DEATH, MANY SPARED" }
    },
    {
      id: "ch_poison_2_widow",
      tier: 2,
      archetype: "farmer",
      name: "Lady Hedda Vorn",
      age: 63,
      title: "The Lord's Widow",
      dilemma: "The poisoned lord's widow learns his killer rests in Heaven. She demands the verdict be undone, or she renounces faith.",
      virtue: "Endowed an orphanage after her husband's death.",
      sin: "Knew of the beatings for years and said nothing.",
      requires: { flags: ["poisoner_pardoned"] },
      heaven: side({ faith: 8, order: -6, justice: -4 }, "You welcomed the widow too, and let both verdicts stand.", "Heaven keeps strange company.", { setFlags: ["widow_embraced"] }),
      hell: side({ justice: 8, faith: -9, mercy: -4 }, "Her silence damned her. Mortals whisper that Heaven punishes grief.", "I buried a husband and lost a god.", {}),
      hiddenFact: "She hid the cook's family from the magistrate after the death.",
      moralAnalysis: { intent: "GRIEF AND COMPLICITY", consequences: "FAITH OF A HOUSEHOLD AT STAKE" }
    },
    {
      id: "ch_poison_3_daughter",
      tier: 2,
      archetype: "artist",
      name: "Ilka Illes",
      age: 24,
      title: "The Cook's Daughter",
      dilemma: "The damned poisoner's daughter painted her mother's story across the capital. Now she stands before you, asking to share her mother's fate.",
      virtue: "Her murals shamed a dozen abusive lords into reform.",
      sin: "Defaced the temple with a mural cursing your court.",
      requires: { flags: ["poisoner_damned"] },
      heaven: side({ mercy: 8, faith: -6, order: -5 }, "You forgave the insult to your court. Some saints call it weakness.", "Then tell my mother she was right.", {}),
      hell: side({ order: 7, justice: 6, mercy: -9 }, "Mother and daughter reunited, in fire. The capital's walls fall silent.", "Paint me something in Hell, then.", { setFlags: ["illes_family_damned"] }),
      hiddenFact: "The reforms she inspired saved at least forty servants.",
      moralAnalysis: { intent: "EXPOSE CRUELTY", consequences: "REFORM THROUGH DESECRATION" }
    },
    {
      id: "ch_poison_4_lucifer",
      tier: 3,
      speaker: "lucifer",
      archetype: "businessman",
      name: "Lucifer",
      age: "Ancient",
      title: "The Prosecutor",
      dilemma: "\"You sent me a whole family of poisoners, Judge. Grant me one more soul of my choosing and Hell will quiet your ledgers.\"",
      virtue: "Refusing keeps the scales in Heaven's hands.",
      sin: "Accepting buys order with a stranger's soul.",
      requires: { flags: ["illes_family_damned"] },
      heaven: side({ faith: 7, order: -8, justice: 4 }, "You refused the Prosecutor. Hell's queues grow restless.", "Pride is such a lovely color on you.", {}),
      hell: side({ order: 12, justice: -7, faith: -5 }, "Lucifer took a soul you never judged. The ledgers balance, grimly.", "Pleasure doing business, Your Honor.", { setFlags: ["lucifer_pact"] }),
      hiddenFact: "The soul Lucifer wanted was a sleeping child's godmother.",
      moralAnalysis: { intent: "BARGAIN WITH DAMNATION", consequences: "ORDER PURCHASED WITH INJUSTICE" }
    },

    // ================= CHAIN 2: MALPHAS THE PENITENT =================
    {
      id: "ch_demon_1_malphas",
      tier: 1,
      archetype: "thief",
      name: "Malphas",
      age: "Fallen",
      title: "Penitent Demon",
      dilemma: "A demon who stole souls for millennia climbs the stairs of Heaven. He returned one soul last week, unasked, and begs to stay.",
      virtue: "Freed a drowned fisherman's soul from Hell's river.",
      sin: "Tempted four thousand mortals into ruin.",
      heaven: side({ mercy: 12, order: -8, justice: -5 }, "A demon walks among saints. Heaven's clerks are aghast.", "I will not forget this door, Judge.", { setFlags: ["demon_pardoned"] }),
      hell: side({ justice: 8, order: 6, mercy: -8 }, "Four thousand souls outweigh one act of penitence.", "One kindness, and still the pit.", { setFlags: ["demon_returned"] }),
      hiddenFact: "He freed the fisherman because the man once fed him, disguised as a beggar.",
      moralAnalysis: { intent: "UNCERTAIN REPENTANCE", consequences: "A PRECEDENT FOR ALL DEMONS" }
    },
    {
      id: "ch_demon_2_bargain",
      tier: 2,
      archetype: "thief",
      name: "Malphas",
      age: "Fallen",
      title: "The Pardoned Demon",
      dilemma: "Malphas returns. He offers Lucifer's secret ledger of stolen souls, if you also pardon his brother, who is far less sorry.",
      virtue: "The ledger could free hundreds of wrongly damned souls.",
      sin: "His brother Ronwe drowned a village for sport.",
      requires: { flags: ["demon_pardoned"] },
      heaven: side({ justice: 10, mercy: 6, order: -9 }, "The ledger freed many. Ronwe now roams Heaven's gardens.", "A bargain kept. Unlike some.", { setFlags: ["ledger_stolen"] }),
      hell: side({ order: 8, faith: 5, mercy: -9 }, "You refused. The ledger burns, and with it hundreds of appeals.", "Then the damned stay damned, Judge.", {}),
      hiddenFact: "Ronwe has already planned to escape Heaven within a year.",
      moralAnalysis: { intent: "RANSOM FOR REDEMPTION", consequences: "MANY FREED, ONE MONSTER PARDONED" }
    },
    {
      id: "ch_demon_3_gabriel",
      tier: 2,
      speaker: "archangel",
      archetype: "soldier",
      name: "Archangel Gabriel",
      age: "Eternal",
      title: "Your Stern Advisor",
      dilemma: "\"You let demons into Heaven, Judge. I ask leave to post my legions at every gate and search every soul you send.\"",
      virtue: "Legions at the gates would stop further infiltration.",
      sin: "Mortals will see Heaven as a fortress, not a home.",
      requires: { flags: ["demon_pardoned"], minSouls: 4 },
      heaven: side({ order: 10, justice: 5, mercy: -8 }, "Gabriel's legions stand guard. Heaven is safer, and colder.", "Order is its own kind of mercy.", { setFlags: ["gabriel_legions"] }),
      hell: side({ mercy: 7, faith: 6, order: -10 }, "You refused Gabriel. He bows stiffly and does not forget.", "I will remember this refusal, Judge.", { setFlags: ["gabriel_rebuffed"] }),
      hiddenFact: "Gabriel already caught Ronwe once and let him go at Malphas's plea.",
      moralAnalysis: { intent: "SECURITY OVER WELCOME", consequences: "A GUARDED PARADISE" }
    },

    // ================= CHAIN 3: LUCIFER'S LEDGER =================
    {
      id: "ch_pact_1_offer",
      tier: 1,
      speaker: "lucifer",
      archetype: "businessman",
      name: "Lucifer",
      age: "Ancient",
      title: "The Prosecutor",
      dilemma: "\"Hell is overflowing, Judge, and so are your queues. Let my clerks pre-sort the obvious sinners. Only the obvious ones.\"",
      virtue: "Refusing keeps every soul under your own eye.",
      sin: "Accepting would clear the backlog overnight.",
      requires: { notFlags: ["lucifer_pact"], minSouls: 2 },
      heaven: side({ justice: 6, faith: 5, order: -9 }, "You keep every judgment for yourself. The queue groans.", "Suit yourself. The line only grows.", {}),
      hell: side({ order: 12, justice: -8, faith: -4 }, "Hell's clerks sort the damned now. Swift, and not quite fair.", "You won't regret this. Much.", { setFlags: ["lucifer_pact", "lucifer_sorting"] }),
      hiddenFact: "Lucifer's clerks are paid per soul delivered to Hell.",
      moralAnalysis: { intent: "EFFICIENCY THROUGH CORRUPTION", consequences: "FASTER, CROOKED JUDGMENT" }
    },
    {
      id: "ch_pact_2_misfiled",
      tier: 2,
      archetype: "doctor",
      name: "Dr. Anselm Roe",
      age: 58,
      title: "Village Physician",
      dilemma: "Lucifer's clerks sorted this doctor as 'obvious sinner'. His crime: a mercy dose of morphine for a dying child. He appeals.",
      virtue: "Treated an entire valley through two plagues for free.",
      sin: "Ended a suffering child's life without the parents' consent.",
      requires: { flags: ["lucifer_sorting"] },
      heaven: side({ mercy: 8, justice: 6, order: -8 }, "You overruled Hell's clerks. Lucifer files a formal complaint.", "I only wanted her pain to stop.", { setFlags: ["pact_challenged"] }),
      hell: side({ order: 8, faith: -9, mercy: -5 }, "You upheld the sorting. Mortal doctors pray less to you now.", "So the bargain is worth more than me.", {}),
      hiddenFact: "The parents later said they would have agreed.",
      moralAnalysis: { intent: "END SUFFERING", consequences: "A LIFE SHORTENED, PAIN ENDED" }
    },
    {
      id: "ch_pact_3_due",
      tier: 3,
      speaker: "lucifer",
      archetype: "businessman",
      name: "Lucifer",
      age: "Ancient",
      title: "The Prosecutor",
      dilemma: "\"Our pact has a price, Judge. Hand me your next saint, unexamined, or I publish our arrangement to every mortal temple.\"",
      virtue: "Defying him keeps Heaven honest, whatever the scandal.",
      sin: "Paying keeps the secret and the peace.",
      requires: { flags: ["lucifer_pact"], minSouls: 6 },
      heaven: side({ justice: 9, faith: -10, order: -4 }, "The pact is exposed. Mortals doubt you, but Heaven stays clean.", "Honesty. How expensive for you.", { clearFlags: ["lucifer_pact", "lucifer_sorting"] }),
      hell: side({ order: 7, faith: 5, justice: -12 }, "A saint burns so your secret keeps. Justice weeps quietly.", "Always a pleasure, partner.", { setFlags: ["saint_sold"] }),
      hiddenFact: "The saint in question once converted a legion of demons.",
      moralAnalysis: { intent: "BLACKMAIL", consequences: "SCANDAL OR SACRIFICE" }
    },

    // ================= CHAIN 4: THE FAST-TRACK DECREE =================
    {
      id: "ch_order_1_scribe",
      tier: 1,
      speaker: "scribe",
      archetype: "scientist",
      name: "Clerk Ossian",
      age: 900,
      title: "Celestial Scribe",
      dilemma: "\"Your Honor, forty thousand souls wait at the gate. Permit a fast-track: anyone with a clean baptism record enters unexamined?\"",
      virtue: "Fast-tracking relieves suffering in the endless queue.",
      sin: "Paperwork cannot see a heart. Frauds will slip through.",
      requires: { minSouls: 1 },
      heaven: side({ order: 10, mercy: 6, justice: -9 }, "The gates open wide. The queue melts; so does scrutiny.", "Stamped, sealed, and swiftly done!", { setFlags: ["fast_track"] }),
      hell: side({ justice: 7, order: -8, faith: 4 }, "Every soul will be examined. Ossian sighs at the mountain of scrolls.", "Then I shall need more ink.", { setFlags: ["full_audit"] }),
      hiddenFact: "Baptism records in three provinces were forged by a single smuggler ring.",
      moralAnalysis: { intent: "BUREAUCRATIC RELIEF", consequences: "SPEED VERSUS SCRUTINY" }
    },
    {
      id: "ch_order_2_smuggler",
      tier: 2,
      archetype: "thief",
      name: "Pim Varga",
      age: 47,
      title: "Forger of Souls",
      dilemma: "Caught in Heaven's gardens: a forger who sold fake baptism papers and used one himself to stroll through your fast-track.",
      virtue: "Sold papers cheaply to persecuted families fleeing a purge.",
      sin: "Also sold them to a warlord and his executioners.",
      requires: { flags: ["fast_track"] },
      heaven: side({ mercy: 7, faith: 5, order: -10 }, "He stays. Word spreads that Heaven's gate can be bought.", "Everyone deserves a way in, no?", {}),
      hell: side({ justice: 9, order: 7, mercy: -6 }, "You cast him out and revoked the fast-track.", "Close the door and you shut out the innocent too.", { clearFlags: ["fast_track"], setFlags: ["fast_track_revoked"] }),
      hiddenFact: "Two hundred refugee families reached Heaven on his papers.",
      moralAnalysis: { intent: "PROFIT AND RESCUE", consequences: "REFUGEES SAVED, KILLERS ADMITTED" }
    },
    {
      id: "ch_order_3_riot",
      tier: 2,
      speaker: "scribe",
      archetype: "scientist",
      name: "Clerk Ossian",
      age: 900,
      title: "Celestial Scribe",
      dilemma: "\"The audit has stalled the gates for a decade, Your Honor. Souls are rioting in the queue. May I call Gabriel's guards?\"",
      virtue: "Patience and dialogue could calm the queue.",
      sin: "Force would restore order within the hour.",
      requires: { flags: ["full_audit"], minSouls: 3 },
      heaven: side({ mercy: 8, faith: 4, order: -9 }, "You walked among the rioters yourself. Calm returns slowly.", "Most irregular, but... it worked?", {}),
      hell: side({ order: 11, justice: 4, mercy: -10 }, "Gabriel's guards broke the riot. The queue moves in silence.", "Order is restored. At a cost.", { setFlags: ["queue_crushed"] }),
      hiddenFact: "The riot began when a mother was separated from her child in the queue.",
      moralAnalysis: { intent: "RESTORE ORDER", consequences: "PEACE OR FORCE" }
    },

    // ================= CHAIN 5: GABRIEL'S FALLEN BROTHER =================
    {
      id: "ch_gabriel_1_samyaza",
      tier: 2,
      archetype: "soldier",
      name: "Samyaza",
      age: "Eternal",
      title: "Fallen Watcher",
      dilemma: "Gabriel's own brother, cast down for teaching mortals forbidden fire. Gabriel demands Hell. Mortals still bless Samyaza's hearths.",
      virtue: "Taught freezing tribes to make fire and survive winter.",
      sin: "Also taught them to forge swords and wage war.",
      requires: { minSouls: 3 },
      heaven: side({ mercy: 9, faith: 6, order: -9 }, "You defied Gabriel. Mortals rejoice; the archangel's jaw tightens.", "My brother will never forgive you.", { setFlags: ["samyaza_pardoned"] }),
      hell: side({ justice: 8, order: 7, faith: -6 }, "Gabriel nods once. The hearth-folk light fewer candles for you.", "Fire was a gift. War was their choice.", { setFlags: ["gabriel_obeyed"] }),
      hiddenFact: "Gabriel was the one who first showed Samyaza the fire.",
      moralAnalysis: { intent: "EMPOWER MORTALS", consequences: "SURVIVAL AND WARFARE" }
    },
    {
      id: "ch_gabriel_2_rebuke",
      tier: 2,
      speaker: "archangel",
      archetype: "soldier",
      name: "Archangel Gabriel",
      age: "Eternal",
      title: "Your Stern Advisor",
      dilemma: "\"You pardoned my brother against my counsel. Strip me of my command, or grant me the right to veto your verdicts.\"",
      virtue: "Keeping Gabriel close keeps Heaven's sword loyal.",
      sin: "A veto would make you a judge in name only.",
      requires: { flags: ["samyaza_pardoned"] },
      heaven: side({ order: 9, justice: 6, mercy: -8 }, "Gabriel gains his veto. Your verdicts now pass through his hands.", "Wisely chosen. We shall judge together.", { setFlags: ["gabriel_veto"] }),
      hell: side({ faith: 7, mercy: 5, order: -11 }, "Gabriel is stripped of command. The legions murmur.", "Then may your mercy defend these walls.", { setFlags: ["gabriel_rebuffed"] }),
      hiddenFact: "Gabriel secretly visits Samyaza every seventh night.",
      moralAnalysis: { intent: "PRIDE AND LOYALTY", consequences: "SHARED OR SOLE AUTHORITY" }
    },
    {
      id: "ch_gabriel_3_obeyed",
      tier: 3,
      speaker: "archangel",
      archetype: "soldier",
      name: "Archangel Gabriel",
      age: "Eternal",
      title: "Your Stern Advisor",
      dilemma: "\"You condemned my brother as I asked. Now I ask you to free him. I was wrong, and I cannot bear it.\"",
      virtue: "Mercy for Samyaza, and healing for Gabriel.",
      sin: "Reversing verdicts makes every judgment negotiable.",
      requires: { flags: ["gabriel_obeyed"] },
      heaven: side({ mercy: 10, faith: 4, justice: -9 }, "Samyaza walks free. Gabriel weeps for the first time in an age.", "Thank you, Judge. I owe you a debt.", {}),
      hell: side({ justice: 9, order: 6, faith: -7 }, "Your verdict stands, even against an archangel's grief.", "Then justice is colder than I knew.", {}),
      hiddenFact: "Lucifer has already offered Samyaza a throne in Hell.",
      moralAnalysis: { intent: "REGRET", consequences: "CONSISTENCY VERSUS COMPASSION" }
    },
    {
      id: "ch_gabriel_4_lucifer",
      tier: 3,
      speaker: "lucifer",
      archetype: "businessman",
      name: "Lucifer",
      age: "Ancient",
      title: "The Prosecutor",
      dilemma: "\"Your pet archangel holds a veto now, Judge. Sign this writ and I'll prove he spared his brother before. Let's see him fall.\"",
      virtue: "Ignoring Lucifer shields Heaven from his schemes.",
      sin: "The writ would expose a real crime by Gabriel.",
      requires: { flags: ["gabriel_veto"] },
      heaven: side({ order: 7, faith: 5, justice: -8 }, "You tore up the writ. Gabriel never learns how close he came.", "Loyalty over truth? How mortal of you.", {}),
      hell: side({ justice: 10, order: -10, mercy: -4 }, "Gabriel is exposed and loses his veto. Heaven trembles.", "Every angel falls eventually, Judge.", { clearFlags: ["gabriel_veto"], setFlags: ["gabriel_disgraced"] }),
      hiddenFact: "Gabriel really did free Samyaza once, long ago.",
      moralAnalysis: { intent: "SOW DIVISION", consequences: "TRUTH THAT WEAKENS HEAVEN" }
    },

    // ================= CHAIN 6 (LEGACY, SPANS REIGNS): THE CROWN OF VARENNE =================
    {
      id: "ch_legacy_1_aldric",
      tier: 1,
      archetype: "king",
      name: "King Aldric of Varenne",
      age: 71,
      title: "The Iron Monarch",
      dilemma: "Ended a century of civil war by executing every rival heir, including children. His kingdom has known forty years of peace since.",
      virtue: "Forty years of peace, famine ended, roads built.",
      sin: "Ordered the deaths of eleven noble children.",
      requires: { notLegacy: ["aldric_heaven", "aldric_hell"] },
      heaven: side({ order: 10, faith: 5, justice: -10 }, "Peace was bought with innocent blood. His heirs will remember your blessing.", "Peace is always paid for, Judge.", { setLegacy: ["aldric_heaven"] }),
      hell: side({ justice: 11, mercy: 4, order: -8 }, "You damned the peacemaker. Varenne's heirs will remember, across ages.", "Then let my kingdom burn without me.", { setLegacy: ["aldric_hell"] }),
      hiddenFact: "One heir escaped the purge and was raised as a farmer.",
      moralAnalysis: { intent: "PEACE AT ANY PRICE", consequences: "ELEVEN DEATHS, MILLIONS SPARED WAR" }
    },
    {
      id: "ch_legacy_2_edmund",
      tier: 2,
      archetype: "king",
      name: "King Edmund of Varenne",
      age: 48,
      title: "Son of Aldric",
      dilemma: "Aldric's son, emboldened that his father reached Heaven, purged dissenters too, 'as Heaven clearly approves'. A past verdict echoes.",
      virtue: "Kept his father's peace another generation.",
      sin: "Cited your blessing to justify a hundred executions.",
      requires: { legacy: ["aldric_heaven"], notLegacy: ["varenne_blessed", "varenne_broken"] },
      heaven: side({ order: 9, justice: -10, mercy: -4 }, "Your blessing becomes a dynasty's creed. The Varennes rule on.", "Like father, like son, like Heaven.", { setLegacy: ["varenne_blessed"] }),
      hell: side({ justice: 10, faith: -7, order: -5 }, "You broke the chain your earlier verdict forged.", "You welcomed him and damn me?", { setLegacy: ["varenne_broken"] }),
      hiddenFact: "Edmund kept a portrait of Heaven's Judge in his throne room.",
      moralAnalysis: { intent: "INHERITED CERTAINTY", consequences: "A DYNASTY OF PURGES" }
    },
    {
      id: "ch_legacy_3_aldric_hell",
      tier: 2,
      speaker: "lucifer",
      archetype: "businessman",
      name: "Lucifer",
      age: "Ancient",
      title: "The Prosecutor",
      dilemma: "\"Remember old King Aldric, whom a past reign damned? He governs my ninth circle now, efficiently. He offers Heaven a truce.\"",
      virtue: "Refusing keeps Heaven untouched by a tyrant's hand.",
      sin: "A truce would bring order to both realms.",
      requires: { legacy: ["aldric_hell"], notLegacy: ["aldric_truce", "aldric_refused"] },
      heaven: side({ faith: 7, justice: 5, order: -9 }, "No truce with tyrants. Hell's borders stay restless.", "He'll be so disappointed. I'm delighted.", { setLegacy: ["aldric_refused"] }),
      hell: side({ order: 12, justice: -7, faith: -5 }, "A damned king now keeps Heaven's peace. Deeply unsettling.", "Two realms, one tidy ledger.", { setLegacy: ["aldric_truce"] }),
      hiddenFact: "Aldric asks, in the treaty's margin, whether his grandchildren are well.",
      moralAnalysis: { intent: "PRAGMATIC ALLIANCE", consequences: "ORDER THROUGH THE DAMNED" }
    },
    {
      id: "ch_legacy_4_last_heir",
      tier: 3,
      archetype: "farmer",
      name: "Wenna of the Hills",
      age: 66,
      title: "Last Heir of Varenne",
      dilemma: "The child who escaped Aldric's purge, now old. She could have reclaimed the crown and ended the purges. She chose her turnips instead.",
      virtue: "Raised twelve orphans of the Varenne purges in secret.",
      sin: "Stayed silent while two generations of purges continued.",
      requires: { legacy: ["varenne_blessed"], notLegacy: ["varenne_ended"] },
      heaven: side({ mercy: 10, faith: 5, justice: -6 }, "The Varenne story ends in a quiet garden. The dynasty's legacy closes.", "I only wanted a quiet life.", { setLegacy: ["varenne_ended"] }),
      hell: side({ justice: 8, order: 6, mercy: -9 }, "Silence in the face of slaughter is its own sin. The line ends in fire.", "Would a crown have made me better?", { setLegacy: ["varenne_ended"] }),
      hiddenFact: "Three of her orphans became the judges who finally abolished the purges.",
      moralAnalysis: { intent: "SURVIVAL", consequences: "TWELVE SAVED, THOUSANDS UNPROTECTED" }
    }
  );
})();
