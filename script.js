const slider = document.getElementById('slider');
const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.dot')];
const nav = [...document.querySelectorAll('[data-go]')];
const progress = document.querySelector('.progress span');
let current = 0;

function goTo(index) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides[current].scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateUI();
}
function updateUI() {
  dots.forEach((d,i)=>d.classList.toggle('active', i===current));
  document.querySelectorAll('.desktop-nav button').forEach((b,i)=>b.classList.toggle('active', i===current));
  progress.style.transform = `translateX(${current * 100}%)`;
}
nav.forEach(el=>el.addEventListener('click',()=>goTo(Number(el.dataset.go))));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const index = slides.indexOf(entry.target);
      if(index !== -1){ current=index; updateUI(); }
    }
  });
},{root:slider, threshold:.6});
slides.forEach(s=>observer.observe(s));

let touchStartY=0;
slider.addEventListener('touchstart',e=>{touchStartY=e.touches[0].clientY},{passive:true});
slider.addEventListener('touchend',e=>{
  const delta=touchStartY-e.changedTouches[0].clientY;
  if(Math.abs(delta)>55) goTo(current+(delta>0?1:-1));
},{passive:true});

window.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'||e.key==='ArrowRight') goTo(current+1);
  if(e.key==='ArrowUp'||e.key==='ArrowLeft') goTo(current-1);
});

document.getElementById('bookingForm').addEventListener('submit',e=>{
  e.preventDefault();
  document.getElementById('formMessage').textContent='Danke! Deine Anfrage wurde vorbereitet. Verbinde das Formular noch mit deiner E-Mail/Booking-Lösung, damit Anfragen tatsächlich versendet werden.';
});
updateUI();