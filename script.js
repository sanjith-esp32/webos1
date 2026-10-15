const windows = [...document.querySelectorAll('.window-window')];
const topbar = document.querySelector('#topbar');
let highestIndex = 10;
let focusStartedAt = null;
let focusInterval = null;

function bringToFront(windowElement) {
  highestIndex += 1;
  windowElement.style.zIndex = highestIndex;
  topbar.style.zIndex = highestIndex + 1;
}
function openWindow(id) { const windowElement = document.querySelector(`#${id}`); if (!windowElement) return; windowElement.classList.add('is-open'); bringToFront(windowElement); }
function closeWindow(id) { document.querySelector(`#${id}`)?.classList.remove('is-open'); }
function makeDraggable(windowElement) {
  const handle = windowElement.querySelector('[data-drag-handle]');
  let pointerStart = null;
  let origin = null;
  handle.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button')) return;
    event.preventDefault(); bringToFront(windowElement); handle.setPointerCapture(event.pointerId);
    pointerStart = { x: event.clientX, y: event.clientY };
    const bounds = windowElement.getBoundingClientRect(); origin = { x: bounds.left, y: bounds.top }; windowElement.style.transform = 'none';
  });
  handle.addEventListener('pointermove', (event) => {
    if (!pointerStart || !origin) return;
    const nextX = Math.max(10, Math.min(window.innerWidth - windowElement.offsetWidth - 10, origin.x + event.clientX - pointerStart.x));
    const nextY = Math.max(70, Math.min(window.innerHeight - windowElement.offsetHeight - 12, origin.y + event.clientY - pointerStart.y));
    windowElement.style.left = `${nextX}px`; windowElement.style.top = `${nextY}px`;
  });
  const stopDragging = () => { pointerStart = null; origin = null; };
  handle.addEventListener('pointerup', stopDragging); handle.addEventListener('pointercancel', stopDragging); windowElement.addEventListener('pointerdown', () => bringToFront(windowElement));
}
windows.forEach(makeDraggable);
if (window.innerWidth <= 700) {
  windows.forEach((windowElement) => {
    windowElement.style.left = '50%';
    windowElement.style.top = '54%';
  });
}
document.querySelectorAll('[data-open]').forEach((button) => button.addEventListener('click', () => openWindow(button.dataset.open)));
document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => closeWindow(button.dataset.close)));
document.querySelector('#openWelcome').addEventListener('click', () => openWindow('welcome'));

const notes = [
  { title: 'The beginning', date: 'OCT 16 / 2026', body: 'A good workspace does not need to be loud to be alive. I want this place to make curiosity feel easy to return to.', quote: 'Leave a little light on for the next idea.' },
  { title: 'Small rituals', date: 'OCT 12 / 2026', body: 'Open the notebook. Make tea. Name the thing that is pulling at your attention. Start there, even if there is no map yet.', quote: 'Momentum is often just a kind first step.' },
  { title: 'Things noticed', date: 'OCT 04 / 2026', body: 'The best interface feels a bit like a room you have visited before: you know where the light switch is, but there is still something new on the shelf.', quote: 'Familiar does not have to mean finished.' }
];
const noteList = document.querySelector('#noteList');
const noteReading = document.querySelector('#noteReading');
function renderNote(index) { const note = notes[index]; noteReading.innerHTML = `<p class="eyebrow">ENTRY ${String(index + 1).padStart(2, '0')}</p><h2>${note.title}</h2><p class="date">${note.date}</p><p>${note.body}</p><blockquote>${note.quote}</blockquote>`; document.querySelectorAll('.note-button').forEach((button, buttonIndex) => button.classList.toggle('is-selected', buttonIndex === index)); }
notes.forEach((note, index) => { const button = document.createElement('button'); button.className = 'note-button'; button.type = 'button'; button.innerHTML = `<strong>${note.title}</strong><small>${note.date}</small>`; button.addEventListener('click', () => renderNote(index)); noteList.appendChild(button); });
renderNote(0);

function updateClock() { document.querySelector('#clock').textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
updateClock(); setInterval(updateClock, 1000);

const focusOverlay = document.querySelector('#focusOverlay');
const focusTimer = document.querySelector('#focusTimer');
const focusLabel = document.querySelector('#focusLabel');
function toggleFocusMode() {
  const active = focusOverlay.classList.toggle('is-active'); focusOverlay.setAttribute('aria-hidden', String(!active)); focusLabel.textContent = active ? 'FOCUS ACTIVE' : '';
  if (active) { focusStartedAt = Date.now(); focusInterval = setInterval(() => { const elapsed = Math.floor((Date.now() - focusStartedAt) / 1000); focusTimer.textContent = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`; }, 500); }
  else { clearInterval(focusInterval); focusTimer.textContent = '00:00'; }
}
document.querySelector('#focusModeButton').addEventListener('click', toggleFocusMode);
document.querySelector('#exitFocus').addEventListener('click', toggleFocusMode);
document.addEventListener('keydown', (event) => { if (event.key.toLowerCase() === 'f' && event.target.tagName !== 'INPUT') toggleFocusMode(); if (event.key === 'Escape' && focusOverlay.classList.contains('is-active')) toggleFocusMode(); });
