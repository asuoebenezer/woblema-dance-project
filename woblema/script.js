// ---------- Navbar: background, active link, back-to-top ----------
const nav = document.getElementById('mainNav');
const backToTop = document.getElementById('backToTop');
const sections = document.querySelectorAll('header[id], section[id]');
const navLinks = document.querySelectorAll('#navMenu .nav-link');

function onScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  backToTop.style.display = window.scrollY > 500 ? 'block' : 'none';

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', onScroll);
onScroll();

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Close the mobile menu after clicking a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const menu = document.getElementById('navMenu');
    if (menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  });
});

// ---------- Scroll reveal ----------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---------- Animated counters ----------
function animateCounter(el) {
  const target = +el.dataset.target;
  const plain = el.dataset.plain === 'true';
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(p * target);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target + (plain ? '' : '+');
  }
  requestAnimationFrame(tick);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// ---------- Gallery filter ----------
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      item.classList.toggle('hide', filter !== 'all' && item.dataset.cat !== filter);
    });
  });
});

// ---------- Lightbox (gallery + posters) ----------
const lightboxEl = document.getElementById('lightbox');
const lightbox = new bootstrap.Modal(lightboxEl);
const lbImg = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');

let lbList = [];   // [{src, caption}]
let lbIndex = 0;

function showLightbox() {
  const item = lbList[lbIndex];
  lbImg.src = item.src;
  lbImg.alt = item.caption;
  lbCaption.textContent = item.caption;
  const single = lbList.length < 2;
  lbPrev.classList.toggle('d-none', single);
  lbNext.classList.toggle('d-none', single);
}

// Gallery links open as a browsable set (respecting the active filter)
document.querySelectorAll('.g-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const visible = [...document.querySelectorAll('.gallery-item:not(.hide) .g-link')];
    lbList = visible.map(a => ({ src: a.getAttribute('href'), caption: a.dataset.caption }));
    lbIndex = visible.indexOf(link);
    showLightbox();
    lightbox.show();
  });
});

// Poster buttons open a single image
document.querySelectorAll('.poster-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    lbList = [{ src: btn.dataset.img, caption: btn.dataset.title }];
    lbIndex = 0;
    showLightbox();
    lightbox.show();
  });
});

function step(dir) {
  lbIndex = (lbIndex + dir + lbList.length) % lbList.length;
  showLightbox();
}
lbPrev.addEventListener('click', () => step(-1));
lbNext.addEventListener('click', () => step(1));
document.addEventListener('keydown', (e) => {
  if (!lightboxEl.classList.contains('show') || lbList.length < 2) return;
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'ArrowRight') step(1);
});

// ---------- Contact form (front-end only) ----------
const form = document.getElementById('contactForm');
const formAlert = document.getElementById('formAlert');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  form.classList.add('was-validated');
  if (!form.checkValidity()) return;

  const name = document.getElementById('name').value.trim();
  formAlert.textContent = `Thank you, ${name}! Your message has been received and the Woblema team will be in touch.`;
  formAlert.classList.remove('d-none');
  form.reset();
  form.classList.remove('was-validated');
});

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();
