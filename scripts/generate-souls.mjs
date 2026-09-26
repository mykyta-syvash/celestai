#!/usr/bin/env node
/**
 * Offline batch generator: asks OpenAI for N souls and writes them into js/cards/generated.js.
 * Usage:  OPENAI_API_KEY=sk-... node scripts/generate-souls.mjs [N=10] [--replace]
 *   --replace  discard previously generated cards (default: append to them)
 * Env: OPENAI_MODEL (default gpt-4.1-mini). Run `node scripts/check-deck.mjs` afterwards.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { METERS, ARCHETYPES, sanitizeCard, validateCard, CARD_JSON_SCHEMA, METER_GUIDE, CARD_RULES } = require("./card-schema.cjs");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "js/cards/generated.js");
const KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const args = process.argv.slice(2);
const N = Math.max(1, Math.min(100, parseInt(args.find((a) => /^\d+$/.test(a)) || "10", 10)));
const REPLACE = args.includes("--replace");

if (!KEY) {
  console.error("OPENAI_API_KEY is not set. Export it and re-run.");
  process.exit(1);
}

function loadCards(files) {
  const sb = { window: {} };
  vm.createContext(sb);
  for (const f of files) if (fs.existsSync(f)) vm.runInContext(fs.readFileSync(f, "utf8"), sb, { filename: f });
  return sb.window.CELESTAI_CARDS || [];
}

const baseCards = loadCards(["deck.js", "chains.js"].map((f) => path.join(root, "js/cards", f)));
const previous = REPLACE ? [] : loadCards([OUT]);
const usedIds = new Set([...baseCards, ...previous].map((c) => c.id));
const usedNames = [...baseCards, ...previous].map((c) => c.name);

const THEMES = [
  "an ordinary person with one grave secret", "a petition from a soul bargaining for someone else", "a mass judgment of many souls at once",
  "a leader whose hard choice saved many and ruined some", "a whistleblower", "a child or teenager", "a religious figure",
  "a strange case (an AI, a ghost, a clone, an animal-like soul)", "a bargain that would change Heaven's own rules",
  "a saint with one unforgivable act", "a criminal with one enormous act of good", "a scientist who broke ethics for progress"
];

async function generateOne(i) {
  const tier = (i % 3) + 1;
  const focus = METERS[i % METERS.length];
  const archetype = ARCHETYPES[i % ARCHETYPES.length];
  const theme = THEMES[i % THEMES.length];
  const messages = [
    { role: "system", content: "You write souls for CELESTAI, a Reigns-like game where the player is the Celestial Judge sending each dead soul to Heaven or Hell. " + METER_GUIDE + " " + CARD_RULES },
    {
      role: "user",
      content:
        `Write ONE tier-${tier} soul (1 = hard but quick, 2 = both verdicts defensible, 3 = genuinely split). ` +
        `Archetype: ${archetype}. Theme: ${theme}. Make ${focus} the meter most at stake. ` +
        `Use a fresh name, not any of: ${usedNames.slice(-60).join(", ")}.`
    }
  ];
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      model: MODEL,
      temperature: 1,
      max_tokens: 900,
      messages,
      response_format: { type: "json_schema", json_schema: { name: "celestai_soul", strict: true, schema: CARD_JSON_SCHEMA } }
    })
  });
  if (!r.ok) throw new Error(`OpenAI ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const data = await r.json();
  const content = data.choices?.[0]?.message?.content;
  const raw = JSON.parse(content);
  raw.tier = tier;
  const card = sanitizeCard(raw, { idPrefix: "gen_", unique: false });
  if (!card) return null;
  delete card.ai;
  let id = card.id, k = 2;
  while (usedIds.has(id)) id = `${card.id}_${k++}`;
  card.id = id;
  usedIds.add(id);
  usedNames.push(card.name);
  return card;
}

const fresh = [];
let attempts = 0;
while (fresh.length < N && attempts < N * 2) {
  const i = previous.length + attempts++;
  try {
    const card = await generateOne(i);
    if (card && validateCard(card).length === 0) {
      fresh.push(card);
      console.log(`✓ ${fresh.length}/${N} ${card.id} (t${card.tier} ${card.archetype})`);
    } else {
      console.warn(`✗ attempt ${attempts}: invalid card, retrying`);
    }
  } catch (err) {
    console.warn(`✗ attempt ${attempts}: ${err.message}`);
  }
}

const all = [...previous, ...fresh];
const out =
  "/**\n * CELESTAI OpenAI-generated cards (offline batch output of scripts/generate-souls.mjs). OWNER: deck/AI agent.\n" +
  ` * Generated ${new Date().toISOString()} with ${MODEL}. Do not hand-edit; re-run the script instead.\n */\n` +
  "window.CELESTAI_CARDS = window.CELESTAI_CARDS || [];\n" +
  (all.length ? `window.CELESTAI_CARDS.push(\n${all.map((c) => "  " + JSON.stringify(c)).join(",\n")}\n);\n` : "");
fs.writeFileSync(OUT, out);
console.log(`Wrote ${all.length} card(s) (${fresh.length} new) to ${path.relative(root, OUT)}`);
if (fresh.length < N) process.exitCode = 2;
