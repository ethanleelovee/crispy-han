/* =============================================
   CRISPY HAN — MAIN JS
   Modules: Zoom Parallax + Kinetic Marquee + Accordion
   ============================================= */

gsap.registerPlugin(ScrollTrigger);

/* --- Nav: scroll state --- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* --- Scroll reveal: fade-up elements --- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));

/* =============================================
   MODULE 25: KINETIC MARQUEE
   ============================================= */
(function() {
  const rows = document.querySelectorAll('.marquee-row');

  rows.forEach(row => {
    const content = row.querySelector('.marquee-content');
    if (!content) return;
    row.appendChild(content.cloneNode(true));
  });

  const baseSpeed = 50;

  const start = () => {
    rows.forEach(row => {
      const content = row.querySelector('.marquee-content');
      if (!content) return;

      const goRight = row.dataset.direction === 'right';
      const speedMult = parseFloat(row.dataset.speed) || 1;
      const contentWidth = content.offsetWidth;
      if (contentWidth === 0) return;

      const pxPerFrame = baseSpeed * speedMult / 60;
      let x = goRight ? -contentWidth : 0;

      function tick() {
        if (goRight) {
          x += pxPerFrame;
          if (x >= 0) x -= contentWidth;
        } else {
          x -= pxPerFrame;
          if (x <= -contentWidth) x += contentWidth;
        }

        row.style.transform = `translateX(${x}px)`;
        requestAnimationFrame(tick);
      }

      tick();
    });
  };

  document.fonts ? document.fonts.ready.then(start) : window.addEventListener('load', start);
})();

/* =============================================
   MODULE 11: ACCORDION SLIDER
   Desktop: click to lock active.
   Mobile: 3-state machine (collapsed/expanded/flipped) + stagger entrance.
   ============================================= */
const allPanels = Array.from(document.querySelectorAll('.accordion-panel'));

if (window.innerWidth > 768) {
  /* --- Desktop: standard accordion --- */
  allPanels.forEach(panel => {
    panel.addEventListener('click', () => {
      allPanels.forEach(p => p.classList.remove('active'));
      panel.classList.add('active');
    });
  });

} else {
  /* --- Mobile: 3-state machine --- */

  // Initialize all panels
  allPanels.forEach(panel => {
    panel.dataset.mobileState = 'collapsed';
  });

  allPanels.forEach(panel => {
    panel.addEventListener('click', () => mobileTap(panel));
  });

  function mobileTap(tapped) {
    const state = tapped.dataset.mobileState;
    const flippedOther = allPanels.find(p => p !== tapped && p.dataset.mobileState === 'flipped');

    if (flippedOther) {
      // State 3 + tap different → collapse flipped, expand tapped
      collapse(flippedOther);
      expand(tapped);
      return;
    }

    if (state === 'collapsed') {
      allPanels.forEach(p => { if (p !== tapped && p.dataset.mobileState === 'expanded') collapse(p); });
      expand(tapped);
    } else if (state === 'expanded') {
      flipToBack(tapped);
    } else if (state === 'flipped') {
      flipToFront(tapped);
    }
  }

  function expand(panel) {
    panel.dataset.mobileState = 'expanded';
    const back = panel.querySelector('.panel-back');
    if (back) back.style.display = 'none';
    frontVisible(panel, true);
    gsap.to(panel.querySelector('.panel-bg'), { scale: 1.06, duration: 0.7, ease: 'power2.out' });
  }

  function collapse(panel) {
    panel.dataset.mobileState = 'collapsed';
    const back = panel.querySelector('.panel-back');
    if (back) back.style.display = 'none';
    frontVisible(panel, true);
    gsap.to(panel.querySelector('.panel-bg'), { scale: 1, duration: 0.5, ease: 'power2.out' });
    gsap.set(panel, { rotateY: 0 });
  }

  function flipToBack(panel) {
    panel.dataset.mobileState = 'flipped';
    const back = panel.querySelector('.panel-back');
    gsap.timeline()
      .to(panel, { rotateY: 90, duration: 0.22, ease: 'power2.in' })
      .call(() => {
        frontVisible(panel, false);
        if (back) { back.style.display = 'flex'; }
        gsap.set(panel, { rotateY: -90 });
      })
      .to(panel, { rotateY: 0, duration: 0.22, ease: 'power2.out' });
  }

  function flipToFront(panel) {
    panel.dataset.mobileState = 'expanded';
    const back = panel.querySelector('.panel-back');
    gsap.timeline()
      .to(panel, { rotateY: 90, duration: 0.22, ease: 'power2.in' })
      .call(() => {
        frontVisible(panel, true);
        if (back) { back.style.display = 'none'; }
        gsap.set(panel, { rotateY: -90 });
      })
      .to(panel, { rotateY: 0, duration: 0.22, ease: 'power2.out' });
  }

  function frontVisible(panel, visible) {
    const v = visible ? '' : 'hidden';
    panel.querySelectorAll('.panel-bg, .panel-overlay, .panel-title, .panel-content')
      .forEach(el => el.style.visibility = v);
  }

  /* --- A: Stagger entrance --- */
  gsap.set(allPanels, { opacity: 0, y: 48 });
  ScrollTrigger.create({
    trigger: '.menu-accordion',
    start: 'top 82%',
    once: true,
    onEnter() {
      gsap.to(allPanels, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' });
    }
  });
}
