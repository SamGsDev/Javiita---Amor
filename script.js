const sections = document.querySelectorAll('section');
const dots = document.querySelectorAll('.nav-dot');

function scrollToSection(index) {
    sections[index]?.scrollIntoView({ behavior: 'smooth' });
    }
    // Actualiza el dot activo al hacer scroll
    window.addEventListener('scroll', () => {
        let current = 0;
        sections.forEach((section, i) => {
            if (window.scrollY >= section.offsetTop - window.innerHeight / 2) {
                current = i;
            }
        });
        dots.forEach(dot => dot.classList.remove('active'));
        dots[current]?.classList.add('active');
    });



    
// === Canciones ===
// Para cada canción pon su .mp3 y su .lrc con el mismo nombre
const songs = [
  { title: "One & Only", artist: "Oliver Tree", src: "One-&-Only-Oliver-Tree.mp3", lrc: "Oliver-Tree-One-&-Only.lrc" },
  { title: "The Risk", artist: "Laufey", src: "Laufey-The-Risk.wav", lrc: "Laufey-The-Risk.lrc" },
  { title: "Dream Girl", artist: "Crisaunt", src: "CRISAUNT-DREAM-IRL.wav", lrc: "Crisaunt-Dream-Girl.lrc" },
];

let current = 0;
let playing = false;
let lrcLines = []; // [{ time: segundos, text: "..." }]

const audio    = document.getElementById("audioPlayer");
const playBtn  = document.getElementById("playBtn");
const progress = document.getElementById("progressBar");
const timeNow  = document.getElementById("timeNow");
const timeTotal= document.getElementById("timeTotal");
const lyricsEl = document.getElementById("lyricsLine");

// === LRC Parser ===
function parseLRC(text) {
  const lines = text.split("\n");
  const result = [];
  const timeReg = /\[(\d+):(\d+\.\d+)\](.*)/;
  for (const line of lines) {
    const match = line.match(timeReg);
    if (match) {
      const mins = parseInt(match[1]);
      const secs = parseFloat(match[2]);
      result.push({ time: mins * 60 + secs, text: match[3].trim() });
    }
  }
  return result.sort((a, b) => a.time - b.time);
}

async function loadLRC(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    lrcLines = parseLRC(text);
  } catch {
    lrcLines = [];
    lyricsEl.textContent = "♪";
  }
}

function updateLyrics(currentTime) {
  if (!lrcLines.length) return;
  let active = lrcLines[0].text;
  for (const line of lrcLines) {
    if (currentTime >= line.time) active = line.text;
    else break;
  }
  if (lyricsEl.textContent !== active) {
    lyricsEl.style.opacity = 0;
    setTimeout(() => { lyricsEl.textContent = active; lyricsEl.style.opacity = 1; }, 150);
  }
}

// === Canción ===
async function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  document.getElementById("songTitle").textContent = song.title;
  document.getElementById("songArtist").textContent = song.artist;
  lyricsEl.textContent = "♪";
  await loadLRC(song.lrc);
}

function togglePlay() {
  if (playing) {
    audio.pause();
    playBtn.textContent = "▶";
  } else {
    audio.play();
    playBtn.textContent = "⏸";
  }
  playing = !playing;
}

function prevSong() {
  current = (current - 1 + songs.length) % songs.length;
  loadSong(current).then(() => { if (playing) audio.play(); });
}

function nextSong() {
  current = (current + 1) % songs.length;
  loadSong(current).then(() => { if (playing) audio.play(); });
}

function setVolume(val) { audio.volume = val; }

