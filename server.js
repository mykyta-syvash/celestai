#!/usr/bin/env node
/**
 * CELESTAI dev/prod server — zero dependencies, Node 18+ (global fetch).
 *  - Serves the repo root as static files.
 *  - POST /api/soul      body = ctx     -> one validated AI card (OpenAI structured outputs)
 *  - POST /api/tribunal  body = summary -> { text } 2-3 sentence Archangel reflection
 *  - GET  /api/health                   -> { ai: bool }
 * Env: OPENAI_API_KEY (optional; without it /api/* returns 503 {error:"no_key"}), OPENAI_MODEL (default gpt-4.1-mini), PORT (default 8090).
 * The key never leaves this process.
 */
"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { METERS, sanitizeCard, CARD_JSON_SCHEMA, METER_GUIDE, CARD_RULES } = require("./scripts/card-schema.cjs");

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 8090;
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MAX_BODY = 32 * 1024;

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp",
  ".ico": "image/x-icon", ".mp3": "audio/mpeg", ".wav": "audio/wav", ".ogg": "audio/ogg", ".glb": "model/gltf-binary",
  ".woff": "font/woff", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8", ".md": "text/plain; charset=utf-8"
};
// Never serve secrets / tooling over HTTP.
const BLOCKED = /(^|\/)(\.git|\.env[^/]*|node_modules|\.claude)(\/|$)|\.(cjs|mjs)$|^\/?server\.js$|^\/?package(-lock)?\.json$/;

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY) { req.destroy(); resolve(null); return; }
      chunks.push(c);
    });
    req.on("end", () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}")); } catch { resolve(null); }
    });
    req.on("error", () => resolve(null));
  });
}

async function openai(messages, responseFormat, { timeoutMs = 20000, maxTokens = 900, temperature = 1 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(OPENAI_URL, {
      method: "POST",
      signal: ctrl.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify({ model: MODEL, messages, temperature, max_tokens: maxTokens, ...(responseFormat ? { response_format: responseFormat } : {}) })
    });
    if (!r.ok) throw new Error(`openai ${r.status}: ${(await r.text()).slice(0, 200)}`);
    const data = await r.json();
    const msg = data.choices && data.choices[0] && data.choices[0].message;
    if (!msg || msg.refusal) throw new Error("openai refusal/empty");
    return msg.content;
  } finally {
    clearTimeout(t);
  }
}

// ── /api/soul ──────────────────────────────────────────────────────────────
function describeCtx(ctx) {
  const meters = {};
  for (const m of METERS) meters[m] = Math.max(0, Math.min(100, Number(ctx && ctx.meters && ctx.meters[m]) || 50));
  // Most extreme meter = furthest from 50.
  const extreme = METERS.slice().sort((a, b) => Math.abs(meters[b] - 50) - Math.abs(meters[a] - 50))[0];
  const flags = Array.isArray(ctx && ctx.flags) ? ctx.flags.filter((f) => typeof f === "string").slice(0, 12) : [];
  const recent = Array.isArray(ctx && ctx.recentIds) ? ctx.recentIds.filter((f) => typeof f === "string").slice(-10) : [];
  const souls = Math.max(0, Number(ctx && ctx.soulsJudged) || 0);
  return { meters, extreme, dir: meters[extreme] >= 50 ? "high" : "low", flags, recent, souls };
}

function soulPrompt(ctx) {
  const d = describeCtx(ctx);
  const tier = d.souls < 6 ? 1 : d.souls < 16 ? 2 : 3;
  return [
    {
      role: "system",
      content:
        "You write souls for CELESTAI, a Reigns-like game where the player is the Celestial Judge sending each dead soul to Heaven or Hell. " +
        "Every verdict shifts four meters. " + METER_GUIDE + " " + CARD_RULES +
        " Variety is welcome: ordinary sinners and saints, petitions, bargains, mass judgments, strange cases (machines, ghosts of institutions)."
    },
    {
      role: "user",
      content:
        `Current meters: ${JSON.stringify(d.meters)}. The most extreme meter is ${d.extreme} (${d.dir}). ` +
        `Write ONE tier-${tier} soul that tempts the player to push ${d.extreme} even further ${d.dir === "high" ? "up" : "down"} with one verdict, ` +
        `while the other verdict relieves ${d.extreme} but costs something real elsewhere. ` +
        (d.flags.length ? `Story flags active in this reign (you may reference one subtly): ${d.flags.join(", ")}. ` : "") +
        (d.recent.length ? `Avoid repeating these recent souls: ${d.recent.join(", ")}. ` : "") +
        `Souls judged so far: ${d.souls}.`
    }
  ];
}

