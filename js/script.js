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
        ? '0 1px 0 oklch(76% 0.015 85)'
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
