// Mobile menu
const burger = document.getElementById('burger'), menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); }
});

// Scroll reveal
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.pop').forEach((el) => io.observe(el));

// Movable scrapbook pieces (drag with mouse, finger, or pen)
let topZ = 30;
document.querySelectorAll('.drag').forEach((el) => {
  let sx = 0, sy = 0, ox = 0, oy = 0, moved = false;
  el.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    sx = e.clientX; sy = e.clientY; moved = false;
    const [cx, cy] = (el.style.translate || '0px 0px').split(' ').map(parseFloat);
    ox = cx || 0; oy = cy || 0;
    el.setPointerCapture(e.pointerId);
    el.classList.add('dragging');
    el.style.zIndex = ++topZ;
  });
  el.addEventListener('pointermove', (e) => {
    if (!el.classList.contains('dragging')) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
    el.style.translate = `${ox + dx}px ${oy + dy}px`;
  });
  const end = () => el.classList.remove('dragging');
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
  // Don't follow links when the piece was dragged
  el.addEventListener('click', (e) => { if (moved) { e.preventDefault(); moved = false; } });
  el.addEventListener('dragstart', (e) => e.preventDefault());
});

document.getElementById('year').textContent = new Date().getFullYear();
