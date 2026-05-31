/* ===========================================================
   PitchWise — interactions
   Uses rect-based visibility checks (IntersectionObserver is
   unreliable inside nested preview iframes), so reveals,
   scroll-spy and one-shot animations all work everywhere.
   =========================================================== */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  const nav = document.getElementById('nav');
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  const linkMap = {};
  navLinks.forEach(a => { linkMap[a.getAttribute('href').slice(1)] = a; });
  const spyIds = ['what-you-get', 'free-audit', 'who-its-for'];

  let ringDone = false, diagDone = false;

  function inView(el, frac) {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const trigger = vh * (1 - (frac || 0.08));
    // reveal once the top crosses the trigger line — including elements already
    // scrolled above the viewport, so anchor jumps never leave content hidden
    return r.top < trigger;
  }

  /* ---------- count-up ---------- */
  function countUp(el, target, dur) {
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
    // fallback: guarantee final value lands even if rAF is throttled/paused
    setTimeout(() => { el.textContent = target; }, dur + 250);
  }

  function fillRing() {
    if (ringDone) return;
    const ring = document.querySelector('.ring');
    if (!ring || !inView(ring, 0.25)) return;
    ringDone = true;
    const val = parseInt(ring.dataset.val, 10);
    const fill = ring.querySelector('.rfill');
    const circ = 2 * Math.PI * 22;
    fill.setAttribute('stroke-dasharray', circ.toFixed(1));
    const offset = (circ * (1 - val / 100)).toFixed(1);
    requestAnimationFrame(() => { fill.style.strokeDashoffset = offset; });
    // fallback: lock the ring fill if the transition can't paint
    setTimeout(() => { fill.style.transition = 'none'; fill.style.strokeDashoffset = offset; }, 1700);
    const num = ring.querySelector('.rnum');
    if (num) countUp(num, parseInt(num.dataset.count, 10), 1400);
  }

  function fillDiag() {
    if (diagDone) return;
    const diag = document.querySelector('.diag');
    if (!diag || !inView(diag, 0.2)) return;
    diagDone = true;
    diag.querySelectorAll('.dr-track i').forEach((bar, i) => {
      setTimeout(() => { bar.style.width = bar.dataset.w; }, 120 + i * 90);
      // fallback: lock final width with no transition
      setTimeout(() => { bar.style.transition = 'none'; bar.style.width = bar.dataset.w; }, 1300 + i * 90);
    });
    const res = diag.querySelector('[data-count2]');
    if (res) countUp(res, parseInt(res.dataset.count2, 10), 1300);
  }

  /* ---------- main scroll handler ---------- */
  function update() {
    // sticky nav border
    if (window.scrollY > 8) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    // reveals
    for (let i = reveals.length - 1; i >= 0; i--) {
      if (inView(reveals[i])) {
        const el = reveals[i];
        el.classList.add('in');
        // lock final state after the transition would finish, so content is
        // never left hidden in paused / non-painting contexts
        setTimeout(() => el.classList.add('settled'), 780);
        reveals.splice(i, 1);
      }
    }

    // one-shot animations
    fillRing();
    fillDiag();

    // scroll-spy
    let activeId = null;
    const mid = (window.innerHeight || 0) * 0.42;
    spyIds.forEach(id => {
      const sec = document.getElementById(id);
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) activeId = id;
    });
    navLinks.forEach(l => l.classList.remove('active'));
    if (activeId && linkMap[activeId]) linkMap[activeId].classList.add('active');
  }

  let lastRun = 0;
  function onScroll() {
    // call update() directly (throttled by timestamp) rather than via rAF,
    // which can be paused in non-painting contexts
    const now = Date.now();
    if (now - lastRun < 16) return;
    lastRun = now;
    update();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  // run a few times after load so late layout / fonts settle
  update();
  setTimeout(update, 60);
  setTimeout(update, 300);

  /* ---------- mobile menu ---------- */
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- carousel ---------- */
  (function () {
    const track = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.cdot');
    if (!track || !dots.length) return;
    const total = track.children.length;
    let current = 0;
    let timer = null;
    let isTransitioning = false;

    function goTo(idx) {
      if (isTransitioning) return;
      isTransitioning = true;
      current = ((idx % total) + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      setTimeout(() => { isTransitioning = false; }, 580);
    }

    function next() { goTo(current + 1); }

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(next, 3500);
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goTo(parseInt(dot.dataset.idx, 10));
        startAuto();
      });
    });

    // pause on hover
    const wrap = document.querySelector('.carousel-wrap');
    if (wrap) {
      wrap.addEventListener('mouseenter', () => clearInterval(timer));
      wrap.addEventListener('mouseleave', startAuto);
    }

    // touch swipe
    let touchX = null;
    const carousel = document.querySelector('.carousel');
    if (carousel) {
      carousel.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
      carousel.addEventListener('touchend', e => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) > 40) { goTo(current + (dx < 0 ? 1 : -1)); startAuto(); }
      }, { passive: true });
    }

    startAuto();
  })();


  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.in)').forEach(el => {
      if (inView(el, -0.5)) return; // genuinely far below — leave for scroll
    });
  }, 1500);
})();