async function handleSoul(req, res) {
  if (!API_KEY) return sendJson(res, 503, { error: "no_key" });
  const ctx = await readBody(req);
  if (!ctx) return sendJson(res, 400, { error: "bad_json" });
  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      const content = await openai(soulPrompt(ctx), {
        type: "json_schema",
        json_schema: { name: "celestai_soul", strict: true, schema: CARD_JSON_SCHEMA }
      });
      let raw = null;
      try { raw = JSON.parse(content); } catch { raw = null; }
      const card = sanitizeCard(raw, { idPrefix: "ai_" });
      if (card) return sendJson(res, 200, { card });
    }
    return sendJson(res, 502, { error: "invalid_card" });
  } catch (err) {
    console.warn("[api/soul]", err.message);
    return sendJson(res, 502, { error: "upstream" });
  }
}

// ── /api/tribunal ──────────────────────────────────────────────────────────
async function handleTribunal(req, res) {
  if (!API_KEY) return sendJson(res, 503, { error: "no_key" });
  const s = await readBody(req);
  if (!s) return sendJson(res, 400, { error: "bad_json" });
  const history = (Array.isArray(s.history) ? s.history : []).slice(-12)
    .map((h) => `${String(h && h.name || "?").slice(0, 40)} -> ${h && h.side === "HELL" ? "Hell" : "Heaven"}`).join("; ");
  const meters = {};
  for (const m of METERS) meters[m] = Math.round(Number(s.meters && s.meters[m]) || 0);
  const messages = [
    {
      role: "system",
      content:
        "You are the Archangel presiding over the Judge's tribunal in CELESTAI. " + METER_GUIDE +
        " Reply with 2-3 short sentences (max 60 words), solemn and specific, addressed to the Judge as 'you'. No lists, no markdown."
    },
    {
      role: "user",
      content:
        `Reign ${Number(s.reign) || 1} ended after ${Number(s.soulsJudged) || 0} souls because ${String(s.deathMeter || "a meter")} went ${s.deathDir === "high" ? "too high" : "too low"}. ` +
        `Final meters: ${JSON.stringify(meters)}. Recent verdicts: ${history || "none"}. Reflect on the pattern of this Judge's verdicts and what doomed the reign.`
    }
  ];
  try {
    const text = await openai(messages, null, { timeoutMs: 8000, maxTokens: 160, temperature: 0.9 });
    const clean = String(text || "").replace(/\s+/g, " ").trim().slice(0, 500);
    if (!clean) return sendJson(res, 502, { error: "empty" });
    return sendJson(res, 200, { text: clean });
  } catch (err) {
    console.warn("[api/tribunal]", err.message);
    return sendJson(res, 502, { error: "upstream" });
  }
}

// ── static ─────────────────────────────────────────────────────────────────
function serveStatic(req, res) {
  let urlPath;
  try { urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname); } catch { res.writeHead(400); return res.end(); }
  if (urlPath.endsWith("/")) urlPath += "index.html";
  const filePath = path.normalize(path.join(ROOT, urlPath));
  const rel = path.relative(ROOT, filePath).split(path.sep).join("/");
  if (rel.startsWith("..") || path.isAbsolute(rel) || BLOCKED.test(rel)) { res.writeHead(404); return res.end("Not found"); }
  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream", "Content-Length": st.size, "Cache-Control": "no-cache" });
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, "http://x");
  if (pathname === "/api/health" && req.method === "GET") return sendJson(res, 200, { ai: !!API_KEY, model: API_KEY ? MODEL : null });
  if (pathname === "/api/soul" && req.method === "POST") return void handleSoul(req, res);
  if (pathname === "/api/tribunal" && req.method === "POST") return void handleTribunal(req, res);
  if (pathname.startsWith("/api/")) return sendJson(res, 404, { error: "not_found" });
  if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405); return res.end(); }
  serveStatic(req, res);
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`CELESTAI on http://localhost:${PORT}  (AI souls: ${API_KEY ? "ON, model " + MODEL : "OFF — set OPENAI_API_KEY"})`);
  });
}

module.exports = { server, soulPrompt, describeCtx };
