import { formatManader, skalaFor, sorteradeBrott, berakna, avrundaMangdrabatt, relevansPoang } from './calc.js';

const STORAGE_KEY = 'mangdrabatt-kalkylator:v1';

const state = {
  straffskalor: [],
  takAllmantManader: 216,
  allmantGolvManader: 1,
  brott: [], // { instId, typId, manader }
  golvProcent: 3,
  vikter: [], // procent per rangordning, editerbar
  referensdomar: [], // laddas en gång, sorteras om vid varje omräkning
};

let nextInstId = 1;

async function hamtaJson(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`${url} svarade ${resp.status}`);
  return resp.json();
}

// ---- Lokal lagring (så inmatade brott överlever en sidladdning) ----

function sparaState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ brott: state.brott, golvProcent: state.golvProcent, vikter: state.vikter, nextInstId })
    );
  } catch (e) {
    // localStorage kan vara blockerat (privat läge m.m.) - inte kritiskt, hoppa bara över.
  }
}

function laddaSparadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const sparat = JSON.parse(raw);
    if (Array.isArray(sparat.brott)) state.brott = sparat.brott;
    if (typeof sparat.golvProcent === 'number') state.golvProcent = sparat.golvProcent;
    if (Array.isArray(sparat.vikter)) state.vikter = sparat.vikter;
    if (typeof sparat.nextInstId === 'number') nextInstId = sparat.nextInstId;
  } catch (e) {
    // Korrupt eller otillgänglig sparad data - fortsätt med tomt state.
  }
}

// ---- Init ----

async function init() {
  laddaSparadState();

  const skalorResp = await hamtaJson('data/straffskalor.json');
  state.straffskalor = skalorResp.straffskalor;
  state.takAllmantManader = skalorResp.tak_allmant_manader;
  state.allmantGolvManader = skalorResp.allmant_golv_manader;

  renderStraffskalorFakta();
  fyllBrottstypDropdown();
  bindForm();

  const golvInput = document.getElementById('golv-procent');
  golvInput.value = state.golvProcent;
  golvInput.addEventListener('input', (e) => {
    state.golvProcent = Math.max(0.5, Number(e.target.value) || 0);
    rakenOmOchRendera();
  });

  document.getElementById('rensa-brott').addEventListener('click', rensaAllaBrott);

  laddaReferensdomar();
  laddaForklaringar();

  rakenOmOchRendera();
}

function renderStraffskalorFakta() {
  const dl = document.getElementById('straffskalor-lista');
  dl.innerHTML = '';
  for (const s of state.straffskalor) {
    const dt = document.createElement('dt');
    dt.textContent = `${s.namn} (${s.paragraf})`;
    const dd = document.createElement('dd');
    dd.innerHTML = `
      ${s.skala_text}
      <details class="lagtext-details">
        <summary>Visa lagtext</summary>
        <p>${s.lagtext}</p>
      </details>
    `;
    dl.appendChild(dt);
    dl.appendChild(dd);
  }
}

function fyllBrottstypDropdown() {
  const sel = document.getElementById('brottstyp');
  sel.innerHTML = '';
  for (const s of state.straffskalor) {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = s.namn;
    sel.appendChild(opt);
  }
  sel.addEventListener('change', uppdateraSkalaHint);
  uppdateraSkalaHint();
}

function uppdateraSkalaHint() {
  const typId = document.getElementById('brottstyp').value;
  const skala = skalaFor(state.straffskalor, typId);
  const hint = document.getElementById('skala-hint');
  const input = document.getElementById('straffvarde');
  if (skala) {
    hint.textContent = `Tillåtet intervall: ${skala.min_manader}–${skala.max_manader} månader`;
    input.min = skala.min_manader;
    input.max = skala.max_manader;
    if (!input.value) input.value = skala.min_manader;
  }
}

function bindForm() {
  document.getElementById('brott-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const typId = document.getElementById('brottstyp').value;
    const skala = skalaFor(state.straffskalor, typId);
    const input = document.getElementById('straffvarde');
    let manader = Number(input.value);
    if (Number.isNaN(manader)) return;
    manader = Math.min(skala.max_manader, Math.max(skala.min_manader, manader));
    state.brott.push({ instId: nextInstId++, typId, manader });
    input.value = '';
    rakenOmOchRendera();
  });
}

function taBortBrott(instId) {
  state.brott = state.brott.filter((b) => b.instId !== instId);
  rakenOmOchRendera();
}

function rensaAllaBrott() {
  state.brott = [];
  state.vikter = [];
  rakenOmOchRendera();
}

// ---- Rendering ----

function rakenOmOchRendera() {
  sparaState();
  renderBrottLista();
  renderVikter();
  const res = berakna({
    brott: state.brott,
    vikter: state.vikter,
    golvProcent: state.golvProcent,
    straffskalor: state.straffskalor,
    takAllmantManader: state.takAllmantManader,
    allmantGolvManader: state.allmantGolvManader,
  });
  renderTrappa(res);
  renderResultat(res);
  renderReferensdomar();
}

