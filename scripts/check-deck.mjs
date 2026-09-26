#!/usr/bin/env node
/**
 * Validates every card in js/cards/*.js (loaded in a vm with a fake window) and prints meter balance.
 * Usage: node scripts/check-deck.mjs      (exit code 1 on schema errors or imbalance)
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { METERS, validateCard } = require("./card-schema.cjs");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = ["deck.js", "chains.js", "generated.js"].map((f) => path.join(root, "js/cards", f)).filter((f) => fs.existsSync(f));

const sandbox = { window: {}, console };
vm.createContext(sandbox);
const origin = new Map();
for (const f of files) {
  const before = (sandbox.window.CELESTAI_CARDS || []).length;
  vm.runInContext(fs.readFileSync(f, "utf8"), sandbox, { filename: f });
  (sandbox.window.CELESTAI_CARDS || []).slice(before).forEach((c) => origin.set(c, path.basename(f)));
}
const cards = sandbox.window.CELESTAI_CARDS || [];
const errors = [];
const seen = new Set();
for (const c of cards) {
  errors.push(...validateCard(c));
  if (seen.has(c.id)) errors.push(`${c.id}: duplicate id`);
  seen.add(c.id);
}

const MAX_DRIFT = 0.15;
const byFile = (f) => cards.filter((c) => origin.get(c) === f);
function balance(list, label) {
  console.log(`\n${label} (${list.length} cards)  meter: heaven / hell / net  drift`);
  let bad = false;
  for (const m of METERS) {
    let h = 0, x = 0, abs = 0;
    for (const c of list) {
      const hv = c.heaven.effects[m] || 0, xv = c.hell.effects[m] || 0;
      h += hv; x += xv; abs += Math.abs(hv) + Math.abs(xv);
    }
    const drift = abs ? (h + x) / abs : 0;
    const flag = Math.abs(drift) > MAX_DRIFT ? "  <-- IMBALANCED" : "";
    if (flag) bad = true;
    console.log(`  ${m.padEnd(8)} ${String(h).padStart(5)} / ${String(x).padStart(5)} / ${String(h + x).padStart(4)}  ${(drift * 100).toFixed(1)}%${flag}`);
  }
  const mercyUp = list.filter((c) => (c.heaven.effects.mercy || 0) > 0).length;
  const pct = list.length ? (mercyUp / list.length) * 100 : 0;
  console.log(`  heaven raises mercy in ${mercyUp}/${list.length} (${pct.toFixed(0)}%)${pct > 62 ? "  <-- TOO MANY" : ""}`);
  return bad || pct > 62;
}

const tiers = [1, 2, 3].map((t) => `t${t}:${cards.filter((c) => c.tier === t).length}`).join(" ");
const arch = {};
cards.forEach((c) => (arch[c.archetype] = (arch[c.archetype] || 0) + 1));
console.log(`Loaded ${cards.length} cards from ${files.map((f) => path.basename(f)).join(", ")}  [${tiers}]`);
console.log("archetypes:", Object.entries(arch).map(([k, v]) => `${k}:${v}`).join(" "));

const deckBad = balance(byFile("deck.js"), "deck.js");
if (cards.length !== byFile("deck.js").length) balance(cards, "all cards");

if (errors.length) {
  console.error(`\n${errors.length} error(s):\n  ` + errors.join("\n  "));
}
if (errors.length || deckBad) process.exit(1);
console.log("\nOK");
