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

const TELEGRAM_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbybG8atqQtNp7bwYbgqVi_npnmj2cXRNey7qsGAQXV72lrgzMwnN_19XFjKr60KInDprA/exec';

function isAllowedDay(dateString) {
  if (!dateString) return false;
  const day = new Date(dateString + 'T12:00:00').getDay();
  return day === 5 || day === 6 || day === 0;
}

function updateDateValidity(showMessage = false) {
  if (!dateInput) return true;

  if (dateInput.value && !isAllowedDay(dateInput.value)) {
    dateInput.setCustomValidity('Bitte wähle einen Freitag, Samstag oder Sonntag.');
    if (showMessage && formMessage) {
      formMessage.textContent = 'Termine sind nur Freitag, Samstag und Sonntag möglich.';
    }
    return false;
  }

  dateInput.setCustomValidity('');
  return true;
}

dateInput?.addEventListener('change', () => updateDateValidity(true));
dateInput?.addEventListener('input', () => updateDateValidity(false));

timeInput?.addEventListener('input', () => {
  if (formMessage && timeInput.value) formMessage.textContent = '';
});

bookingForm?.addEventListener('submit', async e => {
  e.preventDefault();
  if (formMessage) formMessage.textContent = '';

  if (!dateInput?.value) {
    dateInput?.reportValidity();
    return;
  }

  if (!updateDateValidity(true)) {
    dateInput.reportValidity();
    return;
  }

  if (!timeInput?.value) {
    if (formMessage) formMessage.textContent = 'Bitte wähle auch eine genaue Uhrzeit.';
    timeInput?.reportValidity();
    return;
  }

  const formData = new FormData(bookingForm);
  const data = Object.fromEntries(formData.entries());

  const submitButton = bookingForm.querySelector('.submit');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.style.opacity = '0.7';
    submitButton.querySelector('span')?.replaceWith(document.createTextNode('…'));
  }

  try {
    await fetch(TELEGRAM_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(data)
    });

    formMessage.textContent = 'Danke! Deine Anfrage wurde gesendet. Wir melden uns so schnell wie möglich.';
    bookingForm.reset();
  } catch (error) {
    console.error('Glanzwerk Anfrage:', error);
    formMessage.textContent = 'Leider ist beim Senden etwas schiefgelaufen. Bitte versuche es erneut.';
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.style.opacity = '';
    }
  }
});

updateUI(0);