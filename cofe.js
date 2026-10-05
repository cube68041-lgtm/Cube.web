/* ============================================================
   CONFIG
============================================================ */
const OWNER_WHATSAPP = '919922724697';   // country code + number, no +
const CURRENCY       = '₹';
const STORAGE_KEY    = 'cube_order_cart_v1';

/* ============================================================
   HEADER — scroll state + active link
============================================================ */
const header   = document.getElementById('header');
const toTop    = document.getElementById('toTop');
const navLinks = document.querySelectorAll('.nav a');
const sections = [...document.querySelectorAll('section[id]')];

function onScroll(){
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 40);
  toTop.classList.toggle('show', y > 600);

  let current = 'home';
  sections.forEach(sec => { if (y >= sec.offsetTop - 140) current = sec.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

/* ============================================================
   MOBILE DRAWER
============================================================ */
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');

function toggleDrawer(force){
  const open = force !== undefined ? force : !drawer.classList.contains('open');
  drawer.classList.toggle('open', open);
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  if (open) document.body.style.overflow = 'hidden';
  else if (!cartDrawer.classList.contains('open')) document.body.style.overflow = '';
}
burger.addEventListener('click', () => toggleDrawer());
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleDrawer(false)));

/* ============================================================
   REVEAL ON SCROLL
============================================================ */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, {threshold:0.12, rootMargin:'0px 0px -60px 0px'});
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

/* ============================================================
   MENU FILTER
============================================================ */
const tabs      = document.querySelectorAll('.tab');
const menuItems = document.querySelectorAll('.menu-item');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;

    menuItems.forEach((item, i) => {
      const show = cat === 'all' || item.dataset.cat === cat;
      item.classList.toggle('hide', !show);
      if (show){
        item.style.animation = 'none';
        void item.offsetWidth;
        item.style.animation = `popIn .5s var(--ease) ${i * 0.035}s both`;
      }
    });
  });
});

/* ============================================================
   TESTIMONIAL SLIDER
============================================================ */
const slides  = [...document.querySelectorAll('.slide')];
const dotsBox = document.getElementById('dots');
let currentSlide = 0;
let slideTimer;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
  dot.addEventListener('click', () => goToSlide(i));
  dotsBox.appendChild(dot);
});
const dots = [...dotsBox.children];

function goToSlide(index){
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  restartAutoplay();
}
function restartAutoplay(){
  clearInterval(slideTimer);
  slideTimer = setInterval(() => goToSlide(currentSlide + 1), 6000);
}
restartAutoplay();

const sliderEl = document.getElementById('slider');
sliderEl.addEventListener('mouseenter', () => clearInterval(slideTimer));
sliderEl.addEventListener('mouseleave', restartAutoplay);

/* ============================================================
   TODAY'S HOURS
============================================================ */
const today = new Date().getDay();
document.querySelectorAll('.hours-row').forEach(row => {
  if (Number(row.dataset.day) === today) row.classList.add('today');
});

/* ============================================================
   NEWSLETTER
============================================================ */
const nlForm  = document.getElementById('nlForm');
const nlEmail = document.getElementById('nlEmail');
const nlMsg   = document.getElementById('nlMsg');

nlForm.addEventListener('submit', e => {
  e.preventDefault();
  const value = nlEmail.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (!valid){
    nlMsg.style.color = '#ff8b7a';
    nlMsg.textContent = 'Please enter a valid email address.';
    nlEmail.focus();
    return;
  }
  nlMsg.style.color = 'var(--gold)';
  nlMsg.textContent = 'Thanks! Check your inbox for a welcome treat ☕';
  nlEmail.value = '';
  setTimeout(() => { nlMsg.textContent = ''; }, 5000);
});

/* ============================================================
   MARQUEE — duplicate for seamless loop
============================================================ */
const track = document.getElementById('marqueeTrack');
track.innerHTML += track.innerHTML;

/* ============================================================
   BACK TO TOP
============================================================ */
toTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
document.getElementById('year').textContent = new Date().getFullYear();

