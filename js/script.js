/* ============================================================
   Sudip Ojha Portfolio — Site Interactions v3
   ============================================================ */

// ── Utility ────────────────────────────────────────────────
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

document.addEventListener('DOMContentLoaded', () => {

  // ── 1) Horizontal nav — mobile toggle ──────────────────
  const navToggle = $('#navToggle');
  const navDrawer = $('#navDrawer');

  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navDrawer.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navDrawer.contains(e.target)) {
        navDrawer.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on link click inside drawer
    $$('a', navDrawer).forEach(link => {
      link.addEventListener('click', () => {
        navDrawer.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── 2) Active nav link highlight ───────────────────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── 3) Scroll-reveal (IntersectionObserver) ────────────
  const revealEls = $$('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    revealEls.forEach(el => io.observe(el));
  }

  // ── 4) Navbar shrink on scroll ─────────────────────────
  const navbar = $('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 20
        ? '0 4px 32px rgba(0,0,0,0.35)'
        : 'none';
    }, { passive: true });
  }

  // ── 5) Card mouse-glow effect ──────────────────────────
  $$('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%';
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%';
      card.style.setProperty('--mouse-x', x);
      card.style.setProperty('--mouse-y', y);
    });
  });

  // ── 6) Footer year ─────────────────────────────────────
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});

// ── 7) Hero Canvas FX ──────────────────────────────────────
(function () {
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const canvas = document.getElementById('heroFX');
  if (!canvas || prefersReduced) return;

  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, nodes = [], mouse = { x: -9999, y: -9999 };
  let rafId, lastT = 0;
  const DPR = Math.min(2, window.devicePixelRatio || 1);

  const CFG = {
    density:     0.00012,
    maxLinkDist: 130,
    nodeR:       [1.0, 1.8],
    speed:       0.12,
    accentA:     'rgba(34,211,238,',
    accentB:     'rgba(167,139,250,',
    lineColor:   'rgba(200,220,255,0.06)',
  };

  function spawn() {
    const ang = Math.random() * Math.PI * 2;
    const sp = (0.3 + Math.random()) * CFG.speed * DPR;
    const r = CFG.nodeR[0] + Math.random() * (CFG.nodeR[1] - CFG.nodeR[0]);
    const cyan = Math.random() > 0.5;
    return { x: Math.random() * W, y: Math.random() * H, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, r: r * DPR, cyan };
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    W = Math.round(rect.width * DPR);
    H = Math.round(rect.height * DPR);
    canvas.width = W; canvas.height = H;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    const count = Math.round((W * H / (DPR * DPR)) * CFG.density);
    nodes = Array.from({ length: count }, spawn);
  }

  function step(t) {
    const dt = Math.min(32, t - lastT || 16); lastT = t;
    ctx.clearRect(0, 0, W, H);

    // Move nodes
    for (const n of nodes) {
      n.x += n.vx * dt * 0.05;
      n.y += n.vy * dt * 0.05;

      // Gentle mouse repulsion
      const dx = n.x - mouse.x * DPR;
      const dy = n.y - mouse.y * DPR;
      const d2 = dx * dx + dy * dy;
      const repR = 160 * DPR;
      if (d2 < repR * repR && d2 > 0) {
        const force = (1 - Math.sqrt(d2) / repR) * 0.3;
        n.x += (dx / Math.sqrt(d2)) * force;
        n.y += (dy / Math.sqrt(d2)) * force;
      }

      // Wrap
      if (n.x < -40) n.x = W + 40;
      if (n.x > W + 40) n.x = -40;
      if (n.y < -40) n.y = H + 40;
      if (n.y > H + 40) n.y = -40;
    }

    // Draw connections
    const md = CFG.maxLinkDist * DPR;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < md) {
          const alpha = (1 - d / md) * 0.5;
          ctx.strokeStyle = CFG.lineColor.replace('0.06', alpha.toFixed(3));
          ctx.lineWidth = DPR * 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (const n of nodes) {
      const alpha = 0.7 + 0.3 * Math.sin(t / 1500 + n.x);
      ctx.shadowBlur = 8 * DPR;
      ctx.shadowColor = n.cyan ? '#22d3ee' : '#a78bfa';
      ctx.fillStyle = (n.cyan ? CFG.accentA : CFG.accentB) + alpha.toFixed(2) + ')';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    rafId = requestAnimationFrame(step);
  }

  canvas.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  window.addEventListener('resize', resize, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(rafId); }
    else { lastT = 0; rafId = requestAnimationFrame(step); }
  });

  const init = () => { resize(); rafId = requestAnimationFrame(step); };
  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init, { once: true });
})();
