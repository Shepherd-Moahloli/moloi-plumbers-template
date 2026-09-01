// This file contains the main JavaScript functionality for the Moloi Plumbers CC homepage.

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the application
  initApp();
});

function initApp() {
  // Set up event listeners and any initial functionality
  setupEventListeners();

  // animate hero text on first paint
  animateHeroText();
}

function setupEventListeners() {
  // Example: Add click event for a contact button
  const contactButton = document.getElementById("contact-button");
  if (contactButton) {
    contactButton.addEventListener("click", () => {
      alert("Contact us at info@moloi-plumbers.co.za");
    });
  }
}

// add this helper to trigger the slide-in animation for the hero text
function animateHeroText() {
  const hero = document.querySelector(".hero-content");
  if (!hero) return;

  // ensure initial state applied before we add the class
  hero.classList.add("pre-slide");
  // use requestAnimationFrame + timeout so the browser registers the initial state
  requestAnimationFrame(() => {
    setTimeout(() => {
      hero.classList.add("slide-in-left");
      hero.classList.remove("pre-slide");
    }, 50);
  });
}

// Scroll reveal: directional reveal for items (left/right) — re-triggers when element re-enters viewport
(function () {
  if (!("IntersectionObserver" in window)) {
    document
      .querySelectorAll(
        ".service-card, .areas-list li, .hero-content, .hero-image, .hero-image img, .qq-content, .why-choose .wc-text, .why-choose img, .why-choose .wc-image, .map-panel .map-wrap",
      )
      .forEach((el) => el.classList.add("in-view"));
    return;
  }

  // track scroll direction
  let lastY = window.pageYOffset;
  let scrollDir = "down";
  window.addEventListener(
    "scroll",
    () => {
      const y = window.pageYOffset;
      if (y > lastY) scrollDir = "down";
      else if (y < lastY) scrollDir = "up";
      lastY = y;
    },
    { passive: true },
  );

  const selectors = [
    ".hero-content",
    ".hero-image",
    ".hero-image img",
    ".service-card",
    ".qq-content",
    ".why-choose .wc-text",
    ".why-choose img", // <-- added: image inside the why-choose block
    ".why-choose .wc-image", // <-- added: alternate image container class
    ".areas-list li",
    ".map-panel .map-wrap",
  ];
  const elems = Array.from(document.querySelectorAll(selectors.join(", ")));

  // add baseline reveal state
  elems.forEach((el) => el.classList.add("reveal"));

  const viewportMid = () => window.innerWidth / 2;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;

        if (entry.isIntersecting) {
          // compute which side element sits on now (handles responsive)
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const baseSide = centerX < viewportMid() ? "left" : "right";

          // if scrolling down, animate from element side; if scrolling up, animate from opposite
          const effectiveSide =
            scrollDir === "down"
              ? baseSide
              : baseSide === "left"
                ? "right"
                : "left";

          el.classList.remove("reveal-from-left", "reveal-from-right");
          el.classList.add(
            effectiveSide === "left" ? "reveal-from-left" : "reveal-from-right",
          );

          // small stagger based on element index for a natural cascade
          const index = elems.indexOf(el);
          const delay = Math.min(420, index * 70);
          el.style.transitionDelay = `${delay}ms`;

          // show
          el.classList.add("in-view");
        } else {
          // element left viewport — reset so it can animate again when re-entering
          el.classList.remove("in-view");
          el.style.transitionDelay = "";
          el.classList.remove("reveal-from-left", "reveal-from-right");
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.12,
    },
  );

  elems.forEach((el) => observer.observe(el));

  // recalc mid on resize to keep side detection accurate
  window.addEventListener(
    "resize",
    () => {
      // no state required here; viewportMid() uses current width
    },
    { passive: true },
  );
})();
