(function () {
  const root = document.documentElement;
  const html = document.querySelector('html');

  // Theme toggle with persistence
  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) html.setAttribute('data-theme', savedTheme);
  if (themeToggle) {
    function withSmoothThemeTransition(callback) {
      html.classList.add('theme-transition');
      window.requestAnimationFrame(() => {
        callback();
        setTimeout(() => html.classList.remove('theme-transition'), 380);
      });
    }

    themeToggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      withSmoothThemeTransition(() => html.setAttribute('data-theme', next));
      localStorage.setItem('theme', next);
    });
  }

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', (!expanded).toString());
      navLinks.classList.toggle('show');
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('show');
    }));
    document.addEventListener('click', (e) => {
      if (!navLinks.classList.contains('show')) return;
      const within = e.target.closest('.nav-links, .nav-toggle');
      if (!within) {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('show');
      }
    });
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Tilt effect
  const tiltElements = Array.from(document.querySelectorAll('.tilt'));
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouch) {
    tiltElements.forEach((card) => {
      const strength = 12;
      let rect;
      function update(e) {
        rect = rect || card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = `rotateX(${-dy * strength}deg) rotateY(${dx * strength}deg)`;
      }
      function reset() { card.style.transform = 'rotateX(0) rotateY(0)'; rect = null; }
      card.addEventListener('mouseenter', () => { rect = card.getBoundingClientRect(); });
      card.addEventListener('mousemove', update);
      card.addEventListener('mouseleave', reset);
    });
  }

  // Scroll progress
  const progress = document.querySelector('.progress');
  if (progress) {
    const set = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const pct = Math.max(0, Math.min(1, scrolled / height));
      progress.style.width = `${pct * 100}%`;
    };
    window.addEventListener('scroll', set, { passive: true });
    set();
  }

  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear().toString();

  // Newsletter demo
  const newsletter = document.querySelector('.newsletter');
  if (newsletter) {
    newsletter.addEventListener('submit', () => {
      alert('Thanks for subscribing to Aurelia University updates!');
    });
  }
})();


