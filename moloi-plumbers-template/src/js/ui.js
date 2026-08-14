// This file handles user interface interactions, such as animations, modal pop-ups, and dynamic content updates.

document.addEventListener("DOMContentLoaded", function () {
  // Initialize UI components
  initUI();

  // Event listeners for buttons or interactive elements
  const contactButton = document.getElementById("contact-button");
  if (contactButton) {
    contactButton.addEventListener("click", function () {
      openContactModal();
    });
  }
});

function initUI() {
  // Add any UI initialization code here
}

function openContactModal() {
  // Code to open a contact modal
  const modal = document.getElementById("contact-modal");
  if (modal) {
    modal.style.display = "block";
  }
}

// Close modal when clicking outside of it
window.addEventListener("click", function (event) {
  const modal = document.getElementById("contact-modal");
  if (modal && event.target === modal) {
    modal.style.display = "none";
  }
});

// Hero slider: cycles slides left → right every 3 seconds
(function () {
  const slidesEl = document.querySelector(".hero-slides");
  if (!slidesEl) return;

  // keep DOM left-to-right order; only element children
  const slides = Array.from(slidesEl.children).filter((n) => n.nodeType === 1);
  const total = slides.length;
  if (total <= 1) return;

  let idx = 0;
  const intervalMs = 3000; // 3 seconds
  let timer = null;

  // ensure starting transform and smooth animation
  slidesEl.style.transform = "translateX(0%)";
  slidesEl.style.transition = "transform 0.6s ease";

  function goTo(i) {
    idx = ((i % total) + total) % total;
    slidesEl.style.transform = `translateX(-${idx * 100}%)`;
  }

  function start() {
    stop();
    // decrement index on each tick to produce left → right motion
    timer = setInterval(() => goTo(idx - 1), intervalMs);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // pause on hover, resume on leave
  slidesEl.addEventListener("mouseenter", stop);
  slidesEl.addEventListener("mouseleave", start);

  // keep layout correct on resize
  window.addEventListener("resize", () => goTo(idx));

  // wait one interval before the first automatic move (3s)
  setTimeout(start, intervalMs);
})();