/* ============================================================
   HERO PARALLAX
============================================================ */
const heroWrap = document.querySelector('.hero .wrap');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight){
    heroWrap.style.transform = `translateY(${y * 0.16}px)`;
    heroWrap.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.85));
  }
}, {passive:true});

/* ============================================================
   ★ ORDER SYSTEM — WHATSAPP ONLY ★
============================================================ */

/* ---- DOM refs ---- */
const cartFab      = document.getElementById('cartFab');
const fabBadge     = document.getElementById('fabBadge');
const cartDrawer   = document.getElementById('cartDrawer');
const cartClose    = document.getElementById('cartClose');
const overlay      = document.getElementById('overlay');
const cartItemsBox = document.getElementById('cartItems');
const cartEmpty    = document.getElementById('cartEmpty');
const cartCount    = document.getElementById('cartCount');
const cartTotal    = document.getElementById('cartTotal');
const cartTitle    = document.getElementById('cartTitle');
const cartNote     = document.getElementById('cartNote');
const checkoutForm = document.getElementById('checkoutForm');
const backToCart   = document.getElementById('backToCart');
const sendBtn      = document.getElementById('sendBtn');
const sendLabel    = document.getElementById('sendLabel');
const toast        = document.getElementById('toast');
const toastMsg     = document.getElementById('toastMsg');

/* ---- dine/delivery toggle ---- */
const dineToggle   = document.getElementById('dineToggle');
const dineOpts     = dineToggle.querySelectorAll('.dine-opt');
const tableField   = document.getElementById('tableField');
const addressField = document.getElementById('addressField');

/* ---- form fields ---- */
const cName    = document.getElementById('cName');
const cMobile  = document.getElementById('cMobile');
const cTable   = document.getElementById('cTable');
const cAddress = document.getElementById('cAddress');
const cNotes   = document.getElementById('cNotes');

const errName    = document.getElementById('errName');
const errMobile  = document.getElementById('errMobile');
const errTable   = document.getElementById('errTable');
const errAddress = document.getElementById('errAddress');

/* ---- state ---- */
let cart = [];
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) cart = JSON.parse(saved) || [];
} catch(e){ cart = []; }

let currentView = 'list';      // 'list' | 'checkout'
let dineMode    = 'dine';      // 'dine' | 'delivery'

function saveCart(){
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch(e){}
}

/* ---- helpers ---- */
const money   = n => CURRENCY + Number(n).toLocaleString('en-IN');
const cartQty = () => cart.reduce((s,i) => s + i.qty, 0);
const cartSum = () => cart.reduce((s,i) => s + i.qty * i.price, 0);

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

