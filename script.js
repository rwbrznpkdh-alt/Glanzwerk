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

const bookingForm = document.getElementById('bookingForm');
const dateInput = document.getElementById('appointmentDate');
const timeInput = document.getElementById('appointmentTime');
const formMessage = document.getElementById('formMessage');

function isAllowedDay(dateString) {
  if (!dateString) return false;
  const day = new Date(dateString + 'T12:00:00').getDay();
  return day === 5 || day === 6 || day === 0;
}

function updateDateValidity() {
  if (!dateInput) return true;
  if (dateInput.value && !isAllowedDay(dateInput.value)) {
    dateInput.setCustomValidity('Bitte wähle einen Freitag, Samstag oder Sonntag.');
    return false;
  }
  dateInput.setCustomValidity('');
  return true;
}

dateInput?.addEventListener('change', updateDateValidity);

bookingForm?.addEventListener('submit', e => {
  e.preventDefault();
  formMessage.textContent = '';

  if (!updateDateValidity()) {
    dateInput.reportValidity();
    return;
  }

  if (!timeInput.value) {
    timeInput.reportValidity();
    return;
  }

  formMessage.textContent = 'Danke! Deine Anfrage wurde vorbereitet. Für den echten Versand verbinden wir das Formular noch mit Telegram.';
});

updateUI(0);