/* =========================================================================
   Олег и Дарья · 12.12.2026
   Всё, что может понадобиться поменять, собрано в CONFIG.
   ========================================================================= */
const CONFIG = {
  /** Начало торжества: питает таймер на посадочном талоне. */
  weddingISO: '2026-12-12T17:00:00+03:00',

  /** Адрес веб-приложения Google Apps Script для анкеты (см. README). */
  rsvpEndpoint: '',

  /** Ссылка на доску Pinterest. Пустая строка = кнопка скрыта. */
  pinterestUrl: '',

  mapUrl: 'https://yandex.ru/maps/?text=' +
    encodeURIComponent('Москва, Измайловское шоссе, 71, корп. 3В, гостиница Вега Измайлово'),
  hostTelegram: 'mutenin',

  /** Палитра дресс-кода: цвета из присланной карточки. */
  palette: {
    women: [
      { name: 'Стальной голубой', hex: '#6B7F98' },
      { name: 'Пудрово-голубой', hex: '#AFC7E3' },
      { name: 'Ледяной голубой', hex: '#D7E6F3' },
      { name: 'Холодный бежевый', hex: '#D8C9BD' },
      { name: 'Пыльная роза', hex: '#C8929B' },
      { name: 'Ягодный', hex: '#8B1E3F' },
      { name: 'Бордовый', hex: '#5A0E1A' },
    ],
    men: [
      { name: 'Чёрный', hex: '#1A1A1A' },
      { name: 'Графитовый', hex: '#4B4B4B' },
      { name: 'Стальной голубой', hex: '#6B7F98' },
      { name: 'Пудрово-голубой', hex: '#AFC7E3' },
      { name: 'Холодный бежевый', hex: '#D8C9BD' },
      { name: 'Ягодный', hex: '#8B1E3F' },
      { name: 'Бордо', hex: '#5A0E1A' },
    ],
  },
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

/* =========================================================================
   КАМИН: кирпич, свечи, гирлянда и живой огонь
   ========================================================================= */
const SVG_NS = 'http://www.w3.org/2000/svg';
function seeded(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

(function buildHearthDecor() {
  /* кладка задней стенки */
  let d = '';
  for (let y = 166, row = 0; y <= 238; y += 8, row++) {
    d += `M128 ${y} H232 `;
    for (let x = 128 + (row % 2 ? 8 : 16); x < 232; x += 16) d += `M${x} ${y} V${Math.min(y + 8, 240)} `;
  }
  $('#bricks').innerHTML = `<path d="${d}"/>`;

  const front = $('#candles').ownerSVGElement;
  front.querySelector('defs').insertAdjacentHTML('beforeend', `
    <linearGradient id="candleWax" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#3f0912"/><stop offset=".38" stop-color="#7c1a2c"/>
      <stop offset=".6" stop-color="#9a3045"/><stop offset="1" stop-color="#4a0c17"/>
    </linearGradient>
    <linearGradient id="waxLit" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffb070" stop-opacity=".35"/><stop offset="1" stop-color="#ffb070" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="flameG" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#ff7a1f"/><stop offset=".3" stop-color="#ffae3d"/>
      <stop offset=".68" stop-color="#ffe08a"/><stop offset="1" stop-color="#fff3cf" stop-opacity=".15"/>
    </linearGradient>
    <radialGradient id="fGlow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".85"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
    <radialGradient id="cGlow"><stop offset="0" stop-color="#ffcf84" stop-opacity=".42"/><stop offset="1" stop-color="#ffcf84" stop-opacity="0"/></radialGradient>
    <radialGradient id="bauble" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#c2405a"/><stop offset=".45" stop-color="#7a1428"/><stop offset="1" stop-color="#3a0710"/></radialGradient>
    <radialGradient id="lightG"><stop offset="0" stop-color="#ffe6a8"/><stop offset=".35" stop-color="#ffd27a" stop-opacity=".7"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>`);

  /* еловая гирлянда вдоль полки: иголки, бордовые шары, тёплые огоньки */
  const rnd = seeded(1212);
  const greens = ['#0c271d', '#123426', '#18402f', '#1f4c39', '#2a5d47', '#3a7258'];
  const strokes = greens.map(() => '');
  const x0 = 88, x1 = 272, base = 76.5;
  for (let i = 0; i < 520; i++) {
    const t = rnd();
    const x = x0 + t * (x1 - x0);
    const lump = Math.sin(t * Math.PI * 7) * 1.4 + Math.sin(t * Math.PI * 17) * .8;
    const y = base - 2 + lump + (rnd() - .5) * 5;
    const hang = rnd() < .2;
    const ang = hang ? Math.PI / 2 + (rnd() - .5) * 1.1 : -Math.PI / 2 + (rnd() - .5) * 2.6;
    const len = hang ? 3 + rnd() * 4 : 4 + rnd() * 5;
    const c = Math.min(greens.length - 1, Math.floor(rnd() * rnd() * greens.length + (hang ? 0 : rnd() * 2)));
    strokes[c] += `M${x.toFixed(1)} ${y.toFixed(1)}l${(Math.cos(ang) * len).toFixed(1)} ${(Math.sin(ang) * len).toFixed(1)}`;
  }
  let g = strokes.map((dd, i) => `<path d="${dd}" stroke="${greens[i]}" stroke-width="${1.15 - i * .07}" stroke-linecap="round" fill="none"/>`).join('');
  [.1, .27, .44, .61, .78, .93].forEach((t, i) => {
    const x = x0 + t * (x1 - x0), y = 75 + (i % 2) * 2.2, r = 3.4 + (i % 3) * .45;
    g += `<rect x="${(x - 1).toFixed(1)}" y="${(y - r - 1.6).toFixed(1)}" width="2" height="1.8" fill="#b9a46e"/>
      <circle cx="${x.toFixed(1)}" cy="${y}" r="${r}" fill="url(#bauble)"/>
      <ellipse cx="${(x - r * .35).toFixed(1)}" cy="${(y - r * .4).toFixed(1)}" rx="${(r * .32).toFixed(1)}" ry="${(r * .2).toFixed(1)}" fill="#fff" fill-opacity=".55"/>`;
  });
  for (let i = 0; i < 18; i++) {
    const x = x0 + 4 + rnd() * (x1 - x0 - 8), y = base - 4 + (rnd() - .5) * 6;
    g += `<g class="g-light" style="--d:${(-rnd() * 3).toFixed(2)}s;--td:${(2.2 + rnd() * 2).toFixed(2)}s">
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="url(#lightG)"/>
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r=".9" fill="#fff4d6"/></g>`;
  }
  $('#garland').innerHTML = g;

  /* свечи разной высоты с наплывами воска */
  const candles = [
    { x: 40, h: 46, w: 9 }, { x: 54, h: 32, w: 8.5 }, { x: 67, h: 21, w: 8 },
    { x: 285, h: 23, w: 8 }, { x: 297, h: 40, w: 9 }, { x: 311, h: 29, w: 8.5 },
  ];
  const order = [0, 5, 1, 4, 2, 3];
  $('#candles').innerHTML = candles.map((c, i) => {
    const cx = c.x + c.w / 2, top = 78 - c.h;
    const drip = (dx, len) => `<path d="M${(c.x + dx).toFixed(1)} ${top} v${len} a1.05 1.05 0 0 0 2.1 0 v-${len} Z" fill="#8e2639"/>`;
    const vars = `--d:${(-rnd() * 2.5).toFixed(2)}s;--fd:${(1.9 + rnd() * 1.3).toFixed(2)}s;--gd:${(2.6 + rnd() * 1.6).toFixed(2)}s;--light:${(0.5 + order.indexOf(i) * 0.28).toFixed(2)}s`;
    return `<g style="${vars}">
      <circle class="candle__fire candle__glow" cx="${cx}" cy="${top - 9}" r="26" fill="url(#cGlow)"/>
      <ellipse cx="${cx}" cy="78.2" rx="${c.w * .8}" ry="1.4" fill="#0b2219" fill-opacity=".55"/>
      <rect x="${c.x}" y="${top}" width="${c.w}" height="${c.h}" rx="1.2" fill="url(#candleWax)"/>
      <rect class="candle__fire" x="${c.x}" y="${top}" width="${c.w}" height="${Math.min(14, c.h)}" rx="1.2" fill="url(#waxLit)"/>
      ${drip(1.2, 4 + (i % 3) * 3)}${drip(c.w - 3.4, 2.5 + (i % 2) * 4)}
      <ellipse cx="${cx}" cy="${top}" rx="${c.w / 2}" ry="1.5" fill="#b4475b"/>
      <ellipse cx="${cx}" cy="${top + .2}" rx="${c.w / 2 - 1.5}" ry=".8" fill="#6e1424"/>
      <path d="M${cx} ${top} q.4 -1.6 -.2 -3.2" stroke="#2a221c" stroke-width=".8" fill="none" stroke-linecap="round"/>
      <g class="candle__fire">
        <circle class="candle__glow" cx="${cx}" cy="${top - 7}" r="9" fill="url(#fGlow)"/>
        <g class="candle__flame">
          <path d="M${cx} ${top - 2.4} C${cx - 2.7} ${top - 4.4} ${cx - 2.4} ${top - 9} ${cx} ${top - 14} C${cx + 2.4} ${top - 9} ${cx + 2.7} ${top - 4.4} ${cx} ${top - 2.4} Z" fill="url(#flameG)"/>
          <ellipse cx="${cx}" cy="${top - 5.6}" rx=".95" ry="2.3" fill="#fffbea"/>
          <ellipse cx="${cx}" cy="${top - 3.3}" rx="1.3" ry=".85" fill="#7fb2ff" fill-opacity=".55"/>
        </g>
      </g>
    </g>`;
  }).join('');
})();

/* Огонь: частицы с аддитивным смешиванием. Цвет зависит от возраста частицы:
   бело-жёлтое ядро у поленьев, оранжевые языки, тёмно-красные кончики. */
const hearthFire = (function () {
  const hearth = $('#hearth');
  const canvas = $('#fire');
  const ctx = canvas.getContext('2d');
  const RAMP = [[0, [255, 236, 180]], [.12, [255, 210, 116]], [.3, [255, 160, 56]], [.55, [228, 88, 26]], [.8, [140, 34, 14]], [1, [48, 12, 6]]];
  const N = 28;
  const TONGUES = [{ o: -19, s: 8, h: 1.05 }, { o: 0, s: 10, h: 1.45 }, { o: 19, s: 8, h: 1.1 }];
  const sprites = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    let j = 0;
    while (j < RAMP.length - 2 && t > RAMP[j + 1][0]) j++;
    const [t0, c0] = RAMP[j], [t1, c1] = RAMP[j + 1];
    const f = (t - t0) / (t1 - t0);
    const c = c0.map((v, k) => Math.round(v + (c1[k] - v) * f));
    const s = document.createElement('canvas');
    s.width = s.height = 64;
    const sc = s.getContext('2d');
    const gr = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, `rgba(${c},1)`);
    gr.addColorStop(.38, `rgba(${c},.55)`);
    gr.addColorStop(1, `rgba(${c},0)`);
    sc.fillStyle = gr;
    sc.fillRect(0, 0, 64, 64);
    sprites.push(s);
  }

  let W = 0, H = 0, k = 1, flames = [], sparks = [], lit = 0, litTarget = 0;
  let raf = 0, last = 0, time = 0, visible = true, frame = 0;

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height; k = H / 148;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  const noise = (t) => (Math.sin(t * 1.7) + Math.sin(t * 2.9 + 1.3) * .6 + Math.sin(t * 5.3 + .7) * .3 + Math.sin(t * 11.1) * .12) / 2.02;

  function step(dt) {
    time += dt * 16.67;
    lit += (litTarget - lit) * Math.min(1, .012 * dt);
    const n01 = (noise(time / 1000) + 1) / 2;
    const I = lit * (.82 + .18 * n01);
    const cx = W / 2, baseY = 123 * k, spread = 25 * k;
    const sway = Math.sin(time * .0011) * .6 + Math.sin(time * .0027 + 2) * .35;

    /* три языка пламени над поленьями, каждый дышит в своём ритме */
    const e = TONGUES.map((tg, i) => .35 + .65 * (noise(time / 650 + i * 2.3) + 1) / 2);
    const eSum = e[0] + e[1] + e[2];
    let spawn = 10.5 * I * dt;
    while (spawn > 0) {
      if (Math.random() < spawn) {
        let r = Math.random() * eSum, i = 0;
        while (i < 2 && r > e[i]) { r -= e[i]; i++; }
        const tg = TONGUES[i], g = gauss();
        const strength = e[i];
        flames.push({
          x: cx + (tg.o + g * tg.s) * k, y: baseY + Math.random() * 4 * k,
          vx: (Math.random() - .5) * .3 * k, vy: -(.55 + Math.random() * .7) * k * (.7 + strength * .45),
          age: 0, max: (26 + Math.random() * 30) * tg.h * (.75 + strength * .4) * (1 - Math.abs(g) * .4),
          size: (6 + Math.random() * 7.5) * k * (1 - Math.abs(g) * .3), seed: Math.random() * 6.28, home: cx + tg.o * k * .55,
        });
      }
      spawn -= 1;
    }
    if (Math.random() < .045 * I * dt) {
      sparks.push({
        x: cx + gauss() * spread * .6, y: baseY - 8 * k,
        vx: (Math.random() - .5) * .7 * k, vy: -(1.1 + Math.random() * 1.5) * k,
        age: 0, max: 45 + Math.random() * 45, seed: Math.random() * 6.28,
      });
    }

    for (let i = flames.length - 1; i >= 0; i--) {
      const p = flames[i];
      p.age += dt;
      if (p.age >= p.max) { flames.splice(i, 1); continue; }
      const t = p.age / p.max;
      p.vx += (p.home - p.x) * .0036 * dt;
      p.vy -= .012 * k * dt;
      p.x += (p.vx + Math.sin(time * .004 + p.seed) * .22 * k + sway * .25 * k * t) * dt;
      p.y += p.vy * dt;
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.age += dt;
      if (s.age >= s.max) { sparks.splice(i, 1); continue; }
      s.vx += Math.sin(time * .006 + s.seed) * .02 * k * dt;
      s.vy *= 1 - .004 * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
    }

    frame++;
    if (frame % 4 === 0) hearth.style.setProperty('--glow', (.6 + .4 * n01 * lit).toFixed(3));
    return I;
  }

  function draw(I) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    const cx = W / 2, baseY = 123 * k;
    // раскалённое основание
    ctx.globalAlpha = .55 * I;
    ctx.drawImage(sprites[6], cx - 44 * k, baseY - 12 * k, 88 * k, 26 * k);
    ctx.globalAlpha = .45 * I;
    ctx.drawImage(sprites[2], cx - 26 * k, baseY - 6 * k, 52 * k, 14 * k);
    for (const p of flames) {
      const t = p.age / p.max;
      const s = p.size * (.65 + .35 * Math.min(1, t / .2)) * (1 - t * .5);
      ctx.globalAlpha = Math.min(1, t / .1) * Math.pow(1 - t, 1.1) * .5;
      ctx.drawImage(sprites[Math.min(N - 1, Math.floor(t * N))], p.x - s, p.y - s, s * 2, s * 2);
    }
    for (const s of sparks) {
      const t = s.age / s.max;
      const r = (1.4 + (1 - t) * 1.4) * k;
      ctx.globalAlpha = (1 - t) * .95;
      ctx.drawImage(sprites[1 + Math.floor(t * 6)], s.x - r, s.y - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;
  }

  function loop(t) {
    const dt = Math.min(3, (t - (last || t)) / 16.67 || 1);
    last = t;
    draw(step(dt));
    raf = requestAnimationFrame(loop);
  }
  const play = () => {
    if (raf || !visible || document.hidden || reduceMotion || !litTarget) return;
    last = 0;
    raf = requestAnimationFrame(loop);
  };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  resize();
  window.addEventListener('resize', resize);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? play() : stop(); }).observe(hearth);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));

  return {
    ignite() {
      if (litTarget) return;
      litTarget = 1;
      hearth.classList.add('is-lit');
      resize();
      if (reduceMotion) {
        lit = 1;
        for (let i = 0; i < 90; i++) step(1);
        draw(1);
        return;
      }
      setTimeout(play, 700);
    },
  };
})();

