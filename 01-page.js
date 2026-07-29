const diaryEntries = [
  { title: "Un día tranquilo", date: "2025-01-05", time: "21:30",
    text: "Hoy no pasó mucho, pero pensé en ti todo el día. A veces los días simples son los que más disfruto." },
  { title: "Mal día en el trabajo", date: "2025-02-14", time: "19:10",
    text: "Fue un día pesado, pero hablar contigo un rato lo arregló todo. Gracias por siempre estar.",
    audio: "https://www.w3schools.com/html/horse.ogg" },
  { title: "Recuerdo random", date: "2025-03-02", time: "23:05",
    text: "Me acordé de esa vez que nos reímos hasta llorar por una tontera. Quiero más momentos así." },
  { title: "Extrañándote", date: "2025-06-18", time: "10:45",
    text: "Hoy te extrañé más de lo normal, no sé por qué. Solo quería escribirlo en algún lado.",
    audio: "https://www.w3schools.com/html/horse.ogg" },
  { title: "Buenas noticias", date: "2025-07-09", time: "17:20",
    text: "Pasó algo bueno hoy y lo primero que quise hacer fue contártelo a ti." },
];

const grid = document.getElementById('diaryGrid');
const fYear = document.getElementById('fYear');
const fMonth = document.getElementById('fMonth');
const fDate = document.getElementById('fDate');
const fName = document.getElementById('fName');
const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function populateFilters() {
  const years = [...new Set(diaryEntries.map(e => e.date.slice(0,4)))].sort();
  years.forEach(y => { const o = document.createElement('option'); o.value=y; o.textContent=y; fYear.appendChild(o); });
  monthNames.forEach((m,i) => { const o = document.createElement('option'); o.value=String(i+1).padStart(2,'0'); o.textContent=m; fMonth.appendChild(o); });
}

function formatDate(d) { const [y,m,day] = d.split('-'); return `${day}/${m}/${y}`; }

function renderEntries() {
  const yearVal = fYear.value, monthVal = fMonth.value, dateVal = fDate.value, nameVal = fName.value.trim().toLowerCase();
  const filtered = diaryEntries.filter(e => {
    const [y,m] = e.date.split('-');
    if (yearVal && y !== yearVal) return false;
    if (monthVal && m !== monthVal) return false;
    if (dateVal && e.date !== dateVal) return false;
    if (nameVal && !e.title.toLowerCase().includes(nameVal)) return false;
    return true;
  }).sort((a,b) => new Date(b.date+'T'+b.time) - new Date(a.date+'T'+a.time));

  grid.innerHTML = '';
  if (!filtered.length) { grid.innerHTML = '<div class="diary-empty">No hay entradas con ese filtro.</div>'; return; }

  filtered.forEach(entry => {
    const card = document.createElement('div');
    card.className = 'diary-card';
    const audioHTML = entry.audio ? `<audio class="diary-card-audio" controls src="${entry.audio}"></audio>` : '';
    card.innerHTML = `
      <div class="diary-card-header">
        <span class="diary-card-title">${entry.title}</span>
        <span class="diary-card-date">${formatDate(entry.date)}</span>
      </div>
      <div class="diary-card-time">${entry.time}</div>
      <div class="diary-card-body"><p>${entry.text}</p>${audioHTML}</div>`;
    card.addEventListener('click', () => toggleCard(card));
    const audioEl = card.querySelector('.diary-card-audio');
    if (audioEl) audioEl.addEventListener('click', e => e.stopPropagation());
    grid.appendChild(card);
  });
}

function toggleCard(card) {
  const isMobile = window.innerWidth <= 700;
  const wasOpen = card.classList.contains('open');
  if (isMobile) {
    document.querySelectorAll('.diary-card.open').forEach(c => c.classList.remove('open'));
    if (!wasOpen) card.classList.add('open');
  } else {
    card.classList.toggle('open');
  }
}

function resetFilters() { fYear.value=''; fMonth.value=''; fDate.value=''; fName.value=''; renderEntries(); }
[fYear, fMonth, fDate, fName].forEach(el => el.addEventListener('input', renderEntries));

populateFilters();
renderEntries();

/* ===== Bolita que sigue al cursor ===== */
const cursorBall = document.getElementById('cursorBall');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ballX = mouseX;
let ballY = mouseY;
let ballActive = false;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!ballActive) {
    ballActive = true;
    ballX = mouseX;
    ballY = mouseY;
    cursorBall.style.opacity = '0.85';
  }
});
window.addEventListener('mouseleave', () => { cursorBall.style.opacity = '0'; });
window.addEventListener('mouseenter', () => { cursorBall.style.opacity = '0.85'; });

function animateBall() {
  // Suavizado (lerp) para que la bolita "persiga" al cursor con un pequeño retraso
  ballX += (mouseX - ballX) * 0.18;
  ballY += (mouseY - ballY) * 0.18;
  cursorBall.style.transform = `translate(${ballX}px, ${ballY}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateBall);
}
animateBall();

// La bolita crece un poco al pasar sobre las tarjetas o el filtro
document.querySelectorAll('.diary-card, .diary-filter button, .diary-filter select, .diary-filter input')
  .forEach(el => {
    el.addEventListener('mouseenter', () => cursorBall.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursorBall.classList.remove('grow'));
  });
