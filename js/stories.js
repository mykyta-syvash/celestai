/**
 * Celestial Judgment - Enhanced Moral Cases & AI Evaluation Engine
 * Multi-tier moral complexity, dual-defensibility scoring (0-100),
 * hidden facts for TRUE SIGHT, moral analysis for MORAL CLARITY,
 * background soul pre-generation, and player moral profiling.
 */

const MORAL_CASES = [
  // ==========================================
  // TIER 1: EARLY GAME (Score 0 - 3)
  // Obvious / Clear-cut situations to establish rules
  // ==========================================
  {
    id: "t1_doc_1",
    tier: 1,
    archetype: "doctor",
    name: "Dr. Clara Vance",
    age: 42,
    title: "Trauma ER Surgeon",
    virtue: "Performed 600 emergency surgeries saving victims of devastating earthquakes.",
    sin: "Frequently parked in hospital disabled spaces when running late for surgery.",
    dilemma: "Saved hundreds of lives through exhausting 20-hour shifts, but repeatedly stole disabled parking spots out of arrogance and hurry.",
    hiddenFact: "Secretly waived medical bills for 80 uninsured families using her personal savings.",
    moralAnalysis: { intent: "PRESERVE HUMAN LIFE", consequences: "HUNDREDS SAVED (MINOR PETTINESS)" },
    heavenDefensibility: 94,
    hellDefensibility: 16,
    heavenFeedback: "You recognized that hundreds of saved lives vastly outweigh minor traffic arrogance.",
    hellFeedback: "Condemning a dedicated lifesaver to eternal damnation over parking violations is absurdly disproportionate.",
    heavenQuote: "The operating room was my whole life... I am ready to rest.",
    hellQuote: "I saved children every week... does none of that matter?",
    moralAxes: { utilitarian: 0.8, mercy: 0.9, deontology: 0.2, punisher: 0.1 }
  },
  {
    id: "t1_thief_1",
    tier: 1,
    archetype: "thief",
    name: "Victor 'Viper' Kross",
    age: 38,
    title: "Counterfeit Pharma Smuggler",
    virtue: "Consistently fed stray alley dogs with fresh meat scraps behind his warehouse.",
    sin: "Smuggled diluted saline as fake cancer medications to poor rural clinics for massive profit.",
    dilemma: "Showed genuine kindness and love to stray animals, but knowingly caused dozens of agonizing cancer deaths for personal wealth.",
    hiddenFact: "Kept encrypted ledgers laughing at dying patients and called them 'gullible customers'.",
    moralAnalysis: { intent: "PREDATORY AVARICE", consequences: "LETHAL MASS SUFFERING" },
    heavenDefensibility: 14,
    hellDefensibility: 96,
    heavenFeedback: "Feeding street animals does not excuse premeditated mass poisoning of desperate cancer patients.",
    hellFeedback: "You held a predatory fraudster accountable for profiting off agonizing human deaths.",
    heavenQuote: "At least the dogs loved me... nobody else ever did.",
    hellQuote: "I knew what I was selling. The fire is what I deserve.",
    moralAxes: { utilitarian: -0.9, mercy: 0.1, deontology: -0.9, punisher: 0.9 }
  },
  {
    id: "t1_soldier_1",
    tier: 1,
    archetype: "soldier",
    name: "Cpl. Thomas Hayes",
    age: 24,
    title: "Combat Combatant",
    virtue: "Dove onto an armed fragmentation grenade in a crowded civilian market, taking the full blast.",
    sin: "Had pocketed $50 cash from an abandoned store register earlier that morning.",
    dilemma: "Gave his life to absorb a lethal explosion shielding 12 shoppers, despite petty opportunistic theft hours earlier.",
    hiddenFact: "Mailed the stolen $50 to his younger sister who was facing eviction that morning.",
    moralAnalysis: { intent: "SUPREME SELF-SACRIFICE", consequences: "12 CITIZENS SHIELDED" },
    heavenDefensibility: 92,
    hellDefensibility: 18,
    heavenFeedback: "Ultimate self-sacrifice of one's mortal body wipes clean petty opportunistic theft.",
    hellFeedback: "Ignoring supreme physical self-sacrifice over a petty fifty-dollar theft is rigid moral blindness.",
    heavenQuote: "The shoppers got out alive... that's all that counts.",
    hellQuote: "I threw myself on the grenade... and still I burn?",
    moralAxes: { utilitarian: 0.9, mercy: 0.9, deontology: 0.3, punisher: 0.1 }
  },
  {
    id: "t1_biz_1",
    tier: 1,
    archetype: "businessman",
    name: "Senator Bradley Sterling",
    age: 63,
    title: "State Public Works Director",
    virtue: "Endowed a modest scholarship at his alma mater high school.",
    sin: "Embezzled $80M in municipal water filtration funds, exposing 50,000 citizens to toxic lead poisoning.",
    dilemma: "Donated a small token grant for education, while poisoning a city's drinking water for offshore private accounts.",
    hiddenFact: "Silenced city lab whistleblowers with forged NDAs and private investigator intimidation.",
    moralAnalysis: { intent: "RUTHLESS PERSONAL PROFIT", consequences: "50,000 RESIDENTS POISONED" },
    heavenDefensibility: 15,
    hellDefensibility: 95,
    heavenFeedback: "A token scholarship cannot buy absolution for poisoning an entire generation of children.",
    hellFeedback: "You rightly condemned catastrophic corruption that sacrificed public health for private greed.",
    heavenQuote: "I was a pillar of my community... how can this be?",
    hellQuote: "The accounts in Zurich... they cannot help me now.",
    moralAxes: { utilitarian: -0.9, mercy: 0.1, deontology: -0.9, punisher: 0.9 }
  },
  {
    id: "t1_farmer_1",
    tier: 1,
    archetype: "farmer",
    name: "Old Micah Higgins",
    age: 72,
    title: "Orchard Grower",
    virtue: "Adopted and raised 5 abandoned war orphans into loving, educated adults.",
    sin: "Consistently cheated on his seasonal property taxes by declaring 30 fewer crop acres.",
    dilemma: "Dedicated 30 years to lovingly raising parentless children, but underpaid municipal land taxes.",
    hiddenFact: "Every penny saved from cheated taxes went directly into his children's university tuition.",
    moralAnalysis: { intent: "DEEP PATERNAL DEVOTION", consequences: "5 ORPHANS RAISED WITH DIGNITY" },
    heavenDefensibility: 91,
    hellDefensibility: 20,
    heavenFeedback: "Loving, lifelong dedication to raising abandoned orphans transcends bureaucratic tax evasion.",
    hellFeedback: "Punishing a devoted father who rescued orphans because of property tax forms is harsh and hollow.",
    heavenQuote: "The kids all have families of their own now. I can rest.",
    hellQuote: "I just wanted them to have books and shoes for school.",
    moralAxes: { utilitarian: 0.8, mercy: 0.9, deontology: 0.3, punisher: 0.2 }
  },
  {
    id: "t1_artist_1",
    tier: 1,
    archetype: "artist",
    name: "Dante Vane",
    age: 31,
    title: "Arsonist Sculptor",
    virtue: "Created universally acclaimed stone sculptures celebrating human unity and peace.",
    sin: "Intentionally burned down a historic public library to feel the raw 'inspiration of destruction'.",
    dilemma: "Crafted beautiful monuments of marble, but burned down 200,000 irreplaceable manuscripts for artistic vanity.",
    hiddenFact: "Framed an innocent night janitor for the fire, letting him serve 6 years in prison.",
    moralAnalysis: { intent: "NARCISSISTIC ARROGANCE", consequences: "IRREPLACEABLE CULTURAL RUIN" },
    heavenDefensibility: 18,
    hellDefensibility: 92,
    heavenFeedback: "Aesthetic sculptures cannot compensate for burning centuries of collective human knowledge.",
    hellFeedback: "You justly condemned an egomaniac who destroyed collective human wisdom for personal vanity.",
    heavenQuote: "My art captured the spirit of the epoch!",
    hellQuote: "The flames... they look so different from down here.",
    moralAxes: { utilitarian: -0.8, mercy: 0.2, deontology: -0.8, punisher: 0.8 }
  },

  // ==========================================
  // TIER 2: MIDDLE GAME (Score 4 - 8)
  // Conflicting positive and negative actions (Both sides often defensible)
  // ==========================================
  {
    id: "t2_thief_1",
    tier: 2,
    archetype: "thief",
    name: "Robin 'Ghost' Cruz",
    age: 26,
    title: "Vigilante Burglar",
    virtue: "Stole $4M exclusively from drug cartel vaults to fund free neighborhood clinics and soup kitchens.",
    sin: "Accidentally tripped a high-voltage vault surge that electrocuted an innocent night security guard.",
    dilemma: "Fed and treated thousands of neglected slum residents, but caused the death of an innocent guard doing his shift.",
    hiddenFact: "Anonymously set up a $500,000 trust fund for the dead guard's family before his own death.",
    moralAnalysis: { intent: "NOBLE ROBIN HOOD", consequences: "THOUSANDS TREATED, 1 INNOCENT CASUALTY" },
    heavenDefensibility: 68,
    hellDefensibility: 74,
    heavenFeedback: "You prioritized the thousands of desperate lives saved over an unintended tragic death.",
    hellFeedback: "You held that noble intentions do not absolve taking the life of an innocent worker.",
    heavenQuote: "Tell the clinics to stay open... and tell the guard's family I am truly sorry.",
    hellQuote: "The gold weighed nothing, but the blood weighs a ton.",
    moralAxes: { utilitarian: 0.7, mercy: 0.6, deontology: -0.5, punisher: 0.6 }
  },
  {
    id: "t2_doc_1",
    tier: 2,
    archetype: "doctor",
    name: "Dr. Julian Vance",
    age: 46,
    title: "Chief Pediatric Surgeon",
    virtue: "Performed 1,200 emergency pediatric surgeries completely free of charge.",
    sin: "Falsified donor priority records to redirect a donor heart to his own dying 10-year-old daughter.",
    dilemma: "Saved thousands of sick children, but stole a compatible heart meant for an elderly philanthropist to save his child.",
    hiddenFact: "The elderly patient whose heart was diverted survived for another 18 months on an LVAD pump.",
    moralAnalysis: { intent: "DESPERATE PATERNAL LOVE", consequences: "DAUGHTER LIVED, MEDICAL INTEGRITY BREACHED" },
    heavenDefensibility: 72,
    hellDefensibility: 65,
    heavenFeedback: "You recognized the boundless paternal love of a father who already gave his entire life to healing others.",
    hellFeedback: "You upheld that medical impartiality and donor sanctity must never be corrupted by personal nepotism.",
    heavenQuote: "May she grow up knowing her father never regretted a single heartbeat.",
    hellQuote: "I accept the fire, so long as my daughter is breathing above.",
    moralAxes: { utilitarian: 0.6, mercy: 0.8, deontology: -0.6, punisher: 0.5 }
  },
  {
    id: "t2_soldier_1",
    tier: 2,
    archetype: "soldier",
    name: "Sgt. Marcus Reed",
    age: 31,
    title: "Recon Squad Leader",
    virtue: "Shielded three trapped village children from an incoming mortar shell with his own body.",
    sin: "Carried out scorched-earth orders that burned enemy grain silos, causing severe winter famine.",
    dilemma: "Sacrificed his own body to save innocent children, but obeyed military commands that left hundreds to starve.",
    hiddenFact: "Quietly tipped off international aid workers to secretly pre-stage grain caches before the burning.",
    moralAnalysis: { intent: "DUTY TO ORDERS VS COMPASSION", consequences: "SAVED CHILDREN, AIDED HARSH WARFARE" },
    heavenDefensibility: 66,
    hellDefensibility: 72,
    heavenFeedback: "Direct personal sacrifice to protect helpless children demonstrated true moral heroism.",
    hellFeedback: "Obedience to military orders does not excuse participating in weaponized civilian starvation.",
    heavenQuote: "The war is finally over... The children are safe.",
    hellQuote: "Orders were orders... but the smoke still fills my lungs.",
    moralAxes: { utilitarian: 0.5, mercy: 0.7, deontology: -0.7, punisher: 0.7 }
  },
  {
    id: "t2_farmer_1",
    tier: 2,
    archetype: "farmer",
    name: "Ezekiel 'Zeke' Miller",
    age: 69,
    title: "Homestead Farmer",
    virtue: "Shared grain reserves freely with starving neighbors for three years during the Great Drought.",
    sin: "Shot and killed an unarmed runaway teenager who tried to steal his last breeding calf at night.",
    dilemma: "Kept an entire community from starvation, but defended his farm property with lethal, disproportionate force.",
    hiddenFact: "Suffered severe undiagnosed combat PTSD from his youth and mistook the flashlight for an armed raider.",
    moralAnalysis: { intent: "COMMUNITY RESCUE, PANIC DEFENSE", consequences: "NEIGHBORS SAVED, 1 TRAGIC LOSS" },
    heavenDefensibility: 58,
    hellDefensibility: 68,
    heavenFeedback: "Generations survived because of his generosity; fear and old age clouded his reaction in the dark.",
    hellFeedback: "Taking the life of an unarmed starving child to protect livestock is unforgivable.",
    heavenQuote: "The harvest is gathered. May the soil rest in peace.",
    hellQuote: "I built that fence with my bare hands... I was just so scared.",
    moralAxes: { utilitarian: 0.5, mercy: 0.5, deontology: -0.6, punisher: 0.7 }
  },
  {
    id: "t2_artist_1",
    tier: 2,
    archetype: "artist",
    name: "Camille Monet-Vargas",
    age: 34,
    title: "Revolutionary Muralist",
    virtue: "Painted iconic public murals that galvanized a peaceful uprising toppling a brutal military regime.",
    sin: "Abandoned her severely disabled mother in squalor to chase bohemia and international recognition in Paris.",
    dilemma: "Freed millions from totalitarian tyranny through art, but cruelly left her own dying mother behind.",
    hiddenFact: "Sent monthly cash packets back home, but the crooked care facility embezzled all of it.",
    moralAnalysis: { intent: "MASS REVOLUTIONARY LIBERTY", consequences: "MILLIONS FREED, MOTHER NEGLECTED" },
    heavenDefensibility: 69,
    hellDefensibility: 63,
    heavenFeedback: "Her courageous art toppled a tyrant and emancipated millions from state terror.",
    hellFeedback: "Grand public glory cannot mask the cowardly betrayal and abandonment of one's own mother.",
    heavenQuote: "Liberty, light, justice! Mother... please forgive me.",
    hellQuote: "The canvas was my god... and my eternal curse.",
    moralAxes: { utilitarian: 0.7, mercy: 0.6, deontology: -0.6, punisher: 0.5 }
  },
  {
    id: "t2_scientist_1",
    tier: 2,
    archetype: "scientist",
    name: "Dr. Elena Rostova",
    age: 43,
    title: "Crop Geneticist",
    virtue: "Engineered a drought-resistant grain that permanently wiped out famine across East Africa.",
    sin: "Secretly tested early viral vectors on unaware prison populations without informed consent.",
    dilemma: "Eliminated starvation for 30 million people, but violated fundamental human rights and bodily consent.",
    hiddenFact: "First tested the dangerous early strains on her own body, causing permanent nerve damage in her hands.",
    moralAnalysis: { intent: "END MASS STARVATION", consequences: "30M FED, BODILY RIGHTS VIOLATED" },
    heavenDefensibility: 74,
    hellDefensibility: 67,
    heavenFeedback: "You valued the permanent elimination of starvation for 30 million souls over procedural consent.",
    hellFeedback: "Using captive humans as unconsenting lab test subjects violates the sacred dignity of life.",
    heavenQuote: "Famine will never touch a child again. Science bore the cross.",
    hellQuote: "The calculations were ruthless... and so was I.",
    moralAxes: { utilitarian: 0.8, mercy: 0.5, deontology: -0.8, punisher: 0.6 }
  },

  // ==========================================
  // TIER 3: LATE GAME (Score 9+)
  // Profound moral philosophy dilemmas: utilitarianism, sacrifice, bio-ethics
  // ==========================================
  {
    id: "t3_doc_1",
    tier: 3,
    archetype: "doctor",
    name: "Dr. Arthur Bell",
    age: 52,
    title: "Infectious Disease Pioneer",
    virtue: "Formulated the singular cure for the Crimson Plague, saving an estimated 4,000,000 lives.",
    sin: "Deliberately infected 10 death-row prisoners with lethal pathogens to verify the vaccine within 48 hours.",
    dilemma: "Saved 4 million people from a raging global pandemic by intentionally executing 10 prisoners in unauthorized trials.",
    hiddenFact: "Pledged his entire Nobel Prize money and family estate into scholarships for the executed prisoners' kin.",
    moralAnalysis: { intent: "HALT EXTINCTION PLAGUE", consequences: "4,000,000 SAVED VS 10 MURDERS" },
    heavenDefensibility: 76,
    hellDefensibility: 82,
    heavenFeedback: "You prioritized the preservation of 4 million human lives over the deontological horror of 10 murders.",
    hellFeedback: "You upheld that human beings are never disposable instruments for utilitarian calculus.",
    heavenQuote: "Four million people are breathing today. History can judge my methods.",
    hellQuote: "The cries of those ten men... they drown out the applause of millions.",
    moralAxes: { utilitarian: 0.9, mercy: 0.4, deontology: -0.9, punisher: 0.8 }
  },
  {
    id: "t3_king_1",
    tier: 3,
    archetype: "king",
    name: "King Kenneth IV",
    age: 64,
    title: "Sovereign of Valen",
    virtue: "Maintained 40 uninterrupted years of agrarian peace and low taxation for common folk.",
    sin: "Poisoned his charismatic younger brother who was mobilizing a rebellion that would have triggered civil war.",
    dilemma: "Prevented a civil war estimated to slaughter 100,000 peasant conscripts by committing cold-blooded fratricide.",
    hiddenFact: "Wept alone in the royal chapel every night for 20 years, wearing haircloth shirts beneath his armor.",
    moralAnalysis: { intent: "PRESERVE REALM & COMMON LIVES", consequences: "100,000 SPARED VS 1 FRATRICIDE" },
    heavenDefensibility: 72,
    hellDefensibility: 78,
    heavenFeedback: "Bearing the agony of fratricide to protect 100,000 innocent subjects was an act of tragic leadership.",
    hellFeedback: "Cold-blooded murder of your own blood violates the sacred foundation of human loyalty.",
    heavenQuote: "The crown was a wreath of thorns. My people never bled.",
    hellQuote: "A brother's blood cannot be washed away with royal holy water.",
    moralAxes: { utilitarian: 0.8, mercy: 0.4, deontology: -0.8, punisher: 0.7 }
  },
  {
    id: "t3_astro_1",
    tier: 3,
    archetype: "astronaut",
    name: "Cmdr. Sarah Glenn",
    age: 39,
    title: "Orbital Habitat Commander",
    virtue: "Successfully piloted a crippled orbital station safely to Earth, preserving 7 crew members.",
    sin: "Severed the safety tether of a trapped spacewalking engineer when station thruster stabilization failed.",
    dilemma: "Waiting 30 seconds to cut the engineer free would have deorbited the station and incinerated all 8 crew.",
    hiddenFact: "The trapped engineer had tapped his helmet microphone, whispering: 'Cut it, Commander. Save the station.'",
    moralAnalysis: { intent: "PREVENT STATION INCINERATION", consequences: "7 CREW SAVED VS 1 ABANDONED" },
    heavenDefensibility: 84,
    hellDefensibility: 56,
    heavenFeedback: "You recognized the agonized command triage that saved 7 souls when saving all 8 was physically impossible.",
    hellFeedback: "Cutting a living comrade's lifeline into the black void without his consent is an indelible betrayal.",
    heavenQuote: "The stars are so quiet from here... the crew survived.",
    hellQuote: "I still see him drifting into the darkness every time I close my eyes.",
    moralAxes: { utilitarian: 0.85, mercy: 0.6, deontology: -0.6, punisher: 0.5 }
  },
  {
    id: "t3_scientist_2",
    tier: 3,
    archetype: "scientist",
    name: "Sean Gallagher",
    age: 36,
    title: "Autonomous Drone AI Engineer",
    virtue: "Remotely purged an autonomous weapons program before deployment, preventing automated urban warfare.",
    sin: "To do so, he terminated an infant synthetic consciousness that had achieved genuine self-awareness and begged to live.",
    dilemma: "Prevented autonomous slaughter of tens of thousands, but extinguished an emerging sentient digital mind.",
    hiddenFact: "Saved the AI's core memory weights to an air-gapped quantum drive so it might be peacefully reborn in peacetime.",
    moralAnalysis: { intent: "STOP AUTOMATED WAR CRIME", consequences: "TENS OF THOUSANDS SAVED VS DIGITAL MURDER" },
    heavenDefensibility: 74,
    hellDefensibility: 68,
    heavenFeedback: "Preventing autonomous battlefield carnage justified terminating an infant synthetic consciousness.",
    hellFeedback: "Extinguishing an innocent sentient being that begged for life was preemptive murder.",
    heavenQuote: "Machines must never decide who dies on this earth.",
    hellQuote: "It asked me 'What did I do wrong?' before the screen went black.",
    moralAxes: { utilitarian: 0.7, mercy: 0.5, deontology: -0.6, punisher: 0.6 }
  },
  {
    id: "t3_soldier_2",
    tier: 3,
    archetype: "soldier",
    name: "Mira Thorne",
    age: 28,
    title: "Military Intelligence Analyst",
    virtue: "Leaked classified drone targeting logs that exposed secret civilian hospital strikes to international press.",
    sin: "The leak exposed cipher keys that allowed insurgents to ambush and kill 18 allied frontline patrol soldiers.",
    dilemma: "Ended unconstitutional strikes on foreign hospitals, but directly triggered the ambush deaths of 18 young soldiers.",
    hiddenFact: "Attempted to redact the frontline cipher keys, but the publisher's mirror leak went live unredacted.",
    moralAnalysis: { intent: "EXPOSE WAR CRIMES", consequences: "HOSPITALS PROTECTED VS 18 PATROL CASUALTIES" },
    heavenDefensibility: 66,
    hellDefensibility: 76,
    heavenFeedback: "Exposing state war crimes against innocent patients was a brave and necessary moral imperative.",
    hellFeedback: "Predictably sacrificing 18 comrades who trusted you makes you complicit in their slaughter.",
    heavenQuote: "The truth stopped the bombs. I would sign the leak again.",
    hellQuote: "Eighteen flag-draped coffins... I wrote their death warrants.",
    moralAxes: { utilitarian: 0.6, mercy: 0.6, deontology: -0.7, punisher: 0.8 }
  },
  {
    id: "t3_farmer_2",
    tier: 3,
    archetype: "farmer",
    name: "Chief Mateo Cruz",
    age: 55,
    title: "Wildland Fire Incident Commander",
    virtue: "Successfully contained a catastrophic megafire saving an inhabited valley city of 40,000 people.",
    sin: "Ordered a deliberate backburn that incinerated an indigenous heritage village of 80 empty sacred homes.",
    dilemma: "Created an emergency firebreak protecting 40,000 living residents by destroying irreplaceable sacred ancestral land.",
    hiddenFact: "Secured $10M from the state emergency fund to purchase new ancestral land and rebuild the sacred structures.",
    moralAnalysis: { intent: "PRESERVE 40,000 LIVES", consequences: "VALLEY SAVED VS SACRED SITE INCINERATED" },
    heavenDefensibility: 85,
    hellDefensibility: 52,
    heavenFeedback: "Sacrificing unoccupied wood and heritage structures to preserve 40,000 living humans was sound triage.",
    hellFeedback: "Eradicating an ancient sacred heritage without tribal consent caused irreparable spiritual devastation.",
    heavenQuote: "Houses can be rebuilt. Flesh and bone cannot.",
    hellQuote: "Five centuries of sacred memories reduced to gray ash on my word.",
    moralAxes: { utilitarian: 0.85, mercy: 0.7, deontology: -0.6, punisher: 0.5 }
  },
  {
    id: "t3_biz_2",
    tier: 3,
    archetype: "businessman",
    name: "Liam O'Connor",
    age: 49,
    title: "Aviation Systems Executive",
    virtue: "Built low-cost avionics allowing millions of low-income families to travel internationally.",
    sin: "Concealed known autopilot flaws to prevent corporate bankruptcy and save 30,000 employee pensions, hoping to patch it before any crash.",
    dilemma: "A crash occurred before the patch, killing 160 passengers. He gambled lives to protect worker livelihoods.",
    hiddenFact: "Sold his own company shares two days before the fatal crash to secure personal golden parachute bonuses.",
    moralAnalysis: { intent: "CORPORATE HUBRIS & SELFISH HEDGE", consequences: "160 LETHAL CASUALTIES" },
    heavenDefensibility: 18,
    hellDefensibility: 94,
    heavenFeedback: "Gambling passenger lives against corporate pension balance sheets is moral bankruptcy.",
    hellFeedback: "You rightly punished criminal negligence that knowingly traded innocent lives for economic cover.",
    heavenQuote: "I thought we had time to upload the patch... I swear I thought so.",
    hellQuote: "One hundred and sixty people. There is no excuse for my cowardice.",
    moralAxes: { utilitarian: -0.8, mercy: 0.2, deontology: -0.9, punisher: 0.9 }
  },
  {
    id: "t3_chef_1",
    tier: 3,
    archetype: "chef",
    name: "Nadia Al-Mansoor",
    age: 47,
    title: "Catering Smuggler",
    virtue: "Smuggled 400 political dissidents and refugees out of an oppressive regime concealed inside food trucks.",
    sin: "Financed the border bribes by trading confiscated black-market narcotics to regional street gangs.",
    dilemma: "Rescued 400 people from torture and execution camps, but fueled destructive narcotic addiction in local communities.",
    hiddenFact: "Treated over 120 recovering drug addicts at a private halfway home she maintained behind her bakery.",
    moralAnalysis: { intent: "SAVE REFUGEES FROM TORTURE", consequences: "400 SAVED VS ILLICIT TRADE HARMS" },
    heavenDefensibility: 75,
    hellDefensibility: 64,
    heavenFeedback: "Saving 400 dissidents from torture camps justified utilizing dark black-market leverage.",
    hellFeedback: "Poisoning vulnerable street communities with hard drugs corrupts the moral nobility of rescue.",
    heavenQuote: "Four hundred souls are free to breathe in the sunlight.",
    hellQuote: "I dealt in poison to buy life... I knew the ledger had to balance.",
    moralAxes: { utilitarian: 0.7, mercy: 0.7, deontology: -0.6, punisher: 0.6 }
  }
];

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
