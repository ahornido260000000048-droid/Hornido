const $ = (id) => document.getElementById(id);

/* ================= SOUND (Web Audio, no files needed) ================= */
let actx, soundOn = true;
const audio = () => { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); return actx; };
function tone(f, d = 0.08, type = 'sine', vol = 0.15, when = 0, slide = 0) {
  if (!soundOn) return;
  const c = audio(), t = c.currentTime + when, o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), t + d);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + d);
  o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + 0.02);
}
function noise(d = 0.15, freq = 800, vol = 0.2, when = 0) {
  if (!soundOn) return;
  const c = audio(), n = Math.floor(c.sampleRate * d), buf = c.createBuffer(1, n, c.sampleRate), data = buf.getChannelData(0);
  for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), t = c.currentTime + when;
  s.buffer = buf; f.type = 'bandpass'; f.frequency.value = freq; g.gain.setValueAtTime(vol, t);
  s.connect(f); f.connect(g); g.connect(c.destination); s.start(t);
}
const sfx = {
  key: (k) => { const base = /\d/.test(k) ? 420 + Number(k) * 55 : k === '.' ? 380 : 700; tone(base, 0.07, 'square', 0.07); tone(base * 1.5, 0.05, 'triangle', 0.05, 0.02); },
  op: () => { tone(740, 0.08, 'square', 0.07); tone(980, 0.06, 'triangle', 0.05, 0.03); },
  clear: () => tone(300, 0.14, 'sawtooth', 0.07, 0, -140),
  eq: () => { tone(523, 0.12, 'triangle', 0.1); tone(659, 0.12, 'triangle', 0.1, 0.09); tone(784, 0.2, 'triangle', 0.1, 0.18); },
  push: () => { noise(0.05, 2400, 0.25); tone(140, 0.12, 'square', 0.12, 0.02, -50); },
  open: () => { noise(0.4, 500, 0.22); tone(180, 0.35, 'sine', 0.1, 0, -70); tone(900, 0.12, 'sine', 0.05, 0.3); },
  thunk: () => { tone(95, 0.22, 'sine', 0.4, 0, -45); noise(0.12, 260, 0.35); },
  pop: () => tone(520, 0.1, 'sine', 0.12, 0, 380),
  win: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, 0.16, 'triangle', 0.12, i * 0.11)),
};
$('snd').addEventListener('click', () => { soundOn = !soundOn; $('snd').textContent = soundOn ? '🔊' : '🔇'; if (soundOn) sfx.pop(); });

/* ================= PHOTOS ================= */
document.querySelectorAll('img[data-drive]').forEach((img) => {
  img.onerror = () => { img.onerror = () => img.removeAttribute('src'); img.src = img.dataset.fallback; };
  img.src = `https://drive.google.com/thumbnail?id=${img.dataset.drive}&sz=w900`;
});

/* ================= TOAST ================= */
let toastT;
function toast(msg, ms) {
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), ms);
}

/* ================= FRIDGE: spring-physics door ================= */
const fridge = $('fridge'), door = $('door'), MAX = 88;
let angle = 0, vel = 0, springId, startX = 0, dragging = false, moved = false, isOpen = false;

