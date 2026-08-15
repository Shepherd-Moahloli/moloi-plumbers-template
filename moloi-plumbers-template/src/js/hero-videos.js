// Simple video rotator: replace the URLs below with your actual video files (mp4/webm)
document.addEventListener("DOMContentLoaded", function () {
  const videos = [
    "assets/videos/bathroom-pipe-installation-motion.mp4",
    "assets/videos/drain-cleaning-motion.mp4",
    "assets/videos/installation-services-motion.mp4",
  ];

  const hero = document.querySelector('.hero-services[data-rotator="video"]');
  if (!hero) return;

  const container =
    hero.querySelector(".hero-bg") ||
    (() => {
      const el = document.createElement("div");
      el.className = "hero-bg";
      hero.appendChild(el);
      return el;
    })();

  // create layers
  const layers = videos.map((src, idx) => {
    const wrapper = document.createElement("div");
    wrapper.className = "bg-layer";
    wrapper.dataset.index = idx;

    const vid = document.createElement("video");
    vid.src = src;
    vid.autoplay = true;
    vid.muted = true;
    vid.playsInline = true;
    vid.loop = true;
    vid.preload = "auto";
    vid.setAttribute("aria-hidden", "true");
    wrapper.appendChild(vid);

    // ensure video begins trying to play
    vid.addEventListener("canplay", () => {
      vid.play().catch(() => {
        /* autoplay blocked */
      });
    });

    container.appendChild(wrapper);

    // try immediate play (best-effort)
    vid.play().catch(() => {
      /* ignore */
    });

    return wrapper;
  });

  let current = 0;
  // prepare first layer
  layers.forEach((l, i) => {
    l.classList.remove("active", "leaving", "enter-left");
    if (i === 0) {
      // show first: make it enter from left then become active immediately
      l.classList.add("enter-left");
      requestAnimationFrame(() => {
        void l.offsetWidth;
        l.classList.add("active");
        l.classList.remove("enter-left");
        // ensure the first video's playback is started
        const v = l.querySelector("video");
        if (v)
          v.play().catch(() => {
            /* ignore */
          });
      });
    } else {
      l.style.opacity = 0;
      l.style.transform = "translateX(100%)";
      const v = l.querySelector("video");
      if (v) {
        // keep paused until needed
        v.pause();
      }
    }
  });

  // cycle every 3 seconds
  const DURATION = 3000;
  setInterval(() => {
    const prev = current;
    current = (current + 1) % layers.length;
    const out = layers[prev];
    const incoming = layers[current];

    const incomingVideo = incoming.querySelector("video");
    const outgoingVideo = out.querySelector("video");

    // prepare incoming
    incoming.classList.remove("active", "leaving", "enter-left");
    incoming.classList.add("enter-left");
    incoming.style.zIndex = 3;

    if (incomingVideo) {
      try {
        incomingVideo.currentTime = 0;
      } catch (e) {}
      incomingVideo.muted = true;
      incomingVideo.play().catch(() => {
        /* autoplay blocked */
      });
    }

    // force reflow then move incoming to active (slides in)
    requestAnimationFrame(() => {
      void incoming.offsetWidth;
      incoming.classList.add("active");
      incoming.classList.remove("enter-left");
    });

    // mark outgoing to slide out to the right
    out.classList.remove("active", "enter-left");
    out.classList.add("leaving");

    // after transition finishes, reset outgoing to off-screen right and pause it
    setTimeout(() => {
      out.classList.remove("leaving");
      out.style.transform = "translateX(100%)";
      out.style.opacity = 0;
      out.style.zIndex = 0;
      // pause outgoing video to free resources
      if (outgoingVideo) {
        try {
          outgoingVideo.pause();
          outgoingVideo.currentTime = 0;
        } catch (e) {}
      }
      // remove inline z-index from incoming so CSS stacking rules apply cleanly
      incoming.style.zIndex = "";
    }, DURATION + 100);
  }, DURATION);
});
