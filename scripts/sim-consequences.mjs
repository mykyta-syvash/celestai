// Simulates reigns through deck.js + chains.js + consequences.js + stories.js (StoryDeck) in a node vm.
// Usage: node scripts/sim-consequences.mjs
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const store = {};
const localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => (store[k] = String(v)),
  removeItem: (k) => delete store[k]
};
const window = { localStorage };
const ctx = vm.createContext({ window, localStorage, console, setTimeout, Math, JSON });
window.window = window;
for (const f of ["js/cards/deck.js", "js/cards/chains.js", "js/cards/generated.js", "js/consequences.js", "js/stories.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });
}

const cards = window.CELESTAI_CARDS;
const ARCH = new Set("doctor soldier businessman farmer thief artist scientist chef king astronaut".split(" "));
const words = (s) => String(s || "").trim().split(/\s+/).length;
const errors = [];
const ids = new Set();
for (const c of cards) {
  if (ids.has(c.id)) errors.push(`dup id ${c.id}`);
  ids.add(c.id);
  if (!ARCH.has(c.archetype)) errors.push(`${c.id}: bad archetype ${c.archetype}`);
  if (!c.id.startsWith("ch_")) continue; // only lint our own cards strictly
  if (words(c.dilemma) > 28) errors.push(`${c.id}: dilemma ${words(c.dilemma)}w`);
  if (words(c.virtue) > 12) errors.push(`${c.id}: virtue ${words(c.virtue)}w`);
  if (words(c.sin) > 12) errors.push(`${c.id}: sin ${words(c.sin)}w`);
  for (const s of ["heaven", "hell"]) {
    const o = c[s];
    const e = Object.entries(o.effects);
    if (e.length < 2 || e.length > 3) errors.push(`${c.id}.${s}: touches ${e.length} meters`);
    for (const [k, v] of e) if (!["mercy", "justice", "order", "faith"].includes(k) || !Number.isInteger(v) || Math.abs(v) > 20) errors.push(`${c.id}.${s}: bad effect ${k}=${v}`);
    if (words(o.feedback) > 20) errors.push(`${c.id}.${s}: feedback ${words(o.feedback)}w`);
    if (words(o.quote) > 14) errors.push(`${c.id}.${s}: quote ${words(o.quote)}w`);
  }
}

const engine = window.consequenceEngine;
const deck = window.storyDeck;
const chainHits = {};
let picks = 0;
let chainFollowUps = 0;
let delays = [];
for (let reign = 0; reign < 10; reign++) {
  deck.reset();
  const flagSetAt = {};
  for (let i = 0; i < 20; i++) {
    const card = deck.nextStory();
    if (!card || !card.heaven || !card.hell) throw new Error("bad card " + JSON.stringify(card));
    picks++;
    const req = (card.requires && card.requires.flags) || [];
    if (req.length) {
      chainFollowUps++;
      delays.push(i - Math.max(...req.map((f) => flagSetAt[f] ?? i)));
    }
    if (card.id.startsWith("ch_")) chainHits[card.id] = (chainHits[card.id] || 0) + 1;
    const side = Math.random() < 0.5 ? "HEAVEN" : "HELL";
    engine.applyChoice(card, side);
    for (const f of card[side.toLowerCase()].setFlags || []) flagSetAt[f] = i;
  }
}

console.log(`cards=${cards.length} chainCards=${cards.filter((c) => c.id.startsWith("ch_")).length} picks=${picks}`);
console.log(`chain follow-ups=${chainFollowUps}, delay(min/avg/max)=${Math.min(...delays)}/${(delays.reduce((a, b) => a + b, 0) / (delays.length || 1)).toFixed(1)}/${Math.max(...delays)}`);
console.log("chain cards seen:", JSON.stringify(chainHits));
console.log("legacy:", store.celestai_legacy);
if (errors.length) {
  console.error("LINT ERRORS:\n" + errors.join("\n"));
  process.exit(1);
}
if (!chainFollowUps) {
  console.error("no chain follow-ups triggered");
  process.exit(1);
}
if (!Object.keys(chainHits).some((k) => k.startsWith("ch_legacy_2") || k.startsWith("ch_legacy_3"))) {
  console.error("legacy chain never triggered across reigns");
  process.exit(1);
}
console.log("OK");
