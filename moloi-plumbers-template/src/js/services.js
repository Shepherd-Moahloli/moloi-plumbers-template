// This file manages the loading and display of service data from the services.json file, allowing for dynamic updates to the services section.

document.addEventListener("DOMContentLoaded", () => {
  fetchServices();
});

async function fetchServices() {
  const paths = [
    "./data/services.json",
    "../data/services.json",
    "data/services.json",
    "/data/services.json",
  ];

  let lastError = null;
  for (const p of paths) {
    try {
      console.info(`services: attempting to fetch ${p}`);
      const res = await fetch(p);
      if (!res.ok) {
        lastError = new Error(`HTTP ${res.status} for ${p}`);
        console.warn(`services: ${lastError.message}`);
        continue;
      }
      const data = await res.json();
      console.info(`services: loaded ${p}`);
      return displayServices(data);
    } catch (err) {
      lastError = err;
      console.warn(`services: fetch failed for ${p}:`, err);
    }
  }

  console.error("services: all fetch attempts failed", lastError);
}

function displayServices(data) {
  // debug raw payload to confirm shape
  console.debug("services: raw data:", data);

  const servicesContainer = document.querySelector(".service-grid");
  if (!servicesContainer) {
    console.warn("services: .service-grid not found, skipping render");
    return;
  }

  // normalize incoming JSON: accept either an array or an object with `services` / `items`
  const normalized = Array.isArray(data)
    ? data
    : Array.isArray(data && data.services)
      ? data.services
      : Array.isArray(data && data.items)
        ? data.items
        : [];

  console.info(`services: loaded ${normalized.length} items (normalized)`);

  // expose data for optional external renderer or listeners
  const detail = { raw: data, normalized, container: servicesContainer };
  try {
    const loadedEvent = new CustomEvent("services:loaded", { detail });
    if (typeof window !== "undefined") window.dispatchEvent(loadedEvent);
  } catch (e) {
    // ignore environments that don't support CustomEvent constructor
  }

  const findRenderer = () => {
    try {
      if (
        typeof globalThis !== "undefined" &&
        typeof globalThis.renderServicesMarkup === "function"
      )
        return globalThis.renderServicesMarkup;
      if (
        typeof window !== "undefined" &&
        typeof window.renderServicesMarkup === "function"
      )
        return window.renderServicesMarkup;
      if (
        typeof self !== "undefined" &&
        typeof self.renderServicesMarkup === "function"
      )
        return self.renderServicesMarkup;
    } catch (e) {
      console.debug("services: renderer detection error", e);
    }
    return null;
  };

  let renderer = findRenderer();

  if (typeof renderer !== "function") {
    console.warn(
      "services: renderServicesMarkup not found, using fallback renderer",
    );

    // Only replace markup if the services container is empty.
    // This preserves the static HTML on index.html and prevents
    // the script from wiping images intermittently.
    const containerEmpty =
      !servicesContainer || servicesContainer.innerHTML.trim() === "";
    if (containerEmpty) {
      servicesContainer.innerHTML = dataToSimpleMarkup(normalized);
    } else {
      console.info(
        "services: static markup detected, not replacing existing content",
      );
    }

    // Poll briefly in case a renderer is defined right after this script runs (e.g. script order timing)
    const maxMs = 2000;
    const intervalMs = 200;
    let waited = 0;
    const poll = setInterval(() => {
      renderer = findRenderer();
      if (typeof renderer === "function") {
        try {
          // Only let a late renderer overwrite if the container is still empty
          if (servicesContainer.innerHTML.trim() === "") {
            servicesContainer.innerHTML =
              renderer(data) ||
              renderer(normalized) ||
              dataToSimpleMarkup(normalized);
            console.info(
              "services: rendered by late-registered renderServicesMarkup",
            );
          } else {
            console.info(
              "services: late renderer found but static content present — skipping overwrite",
            );
          }
        } catch (err) {
          console.error("services: late renderer failed:", err);
          if (servicesContainer.innerHTML.trim() === "") {
            servicesContainer.innerHTML = dataToSimpleMarkup(normalized);
          }
        } finally {
          clearInterval(poll);
        }
      } else if ((waited += intervalMs) >= maxMs) {
        clearInterval(poll);
      }
    }, intervalMs);

    return;
  }

  try {
    // Only allow a renderer to overwrite if the container is currently empty.
    // If the renderer returns an empty string, fall back to the simple markup.
    const containerEmpty = servicesContainer.innerHTML.trim() === "";
    if (!containerEmpty) {
      console.info(
        "services: static markup present, skipping renderer overwrite",
      );
    } else {
      const rendered =
        (renderer && (renderer(data) || renderer(normalized))) || "";
      if (typeof rendered === "string" && rendered.trim().length) {
        servicesContainer.innerHTML = rendered;
        console.info("services: rendered by renderServicesMarkup");
      } else {
        servicesContainer.innerHTML = dataToSimpleMarkup(normalized);
        console.info(
          "services: renderer produced empty output, used fallback markup",
        );
      }
    }
  } catch (err) {
    console.error("services: renderer failed, falling back:", err);
    servicesContainer.innerHTML = dataToSimpleMarkup(normalized);
  }
}

// replace existing dataToSimpleMarkup with this improved fallback
// filepath: /Users/mac/Library/Mobile Documents/com~apple~CloudDocs/2026 PROJECTS/14. PLUMBERS - TEMPLATE/moloi-plumbers-template/src/js/services.js
function dataToSimpleMarkup(data) {
  if (!Array.isArray(data)) return "<p>No services data</p>";
  return data
    .map((s) => {
      // accept several possible title keys
      const title = s.title || s.name || s.heading || s.service || "Untitled";
      const desc = s.description || s.desc || s.summary || "";
      return `<article class="service-card">
           <h3>${escapeHtml(String(title))}</h3>
           <p>${escapeHtml(String(desc))}</p>
         </article>`;
    })
    .join("");
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Ensure only the visible (opacity > 0.5) video plays to save CPU/bandwidth
document.addEventListener("DOMContentLoaded", function () {
  const videos = Array.from(document.querySelectorAll(".video-slide"));
  if (!videos.length) return;

  // try to play muted videos up front
  videos.forEach((v) => {
    v.muted = true;
    v.playsInline = true;
    v.pause();
  });

  const check = () => {
    videos.forEach((v) => {
      const op = parseFloat(getComputedStyle(v).opacity) || 0;
      if (op > 0.5) {
        if (v.paused) {
          v.play().catch(() => {});
        }
      } else {
        if (!v.paused) {
          v.pause();
        }
      }
    });
  };

  // run periodically to detect which slide is visible (sync with CSS animation)
  const interval = setInterval(check, 400);
  // run once immediately
  check();

  // clean up if page unloads
  window.addEventListener("beforeunload", () => {
    clearInterval(interval);
    videos.forEach((v) => v.pause());
  });
});
