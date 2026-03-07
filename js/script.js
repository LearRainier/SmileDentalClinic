/* ============================================================
   NewSmile Dental Clinic — Full Parallax Engine + All Effects
   ============================================================ */

/* ── Dark Mode ── */
function myFunction() {
  document.body.classList.toggle('dark-mode');
  const btn = document.querySelector('.darkmode');
  if (btn) btn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════════════
     1. PROGRESSIVE REVEAL SYSTEM
     Content visible by default, JS enhances
  ════════════════════════════════════════ */
  document.body.classList.add('js-ready');

  function revealEl(el) { el.classList.add('visible', 'in-view'); }

  function checkVisible() {
    document.querySelectorAll(
      '.reveal:not(.visible),.reveal-left:not(.visible),.reveal-right:not(.visible),.reveal-scale:not(.visible),.animate-on-scroll:not(.visible)'
    ).forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight + 100) revealEl(el);
    });
  }
  checkVisible();

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { revealEl(e.target); revealObs.unobserve(e.target); } });
  }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.animate-on-scroll')
    .forEach(el => revealObs.observe(el));

  window.addEventListener('scroll', checkVisible, { passive: true });


  /* ════════════════════════════════════════
     2. FULL PARALLAX ENGINE
     Multi-layer, multi-speed, per-element
  ════════════════════════════════════════ */
  const isMobile = () => window.innerWidth <= 768;

  /* ── Build parallax registry ── */
  const parallaxItems = [];

  function registerParallax(selector, speedY = 0.3, speedX = 0, clamp = null) {
    document.querySelectorAll(selector).forEach(el => {
      parallaxItems.push({ el, speedY, speedX, clamp });
    });
  }

  /* Layer 1 — Hero background (slowest, deepest) */
  registerParallax('.hero-bg',        0.42,  0);
  /* Layer 2 — Hero mesh overlay (slightly faster) */
  registerParallax('.hero-mesh',      0.18,  0);
  /* Layer 3 — Hero particles wrapper */
  registerParallax('.hero-particles', 0.25,  0);
  /* Layer 4 — Hero content (subtle upward drift) */
  registerParallax('.hero-content',   0.10,  0);
  /* Layer 5 — CTA background */
  registerParallax('.cta-bg',         0.35,  0);
  /* Layer 6 — Statistics section gradient bg */
  registerParallax('.statistics-section::before', 0.2, 0);
  /* Layer 7 — Page hero section decoration */
  registerParallax('.page-hero-section::after',   0.15, 0);
  /* Layer 8 — About float card */
  registerParallax('.about-float-card', 0.08, 0);
  /* Layer 9 — Section eyebrows (very subtle horizontal drift) */
  registerParallax('.section-eyebrow', 0.04, 0.02);
  /* Layer 10 — Feature icons (micro-float on scroll) */
  registerParallax('.feature-icon',   0.06, 0);

  /* ── Dedicated element parallax (special cases) ── */
  const heroBg     = document.querySelector('.hero-bg');
  const heroMesh   = document.querySelector('.hero-mesh');
  const heroPartic = document.querySelector('.hero-particles');
  const heroContent = document.querySelector('.hero-content');
  const ctaBg      = document.querySelector('.cta-bg');
  const statSect   = document.querySelector('.statistics-section');
  const aboutFloat = document.querySelector('.about-float-card');
  const pageHero   = document.querySelector('.page-hero-section');
  const featureIcons = document.querySelectorAll('.feature-icon');
  const serviceNums  = document.querySelectorAll('.service-num');
  const teamCards    = document.querySelectorAll('.team-card');
  const heroWave     = document.querySelector('.hero-wave svg');
  const heroTag      = document.querySelector('.hero-tag');

  /* Track each parallax section's own scroll progress */
  function getSectionProgress(el) {
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const vh   = window.innerHeight;
    return (vh - rect.top) / (vh + rect.height);
  }

  let rafId  = null;
  let lastSY = -1;

  function runParallax() {
    const sy = window.scrollY;

    /* Skip if scroll hasn't changed */
    if (sy === lastSY && rafId) return;
    lastSY = sy;

    /* ── Hero layers ── */
    if (heroBg)      heroBg.style.transform      = `translateY(${sy * 0.38}px)`;
    if (heroMesh)    heroMesh.style.transform     = `translateY(${sy * 0.16}px)`;
    if (heroPartic)  heroPartic.style.transform   = `translateY(${sy * 0.22}px)`;
    if (heroContent) heroContent.style.transform  = `translateY(${sy * 0.08}px)`;
    if (heroWave)    heroWave.style.transform     = `translateY(${sy * -0.06}px)`;
    if (heroTag)     heroTag.style.transform      = `translateY(${sy * 0.05}px) scale(${1 - sy * 0.0001})`;

    /* ── CTA section parallax ── */
    if (ctaBg) {
      const ctaRect = ctaBg.closest('.cta-section')?.getBoundingClientRect();
      if (ctaRect) {
        const progress = getSectionProgress(ctaBg.closest('.cta-section'));
        ctaBg.style.transform = `translateY(${(progress - 0.5) * -80}px)`;
      }
    }

    /* ── Statistics section background shimmer ── */
    if (statSect) {
      const p = getSectionProgress(statSect);
      statSect.style.backgroundPosition = `${50 + p * 20}% ${50 + p * 15}%`;
    }

    /* ── Page hero section (inner pages) ── */
    if (pageHero) {
      const p = getSectionProgress(pageHero);
      pageHero.style.backgroundPositionY = `${50 + p * 25}%`;
    }

    /* ── About float card micro-parallax ── */
    if (aboutFloat) {
      const parent = aboutFloat.closest('.about-visual') || aboutFloat.closest('.about-section');
      if (parent) {
        const p = getSectionProgress(parent);
        aboutFloat.style.transform = `translateY(${(p - 0.5) * -24}px)`;
      }
    }

    /* ── Feature icons: staggered vertical drift ── */
    featureIcons.forEach((icon, i) => {
      const section = icon.closest('.features-section') || icon.closest('section');
      if (section) {
        const p    = getSectionProgress(section);
        const dir  = i % 2 === 0 ? 1 : -1;
        const amp  = 12 + i * 3;
        icon.style.transform = `translateY(${(p - 0.5) * amp * dir}px) rotate(${(p - 0.5) * (dir * 8)}deg)`;
      }
    });

    /* ── Service card numbers — horizontal drift ── */
    serviceNums.forEach((num, i) => {
      const card = num.closest('.service-card');
      if (card) {
        const p   = getSectionProgress(card.closest('section') || card);
        const dir = i % 2 === 0 ? 1 : -1;
        num.style.transform = `translateX(${(p - 0.5) * dir * 18}px) translateY(${(p - 0.5) * -10}px)`;
      }
    });

    /* ── Team cards subtle tilt on scroll ── */
    teamCards.forEach((card, i) => {
      const p   = getSectionProgress(card.closest('section') || card);
      const tilt = (p - 0.5) * (i % 2 === 0 ? 2 : -2);
      if (!card.matches(':hover')) {
        card.style.transform = `translateY(${(p - 0.5) * -12}px) rotate(${tilt * 0.3}deg)`;
      }
    });

    rafId = null;
  }

  function onScroll() {
    if (!rafId) rafId = requestAnimationFrame(runParallax);
  }

  /* Only enable parallax on non-mobile */
  if (!isMobile()) {
    window.addEventListener('scroll', onScroll, { passive: true });
    runParallax(); /* initial pass */

    /* Re-check on resize */
    window.addEventListener('resize', () => {
      if (!isMobile()) {
        window.addEventListener('scroll', onScroll, { passive: true });
      } else {
        window.removeEventListener('scroll', onScroll);
        /* Reset all transforms on mobile */
        [heroBg, heroMesh, heroPartic, heroContent, ctaBg, heroWave, heroTag, aboutFloat]
          .forEach(el => { if (el) el.style.transform = ''; });
        featureIcons.forEach(el => el.style.transform = '');
        serviceNums.forEach(el => el.style.transform  = '');
        teamCards.forEach(el   => el.style.transform  = '');
      }
    });
  }


  /* ════════════════════════════════════════
     3. SCROLL PROGRESS BAR
     Green-to-blue bar at top of viewport
  ════════════════════════════════════════ */
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  progressBar.style.cssText = `
    position:fixed; top:0; left:0; height:3px; width:0%;
    background:linear-gradient(90deg,#16a34a,#06b6d4,#2563eb);
    z-index:9999; transition:width 0.1s linear;
    box-shadow:0 0 8px rgba(22,163,74,.6);
    pointer-events:none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const docH  = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });


  /* ════════════════════════════════════════
     4. HEADER SCROLL BEHAVIOR
  ════════════════════════════════════════ */
  const header  = document.querySelector('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const sy  = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', sy > 50);
      /* Hide header on fast scroll down, reveal on scroll up */
      if (sy > lastScroll + 8 && sy > 200) {
        header.style.transform = 'translateY(-100%)';
      } else if (sy < lastScroll - 4) {
        header.style.transform = 'translateY(0)';
      }
    }
    lastScroll = sy;
  }, { passive: true });

  /* Add transition to header CSS via JS */
  if (header) header.style.transition = 'transform 0.4s cubic-bezier(.4,0,.2,1), box-shadow 0.3s ease, background 0.3s ease';


  /* ════════════════════════════════════════
     5. MOBILE NAV
  ════════════════════════════════════════ */
  const navBtn   = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navBtn) navBtn.addEventListener('click', () => navLinks?.classList.toggle('open'));
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => navLinks?.classList.remove('open'));
  });


  /* ════════════════════════════════════════
     6. COUNTER ANIMATION
  ════════════════════════════════════════ */
  function animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix   || '';
    const decimals = parseInt(el.dataset.decimals || '0');
    const dur = 2200;
    const t0  = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = (ease(p) * target).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) animateCounter(e.target); });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => cntObs.observe(el));


  /* ════════════════════════════════════════
     7. MAGNETIC BUTTONS
  ════════════════════════════════════════ */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.15;
      const y = (e.clientY - r.top  - r.height / 2) * 0.15;
      btn.style.transform = `translateY(-3px) translate(${x}px,${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });


  /* ════════════════════════════════════════
     8. CARD 3D TILT ON HOVER
  ════════════════════════════════════════ */
  document.querySelectorAll('.feature, .service-card, .stats-card, .contact-item, .step').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top)  / r.height - 0.5) * -12;
      const ry = ((e.clientX - r.left) / r.width  - 0.5) *  12;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });


  /* ════════════════════════════════════════
     9. CURSOR GLOW EFFECT (desktop only)
  ════════════════════════════════════════ */
  if (!isMobile()) {
    const cursor = document.createElement('div');
    cursor.id = 'cursor-glow';
    cursor.style.cssText = `
      position:fixed; pointer-events:none; z-index:9998;
      width:320px; height:320px; border-radius:50%;
      background:radial-gradient(circle, rgba(22,163,74,.06) 0%, transparent 70%);
      transform:translate(-50%,-50%);
      transition:opacity 0.3s ease;
    `;
    document.body.appendChild(cursor);

    window.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });

    /* Intensify on interactive elements */
    document.querySelectorAll('.btn, .feature, .service-card, .nav-links a').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.background = 'radial-gradient(circle, rgba(22,163,74,.12) 0%, transparent 70%)';
        cursor.style.width  = '400px';
        cursor.style.height = '400px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.background = 'radial-gradient(circle, rgba(22,163,74,.06) 0%, transparent 70%)';
        cursor.style.width  = '320px';
        cursor.style.height = '320px';
      });
    });
  }


  /* ════════════════════════════════════════
     10. SMOOTH ANCHOR SCROLL
  ════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; /* header height */
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});

/* ════════════════════════════════════════
   11. SECTION PARALLAX ORBS & DECORATIONS
   Runs alongside main parallax engine
════════════════════════════════════════ */
(function initOrbParallax() {
  const orb1 = document.querySelector('.stats-orb-1');
  const orb2 = document.querySelector('.stats-orb-2');
  const geoFloats = document.querySelectorAll('.geo-float');
  const reviewsBefore = document.querySelector('.reviews-section');
  const featuresBg = document.querySelector('.features-section');

  if (window.innerWidth <= 768) return;

  window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      const sy = window.scrollY;

      /* Stats orbs */
      if (orb1) orb1.style.transform = `translate(${sy * 0.04}px, ${sy * 0.06}px)`;
      if (orb2) orb2.style.transform = `translate(${sy * -0.05}px, ${sy * -0.04}px)`;

      /* Geo floats parallax (in addition to CSS keyframe animation) */
      geoFloats.forEach((el, i) => {
        const factor = i % 2 === 0 ? 0.04 : -0.03;
        el.style.transform = `translateY(${sy * factor}px)`;
      });
    });
  }, { passive: true });
})();
