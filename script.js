document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      burger.classList.remove('is-open');
    });
  });

  /* ---------- Hero parallax (subtle, mouse-move disabled on touch) ---------- */
  const heroImg = document.getElementById('heroImg');
  if (window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroImg.style.transform = `scale(1.06) translateY(${y * 0.15}px)`;
      }
    }, { passive: true });
  }

  /* ---------- Reveal on scroll (section titles only) ---------- */
  const revealTargets = document.querySelectorAll('.section-title, .cta h2');
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Animated stat counters ---------- */
  const stats = document.querySelectorAll('.stat__num');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  stats.forEach(el => statObserver.observe(el));

  /* ---------- Transformation filmstrip: drag-to-scroll + progress ---------- */
  const filmstrip = document.getElementById('filmstrip');
  const track = document.getElementById('filmTrack');
  const progress = document.getElementById('filmProgress');

  let isDown = false;
  let startX = 0;
  let scrollStart = 0;

  const updateProgress = () => {
    const max = track.scrollWidth - track.clientWidth;
    const pct = max > 0 ? (track.scrollLeft / max) * 100 : 0;
    progress.style.width = Math.max(6, pct) + '%';
  };
  track.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  filmstrip.addEventListener('mousedown', (e) => {
    isDown = true;
    filmstrip.classList.add('dragging');
    startX = e.pageX;
    scrollStart = track.scrollLeft;
  });
  window.addEventListener('mouseup', () => {
    isDown = false;
    filmstrip.classList.remove('dragging');
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const dx = e.pageX - startX;
    track.scrollLeft = scrollStart - dx;
  });

  /* Touch devices already get native momentum scroll via overflow-x:auto */

  /* ---------- Slide active-scale effect based on viewport center ---------- */
  const slides = Array.from(track.querySelectorAll('.slide'));
  const scaleSlides = () => {
    const trackRect = track.getBoundingClientRect();
    const center = trackRect.left + trackRect.width / 2;
    slides.forEach(slide => {
      const r = slide.getBoundingClientRect();
      const slideCenter = r.left + r.width / 2;
      const dist = Math.abs(center - slideCenter);
      const norm = Math.min(dist / (trackRect.width / 1.4), 1);
      const scale = 1 - norm * 0.06;
      slide.style.transform = `scale(${scale.toFixed(3)})`;
    });
  };
  track.addEventListener('scroll', scaleSlides, { passive: true });
  window.addEventListener('resize', scaleSlides);
  scaleSlides();

});
