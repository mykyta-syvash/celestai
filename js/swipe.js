/**
 * CELESTAI swipe-to-judge card controller. OWNER: swipe/UI agent.
 * Exposes window.swipeController — see module contract.
 *
 * Drag #story-card LEFT = HEAVEN, RIGHT = HELL (Reigns-style).
 * Talks to the core only through guarded contract calls:
 *   window.game.state, window.game.handleDecision(side), window.game.previewDecision(side|null)
 * Listens to: "celestai:soul" (reset + enable), "celestai:verdict" (disable), "celestai:run-end".
 */
(function () {
  "use strict";

  var COMMIT_RATIO = 0.32;   // |dx| > 32% of card width commits
  var PREVIEW_RATIO = 0.12;  // |dx| > 12% previews meter impact
  var FLICK_VELOCITY = 0.6;  // px/ms
  var FLICK_MIN_DX = 30;     // px, a flick must still travel a little
  var MAX_ROTATE = 12;       // deg
  var FLY_MS = 280;
  var SPRING_MS = 260;
  var STORAGE_KEY = "celestai_swiped";

  var reducedMotionMq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  function reducedMotion() { return !!(reducedMotionMq && reducedMotionMq.matches); }

  var card = null, labelHeaven = null, labelHell = null, hintEl = null;
  var enabled = true;
  var drag = null;          // { id, x0, y0, dx, t, lastX, lastT, vx, width, locked }
  var flown = false;        // card has flown off-screen, waiting for next soul
  var previewSide = null;
  var settleTimer = null;

  function isJudging() {
    return !!(window.game && window.game.state === "JUDGING");
  }

  function setPreview(side) {
    if (side === previewSide) return;
    previewSide = side;
    try { window.game?.previewDecision?.(side); } catch (e) { /* core not ready */ }
  }

  function setLabels(dx, width) {
    var p = Math.min(1, Math.abs(dx) / Math.max(1, width * COMMIT_RATIO));
    if (labelHeaven) labelHeaven.style.opacity = dx < 0 ? String(p) : "0";
    if (labelHell) labelHell.style.opacity = dx > 0 ? String(p) : "0";
    if (card) {
      card.classList.toggle("swipe-armed-heaven", dx < 0 && p >= 1);
      card.classList.toggle("swipe-armed-hell", dx > 0 && p >= 1);
    }
  }

  function applyTransform(dx, dy, transition) {
    if (!card) return;
    var width = card.offsetWidth || 300;
    var rot = reducedMotion() ? 0 : Math.max(-MAX_ROTATE, Math.min(MAX_ROTATE, (dx / width) * MAX_ROTATE * 1.6));
    card.style.transition = transition || "none";
    card.style.transform = "translate3d(" + dx + "px," + (dy || 0) + "px,0) rotate(" + rot + "deg)";
  }

  function clearSettle() {
    if (settleTimer) { clearTimeout(settleTimer); settleTimer = null; }
  }

  function reset() {
    clearSettle();
    drag = null;
    flown = false;
    setPreview(null);
    if (!card) return;
    card.classList.remove("swipe-dragging", "swipe-flying", "swipe-armed-heaven", "swipe-armed-hell");
    card.style.transition = "none";
    card.style.transform = "";
    card.style.opacity = "";
    setLabels(0, 1);
    // re-trigger entrance animation
    card.classList.remove("swipe-enter");
    void card.offsetWidth;
    if (!reducedMotion()) card.classList.add("swipe-enter");
  }

  function setEnabled(v) {
    enabled = !!v;
    if (card) card.classList.toggle("swipe-disabled", !enabled);
    if (!enabled && drag) springBack();
  }

  function springBack() {
    var wasDrag = drag;
    drag = null;
    setPreview(null);
    if (!card) return;
    card.classList.remove("swipe-dragging", "swipe-armed-heaven", "swipe-armed-hell");
    setLabels(0, 1);
    if (!wasDrag && !card.style.transform) return;
    applyTransform(0, 0, reducedMotion() ? "none" : "transform " + SPRING_MS + "ms cubic-bezier(0.18, 0.89, 0.32, 1.28)");
    clearSettle();
    settleTimer = setTimeout(function () {
      if (card && !flown) { card.style.transition = ""; card.style.transform = ""; }
    }, SPRING_MS + 20);
  }

  function flyOut(side, fromDx) {
    if (!card) return;
    flown = true;
    clearSettle();
    card.classList.remove("swipe-dragging", "swipe-armed-heaven", "swipe-armed-hell");
    card.classList.add("swipe-flying");
    var dir = side === "HEAVEN" ? -1 : 1;
    var width = card.offsetWidth || 300;
    var distance = (window.innerWidth || 400) + width;
    var target = dir * distance;
    if (typeof fromDx === "number" && Math.sign(fromDx) === dir) target = dir * Math.max(distance, Math.abs(fromDx) + distance * 0.6);
    if (reducedMotion()) {
      card.style.transition = "opacity 160ms linear";
      card.style.opacity = "0";
    } else {
      applyTransform(target, 40, "transform " + FLY_MS + "ms cubic-bezier(0.4, 0, 1, 1), opacity " + FLY_MS + "ms linear");
      card.style.opacity = "0";
    }
  }

  function markSwiped() {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch (e) { /* private mode */ }
    if (hintEl) hintEl.hidden = true;
  }

  function commit(side) {
    var dx = drag ? drag.dx : 0;
    drag = null;
    setPreview(null);
    try { navigator.vibrate?.(15); } catch (e) { /* unsupported */ }
    markSwiped();
    flyOut(side, dx);
    // Decide immediately so the core timer stops; the fly-out is purely visual.
    try { window.game?.handleDecision?.(side); } catch (e) { console.error("[swipe] handleDecision failed", e); }
  }

  // ---------- pointer handlers ----------
  function onDown(e) {
    if (!enabled || flown || drag) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (!isJudging()) return;
    clearSettle();
    drag = {
      id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0,
      lastX: e.clientX, lastT: performance.now(), vx: 0,
      width: card.offsetWidth || 300, locked: false
    };
    try { card.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  }

  function onMove(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x0;
    var dy = e.clientY - drag.y0;
    if (!drag.locked) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      drag.locked = true;
      card.classList.add("swipe-dragging");
    }
    if (!isJudging()) { springBack(); return; }
    e.preventDefault();
    var now = performance.now();
    var dt = Math.max(1, now - drag.lastT);
    drag.vx = 0.7 * ((e.clientX - drag.lastX) / dt) + 0.3 * drag.vx;
    drag.lastX = e.clientX;
    drag.lastT = now;
    drag.dx = dx;
    applyTransform(dx, dy * 0.15);
    setLabels(dx, drag.width);
    if (Math.abs(dx) > drag.width * PREVIEW_RATIO) setPreview(dx < 0 ? "HEAVEN" : "HELL");
    else setPreview(null);
  }

  function onUp(e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.locked) { drag = null; release(e); return; } // plain tap
    var dx = drag.dx;
    // velocity decays if the finger paused before release
    var vx = performance.now() - drag.lastT > 80 ? 0 : drag.vx;
    var farEnough = Math.abs(dx) > drag.width * COMMIT_RATIO;
    var flick = Math.abs(vx) > FLICK_VELOCITY && Math.abs(dx) > FLICK_MIN_DX && Math.sign(vx) === Math.sign(dx);
    if ((farEnough || flick) && isJudging() && enabled) {
      commit(dx < 0 ? "HEAVEN" : "HELL");
    } else {
      springBack();
    }
    release(e);
  }

  function release(e) {
    try { if (card.hasPointerCapture?.(e.pointerId)) card.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  }

  function onCancel(e) {
    if (!drag || e.pointerId !== drag.id) return;
    springBack();
  }

  // ---------- contract events ----------
  function onSoul() { reset(); setEnabled(true); }
  function onVerdict(e) {
    setEnabled(false);
    var side = e && e.detail && e.detail.side;
    // Keyboard / button verdicts also send the card off in that direction.
    if (!flown && (side === "HEAVEN" || side === "HELL")) { drag = null; setPreview(null); flyOut(side); }
  }
  function onRunEnd() { setEnabled(false); drag = null; setPreview(null); }

  function init() {
    card = document.getElementById("story-card");
    if (!card) return;
    labelHeaven = card.querySelector(".swipe-label-heaven");
    labelHell = card.querySelector(".swipe-label-hell");
    hintEl = document.getElementById("swipe-hint");
    var swiped = false;
    try { swiped = localStorage.getItem(STORAGE_KEY) === "1"; } catch (e) { /* ignore */ }
    if (hintEl) hintEl.hidden = swiped;

    card.addEventListener("pointerdown", onDown);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerup", onUp);
    card.addEventListener("pointercancel", onCancel);
    card.addEventListener("lostpointercapture", onCancel);
    card.addEventListener("dragstart", function (e) { e.preventDefault(); });

    window.addEventListener("celestai:soul", onSoul);
    window.addEventListener("celestai:verdict", onVerdict);
    window.addEventListener("celestai:run-end", onRunEnd);

    // Fallback if the core doesn't dispatch "celestai:soul": a new dilemma text means a new soul.
    var dilemma = document.getElementById("story-dilemma");
    if (dilemma && window.MutationObserver) {
      new MutationObserver(function () { if (flown || card.style.transform) { reset(); setEnabled(true); } })
        .observe(dilemma, { childList: true, characterData: true, subtree: true });
    }
  }

  window.swipeController = {
    reset: reset,
    setEnabled: setEnabled,
    // exposed for tests / debugging
    _commitRatio: COMMIT_RATIO,
    _previewRatio: PREVIEW_RATIO
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