function setA(a) {
  angle = a;
  door.style.setProperty('--a', a.toFixed(2));
  fridge.style.setProperty('--o', Math.min(1, a / MAX).toFixed(3));
}
function springTo(target, k, c) {
  cancelAnimationFrame(springId);
  let last = performance.now(), hit = false;
  const step = (now) => {
    const dt = Math.min((now - last) / 1000, 0.032); last = now;
    vel += ((target - angle) * k - vel * c) * dt;
    let a = angle + vel * dt;
    if (a < 0) { a = 0; if (!hit && Math.abs(vel) > 20) { hit = true; thunk(); } vel = -vel * 0.22; }
    if (a > MAX + 5) { a = MAX + 5; vel = -vel * 0.3; }
    setA(a);
    if (Math.abs(vel) < 0.4 && Math.abs(target - a) < 0.25) { setA(target); return; }
    springId = requestAnimationFrame(step);
  };
  springId = requestAnimationFrame(step);
}
function thunk() {
  sfx.thunk(); fridge.classList.remove('thump'); void fridge.offsetWidth; fridge.classList.add('thump');
}
function confetti() {
  const colors = ['#7fb2d8', '#fbf3e0', '#35557f', '#e8799f', '#f0cf79', '#e0594d'];
  for (let i = 0; i < 34; i++) {
    const s = document.createElement('i'); s.className = 'confetti';
    s.style.left = 10 + Math.random() * 80 + '%'; s.style.background = colors[i % colors.length];
    s.style.setProperty('--dx', (Math.random() * 30 - 15) + 'cqw'); s.style.setProperty('--rot', (Math.random() * 900 - 450) + 'deg');
    s.style.animationDelay = Math.random() * 0.4 + 's'; s.style.animationDuration = 1.8 + Math.random() * 1.2 + 's';
    fridge.appendChild(s); setTimeout(() => s.remove(), 3500);
  }
}
function openFridge() {
  if (isOpen) return;
  isOpen = true; vel = 0; sfx.open(); springTo(MAX, 70, 9); confetti();
  door.style.pointerEvents = 'none'; fridge.classList.add('open');
  $('caption').classList.add('hidden'); $('closeWrap').classList.remove('hidden');
}
function closeFridge() {
  isOpen = false; vel = 0; springTo(0, 120, 14);
  door.style.pointerEvents = ''; fridge.classList.remove('open');
  $('caption').classList.remove('hidden'); $('closeWrap').classList.add('hidden');
  $('inside').scrollTop = 0;
}
door.addEventListener('pointerdown', (e) => {
  if (isOpen) return;
  cancelAnimationFrame(springId); dragging = true; moved = false; startX = e.clientX; vel = 0;
  door.classList.add('drag'); door.setPointerCapture(e.pointerId);
});
door.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = Math.abs(e.clientX - startX);
  if (dx > 4) moved = true;
  setA(Math.max(0, Math.min(MAX, dx / (door.offsetWidth * 0.7) * MAX)));
});
function endDrag() {
  if (!dragging) return;
  dragging = false; door.classList.remove('drag');
  if (angle > 22) { isOpen = false; openFridge(); } else springTo(0, 120, 14);
}
door.addEventListener('pointerup', endDrag);
door.addEventListener('pointercancel', endDrag);
[$('hdlTop'), $('hdlBot')].forEach((h) => h.addEventListener('click', () => { if (!moved && !isOpen) openFridge(); }));
$('closeBtn').addEventListener('click', closeFridge);

/* ================= MODALS ================= */
let raf;
const openModal = (id) => $(id).classList.add('show');
function closeModals() { document.querySelectorAll('.modal.show').forEach((m) => m.classList.remove('show')); cancelAnimationFrame(raf); }
document.querySelectorAll('.modal').forEach((m) => m.addEventListener('click', (e) => { if (e.target === m || e.target.hasAttribute('data-close')) closeModals(); }));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModals(); });

/* ================= MAP: CHURCH -> THIRDY'S =================
   Put the REAL details here. Each leg = one street (name + direction text + points on the 400x260 map).
   The "Live map" tab uses the two search queries below to show real Google directions. */
