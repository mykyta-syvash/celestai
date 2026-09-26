/**
 * CELESTAI runtime AI soul generation client (talks to server.js /api/*). OWNER: deck/AI agent.
 * Exposes window.aiSouls:
 *   isAvailable() -> bool          true only after GET /api/health reported { ai: true }
 *   prefetch(ctx)                  fire-and-forget; keeps a queue of up to 2 generated cards
 *   take() -> card|null            pops one validated card (id prefixed "ai_")
 *   tribunal(summary) -> Promise<string|null>   Archangel reflection, null on any failure / 5s timeout
 * Never throws. On a plain static server (python http.server) everything resolves to null/false.
 */
(function () {
  "use strict";

  var METERS = ["mercy", "justice", "order", "faith"];
  var ARCHETYPES = ["doctor", "soldier", "businessman", "farmer", "thief", "artist", "scientist", "chef", "king", "astronaut"];
  var QUEUE_MAX = 6;
  var available = false;
  var queue = [];
  var inflight = 0;
  var failures = 0;
  var seenIds = {};

  function fetchJson(url, opts, timeoutMs) {
    var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = null;
    var timeout = new Promise(function (resolve) {
      timer = setTimeout(function () {
        try { if (ctrl) ctrl.abort(); } catch (e) { /* ignore */ }
        resolve(null);
      }, timeoutMs);
    });
    var req;
    try {
      req = fetch((window.CELESTAI_API_BASE || "") + url, Object.assign({}, opts || {}, ctrl ? { signal: ctrl.signal } : {}))
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; });
    } catch (e) {
      req = Promise.resolve(null);
    }
    return Promise.race([req, timeout]).then(function (v) { clearTimeout(timer); return v; }, function () { clearTimeout(timer); return null; });
  }

  function post(url, body, timeoutMs) {
    var payload;
    try { payload = JSON.stringify(body || {}); } catch (e) { return Promise.resolve(null); }
    return fetchJson(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: payload }, timeoutMs);
  }

  function words(s, n) {
    var w = String(s || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
    return w.length <= n ? w.join(" ") : w.slice(0, n).join(" ") + "…";
  }

  function effects(raw) {
    var out = {};
    METERS.forEach(function (k) {
      var v = Math.round(Number(raw && raw[k]) || 0);
      v = Math.max(-20, Math.min(20, v));
      if (v) out[k] = v;
    });
    return Object.keys(out).length >= 1 ? out : null;
  }

  function side(raw) {
    if (!raw) return null;
    var fx = effects(raw.effects);
    if (!fx) return null;
    return {
      effects: fx,
      setFlags: Array.isArray(raw.setFlags) ? raw.setFlags.filter(function (f) { return typeof f === "string"; }).slice(0, 3) : [],
      clearFlags: [],
      setLegacy: [],
      feedback: words(raw.feedback, 20),
      quote: words(raw.quote, 14)
    };
  }

  /** Client-side guard (the server already validates); returns a safe card or null. */
  function validate(raw) {
    try {
      if (!raw || typeof raw !== "object" || !raw.name || !raw.dilemma) return null;
      var heaven = side(raw.heaven);
      var hell = side(raw.hell);
      if (!heaven || !hell) return null;
      var id = String(raw.id || raw.name).toLowerCase().replace(/[^a-z0-9_]+/g, "_").slice(0, 48);
      if (id.indexOf("ai_") !== 0) id = "ai_" + id;
      while (seenIds[id]) id += "_" + Math.random().toString(36).slice(2, 5);
      seenIds[id] = true;
      var ma = raw.moralAnalysis || {};
      return {
        id: id,
        tier: [1, 2, 3].indexOf(Number(raw.tier)) >= 0 ? Number(raw.tier) : 2,
        archetype: ARCHETYPES.indexOf(raw.archetype) >= 0 ? raw.archetype : ARCHETYPES[Math.floor(Math.random() * ARCHETYPES.length)],
        name: words(raw.name, 6),
        age: Math.max(1, Math.min(120, Math.round(Number(raw.age) || 40))),
        title: words(raw.title, 6),
        dilemma: words(raw.dilemma, 28),
        virtue: words(raw.virtue, 12),
        sin: words(raw.sin, 12),
        speaker: "soul",
        once: true,
        weight: 1,
        heaven: heaven,
        hell: hell,
        hiddenFact: words(raw.hiddenFact, 30),
        moralAnalysis: { intent: words(ma.intent, 6), consequences: words(ma.consequences, 8) },
        ai: true
      };
    } catch (e) {
      return null;
    }
  }

  function safeCtx(ctx) {
    ctx = ctx || {};
    var meters = {};
    var src = ctx.meters || (window.meterSystem && window.meterSystem.values && window.meterSystem.values()) || {};
    METERS.forEach(function (k) { meters[k] = Number(src[k]) || 50; });
    return {
      meters: meters,
      flags: Array.isArray(ctx.flags) ? ctx.flags.slice(0, 12) : [],
      soulsJudged: Number(ctx.soulsJudged) || 0,
      recentIds: Array.isArray(ctx.recentIds) ? ctx.recentIds.slice(-10) : [],
      history: Array.isArray(ctx.history) ? ctx.history.slice(-8).map(function (h) { return { name: String(h.name || "").slice(0, 60), side: h.side === "HELL" ? "HELL" : "HEAVEN" }; }) : []
    };
  }

  function prefetch(ctx) {
    try {
      if (!available || failures >= 3) return;
      // Fast 5s rounds eat souls quicker than one request produces them: fill the queue in parallel
      var body = safeCtx(ctx);
      while (queue.length + inflight < QUEUE_MAX) {
        inflight++;
        post("/api/soul", body, 25000).then(function (data) {
          inflight--;
          var card = data && validate(data.card);
          if (card) { failures = 0; if (queue.length < QUEUE_MAX) queue.push(card); }
          else failures++;
        }, function () { inflight--; failures++; });
      }
    } catch (e) { /* never throw */ }
  }

  function take() {
    return queue.length ? queue.shift() : null;
  }

  function tribunal(summary) {
    if (!available) return Promise.resolve(null);
    return post("/api/tribunal", summary || {}, 5000).then(function (data) {
      var text = data && typeof data.text === "string" ? data.text.trim() : "";
      return text || null;
    }, function () { return null; });
  }

  // One-time availability probe (2s timeout). Only works when served by server.js with OPENAI_API_KEY.
  var ready = (typeof fetch === "function" && typeof location !== "undefined" && (/^https?:$/.test(location.protocol) || window.CELESTAI_API_BASE))
    ? fetchJson("/api/health", { cache: "no-store" }, 2000).then(function (d) { available = !!(d && d.ai === true); return available; })
    : Promise.resolve(false);
  // Warm the queue while the player is still in the menu so the first soul is AI-written too
  ready.then(function (ok) { if (ok) prefetch({}); });

  window.aiSouls = {
    isAvailable: function () { return available; },
    ready: ready,
    prefetch: prefetch,
    take: take,
    tribunal: tribunal,
    queueSize: function () { return queue.length; },
    _validate: validate
  };
})();