/* ---------- ссылки из конфига ---------- */
$('#map-link').href = CONFIG.mapUrl;
$('#host-link').href = `https://t.me/${CONFIG.hostTelegram}`;
if (CONFIG.pinterestUrl) {
  const pin = $('#pinterest-link');
  pin.href = CONFIG.pinterestUrl;
  pin.hidden = false;
}

/* ---------- персональное обращение: ?to=Анне%20и%20Петру ---------- */
try {
  const to = new URLSearchParams(location.search).get('to');
  if (to) $('#env-to').textContent = to.slice(0, 60);
} catch (_) { /* старые браузеры: оставляем «Родных и близких» */ }

/* =========================================================================
   КОНВЕРТ
   ========================================================================= */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

const intro = $('#intro');
const seal = $('#envelope');

function openEnvelope() {
  if (intro.classList.contains('is-open')) return;
  intro.classList.add('is-open');
  const t = reduceMotion ? 0 : 1;
  setTimeout(() => { document.body.classList.add('is-ready'); hearthFire.ignite(); }, 450 * t);
  setTimeout(() => {
    intro.classList.add('is-gone');
    document.body.classList.remove('is-locked');
    releasePage();
    $('#hero-title').focus({ preventScroll: true });
  }, 1750 * t + 20);
}
/* Пока конверт закрыт, страница под ним недоступна для клавиатуры и скринридера */
function releasePage() {
  $('#page').inert = false;
  $('#music').inert = false;
}
seal.addEventListener('click', openEnvelope);

