/* ==========================================================
   CYNOCA — animations.js
   Anime.js-powered animations: hero, scroll, stagger, particles
   ========================================================== */

"use strict";

/* ── Wait for anime.js to load ─────────────────────────── */
function waitForAnime(cb) {
  if (typeof anime !== "undefined") {
    cb();
    return;
  }
  const t = setInterval(() => {
    if (typeof anime !== "undefined") {
      clearInterval(t);
      cb();
    }
  }, 50);
}

/* ── Hero Word Entrance ────────────────────────────────── */
function initHeroAnimation() {
  const word = document.querySelector(".intro-word");
  if (!word) return;

  anime({
    targets: word,
    opacity: [0, 1],
    translateY: [60, 0],
    duration: 1200,
    easing: "easeOutExpo",
    delay: 200,
  });

  // Scatter tags stagger
  const scItems = document.querySelectorAll(".sc");
  if (scItems.length) {
    anime({
      targets: scItems,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      easing: "easeOutExpo",
      delay: anime.stagger(80, { start: 600 }),
    });
  }

  // Corner tag
  const cornerTag = document.querySelector(".intro-corner-tag");
  if (cornerTag) {
    anime({
      targets: cornerTag,
      opacity: [0, 1],
      translateX: [-20, 0],
      duration: 700,
      easing: "easeOutExpo",
      delay: 100,
    });
  }

  // Hero foot
  const foot = document.querySelector(".intro-foot");
  if (foot) {
    anime({
      targets: foot,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      easing: "easeOutExpo",
      delay: 900,
    });
  }
}

/* ── Stats Counter Animation ───────────────────────────── */
function initStatsAnimation() {
  const stats = document.querySelectorAll(".stat-num");
  if (!stats.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target || el.textContent, 10);
        if (isNaN(target)) return;

        anime({
          targets: el,
          innerHTML: [0, target],
          round: 1,
          duration: 1800,
          easing: "easeOutExpo",
          update: function (anim) {
            el.textContent = Math.round(anim.animations[0].currentValue);
          },
        });
        io.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );

  stats.forEach((el) => io.observe(el));
}

/* ── Section Heading Entrance ──────────────────────────── */
function initSectionHeadings() {
  const heads = document.querySelectorAll(".section-head");
  if (!heads.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        anime({
          targets: el.querySelectorAll(".eyebrow, h2, .section-sub"),
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 900,
          easing: "easeOutExpo",
          delay: anime.stagger(120),
        });
        io.unobserve(el);
      });
    },
    { threshold: 0.2 },
  );

  heads.forEach((el) => io.observe(el));
}

/* ── Card Grid Stagger ─────────────────────────────────── */
function initCardStagger() {
  const grids = document.querySelectorAll(
    ".features-grid, .card-grid, .work-grid, .testimonials-grid, .blog-grid, .team-grid, .values-grid",
  );
  if (!grids.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const cards = entry.target.querySelectorAll(":scope > *");

        anime({
          targets: cards,
          opacity: [0, 1],
          translateY: [40, 0],
          scale: [0.95, 1],
          duration: 800,
          easing: "easeOutExpo",
          delay: anime.stagger(80),
        });
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.1 },
  );

  grids.forEach((el) => io.observe(el));
}

/* ── Floating Particles Canvas ─────────────────────────── */
function initParticleCanvas() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let W = canvas.offsetWidth;
  let H = canvas.offsetHeight;
  canvas.width = W;
  canvas.height = H;

  const COUNT = 60;
  const particles = Array.from({ length: COUNT }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    a: Math.random() * 0.5 + 0.1,
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(61,99,255,${p.a})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(61,99,255,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener("resize", () => {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;
  });
}

/* ── Marquee Pause on Hover ────────────────────────────── */
function initMarquee() {
  const track = document.querySelector(".marquee-track");
  if (!track) return;
  const wrap = track.closest(".marquee");
  if (!wrap) return;
  wrap.addEventListener("mouseenter", () => {
    track.style.animationPlayState = "paused";
  });
  wrap.addEventListener("mouseleave", () => {
    track.style.animationPlayState = "running";
  });
}

/* ── Scroll-triggered Line Draw (SVG) ─────────────────── */
function initSVGDraw() {
  const paths = document.querySelectorAll(".draw-on-scroll");
  if (!paths.length) return;

  paths.forEach((path) => {
    const len = path.getTotalLength ? path.getTotalLength() : 1000;
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const path = entry.target;
        const len = path.getTotalLength ? path.getTotalLength() : 1000;
        anime({
          targets: path,
          strokeDashoffset: [len, 0],
          duration: 1800,
          easing: "easeInOutSine",
        });
        io.unobserve(path);
      });
    },
    { threshold: 0.3 },
  );

  paths.forEach((p) => io.observe(p));
}

