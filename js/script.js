// ===== V2 Site Interactions =====

// 1) Dashboard dropdown toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("dashboardToggle");
  const dd = document.getElementById("dashboardDropdown");
  if (toggle && dd) {
    toggle.addEventListener("click", (e) => {
      dd.classList.toggle("show");
      e.stopPropagation();
    });
    window.addEventListener("click", (e) => {
      if (!document.querySelector(".dashboard-menu")?.contains(e.target)) {
        dd.classList.remove("show");
      }
    });
  }
});

// 2) Back-to-top button (if present)
const backToTop = document.getElementById("backToTop");
if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 240 ? "block" : "none";
  });
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// 3) Splash / Logo overlay (2 seconds on every page load)
(function(){
  const SPLASH_MS = 2000; // exact 2 seconds
  function showThenHideSplash() {
    const el = document.getElementById("splash");
    if (!el) return;
    el.classList.remove("hidden");
    setTimeout(() => el.classList.add("hidden"), SPLASH_MS);
  }
  if (document.readyState === "complete") {
    showThenHideSplash();
  } else {
    window.addEventListener("load", showThenHideSplash, { once: true });
  }
})();

// 4) Hero Aurora Grid FX (subtle animated tech background)
//    - lightweight, pauses when tab hidden, respects reduced motion
(function(){
  const prefersReduced =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const canvas = document.getElementById("heroFX");
  if (!canvas || prefersReduced) return;

  const ctx = canvas.getContext("2d");
  let DPR = Math.min(2, window.devicePixelRatio || 1);
  let W = 0, H = 0, nodes = [], mouse = {x:0,y:0,active:false};
  let rafId, lastT = 0;

  const CFG = {
    density: 0.00018,     // nodes per pixel (tweak)
    maxLinkDist: 120,     // px
    nodeSize: [1.2, 2.2], // min/max radius
    drift: 0.15,          // speed factor
    accent: "rgba(56,189,248,0.8)",    // cyan
    glow: "rgba(56,189,248,0.25)",
    line: "rgba(235,245,255,0.13)",
    bgPulse: true
  };

  function resize(){
    const rect = canvas.getBoundingClientRect();
    W = Math.floor(rect.width * DPR);
    H = Math.floor(rect.height * DPR);
    canvas.width = W; canvas.height = H;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    // regenerate nodes proportional to area
    const count = Math.floor((W * H) * CFG.density / (DPR*DPR));
    nodes = new Array(count).fill(0).map(()=>spawn());
  }

  function spawn(){
    const r = lerp(CFG.nodeSize[0], CFG.nodeSize[1], Math.random()) * DPR;
    const ang = Math.random()*Math.PI*2;
    const sp = (0.2 + Math.random()) * CFG.drift * DPR;
    return { x: Math.random()*W, y: Math.random()*H, vx: Math.cos(ang)*sp, vy: Math.sin(ang)*sp, r };
  }

  function lerp(a,b,t){ return a + (b-a)*t; }

  function step(t){
    const dt = Math.min(32, t - lastT || 16); lastT = t;

    // faint pulsing background wash
    if (CFG.bgPulse){
      const g = ctx.createRadialGradient(
        (W*0.8), (H*0.15), 0,
        (W*0.8), (H*0.15), Math.max(W,H)*0.9
      );
      const pulse = 0.06 + 0.04*Math.sin(t/2000);
      g.addColorStop(0, `rgba(56,189,248,${0.08+pulse})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);
    } else {
      ctx.clearRect(0,0,W,H);
    }

    // update nodes
    for (let i=0;i<nodes.length;i++){
      const n = nodes[i];
      n.x += n.vx * dt * 0.06;
      n.y += n.vy * dt * 0.06;

      // gentle mouse attraction
      if (mouse.active){
        const dx = (mouse.x - n.x);
        const dy = (mouse.y - n.y);
        const d2 = dx*dx + dy*dy;
        if (d2 < (220*DPR)*(220*DPR)){
          n.x += dx * 0.0005;
          n.y += dy * 0.0005;
        }
      }

      // wrap around
      if (n.x < -50) n.x = W+50;
      if (n.x > W+50) n.x = -50;
      if (n.y < -50) n.y = H+50;
      if (n.y > H+50) n.y = -50;
    }

    // draw connections
    const maxDist = CFG.maxLinkDist * DPR;
    ctx.lineWidth = 1 * DPR;
    ctx.strokeStyle = CFG.line;
    for (let i=0;i<nodes.length;i++){
      const a = nodes[i];
      for (let j=i+1;j<nodes.length;j++){
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < maxDist){
          const alpha = 1 - (d / maxDist);
          ctx.globalAlpha = alpha*0.8;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    // draw nodes with glow
    for (const n of nodes){
      ctx.beginPath();
      ctx.fillStyle = CFG.accent;
      ctx.shadowColor = CFG.glow;
      ctx.shadowBlur = 10 * DPR;
      ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    rafId = requestAnimationFrame(step);
  }

  // events
  function onMouse(e){
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * DPR;
    mouse.y = (e.clientY - rect.top) * DPR;
    mouse.active = true;
  }
  function onLeave(){ mouse.active = false; }

  window.addEventListener("resize", resize);
  canvas.addEventListener("mousemove", onMouse);
  canvas.addEventListener("mouseleave", onLeave);

  document.addEventListener("visibilitychange", ()=>{
    if (document.hidden){ cancelAnimationFrame(rafId); }
    else { lastT = 0; rafId = requestAnimationFrame(step); }
  });

  // init after page load
  const init = () => { resize(); lastT = 0; rafId = requestAnimationFrame(step); };
  if (document.readyState === "complete") init();
  else window.addEventListener("load", init, { once:true });
})();