/* ?open — сразу показать приглашение без конверта (удобно для проверки) */
if (new URLSearchParams(location.search).has('open')) {
  intro.classList.add('is-open', 'is-gone');
  document.body.classList.add('is-ready');
  document.body.classList.remove('is-locked');
  releasePage();
  hearthFire.ignite();
}

/* Сердечко всегда ровно посередине между датой на обложке и текстом:
   высота первого экрана зависит от телефона, поэтому считаем на месте. */
function centerHeart() {
  const hb = $('.heartbeat'), letter = $('.letter');
  hb.style.marginTop = '';
  letter.style.paddingTop = '';
  const date = $('.hero__date'), lead = $('.letter__lead');
  const above = hb.offsetTop - (date.offsetTop + date.offsetHeight);
  const below = lead.offsetTop - (hb.offsetTop + hb.offsetHeight);
  const shift = (above - below) / 2;
  const m = parseFloat(getComputedStyle(hb).marginTop) || 0;
  const p = parseFloat(getComputedStyle(letter).paddingTop) || 0;
  hb.style.marginTop = `${(m - shift).toFixed(1)}px`;
  letter.style.paddingTop = `${(p + shift).toFixed(1)}px`;
}
centerHeart();
window.addEventListener('resize', centerHeart);
if (document.fonts) document.fonts.ready.then(centerHeart);

/* =========================================================================
   ПОЯВЛЕНИЕ БЛОКОВ ПРИ ПРОЛИСТЫВАНИИ
   ========================================================================= */
$$('[data-words]').forEach((el) => {
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = '';
  words.forEach((w, i) => {
    const span = document.createElement('span');
    span.className = 'w';
    span.textContent = w;
    span.style.setProperty('--delay', `${i * 0.07}s`);
    el.append(span, ' ');
  });
});

const revealIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    revealIO.unobserve(e.target);
  });
}, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
$$('[data-reveal], [data-words], .sketch, .cal, .pass').forEach((el) => revealIO.observe(el));

/* Самолётик на посадочном талоне взлетает, когда талон виден */
const pass = $('.pass');
const flyIO = new IntersectionObserver(([e]) => {
  if (!e.isIntersecting) return;
  pass.classList.add('is-flying');
  const fly = $('#fly');
  if (reduceMotion) fly.setAttribute('dur', '0.01s');
  setTimeout(() => fly.beginElement(), reduceMotion ? 0 : 500);
  flyIO.disconnect();
}, { threshold: 0.5 });
flyIO.observe(pass);

/* Штрихкод корешка и сканер, который работает только пока талон на экране */
(function boardingExtras() {
  const rnd = seeded(1212);
  let x = 0, bars = '';
  while (x < 300) {
    const w = [1, 1, 1.6, 2.2, 3][Math.floor(rnd() * 5)];
    if (rnd() < .62) bars += `<rect x="${x.toFixed(1)}" y="0" width="${w}" height="46"/>`;
    x += w + [1, 1.4, 2][Math.floor(rnd() * 3)];
  }
  const bc = $('#barcode');
  bc.innerHTML = `<g fill="#1f2622">${bars}</g>`;
  const setW = () => pass.style.setProperty('--bw', `${bc.getBoundingClientRect().width}px`);
  setW();
  window.addEventListener('resize', setW);
  new IntersectionObserver(([e]) => pass.classList.toggle('is-live', e.isIntersecting)).observe(pass);
})();

/* =========================================================================
   КАРТА: деревья, окна, зубцы кремля, снег; петли только пока карта видна
   ========================================================================= */
(function buildMap() {
  const map = $('#map');
  if (!map) return;
  const svg = $('#map-svg');
  const rnd = seeded(2026);
  const f1 = (v) => v.toFixed(1);

  /* фасады башен: белые пилоны и узкие тёмные полосы балконов,
     в полосах по вечерам загораются окна */
  const facade = (x0, x1, y0, y1, step, litShare, dim) => {
    let strips = '', lit = '';
    for (let x = x0; x + 1.6 <= x1; x += step) {
      strips += `M${f1(x)} ${y0}V${y1}`;
      for (let y = y0 + 1; y + 2.4 <= y1; y += 3.6) {
        const roll = rnd();
        if (roll > litShare) continue;
        const cls = roll < litShare * .14 ? 'win tw' : 'win on';
        lit += `<rect class="${cls}" style="--d:${(1.2 + rnd() * 3).toFixed(2)}s" x="${f1(x - .8)}" y="${f1(y)}" width="1.6" height="2.4"/>`;
      }
    }
    let floors = '';
    for (let y = y0 + 3.6; y < y1; y += 7.2) floors += `M${x0 - 1} ${f1(y)}H${x1 + 1}`;
    return `<path d="${strips}" stroke="#8f9aa4" stroke-opacity="${dim}" stroke-width="1.6"/>`
      + `<path d="${floors}" stroke="#ffffff" stroke-opacity=".35" stroke-width=".5"/>${lit}`;
  };
  $('#facadeVega').innerHTML = facade(173, 242, 63, 162, 3.7, .34, .9);
  $('#facadeAlfa').innerHTML = facade(101, 148, 99, 168, 3.9, .22, .6);

  /* деревья в профиль: заснеженные ели и голые зимние деревья */
  const fir = (x, y, h) => {
    const w = h * .62, tiers = 4;
    let g = `<rect x="${f1(x - h * .045)}" y="${f1(y - h * .14)}" width="${f1(h * .09)}" height="${f1(h * .14)}" fill="#5a4334"/>`;
    for (let i = 0; i < tiers; i++) {
      const t = i / tiers;
      const top = y - h + t * h * .62;
      const base = y - h * .12 - (tiers - 1 - i) * h * .17;
      const half = w * (.36 + .64 * (i + 1) / tiers) / 2;
      g += `<path d="M${f1(x)} ${f1(top)} L${f1(x - half)} ${f1(base)} Q${f1(x)} ${f1(base + h * .05)} ${f1(x + half)} ${f1(base)} Z" fill="url(#firG)"/>`;
      g += `<path d="M${f1(x - half * .92)} ${f1(base - .4)} Q${f1(x - half * .4)} ${f1(base + h * .025)} ${f1(x)} ${f1(base + h * .02)}" stroke="#fbfaf6" stroke-width="${f1(Math.max(.9, h * .045))}" stroke-linecap="round" fill="none"/>`;
    }
    g += `<path d="M${f1(x)} ${f1(y - h)} L${f1(x - w * .1)} ${f1(y - h * .82)} Q${f1(x)} ${f1(y - h * .78)} ${f1(x + w * .1)} ${f1(y - h * .82)} Z" fill="#fbfaf6"/>`;
    return g;
  };
  const bare = (x, y, h) => {
    let lines = '', tips = '';
    const branch = (bx, by, len, ang, depth, wdt) => {
      const ex = bx + Math.cos(ang) * len, ey = by + Math.sin(ang) * len;
      lines += `<path d="M${f1(bx)} ${f1(by)}L${f1(ex)} ${f1(ey)}" stroke-width="${wdt.toFixed(2)}"/>`;
      if (depth === 0) { if (rnd() < .5) tips += `<circle cx="${f1(ex)}" cy="${f1(ey)}" r=".7"/>`; return; }
      const n = depth > 2 ? 2 : 2 + (rnd() < .4 ? 1 : 0);
      for (let i = 0; i < n; i++) {
        const spread = (i - (n - 1) / 2) * (.5 + rnd() * .25);
        branch(ex, ey, len * (.62 + rnd() * .14), ang + spread + (rnd() - .5) * .25, depth - 1, wdt * .62);
      }
    };
    branch(x, y, h * .36, -Math.PI / 2 + (rnd() - .5) * .1, 4, Math.max(1.2, h * .07));
    return `<g stroke="#6d5d50" stroke-linecap="round" fill="none">${lines}</g><g fill="#fbfaf6">${tips}</g>`;
  };

  const zones = [
    { x0: 226, x1: 394, y0: 238, y1: 292, n: 15 },
    { x0: 14, x1: 92, y0: 70, y1: 176, n: 7 },
    { x0: 60, x1: 96, y0: 120, y1: 178, n: 2 },
    { x0: 264, x1: 290, y0: 120, y1: 176, n: 3 },
    { x0: 8, x1: 34, y0: 238, y1: 262, n: 1 },
  ];
  const list = [];
  zones.forEach((z) => {
    for (let k = 0, tries = 0; k < z.n && tries < 500; tries++) {
      const x = z.x0 + rnd() * (z.x1 - z.x0), y = z.y0 + rnd() * (z.y1 - z.y0);
      if (x < 54 && y < 60) continue;
      if (list.some((t) => Math.abs(t.x - x) < 11 && Math.abs(t.y - y) < 9)) continue;
      const h = (16 + rnd() * 12) * (.75 + (y / 320) * .5);
      list.push({ x, y, h, kind: rnd() < .68 ? 'fir' : 'bare' });
      k++;
    }
  });
  list.sort((a, b) => a.y - b.y);
  $('#trees').innerHTML = list.map((t) => {
    const shadow = `<ellipse cx="${f1(t.x + 1.5)}" cy="${f1(t.y)}" rx="${f1(t.h * .3)}" ry="${f1(t.h * .07)}" fill="#2a3a30" fill-opacity=".14"/>`;
    return `${shadow}<g class="tree" style="--d:${(-rnd() * 5).toFixed(2)}s">${t.kind === 'fir' ? fir(t.x, t.y, t.h) : bare(t.x, t.y, t.h)}</g>`;
  }).join('');

  /* зубцы кремлёвской стены */
  let cr = '';
  for (let x = 311; x < 371; x += 6) {
    if (x > 313 && x < 328) continue;
    if (x > 329 && x < 352) continue;
    cr += `<rect x="${x}" y="114.6" width="3.4" height="3.6"/>`;
  }
  $('#crenels').innerHTML = cr;

  /* падающий снег */
  let flakes = '';
  for (let i = 0; i < 30; i++) {
    const r = (.8 + rnd() * 1.1).toFixed(2);
    flakes += `<circle class="flake" r="${r}" cx="0" cy="0" fill="#ffffff" stroke="#9fb3c6" stroke-opacity=".5" stroke-width=".35" style="--x:${(rnd() * 400).toFixed(0)}px;--dx:${((rnd() - .5) * 40).toFixed(0)}px;--t:${(7 + rnd() * 7).toFixed(1)}s;--d:${(-rnd() * 14).toFixed(1)}s"/>`;
  }
  $('#snow').innerHTML = flakes;

  /* SMIL-анимация гостей и CSS-петли работают только пока карта на экране */
  if (svg.pauseAnimations) svg.pauseAnimations();
  new IntersectionObserver(([e]) => {
    const live = e.isIntersecting && !reduceMotion;
    map.classList.toggle('is-live', live);
    if (svg.pauseAnimations) live ? svg.unpauseAnimations() : svg.pauseAnimations();
  }, { rootMargin: '80px 0px' }).observe(map);
})();