function renderBrottLista() {
  const ul = document.getElementById('brott-lista');
  ul.innerHTML = '';
  const sorterade = sorteradeBrott(state.brott);
  document.getElementById('rensa-brott').hidden = sorterade.length === 0;
  if (sorterade.length === 0) {
    const li = document.createElement('li');
    li.className = 'brott-tom';
    li.textContent = 'Inga brott tillagda ännu.';
    ul.appendChild(li);
    return;
  }
  sorterade.forEach((b, i) => {
    const skala = skalaFor(state.straffskalor, b.typId);
    const li = document.createElement('li');
    li.innerHTML = `
      <span><span class="brott-rank">${i + 1}</span>
        <span class="brott-namn">${skala.namn}</span>
        <span class="brott-meta"> — ${formatManader(b.manader)} (${skala.paragraf})</span>
      </span>
    `;
    const btn = document.createElement('button');
    btn.className = 'btn-secondary';
    btn.textContent = 'Ta bort';
    btn.addEventListener('click', () => taBortBrott(b.instId));
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

function renderVikter() {
  const container = document.getElementById('vikt-lista');
  container.innerHTML = '';
  const antal = Math.max(state.brott.length, 1);
  const golv = state.golvProcent;
  while (state.vikter.length < antal) {
    const i = state.vikter.length;
    state.vikter.push(Math.max(golv, Math.pow(0.5, i) * 100));
  }
  state.vikter.length = antal;

  for (let i = 0; i < antal; i++) {
    const item = document.createElement('div');
    item.className = 'vikt-item';
    const label = document.createElement('label');
    label.textContent = `Brott #${i + 1}`;
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.max = '100';
    input.step = '0.5';
    input.value = Math.round(state.vikter[i] * 10) / 10;
    input.addEventListener('input', (e) => {
      state.vikter[i] = Math.max(state.golvProcent, Number(e.target.value) || 0);
      rakenOmOchRendera();
    });
    item.appendChild(label);
    item.appendChild(input);
    container.appendChild(item);
  }
}

function renderTrappa(res) {
  const container = document.getElementById('trappa');
  container.innerHTML = '';
  if (res.viktade.length === 0) {
    container.innerHTML = '<span class="trappa-tom">Lägg till brott för att se trappan.</span>';
    return;
  }
  const maxVarde = Math.max(...res.viktade.map((b) => b.manader), 1);
  res.viktade.forEach((b, i) => {
    const skala = skalaFor(state.straffskalor, b.typId);
    const stapel = document.createElement('div');
    stapel.className = 'trappa-stapel';
    const hojdProcentUrsprung = (b.manader / maxVarde) * 100;
    stapel.style.height = `${Math.max(hojdProcentUrsprung, 6)}%`;
    stapel.title = `${skala.namn}: ${formatManader(b.manader)} × ${Math.round(b.vikt * 1000) / 10}% = ${formatManader(b.viktatVarde)}`;
    stapel.innerHTML = `
      <span>${Math.round(b.vikt * 1000) / 10}%</span>
      <span class="stapel-label">#${i + 1} ${formatManader(b.viktatVarde)}</span>
    `;
    container.appendChild(stapel);
  });
}

function renderResultat(res) {
  const container = document.getElementById('resultat');
  if (res.sorterade.length === 0) {
    container.innerHTML = '<p class="tom-lista">Lägg till minst ett brott för att se resultat.</p>';
    return;
  }
  // Mängdrabatten (d) räknas ut från samma avrundade tal som visas för a) och c), så att
  // "a minus c" alltid stämmer med d) för den som kontrollräknar - se avrundaMangdrabatt().
  const { mangdrabattManader, mangdrabattProcent } = avrundaMangdrabatt(res.renKumulation, res.justeratResultat);
  const golvNotis = mangdrabattManader < 0
    ? `<p class="resultat-notis-golv"><strong>Observera:</strong> mängdrabatten är negativ eftersom golvet
        (${formatManader(res.golvManader)}, 26 kap. 1 § BrB) höjer det justerade resultatet över den
        ursprungliga straffvärdessumman. Det inträffar bara vid ovanligt låga, manuellt inställda vikter
        för ett enstaka lågt straffvärde – inte en straffskärpning i sig, bara golvets nedre gräns som
        slår igenom.</p>`
    : '';
  container.innerHTML = `
    <div class="resultat-rad">
      <span class="label">a) Ren kumulation (summa av alla straffvärden)</span>
      <span class="varde">${formatManader(res.renKumulation)}</span>
    </div>
    <div class="resultat-rad">
      <span class="label">b) Halveringsmodell (viktad summa, före tak/golv)</span>
      <span class="varde">${formatManader(res.halveringssumma)}</span>
    </div>
    <div class="resultat-rad warn">
      <span class="label">c) Tak enligt 26 kap. 2 § BrB (dubblerat maxstraff, dock högst summan av
        maxstraffen/18 år) — tak ${formatManader(res.takManader)}, golv ${formatManader(res.golvManader)}
        (svåraste brott: ${res.svarasteTyp ? res.svarasteTyp.namn : '–'})</span>
      <span class="varde">${formatManader(res.justeratResultat)}</span>
    </div>
    <div class="resultat-rad highlight">
      <span class="label">d) Mängdrabatt (ren kumulation → justerat resultat)</span>
      <span class="varde">${formatManader(mangdrabattManader)} (${mangdrabattProcent.toFixed(1)}%)</span>
    </div>
    ${golvNotis}
    <p class="resultat-not">Justerat resultat = halveringsmodellens summa, begränsat till intervallet [golv, tak].
      Mängdrabatten (d) är a) minus c) räknat på de avrundade talen ovan, så att siffrorna går ihop
      vid kontrollräkning. Förenklad modell — den faktiska straffmätningen görs av domstolen utifrån
      samtliga omständigheter i det enskilda fallet.</p>
  `;
}

// ---- Referensdomar & förklaringar ----

async function laddaReferensdomar() {
  const statusEl = document.getElementById('refs-status');
  try {
    const data = await hamtaJson('data/referensdomar.json');
    state.referensdomar = data.referensdomar || [];
    statusEl.textContent = state.referensdomar.length > 0
      ? `${state.referensdomar.length} referensdom(ar) hittade och sparade i cachen (av upp till 10 eftersökta).`
      : 'Inga referensdomar har hittats och verifierats ännu. Sök manuellt via länkarna i den förklarande sektionen tills vidare.';
    renderReferensdomar();
  } catch (e) {
    statusEl.textContent = 'Kunde inte hämta referensdomar från backend.';
  }
}

function renderReferensdomar() {
  const ul = document.getElementById('refs-lista');
  ul.innerHTML = '';
  if (state.referensdomar.length === 0) return;

  const valdaTyper = new Set(state.brott.map((b) => b.typId));
  const rader = state.referensdomar
    .map((r, ursprungsindex) => ({ r, ursprungsindex, poang: relevansPoang(r, valdaTyper) }))
    .sort((a, b) => b.poang - a.poang || a.ursprungsindex - b.ursprungsindex);

  for (const { r, poang } of rader) {
    const li = document.createElement('li');
    if (!r.tillganglig) li.classList.add('otillganglig');
    const verifText = {
      manuell_fulltext: 'Manuellt verifierad (fulltext läst)',
      manuell_pressmeddelande: 'Manuellt verifierad (pressmeddelande)',
    }[r.verifieringsstatus] || 'Maskinellt tolkad';
    const verifClass = r.verifieringsstatus.startsWith('manuell') ? 'verif-manuell' : 'verif-maskin';
    const flerfaldighetTagg = r.flerfaldighetsexempel
      ? '<span class="verif-badge tagg-flerfaldighet">Flerfaldighetsexempel</span>'
      : '<span class="verif-badge tagg-gransdragning">Gränsdragning/enstaka brott</span>';
    li.innerHTML = `
      <div class="ref-id">${r.id}
        <span class="verif-badge ${verifClass}">${verifText}</span>
        ${flerfaldighetTagg}
        ${poang > 0 ? '<span class="verif-badge verif-relevant">Relevant för dina brott</span>' : ''}
        ${!r.tillganglig ? '<span class="otillganglig-tagg"> · källan ej nåbar just nu</span>' : ''}
      </div>
      <div class="ref-meta">${r.domstol || ''} · Källa: ${r.kalla}</div>
      <p class="ref-sammanfattning">${r.brott_sammanfattning}${r.straffvarde_text ? ' — ' + r.straffvarde_text : ''}</p>
      <a class="ref-link" href="${r.kalla_url}" target="_blank" rel="noopener">Läs originalkällan ↗</a>
    `;
    ul.appendChild(li);
  }
}

async function laddaForklaringar() {
  const container = document.getElementById('forklaring-lista');
  try {
    const data = await hamtaJson('data/forklarande-kallor.json');
    const rader = data.forklarande_kallor || [];
    container.innerHTML = '';
    if (rader.length === 0) {
      container.innerHTML = '<p class="tom-lista">Inga förklarande källor cachade ännu.</p>';
      return;
    }
    for (const f of rader) {
      const div = document.createElement('div');
      div.className = 'forklaring-item';
      if (!f.tillganglig) div.classList.add('otillganglig');
      const granskningTagg = f.granskningsdjup === 'snippet'
        ? '<span class="verif-badge verif-maskin">Endast sökmotorutdrag, ej öppnad</span>'
        : '<span class="verif-badge verif-manuell">Fulltext läst</span>';
      div.innerHTML = `
        <h4>${f.titel} ${granskningTagg}${!f.tillganglig ? '<span class="otillganglig-tagg"> · källan ej nåbar just nu</span>' : ''}</h4>
        <p>${f.sammanfattning}</p>
        <a class="ref-link" href="${f.kalla_url}" target="_blank" rel="noopener">${f.kalla} ↗</a>
      `;
      container.appendChild(div);
    }
  } catch (e) {
    container.innerHTML = '<p class="tom-lista">Kunde inte hämta förklarande källor.</p>';
  }
}

init();

// Litet felsökningsfönster för manuell testning i webbläsarkonsolen - type="module" gör att
// dessa symboler annars inte skulle vara nåbara utanför modulen.
window.__debug = { state, rakenOmOchRendera };
