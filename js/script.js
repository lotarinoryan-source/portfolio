/* =============================================
   PORTFOLIO - Ryan Mark Lotarino
   Main Script
   ============================================= */

/* ---------- Custom Cursor Ball ---------- */
const cursorBall = document.getElementById('cursor-ball');
let mouseX = 0, mouseY = 0;
let ballX  = 0, ballY  = 0;
const ease = 0.35; // higher = faster follow

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Grow cursor on hover over interactive elements
document.querySelectorAll('a, button, [role="button"]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorBall.style.width  = '30px';
    cursorBall.style.height = '30px';
    cursorBall.style.opacity = '0.6';
  });
  el.addEventListener('mouseleave', () => {
    cursorBall.style.width  = '18px';
    cursorBall.style.height = '18px';
    cursorBall.style.opacity = '1';
  });
});

function animateCursor() {
  ballX += (mouseX - ballX) * ease;
  ballY += (mouseY - ballY) * ease;
  cursorBall.style.left = ballX + 'px';
  cursorBall.style.top  = ballY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ---------- Hero Grid Canvas ---------- */
(function initGridCanvas() {
  const canvas = document.getElementById('gridCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const CELL = 60;

  // Two particles with different colors, speeds and starting positions
  const particles = [
    {
      x: 0, y: 0, dir: 0, speed: 1.2,
      stepsTaken: 0, stepsTarget: 0,
      trail: [], trailMax: 28,
      color: '192,132,252',   // neon purple
    },
    {
      x: 0, y: 0, dir: 2, speed: 0.9,
      stepsTaken: 0, stepsTarget: 0,
      trail: [], trailMax: 22,
      color: '167,139,250',   // lighter violet
    },
  ];

  function randomSteps() {
    return (Math.floor(Math.random() * 5) + 3) * CELL;
  }

  function chooseNewDir(p) {
    const opposite = (p.dir + 2) % 4;
    const dirs = [0, 1, 2, 3].filter(d => d !== opposite);
    p.dir = dirs[Math.floor(Math.random() * dirs.length)];
    p.stepsTarget = randomSteps();
    p.stepsTaken  = 0;
  }

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    // Snap each particle to a different grid intersection
    particles[0].x = Math.round(canvas.width  * 0.35 / CELL) * CELL;
    particles[0].y = Math.round(canvas.height * 0.4  / CELL) * CELL;
    particles[0].stepsTarget = randomSteps();

    particles[1].x = Math.round(canvas.width  * 0.65 / CELL) * CELL;
    particles[1].y = Math.round(canvas.height * 0.6  / CELL) * CELL;
    particles[1].stepsTarget = randomSteps();
  }

  function updateParticle(p) {
    const dx = [1, 0, -1, 0][p.dir] * p.speed;
    const dy = [0, 1, 0, -1][p.dir] * p.speed;
    p.x += dx;
    p.y += dy;
    p.stepsTaken += p.speed;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width)  p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    p.trail.push({ x: p.x, y: p.y });
    if (p.trail.length > p.trailMax) p.trail.shift();

    if (p.stepsTaken >= p.stepsTarget) chooseNewDir(p);
  }

  function drawParticle(p) {
    // Trail
    for (let i = 0; i < p.trail.length; i++) {
      const alpha  = (i / p.trail.length) * 0.7;
      const radius = 1 + (i / p.trail.length) * 2;
      ctx.beginPath();
      ctx.arc(p.trail[i].x, p.trail[i].y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${alpha})`;
      ctx.fill();
    }

    // Glow halo
    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 14);
    grd.addColorStop(0,   `rgba(${p.color},0.9)`);
    grd.addColorStop(0.4, `rgba(124,58,237,0.5)`);
    grd.addColorStop(1,   `rgba(124,58,237,0)`);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // Core dot
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#e9d5ff';
    ctx.fill();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(124,58,237,0.07)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += CELL) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += CELL) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Both particles
    particles.forEach(p => { updateParticle(p); drawParticle(p); });
  }

  function loop() {
    draw();
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);
  loop();
})();

/* ---------- Sticky Header ---------- */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

/* ---------- Hamburger Menu ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ---------- Smooth Scroll for all scroll-btn / nav-link ---------- */
document.querySelectorAll('a[href^="#"], .scroll-btn[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 10;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---------- Active Nav Link on Scroll ---------- */
const sections  = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-link');

function setActiveNav() {
  const scrollY = window.scrollY + header.offsetHeight + 60;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navItems.forEach(n => n.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}
window.addEventListener('scroll', setActiveNav);

/* ---------- Scroll Reveal ---------- */
const revealEls = document.querySelectorAll('.reveal, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // animate once
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

/* ---------- Gallery Modal ---------- */
const viewProjectsBtn = document.getElementById('viewProjectsBtn');
const galleryModal    = document.getElementById('galleryModal');
const modalClose      = document.getElementById('modalClose');

// Open modal
viewProjectsBtn.addEventListener('click', () => {
  galleryModal.classList.add('active');
  document.body.style.overflow = 'hidden';
});

// Close modal via button
modalClose.addEventListener('click', closeGallery);

// Close modal by clicking backdrop
galleryModal.addEventListener('click', (e) => {
  if (e.target === galleryModal) closeGallery();
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (lightbox.classList.contains('active')) closeLightbox();
    else if (galleryModal.classList.contains('active')) closeGallery();
  }
});

function closeGallery() {
  galleryModal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ---------- Lightbox ---------- */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
let   currentScale  = 1;

// Open lightbox when gallery item is clicked
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const src = item.getAttribute('data-src');
    lightboxImg.src = src;
    currentScale = 1;
    lightboxImg.style.transform = `scale(${currentScale})`;
    lightbox.classList.add('active');
  });
});

// Close lightbox
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-inner')) {
    closeLightbox();
  }
});

function closeLightbox() {
  lightbox.classList.remove('active');
  lightboxImg.src = '';
  currentScale = 1;
}

// Zoom with mouse scroll
lightbox.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.15 : 0.15;
  currentScale = Math.min(Math.max(currentScale + delta, 0.5), 4);
  lightboxImg.style.transform = `scale(${currentScale})`;
}, { passive: false });

/* ---------- Web Projects Gallery Modal ---------- */
const viewWebProjectsBtn = document.getElementById('viewWebProjectsBtn');
const webGalleryModal    = document.getElementById('webGalleryModal');
const webModalClose      = document.getElementById('webModalClose');

viewWebProjectsBtn.addEventListener('click', () => {
  webGalleryModal.classList.add('active');
  document.body.style.overflow = 'hidden';
});

webModalClose.addEventListener('click', closeWebGallery);
webGalleryModal.addEventListener('click', (e) => {
  if (e.target === webGalleryModal) closeWebGallery();
});

function closeWebGallery() {
  webGalleryModal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ---------- Site Preview Fullscreen ---------- */
const siteModal      = document.getElementById('sitePreviewModal');
const siteFrame      = document.getElementById('sitePreviewFrame');
const siteModalClose = document.getElementById('siteModalClose');
const siteModalUrl   = document.getElementById('siteModalUrl');

document.querySelectorAll('.wp-preview-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const src = btn.getAttribute('data-src');
    siteFrame.src = src;
    siteModalUrl.textContent = src;
    siteModal.classList.add('active');
  });
});

siteModalClose.addEventListener('click', () => {
  siteModal.classList.remove('active');
  siteFrame.src = '';
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (siteModal.classList.contains('active')) {
      siteModal.classList.remove('active');
      siteFrame.src = '';
    } else if (webGalleryModal.classList.contains('active')) {
      closeWebGallery();
    }
  }
});


const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = contactForm.querySelector('#fname').value.trim();
  const email   = contactForm.querySelector('#femail').value.trim();
  const message = contactForm.querySelector('#fmessage').value.trim();

  if (!name || !email || !message) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  // Simulate success (static — no backend)
  showToast(`Thanks, ${name}! Your message has been noted.`, 'success');
  contactForm.reset();
});

/* ---------- Toast Notification ---------- */
function showToast(msg, type = 'success') {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => toast.classList.add('toast-show'));

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ---------- Toast Styles (injected) ---------- */
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  .toast {
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 14px 24px;
    border-radius: 10px;
    font-family: 'Poppins', sans-serif;
    font-size: 0.88rem;
    font-weight: 500;
    color: #fff;
    z-index: 9999;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.35s ease, transform 0.35s ease;
    max-width: 320px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
  }
  .toast-success { background: linear-gradient(135deg, #7c3aed, #a855f7); }
  .toast-error   { background: linear-gradient(135deg, #be123c, #e11d48); }
  .toast-show    { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(toastStyle);