/* ---- toast ---- */
let toastTimer;
function showToast(message, isError){
  toastMsg.textContent = message;
  toast.classList.toggle('error', !!isError);
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ============================================================
   DINE IN / DELIVERY MODE
============================================================ */
function setDineMode(mode){
  dineMode = mode;

  dineOpts.forEach(btn => {
    const active = btn.dataset.mode === mode;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', active);
  });

  tableField.hidden   = (mode !== 'dine');
  addressField.hidden = (mode !== 'delivery');
  clearAllErrors();
}

dineOpts.forEach(btn => {
  btn.addEventListener('click', () => setDineMode(btn.dataset.mode));
});

/* ============================================================
   RENDER CART
============================================================ */
function renderCart(){
  const qty   = cartQty();
  const total = cartSum();

  fabBadge.textContent = qty;
  fabBadge.classList.toggle('show', qty > 0);

  cartCount.textContent = qty;
  cartTotal.textContent = money(total);

  if (cart.length === 0){
    cartItemsBox.innerHTML = '';
  } else {
    cartItemsBox.innerHTML = cart.map((item, idx) => `
      <div class="cart-item" data-idx="${idx}">
        <div class="ci-icon">${item.icon || '🍽️'}</div>
        <div class="ci-info">
          <h4>${escapeHtml(item.name)}</h4>
          <span class="ci-unit">${money(item.price)} each</span>
        </div>
        <div class="ci-right">
          <span class="ci-price">${money(item.price * item.qty)}</span>
          <div class="qty">
            <button type="button" data-act="dec" data-idx="${idx}" aria-label="Decrease">−</button>
            <span>${item.qty}</span>
            <button type="button" data-act="inc" data-idx="${idx}" aria-label="Increase">+</button>
          </div>
        </div>
        <button class="ci-remove" data-act="del" data-idx="${idx}" aria-label="Remove item">
          <svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
    `).join('');
  }

  cartEmpty.classList.toggle('show', currentView === 'list' && cart.length === 0);
}

/* ---- view switching ---- */
function showView(view){
  currentView = view;

  checkoutForm.classList.toggle('show', view === 'checkout');
  cartItemsBox.style.display = (view === 'list') ? '' : 'none';
  cartEmpty.classList.toggle('show', view === 'list' && cart.length === 0);

  if (view === 'list'){
    cartTitle.textContent = 'Order List';
    cartNote.textContent  = 'Your order will open in WhatsApp, ready to send to us.';
    sendLabel.textContent = 'Continue';
  } else {
    cartTitle.textContent = 'Your Details';
    cartNote.textContent  = 'Your order will open in WhatsApp, ready to send to us.';
    sendLabel.textContent = 'Send Order on WhatsApp';
  }
}

/* ---- cart item interactions ---- */
cartItemsBox.addEventListener('click', e => {
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  const idx = Number(btn.dataset.idx);
  const act = btn.dataset.act;
  if (!cart[idx]) return;

  if (act === 'inc'){
    cart[idx].qty++;
  } else if (act === 'dec'){
    cart[idx].qty--;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
  } else if (act === 'del'){
    const removed = cart[idx].name;
    cart.splice(idx, 1);
    showToast(removed + ' removed from order');
  }

  saveCart();
  renderCart();
});

/* ---- add to cart ---- */
function addToCart(name, price, icon, sourceEl){
  const existing = cart.find(i => i.name === name);
  if (existing) existing.qty++;
  else cart.push({ name, price: Number(price), icon: icon || '🍽️', qty: 1 });

  saveCart();
  renderCart();

  bumpFab();
  flyToCart(sourceEl);
  showToast(name + ' added to your order');
}

function bumpFab(){
  cartFab.classList.remove('bump');
  void cartFab.offsetWidth;
  cartFab.classList.add('bump');
}

function flyToCart(sourceEl){
  if (!sourceEl) return;
  const start = sourceEl.getBoundingClientRect();
  const end   = cartFab.getBoundingClientRect();

  const dot = document.createElement('div');
  dot.className = 'fly-dot';
  dot.style.left = (start.left + start.width / 2 - 8) + 'px';
  dot.style.top  = (start.top + start.height / 2 - 8) + 'px';
  document.body.appendChild(dot);

  requestAnimationFrame(() => {
    const dx = (end.left + end.width / 2) - (start.left + start.width / 2);
    const dy = (end.top + end.height / 2) - (start.top + start.height / 2);
    dot.style.transform = `translate(${dx}px, ${dy}px) scale(.4)`;
    dot.style.opacity = '0';
  });

  setTimeout(() => dot.remove(), 800);
}

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    addToCart(item.dataset.name, item.dataset.price, item.dataset.icon, item);
  });
});
/* ---- open / close drawer ---- */
function openCart(){
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  renderCart();
  showView('list');
}
function closeCart(){
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('show');
  if (!drawer.classList.contains('open')) document.body.style.overflow = '';
  setTimeout(() => showView('list'), 350);
}

cartFab.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && cartDrawer.classList.contains('open')) closeCart();
});

