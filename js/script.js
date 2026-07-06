/* ============================================================
   Sudip Ojha Portfolio v7 — "Mission Control" interactions
   nav · menu · progress · reveal · spotlight · terminal ·
   particle network · live clocks · copy email
   ============================================================ */

const $  = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1) Nav: scrolled state ─────────────────────────────── */
  const nav = $('.nav');
  const onScrollNav = () => nav && nav.classList.toggle('scrolled', window.scrollY > 8);
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ── 2) Scroll progress bar ─────────────────────────────── */
  const progress = $('.progress');
  if (progress) {
    const onScrollProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    };
    onScrollProgress();
    window.addEventListener('scroll', onScrollProgress, { passive: true });
    window.addEventListener('resize', onScrollProgress, { passive: true });
  }

  /* ── 3) Mobile menu ─────────────────────────────────────── */
  const burger = $('#navToggle');
  const menu = $('#menu');
  if (burger && menu) {
    const setMenu = (open) => {
      menu.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
    $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false);
    });
  }

  /* ── 4) Active nav link ─────────────────────────────────── */
  const current = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav__link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (!href.includes('#') && href === current) link.classList.add('is-active');
  });

  /* ── 5) Scroll reveal ───────────────────────────────────── */
  const revealEls = $$('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* ── 6) Spotlight cards: track cursor position ──────────── */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.spot').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
    });
  }

  /* ── 7) Hero terminal typing ────────────────────────────── */
  const term = $('#terminalBody');
  if (term) {
    const sequence = [
      { cmd: 'whoami',
        out: ['Sudip Ojha — IT Enthusiast, Sydney'] },
      { cmd: 'cat focus.txt',
        out: ['managed IT · cybersecurity · cloud · software'] },
      { cmd: './availability.sh --check',
        out: ['<span class="t-ok">●</span> online — accepting new projects'] },
    ];

    const renderStatic = () => {
      term.innerHTML = '';
      sequence.forEach(step => {
        term.insertAdjacentHTML('beforeend',
          `<span class="t-line"><span class="t-prompt">❯</span><span class="t-cmd">${step.cmd}</span></span>`);
        step.out.forEach(o => term.insertAdjacentHTML('beforeend', `<span class="t-line t-out">${o}</span>`));
      });
      term.insertAdjacentHTML('beforeend',
        '<span class="t-line"><span class="t-prompt">❯</span><span class="t-cursor"></span></span>');
    };

    if (reducedMotion) {
      renderStatic();
    } else {
      const sleep = (ms) => new Promise(r => setTimeout(r, ms));
      (async () => {
        term.innerHTML = '';
        await sleep(700);
        for (const step of sequence) {
          const line = document.createElement('span');
          line.className = 't-line';
          line.innerHTML = '<span class="t-prompt">❯</span><span class="t-cmd"></span><span class="t-cursor"></span>';
          term.appendChild(line);
          const cmdEl = $('.t-cmd', line);
          for (const ch of step.cmd) {
            cmdEl.textContent += ch;
            await sleep(34 + Math.random() * 40);
          }
          await sleep(260);
          $('.t-cursor', line).remove();
          for (const o of step.out) {
            term.insertAdjacentHTML('beforeend', `<span class="t-line t-out">${o}</span>`);
            await sleep(180);
          }
          await sleep(420);
        }
        term.insertAdjacentHTML('beforeend',
          '<span class="t-line"><span class="t-prompt">❯</span><span class="t-cursor"></span></span>');
      })();
    }
  }

  /* ── 8) Particle network canvas (hero) ──────────────────── */
  const canvas = $('#net');
  if (canvas && !reducedMotion && window.innerWidth > 720) {
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, nodes = [], raf = null;
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(85, Math.round((W * H) / 22000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: 1 + Math.random() * 1.4,
      }));
    };

    const LINK = 130;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;
        // gentle drift away from the cursor
        const dxm = n.x - mouse.x, dym = n.y - mouse.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 110 && dm > 0.01) {
          n.x += (dxm / dm) * 0.5;
          n.y += (dym / dm) * 0.5;
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(63, 224, 163, ${(1 - d / LINK) * 0.13})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = 'rgba(63, 224, 163, 0.5)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    build();
    draw();

    canvas.parentElement.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    let resizeT;
    window.addEventListener('resize', () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(build, 200);
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
      else if (!raf) draw();
    });
  }

  /* ── 9) Live clocks ─────────────────────────────────────── */
  const sydneyEls = $$('.js-sydney-time');
  const clockEls = $$('.js-clock');
  const dateEls = $$('.js-clock-date');
  if (sydneyEls.length || clockEls.length) {
    const timeFmt = new Intl.DateTimeFormat('en-AU', {
      timeZone: 'Australia/Sydney', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    });
    const dateFmt = new Intl.DateTimeFormat('en-AU', {
      timeZone: 'Australia/Sydney', weekday: 'short', day: '2-digit', month: 'short',
    });
    const tick = () => {
      const now = new Date();
      const [h, m, s] = timeFmt.format(now).split(/[:.]/);
      sydneyEls.forEach(el => { el.textContent = `${h}:${m}:${s}`; });
      clockEls.forEach(el => {
        el.innerHTML =
          `${h}<span class="col">:</span>${m}<span class="col">:</span><span class="sec">${s}</span>`;
      });
      dateEls.forEach(el => { el.textContent = dateFmt.format(now).toUpperCase(); });
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ── 10) Copy email button ──────────────────────────────── */
  $$('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const value = btn.dataset.copy || '';
      let ok = false;
      try {
        await navigator.clipboard.writeText(value);
        ok = true;
      } catch {
        const ta = document.createElement('textarea');
        ta.value = value;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { ok = document.execCommand('copy'); } catch { ok = false; }
        ta.remove();
      }
      if (ok) {
        const prev = btn.textContent;
        btn.textContent = 'copied ✓';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = prev; btn.classList.remove('copied'); }, 1800);
      }
    });
  });

  /* ── 11) Footer year ────────────────────────────────────── */
  $$('#year').forEach(el => { el.textContent = new Date().getFullYear(); });

});
