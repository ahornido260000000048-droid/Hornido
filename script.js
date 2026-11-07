const $ = (id) => document.getElementById(id);

// ---------- Photos (Google Drive link first, local file as fallback) ----------
document.querySelectorAll('img[data-drive]').forEach((img) => {
  img.onerror = () => { img.onerror = () => { img.removeAttribute('src'); }; img.src = img.dataset.fallback; };
  img.src = `https://drive.google.com/thumbnail?id=${img.dataset.drive}&sz=w900`;
});

// ---------- Toast ----------
let toastT;
function toast(msg, ms) {
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), ms);
}

// ---------- Fridge door: drag to open ----------
const fridge = $('fridge'), door = $('door');
let startX = 0, dragging = false, moved = false, isOpen = false;
const setAngle = (a) => door.style.setProperty('--a', a);

function openFridge() {
  isOpen = true; setAngle(100); fridge.classList.add('open'); door.style.pointerEvents = 'none';
  $('caption').classList.add('hidden'); $('closeWrap').classList.remove('hidden');
}
function closeFridge() {
  isOpen = false; setAngle(0); fridge.classList.remove('open'); door.style.pointerEvents = '';
  $('caption').classList.remove('hidden'); $('closeWrap').classList.add('hidden');
  $('inside').scrollTop = 0;
}
door.addEventListener('pointerdown', (e) => {
  if (isOpen) return;
  dragging = true; moved = false; startX = e.clientX;
  door.classList.add('drag'); door.setPointerCapture(e.pointerId);
});
door.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = Math.abs(e.clientX - startX);
  if (dx > 4) moved = true;
  setAngle(Math.min(dx / (door.offsetWidth * 0.75) * 100, 100));
});
const endDrag = () => {
  if (!dragging) return;
  dragging = false; door.classList.remove('drag');
  const a = parseFloat(door.style.getPropertyValue('--a')) || 0;
  a > 30 ? openFridge() : setAngle(0);
};
door.addEventListener('pointerup', endDrag);
door.addEventListener('pointercancel', endDrag);
// Keyboard / assistive access: press the handle
[$('hdlTop'), $('hdlBot')].forEach((h) => h.addEventListener('click', () => { if (!moved && !isOpen) openFridge(); }));
$('closeBtn').addEventListener('click', closeFridge);

// ---------- Modals ----------
function openModal(id) { $(id).classList.add('show'); }
function closeModals() { document.querySelectorAll('.modal.show').forEach((m) => m.classList.remove('show')); cancelAnimationFrame(raf); }
document.querySelectorAll('.modal').forEach((m) => m.addEventListener('click', (e) => { if (e.target === m || e.target.hasAttribute('data-close')) closeModals(); }));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModals(); });

// ---------- Navigation map animation: CHURCH -> THIRDY'S ----------
let raf;
function playRoute() {
  const p = $('route'), dot = $('dot'), len = p.getTotalLength();
  const dur = matchMedia('(prefers-reduced-motion: reduce)').matches ? 10 : 5000;
  p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
  cancelAnimationFrame(raf);
  let t0 = null;
  const step = (t) => {
    if (t0 === null) t0 = t;
    const k = Math.min((t - t0) / dur, 1);
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    p.style.strokeDashoffset = len * (1 - e);
    const pt = p.getPointAtLength(len * e);
    dot.setAttribute('transform', `translate(${pt.x},${pt.y})`);
    if (k < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}
$('mapBtn').addEventListener('click', () => { openModal('mapModal'); playRoute(); });
$('replay').addEventListener('click', playRoute);

// ---------- Menu twist ----------
$('twistBtn').addEventListener('click', () => toast('🍚 YOU CAN HAVE UNLIMITED RICE', 3000));

// ---------- Push me -> calculator ----------
$('pushBtn').addEventListener('click', () => {
  const b = $('pushBtn'); b.classList.add('pressed');
  setTimeout(() => { b.classList.remove('pressed'); openModal('calcModal'); }, 220);
});

// ---------- Hint ----------
let hintOn = false;
$('hint').addEventListener('click', () => {
  hintOn = !hintOn;
  $('hintText').textContent = hintOn ? 'Was a debutant last year' : 'tap me';
});

// ---------- Calculator ----------
let cur = '0', prev = null, op = null, reset = false;
const disp = $('calcDisp');
const fmt = (n) => String(+n.toFixed(10));
const compute = (a, b, o) => o === '+' ? a + b : o === '-' ? a - b : o === '×' ? a * b : b === 0 ? NaN : a / b;
const show = () => { disp.textContent = cur.length > 12 ? Number(cur).toExponential(5) : cur; };
const check19 = () => { if (cur === '19') toast('KKB PO TAYO!', 5000); };

function press(k) {
  if (cur === 'Error' && k !== 'C') return;
  if (/^\d$/.test(k)) { cur = (reset || cur === '0') ? k : cur + k; reset = false; }
  else if (k === '.') { if (reset) { cur = '0.'; reset = false; } else if (!cur.includes('.')) cur += '.'; }
  else if (k === 'C') { cur = '0'; prev = null; op = null; reset = false; }
  else if (k === '⌫') { cur = (cur.length > 1 && !reset) ? cur.slice(0, -1) : '0'; }
  else if ('+-×÷'.includes(k)) {
    if (op && !reset) { const r = compute(prev, +cur, op); cur = Number.isFinite(r) ? fmt(r) : 'Error'; check19(); }
    prev = +cur; op = k; reset = true;
  } else if (k === '=') {
    if (op) { const r = compute(prev, +cur, op); cur = Number.isFinite(r) ? fmt(r) : 'Error'; prev = null; op = null; }
    reset = true; check19();
  }
  show();
}
$('keys').addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) press(b.dataset.k); });
document.addEventListener('keydown', (e) => {
  if (!$('calcModal').classList.contains('show')) return;
  const map = { '*': '×', '/': '÷', Enter: '=', Backspace: '⌫', Delete: 'C' };
  const k = map[e.key] || e.key;
  if (/^[\d.+\-×÷=⌫C]$/.test(k)) { e.preventDefault(); press(k); }
});