/* =========================================================================
   ТАНЦУЮЩИЕ ПАРЫ ПОД ДРЕСС-КОДОМ: вальс в цветах палитры
   ========================================================================= */
(function dancers() {
  const scene = $('#dance');
  if (!scene) return;
  const svg = $('#dance-svg');
  const shade = (hex, k) => {
    const c = hexToRgb(hex);
    return rgb(k >= 0 ? mix(c, [255, 252, 246], k) : mix(c, [10, 8, 10], -k));
  };

  /* гирлянда провисает между шторами, огоньки мерцают */
  const gx0 = 52, gx1 = 348, gy = 12, sag = 30;
  const gp = (t) => {
    const x = gx0 + (gx1 - gx0) * t;
    const y = gy + 4 * sag * t * (1 - t);
    return [x, y];
  };
  const grnd = seeded(77);
  const greens = ['#0c271d', '#123426', '#18402f', '#1f4c39', '#2a5d47', '#3a7258'];
  const strokes = greens.map(() => '');
  for (let i = 0; i < 380; i++) {
    const t = grnd();
    const [x, y] = gp(t);
    const ang = Math.PI / 2 + (grnd() - .5) * 3.2;
    const len = 3.5 + grnd() * 4.5;
    const ci = Math.min(greens.length - 1, Math.floor(grnd() * greens.length));
    strokes[ci] += `M${(x + (grnd() - .5) * 3).toFixed(1)} ${(y + (grnd() - .5) * 4).toFixed(1)}l${(Math.cos(ang) * len).toFixed(1)} ${(Math.sin(ang) * len).toFixed(1)}`;
  }
  let gar = `<path d="M${gx0} ${gy} Q200 ${gy + sag * 2} ${gx1} ${gy}" stroke="#173a2c" stroke-width="3" fill="none"/>`
    + strokes.map((d, i) => `<path d="${d}" stroke="${greens[i]}" stroke-width="${1.1 - i * .06}" stroke-linecap="round" fill="none"/>`).join('');
  for (let i = 1; i < 14; i++) {
    const [x, y] = gp(i / 14);
    const d = (-(i * .37) % 3).toFixed(2);
    gar += i % 3 === 0
      ? `<circle cx="${x.toFixed(1)}" cy="${(y + 4).toFixed(1)}" r="3.2" fill="url(#bauble)"/>`
      : `<g class="g-light" style="--d:${d}s;--td:${(2.2 + (i % 4) * .5).toFixed(1)}s"><circle cx="${x.toFixed(1)}" cy="${(y + 2).toFixed(1)}" r="4" fill="url(#lightG)"/><circle cx="${x.toFixed(1)}" cy="${(y + 2).toFixed(1)}" r="1" fill="#fff4d6"/></g>`;
  }
  $('#danceGarland').innerHTML = gar;

  /* канделябры с бордовыми свечами */
  const candel = (c) => {
    const flame = (x, top, delay) => `<g style="--d:${delay}s;--fd:2.3s;--gd:3s">
      <circle class="candle__glow" cx="${x}" cy="${top - 6}" r="9" fill="url(#fGlow)"/>
      <g class="candle__flame"><path d="M${x} ${top - 1.5} C${x - 2.4} ${top - 3.4} ${x - 2.1} ${top - 7.6} ${x} ${top - 12} C${x + 2.1} ${top - 7.6} ${x + 2.4} ${top - 3.4} ${x} ${top - 1.5} Z" fill="url(#flameG)"/>
      <ellipse cx="${x}" cy="${top - 4.6}" rx=".8" ry="2" fill="#fffbea"/></g></g>`;
    const candle = (x, top, bottom) => `<rect x="${x - 2.6}" y="${top}" width="5.2" height="${bottom - top}" rx="1" fill="url(#candleWax)"/><path d="M${x} ${top} v-2" stroke="#2a221c" stroke-width=".7"/>`;
    return `<ellipse cx="${c}" cy="229" rx="11" ry="2.6" fill="#2a221c" fill-opacity=".5"/>
      <path d="M${c - 6} 228 Q${c} 220 ${c + 6} 228 Z" fill="url(#bronze)"/>
      <rect x="${c - 1.3}" y="160" width="2.6" height="64" fill="url(#bronze)"/>
      <ellipse cx="${c}" cy="190" rx="3" ry="2" fill="url(#bronze)"/>
      <path d="M${c - 17} 156 Q${c - 16} 170 ${c} 168 Q${c + 16} 170 ${c + 17} 156" stroke="url(#bronze)" stroke-width="2.2" fill="none"/>
      <rect x="${c - 20}" y="154" width="6" height="2.6" rx="1" fill="url(#bronze)"/><rect x="${c + 14}" y="154" width="6" height="2.6" rx="1" fill="url(#bronze)"/><rect x="${c - 3}" y="158" width="6" height="2.6" rx="1" fill="url(#bronze)"/>
      ${candle(c - 17, 138, 154)}${candle(c, 128, 158)}${candle(c + 17, 140, 154)}
      ${flame(c - 17, 136, -.3)}${flame(c, 126, -1.1)}${flame(c + 17, 138, -.7)}`;
  };
  $('#candelabras').innerHTML = candel(72) + candel(328);

  /* Пары: торсы развёрнуты к зрителю, головы в профиль друг к другу.
     Каждая рука растёт из своего плеча: плечо, локоть, запястье, кисть.
     Плечи кавалера: L(-27,-114.5) R(-6,-114.5); дамы: L(9.6,-112.6) R(22.4,-112.6). */
  const SH = { mL: [-27, -114.5], mR: [-6, -114.5], wL: [9.6, -112.6], wR: [22.4, -112.6] };

  const limb = ({ from, elbow, wrist, upper, fore, col, cuff, hand, handCol, hidden }) => {
    const [sx, sy] = from, [ex, ey] = elbow, [wx, wy] = wrist;
    const ang = Math.atan2(wy - ey, wx - ex);
    const deg = (ang * 180 / Math.PI).toFixed(1);
    const hx = wx + Math.cos(ang) * 2.4, hy = wy + Math.sin(ang) * 2.4;
    let out = `<path d="M${sx} ${sy} L${ex} ${ey}" stroke="${col}" stroke-width="${upper}" stroke-linecap="round" fill="none"/>`
      + `<path d="M${ex} ${ey} L${wx} ${wy}" stroke="${col}" stroke-width="${fore}" stroke-linecap="round" fill="none"/>`;
    if (hidden) return out;
    if (cuff) {
      const cx = wx - Math.cos(ang) * .9, cy = wy - Math.sin(ang) * .9;
      out += `<path d="M${cx.toFixed(1)} ${cy.toFixed(1)} L${wx} ${wy}" stroke="${cuff}" stroke-width="${(fore - .4).toFixed(1)}" stroke-linecap="round"/>`;
    }
    if (hand !== false) {
      out += `<ellipse cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" rx="2.6" ry="1.6" fill="${handCol}" transform="rotate(${deg} ${hx.toFixed(1)} ${hy.toFixed(1)})"/>`
        + `<ellipse cx="${(hx + Math.cos(ang - 1.2) * 1.4).toFixed(1)}" cy="${(hy + Math.sin(ang - 1.2) * 1.4).toFixed(1)}" rx="1.2" ry=".7" fill="${handCol}" transform="rotate(${(+deg - 50).toFixed(1)} ${(hx + Math.cos(ang - 1.2) * 1.4).toFixed(1)} ${(hy + Math.sin(ang - 1.2) * 1.4).toFixed(1)})"/>`;
    }
    return out;
  };

  /* удлиняет руку на k: свободная рука тянется дальше, у держащей
     ладонь остаётся на месте, а локоть сгибается сильнее */
  const longer = (o, k = 1.15) => {
    const [sx, sy] = o.from, [ex, ey] = o.elbow, [wx, wy] = o.wrist;
    const L1 = Math.hypot(ex - sx, ey - sy) * k, L2 = Math.hypot(wx - ex, wy - ey) * k;
    if (!o.fixed) {
      const e2 = [sx + (ex - sx) * k, sy + (ey - sy) * k];
      return { ...o, elbow: e2.map((v) => +v.toFixed(1)), wrist: [e2[0] + (wx - ex) * k, e2[1] + (wy - ey) * k].map((v) => +v.toFixed(1)) };
    }
    const d = Math.hypot(wx - sx, wy - sy);
    if (d >= L1 + L2) return o;
    const a = (L1 * L1 - L2 * L2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, L1 * L1 - a * a));
    const mx = sx + a * (wx - sx) / d, my = sy + a * (wy - sy) / d;
    const c1 = [mx + h * (wy - sy) / d, my - h * (wx - sx) / d], c2 = [mx - h * (wy - sy) / d, my + h * (wx - sx) / d];
    const pick = Math.hypot(c1[0] - ex, c1[1] - ey) < Math.hypot(c2[0] - ex, c2[1] - ey) ? c1 : c2;
    return { ...o, elbow: pick.map((v) => +v.toFixed(1)) };
  };

  const couple = (p, idx) => {
    const { x, y, s, dress, suit, hairM, hairW, skin, delay, pose } = p;
    const spin = pose === 'arch';
    const id = `cp${idx}`;
    const dHi = shade(dress, .42), dLo = shade(dress, -.34), dDeep = shade(dress, -.5);
    const sHi = shade(suit, suit === '#1A1A1A' ? .14 : .22), sLo = shade(suit, -.28);
    const lapel = suit === '#1A1A1A' ? '#343434' : shade(suit, .3);
    const kHi = shade(skin, .25), kLo = shade(skin, -.18);
    const shirt = '#f6f3ec';
    const shoe = '#cfae7c', shoeHi = '#f6e3bf';
    const sleeve = `url(#${id}s)`;
    const mArm = (o) => limb({ upper: 6.2, fore: 5.2, col: sleeve, cuff: shirt, handCol: skin, ...o });
    const wArm = (o) => limb({ upper: 3.4, fore: 2.8, col: skin, handCol: skin, ...longer(o) });
    const wx = pose === 'embrace' ? -3 : 0;          // в объятии дама ближе к кавалеру
    const W = ([a, b]) => [a + wx, b];

    /* три разных хвата */
    const arms = {
      arch: {
        back: '',
        manFront: mArm({ from: SH.mL, elbow: [-35, -100], wrist: [-27.6, -87.6], hand: false })
          + `<ellipse cx="-26.8" cy="-86.6" rx="2.6" ry="1.8" fill="${skin}"/>`,
        front: mArm({ from: SH.mR, elbow: [-1.4, -130], wrist: [-1.8, -144.6], hand: false })
          + wArm({ from: SH.wL, elbow: [8.4, -130], wrist: [2.2, -146.4], hand: false, fixed: true })
          + wArm({ from: SH.wR, elbow: [28, -100.6], wrist: [31.6, -89.6] })
          + `<ellipse cx="-1.6" cy="-148.6" rx="2.4" ry="3" fill="${kLo}"/><ellipse cx=".9" cy="-149.4" rx="2.6" ry="1.5" fill="${skin}" transform="rotate(-24 .9 -149.4)"/>`,
      },
      promenade: {
        back: mArm({ from: SH.mL, elbow: [-31.6, -98.6], wrist: [-23, -92], hidden: true }),
        manFront: '',
        front: mArm({ from: SH.mR, elbow: [-3.4, -100], wrist: [1.6, -89.6], hand: false })
          + wArm({ from: SH.wL, elbow: [7.4, -100.4], wrist: [5, -89.4], hand: false, fixed: true })
          + `<ellipse cx="3.6" cy="-87.4" rx="2.8" ry="2.2" fill="${kLo}"/><ellipse cx="4.8" cy="-88.4" rx="2.4" ry="1.4" fill="${skin}" transform="rotate(30 4.8 -88.4)"/>`
          + wArm({ from: SH.wR, elbow: [30.4, -122.6], wrist: [37, -131.4] }),
      },
      embrace: {
        back: mArm({ from: SH.mR, elbow: [.4, -101.6], wrist: [9, -95], hidden: true }),
        manFront: mArm({ from: SH.mL, elbow: [-31, -98], wrist: [-29.4, -84.4] }),
        front: wArm({ from: W(SH.wL), elbow: [4.4 + wx, -101.4], wrist: [-2.6, -111.4], fixed: true })
          + wArm({ from: W(SH.wR), elbow: [26.6 + wx, -99], wrist: [28.6 + wx, -86.4] }),
      },
    }[pose];

    const defs = `<defs>
      <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2=".25"><stop offset="0" stop-color="${sHi}"/><stop offset=".5" stop-color="${suit}"/><stop offset="1" stop-color="${sLo}"/></linearGradient>
      <linearGradient id="${id}d" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${dHi}"/><stop offset=".42" stop-color="${dress}"/><stop offset="1" stop-color="${dLo}"/></linearGradient>
      <linearGradient id="${id}k" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${kHi}"/><stop offset="1" stop-color="${kLo}"/></linearGradient>
    </defs>`;

    const skirtD = spin
      ? 'M10.6 -88 C2 -66 -10 -40 -24 -12 C-12 -4 6 0 24 0 C40 0 54 -6 64 -16 C50 -36 36 -62 21.6 -88 Z'
      : 'M10.6 -88 C4 -64 -2 -36 -10 -5 C-3 -.5 10 1.6 24 1.2 C35 .8 45 -1.6 53 -8 C45 -30 34 -60 21.6 -88 Z';
    const folds = spin
      ? { hi: 'M13 -86 C8 -60 0 -32 -10 -7 M18 -86 C24 -60 36 -34 50 -9', lo: 'M15.6 -86 C15 -58 14 -30 12 0 M20.6 -86 C30 -62 44 -38 59 -14', hem: 'M-24 -12 C-12 -4 6 0 24 0 C40 0 54 -6 64 -16' }
      : { hi: 'M13 -86 C10 -60 7 -32 4 0 M18 -86 C22 -60 30 -32 40 -3', lo: 'M15.6 -86 C16 -58 17 -30 18 1 M20.6 -86 C27 -62 38 -34 49 -7', hem: 'M-10 -5 C-3 -.5 10 1.6 24 1.2 C35 .8 45 -1.6 53 -8' };
    /* атласная лодочка под юбкой: из-под подола выглядывает только носок */
    const pump = (tx) => `<g>
        <path d="M${tx} -.5 C${tx} -1.9 ${tx + 1.8} -3.2 ${tx + 4.8} -3.5 L${tx + 13} -3.9 L${tx + 13} 0 L${tx + 1.1} 0 C${tx + .3} 0 ${tx} -.2 ${tx} -.5 Z" fill="${shoe}"/>
        <path d="M${tx + .8} -1.3 C${tx + 2} -2.5 ${tx + 3.6} -2.9 ${tx + 6} -3.1" stroke="${shoeHi}" stroke-width=".55" fill="none" stroke-linecap="round"/>
        <path d="M${tx + .6} 0 H${tx + 12}" stroke="#8f7350" stroke-width=".5"/></g>`;
    const toe = spin ? pump(-14) : pump(-6.4);

    const man = `
      <path d="M-27 -70 C-27.4 -52 -27 -38 -27.8 -24 L-29.2 -4.4 L-23.4 -4.4 L-22 -24 C-21 -38 -20.2 -52 -17.6 -70 Z" fill="${sLo}"/>
      <path d="M-15 -70 C-11.6 -56 -8.4 -44 -7 -34 C-5.4 -22 -4 -12 -3.4 -4.4 L2.6 -4.4 C2 -14 .8 -26 -.8 -36 C-2 -48 -3.4 -60 -4.4 -70 Z" fill="${sleeve}"/>
      <path d="M-24.4 -66 C-24.8 -46 -24.6 -30 -25.8 -8 M-8.6 -66 C-6 -50 -3.4 -32 -.6 -8" stroke="${sHi}" stroke-opacity=".5" stroke-width=".7" fill="none"/>
      <path d="M-30.4 -4.8 C-30.8 -2 -30.4 0 -29 0 L-19.2 0 C-17.6 0 -17.2 -1.4 -18.4 -2.3 C-20.4 -3.7 -23 -4.6 -24.6 -5 Z" fill="#111"/>
      <path d="M-3.8 -5 C-4 -2.2 -3.6 0 -2.2 0 L8 0 C9.8 0 10.2 -1.5 8.8 -2.4 C6.6 -3.9 3 -4.8 1.4 -5.1 Z" fill="#111"/>
      <path d="M-28.4 -3.8 C-25.6 -3.6 -22.4 -2.8 -20 -1.4 M-1.8 -4 C1.4 -3.8 4.6 -3 7.2 -1.6" stroke="#fff" stroke-opacity=".45" stroke-width=".6" fill="none" stroke-linecap="round"/>
      <path d="M-28.2 -115.6 C-24 -118.6 -10.2 -118.8 -5 -116 C-2.8 -108 -2.4 -96 -3.4 -84 L-4.2 -69.4 C-10 -67.6 -20.4 -67.6 -26.8 -69.4 L-28.2 -84 C-30.4 -96 -30.6 -108 -28.2 -115.6 Z" fill="${sleeve}"/>
      <path d="M-19.6 -117.2 L-16 -96 L-12.6 -117.2 Z" fill="${shirt}"/>
      <path d="M-19.6 -117.2 L-23 -109.6 L-16.6 -95.6 Z M-12.6 -117.2 L-9.4 -109.6 L-15.4 -95.6 Z" fill="${lapel}"/>
      <path d="M-22.8 -109.8 L-16.8 -96" stroke="#fff" stroke-opacity=".18" stroke-width=".6"/>
      <path d="M-19.4 -116.6 L-16 -114.6 L-12.8 -116.6 L-12.8 -112.8 L-16 -114.8 L-19.4 -112.8 Z" fill="#141414"/>
      <circle cx="-16" cy="-106" r=".55" fill="#d9d4ca"/><circle cx="-16" cy="-101.4" r=".55" fill="#d9d4ca"/>
      <circle cx="-15.8" cy="-89.6" r="1" fill="${sLo}"/>
      <path d="M-26.4 -104.6 L-23 -104.6 L-24.4 -102.4 Z" fill="${shirt}"/>
      <path d="M-26.8 -69.4 C-20.4 -67.6 -10 -67.6 -4.2 -69.4" stroke="${sLo}" stroke-width=".9" fill="none"/>
      <path d="M-27.4 -112 C-29 -100 -28.6 -86 -27 -72" stroke="${sHi}" stroke-opacity=".55" stroke-width=".8" fill="none"/>
      <!-- голова кавалера: профиль, бровь, глаз, ухо, линия скулы -->
      <path d="M-17.6 -123 L-12.6 -123 L-12 -117 L-18.4 -117 Z" fill="${kLo}"/>
      <path d="M-21 -136 C-21 -141 -15 -143 -11 -141 C-8.6 -139.8 -7.6 -137 -7.8 -134.4 L-6.4 -131.8 C-6.2 -131.2 -6.6 -130.8 -7.2 -130.6 L-7.4 -128.4 C-7.6 -126.2 -9.4 -124.4 -12 -124.2 L-12.6 -122.6 L-17.6 -122.6 L-18.6 -125 C-21 -126.6 -22.6 -129.6 -22.4 -132.6 C-22.3 -134 -21.8 -135.2 -21 -136 Z" fill="url(#${id}k)"/>
      <path d="M-16.4 -132.4 C-17.6 -132.4 -18 -130.6 -17.6 -129.4 C-17.2 -128.4 -16.2 -128.4 -15.8 -129.2" stroke="${kLo}" stroke-width=".7" fill="none"/>
      <path d="M-12.4 -135.2 q1.8 -1.1 3.6 -.3" stroke="${hairM}" stroke-width=".8" fill="none" stroke-linecap="round"/>
      <path d="M-11.6 -132.8 q1.1 -.8 2.2 -.1 q-1.1 .5 -2.2 .1 Z" fill="#2b201a"/>
      <path d="M-7.3 -128 q-.8 .35 -1.6 .1" stroke="#8c4f45" stroke-opacity=".7" stroke-width=".5" fill="none" stroke-linecap="round"/>
      <path d="M-15.6 -126 C-14 -124.8 -12.6 -124.4 -11.6 -124.4" stroke="${kLo}" stroke-width=".8" fill="none"/>
      <path d="M-22.6 -131 C-23.6 -138 -19 -143.4 -12.6 -142.6 C-9.4 -142.2 -7.6 -140 -7.8 -137.6 C-10.4 -138.6 -13 -138.2 -15 -137 C-16.6 -136 -17.6 -134.2 -18 -132.2 C-19.4 -131.4 -21.4 -130.6 -22.6 -131 Z" fill="${hairM}"/>
      <path d="M-19.8 -139.6 C-17 -141.4 -13.4 -141.6 -10.6 -140.6 M-21.4 -136 C-20.6 -138.4 -19 -139.6 -17 -140.2" stroke="#fff" stroke-opacity=".22" stroke-width=".6" fill="none" stroke-linecap="round"/>`;

    const woman = `<g transform="translate(${wx} 0)">
      <g class="skirt${spin ? ' skirt--spin' : ''}" style="--cd:${delay}s">
        ${toe}
        <path d="${skirtD}" fill="url(#${id}d)"/>
        <path d="${folds.hi}" stroke="${dHi}" stroke-opacity=".7" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <path d="${folds.lo}" stroke="${dLo}" stroke-opacity=".55" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <path d="${folds.hem}" stroke="${dHi}" stroke-opacity=".55" stroke-width="1.1" fill="none"/>
      </g>
      <path d="M9.4 -111 C11.6 -112.8 14.4 -112.6 16 -110.4 C17.6 -112.6 20.6 -112.8 22.6 -111 C23.6 -104 23 -95 21.6 -87.6 L10.6 -87.6 C9 -95 8.4 -104 9.4 -111 Z" fill="url(#${id}d)"/>
      <path d="M11 -108 C10.6 -102 11 -95 12.2 -89.4" stroke="${dHi}" stroke-opacity=".65" stroke-width="1.3" fill="none" stroke-linecap="round"/>
      <path d="M10.4 -90 C14 -88.8 18.4 -88.8 21.8 -90 L21.6 -86.8 C18.2 -85.6 14 -85.6 10.6 -86.8 Z" fill="${dLo}"/>
      <path d="M8.6 -114.4 C10.8 -116.8 20.6 -116.8 23.2 -114.4 L22.6 -110.8 C20.6 -112.6 17.6 -112.4 16 -110.4 C14.4 -112.4 11.6 -112.6 9.4 -110.8 Z" fill="url(#${id}k)"/>
      <path d="M12.4 -114.6 C14 -113.8 15.2 -113.8 16 -114.6 M16 -114.6 C16.8 -113.8 18 -113.8 19.6 -114.6" stroke="${kLo}" stroke-opacity=".6" stroke-width=".45" fill="none"/>
      <path d="M13.6 -121.4 L18.2 -121.4 L19 -114.8 L12.8 -114.8 Z" fill="${kLo}"/>
      <!-- голова дамы: профиль, бровь, глаз с ресницами, губы, румянец, причёска -->
      <g transform="rotate(${pose === 'embrace' ? -4 : 7} 15.8 -120)">
        <path d="M21 -132.4 C21.4 -137 16.6 -139.4 12.6 -138 C10.2 -137.2 9.2 -134.8 9.4 -132.4 L8.4 -129.6 C8.2 -129 8.6 -128.6 9.2 -128.4 L9.4 -126.6 C9.6 -124.4 11 -122.6 13.2 -122 L13.6 -119.8 L18.2 -119.8 L18.8 -123 C21 -124.6 22.4 -127.4 22.2 -130.2 C22.1 -131 21.7 -131.8 21 -132.4 Z" fill="url(#${id}k)"/>
        <ellipse cx="13" cy="-127.8" rx="1.6" ry=".9" fill="#e7837f" fill-opacity=".28"/>
        <path d="M10.2 -133.4 q1.6 -1 3.3 -.3" stroke="${hairW}" stroke-width=".6" fill="none" stroke-linecap="round"/>
        <path d="M10.3 -130.8 q1.2 .8 2.5 0" stroke="#2b201a" stroke-width=".6" fill="none" stroke-linecap="round"/>
        <path d="M10.6 -130.5 l-.5 .8 M11.5 -130.2 l-.3 .9 M12.4 -130.4 l-.1 .9" stroke="#2b201a" stroke-width=".35" stroke-linecap="round"/>
        <path d="M9.1 -126.3 q.8 -.5 1.5 0 q-.7 .8 -1.5 0 Z" fill="#a2394a"/>
        <path d="M9.6 -128.6 C10.2 -128.2 10.8 -128.2 11.2 -128.6" stroke="${kLo}" stroke-width=".4" fill="none"/>
        <path d="M9.4 -134.2 C9.6 -138.8 14 -140.8 18 -140 C21.6 -139.2 23.4 -136.2 22.6 -132.4 C21 -134.4 18.4 -135.6 15.6 -135.8 C13.2 -135.8 11 -135.2 9.4 -134.2 Z" fill="${hairW}"/>
        <path d="M20.6 -136.6 C23.6 -134 23.6 -128.6 21.6 -124.4 L19.6 -126 C20.6 -129 20.8 -132.6 19.6 -134.6 Z" fill="${hairW}"/>
        <circle cx="24.4" cy="-134.4" r="4.6" fill="${hairW}"/>
        <path d="M21.6 -137 C23.4 -138.6 26 -138.4 27.4 -136.6 M12 -138.6 C14.6 -139.8 17.6 -139.6 19.8 -138.4" stroke="#fff" stroke-opacity=".28" stroke-width=".6" fill="none" stroke-linecap="round"/>
      </g>
    </g>`;

    const body = `${arms.back}${man}${arms.manFront}${woman}${arms.front}`;

    return `<g transform="translate(${x} ${y}) scale(${s})">
      ${defs}
      <ellipse class="couple__shadow" style="--cd:${delay}s" cx="10" cy="0" rx="40" ry="4.2" fill="#2a2420" fill-opacity=".2"/>
      <g class="couple__glide" style="--cd:${delay}s">
        <g mask="url(#reflMask)" opacity=".16"><g transform="scale(1 -1)"><g class="couple__bob" style="--cd:${delay}s">${body}</g></g></g>
        <g class="couple__bob" style="--cd:${delay}s">${body}</g>
      </g>
    </g>`;
  };

  const pairs = [
    { x: 114, y: 224, s: .84, dress: '#8B1E3F', suit: '#4B4B4B', hairM: '#2a1d16', hairW: '#c9a26a', skin: '#efcfb6', delay: -.6, pose: 'arch' },
    { x: 282, y: 224, s: .84, dress: '#6B7F98', suit: '#5A0E1A', hairM: '#5a3a24', hairW: '#2c1d15', skin: '#e3bf9f', delay: -1.4, pose: 'embrace' },
    { x: 190, y: 242, s: 1, dress: '#AFC7E3', suit: '#1A1A1A', hairM: '#1f1712', hairW: '#4a3020', skin: '#f0d2b9', delay: 0, pose: 'promenade' },
  ];
  $('#dancers').innerHTML = pairs.map(couple).join('');

  /* танец идёт, только пока сцена на экране */
  new IntersectionObserver(([e]) => scene.classList.toggle('is-live', e.isIntersecting && !reduceMotion), { rootMargin: '60px 0px' }).observe(scene);
  if (svg) svg.setAttribute('data-ready', '1');
})();

