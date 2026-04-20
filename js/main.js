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
   Mobile A: GSAP stagger entrance.
   Mobile B: image zoom on expand (CSS).
   ============================================= */
document.querySelectorAll('.accordion-panel').forEach(panel => {
  panel.addEventListener('click', () => {
    panel.parentElement.querySelectorAll('.accordion-panel')
      .forEach(p => p.classList.remove('active'));
    panel.classList.add('active');
  });
});

/* --- A: Mobile stagger entrance --- */
(function() {
  if (window.innerWidth > 768) return;

  const panels = gsap.utils.toArray('.accordion-panel');

  gsap.set(panels, { opacity: 0, y: 48 });

  ScrollTrigger.create({
    trigger: '.menu-accordion',
    start: 'top 82%',
    once: true,
    onEnter() {
      gsap.to(panels, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out'
      });
    }
  });
})();
