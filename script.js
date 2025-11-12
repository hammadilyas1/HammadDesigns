/* script.js
   Slider (fade), profile toggle, staged hero fades, modal previews, accessibility.
*/
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* STAGED fades on load for hero */
window.addEventListener('load', () => {
  document.querySelectorAll('.staged').forEach(el => {
    const d = parseInt(el.dataset.delay || 0, 10);
    setTimeout(()=> el.classList.add('show'), d);
  });
});

/* BRAND click: scroll to hero + pop */
$('#brandBtn').addEventListener('click', ()=> {
  $('#hero').scrollIntoView({behavior:'smooth'});
  $('#hero').animate([{transform:'scale(.98)'},{transform:'scale(1)'}],{duration:360,easing:'ease-out'});
});

/* PROFILE card: show initially then slide away after 4s */
const profile = document.getElementById('profileCard');
if(profile){
  setTimeout(()=> {
    profile.style.opacity = '0';
    profile.style.transform = 'translateY(-8px) scale(.98)';
    profile.setAttribute('aria-hidden','true');
  }, 4000);
}

/* View Designer toggle (top button) */
let designerShown = false;
$('#viewDesignerBtn').addEventListener('click', () => {
  if(!profile) return;
  designerShown = !designerShown;
  if(designerShown){
    profile.style.opacity = '1';
    profile.style.transform = 'translateY(0) scale(1)';
    profile.setAttribute('aria-hidden','false');
    // bring into view a little
    profile.scrollIntoView({behavior:'smooth', block:'center'});
  } else {
    profile.style.opacity = '0';
    profile.style.transform = 'translateY(-8px) scale(.98)';
    profile.setAttribute('aria-hidden','true');
  }
});

/* Scroll hint */
$('#scrollHint').addEventListener('click', ()=> document.querySelector('#designs').scrollIntoView({behavior:'smooth'}));

/* SLIDER - fade-based */
const slides = Array.from(document.querySelectorAll('.slide'));
const prevBtn = $('#prev');
const nextBtn = $('#next');
const dotsWrap = $('#dots');
let current = 0;
let autoplay = true;
let autoplayInterval = 4200;
let autoplayTimer = null;

function showSlide(n){
  slides.forEach((s,i) => {
    s.classList.toggle('active', i === n);
  });
  // update dots
  Array.from(dotsWrap.children).forEach((d,i)=> d.classList.toggle('active', i === n));
  current = n;
}

function nextSlide(){
  showSlide((current + 1) % slides.length);
}
function prevSlide(){
  showSlide((current - 1 + slides.length) % slides.length);
}

/* build dots */
slides.forEach((_,i) => {
  const btn = document.createElement('button');
  btn.addEventListener('click', ()=> { showSlide(i); resetAutoplay(); });
  btn.setAttribute('aria-label', 'Go to slide ' + (i+1));
  dotsWrap.appendChild(btn);
});
showSlide(0);

/* autoplay */
function startAutoplay(){
  stopAutoplay();
  autoplayTimer = setInterval(()=> nextSlide(), autoplayInterval);
}
function stopAutoplay(){ if(autoplayTimer) clearInterval(autoplayTimer); autoplayTimer = null; }
function resetAutoplay(){ stopAutoplay(); startAutoplay(); }

if(autoplay) startAutoplay();

/* controls */
nextBtn.addEventListener('click', ()=> { nextSlide(); resetAutoplay(); });
prevBtn.addEventListener('click', ()=> { prevSlide(); resetAutoplay(); });

/* pause on hover */
const sliderEl = $('#slider');
sliderEl.addEventListener('mouseenter', stopAutoplay);
sliderEl.addEventListener('mouseleave', startAutoplay);

/* swipe for mobile */
let startX = 0;
sliderEl.addEventListener('pointerdown', e => { startX = e.clientX; sliderEl.setPointerCapture(e.pointerId); stopAutoplay(); });
sliderEl.addEventListener('pointerup', e => {
  const dx = e.clientX - startX;
  if(dx > 40) prevSlide();
  if(dx < -40) nextSlide();
  startAutoplay();
});

/* keyboard nav */
document.addEventListener('keydown', e => {
  if(e.key === 'ArrowLeft') prevSlide();
  if(e.key === 'ArrowRight') nextSlide();
});

/* MODAL for CV & Certificate - uses image previews */
// Modal behavior
const modal = $('#modal');
const modalImg = $('#modalImg');
const modalClose = $('#modalClose');

function openModal(src){
  modalImg.src = src;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden','true');
  modalImg.src = '';
  document.body.style.overflow = '';
}


$('#previewCv')?.addEventListener('click', ()=> openModal('images/Hammad-cv.jpg'));
$('#previewCert')?.addEventListener('click', ()=> openModal('images/certificate-preview.jpg'));
modalClose?.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=> { if(e.target === modal) closeModal(); });

/* make preview CV/CERT buttons change to accent color on hover (accessible via CSS) */
/* (CSS handles hover) */

