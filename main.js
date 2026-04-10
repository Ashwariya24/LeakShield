// main.js v2 — Shared utilities for DarkSentinel
// (matrix rain removed — ambient blobs + dot grid in CSS)

// Smooth reveal on scroll
const revealEls = document.querySelectorAll('.slide-in');
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'none'; }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => {
    el.style.opacity = '0'; el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    io.observe(el);
  });
}

// Active nav link highlight
(function () {
  const links = document.querySelectorAll('.nav-link');
  const path = location.pathname.split('/').pop() || 'index.html';
  links.forEach(l => {
    const href = l.getAttribute('href');
    if (href === path) l.classList.add('active');
  });
})();