/* =========================================================================
   КАЛЕНДАРЬ: ДЕКАБРЬ 2026
   ========================================================================= */
(function buildCalendar() {
  const grid = $('#calendar');
  const dows = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  dows.forEach((d) => {
    const c = document.createElement('span');
    c.className = 'cal__dow';
    c.textContent = d;
    grid.append(c);
  });
  const first = new Date(2026, 11, 1).getDay(); // 0 = вс
  const offset = (first + 6) % 7;
  for (let i = 0; i < offset; i++) grid.append(document.createElement('span'));
  for (let d = 1; d <= 31; d++) {
    const c = document.createElement('span');
    const col = (offset + d - 1) % 7;
    c.className = 'cal__d' + (col >= 5 ? ' is-weekend' : '');
    c.textContent = d;
    if (d === 12) {
      c.classList.add('is-day');
      c.insertAdjacentHTML('beforeend',
        '<svg class="cal__ring" viewBox="0 0 60 48" aria-hidden="true"><path pathLength="1" d="M10 24 C8 10 24 4 34 5 C48 6 56 15 54 27 C52 39 38 45 26 43 C14 41 5 33 9 21 C11 15 17 10 23 8"/></svg>');
    }
    grid.append(c);
  }
})();

/* =========================================================================
   ПРОГРАММА: ПОЛОСКА С ОГОНЬКОМ БЕЖИТ ВНИЗ, ВРЕМЯ ВЫПАДАЕТ ПО ОЧЕРЕДИ
   ========================================================================= */