/* ── CTA Section Entrance ──────────────────────────────── */
function initCTAAnimation() {
  const cta = document.querySelector(".cta-inner");
  if (!cta) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        anime({
          targets: cta,
          opacity: [0, 1],
          scale: [0.96, 1],
          duration: 900,
          easing: "easeOutExpo",
        });
        anime({
          targets: cta.querySelectorAll("h2, p, .cta-actions"),
          opacity: [0, 1],
          translateY: [24, 0],
          duration: 800,
          easing: "easeOutExpo",
          delay: anime.stagger(100, { start: 200 }),
        });
        io.unobserve(cta);
      });
    },
    { threshold: 0.3 },
  );

  io.observe(cta);
}

/* ── Team Card Hover Glow ──────────────────────────────── */
function initTeamHover() {
  document.querySelectorAll(".team-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      anime({
        targets: card,
        boxShadow: [
          "0 4px 24px rgba(0,0,0,0.4)",
          "0 0 0 1px rgba(61,99,255,0.25), 0 20px 60px -20px rgba(61,99,255,0.4)",
        ],
        duration: 300,
        easing: "easeOutQuad",
      });
    });
    card.addEventListener("mouseleave", () => {
      anime({
        targets: card,
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        duration: 400,
        easing: "easeOutQuad",
      });
    });
  });
}

/* ── Blog Card Hover ───────────────────────────────────── */
function initBlogHover() {
  document
    .querySelectorAll(".blog-card, .blog-featured-card")
    .forEach((card) => {
      card.addEventListener("mouseenter", () => {
        anime({
          targets: card.querySelector("h2, h3"),
          color: "#ffffff",
          duration: 200,
          easing: "easeOutQuad",
        });
      });
      card.addEventListener("mouseleave", () => {
        anime({
          targets: card.querySelector("h2, h3"),
          color: "#f0f0f0",
          duration: 300,
          easing: "easeOutQuad",
        });
      });
    });
}

/* ── Timeline Entrance ─────────────────────────────────── */
function initTimeline() {
  const items = document.querySelectorAll(".timeline-item");
  if (!items.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const idx = Array.from(items).indexOf(el);
        const isEven = idx % 2 === 0;

        anime({
          targets: el.querySelector(".timeline-content"),
          opacity: [0, 1],
          translateX: [isEven ? -30 : 30, 0],
          duration: 700,
          easing: "easeOutExpo",
          delay: idx * 80,
        });
        anime({
          targets: el.querySelector(".timeline-dot"),
          scale: [0, 1],
          duration: 400,
          easing: "easeOutBack",
          delay: idx * 80 + 200,
        });
        io.unobserve(el);
      });
    },
    { threshold: 0.3 },
  );

  items.forEach((el) => io.observe(el));
}

