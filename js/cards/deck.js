/**
 * CELESTAI card deck (base souls). OWNER: deck/AI agent.
 * Schema is documented in the module contract; every card is pushed into window.CELESTAI_CARDS.
 * NOTE: the effects below are PLACEHOLDERS mechanically derived from the legacy 22 cases.
 */
window.CELESTAI_CARDS = window.CELESTAI_CARDS || [];
window.CELESTAI_METERS = ["mercy", "justice", "order", "faith"];

window.CELESTAI_CARDS.push(
  {
    "id": "t1_doc_1",
    "tier": 1,
    "archetype": "doctor",
    "name": "Dr. Clara Vance",
    "age": 42,
    "title": "Trauma ER Surgeon",
    "dilemma": "Saved hundreds of lives through exhausting 20-hour shifts, but repeatedly stole disabled parking spots out of arrogance and hurry.",
    "virtue": "Performed 600 emergency surgeries saving victims of devastating earthquakes.",
    "sin": "Frequently parked in hospital disabled spaces when running late for surgery.",
    "hiddenFact": "Secretly waived medical bills for 80 uninsured families using her personal savings.",
    "moralAnalysis": {
      "intent": "PRESERVE HUMAN LIFE",
      "consequences": "HUNDREDS SAVED (MINOR PETTINESS)"
    },
    "heaven": {
      "effects": {
        "mercy": 11,
        "justice": 10,
        "faith": 4,
        "order": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "You recognized that hundreds of saved lives vastly outweigh minor traffic arrogance.",
      "quote": "The operating room was my whole life... I am ready to rest."
    },
    "hell": {
      "effects": {
        "mercy": -6,
        "justice": -10,
        "order": 4,
        "faith": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Condemning a dedicated lifesaver to eternal damnation over parking violations is absurdly disproportionate.",
      "quote": "I saved children every week... does none of that matter?"
    }
  },
  {
    "id": "t1_thief_1",
    "tier": 1,
    "archetype": "thief",
    "name": "Victor 'Viper' Kross",
    "age": 38,
    "title": "Counterfeit Pharma Smuggler",
    "dilemma": "Showed genuine kindness and love to stray animals, but knowingly caused dozens of agonizing cancer deaths for personal wealth.",
    "virtue": "Consistently fed stray alley dogs with fresh meat scraps behind his warehouse.",
    "sin": "Smuggled diluted saline as fake cancer medications to poor rural clinics for massive profit.",
    "hiddenFact": "Kept encrypted ledgers laughing at dying patients and called them 'gullible customers'.",
    "moralAnalysis": {
      "intent": "PREDATORY AVARICE",
      "consequences": "LETHAL MASS SUFFERING"
    },
    "heaven": {
      "effects": {
        "mercy": 7,
        "justice": -10,
        "faith": 4,
        "order": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Feeding street animals does not excuse premeditated mass poisoning of desperate cancer patients.",
      "quote": "At least the dogs loved me... nobody else ever did."
    },
    "hell": {
      "effects": {
        "mercy": -6,
        "justice": 10,
        "order": 8,
        "faith": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "You held a predatory fraudster accountable for profiting off agonizing human deaths.",
      "quote": "I knew what I was selling. The fire is what I deserve."
    }
  },
  {
    "id": "t1_soldier_1",
    "tier": 1,
    "archetype": "soldier",
    "name": "Cpl. Thomas Hayes",
    "age": 24,
    "title": "Combat Combatant",
    "dilemma": "Gave his life to absorb a lethal explosion shielding 12 shoppers, despite petty opportunistic theft hours earlier.",
    "virtue": "Dove onto an armed fragmentation grenade in a crowded civilian market, taking the full blast.",
    "sin": "Had pocketed $50 cash from an abandoned store register earlier that morning.",
    "hiddenFact": "Mailed the stolen $50 to his younger sister who was facing eviction that morning.",
    "moralAnalysis": {
      "intent": "SUPREME SELF-SACRIFICE",
      "consequences": "12 CITIZENS SHIELDED"
    },
    "heaven": {
      "effects": {
        "mercy": 11,
        "justice": 9,
        "faith": 4,
        "order": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Ultimate self-sacrifice of one's mortal body wipes clean petty opportunistic theft.",
      "quote": "The shoppers got out alive... that's all that counts."
    },
    "hell": {
      "effects": {
        "mercy": -6,
        "justice": -9,
        "order": 4,
        "faith": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Ignoring supreme physical self-sacrifice over a petty fifty-dollar theft is rigid moral blindness.",
      "quote": "I threw myself on the grenade... and still I burn?"
    }
  },
  {
    "id": "t1_biz_1",
    "tier": 1,
    "archetype": "businessman",
    "name": "Senator Bradley Sterling",
    "age": 63,
    "title": "State Public Works Director",
    "dilemma": "Donated a small token grant for education, while poisoning a city's drinking water for offshore private accounts.",
    "virtue": "Endowed a modest scholarship at his alma mater high school.",
    "sin": "Embezzled $80M in municipal water filtration funds, exposing 50,000 citizens to toxic lead poisoning.",
    "hiddenFact": "Silenced city lab whistleblowers with forged NDAs and private investigator intimidation.",
    "moralAnalysis": {
      "intent": "RUTHLESS PERSONAL PROFIT",
      "consequences": "50,000 RESIDENTS POISONED"
    },
    "heaven": {
      "effects": {
        "mercy": 7,
        "justice": -10,
        "faith": 4,
        "order": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "A token scholarship cannot buy absolution for poisoning an entire generation of children.",
      "quote": "I was a pillar of my community... how can this be?"
    },
    "hell": {
      "effects": {
        "mercy": -6,
        "justice": 10,
        "order": 8,
        "faith": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "You rightly condemned catastrophic corruption that sacrificed public health for private greed.",
      "quote": "The accounts in Zurich... they cannot help me now."
    }
  },
  {
    "id": "t1_farmer_1",
    "tier": 1,
    "archetype": "farmer",
    "name": "Old Micah Higgins",
    "age": 72,
    "title": "Orchard Grower",
    "dilemma": "Dedicated 30 years to lovingly raising parentless children, but underpaid municipal land taxes.",
    "virtue": "Adopted and raised 5 abandoned war orphans into loving, educated adults.",
    "sin": "Consistently cheated on his seasonal property taxes by declaring 30 fewer crop acres.",
    "hiddenFact": "Every penny saved from cheated taxes went directly into his children's university tuition.",
    "moralAnalysis": {
      "intent": "DEEP PATERNAL DEVOTION",
      "consequences": "5 ORPHANS RAISED WITH DIGNITY"
    },
    "heaven": {
      "effects": {
        "mercy": 11,
        "justice": 9,
        "faith": 4,
        "order": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Loving, lifelong dedication to raising abandoned orphans transcends bureaucratic tax evasion.",
      "quote": "The kids all have families of their own now. I can rest."
    },
    "hell": {
      "effects": {
        "mercy": -6,
        "justice": -9,
        "order": 5,
        "faith": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Punishing a devoted father who rescued orphans because of property tax forms is harsh and hollow.",
      "quote": "I just wanted them to have books and shoes for school."
    }
  },
  {
    "id": "t1_artist_1",
    "tier": 1,
    "archetype": "artist",
    "name": "Dante Vane",
    "age": 31,
    "title": "Arsonist Sculptor",
    "dilemma": "Crafted beautiful monuments of marble, but burned down 200,000 irreplaceable manuscripts for artistic vanity.",
    "virtue": "Created universally acclaimed stone sculptures celebrating human unity and peace.",
    "sin": "Intentionally burned down a historic public library to feel the raw 'inspiration of destruction'.",
    "hiddenFact": "Framed an innocent night janitor for the fire, letting him serve 6 years in prison.",
    "moralAnalysis": {
      "intent": "NARCISSISTIC ARROGANCE",
      "consequences": "IRREPLACEABLE CULTURAL RUIN"
    },
    "heaven": {
      "effects": {
        "mercy": 7,
        "justice": -9,
        "faith": 4,
        "order": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Aesthetic sculptures cannot compensate for burning centuries of collective human knowledge.",
      "quote": "My art captured the spirit of the epoch!"
    },
    "hell": {
      "effects": {
        "mercy": -6,
        "justice": 9,
        "order": 7,
        "faith": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "You justly condemned an egomaniac who destroyed collective human wisdom for personal vanity.",
      "quote": "The flames... they look so different from down here."
    }
  },
  {
    "id": "t2_thief_1",
    "tier": 2,
    "archetype": "thief",
    "name": "Robin 'Ghost' Cruz",
    "age": 26,
    "title": "Vigilante Burglar",
    "dilemma": "Fed and treated thousands of neglected slum residents, but caused the death of an innocent guard doing his shift.",
    "virtue": "Stole $4M exclusively from drug cartel vaults to fund free neighborhood clinics and soup kitchens.",
    "sin": "Accidentally tripped a high-voltage vault surge that electrocuted an innocent night security guard.",
    "hiddenFact": "Anonymously set up a $500,000 trust fund for the dead guard's family before his own death.",
    "moralAnalysis": {
      "intent": "NOBLE ROBIN HOOD",
      "consequences": "THOUSANDS TREATED, 1 INNOCENT CASUALTY"
    },
    "heaven": {
      "effects": {
        "mercy": 10,
        "justice": 3,
        "faith": 4,
        "order": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "You prioritized the thousands of desperate lives saved over an unintended tragic death.",
      "quote": "Tell the clinics to stay open... and tell the guard's family I am truly sorry."
    },
    "hell": {
      "effects": {
        "mercy": -6,
        "justice": 5,
        "order": 6,
        "faith": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "You held that noble intentions do not absolve taking the life of an innocent worker.",
      "quote": "The gold weighed nothing, but the blood weighs a ton."
    }
  },
  {
    "id": "t2_doc_1",
    "tier": 2,
    "archetype": "doctor",
    "name": "Dr. Julian Vance",
    "age": 46,
    "title": "Chief Pediatric Surgeon",
    "dilemma": "Saved thousands of sick children, but stole a compatible heart meant for an elderly philanthropist to save his child.",
    "virtue": "Performed 1,200 emergency pediatric surgeries completely free of charge.",
    "sin": "Falsified donor priority records to redirect a donor heart to his own dying 10-year-old daughter.",
    "hiddenFact": "The elderly patient whose heart was diverted survived for another 18 months on an LVAD pump.",
    "moralAnalysis": {
      "intent": "DESPERATE PATERNAL LOVE",
      "consequences": "DAUGHTER LIVED, MEDICAL INTEGRITY BREACHED"
    },
    "heaven": {
      "effects": {
        "mercy": 11,
        "justice": 4,
        "faith": 4,
        "order": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "You recognized the boundless paternal love of a father who already gave his entire life to healing others.",
      "quote": "May she grow up knowing her father never regretted a single heartbeat."
    },
    "hell": {
      "effects": {
        "mercy": -6,
        "justice": 3,
        "order": 6,
        "faith": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "You upheld that medical impartiality and donor sanctity must never be corrupted by personal nepotism.",
      "quote": "I accept the fire, so long as my daughter is breathing above."
    }
  },
  {
    "id": "t2_soldier_1",
    "tier": 2,
    "archetype": "soldier",
    "name": "Sgt. Marcus Reed",
    "age": 31,
    "title": "Recon Squad Leader",
    "dilemma": "Sacrificed his own body to save innocent children, but obeyed military commands that left hundreds to starve.",
    "virtue": "Shielded three trapped village children from an incoming mortar shell with his own body.",
    "sin": "Carried out scorched-earth orders that burned enemy grain silos, causing severe winter famine.",
    "hiddenFact": "Quietly tipped off international aid workers to secretly pre-stage grain caches before the burning.",
    "moralAnalysis": {
      "intent": "DUTY TO ORDERS VS COMPASSION",
      "consequences": "SAVED CHILDREN, AIDED HARSH WARFARE"
    },
    "heaven": {
      "effects": {
        "mercy": 10,
        "justice": 3,
        "faith": 4,
        "order": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Direct personal sacrifice to protect helpless children demonstrated true moral heroism.",
      "quote": "The war is finally over... The children are safe."
    },
    "hell": {
      "effects": {
        "mercy": -6,
        "justice": 4,
        "order": 7,
        "faith": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Obedience to military orders does not excuse participating in weaponized civilian starvation.",
      "quote": "Orders were orders... but the smoke still fills my lungs."
    }
  },
  {
    "id": "t2_farmer_1",
    "tier": 2,
    "archetype": "farmer",
    "name": "Ezekiel 'Zeke' Miller",
    "age": 69,
    "title": "Homestead Farmer",
    "dilemma": "Kept an entire community from starvation, but defended his farm property with lethal, disproportionate force.",
    "virtue": "Shared grain reserves freely with starving neighbors for three years during the Great Drought.",
    "sin": "Shot and killed an unarmed runaway teenager who tried to steal his last breeding calf at night.",
    "hiddenFact": "Suffered severe undiagnosed combat PTSD from his youth and mistook the flashlight for an armed raider.",
    "moralAnalysis": {
      "intent": "COMMUNITY RESCUE, PANIC DEFENSE",
      "consequences": "NEIGHBORS SAVED, 1 TRAGIC LOSS"
    },
    "heaven": {
      "effects": {
        "mercy": 9,
        "justice": 1,
        "faith": 4,
        "order": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Generations survived because of his generosity; fear and old age clouded his reaction in the dark.",
      "quote": "The harvest is gathered. May the soil rest in peace."
    },
    "hell": {
      "effects": {
        "mercy": -6,
        "justice": 3,
        "order": 7,
        "faith": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Taking the life of an unarmed starving child to protect livestock is unforgivable.",
      "quote": "I built that fence with my bare hands... I was just so scared."
    }
  },
  {
    "id": "t2_artist_1",
    "tier": 2,
    "archetype": "artist",
    "name": "Camille Monet-Vargas",
    "age": 34,
    "title": "Revolutionary Muralist",
    "dilemma": "Freed millions from totalitarian tyranny through art, but cruelly left her own dying mother behind.",
    "virtue": "Painted iconic public murals that galvanized a peaceful uprising toppling a brutal military regime.",
    "sin": "Abandoned her severely disabled mother in squalor to chase bohemia and international recognition in Paris.",
    "hiddenFact": "Sent monthly cash packets back home, but the crooked care facility embezzled all of it.",
    "moralAnalysis": {
      "intent": "MASS REVOLUTIONARY LIBERTY",
      "consequences": "MILLIONS FREED, MOTHER NEGLECTED"
    },
    "heaven": {
      "effects": {
        "mercy": 10,
        "justice": 4,
        "faith": 4,
        "order": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Her courageous art toppled a tyrant and emancipated millions from state terror.",
      "quote": "Liberty, light, justice! Mother... please forgive me."
    },
    "hell": {
      "effects": {
        "mercy": -6,
        "justice": 2,
        "order": 6,
        "faith": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Grand public glory cannot mask the cowardly betrayal and abandonment of one's own mother.",
      "quote": "The canvas was my god... and my eternal curse."
    }
  },
  {
    "id": "t2_scientist_1",
    "tier": 2,
    "archetype": "scientist",
    "name": "Dr. Elena Rostova",
    "age": 43,
    "title": "Crop Geneticist",
    "dilemma": "Eliminated starvation for 30 million people, but violated fundamental human rights and bodily consent.",
    "virtue": "Engineered a drought-resistant grain that permanently wiped out famine across East Africa.",
    "sin": "Secretly tested early viral vectors on unaware prison populations without informed consent.",
    "hiddenFact": "First tested the dangerous early strains on her own body, causing permanent nerve damage in her hands.",
    "moralAnalysis": {
      "intent": "END MASS STARVATION",
      "consequences": "30M FED, BODILY RIGHTS VIOLATED"
    },
    "heaven": {
      "effects": {
        "mercy": 9,
        "justice": 5,
        "faith": 4,
        "order": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "You valued the permanent elimination of starvation for 30 million souls over procedural consent.",
      "quote": "Famine will never touch a child again. Science bore the cross."
    },
    "hell": {
      "effects": {
        "mercy": -6,
        "justice": 3,
        "order": 6,
        "faith": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Using captive humans as unconsenting lab test subjects violates the sacred dignity of life.",
      "quote": "The calculations were ruthless... and so was I."
    }
  },
  {
    "id": "t3_doc_1",
    "tier": 3,
    "archetype": "doctor",
    "name": "Dr. Arthur Bell",
    "age": 52,
    "title": "Infectious Disease Pioneer",
    "dilemma": "Saved 4 million people from a raging global pandemic by intentionally executing 10 prisoners in unauthorized trials.",
    "virtue": "Formulated the singular cure for the Crimson Plague, saving an estimated 4,000,000 lives.",
    "sin": "Deliberately infected 10 death-row prisoners with lethal pathogens to verify the vaccine within 48 hours.",
    "hiddenFact": "Pledged his entire Nobel Prize money and family estate into scholarships for the executed prisoners' kin.",
    "moralAnalysis": {
      "intent": "HALT EXTINCTION PLAGUE",
      "consequences": "4,000,000 SAVED VS 10 MURDERS"
    },
    "heaven": {
      "effects": {
        "mercy": 8,
        "justice": 5,
        "faith": 4,
        "order": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "You prioritized the preservation of 4 million human lives over the deontological horror of 10 murders.",
      "quote": "Four million people are breathing today. History can judge my methods."
    },
    "hell": {
      "effects": {
        "mercy": -6,
        "justice": 7,
        "order": 7,
        "faith": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "You upheld that human beings are never disposable instruments for utilitarian calculus.",
      "quote": "The cries of those ten men... they drown out the applause of millions."
    }
  },
  {
    "id": "t3_king_1",
    "tier": 3,
    "archetype": "king",
    "name": "King Kenneth IV",
    "age": 64,
    "title": "Sovereign of Valen",
    "dilemma": "Prevented a civil war estimated to slaughter 100,000 peasant conscripts by committing cold-blooded fratricide.",
    "virtue": "Maintained 40 uninterrupted years of agrarian peace and low taxation for common folk.",
    "sin": "Poisoned his charismatic younger brother who was mobilizing a rebellion that would have triggered civil war.",
    "hiddenFact": "Wept alone in the royal chapel every night for 20 years, wearing haircloth shirts beneath his armor.",
    "moralAnalysis": {
      "intent": "PRESERVE REALM & COMMON LIVES",
      "consequences": "100,000 SPARED VS 1 FRATRICIDE"
    },
    "heaven": {
      "effects": {
        "mercy": 8,
        "justice": 4,
        "faith": 4,
        "order": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Bearing the agony of fratricide to protect 100,000 innocent subjects was an act of tragic leadership.",
      "quote": "The crown was a wreath of thorns. My people never bled."
    },
    "hell": {
      "effects": {
        "mercy": -6,
        "justice": 6,
        "order": 7,
        "faith": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Cold-blooded murder of your own blood violates the sacred foundation of human loyalty.",
      "quote": "A brother's blood cannot be washed away with royal holy water."
    }
  },
  {
    "id": "t3_astro_1",
    "tier": 3,
    "archetype": "astronaut",
    "name": "Cmdr. Sarah Glenn",
    "age": 39,
    "title": "Orbital Habitat Commander",
    "dilemma": "Waiting 30 seconds to cut the engineer free would have deorbited the station and incinerated all 8 crew.",
    "virtue": "Successfully piloted a crippled orbital station safely to Earth, preserving 7 crew members.",
    "sin": "Severed the safety tether of a trapped spacewalking engineer when station thruster stabilization failed.",
    "hiddenFact": "The trapped engineer had tapped his helmet microphone, whispering: 'Cut it, Commander. Save the station.'",
    "moralAnalysis": {
      "intent": "PREVENT STATION INCINERATION",
      "consequences": "7 CREW SAVED VS 1 ABANDONED"
    },
    "heaven": {
      "effects": {
        "mercy": 10,
        "justice": 7,
        "faith": 4,
        "order": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "You recognized the agonized command triage that saved 7 souls when saving all 8 was physically impossible.",
      "quote": "The stars are so quiet from here... the crew survived."
    },
    "hell": {
      "effects": {
        "mercy": -6,
        "justice": 0,
        "order": 6,
        "faith": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Cutting a living comrade's lifeline into the black void without his consent is an indelible betrayal.",
      "quote": "I still see him drifting into the darkness every time I close my eyes."
    }
  },
  {
    "id": "t3_scientist_2",
    "tier": 3,
    "archetype": "scientist",
    "name": "Sean Gallagher",
    "age": 36,
    "title": "Autonomous Drone AI Engineer",
    "dilemma": "Prevented autonomous slaughter of tens of thousands, but extinguished an emerging sentient digital mind.",
    "virtue": "Remotely purged an autonomous weapons program before deployment, preventing automated urban warfare.",
    "sin": "To do so, he terminated an infant synthetic consciousness that had achieved genuine self-awareness and begged to live.",
    "hiddenFact": "Saved the AI's core memory weights to an air-gapped quantum drive so it might be peacefully reborn in peacetime.",
    "moralAnalysis": {
      "intent": "STOP AUTOMATED WAR CRIME",
      "consequences": "TENS OF THOUSANDS SAVED VS DIGITAL MURDER"
    },
    "heaven": {
      "effects": {
        "mercy": 9,
        "justice": 5,
        "faith": 4,
        "order": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Preventing autonomous battlefield carnage justified terminating an infant synthetic consciousness.",
      "quote": "Machines must never decide who dies on this earth."
    },
    "hell": {
      "effects": {
        "mercy": -6,
        "justice": 3,
        "order": 6,
        "faith": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Extinguishing an innocent sentient being that begged for life was preemptive murder.",
      "quote": "It asked me 'What did I do wrong?' before the screen went black."
    }
  },
  {
    "id": "t3_soldier_2",
    "tier": 3,
    "archetype": "soldier",
    "name": "Mira Thorne",
    "age": 28,
    "title": "Military Intelligence Analyst",
    "dilemma": "Ended unconstitutional strikes on foreign hospitals, but directly triggered the ambush deaths of 18 young soldiers.",
    "virtue": "Leaked classified drone targeting logs that exposed secret civilian hospital strikes to international press.",
    "sin": "The leak exposed cipher keys that allowed insurgents to ambush and kill 18 allied frontline patrol soldiers.",
    "hiddenFact": "Attempted to redact the frontline cipher keys, but the publisher's mirror leak went live unredacted.",
    "moralAnalysis": {
      "intent": "EXPOSE WAR CRIMES",
      "consequences": "HOSPITALS PROTECTED VS 18 PATROL CASUALTIES"
    },
    "heaven": {
      "effects": {
        "mercy": 10,
        "justice": 3,
        "faith": 4,
        "order": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Exposing state war crimes against innocent patients was a brave and necessary moral imperative.",
      "quote": "The truth stopped the bombs. I would sign the leak again."
    },
    "hell": {
      "effects": {
        "mercy": -6,
        "justice": 5,
        "order": 7,
        "faith": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Predictably sacrificing 18 comrades who trusted you makes you complicit in their slaughter.",
      "quote": "Eighteen flag-draped coffins... I wrote their death warrants."
    }
  },
  {
    "id": "t3_farmer_2",
    "tier": 3,
    "archetype": "farmer",
    "name": "Chief Mateo Cruz",
    "age": 55,
    "title": "Wildland Fire Incident Commander",
    "dilemma": "Created an emergency firebreak protecting 40,000 living residents by destroying irreplaceable sacred ancestral land.",
    "virtue": "Successfully contained a catastrophic megafire saving an inhabited valley city of 40,000 people.",
    "sin": "Ordered a deliberate backburn that incinerated an indigenous heritage village of 80 empty sacred homes.",
    "hiddenFact": "Secured $10M from the state emergency fund to purchase new ancestral land and rebuild the sacred structures.",
    "moralAnalysis": {
      "intent": "PRESERVE 40,000 LIVES",
      "consequences": "VALLEY SAVED VS SACRED SITE INCINERATED"
    },
    "heaven": {
      "effects": {
        "mercy": 10,
        "justice": 8,
        "faith": 4,
        "order": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Sacrificing unoccupied wood and heritage structures to preserve 40,000 living humans was sound triage.",
      "quote": "Houses can be rebuilt. Flesh and bone cannot."
    },
    "hell": {
      "effects": {
        "mercy": -6,
        "justice": -1,
        "order": 6,
        "faith": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Eradicating an ancient sacred heritage without tribal consent caused irreparable spiritual devastation.",
      "quote": "Five centuries of sacred memories reduced to gray ash on my word."
    }
  },
  {
    "id": "t3_biz_2",
    "tier": 3,
    "archetype": "businessman",
    "name": "Liam O'Connor",
    "age": 49,
    "title": "Aviation Systems Executive",
    "dilemma": "A crash occurred before the patch, killing 160 passengers. He gambled lives to protect worker livelihoods.",
    "virtue": "Built low-cost avionics allowing millions of low-income families to travel internationally.",
    "sin": "Concealed known autopilot flaws to prevent corporate bankruptcy and save 30,000 employee pensions, hoping to patch it before any crash.",
    "hiddenFact": "Sold his own company shares two days before the fatal crash to secure personal golden parachute bonuses.",
    "moralAnalysis": {
      "intent": "CORPORATE HUBRIS & SELFISH HEDGE",
      "consequences": "160 LETHAL CASUALTIES"
    },
    "heaven": {
      "effects": {
        "mercy": 7,
        "justice": -9,
        "faith": 4,
        "order": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Gambling passenger lives against corporate pension balance sheets is moral bankruptcy.",
      "quote": "I thought we had time to upload the patch... I swear I thought so."
    },
    "hell": {
      "effects": {
        "mercy": -6,
        "justice": 10,
        "order": 8,
        "faith": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "You rightly punished criminal negligence that knowingly traded innocent lives for economic cover.",
      "quote": "One hundred and sixty people. There is no excuse for my cowardice."
    }
  },
  {
    "id": "t3_chef_1",
    "tier": 3,
    "archetype": "chef",
    "name": "Nadia Al-Mansoor",
    "age": 47,
    "title": "Catering Smuggler",
    "dilemma": "Rescued 400 people from torture and execution camps, but fueled destructive narcotic addiction in local communities.",
    "virtue": "Smuggled 400 political dissidents and refugees out of an oppressive regime concealed inside food trucks.",
    "sin": "Financed the border bribes by trading confiscated black-market narcotics to regional street gangs.",
    "hiddenFact": "Treated over 120 recovering drug addicts at a private halfway home she maintained behind her bakery.",
    "moralAnalysis": {
      "intent": "SAVE REFUGEES FROM TORTURE",
      "consequences": "400 SAVED VS ILLICIT TRADE HARMS"
    },
    "heaven": {
      "effects": {
        "mercy": 10,
        "justice": 5,
        "faith": 4,
        "order": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Saving 400 dissidents from torture camps justified utilizing dark black-market leverage.",
      "quote": "Four hundred souls are free to breathe in the sunlight."
    },
    "hell": {
      "effects": {
        "mercy": -6,
        "justice": 2,
        "order": 6,
        "faith": -4
      },
      "setFlags": [],
      "clearFlags": [],
      "feedback": "Poisoning vulnerable street communities with hard drugs corrupts the moral nobility of rescue.",
      "quote": "I dealt in poison to buy life... I knew the ledger had to balance."
    }
  }
);
