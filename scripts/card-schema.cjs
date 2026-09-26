/**
 * CELESTAI card schema helpers shared by server.js, scripts/check-deck.mjs and scripts/generate-souls.mjs.
 * Zero dependencies. CommonJS so server.js can require() it and .mjs scripts can createRequire() it.
 */
"use strict";

const METERS = ["mercy", "justice", "order", "faith"];
const ARCHETYPES = ["doctor", "soldier", "businessman", "farmer", "thief", "artist", "scientist", "chef", "king", "astronaut"];
const SPEAKERS = ["soul", "archangel", "lucifer", "scribe"];
const LIMITS = { dilemma: 28, virtue: 12, sin: 12, feedback: 20, quote: 14 };
const EFFECT_MAX = 20;

const words = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;
const isStrArr = (a) => Array.isArray(a) && a.every((x) => typeof x === "string");

/** Strict validation for hand-authored cards. Returns an array of error strings (empty = valid). */
function validateCard(c) {
  const errs = [];
  const e = (m) => errs.push(`${c && c.id ? c.id : "<no id>"}: ${m}`);
  if (!c || typeof c !== "object") return ["card is not an object"];
  if (typeof c.id !== "string" || !/^[a-z0-9_]+$/.test(c.id)) e("id must be snake_case");
  if (![1, 2, 3].includes(c.tier)) e("tier must be 1|2|3");
  if (!ARCHETYPES.includes(c.archetype)) e(`bad archetype ${c.archetype}`);
  for (const k of ["name", "title", "dilemma", "virtue", "sin", "hiddenFact"]) {
    if (typeof c[k] !== "string" || !c[k].trim()) e(`missing ${k}`);
  }
  if (typeof c.age !== "number" || c.age < 0) e("age must be a number");
  for (const k of ["dilemma", "virtue", "sin"]) if (words(c[k]) > LIMITS[k]) e(`${k} has ${words(c[k])} words (>${LIMITS[k]})`);
  if (c.speaker !== undefined && !SPEAKERS.includes(c.speaker)) e(`bad speaker ${c.speaker}`);
  if (c.once !== undefined && typeof c.once !== "boolean") e("once must be boolean");
  if (c.weight !== undefined && !(typeof c.weight === "number" && c.weight > 0)) e("weight must be > 0");
  if (c.requires !== undefined) {
    const r = c.requires;
    for (const k of ["flags", "notFlags", "legacy"]) if (r[k] !== undefined && !isStrArr(r[k])) e(`requires.${k} must be string[]`);
    if (r.minSouls !== undefined && typeof r.minSouls !== "number") e("requires.minSouls must be number");
  }
  if (!c.moralAnalysis || typeof c.moralAnalysis.intent !== "string" || typeof c.moralAnalysis.consequences !== "string") e("moralAnalysis {intent, consequences} required");
  for (const s of ["heaven", "hell"]) {
    const d = c[s];
    if (!d || typeof d !== "object") { e(`missing ${s}`); continue; }
    const fx = d.effects || {};
    const keys = Object.keys(fx);
    if (keys.some((k) => !METERS.includes(k))) e(`${s}.effects has unknown meter`);
    if (keys.length < 2 || keys.length > 3) e(`${s}.effects touches ${keys.length} meters (need 2-3)`);
    for (const k of keys) {
      const v = fx[k];
      if (!Number.isInteger(v) || v === 0 || Math.abs(v) > EFFECT_MAX) e(`${s}.effects.${k}=${v} out of range`);
    }
    for (const k of ["setFlags", "clearFlags", "setLegacy"]) if (d[k] !== undefined && !isStrArr(d[k])) e(`${s}.${k} must be string[]`);
    if (typeof d.feedback !== "string" || !d.feedback) e(`${s}.feedback missing`);
    if (typeof d.quote !== "string" || !d.quote) e(`${s}.quote missing`);
    if (words(d.feedback) > LIMITS.feedback) e(`${s}.feedback has ${words(d.feedback)} words`);
    if (words(d.quote) > LIMITS.quote) e(`${s}.quote has ${words(d.quote)} words`);
  }
  return errs;
}

function clampWords(s, n) {
  const w = String(s || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (w.length <= n) return w.join(" ");
  return w.slice(0, n).join(" ").replace(/[,;:]$/, "") + "…";
}
const clampInt = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(Number(v) || 0)));
const cleanFlags = (a) => (Array.isArray(a) ? a.filter((x) => typeof x === "string" && /^[a-z0-9_]{1,40}$/.test(x)).slice(0, 3) : []);

function cleanEffects(raw) {
  const out = {};
  for (const k of METERS) {
    const v = clampInt(raw && raw[k], -EFFECT_MAX, EFFECT_MAX);
    if (v !== 0) out[k] = v;
  }
  // keep the 3 largest magnitudes
  const keys = Object.keys(out).sort((a, b) => Math.abs(out[b]) - Math.abs(out[a]));
  for (const k of keys.slice(3)) delete out[k];
  return out;
}

/**
 * Lenient sanitizer for model output: clamps numbers, trims texts, forces archetype/prefix.
 * Returns a valid card or null if it cannot be salvaged.
 */