/* ── Three.js Hero Model ───────────────────────────────── */
function initHeroModel() {
  const container = document.getElementById("hero-canvas");
  if (!container || typeof THREE === "undefined") return;

  let width = container.clientWidth;
  let height = container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  // Outer wireframe
  const outerGeo = new THREE.IcosahedronGeometry(2.35, 0);
  const outerEdges = new THREE.EdgesGeometry(outerGeo);
  const outerMat = new THREE.LineBasicMaterial({
    color: 0x3d63ff,
    transparent: true,
    opacity: 0.9,
  });
  group.add(new THREE.LineSegments(outerEdges, outerMat));

  // Middle layer
  const midGeo = new THREE.DodecahedronGeometry(1.55, 0);
  const midEdges = new THREE.EdgesGeometry(midGeo);
  const midMat = new THREE.LineBasicMaterial({
    color: 0x7c5cff,
    transparent: true,
    opacity: 0.85,
  });
  const midMesh = new THREE.LineSegments(midEdges, midMat);
  group.add(midMesh);

  // Core
  const coreGeo = new THREE.IcosahedronGeometry(0.72, 1);
  const coreFillMat = new THREE.MeshBasicMaterial({
    color: 0xc7cbd6,
    transparent: true,
    opacity: 0.22,
  });
  const coreFill = new THREE.Mesh(coreGeo, coreFillMat);
  const coreEdges = new THREE.EdgesGeometry(coreGeo);
  const coreLineMat = new THREE.LineBasicMaterial({
    color: 0xd6dae6,
    transparent: true,
    opacity: 0.95,
  });
  const coreLines = new THREE.LineSegments(coreEdges, coreLineMat);
  group.add(coreFill, coreLines);

  // Nodes
  const nodeGeo = new THREE.SphereGeometry(0.045, 8, 8);
  const nodeMat = new THREE.MeshBasicMaterial({ color: 0xd6dae6 });
  const outerPos = outerGeo.attributes.position;
  const seen = new Set();
  for (let i = 0; i < outerPos.count; i += 3) {
    const x = outerPos.getX(i),
      y = outerPos.getY(i),
      z = outerPos.getZ(i);
    const key = `${x.toFixed(2)}_${y.toFixed(2)}_${z.toFixed(2)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    node.position.set(x, y, z);
    group.add(node);
  }

  // Particles
  const pCount = 140;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const r = 3.3 + Math.random() * 1.6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pPos[i * 3 + 2] = r * Math.cos(phi);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xa8b0d8,
    size: 0.032,
    transparent: true,
    opacity: 0.65,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Drag interaction
  const dom = renderer.domElement;
  dom.style.touchAction = "none";
  dom.style.cursor = "grab";
  let isDragging = false,
    prevX = 0,
    prevY = 0,
    dragVelX = 0,
    dragVelY = 0;

  dom.addEventListener("pointerdown", (e) => {
    isDragging = true;
    dom.setPointerCapture(e.pointerId);
    dom.style.cursor = "grabbing";
    prevX = e.clientX;
    prevY = e.clientY;
  });
  dom.addEventListener("pointerup", () => {
    isDragging = false;
    dom.style.cursor = "grab";
  });
  dom.addEventListener("pointercancel", () => {
    isDragging = false;
    dom.style.cursor = "grab";
  });
  dom.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - prevX,
      dy = e.clientY - prevY;
    prevX = e.clientX;
    prevY = e.clientY;
    dragVelX = dx * 0.006;
    dragVelY = dy * 0.006;
    group.rotation.y += dragVelX;
    group.rotation.x += dragVelY;
  });

  // Parallax
  let targetX = 0,
    targetY = 0;
  const heroSection = document.getElementById("home");
  if (heroSection) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.9;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.5;
    });
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  (function tick() {
    requestAnimationFrame(tick);
    if (!isDragging && !reduceMotion) {
      group.rotation.y += 0.0016 + dragVelX * 0.02;
      group.rotation.x += 0.0006;
      dragVelX *= 0.92;
      dragVelY *= 0.92;
    }
    if (!reduceMotion) {
      camera.position.x += (targetX - camera.position.x) * 0.03;
      camera.position.y += (-targetY - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      midMesh.rotation.y -= 0.0045;
      midMesh.rotation.x += 0.0015;
      coreLines.rotation.x += 0.012;
      coreLines.rotation.y += 0.008;
      coreFill.rotation.y += 0.006;
      particles.rotation.y += 0.0007;
    }
    renderer.render(scene, camera);
  })();

  window.addEventListener("resize", () => {
    width = container.clientWidth;
    height = container.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

/* ── Init All ──────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reduceMotion) return;

  waitForAnime(() => {
    initHeroAnimation();
    initStatsAnimation();
    initSectionHeadings();
    initCardStagger();
    initCTAAnimation();
    initTeamHover();
    initBlogHover();
    initTimeline();
    initSVGDraw();
  });

  initParticleCanvas();
  initMarquee();
  initHeroModel();
});