(function timeline() {
  const tl = $('#timeline');
  const run = 3.2;
  tl.style.setProperty('--run', `${run}s`);
  const place = () => {
    const items = $$('.tl__item', tl);
    const mid = (el) => el.offsetTop + el.offsetHeight / 2;
    const top = mid(items[0]);
    const span = Math.max(1, mid(items[items.length - 1]) - top);
    tl.style.setProperty('--t-top', `${top}px`);
    tl.style.setProperty('--t-h', `${span}px`);
    items.forEach((item) => {
      item.style.setProperty('--at', `${((mid(item) - top) / span * run).toFixed(2)}s`);
    });
  };
  window.addEventListener('resize', place);
  if (document.fonts) document.fonts.ready.then(place);
  place();
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    place();
    tl.classList.add('is-run');
    io.disconnect();
  }, { threshold: 0.35 });
  io.observe(tl);
})();

/* =========================================================================
   ДРЕСС-КОД: ОТРЕЗЫ ШЁЛКА
   ========================================================================= */
function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(a, b, t) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t));
}
function rgb(c) { return `rgb(${c[0]},${c[1]},${c[2]})`; }
function luminance([r, g, b]) { return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; }

/* Полосы света и тени поперёк ткани: так складки шёлка ловят свет. */
const FOLDS = [
  [0, -.55], [.06, .05], [.11, .6], [.15, .1], [.24, -.65], [.32, -.15], [.4, .35],
  [.445, .85], [.49, .2], [.58, -.5], [.66, -.15], [.74, .45], [.785, .1],
  [.87, -.6], [.94, -.1], [1, .35],
];