function sanitizeCard(raw, opts = {}) {
  if (!raw || typeof raw !== "object") return null;
  const prefix = opts.idPrefix || "ai_";
  const slug = String(raw.id || raw.name || "soul").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 32) || "soul";
  const uniq = opts.unique === false ? "" : "_" + Math.random().toString(36).slice(2, 7);
  const archetype = ARCHETYPES.includes(raw.archetype) ? raw.archetype : ARCHETYPES[Math.floor(Math.random() * ARCHETYPES.length)];
  const side = (s) => {
    s = s || {};
    return {
      effects: cleanEffects(s.effects),
      setFlags: cleanFlags(s.setFlags),
      clearFlags: [],
      setLegacy: [],
      feedback: clampWords(s.feedback, LIMITS.feedback),
      quote: clampWords(s.quote, LIMITS.quote)
    };
  };
  const card = {
    id: (slug.startsWith(prefix) ? slug : prefix + slug) + uniq,
    tier: [1, 2, 3].includes(Number(raw.tier)) ? Number(raw.tier) : 2,
    archetype,
    name: clampWords(raw.name, 6),
    age: clampInt(raw.age, 1, 120),
    title: clampWords(raw.title, 6),
    dilemma: clampWords(raw.dilemma, LIMITS.dilemma),
    virtue: clampWords(raw.virtue, LIMITS.virtue),
    sin: clampWords(raw.sin, LIMITS.sin),
    speaker: "soul",
    once: true,
    weight: 1,
    heaven: side(raw.heaven),
    hell: side(raw.hell),
    hiddenFact: clampWords(raw.hiddenFact, 30),
    moralAnalysis: {
      intent: clampWords(raw.moralAnalysis && raw.moralAnalysis.intent, 6).toUpperCase(),
      consequences: clampWords(raw.moralAnalysis && raw.moralAnalysis.consequences, 8).toUpperCase()
    },
    ai: true
  };
  const errs = validateCard(card);
  return errs.length ? null : card;
}

const effectsSchema = {
  type: "object",
  additionalProperties: false,
  required: METERS,
  properties: Object.fromEntries(METERS.map((m) => [m, { type: "integer", description: "-20..20; use 0 for untouched. Exactly 2-3 non-zero." }]))
};
const sideSchema = {
  type: "object",
  additionalProperties: false,
  required: ["effects", "setFlags", "feedback", "quote"],
  properties: {
    effects: effectsSchema,
    setFlags: { type: "array", items: { type: "string" }, description: "0-1 snake_case flags, usually empty" },
    feedback: { type: "string", description: "<=20 words: how Heaven/mortals react to this verdict" },
    quote: { type: "string", description: "<=14 words: the soul's last words on hearing this verdict" }
  }
};
/** JSON schema (OpenAI structured outputs, strict mode) for one card. */
const CARD_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["id", "tier", "archetype", "name", "age", "title", "dilemma", "virtue", "sin", "hiddenFact", "moralAnalysis", "heaven", "hell"],
  properties: {
    id: { type: "string", description: "snake_case slug" },
    tier: { type: "integer", enum: [1, 2, 3] },
    archetype: { type: "string", enum: ARCHETYPES },
    name: { type: "string" },
    age: { type: "integer" },
    title: { type: "string", description: "2-4 word role" },
    dilemma: { type: "string", description: "<=28 words" },
    virtue: { type: "string", description: "<=12 words" },
    sin: { type: "string", description: "<=12 words" },
    hiddenFact: { type: "string", description: "one sentence that reframes the case" },
    moralAnalysis: {
      type: "object",
      additionalProperties: false,
      required: ["intent", "consequences"],
      properties: { intent: { type: "string", description: "2-4 WORDS UPPERCASE" }, consequences: { type: "string", description: "3-6 WORDS UPPERCASE" } }
    },
    heaven: sideSchema,
    hell: sideSchema
  }
};

const METER_GUIDE =
  "Meters (0..100, start 50; reaching 0 or 100 ends the reign): " +
  "mercy = compassion of Heaven (forgiving flawed souls raises it, harshness lowers it); " +
  "justice = sin is punished (condemning real wrongdoing raises it, pardoning it lowers it); " +
  "order = the celestial bureaucracy and rules/precedent (exceptions, bargains, chaos lower it); " +
  "faith = mortals' belief in your verdicts (verdicts mortals find absurd or scandalous lower it).";

const CARD_RULES =
  "Rules: each side (heaven, hell) changes exactly 2-3 meters by integers of magnitude 4-15 (others 0). " +
  "Neither side may be strictly better; each side must have at least one negative and one positive effect. " +
  "Heaven must NOT automatically raise mercy. Keep text short: dilemma <=28 words, virtue/sin <=12, feedback <=20, quote <=14. " +
  "Make it a genuine moral dilemma, vivid and specific, no gore, no real living people.";

module.exports = { METERS, ARCHETYPES, SPEAKERS, LIMITS, EFFECT_MAX, words, validateCard, sanitizeCard, clampWords, CARD_JSON_SCHEMA, METER_GUIDE, CARD_RULES };
