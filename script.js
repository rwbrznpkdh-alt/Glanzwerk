const slider = document.getElementById('slider');
const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.dot')];
const nav = [...document.querySelectorAll('[data-go]')];
const progress = document.querySelector('.progress span');
let current = 0;

function updateUI(index) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
  document.querySelectorAll('.desktop-nav button').forEach((b, i) => b.classList.toggle('active', i === current));
  if (progress) progress.style.transform = `translateX(${current * 100}%)`;
}

function goTo(index) {
  const target = slides[Math.max(0, Math.min(slides.length - 1, index))];
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

nav.forEach(el => el.addEventListener('click', () => goTo(Number(el.dataset.go))));

dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) updateUI(slides.indexOf(entry.target));
  });
}, { threshold: 0.35 });
slides.forEach(slide => observer.observe(slide));

window.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    e.preventDefault();
    goTo(current + 1);
  }
  if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    goTo(current - 1);
  }
});

document.getElementById('bookingForm').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('formMessage').textContent = 'Danke! Deine Anfrage wurde vorbereitet. Für den echten Versand verbinden wir das Formular noch mit E-Mail oder einer Buchungslösung.';
});

updateUI(0);