function silkSVG(hex, id) {
  const base = hexToRgb(hex);
  const lum = luminance(base);
  const light = [255, 253, 250];
  const dark = mix(base, [8, 8, 12], 1);
  const hiK = lum < 0.15 ? 0.32 : lum > 0.7 ? 0.55 : 0.5;
  const loK = lum > 0.7 ? 0.32 : lum < 0.15 ? 0.6 : 0.5;
  const shift = (id.length * 7 + id.charCodeAt(id.length - 1)) % 5 * 0.03;
  const stops = FOLDS.map(([o, k]) => {
    const c = k >= 0 ? mix(base, light, k * hiK) : mix(base, dark, -k * loK);
    return `<stop offset="${Math.min(1, o + shift * (1 - o)).toFixed(3)}" stop-color="${rgb(c)}"/>`;
  }).join('');
  const seed = id.charCodeAt(id.length - 1) % 9 + 2;

  return `<svg viewBox="0 0 200 270" aria-hidden="true">
    <defs>
      <linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="0.08">${stops}</linearGradient>
      <linearGradient id="d-${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".16"/>
        <stop offset=".35" stop-color="#fff" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity=".28"/>
      </linearGradient>
      <linearGradient id="s-${id}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/>
        <stop offset=".5" stop-color="#fff" stop-opacity=".55"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
      <filter id="f-${id}" x="-15%" y="-10%" width="130%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.0045 0.012" numOctaves="2" seed="${seed}"/>
        <feDisplacementMap in="SourceGraphic" scale="52" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <clipPath id="c-${id}">
        <path d="M0 0 H200 V234 C186 250 170 236 152 248 C134 260 118 242 100 252 C82 262 66 244 48 254 C30 264 16 248 0 256 Z"/>
      </clipPath>
    </defs>
    <g clip-path="url(#c-${id})">
      <rect x="-50" y="-24" width="300" height="320" fill="url(#g-${id})" filter="url(#f-${id})"/>
      <rect width="200" height="270" fill="url(#d-${id})"/>
      <g class="silk__sheen" style="mix-blend-mode:soft-light">
        <rect x="-70" y="-10" width="110" height="290" fill="url(#s-${id})" transform="skewX(-12)"/>
      </g>
    </g>
  </svg>`;
}

/* Шёлк переливается только пока блок на экране: экономим батарею телефона */
const dressIO = new IntersectionObserver(([e]) => {
  $('.dress').classList.toggle('is-live', e.isIntersecting);
}, { rootMargin: '120px 0px' });
dressIO.observe($('.dress'));