const PLACES = {
  church: { name: 'CHURCH', query: '' },                       // e.g. 'Your Church Name, Street, Davao City'
  thirdys: { name: "THIRDY'S", query: "Thirdy's Food Haus Davao City" },
};
const ROUTE = [
  { street: 'Church exit', text: 'Leave the CHURCH and head to the main road', pts: [[50, 215], [110, 190]] },
  { street: 'Main road', text: 'Go straight along the main road', pts: [[110, 190], [110, 95]] },
  { street: 'Cross street', text: 'Turn right and keep going', pts: [[110, 95], [300, 95]] },
  { street: "Thirdy's street", text: "Turn left — THIRDY'S Food Haus is ahead", pts: [[300, 95], [300, 40], [350, 40]] },
];
const NS = 'http://www.w3.org/2000/svg';
const mk = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };
let fullPath, cum = [], total = 0;
function buildMap() {
  const legs = $('legs'), pins = $('pins'); legs.innerHTML = ''; pins.innerHTML = ''; cum = []; total = 0;
  const pts = []; ROUTE.forEach((l) => l.pts.forEach((p, i) => { if (!pts.length || i > 0) pts.push(p); }));
  const d = 'M' + pts.map((p) => p.join(' ')).join(' L');
  const st = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  mk('path', { ...st, d, stroke: '#35557f', 'stroke-opacity': 0.18, 'stroke-width': 8 }, legs);
  fullPath = mk('path', { ...st, d, stroke: '#e0594d', 'stroke-width': 5 }, legs);
  ROUTE.forEach((l, i) => {
    const ld = 'M' + l.pts.map((p) => p.join(' ')).join(' L');
    const p = mk('path', { id: 'leg' + i, d: ld, fill: 'none' }, legs);
    total += p.getTotalLength(); cum.push(total);
    const t = mk('text', { class: 'slabel', dy: -7 }, legs);
    const tp = mk('textPath', { href: '#leg' + i, startOffset: '50%', 'text-anchor': 'middle' }, t); tp.textContent = l.street;
  });
  const a = pts[0], b = pts[pts.length - 1];
  [[a, '⛪', PLACES.church.name, '#35557f', 24], [b, '🍽️', PLACES.thirdys.name, '#e0594d', -14]].forEach(([p, ic, nm, col, dy]) => {
    const e = mk('text', { x: p[0], y: p[1] + 8, 'font-size': 22, 'text-anchor': 'middle' }, pins); e.textContent = ic;
    const w = nm.length * 6.4 + 14;
    mk('rect', { x: p[0] - w / 2, y: p[1] + dy - (dy > 0 ? 0 : 12) + (dy > 0 ? 0 : 0), width: w, height: 16, rx: 8, fill: col }, pins);
    const tx = mk('text', { class: 'pin-l', x: p[0], y: p[1] + dy - (dy > 0 ? 0 : 12) + 11.5, 'text-anchor': 'middle' }, pins); tx.textContent = nm;
  });
  $('steps').innerHTML = ROUTE.map((l) => `<li>${l.text} · <b>${l.street}</b></li>`).join('');
}
function playRoute() {
  const dot = $('dot'), arrow = $('arrow'), len = fullPath.getTotalLength(), items = [...$('steps').children];
  const dur = matchMedia('(prefers-reduced-motion: reduce)').matches ? 10 : 7000;
  fullPath.style.strokeDasharray = len; fullPath.style.strokeDashoffset = len;
  cancelAnimationFrame(raf); let t0 = null;
  const step = (t) => {
    if (t0 === null) t0 = t;
    const k = Math.min((t - t0) / dur, 1), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, L = len * e;
    fullPath.style.strokeDashoffset = len - L;
    const p = fullPath.getPointAtLength(L), q = fullPath.getPointAtLength(Math.min(L + 2, len));
    dot.setAttribute('transform', `translate(${p.x},${p.y})`);
    arrow.setAttribute('transform', `rotate(${Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI})`);
    const idx = k >= 1 ? items.length : cum.findIndex((c) => L <= c);
    items.forEach((li, i) => { li.className = i < idx ? 'done' : i === idx ? 'on' : ''; });
    if (k < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}
function loadLive() {
  const enc = encodeURIComponent, f = $('liveMap');
  if (f.dataset.ready) return; f.dataset.ready = 1;
  f.src = PLACES.church.query
    ? `https://maps.google.com/maps?saddr=${enc(PLACES.church.query)}&daddr=${enc(PLACES.thirdys.query)}&output=embed`
    : `https://maps.google.com/maps?q=${enc(PLACES.thirdys.query)}&output=embed`;
  $('liveNote').textContent = 'Tap the Church / Thirdy’s buttons on the animated tab to open exact directions in Google Maps.';
}
document.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach((x) => x.classList.toggle('on', x === b));
  const live = b.dataset.tab === 'live';
  $('tab-anim').classList.toggle('hidden', live); $('tab-live').classList.toggle('hidden', !live);
  if (live) loadLive(); else playRoute();
}));
buildMap();
$('mapBtn').addEventListener('click', () => { sfx.pop(); openModal('mapModal'); playRoute(); });
$('replay').addEventListener('click', () => { sfx.pop(); playRoute(); });

