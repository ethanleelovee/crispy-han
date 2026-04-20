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
   Desktop: click to lock. Mobile: swipe counter.
   ============================================= */
document.querySelectorAll('.accordion-panel').forEach(panel => {
  panel.addEventListener('click', () => {
    panel.parentElement.querySelectorAll('.accordion-panel')
      .forEach(p => p.classList.remove('active'));
    panel.classList.add('active');
  });
});

/* --- Mobile swipe counter --- */
(function() {
  const accordion = document.querySelector('.menu-accordion');
  if (!accordion) return;

  const isMobile = () => window.innerWidth <= 768;
  const panels = accordion.querySelectorAll('.accordion-panel');
  const total = panels.length;

  let counter, dots;

  function buildUI() {
    if (!isMobile()) return;
    if (document.querySelector('.swipe-counter')) return;

    // Counter: 01 / 04
    counter = document.createElement('div');
    counter.className = 'swipe-counter';
    counter.innerHTML = `
      <div class="swipe-dots">
        ${Array.from({length: total}, (_, i) =>
          `<span class="swipe-dot${i === 0 ? ' active' : ''}"></span>`
        ).join('')}
      </div>
      <span class="swipe-counter__text"><span class="swipe-current">01</span> / 0${total}</span>
    `;
    accordion.parentElement.insertBefore(counter, accordion.nextSibling);
    dots = counter.querySelectorAll('.swipe-dot');
  }

  function updateCounter(index) {
    if (!dots) return;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    const currentEl = counter.querySelector('.swipe-current');
    if (currentEl) currentEl.textContent = String(index + 1).padStart(2, '0');
  }

  accordion.addEventListener('scroll', () => {
    if (!isMobile()) return;
    const index = Math.round(accordion.scrollLeft / accordion.offsetWidth);
    updateCounter(index);
  }, { passive: true });

  buildUI();
  window.addEventListener('resize', buildUI);
})();