function seekSong(val) {
  if (audio.duration) audio.currentTime = (val / 100) * audio.duration;
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

// === Eventos ===
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progress.value = pct;
  timeNow.textContent = formatTime(audio.currentTime);
  updateLyrics(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  timeTotal.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", nextSong);

function togglePlayer() {
  document.getElementById("playerBody").classList.toggle("hidden");
}

loadSong(0);

// === Animación al hacer scroll (.reveal) ===
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// === Poemas ===
// PERSONALIZA AQUÍ: agrega tantos poemas como quieras, cada uno con title y text (usa <br> para saltos de línea)
const poems = [
  {
    title: "Javiera",
    text: `Hay nombres que solo sirven para llamar a alguien. <br>
          Y hay otros que perecen guardar un universo,<br>
          El tuyo es uno de esos,<br>
          Porque cuando lo pienso,<br>
          no escuho solo unas letras,<br>
          Escucho risas, recuerdos, esperanzas y<br>
          un montón de sueños que todavia llevan tu voz.`
  },
  {
    title: "Sol",
    text: `No eres el sol.<br>
          El sol se esconde.<br>
          No eres la luna.<br>
          Ella cambia cada noche.<br>
          Eres algo más extraño.<br>
          Ese lugar al que vuelve mi corazón sin importar cuántas vueltas dé el mundo.`
  },
  {
    title: "La carta del viento",
    text: `Si el viento aprendiara a leer, espero que encuentre tu nombre.<br>
          Que atraviese las montañas, mares, ciudades y desiertos enteros,<br>
          solo para dejarte unaa pequeña certeza:<br>
          alguien, en algún rincón del mundo,<br>
          sonríe cada vez que piensa en ti.`
  },
  {
    title: "Sol",
    text: `No eres el sol.<br>
          El sol se esconde.<br>
          No eres la luna.<br>
          Ella cambia cada noche.<br>
          Eres algo más extraño.<br>
          Ese lugar al que vuelve mi corazón sin importar cuántas vueltas dé el mundo.`
  },
];

let currentPoem = 0;

function renderPoem() {
  const poem = poems[currentPoem];
  document.getElementById("poemTitle").innerHTML = poem.title;
  document.getElementById("poemText").innerHTML = poem.text;
  document.getElementById("poemIndex").textContent = `${currentPoem + 1} / ${poems.length}`;
}

function prevPoem() {
  currentPoem = (currentPoem - 1 + poems.length) % poems.length;
  renderPoem();
}

function nextPoem() {
  currentPoem = (currentPoem + 1) % poems.length;
  renderPoem();
}

renderPoem();

// === Cosas que amo de ti / Por qué eres única ===
// PERSONALIZA AQUÍ: pega tu lista completa en cada array, un texto por línea.
// Pueden ser cientos o miles, no hay límite de cantidad.
//const reasons = [
//  "Tu forma de reírte de tus propios chistes antes de terminarlos.",
//  "Cómo hablas de las cosas que te apasionan, con ese brillo en los ojos.",
//  "Tu paciencia conmigo, incluso cuando yo no la tengo con nada más.",
//  "La manera en que te preocupas por la gente que quieres.",
//];

const reasons = [
  "Tu cara",
  "Tu sonrisa",
  "Tus ojos",
  "Tu risa",
  "Tu nobleza",
  "Tus abrazos",
  "Tus locuras",
  "Tus besos",
  "Tu perfume",
  "Tu cabello",
  "Tu forma de amar",
  "Tu disciplina",
  "Nunca me aburro contigo",
  "Tu pasión por lo que haces",
  "Tu voz",
  "Tu manera de hacerme sentir",
  "Tu fuerza",
  "Tu humor",
  "La confianza que te tengo",
  "Tu valor",
  "Como me tratas",
  "Tu lealtad",
  "Como puedo contarte todo",
  "Tu manera de querer mejorar",
  "Tus pestañas",
  "Como me miras",
  "Tu mentalidad",
  "Reconoces tus errores y mejoras",
  "Tu apoyo",
  "Me das ánimos siempre",
  "Tus consejos",
  "Nuestras llamadas",
  "Nuestros ataques de risa",
  "Mi hermano te quiere",
  "Te amo como a nadie",
  "Eres única",
  "Haces todo especial",
  "Estabas conmigo cuando estaba mal",
  "Como me pones nervioso",
  "La chispa que sentiré cuando me tomes de la mano",
  "Como intentas que estemos bien",
  "Cuando te apoyas en mí",
  "Tu piel",
  "Como me sacas sonrisas",
  "Como me dices \"te amo\"",
  "Como me llenarás de besos la cara",
  "Tu letra",
  "Intentas hacerme feliz",
  "Como aguantas mis enojos",
  "Aguantas mis cambios de humor",
  "Los detalles",
  "Las flores que me diste",
  "Nuestra conexión",
  "No me siento incómodo",
  "Nunca me has insitado a algo",
  "Procuras mi bienestar",
  "Como actúas como niña chiquita",
  "Tu comprensión",
  "Tu amabilidad",
  "Tu cariño",
  "Tus chistes",
  "Tus expresiones",
  "Tus detalles",
  "Tus ganas de hacerme sentir amado",
  "Tu gusto por Batman",
  "Tu gusto por Spiderman",
  "Tu corazón",
  "Tus \"buenos días\"",
  "Tus \"buenas noches\"",
  "Tus palabras",
  "Tu forma de hacerme reír",
  "Tu rareza",
  "Tu alma",
  "Tu perseverancia",
  "Que no me dejaste ir",
  "Tu amor por Luna",
  "Tu forma de ser",
  "Me ayudas",
  "Me salvas de mis malos pensamientos",
  "Eres mi vida",
  "Eres mi compañera",
  "Siempre estoy cómodo a tu lado",
  "Me demuestras que mis inseguridades no deberían serlo",
  "Tu personalidad",
  "Me sigues mi locura",
  "Tu tranquilidad en momentos difíciles",
  "La paz que logras causar",
  "Tus gestos",
  "Tus acciones lindas y tontas",
  "Las vibras que transmites",
  "La seguridad que me haces sentir",
  "Me consientes",
  "Los apodos que me dices",
  "Soy tu príncipe",
  "Tus lindos ojitos",
  "Los lunares de tu cara que hacen parecer que tienes pecas",
  "Tu linda nariz",
  "Tus hoyuelos",
  "Tus labios",
  "Tus manos",
  "Tu olor",
  "Tu pancita",
  "El aroma que me llegará cuando nos abracemos",
  "Tus besos en mi frente",
  "El sabor de tus besos",
  "La delicadeza con la que me tratas",
  "Siempre te das cuenta cuando estoy mal",
  "Cuando me copias los gestos",
  "Tu sarcasmo",
  "Tus mimos",
  "Que aceptes tus errores",
  "Siempre me recuerdas que soy lindo",
  "Tu forma de vestir",
  "Siempre me pones de primera",
  "Te encanta joderme",
  "Me perdonas",
  "Comprendes cuando me equivoco",
  "Escuchas mis problemas",
  "Me aconsejas",
  "Tu confianza en mí",
  "Me cuentas lo que te pasa",
  "Me soportas",
  "Cumples mis caprichos",
  "Te aseguras de que haya comido",
  "Me darás la mano",
  "Te preocupas por cada cosa que me pase",
  "Eres preciosa",
  "Te encanta Neutro Shorty",
  "Las canciones que me dedicaste",
  "Te ves bien en las fotos",
  "Sabes lo que me gusta",
  "Le caes bien a mi familia",
  "Siempre me das mi lugar",
  "Me haces berrinches",
  "Sabes como animarme",
  "Eres empático",
  "Cuidas de tu familia",
  "Eres perfecta",
  "Nuestra forma de comprendernos",
  "Nadie se te compara",
  "Eres cariñosa",
  "Eres asombrosa",
  "Eres increíble",
  "Eres especial",
  "Sabes valorar",
  "Agradeces hasta lo mínimo",
  "Tienes buenos modales",
  "Tu amor por Lukita",
  "Me defiendes",
  "Me das tus casacas cuando tengo frío",
  "Eres fuerte",
  "Tu forma de hablar",
  "Te gusta comer helados conmigo",
  "Cuando quieres evitar comer algo lo colocas en mi plato",
  "Eres la persona que le devolvió el brillo a los ojos",
  "Eres tierna aunque no quieras aceptarlo",
  "Tengo ojos nada más para ti",
  "Las venas en tus manos",
  "Somos diferentes, como el ying y el yang",
  "Te gusta mi sentido del humor",
  "Cuando nos conocimos, tuvimos una conversación profunda, chistosa donde conectamos",
  "Desde que empezamos a hablar, fuiste la persona que más me ha hecho reír",
  "Dejas que te moleste y te ríes de ello",
  "Estás dispuesto a que tengamos un futuro juntos",
  "No me cambiarías",
  "No te molesta que salga",
  "Te da gusto que sea feliz haciendo cosas que me gustan",
  "Mi felicidad es tu felicidad",
  "Siempre estás dispuesto a que crezcamos juntitos y mejoremos",
  "Todos los días me siento amado, sin excepción",
  "La sensación que tengo cuando estoy contigo",
  "Tus gustos musicales",
  "Ves mis grwm",
  "Escuchas mis cantos que mando de la nada",
  "Tengo la felicidad de conocer tu verdadero tú",
  "Tu tacto",
  "Tu presencia",
  "Eres igual de insana que yo",
  "Tenemos el mismo sentido del humor",
  "Eres mi skibidi",
  "Juegas Minecraft conmigo",
  "Aguantas que esté bien tonto para jugar",
  "Cuando nos abracemos y nos quedemos haciéndonos cariños",
  "Cuando coordinamos nuestras respiraciones",
  "Juegas Roblox conmigo",
  "Me ganas cuando jugamos",
  "La chispa que sentiré al besarnos",
  "Nos apoyamos mutuamente",
  "Desde la primera vez que te vi, sentí algo mágico",
  "Nos motivamos juntos",
  "Nos ayudamos a alcanzar nuestros objetivos",
  "Tu voz cuando hablas bajito",
  "La forma en que siempre sabes qué decir",
  "Tu talento para hacerme reír en los peores momentos",
  "La emoción con la que cuentas historias",
  "Como haces que cada momento sea especial",
  "Tu fortaleza en momentos difíciles",
  "La pasión con la que vives",
  "Como te gusta aprender",
  "Tu habilidad para sorprenderme",
  "Tu capacidad de perdonar",
  "Como conviertes lo ordinario en extraordinario",
  "Como sueñas en grande",
  "La emoción de tus ojos cuando descubres algo nuevo",
  "Como sabes cuando necesito un abrazo",
  "Tu pasión por lo que te importa",
  "Como siempre buscas lo mejor para los que quieres",
  "La forma en que me miras cuando estoy distraído",
  "Haces que todo parezca más fácil",
  "Tu habilidad para encontrar soluciones",
  "La dulzura de tus mensajes inesperados",
  "La seguridad con la que hablas de tus sueños",
  "Como valoras cada instante",
  "La forma en que me haces reír hasta que me duela la barriga",
  "Tu amor por la música",
  "Tu emoción por cosas pequeñas",
  "Defiendes lo que crees",
  "Le ves lo positivo a todo lo malo",
  "Me entiendes sin necesidad de palabras",
  "Tu risa cuando te diviertes",
  "Siempre tienes el consejo perfecto",
  "Tu amor por historia",
  "Me haces sentir afortunado",
  "Respetas mis opiniones",
  "Tu capacidad para sorprenderme",
  "La ternura de tus caricias",
  "Me llenas de amor con una mirada",
  "Siempre ves lo mejor en mí",
  "Conviertes lo cotidiano en algo especial",
  "Cuidas a los que amas",
  "Traes luz a mi vida",
  "Sin ti el mundo no sería el mismo",
  "Me siento en paz con tu mirada",
  "Tu optimismo incluso en los momentos más difíciles",
  "La forma en que amas sin medida ni condiciones",
  "Logras que cualquier conversación sea interesante",
  "Tu humildad a pesar de todo lo increíble que eres",
  "La confianza con la que me miras",
  "Nuestras conversaciones nunca se sienten forzadas",
  "Me incluyes en tus planes futuros",
  "La ternura de tu voz cuando me dices cosas bonitas",
  "La forma en que me sostienes cuando siento que voy a caer",
  "Tu deseo de ayudar a los demás sin esperar nada a cambio",
  "Me haces sentir especial incluso en los días comunes",
  "Me despiertas con dulzura cuando me quedo dormido",
  "Celebras mis logros como si fueran tuyos",
  "Tu risa después de un beso que nos robaremos",
  "Logras que el tiempo pase volando cuando estamos juntos",
  "Ningún silencio es incómodo",
  "Me animas cuando dudo de mí misma",
  "Tu amor por los recuerdos y como los atesoras",
  "Disfrutas los detalles como si fueran regalos grandes",
  "Me sigues sorprendiendo cada día / La ternura con que hablas de nuestro futuro",
  "Te esfuerzas por hacerme sonreír",
  "Tu mirada llena de amor, cuando crees que no te estoy viendo",
  "Tu risa cuando intentamos hacer algo y nos equivocamos",
  "Haces que los días grises sean bonitos",
  "Me enseñas a ser más paciente con la vida",
  "Me haces sentir especial sin intentarlo",
  "Tus abrazos cambiarán cualquier preocupación",
  "Iluminas todo con tu presencia",
  "Tu respeto por mis tiempos y mis procesos",
  "La calidez de tu voz cuando me hablas",
  "La seguridad con la que me dices que todo va a estar bien",
  "Siempre me recuerdas lo valioso que soy",
  "Cada día que pasa, te amo más que el anterior",
  "Conviertes cualquier plan en algo divertido",
  "Como compartes tus canciones favoritas conmigo",
  "Me haces sentir que nunca estoy solo",
  "Me haces sentir que soy invencible",
  "Demuestras tu amor sin necesidad de palabras",
  "Me demostraste que no debo ocultar quien soy",
  "Me mostraste que si no me quieren por quien soy no me merecen",
  "Me di cuenta gracias a ti que nos merecemos mutuamente",
  "Cada cosa mala que me ocurra contigo se vuelve mucho más pequeña",
  "Me demuestras las cosas que podría mejorar",
  "Me dices que mejore por mí misma",
  "Jugamos juegos juntos",
  "A pesar de tus problemas no te rindes",
  "Te tengo admiración porque logras superar todos tus problemas",
  "Me dices que soy el niño de tus sueños",
  "Adoro escuchar lo que piensas y saber tus ideas",
  "Eres transparente",
  "A pesar de que estás lejos sé que me amas a mí",
  "A pesar de cuando estamos lejos te siento cerca",
  "A pesar de que yo esté lejos sé que al final del día sabes que solo te amo a ti",
  "Tengo guardado en mi memoria cada día que pasamos juntos",
  "Si estoy contigo todos los días a tu lado serán memorables",
  "El amor a tu lado no tiene fronteras",
  "Sé que lucharemos por tener una relación sana y estable",
  "Tu voz logra hacer que me tranquilice",
  "El mirarte me calma",
  "Quiero poder disfrutar cada minuto a tu lado",
  "Cada día y hora que tenga a tu lado son valiosos",
  "Pase lo que pase nos apoyaremos",
  "Contigo la vida es ligera",
  "Sé que en cada momento si nos tenemos el uno al otro nada nos faltará",
  "Logras que sienta que el esfuerzo que yo hago vale la pena",
  "A tu lado, cualquier obstáculo parece más fácil de afrontar",
  "Sabes cuando necesito un empujón para sentirme bien",
  "No tengo que decirte que estoy mal para que me hagas feliz",
  "Me enseñaste que el amar no es solo un sentimiento",
  "Me mostraste que amar es algo de día a día",
  "Todo en mi vida tiene sentido si estás en ella",
  "Sacas lo mejor de mí",
  "Cuando estamos juntos, veo que estamos más felices que nunca",
  "Tu corazón es enorme, y me lo demuestras cada día",
  "Todo cuando lo compartimos es más lindo",
  "Cuando compartimos cosas, logro disfrutarlas más",
  "Puede que no lo creas, pero estoy tan agradecido de tenerte",
  "Todo lo que vivo a tu lado es una aventura",
  "No hay nadie más que tú",
  "Siempre tendrás una sonrisa para darme",
  "Cuando no te sientes bien, aún así estás ahí para mí",
  "Te interesa tanto lo que me ocurre, lo valoro infinitamente",
  "Cuando te hablo de algo te importa lo que te cuento",
  "Siempre me darás atención cuando la necesite",
  "Incluso si no estamos haciendo mucho, si estoy contigo el momento valdrá la pena",
  "Contigo veo que el amor no es perfecto",
  "Aunque nuestro amor no es perfecto, lo que es, es que es real",
  "Eres mi persona favorita",
  "Sin importar que pase, siempre serás mi persona favorita",
  "Eres mi persona ideal",
  "Eres mi chica ideal",
  "Eres la niña de mis sueños",
  "No importa que no siempre estemos de acuerdo, nunca me harás menos por eso",
  "Respetas mis ideas, sin excepción",
  "Respetas mis pensamientos y los tomas en cuenta",
  "Escuchas mis sentimientos y los tomas en cuenta cuando te los digo",
  "Me haces sentir que mi presencia en tu vida es importante",
  "Te gusta mi esencia",
  "Te gusta que sea dramático",
  "Te gusta que sea tierno",
  "Te gusta el niño que soy",
  "Nunca dejas que las pequeñas cosas arruinen lo que tenemos",
  "Hay veces que no te pido consejos, pero me los das y me ayudan siempre",
  "Aunque a veces no puedas ayudarme, siempre das lo mejor de ti para que yo esté bien",
  "Me felicitas por lo que logro",
  "No tengo que hablar para que me entiendas",
  "Cuando decido algo lo entiendes y no te molestas",
  "Sé que siempre estarás ahí para mí",
  "Siempre eres honesto conmigo",
  "Eres mi pinky de los chismes",
  "Tu sonrisa ilumina cualquier día",
  "La forma en que miras cuando algo te apasiona",
  "Tu risa contagiosa",
  "La paciencia que tienes con los que quieres",
  "Tu creatividad sin límites",
  "Como conviertes lo simple en especial",
  "Tu inteligencia que siempre sorprende",
  "Tu capacidad de escuchar sin juzgar",
  "Tu dulzura en los pequeños gestos",
  "La pasión con la que defiendes lo justo",
  "Tu sentido del humor",
  "La forma en que dices mi nombre",
  "Como recuerdas detalles importantes",
  "Tu habilidad para hacerme sentir seguro",
  "La forma en que me miras cuando piensas en algo lindo",
  "Tu generosidad sin esperar nada a cambio",
  "La forma en que iluminas una habitación",
  "Como motivas a los demás a ser mejores",
  "Tu amor por la vida",
  "La manera en que me apoyas sin dudar",
  "Tu paciencia cuando tengo un mal día",
  "Como siempre tienes una palabra de aliento",
  "La ternura de tus gestos",
  "Tu manera de ver lo positivo en todo",
  "La emoción con la que hablas de lo que amas",
  "Tu valentía para enfrentar desafíos",
  "La seguridad que me das con solo estar cerca",
  "Mi sonido favorito es tu risa",
  "Cuando pronuncias mi nombre me suena bonito",
  "No solo te importa hablarme cuando estoy bien, estás ahí cuando estoy mal",
  "Jamás, nunca me dejas solo",
  "Tu energía es alegre, haces que todos a tu alrededor estén cómodos",
  "Cuando estamos juntos me proteges",
  "Siempre me sorprendes con tus ocurrencias",
  "Sabes como calmar mis miedos",
  "Tus defectos para mí son hermosos",
  "Me tratas como príncipe",
  "Me tratas como rey",
  "Tengo tanta confianza en ti",
  "Entrego mi corazón completamente a ti",
  "Cada vez que te bese mi corazón irá a mil",
  "No importa cuánto tiempo pase, siempre será como si fuera el primer día",
  "Aunque digas que no eres buena en algo, para mí eres perfecta",
  "Lo que tú piensas que son defectos para mí son parte de tu persona, la persona que yo amo",
  "Me tratas como si fuera la cosa más linda del mundo",
  "Me haces sentir el niño más feliz del mundo",
  "Me haces sentir lo más especial del universo",
  "Siempre tienes algo que contarme para hacerme feliz",
  "Te preocupas por problemas que no son tuyos solamente para que yo esté bien",
  "Cada que me miras mi mundo se detiene",
  "Cada que me besas mi mundo se detiene",
  "Cada que estamos juntos yo siento que mi mundo se para",
  "Te dejo que puedas destrozar mi corazón pero confío en que lo cuidarás y lo harás latir de felicidad",
  "Incluso cuando peleamos volvemos a terminar riendo juntos",
  "Cada vez que te veo mi corazón late mil por hora",
  "Siento que cuando nos abracemos, todo a mi alrededor no existirá, solo tú y yo",
  "Somos tú y yo contra el mundo",
  "Mi vida a tu lado es más feliz",
  "Tenemos un amor recíproco",
  "Aunque nadie es perfecto, para mí eres asombrosa",
  "Aunque me digan que es imposible ser perfecta, a mis ojos lo eres",
  "Me das razones para sonreír en días difíciles",
  "Eres la razón por la cual soy feliz",
  "Aparte de ser mi pareja, eres mi amiga",
  "Para mí cada conversación es como una lección de vida",
  "Contigo a mi lado me haces sentir tan apoyado incluso sin hablar",
  "Cuando estamos juntos mi mundo eres tú",
  "Me contagias el amor que tienes y la felicidad",
  "Me ayudas a tener paciencia",
  "Te gusta el frío al igual que a mí",
  "Haces que detalles chicos se sientan enormes",
  "Logras que palabras simples se sientan como una explosión",
  "Me explicas que estás feliz de haberme encontrado",
  "Me doy cuenta de lo afortunado que soy de tenerte a mi lado",
  "Me adoras",
  "Te adoro",
  "Con un mensaje haces que sonría",
  "Lo que necesito en un día para ser feliz no es nada más que hablar contigo",
  "Haces que piense que el destino existe",
  "Siento que estamos destinados",
  "Confío en ti porque sé que estarás ahí pase lo que pase",
  "Haces que sienta que mis sueños son alcanzables",
  "Viviría cada día de mi vida a tu lado",
  "Hablar contigo me deja con una sonrisa tonta",
  "Te tengo todo el día en mi mente",
  "Pensar en ti me deja tontamente feliz",
  "La forma de ser que tienes es genuina",
  "Tienes unos valores que me hacen adorarte",
  "No tienes miedo a ser vulnerable conmigo",
  "Dejas que te ayude cuando te sientes mal",
  "Confías en que no te juzgaré",
  "Sé que hay veces que no tienes respuestas para todo, pero me calmas al ayudarme a ver que todo estará bien",
  "Mi día tiene sentido gracias a ti",
  "Me haces sentir que no solo importan los demás, yo también",
  "Me demuestras que lo más importante es que nosotros seamos felices",
  "Me haces ver que es importante que yo sea feliz",
  "Una de las cosas que más deseo en mi vida es poder hacerte feliz",
  "Me das esperanza en el futuro",
  "Nunca me dejas caer, siempre me ayudarás a levantarme",
  "Si estoy contigo la vida tiene color",
  "Estemos tristes o felices, si te puedo tener a mi lado todo saldrá bien",
  "Siendo tú iluminas mi mundo",
  "Tú eres la solución a todo",
  "Cuando estoy contigo siento que el tiempo nunca es suficiente",
  "Te tomas el tiempo de escucharme incluso cuando no tengo mucho que decir",
  "Con solo una mirada puedo entender todo lo que me quieres decir incluso sin palabras",
  "Tienes una cara de mí que nadie más tiene, donde tengo una confianza desbordante",
  "Tus abrazos me darán la paz que necesito después de un mal día",
  "Aunque no quieras demostrarlo, eres una tierna, una dulce",
  "Cuando todo es caos, tú eres mi calma",
  "Aunque a veces seamos como el agua y el aceite, logramos congeniar",
  "Siento que tu amor por mí es completamente genuino",
  "Pase lo que pase me aceptas como soy",
  "Eres mi motivación",
  "Eres como mi motor",
  "Cuando estamos lejos encontramos una forma de que nos sintamos cerca",
  "Te amo",
  "Me amas",
  "Eres divertida",
  "Eres bondadosa",
  "Cuando no soy el centro de atención, siempre me haces sentir importante",
  "Tu corazón tan lindo y amable me inspira",
  "Cuando estoy contigo me siento como en casa",
  "Un abrazo tuyo será tan cálido y precioso que me hará sentir en calma",
  "Nos entendemos tan fácil",
  "Cuando parezco loco me escuchas y sonríes para mí",
  "Me gusta escucharte hablar",
  "Siempre sabes dar consejos buenos",
  "Tal y como eres, eres increíble",
  "Contigo a mi lado para mí todo es posible",
  "Me contagias felicidad cuando le ves el lado positivo a las cosas",
  "Me haces sentir que no importa lo que pase, contigo a mi lado todo estará bien",
  "Siempre tienes algo que decir",
  "Con todas tus acciones me haces sentir que soy suficiente como soy",
  "Me motivas a dar lo mejor de mí siempre",
  "Me haces pensar que soy capaz de todo lo que me proponga",
  "Me haces pensar que todo en esta vida tiene solución",
  "El primer beso que nos daremos me revolverá el mundo",
  "El hecho de que estés conmigo hace que me den ganas de sonreír",
  "Me enseñaste a amarte",
  "Me mostraste que todo con amor se puede superar",
  "Me amaste y quisiste desde el primer momento",
  "A pesar de que fuéramos tan diferentes me amas",
  "Te tomas el tiempo de comprenderme",
  "Cada día mejoramos juntos para poder superar cada obstáculo juntos",
  "Los sentimientos que siento por ti son inigualables",
  "Lo que siento por ti es inefable",
  "Conviertes los días feos en lindos",
  "Eres como mi solecito, me iluminas mi día",
  "Con tan solo mirarte, sé que todo estará bien",
  "Tu confianza en mí me da más fuerza para esforzarme en esta relación",
  "No te importa lo que piensan los demás, siempre me cuidarás y amarás",
  "Contigo cada día es un día más de felicidad",
  "Lo bien que juegas",
  "Tu altura",
  "Ves lo mejor en mí",
  "Nunca te rindes",
  "Siempre tienes la cabeza en alto",
  "Me haces sentir orgulloso",
  "Siempre has estado para mí",
  "Me apoyas en todo",
  "Me haces feliz",
  "Eres amable",
  "Ves por los demás",
  "Amas muchísimo a tu mami",
  "Me entiendes",
  "Me corriges",
  "Como me haces burla",
  "Todos nuestros recuerdos",
  "Me cuidas cuando cruzamos la calle",
  "Lo guapa que eres",
  "Como se acelera mi corazón al verte",
  "Te ríes por todo",
  "Entendí el \"yo más\" por ti",
  "Tu valentía",
  "Tu coraje",
  "Tus ganas de salir adelante",
  "Tus metas y sueños",
  "La gran persona que eres",
  "Lo gentil que eres",
  "Lo guapa que estás",
  "Lo bella que estás",
  "Lo linda que eres",
  "Lo preciosa que siempre fuiste",
  "La conexión que sentiré al besarte",
  "Como 6h se sienten como 20min",
  "Las llamadas tarde",
  "Los casos hipotéticos",
  "La confianza que nos tenemos",
  "Como contamos nuestros pasados",
  "Tu sinceridad",
  "Tu honestidad",
  "Tu fe en Dios",
  "Tu sencillez",
  "Las preguntas de C. General",
  "Cuando grabamos TikToks",
  "Mejoramos siempre",
  "Peleamos, pero arreglamos",
  "Mejoras siempre",
  "Juntos estamos en las buenas y en las malas",
  "Nos damos amor mutuo",
  "Cuando inflemos nuestros cachetes al besarnos",
  "Nos besaremos de forma dulce y tierna",
  "Me enseñas tus jueguitos con las manos",
  "Cada vez que me ves, veo una luz en tus ojos",
  "Solo con pensar en ti me emociono como la primera vez",
  "Me respondes las historias y pics",
  "Siempre me elogias",
  "De la nada puedes mandar mensajes con mucho amor",
  "No tiene que ser un día especial para que a tu lado sea especial",
  "Me amas sin condiciones",
  "Sin importar los problemas que tenga, me amas",
  "No encontraré un amor tan lindo como el que tenemos",
  "La increíble conexión que tenemos no la encontraré en otra parte",
  "Me haces sentir mariposas en el estómago",
  "Por ayudarme a estar bien con los demás",
  "Me envías reels",
  "Me envías videos que me dan risa cuando lo necesito",
  "Respondes todos los TikToks que te mando",
  "Tienes una risa contagiosa",
  "Tenemos una canción que nos recuerda al otro",
  "Eres lo primero que pienso al despertar",
  "Eres al primero que hablo al despertar",
  "Me dices que soy lo primero que piensas al despertar",
  "Incluso cuando te hablo de cosas tontas me escuchas",
  "Podemos estar horas hablando de tonterías y la pasamos bien",
  "Cuando estamos juntos el tiempo pasa rápido",
  "No quiero que se acabe el tiempo estando contigo",
  "Me imagino una vida completa a tu lado",
  "No puedo imaginarme en un futuro sin ti",
  "Cuando no estoy con ánimos me intentas animar",
  "Eres asombrosa pero no lo presumes",
  "Vales demasiado",
  "Mi sonido favorito es tu voz",
  "Subes fotos en las que tú sales bien y yo no",
  "Podemos hablar horas sobre nuestro futuro",
  "Me tienes en destacadas",
  "Mi cuarto está lleno de cosas que me has regalado",
  "Me dejas maquillarte",
  "Te tengo en destacados",
  "Me gustas",
  "Te gusto",
  "Siempre me preguntas como estoy",
  "Sin tus buenas noches no puedo descansar bien",
  "Cuando cierro los ojos ahí te veo",
  "Abro los ojos y espero verte ahí",
  "Me enseñaste que es ser amado",
  "Conoces cada detalle de mí",
  "Me mostraste cosas de mí que no conocía",
  "Saco tu lado cursi",
  "Sacas mi lado cursi",
  "No le temes al compromiso",
  "Contigo no tengo miedo a comprometerme",
  "Por todos los bonitos días que pasamos juntos",
  "Por todos los momentos que aún nos faltan por vivir",
  "Cuidas mis secretos",
  "Eres como mi cunita",
  "Soy de las pocas personas que dejaste entrar tan profundamente",
  "Me despierto y pienso en ti",
  "Me duermo y pienso en ti",
  "Escuchas mis sueños tontos",
  "No tienes ojos para alguien más",
  "Al conocerte, me dolieron los cachetes de tanto sonreír",
  "Mi corazón ha sido tan feliz desde que te conozco",
  "No dejaste que el resto rompa nuestra relación",
  "Estoy en tu mente",
  "Te gusta molestarme de broma",
  "Eres como mi amiga",
  "Me desafías en cosas que sabes que me ganas",
  "Te adoro con todo mi corazón",
  "Jamás conoceré a alguien que me hiciera sentir tantas cosas",
  "Te amo tanto para poder expresar la mitad de ello te digo mil razones literalmente",
  "Para lograr sacar todos mis sentimientos te escribo poemas",
  "Disfruto inmensamente el tiempo a tu lado",
  "Apenas nos conocimos sabíamos que estábamos destinados",
  "Tu bondad es exageradamente linda",
  "No me obligas, me inspiras a mejorar",
  "Me haces sentir que el amor verdadero sí existe",
  "Eres mi respiro en momentos complejos",
  "Eres la luz que necesito",
  "Sé que no existe la vida perfecta pero al estar contigo es hermosa",
  "Eres lo más real y genuino cuando hablas",
  "Logras leerme como un libro",
  "Nos conocimos tan bien en tan poquito tiempo",
  "Sé cuando te ocurre algo",
  "Nos logramos descifrar mutuamente fácilmente",
  "Me haces sentir que soy parte de algo importante",
  "Soy parte de ti",
  "Me dejas ser parte de tu vida",
  "Eres el que me imagino en cada parte de mi camino",
  "Me haces ver que cada error que cometa es una oportunidad para aprender",
  "Logras que un \"nosotros\" mejore cada situación",
  "Logras diferenciar cuando me siento mal por si necesito un espacio o hablar",
  "Tu felicidad es muy importante para mí",
  "Simplemente a tu lado me siento en las nubes",
  "Contigo todo se siente más fácil y ligero",
  "Contigo siempre tengo razón para sonreír",
  "Aparecer en mis sueños",
  "Siempre recurro a ti cuando me pasa algo",
  "Cuando algo bueno o malo pasa, eres el primero a quien quiero contarle",
  "Para ti cada detalle cuenta, eso me hace valorarte aún más",
  "Eres el tipo de persona con quien quiero compartir todos mis momentos",
  "Eres la persona con quien quiero compartir mi vida",
  "Estoy agradecido de que te haya podido conocer",
  "Estás agradecida de tenerme en tu vida",
  "Todo es complejo si no estás",
  "Me haces querer el mundo contigo",
  "Tú me haces sentir que a tu lado, todo es posible",
  "Cada día contigo es una nueva oportunidad para aprender algo nuevo",
  "Aprenderemos a cuidar una casa juntos",
  "En un futuro estás dispuesto a crear un hogar a tu lado",
  "Yo estoy dispuesta a crear un hogar a tu lado",
  "Cada vez que hablas siento que me estás diciendo lo que necesito escuchar",
  "El mundo se vuelve mejor cuando estamos juntos",
  "Me confiaste tu pasado",
  "Me dejaste entrar en tu vida",
  "Me encanta el amor que tienes por tu mamá",
  "Sé que te importo de una manera preciosa",
  "Tenemos un amor cliché",
  "Los dos nos imaginamos casándonos en un futuro",
  "La forma en que dices las cosas es interesante",
  "Podría estar horas escuchando solamente tu voz",
  "Me explicas tus cursos o tareas aunque a veces no los entiendo",
  "Me alegra poder conocer sobre tus habilidades y las cosas que sabes",
  "Tienes muchas capacidades",
  "Los días que no sé explicarme, cuando estoy bloqueado logras comprenderme",
  "Sabes como hacer que mis inseguridades se vayan",
  "Fuiste capaz de abrirte conmigo",
  "Me tratas con amor y dulzura",
  "Tu deseo de hacerme feliz siempre",
  "Me proteges sin ser invasivo",
  "Tu amor por los abrazos y cómo me darás los mejores",
  "Me haces sentir parte de tu vida",
  "Tu capacidad de emocionarte con las cosas simples",
  "Disfrutas de nuestras conversaciones hasta la madrugada",
  "Me haces sentir que siempre puedo contar contigo",
  "Me enseñas a ver la belleza en lo cotidiano",
  "Me haces sentir especial en cualquier circunstancia",
  "Te esfuerzas por hacerme sonreír cuando estoy triste",
  "Tu deseo de siempre aprender más sobre lo que te gusta",
  "La manera en que me das fuerzas cuando me canso",
  "Tu forma de ver el mundo con ojos llenos de curiosidad",
  "Como me miras cuando hablamos de nuestro futuro",
  "Tus ganas de vivir nuevas experiencias",
  "Logras que mis días malos sean menos pesados",
  "Nunca me interrumpes",
  "Nunca te cansas de demostrar tu amor",
  "Tu paciencia cuando algo no sale como esperábamos",
  "Logras que me sienta querido con un gesto",
  "Me haces sentir mariposas en el estómago con solo una mirada",
  "Haces que me sienta especial incluso en la rutina",
  "Tu amor por las películas",
  "Como disfrutas nuestras noches de películas",
  "La manera en que te emocionas con los pequeños logros",
  "Harás que cada abrazo sea el mejor de mi vida",
  "La ternura en tu rostro cuando me ves feliz",
  "Tu dedicación para hacer que nuestra relación sea increíble",
  "Pasaría todos los días a tu lado y no serían suficientes",
  "Eres mi novia",
  "Eres mi amiga",
  "Eres mi amante",
  "Eres mi sol en medio de la tormenta",
  "Por tu existencia",
  "Parece que me dará un paro cardíaco cuando me dices cosas lindas",
  "Vemos los mismos streamers",
  "Me dejas elegir qué comer",
  "Me dejas elegir a dónde ir",
  "Sobre todo, me amas",
  "Es como si fueras el primero en todo",
  "Me haces sentir que soy el único chico en tu vida",
  "1000 razones no son suficientes para demostrarte lo que te amo",
  "A nuestra corta edad, logro sentir tanto por una persona",
  "Eres súper única",
  "Sabes más de mí que yo misma",
  "Me proteges",
  "Siempre me tomarás de la mano",
  "Amas todo de mí",
  "Amo todo de ti",
  "Incluso desarreglado te parezco lindo",
  "Respetas a mi familia",
  "Me das todo lo mejor que tienes",
  "Me tomarías el tiempo de decirte mil veces que te amo",
  "Agradeces lo que te doy",
  "Siento que no sabría qué hacer sin ti",
  "Mi vida contigo es plena",
  "Me robaste el corazón en poco tiempo",
  "Confío en nuestro amor",
  "Sé que por más difícil que se ponga todo no nos dejaremos ir",
  "Me pediste ser tu San Valentín",
  "Mi corazón late por ti a mil por hora",
  "Con solo escucharte, me das paz",
  "No temes mostrar lo que sientes conmigo",
  "Demuestras tu amor por mí con acciones",
  "Demuestras tu amor por mí con palabras",
  "Demuestras tu amor por mí con regalos",
  "Demuestras tu amor por mí dándome tiempo de calidad",
  "Demuestras tu amor por mí escuchándome",
  "Cómo se dilatan tus pupilas",
  "No me guardas secretos",
  "Tu voz ronca cuando tienes sueño",
  "Compartes tu tiempo y energía a mi lado",
  "Me das razones para seguir a tu lado, todos los días",
  "Siempre me orientas a hacer lo correcto",
  "Demuestras que me amas de mil formas",
  "En caso de que quiera un espacio, me lo das",
  "Me das la tranquilidad de que estarás ahí siempre",
  "Podemos hablar de temas importantes",
  "Podemos hablar de temas profundos",
  "Podemos hablar de temas randoms",
  "Nunca me haces sentir menos",
  "En vez de querer que cambie, me motivas a mejorar",
  "Te esfuerzas para que mis días sean lindos",
  "Me haces sentir seguro sobre nuestra relación",
  "Buscas lo positivo para hacerme feliz",
  "Te quedas hasta tarde hablando conmigo",
  "Te preocupas de que no terminemos peleados",
  "Me escribes incluso cuando no tienes mucha batería",
  "Me demuestras que soy una prioridad y no una molestia",
  "Me comprendes cuando estoy cansado o frustrado",
  "Por lo más mínimo que hagamos juntos siempre estamos felices",
  "Contigo siento propósito en la vida",
  "Me ayudas a darme cuenta de que las cosas no siempre son como lo siento",
  "Soportas mis chistes",
  "Respetas mis límites emocionales",
  "Me motivas a crecer como persona",
  "La paciencia que tienes para soportarme es increíble",
  "Soportas mis cambios de ánimo",
  "Logras sacar mi lado más tierno contigo",
  "Siempre encuentras la manera de sorprenderme",
  "La luz que traes a mi vida sin darte cuenta",
  "Cada día me das una nueva razón para amarte",
  "Sin importar cuántas razones escriba, siempre habrá más",
  "Recuerdas mis cosas favoritas y me sorprendes con ellas",
  "Expresas amor sin necesidad de grandes gestos",
  "Te emocionas con cosas pequeñas",
  "Tu habilidad para hacerme olvidar mis preocupaciones",
  "Me haces sentir seguro cuando tengo miedo",
  "Siempre encuentras algo positivo en cada situación",
  "La dulzura en tu voz cuando susurras",
  "Tu capacidad para hacer que el tiempo se detenga cuando estamos juntos",
  "Siempre intentas mejorar y crecer como persona",
  "La paciencia con la que explicas algo cuando no lo entiendo",
  "La calidez de tu cuerpo cuando nos abracemos",
  "La manera en que me haces sentir que soy suficiente tal y como soy",
  "Me haces reír incluso cuando estoy molesto",
  "Me enseñas a ver la vida con más optimismo",
  "Te esfuerzas por entenderme",
  "Cómo me miras cuando me ves después de mucho tiempo",
  "Tu compromiso con lo que amas",
  "Recuerdas cosas que yo olvido",
  "Tu risa cuando ves algo realmente gracioso",
  "Haces que cualquier problema parezca menos grave",
  "Me animas a perseguir mi sueño",
  "Tu creatividad cuando planeamos cosas juntos",
  "Me das confianza para ser yo misma",
  "Respetas mis decisiones sin cuestionarlas",
  "Tu capacidad para ver lo bueno en las personas",
  "Me das tranquilidad con solo estar cerca",
  "Sabes cuándo necesito espacio",
  "Sabes cuándo necesito compañía",
  "Tu sentido del humor que hace que cualquier momento sea divertido",
  "La forma en que disfrutas los atardeceres",
  "Cuando tengo una pesadilla me consuelas",
  "Celebras tanto las cosas pequeñas que logras que las vea más grandes",
  "Me dan ganas de hacer cosas buenas por mi cuenta, porque me felicitas y me alientas a seguir así",
  "Cuando me siento mal incluso por la cosa más tonta me consuelas",
  "Contigo jamás tengo miedo a mostrarme vulnerable",
  "Me das razones para disfrutar de lo que tengo",
  "Sin importar lo que tenga que afrontar, me apoyas y no me dejas a un lado",
  "Cuando todo se vuelve caótico, abrumante y muy grande, eres mi refugio",
  "No necesito un consejo, o una palabra, con tu presencia es más que suficiente",
  "Todo me recuerda a ti",
  "Me dan ganas de explorar todo el mundo a tu lado",
  "Tus lindos gestos de cariño me hacen sentir el niño más especial",
  "Aunque no entienda algunas cosas, tú me las muestras porque son importantes",
  "No necesitas ser perfecta para que sea feliz a tu lado",
  "Sé que serías un gran padre",
  "Nunca te rindes con los estudios",
  "Cuando nos vemos mi corazón lo sabe, late como loco",
  "Los dos nos demostramos amor como si recién nos hubiéramos enamorado",
  "No juzgas a los demás",
  "Tus piropos",
  "Tus caricias",
  "Las preguntas que haces",
  "Me dan ganas de imitarte, de lo preciosa que eres",
  "Tu corte de cabello",
  "Cuando no tengo batería social, tú eres mi batería",
  "Me dices que tu amor por mí es inefable",
  "Me apoyo en ti cuando estoy cansado",
  "Te apoyas en mí cuando estás cansada",
  "La calidez que me da tu sonrisa me alegra",
  "Tu amor me da paz en mi corazón",
  "No pides nada a cambio con cada detallito que me das",
  "Estás conmigo de forma incondicional",
  "Eres dulce",
  "Me tratas de cuidar si estoy enferma",
  "Sabes combinar lo lindo de nuestro amor con risas",
  "Te quiero",
  "Me quieres",
  "El brillo que le diste a mis ojos, jamás lo habían tenido",
  "Hablo de ti con todo el mundo",
  "Te extraño siempre",
  "Me extrañas siempre",
  "Los dos amamos el mismo ramen",
  "Tu amor por los makis",
  "Cómo te llevas con mi mami",
  "Lo mucho que te gusta Dragon Ball",
  "Tu gusto por GDB",
  "Tu forma de rapear",
  "Tus nombres",
  "Eres mi notificación favorita",
  "No brillas, deslumbras",
  "El universo conspiró a nuestro favor",
  "Tú",
  "La última y la más importante, yo te amo más de lo que tú me amas",
  "Me siento afortunado todos los días",
  "Siempre encuentras las palabras exactas para animarme",
  "Tu habilidad para transformar un mal día en uno increíble",
  "La forma en que me motivas a ser mejor cada día",
  "Tu sinceridad en cada palabra que dices",
  "El amor con el que haces cada cosa",
  "La dulzura con la que me tomarás la mano",
  "Tu forma de hacerme sentir importante sin esfuerzo",
  "La manera en que sonríes cuando me ves después de un tiempo",
  "Recuerdas las fechas sin necesidad de recordatorios",
  "Tu amor por la comida",
  "Cómo brillan tus ojos cada que hablas de algo que te apasiona",
  "Tu dedicación para cumplir tus sueños",
  "Cómo te preocupas por mi bienestar sin pedírtelo",
  "Tu risa cuando te cuento un chiste malo",
  "Cómo me abrazarás como si no quisieras soltarme nunca",
  "La confianza con la que enfrentas los retos de la vida",
  "Tu amabilidad con los desconocidos",
  "Conviertes cualquier lugar en un hogar",
  "Tu creatividad al momento de planear sorpresas",
  "Me haces sentir amado con un simple mensaje",
  "Tu valentía para enfrentarte a lo que sea",
  "Me enseñas a ver la vida de otra perspectiva",
  "Tu forma de protegerme sin ser sobreprotectora",
  "Me haces reír en los peores momentos",
  "La pasión con la que hablas de tus metas",
  "Tu increíble habilidad para contar historias",
  "Haces que sienta que soy la persona más especial del mundo",
  "Siempre encuentras soluciones a cualquier problema",
  "Tu respeto por mis sentimientos y opiniones",
  "Cómo me cuidas cuando me enfermo",
  "Tu amor por los niños",
  "La ternura con la que tratas a los niños",
  "Cómo cada día descubro algo nuevo y maravilloso sobre ti",
  "La manera en que respetas el espacio y la libertad de cada persona",
  "Tu paciencia infinita cuando las cosas no salen como esperas",
  "Sabes cuándo necesito un abrazo sin pedírtelo",
  "Respetas mis sueños y metas",
  "Siempre encuentras tiempo para estar conmigo",
  "Tu amor por los días fríos y cómo me abrazarás más fuerte",
  "Me harás sentir seguro con tus abrazos",
  "Cada día encuentro más razones para amarte",
  "Sin importar qué tan ocupada estás me priorizas",
  "Me miras como si fueras afortunada de tenerme",
  "Demuestras cuánto me conoces con detalles",
  "Me ayudas a ver lo mejor de mí cuando dudo",
  "Tu amor por los abrazos largos y apretados",
  "Cómo me proteges",
  "Me haces sentir cómodo con quien soy",
  "Me calmas cuando tengo un mal día",
  "Encuentras belleza en lo más sencillo",
  "Tu amor por los atardeceres y la forma en que los disfrutas",
  "Tu amor por la espontaneidad",
  "Me siento afortunado de compartir la vida contigo",
  "Me tomas en serio cuando te hablo de mis sueños",
  "Cómo me incluyes en tus planes en un futuro",
  "Tu amor por los detalles que otras ignoran",
  "La dulzura con la que te despides de mí, incluso si es por poco tiempo",
  "Me miras con orgullo cuando logro algo",
  "Tu creatividad al escribir mensajes bonitos",
  "Compartes conmigo tus miedos",
  "Quieres que me cuide",
  "Me das mi espacio",
  "No tiene que pasar algo necesario para darme un regalito",
  "Muestras tu lado frágil conmigo",
  "Contigo, jamás tendré miedo",
  "Me dejas ser yo misma",
  "Me amas con mis tonterías y locuras",
  "Tu amor por mí es sincero",
  "Tu amor por mí es genuino",
  "Me haces sentir acompañado",
  "Nunca estoy solo a tu lado",
  "Me animas a ser valiente",
  "Siempre estás calientita y me haces sentir cómodo",
  "Tu responsabilidad",
  "El gran hermano que eres",
  "Eres mi niña",
  "Me dejas cuidarte",
  "Te esfuerzas por siempre darme lo mejor",
  "Nunca me fallarás",
  "Me enamoré de ti desde la primera vez que te vi",
  "Me enamoraste",
  "Demuestras que te importo",
  "La emoción que tienes al vernos",
  "Creas planes para vernos",
  "Me dejas ser niño",
  "Me respetas",
  "Respetas a los demás animales",
  "Cómo eres de responsable con Lunita",
  "Tu corazón blandito",
  "Te ablandas conmigo",
  "Las cartas que nos damos",
  "Me presumes",
  "Hablas de mí con tus amigos",
  "Hablas de mí con tu familia",
  "Tus dulces palabras",
  "Tu comunicación",
  "Los TikToks que me mandas",
  "Me siento completo contigo",
  "Te respetas y amas como soy",
  "Compartes tus deseos conmigo",
  "Me escuchas con atención",
  "Siempre me apoyas",
  "Tenemos muchas cosas en común",
  "Haces que mejore",
  "Logras que sea mejor persona",
  "Aceptas mis defectos y me amas igualmente",
  "Cuando me siento mal tú eres en quien confío",
  "Te preocupas demasiado cuando no como",
  "Me animas a que siempre siga adelante",
  "Me tienes paciencia, amor y cariño cuando me hablas",
  "Eres mi alma gemela",
  "Me dices que te gusta pasar tiempo",
  "Me amas demasiado más de lo que yo a ti te podre amar, eres mi unico lugar seguro"
];

const uniqueReasons = [
  "Tu forma de mirar el mundo lo vuelve más bonito",
  "Tienes una manera de existir que deja huella",
  "Tu risa tiene un sonido que nadie más tiene",
  "Sabes convertir el caos en calma",
  "Tu forma de amar no se parece a ninguna otra",
  "Tienes una chispa que nadie puede apagar",
  "Tu manera de ser tú misma inspira a otros a serlo también",
  "Sabes iluminar cualquier lugar con solo estar ahí",
  "Tu forma de hablar tiene un encanto propio",
  "Tienes una manera de cuidar que no se aprende, se siente",
  "Tu sensibilidad te permite entender lo que otros no ven",
  "Sabes convertir un mal día en uno soportable con una sola palabra",
  "Tu forma de pensar rompe con lo común",
  "Tienes una manera de mirar que dice más que mil palabras",
  "Tu autenticidad no necesita esfuerzo",
  "Sabes hacer que las cosas simples se sientan mágicas",
  "Tu forma de disfrutar la vida es contagiosa",
  "Tienes una manera de perdonar que sana",
  "Tu paciencia parece no tener límite",
  "Sabes encontrar razones para sonreír incluso cuando es difícil",
  "Tu forma de ser leal no depende de las circunstancias",
  "Tienes una manera de escuchar que hace sentir comprendido",
  "Tu curiosidad te hace aprender de todo lo que te rodea",
  "Sabes ser fuerte sin perder la ternura",
  "Tu forma de soñar no conoce límites",
  "Tienes una manera de amar que no busca nada a cambio",
  "Tu determinación te hace seguir incluso cuando todo se complica",
  "Sabes hacer sentir especial a quien tienes cerca",
  "Tu forma de reír cambia el ambiente por completo",
  "Tienes una manera de ver lo positivo incluso en lo negativo",
  "Tu forma de expresarte es única e irrepetible",
  "Sabes convertir un recuerdo simple en algo inolvidable",
  "Tu forma de crecer te hace mejor persona cada día",
  "Tienes una manera de motivar que empuja a los demás a intentarlo",
  "Tu creatividad transforma lo ordinario en extraordinario",
  "Sabes ser honesta incluso cuando cuesta",
  "Tu forma de cuidar los detalles no pasa desapercibida",
  "Tienes una manera de dar sin esperar reconocimiento",
  "Tu empatía te hace ponerte en el lugar de los demás sin esfuerzo",
  "Sabes transformar la tristeza en fortaleza",
  "Tu forma de disfrutar lo pequeño demuestra tu grandeza",
  "Tienes una manera de hacer sentir acompañado a quien está solo",
  "Tu forma de luchar por tus sueños es admirable",
  "Sabes hacer que cualquier lugar se sienta como en casa",
  "Tu forma de ser espontánea sorprende siempre",
  "Tienes una manera de ver la belleza donde otros no la ven",
  "Tu resiliencia te hace levantarte una y otra vez",
  "Sabes valorar a quienes están a tu lado",
  "Tu forma de hablar de tus sueños contagia motivación",
  "Tienes una manera de ser generosa sin que se note el esfuerzo",
  "Tu forma de reaccionar ante los problemas muestra tu madurez",
  "Sabes encontrar el lado divertido de casi cualquier situación",
  "Tu forma de mostrar afecto es genuina",
  "Tienes una manera de inspirar confianza sin proponértelo",
  "Tu forma de defender lo que crees justo es admirable",
  "Sabes hacer que el tiempo con vos valga la pena",
  "Tu forma de aceptar tus errores te hace más fuerte",
  "Tienes una manera de disfrutar la vida que contagia",
  "Tu forma de ser diferente es tu mayor virtud",
  "Sabes convertir la incertidumbre en calma",
  "Tu forma de tratar a los animales dice mucho de ti",
  "Tienes una manera de ser tierna sin dejar de ser fuerte",
  "Tu forma de hablar de lo que amas se nota en tu mirada",
  "Sabes hacer que cada conversación se sienta valiosa",
  "Tu forma de ser paciente con los demás es admirable",
  "Tienes una manera de convertir los obstáculos en oportunidades",
  "Tu forma de ver el futuro transmite esperanza",
  "Sabes cómo hacer sentir bien a quien tienes cerca",
  "Tu forma de disfrutar las pequeñas victorias inspira",
  "Tienes una manera única de ser tú, sin comparaciones",
  "Tu forma de mostrar interés genuino se nota en cada gesto",
  "Sabes cómo mantener la calma en medio del caos",
  "Tu forma de valorar lo que tienes te hace especial",
  "Tienes una manera de ser vulnerable que demuestra valentía",
  "Tu forma de reír hasta las lágrimas es contagiosa",
  "Sabes cómo hacer que un mal momento se sienta pasajero",
  "Tu forma de ser curiosa te lleva a descubrir cosas nuevas",
  "Tienes una manera de decir la verdad con delicadeza",
  "Tu forma de admirar lo simple demuestra tu sensibilidad",
  "Sabes cómo convertir un \"no puedo\" en un \"lo voy a intentar\"",
  "Tu forma de disfrutar tus propios logros inspira a seguir",
  "Tienes una manera de ser constante que pocos logran",
  "Tu forma de mirar hacia adelante demuestra tu fortaleza",
  "Sabes cómo hacer que las personas se sientan cómodas contigo",
  "Tu forma de compartir lo que sientes es un regalo",
  "Tienes una manera de ser espontánea que alegra el día",
  "Tu forma de ser incondicional no tiene comparación",
  "Sabes cómo transformar un mal recuerdo en una lección",
  "Tu forma de disfrutar la música dice mucho de tu alma",
  "Tienes una manera de conectar con los demás casi instantánea",
  "Tu forma de cuidar tus relaciones demuestra madurez",
  "Sabes cómo hacer que las cosas difíciles parezcan más ligeras",
  "Tu forma de ser agradecida con lo que tienes inspira",
  "Tienes una manera de ser valiente que no siempre se nota",
  "Tu forma de disfrutar cada etapa de tu vida es hermosa",
  "Sabes cómo mantenerte fiel a ti misma",
  "Tu forma de amar sin condiciones te hace única",
  "Tienes una manera de iluminar la vida de quienes te rodean",
  "Tu forma de ser tú, simplemente, ya te hace especial",
];

// Fábrica genérica de "mazo aleatorio sin repetir hasta agotar"
function createDeck({ items, cardId, countId, listId }) {
  let bag = [];
  let lastIndex = null;

  function refillBag() {
    bag = items.map((_, i) => i);
    // Fisher-Yates shuffle
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
  }

  function draw() {
    if (!items.length) return;
    if (bag.length === 0) refillBag();
    let index = bag.pop();
    // Evita mostrar la misma dos veces seguidas si hay más de una
    if (items.length > 1 && index === lastIndex && bag.length > 0) {
      bag.unshift(index);
      index = bag.pop();
    }
    lastIndex = index;

    const cardEl = document.getElementById(cardId);
    const countEl = document.getElementById(countId);
    cardEl.classList.add('flip');
    setTimeout(() => {
      cardEl.textContent = items[index];
      countEl.textContent = `${items.length - bag.length} / ${items.length}`;
      cardEl.classList.remove('flip');
    }, 180);
  }

  function renderList() {
    const listEl = document.getElementById(listId);
    listEl.innerHTML = items
      .map((text, i) => `<div class="deck-list-item" data-n="${i + 1}">${text}</div>`)
      .join('');
  }

  function toggleList() {
    const listEl = document.getElementById(listId);
    if (listEl.classList.contains('hidden')) {
      renderList();
      listEl.classList.remove('hidden');
    } else {
      listEl.classList.add('hidden');
    }
  }

  return { draw, toggleList };
}

const reasonsDeck = createDeck({
  items: reasons, cardId: "reasonsCard", countId: "reasonsCount", listId: "reasonsList"
});
const uniqueDeck = createDeck({
  items: uniqueReasons, cardId: "uniqueCard", countId: "uniqueCount", listId: "uniqueList"
});

function drawReason() { reasonsDeck.draw(); }
function toggleReasonsList() { reasonsDeck.toggleList(); }
function drawUnique() { uniqueDeck.draw(); }
function toggleUniqueList() { uniqueDeck.toggleList(); }

reasonsDeck.draw();
uniqueDeck.draw();

// === Nuestra historia (capítulos) ===
// PERSONALIZA AQUÍ: agrega tantos capítulos como quieras, en el orden que quieras contarlos.
const stories = [
  {
    title: "El día que todo empezó",
    date: "10 - Agosto - 2024",
    text: `Un día yo fuí con mi mamá a trabajar, bueno, a hecharle porras más que nada, me habia dejado sentadito
          para que no molestara, como siempre, y decidí descargar esa aplicación, mas encima yo iba buscando un jueguito jasjaj
          que ni me acuerdo como se llamaba, ya fue, pero entre ahí, me encontre gente muy rara a decir verdad, creo que estuve
          un buen rato, bastante, y en un momento saliste tú, una hola cambió todo.`
  },
  {
    title: "Conociendonos de verdad",
    date: "** - ***** - 2025",
    text: `Recuerdo que siempre nos quedabamos hablando, jugando fortnite o algo asi, recuedo que casi nunca hablaba, me daba verguenza, aparte siempre habia algunos de tus amigos, y me daba mas verguenza aun, pero siempre estabas conmigo, me hablabas con cariño como lo haces ahora.`
  },
  {
    title: "El día",
    date: "27 - Enero - 2025",
    text: `Aca nos vamos a saltar un cacho de la historia, recuerdo este día, fue hermoso, nunca creí que me pasaria algo asi.`
  },
  {
    title: "¿Llorar?",
    date: "** - Enero - 2025",
    text: `Recuerdo que un día te llame por la noche, eran como las 11 o las 12, no recuerdo, pero ese dia te habias ido a dormir bastante temprano, raro a decir verdad, pero me contestaste, parecias asustada, preguntame si me pasaba algo, y relativamente sí, había recien terminado algo para ti, 50 cosas que amo de ti, recuerdo que pusiste llorar y decir que nadie te habia dicho cosas tan bonitas, y eso me hizo sentir ser alguien muy especial para ti, y a día de hoy puedo seguir diciendo lo mismo.`
  },
  {
    title: "Un futuro",
    date: "** - ***** - 2026-****",
    text: `Un final bonito de todo esto
    Todavía quedan muchas, cientos, miles incluso, de páginas en blanco. Quiero llenarlas, y si es contigo mejor de los mejore,
    contigo, nuevos y mejores recuerdos llenso de felicidad, nuevas risas, nuevos sueños juntos, muchos de mis sueños y
    metas te incluyen a ti, tanto que si o si tienes que estar ahi, tengo muchos "Te amo <3" más que decirte y demostrarte.`
  },
];

let currentStory = 0;

function renderStoryMenu() {
  const menuEl = document.getElementById("storyMenu");
  menuEl.innerHTML = stories
    .map((s, i) => `<button class="story-menu-item" data-i="${i}">${i + 1}. ${s.title}</button>`)
    .join('');
  menuEl.querySelectorAll('.story-menu-item').forEach(btn => {
    btn.addEventListener('click', () => {
      currentStory = parseInt(btn.dataset.i);
      renderStory();
    });
  });
}

function renderStory() {
  const story = stories[currentStory];
  document.getElementById("storyChapter").textContent = `Capítulo ${currentStory + 1}`;
  document.getElementById("storyDate").textContent = story.date || "";
  document.getElementById("storyTitle").textContent = story.title;
  document.getElementById("storyText").textContent = story.text;

  document.querySelectorAll('.story-menu-item').forEach((btn, i) => {
    btn.classList.toggle('active', i === currentStory);
  });
}

function prevStory() {
  currentStory = (currentStory - 1 + stories.length) % stories.length;
  renderStory();
}

function nextStory() {
  currentStory = (currentStory + 1) % stories.length;
  renderStory();
}

renderStoryMenu();
renderStory();

function spawnFloatingWords(containerId, sourceArray, total = 10) {
  const container = document.getElementById(containerId);
  if (!container || !sourceArray.length) return;

  const rand = (min, max) => Math.random() * (max - min) + min;

  for (let i = 0; i < total; i++) {
    const span = document.createElement('span');
    span.className = 'float-word';
    span.textContent = sourceArray[Math.floor(Math.random() * sourceArray.length)];

    span.style.left = rand(2, 85) + '%';
    span.style.fontSize = rand(1, 1.8).toFixed(2) + 'rem';
    span.style.animationDuration = rand(13, 22) + 's';
    span.style.animationDelay = rand(0, 8) + 's';

    container.appendChild(span);
  }
}

spawnFloatingWords('reasonsFloatBg', reasons, 10);
spawnFloatingWords('uniqueFloatBg', uniqueReasons, 10);
