// L'Artisan Du Bois — homepage interactions

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Split headings into masked words for the reveal
document.querySelectorAll('.split').forEach((el) => {
  let i = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(' '); return; }
          const w = document.createElement('span');
          w.className = 'w';
          const inner = document.createElement('span');
          inner.style.setProperty('--d', i++);
          inner.textContent = part;
          w.append(inner);
          frag.append(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };
  walk(el);
});

// Reveal on scroll: everything is visible without JS; animated elements get .pre first
if (!reduceMotion && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal, .split, .bars').forEach((el) => {
    el.classList.add('pre');
    io.observe(el);
  });
}

// Header background once the page scrolls
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu
const burger = document.querySelector('.burger');
burger.addEventListener('click', () => {
  const open = header.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
header.querySelectorAll('.nav a').forEach((a) => a.addEventListener('click', () => {
  header.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}));

// Light parallax on full-bleed images
if (!reduceMotion) {
  const layers = [...document.querySelectorAll('.hero-media img, .savoir-media img')];
  let ticking = false;
  const update = () => {
    layers.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      img.style.setProperty('--parallax', `${(r.top * -0.12).toFixed(1)}px`);
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

// Fabric colour picker
const swatchImg = document.getElementById('swatch-img');
const swatchName = document.getElementById('swatch-name');
const swatches = document.querySelectorAll('.swatches button');
swatches.forEach((btn) => {
  btn.setAttribute('aria-label', btn.dataset.name);
  btn.addEventListener('click', () => {
    swatches.forEach((b) => b.setAttribute('aria-checked', 'false'));
    btn.setAttribute('aria-checked', 'true');
    swatchName.textContent = btn.dataset.name;
    swatchImg.classList.add('swap');
    const next = new Image();
    next.src = btn.dataset.img;
    next.onload = () => setTimeout(() => {
      swatchImg.src = btn.dataset.img;
      swatchImg.classList.remove('swap');
    }, 250);
  });
});
