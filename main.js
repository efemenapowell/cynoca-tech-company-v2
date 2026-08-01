/* ==========================================================
   cynoca — main.js
   Core site functionality: nav, reveal, tilt, forms, cursor
   ========================================================== */

"use strict";

/* ── Scroll Progress Bar ───────────────────────────────── */
(function scrollProgress() {
  const bar = document.querySelector(".scroll-progress");
  if (!bar) return;
  window.addEventListener(
    "scroll",
    () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = total > 0 ? (scrolled / total) * 100 + "%" : "0%";
    },
    { passive: true },
  );
})();

/* ── Sticky Nav ────────────────────────────────────────── */
(function navSetup() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!nav) return;

  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("scrolled", window.scrollY > 60);
    },
    { passive: true },
  );

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }),
    );
  }

  // Highlight active nav link based on current page
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (
      href &&
      (href === currentPage || (currentPage === "" && href === "index.html"))
    ) {
      a.classList.add("active");
    }
  });
})();

/* ── Reveal on Scroll (IntersectionObserver) ───────────── */
(function revealSetup() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  items.forEach((el) => io.observe(el));
})();

/* ── 3D Tilt on Cards ──────────────────────────────────── */
(function tiltSetup() {
  const cards = document.querySelectorAll(".tilt-card");
  const MAX_TILT = 8;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reduceMotion) return;

  cards.forEach((card) => {
    card.style.transformStyle = "preserve-3d";
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      const rx = (-py * MAX_TILT).toFixed(2);
      const ry = (px * MAX_TILT).toFixed(2);
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(700px) rotateX(0) rotateY(0) translateY(0)";
    });
  });
})();

/* ── Portfolio Filter ──────────────────────────────────── */
(function filterSetup() {
  const row = document.getElementById("filterRow");
  const cards = document.querySelectorAll("#workGrid .w-card");
  if (!row) return;

  row.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    row
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    cards.forEach((card) => {
      const match = filter === "all" || card.dataset.cat === filter;
      card.style.display = match ? "" : "none";
    });
  });
})();

/* ── Blog Category Filter ──────────────────────────────── */
(function blogFilterSetup() {
  const btns = document.querySelectorAll(".cat-btn");
  const cards = document.querySelectorAll(".blog-card[data-cat]");
  if (!btns.length) return;

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.cat;
      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.cat === filter;
        card.style.display = match ? "" : "none";
      });
    });
  });
})();

/* ── Contact Form ──────────────────────────────────────── */
(function formSetup() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (status) {
        status.textContent =
          "✓ Thanks — your message is in. We'll reply within one business day.";
        status.style.color = "var(--green)";
      }
      form.reset();
    });
  }

  const newsForm = document.getElementById("newsForm");
  if (newsForm) {
    newsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = newsForm.querySelector("input");
      if (input) {
        input.value = "";
        input.placeholder = "Subscribed ✓";
      }
    });
  }

  const nlForm = document.getElementById("newsletterForm");
  if (nlForm) {
    nlForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = nlForm.querySelector("input");
      const btn = nlForm.querySelector("button");
      if (input) input.value = "";
      if (btn) btn.textContent = "Subscribed ✓";
    });
  }
})();

/* ── Image Fallback ────────────────────────────────────── */
(function imageFallback() {
  document.querySelectorAll("img[data-fallback]").forEach((img) => {
    img.addEventListener(
      "error",
      () => {
        img.style.display = "none";
      },
      { once: true },
    );
  });
  document
    .querySelectorAll(
      ".w-thumb img, .feature-thumb img, .post-row-thumb img, .blog-card-thumb img",
    )
    .forEach((img) => {
      img.addEventListener(
        "error",
        () => {
          img.style.display = "none";
        },
        { once: true },
      );
    });
})();

/* ── Custom Cursor ─────────────────────────────────────── */
(function cursorSetup() {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (!dot || !ring) return;
  if (window.matchMedia("(pointer: coarse)").matches) {
    dot.style.display = ring.style.display = "none";
    return;
  }

  let mouseX = 0,
    mouseY = 0;
  let ringX = 0,
    ringY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Expand on interactive elements
  document
    .querySelectorAll("a, button, .btn, .card, .blog-card, .team-card")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => {
        dot.style.transform = "translate(-50%, -50%) scale(2)";
        ring.style.transform = "translate(-50%, -50%) scale(1.5)";
        ring.style.opacity = ".5";
      });
      el.addEventListener("mouseleave", () => {
        dot.style.transform = "translate(-50%, -50%) scale(1)";
        ring.style.transform = "translate(-50%, -50%) scale(1)";
        ring.style.opacity = "1";
      });
    });
})();

/* ── Animated Counter ──────────────────────────────────── */
(function counterSetup() {
  const nums = document.querySelectorAll(".stat-num[data-target]");
  if (!nums.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const dur = 1800;
        const start = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / dur, 1);
          // Ease out expo
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );

  nums.forEach((el) => io.observe(el));
})();

/* ── Page Transition ───────────────────────────────────── */
(function pageTransition() {
  const overlay = document.querySelector(".page-transition");
  if (!overlay) return;

  // Fade in on load
  overlay.classList.remove("active");

  document.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto") ||
      href.startsWith("tel") ||
      a.target === "_blank"
    )
      return;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      overlay.classList.add("active");
      setTimeout(() => {
        window.location.href = href;
      }, 380);
    });
  });
})();

/* ── Smooth Anchor Scroll ──────────────────────────────── */
(function smoothAnchor() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--nav-h",
          ),
          10,
        ) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();