/* ---- checkout view ---- */
function showCheckout(){
  if (cart.length === 0){
    showToast('Your order list is empty', true);
    return;
  }
  showView('checkout');
  setTimeout(() => {
    checkoutForm.scrollIntoView({behavior:'smooth', block:'start'});
  }, 120);
}

backToCart.addEventListener('click', e => {
  e.preventDefault();
  showView('list');
});

/* ---- send button: 1st click = show form, 2nd = send to WhatsApp ---- */
sendBtn.addEventListener('click', () => {
  if (currentView !== 'checkout'){ showCheckout(); return; }
  sendViaWhatsApp();
});

/* ============================================================
   VALIDATION
============================================================ */
function setError(input, errEl, show){
  input.classList.toggle('invalid', show);
  errEl.classList.toggle('show', show);
}

function clearAllErrors(){
  [[cName,errName],[cMobile,errMobile],
   [cTable,errTable],[cAddress,errAddress]]
    .forEach(([input, err]) => setError(input, err, false));
}

function validateForm(){
  let ok = true;

  const nameVal = cName.value.trim();
  if (nameVal.length < 2){ setError(cName, errName, true); ok = false; }
  else setError(cName, errName, false);

  const mobileVal = cMobile.value.replace(/[^\d]/g, '');
  if (mobileVal.length < 10 || mobileVal.length > 15){ setError(cMobile, errMobile, true); ok = false; }
  else setError(cMobile, errMobile, false);

  if (dineMode === 'dine'){
    const tableVal = cTable.value.trim();
    if (!/^\d{1,4}$/.test(tableVal)){ setError(cTable, errTable, true); ok = false; }
    else setError(cTable, errTable, false);
  } else {
    const addrVal = cAddress.value.trim();
    if (addrVal.length < 8){ setError(cAddress, errAddress, true); ok = false; }
    else setError(cAddress, errAddress, false);
  }

  return ok;
}

[[cName,errName],[cMobile,errMobile],
 [cTable,errTable],[cAddress,errAddress]].forEach(([input,err])=>{
  input.addEventListener('input', () => setError(input, err, false));
});
/* ============================================================
   BUILD WHATSAPP MESSAGE
============================================================ */
function buildWhatsAppText(){
  const isDine = dineMode === 'dine';
  const now    = new Date().toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' });

  const lines = [];
  lines.push('🧾 *New Order — Cube*');
  lines.push('');
  lines.push('*Order Type*: ' + (isDine ? '🍽️ Dine In' : '🛵 Delivery'));
  lines.push('');
  lines.push('*Customer Details*');
  lines.push('• Name: ' + cName.value.trim());
  lines.push('• Mobile: ' + cMobile.value.trim());
  if (isDine){
    lines.push('• Table No.: ' + cTable.value.trim());
  } else {
    lines.push('• Address: ' + cAddress.value.trim());
  }
  const notes = cNotes.value.trim();
  if (notes) lines.push('• Notes: ' + notes);

  lines.push('');
  lines.push('*Order Items*');
  cart.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.name}  x${item.qty}  —  ${money(item.price * item.qty)}`);
  });

  lines.push('');
  lines.push('*Summary*');
  lines.push('• Total Items: ' + cartQty());
  lines.push('• Total Amount: ' + money(cartSum()));
  lines.push('• Placed At: ' + now);

  return lines.join('\n');
}

function sendViaWhatsApp(){
  if (!validateForm()){
    showToast('Please fill in all required details', true);
    return;
  }

  const text = buildWhatsAppText();
  const url  = 'https://wa.me/' + OWNER_WHATSAPP + '?text=' + encodeURIComponent(text);

  // clear basket + reset form
  cart = [];
  saveCart();
  renderCart();
  checkoutForm.reset();
  clearAllErrors();
  setDineMode('dine');
  showView('list');

  // open WhatsApp
  window.open(url, '_blank', 'noopener');

  showToast('Opening WhatsApp with your order…');
  setTimeout(closeCart, 600);
}

/* ============================================================
   INIT
============================================================ */
setDineMode('dine');
renderCart();
showView('list');


