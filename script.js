const slider=document.getElementById('slider');
const slides=[...document.querySelectorAll('.slide')];
const dots=[...document.querySelectorAll('.dot')];
const nav=[...document.querySelectorAll('[data-go]')];
const progress=document.querySelector('.progress span');
let current=0;
let locked=false;

function updateUI(){
  dots.forEach((d,i)=>d.classList.toggle('active',i===current));
  document.querySelectorAll('.desktop-nav button').forEach((b,i)=>b.classList.toggle('active',i===current));
  progress.style.transform=`translateX(${current*100}%)`;
}
function goTo(index){
  if(locked)return;
  current=Math.max(0,Math.min(slides.length-1,index));
  locked=true;
  slider.scrollTo({top:current*slider.clientHeight,behavior:'smooth'});
  updateUI();
  setTimeout(()=>locked=false,650);
}
nav.forEach(el=>el.addEventListener('click',()=>goTo(Number(el.dataset.go))));

let wheelLocked=false;
slider.addEventListener('wheel',e=>{
  if(Math.abs(e.deltaY)<15)return;
  e.preventDefault();
  if(wheelLocked)return;
  wheelLocked=true;
  goTo(current+(e.deltaY>0?1:-1));
  setTimeout(()=>wheelLocked=false,700);
},{passive:false});

let touchStartY=0;
slider.addEventListener('touchstart',e=>{touchStartY=e.touches[0].clientY},{passive:true});
slider.addEventListener('touchend',e=>{
  const delta=touchStartY-e.changedTouches[0].clientY;
  if(Math.abs(delta)>55)goTo(current+(delta>0?1:-1));
},{passive:true});

slider.addEventListener('scroll',()=>{
  if(locked)return;
  const index=Math.round(slider.scrollTop/slider.clientHeight);
  if(index!==current){current=index;updateUI();}
},{passive:true});

window.addEventListener('keydown',e=>{
  if(['ArrowDown','ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();goTo(current+1)}
  if(['ArrowUp','ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();goTo(current-1)}
});

document.getElementById('bookingForm').addEventListener('submit',e=>{
  e.preventDefault();
  document.getElementById('formMessage').textContent='Danke! Deine Anfrage wurde vorbereitet. Für den echten Versand verbinden wir das Formular noch mit E-Mail oder einer Buchungslösung.';
});

window.addEventListener('resize',()=>slider.scrollTo({top:current*slider.clientHeight}));
updateUI();