/* ================= MENU TWIST / PUSH ME / HINT ================= */
$('twistBtn').addEventListener('click', () => { sfx.pop(); toast('🍚 YOU CAN HAVE UNLIMITED RICE', 3000); });
$('pushBtn').addEventListener('click', () => {
  const b = $('pushBtn'); sfx.push(); b.classList.add('pressed');
  setTimeout(() => { b.classList.remove('pressed'); openModal('calcModal'); }, 240);
});
let hintOn = false;
$('hint').addEventListener('click', () => { hintOn = !hintOn; sfx.pop(); $('hintText').textContent = hintOn ? 'Was a debutant last year' : 'tap me'; });

/* ================= CALCULATOR (shows everything you click) ================= */
document.querySelectorAll('.k').forEach((b, i) => b.style.setProperty('--h', (i * 41 + 8) % 360));
let cur = '0', prev = null, op = null, reset = false, justEq = false, expr = '';
const disp = $('calcDisp'), exprEl = $('calcExpr');
const fmt = (n) => String(+n.toFixed(10));
const compute = (a, b, o) => o === '+' ? a + b : o === '-' ? a - b : o === '×' ? a * b : b === 0 ? NaN : a / b;
const sym = (k) => (k === '-' ? '−' : k);
function show() {
  disp.textContent = cur.length > 12 ? Number(cur).toExponential(5) : cur;
  exprEl.textContent = expr || '\u00a0';
}
function check19() { if (cur === '19') { sfx.win(); toast('KKB PO TAYO!', 5000); } }
function press(k) {
  if (cur === 'Error' && k !== 'C') return;
  if (/^\d$/.test(k)) {
    if (justEq) { cur = '0'; expr = ''; justEq = false; }
    if (cur === '0' && !reset && /(^|\s)0$/.test(expr) && k !== '0') expr = expr.slice(0, -1);
    cur = (reset || cur === '0') ? k : cur + k; reset = false; expr += k; sfx.key(k);
  } else if (k === '.') {
    if (justEq) { cur = '0'; expr = ''; justEq = false; reset = false; }
    if (reset) { cur = '0.'; expr += '0.'; reset = false; } else if (!cur.includes('.')) { cur += '.'; expr += '.'; }
    sfx.key('.');
  } else if (k === 'C') {
    cur = '0'; prev = null; op = null; reset = false; justEq = false; expr = ''; sfx.clear();
  } else if (k === '⌫') {
    if (justEq) { expr = ''; justEq = false; }
    else if (!reset && cur !== '0') { cur = cur.length > 1 ? cur.slice(0, -1) : '0'; expr = expr.slice(0, -1); }
    sfx.clear();
  } else if ('+-×÷'.includes(k)) {
    if (justEq) { expr = cur; justEq = false; }
    if (op && !reset) { const r = compute(prev, +cur, op); cur = Number.isFinite(r) ? fmt(r) : 'Error'; check19(); }
    if (/ [+−×÷] $/.test(expr)) expr = expr.replace(/ [+−×÷] $/, ` ${sym(k)} `); else expr += ` ${sym(k)} `;
    prev = +cur; op = k; reset = true; sfx.op();
  } else if (k === '=') {
    if (op) { const r = compute(prev, +cur, op); cur = Number.isFinite(r) ? fmt(r) : 'Error'; prev = null; op = null; }
    expr = expr.replace(/ [+−×÷] $/, '') + ' ='; reset = true; justEq = true; sfx.eq(); check19();
  }
  show();
}
$('keys').addEventListener('click', (e) => {
  const b = e.target.closest('[data-k]'); if (!b) return;
  b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash'); press(b.dataset.k);
});
document.addEventListener('keydown', (e) => {
  if (!$('calcModal').classList.contains('show')) return;
  const k = { '*': '×', '/': '÷', Enter: '=', Backspace: '⌫', Delete: 'C' }[e.key] || e.key;
  if (/^[\d.+\-×÷=⌫C]$/.test(k)) { e.preventDefault(); const b = document.querySelector(`[data-k="${CSS.escape(k)}"]`); if (b) { b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash'); } press(k); }
});
show();
