// ── Starfield ──
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initStars(count = 220) {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.008 + 0.002,
      phase: Math.random() * Math.PI * 2,
    });
  }
}

function drawStars(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const s of stars) {
    s.alpha = 0.3 + 0.7 * Math.abs(Math.sin(t * s.speed + s.phase));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220, 220, 255, ${s.alpha})`;
    ctx.fill();
  }
  const bright = stars.slice(0, 12);
  for (const s of bright) {
    const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6);
    glow.addColorStop(0, `rgba(150, 200, 255, ${s.alpha * 0.6})`);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r * 6, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();
  }
}

function animate(t) {
  drawStars(t * 0.001);
  requestAnimationFrame(animate);
}

resize();
initStars();
requestAnimationFrame(animate);
window.addEventListener('resize', () => { resize(); initStars(); });

// ── Shooting Stars ──
function shootingStar() {
  const x = Math.random() * canvas.width * 0.8;
  const y = Math.random() * canvas.height * 0.4;
  const len = 120 + Math.random() * 100;
  const speed = 4 + Math.random() * 4;
  let progress = 0;

  function draw() {
    progress += speed;
    const ex = x + progress;
    const ey = y + progress * 0.45;
    const grad = ctx.createLinearGradient(ex, ey, ex - len, ey - len * 0.45);
    grad.addColorStop(0, 'rgba(255,255,255,0.9)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - len, ey - len * 0.45);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    if (progress < canvas.width * 0.6) requestAnimationFrame(draw);
  }
  draw();
}

setInterval(() => { if (Math.random() > 0.4) shootingStar(); }, 4000);

// ── Scroll Reveal ──
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// ── Nav active state ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--cyan)' : '';
  });
});
