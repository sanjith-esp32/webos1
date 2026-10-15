const desktop = document.querySelector('#desktop');
const topbar = document.querySelector('#topbar');
let highestIndex = 10;
let createdWindows = 0;

function bringToFront(windowElement) {
  highestIndex += 1;
  windowElement.style.zIndex = highestIndex;
  topbar.style.zIndex = highestIndex + 1;
}

function openWindow(id) {
  const windowElement = document.querySelector(`#${id}`);
  if (!windowElement) return;
  windowElement.classList.add('is-open');
  bringToFront(windowElement);
}

function closeWindow(id) {
  document.querySelector(`#${id}`)?.classList.remove('is-open');
}

function makeDraggable(windowElement) {
  const handle = windowElement.querySelector('[data-drag-handle]');
  let pointerStart = null;
  let origin = null;

  handle.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button')) return;
    event.preventDefault();
    bringToFront(windowElement);
    handle.setPointerCapture(event.pointerId);
    pointerStart = { x: event.clientX, y: event.clientY };
    const bounds = windowElement.getBoundingClientRect();
    windowElement.style.left = `${bounds.left}px`;
    windowElement.style.top = `${bounds.top}px`;
    windowElement.style.animation = 'none';
    windowElement.style.transform = 'none';
    origin = { x: bounds.left, y: bounds.top };
  });

  handle.addEventListener('pointermove', (event) => {
    if (!pointerStart || !origin) return;
    const nextX = Math.max(10, Math.min(window.innerWidth - windowElement.offsetWidth - 10, origin.x + event.clientX - pointerStart.x));
    const nextY = Math.max(70, Math.min(window.innerHeight - windowElement.offsetHeight - 12, origin.y + event.clientY - pointerStart.y));
    windowElement.style.left = `${nextX}px`;
    windowElement.style.top = `${nextY}px`;
  });

  const stopDragging = () => { pointerStart = null; origin = null; };
  handle.addEventListener('pointerup', stopDragging);
  handle.addEventListener('pointercancel', stopDragging);
  windowElement.addEventListener('pointerdown', () => bringToFront(windowElement));
}

function initializeWindow(windowElement) {
  makeDraggable(windowElement);
  windowElement.querySelector('[data-close]')?.addEventListener('click', () => closeWindow(windowElement.id));
}

document.querySelectorAll('.window-window').forEach(initializeWindow);
document.querySelectorAll('[data-open]').forEach((button) => button.addEventListener('click', () => openWindow(button.dataset.open)));
document.querySelector('#openWelcome').addEventListener('click', () => openWindow('welcome'));

const ledLight = document.querySelector('#ledLight');
const ledState = document.querySelector('#ledState');
ledLight.addEventListener('click', () => {
  const isOn = ledLight.classList.toggle('is-on');
  ledLight.setAttribute('aria-pressed', String(isOn));
  ledState.textContent = isOn ? 'ON' : 'OFF';
  ledLight.style.background = isOn ? '#e7755d' : '#263237';
  ledLight.querySelector('span').style.background = isOn ? '#fff4cf' : '#687477';
  ledLight.querySelector('span').style.boxShadow = isOn ? '0 0 22px 8px rgba(255,244,207,.82)' : 'none';
  document.querySelector('#statusText').textContent = isOn ? 'LED is glowing' : 'Two tools ready';
});

function addWindow() {
  createdWindows += 1;
  const windowElement = document.createElement('div');
  windowElement.className = 'window-window is-open generated-window';
  windowElement.id = `generated-window-${createdWindows}`;
  windowElement.style.left = `${Math.min(78, 34 + createdWindows * 4)}%`;
  windowElement.style.top = `${Math.min(74, 28 + createdWindows * 5)}%`;
  windowElement.innerHTML = `<div class="window-bar" data-drag-handle><span class="window-kicker">NEW WINDOW</span><strong>Window ${createdWindows}</strong><button class="window-close" data-close type="button" aria-label="Close Window ${createdWindows}">×</button></div><div class="window-body generated-body"><span class="generated-mark">${String(createdWindows).padStart(2, '0')}</span><p class="eyebrow">CREATED JUST NOW</p><h2>A fresh<br /><span>surface.</span></h2><p class="body-copy">This window was made by Window Maker. Drag it anywhere, or close it when you are done.</p></div>`;
  desktop.appendChild(windowElement);
  initializeWindow(windowElement);
  bringToFront(windowElement);
  document.querySelector('#windowCount').textContent = `WINDOWS CREATED: ${createdWindows}`;
}

document.querySelector('#addWindowButton').addEventListener('click', addWindow);

function updateClock() {
  document.querySelector('#clock').textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
updateClock();
setInterval(updateClock, 1000);
