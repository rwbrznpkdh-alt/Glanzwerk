const slider=document.getElementById('slider');
const slides=[...document.querySelectorAll('.slide')];
const dots=[...document.querySelectorAll('.dot')];
const nav=[...document.querySelectorAll('[data-go]')];
const progress=document.querySelector('.progress span');
let current=0;
let startX=0;
let startY=0;
let moving=false;

function updateUI(){
  dots.forEach((d,i)=>d.classList.toggle('active',i===current));
  document.querySelectorAll('.desktop-nav button').forEach((b,i)=>b.classList.toggle('active',i===current));
  progress.style.transform=`translateX(${current*100}%)`;
  slider.style.transform=`translate3d(-${current*33.333333}%,0,0)`;
}
function goTo(index){
  current=Math.max(0,Math.min(slides.length-1,index));
  updateUI();
}
nav.forEach(el=>el.addEventListener('click',()=>goTo(Number(el.dataset.go))));

slider.addEventListener('touchstart',e=>{
  startX=e.touches[0].clientX;
  startY=e.touches[0].clientY;
  moving=false;
},{passive:true});
slider.addEventListener('touchmove',e=>{
  const dx=Math.abs(e.touches[0].clientX-startX);
  const dy=Math.abs(e.touches[0].clientY-startY);
  if(dx>dy&&dx>8)moving=true;
},{passive:true});
slider.addEventListener('touchend',e=>{
  const dx=startX-e.changedTouches[0].clientX;
  const dy=startY-e.changedTouches[0].clientY;
  if(moving&&Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy))goTo(current+(dx>0?1:-1));
},{passive:true});

slider.addEventListener('wheel',e=>{
  if(Math.abs(e.deltaX)>Math.abs(e.deltaY)&&Math.abs(e.deltaX)>15){
    e.preventDefault();
    goTo(current+(e.deltaX>0?1:-1));
  }
},{passive:false});

window.addEventListener('keydown',e=>{
  if(['ArrowRight','ArrowDown','PageDown'].includes(e.key)){e.preventDefault();goTo(current+1)}
  if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();goTo(current-1)}
});

document.getElementById('bookingForm').addEventListener('submit',e=>{
  e.preventDefault();
  document.getElementById('formMessage').textContent='Danke! Deine Anfrage wurde vorbereitet. Für den echten Versand verbinden wir das Formular noch mit E-Mail oder einer Buchungslösung.';
});

updateUI();