$$('[data-silk]').forEach((host) => {
  const group = host.dataset.silk;
  const list = CONFIG.palette[group] || [];
  const rows = [list.slice(0, 4), list.slice(4)].filter((r) => r.length);
  rows.forEach((row, r) => {
    const wrap = document.createElement('div');
    wrap.className = 'rail__row';
    wrap.innerHTML = '<div class="rail__bar" aria-hidden="true"></div>';
    const ul = document.createElement('ul');
    ul.className = 'rail__list' + (row.length === 3 ? ' rail__list--3' : '');
    row.forEach((c, i) => {
      const id = `${group}${r}${i}`;
      const li = document.createElement('li');
      li.innerHTML = `<figure class="silk">
          <div class="silk__hang" style="--sd:${(-(r * 4 + i) * 0.9).toFixed(1)}s">${silkSVG(c.hex, id)}</div>
          <figcaption><b>${c.name}</b></figcaption>
        </figure>`;
      ul.append(li);
    });
    wrap.append(ul);
    host.append(wrap);
  });
});

/* =========================================================================
   МУЗЫКА: ТОЛЬКО ПО КНОПКЕ
   ========================================================================= */
(function music() {
  const btn = $('#music');
  const audio = $('#track');
  const toast = $('.music__toast', btn);
  let fade;

  const setState = (playing) => {
    btn.classList.toggle('is-playing', playing);
    btn.setAttribute('aria-pressed', String(playing));
  };
  const rampTo = (target, ms, done) => {
    clearInterval(fade);
    const start = audio.volume;
    const t0 = performance.now();
    fade = setInterval(() => {
      const p = Math.min(1, (performance.now() - t0) / ms);
      audio.volume = start + (target - start) * p;
      if (p === 1) { clearInterval(fade); done && done(); }
    }, 40);
  };

  btn.addEventListener('click', async () => {
    if (audio.paused) {
      try {
        audio.volume = 0;
        await audio.play();
        setState(true);
        rampTo(0.7, 1600);
      } catch (err) {
        toast.textContent = 'Трек не найден';
        toast.classList.add('is-on');
        setTimeout(() => { toast.classList.remove('is-on'); }, 2400);
        console.warn('Положите файл песни в audio/music.mp3', err);
      }
    } else {
      setState(false);
      rampTo(0, 500, () => audio.pause());
    }
  });
})();

/* =========================================================================
   АНКЕТА: ТОЛЬКО ПРИСУТСТВИЕ
   ========================================================================= */
(function rsvp() {
  const form = $('#rsvp-form');
  const done = $('#rsvp-done');
  const submit = $('#rsvp-submit');
  const status = $('#rsvp-status');
  const nameInput = $('#guest-name');
  const nameErr = $('#name-error');
  const choiceErr = $('#choice-error');
  const KEY = 'od-rsvp';

  const showDone = (answer) => {
    $('#rsvp-done-title').textContent = answer.attendance === 'yes' ? 'Спасибо!' : 'Спасибо, что сообщили';
    $('#rsvp-done-text').textContent = answer.attendance === 'yes'
      ? `${answer.name}, ждём вас 12 декабря.`
      : 'Нам будет вас не хватать. Мы обязательно поднимем бокал за вас.';
    form.hidden = true;
    done.hidden = false;
  };

  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && saved.name) showDone(saved);
  } catch (_) { /* хранилище недоступно: просто показываем форму */ }

  $('#rsvp-again').addEventListener('click', () => {
    done.hidden = true;
    form.hidden = false;
    nameInput.focus();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const choice = form.querySelector('input[name="attendance"]:checked');
    nameErr.hidden = !!name;
    nameInput.setAttribute('aria-invalid', String(!name));
    nameInput.setAttribute('aria-describedby', name ? 'name-help' : 'name-help name-error');
    choiceErr.hidden = !!choice;
    if (choice) $('#choice').removeAttribute('aria-describedby');
    else $('#choice').setAttribute('aria-describedby', 'choice-error');
    if (!name) { nameInput.focus(); return; }
    if (!choice) { form.querySelector('input[name="attendance"]').focus(); return; }

    const answer = { name, attendance: choice.value };
    status.textContent = '';
    status.classList.remove('is-error');

    if (!CONFIG.rsvpEndpoint) {
      status.textContent = 'Анкета ещё не подключена к таблице. Ответ не отправлен.';
      status.classList.add('is-error');
      return;
    }

    submit.disabled = true;
    $('.btn__text', submit).textContent = 'Отправляем…';
    try {
      await fetch(CONFIG.rsvpEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...answer, sentAt: new Date().toISOString() }),
      });
      try { localStorage.setItem(KEY, JSON.stringify(answer)); } catch (_) { /* не критично */ }
      showDone(answer);
    } catch (err) {
      status.textContent = 'Не получилось отправить. Проверьте интернет и попробуйте ещё раз.';
      status.classList.add('is-error');
    } finally {
      submit.disabled = false;
      $('.btn__text', submit).textContent = 'Отправить ответ';
    }
  });
})();

/* =========================================================================
   ТАЙМЕР НА ПОСАДОЧНОМ ТАЛОНЕ
   ========================================================================= */
(function countdown() {
  const target = Date.parse(CONFIG.weddingISO);
  const forms = {
    d: ['день', 'дня', 'дней'],
    h: ['час', 'часа', 'часов'],
    m: ['минута', 'минуты', 'минут'],
    s: ['секунда', 'секунды', 'секунд'],
  };
  const plural = (n, [one, few, many]) => {
    const a = n % 100, b = n % 10;
    if (a > 10 && a < 20) return many;
    if (b === 1) return one;
    if (b >= 2 && b <= 4) return few;
    return many;
  };
  const units = {};
  ['d', 'h', 'm', 's'].forEach((u) => {
    units[u] = { v: $(`[data-u="${u}"]`), l: $(`[data-l="${u}"]`) };
  });
  const tick = () => {
    let left = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const vals = {
      d: Math.floor(left / 86400),
      h: Math.floor((left % 86400) / 3600),
      m: Math.floor((left % 3600) / 60),
      s: left % 60,
    };
    Object.entries(vals).forEach(([u, n]) => {
      const txt = u === 'd' ? String(n) : String(n).padStart(2, '0');
      const el = units[u].v;
      if (el.textContent !== txt) {
        el.textContent = txt;
        /* цифра перелистывается, как на табло в аэропорту */
        if (!reduceMotion) { el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip'); }
      }
      units[u].l.textContent = plural(n, forms[u]);
    });
    if (left === 0) {
      $('.pass__stub-head small').textContent = 'Мы уже празднуем';
      return;
    }
    setTimeout(tick, 1000 - (Date.now() % 1000));
  };
  tick();
})();

/* =========================================================================
   ФОН: ТЁПЛЫЕ ОГОНЬКИ СВЕЧЕЙ, МЕДЛЕННО ПЛЫВУТ ВВЕРХ
   ========================================================================= */
(function embers() {
  const canvas = $('.embers');
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const tones = [
    [231, 181, 101, 0.16],
    [231, 181, 101, 0.12],
    [240, 200, 130, 0.14],
    [106, 20, 36, 0.05],
    [30, 74, 58, 0.06],
  ];
  let w = 0, h = 0, parts = [], raf = 0, last = 0;

  const resize = () => {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const spawn = (anywhere) => {
    const tone = tones[Math.floor(Math.random() * tones.length)];
    const r = 14 + Math.random() * 60;
    return {
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + r,
      r,
      vy: 4 + Math.random() * 9,
      sway: 6 + Math.random() * 14,
      ph: Math.random() * Math.PI * 2,
      tone,
      tw: 0.4 + Math.random() * 0.6,
    };
  };
  const draw = (t) => {
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      const x = p.x + Math.sin(t * 0.00025 + p.ph) * p.sway;
      const a = p.tone[3] * (0.75 + 0.25 * Math.sin(t * 0.0011 * p.tw + p.ph));
      const g = ctx.createRadialGradient(x, p.y, 0, x, p.y, p.r);
      g.addColorStop(0, `rgba(${p.tone[0]},${p.tone[1]},${p.tone[2]},${a})`);
      g.addColorStop(1, `rgba(${p.tone[0]},${p.tone[1]},${p.tone[2]},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  const loop = (t) => {
    const dt = Math.min(64, t - (last || t)) / 1000;
    last = t;
    parts.forEach((p, i) => {
      p.y -= p.vy * dt;
      if (p.y < -p.r) parts[i] = spawn(false);
    });
    draw(t);
    raf = requestAnimationFrame(loop);
  };

  resize();
  parts = Array.from({ length: 16 }, () => spawn(true));
  window.addEventListener('resize', resize);

  if (reduceMotion) { draw(0); return; }
  raf = requestAnimationFrame(loop);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else { last = 0; raf = requestAnimationFrame(loop); }
  });
})();
