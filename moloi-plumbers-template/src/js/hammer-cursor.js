// Global hammer cursor follower — shows the hammer everywhere except in form fields or elements with .no-hammer

(function () {
  if (typeof window === "undefined") return;
  // disable on touch devices
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

  const EXCLUDE =
    'input, textarea, select, [contenteditable="true"], .no-hammer';
  const hammer = document.createElement("div");
  hammer.id = "hammer-cursor";
  document.body.appendChild(hammer);

  let rafId = null;
  let mouseX = 0;
  let mouseY = 0;
  let visible = false;

  function show() {
    if (visible) return;
    visible = true;
    document.documentElement.classList.add("hammer-active");
    hammer.classList.add("knock");
    hammer.style.opacity = "1";
    startLoop();
  }

  function hide() {
    if (!visible) return;
    visible = false;
    hammer.classList.remove("knock");
    hammer.style.opacity = "0";
    document.documentElement.classList.remove("hammer-active");
    stopLoop();
  }

  function onMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // exclude when over inputs / contenteditable or opted-out elements
    const excluded = !!e.target.closest && e.target.closest(EXCLUDE);
    if (excluded) {
      hide();
    } else {
      show();
    }
  }

  function update() {
    hammer.style.left = mouseX + "px";
    hammer.style.top = mouseY + "px";
    rafId = requestAnimationFrame(update);
  }

  function startLoop() {
    if (!rafId) rafId = requestAnimationFrame(update);
  }
  function stopLoop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // global listeners
  document.addEventListener("mousemove", onMove, { passive: true });

  // hide on leaving window
  window.addEventListener("mouseout", (e) => {
    // relatedTarget null means left window
    if (!e.relatedTarget) hide();
  });

  // show/hide on keyboard focus for accessibility
  document.addEventListener("focusin", (e) => {
    const t = e.target;
    if (t && t.closest && t.closest(EXCLUDE)) {
      hide();
    } else {
      // position hammer near focused element
      const r = t.getBoundingClientRect ? t.getBoundingClientRect() : null;
      if (r) {
        mouseX = Math.round(r.left + r.width * 0.5);
        mouseY = Math.round(r.top + Math.min(24, r.height * 0.15));
      }
      show();
    }
  });
  document.addEventListener("focusout", (e) => {
    // restore hidden on blur
    hide();
  });

  // initial state: hidden until user moves mouse
  hide();
})();
