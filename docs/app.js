import { formatManader, skalaFor, sorteradeBrott, berakna, avrundaMangdrabatt, relevansPoang, analyseraTackning, ungdomsfraktion } from './calc.js';

const STORAGE_KEY = 'mangdrabatt-kalkylator:v1';

const state = {
  straffskalor: [],
  takAllmantManader: 216,
  allmantGolvManader: 1,
  brott: [], // { instId, typId, manader }
  golvProcent: 3,
  vikter: [], // procent per rangordning, editerbar (gäller bara modell "halvering")
  modell: 'halvering', // 'halvering' | 'andelsmodell'
  alderVidBrott: null, // år vid gärningstillfället - 29 kap. 7 § BrB, null = ingen ungdomsreduktion
  referensdomar: [], // laddas en gång, sorteras om vid varje omräkning
  forklarandeKallor: [], // doktrin/förarbeten (kategori B), laddas en gång
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
      JSON.stringify({
        brott: state.brott, golvProcent: state.golvProcent, vikter: state.vikter,
        modell: state.modell, alderVidBrott: state.alderVidBrott, nextInstId,
      })
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
    if (sparat.modell === 'halvering' || sparat.modell === 'andelsmodell') state.modell = sparat.modell;
    if (typeof sparat.alderVidBrott === 'number') state.alderVidBrott = sparat.alderVidBrott;
    if (typeof sparat.nextInstId === 'number') nextInstId = sparat.nextInstId;
  } catch (e) {
    // Korrupt eller otillgänglig sparad data - fortsätt med tomt state.
  }
}

// ---- Init ----

async function init() {
  laddaSparadState();

  // Datumet i PM-huvudet som bara syns vid utskrift - se .skriv-ut-rubrik i index.html.
  document.getElementById('skriv-ut-datum').textContent = new Date().toLocaleDateString('sv-SE', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

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

  const modellVal = document.getElementById('modell-val');
  modellVal.value = state.modell;
  modellVal.addEventListener('change', (e) => {
    state.modell = e.target.value;
    rakenOmOchRendera();
  });

  const alderInput = document.getElementById('alder-brott');
  alderInput.value = state.alderVidBrott ?? '';
  alderInput.addEventListener('input', (e) => {
    state.alderVidBrott = e.target.value === '' ? null : Number(e.target.value);
    rakenOmOchRendera();
  });

  document.getElementById('rensa-brott').addEventListener('click', rensaAllaBrott);
  document.getElementById('skriv-ut-btn').addEventListener('click', () => window.print());

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

// ---- Sökbar brottstyp-combobox ----
// Ersätter en vanlig <select> (som blev otymplig med 30+ brottstyper i nio grupper) med
// ett textfält som filtrerar en egen listbox live. #brottstyp (hidden input) håller det
// faktiska valda id:t och är vad uppdateraSkalaHint()/bindForm() läser - samma kontrakt
// som den gamla <select>s .value, så resten av appen behövde inte ändras.
let brottstypAktivIndex = -1;

function fyllBrottstypDropdown() {
  renderBrottstypLista('');
  if (state.straffskalor.length > 0) {
    valjBrottstyp(state.straffskalor[0].id);
  }

  const sokInput = document.getElementById('brottstyp-sok');
  const lista = document.getElementById('brottstyp-lista');

  sokInput.addEventListener('focus', () => {
    sokInput.select();
    renderBrottstypLista('');
    oppnaBrottstypLista();
  });
  sokInput.addEventListener('input', () => {
    renderBrottstypLista(sokInput.value);
    oppnaBrottstypLista();
  });
  sokInput.addEventListener('keydown', hanteraBrottstypTangent);
  sokInput.addEventListener('blur', () => {
    stangBrottstypLista();
    const vald = skalaFor(state.straffskalor, document.getElementById('brottstyp').value);
    sokInput.value = vald ? vald.namn : '';
  });
  // mousedown (inte click) på listan förhindras från att blur:a sökfältet, så att
  // klicket hinner registreras av click-lyssnaren nedan innan fältet stängs/återställs.
  lista.addEventListener('mousedown', (e) => e.preventDefault());
  lista.addEventListener('click', (e) => {
    const li = e.target.closest('[role="option"]');
    if (!li) return;
    valjBrottstyp(li.dataset.id);
    sokInput.blur();
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.brottstyp-combo')) stangBrottstypLista();
  });
}

function renderBrottstypLista(filterText) {
  const lista = document.getElementById('brottstyp-lista');
  const sok = filterText.trim().toLowerCase();
  const traffar = state.straffskalor.filter((s) => s.namn.toLowerCase().includes(sok));

  lista.innerHTML = '';
  brottstypAktivIndex = -1;

  if (traffar.length === 0) {
    lista.innerHTML = '<li class="brottstyp-tom">Inga brottstyper matchar sökningen.</li>';
    return;
  }

  const valtId = document.getElementById('brottstyp').value;
  const grupper = new Map(); // brottsfamilj -> brottstyper, i den ordning familjerna först syns
  for (const s of traffar) {
    const familj = s.familj || 'Övrigt';
    if (!grupper.has(familj)) grupper.set(familj, []);
    grupper.get(familj).push(s);
  }

  for (const [familj, poster] of grupper) {
    const header = document.createElement('li');
    header.className = 'brottstyp-grupp-header';
    header.setAttribute('role', 'presentation');
    header.textContent = familj;
    lista.appendChild(header);
    for (const s of poster) {
      const li = document.createElement('li');
      li.className = 'brottstyp-option';
      li.id = `brottstyp-opt-${s.id}`;
      li.dataset.id = s.id;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(s.id === valtId));
      li.textContent = s.namn;
      lista.appendChild(li);
    }
  }
}

function oppnaBrottstypLista() {
  document.getElementById('brottstyp-lista').hidden = false;
  document.getElementById('brottstyp-sok').setAttribute('aria-expanded', 'true');
}

function stangBrottstypLista() {
  document.getElementById('brottstyp-lista').hidden = true;
  document.getElementById('brottstyp-sok').setAttribute('aria-expanded', 'false');
  document.getElementById('brottstyp-sok').removeAttribute('aria-activedescendant');
  brottstypAktivIndex = -1;
}

function valjBrottstyp(id) {
  document.getElementById('brottstyp').value = id;
  const skala = skalaFor(state.straffskalor, id);
  document.getElementById('brottstyp-sok').value = skala ? skala.namn : '';
  uppdateraSkalaHint();
}

function hanteraBrottstypTangent(e) {
  const lista = document.getElementById('brottstyp-lista');
  const alternativ = [...lista.querySelectorAll('[role="option"]')];
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (lista.hidden) {
      renderBrottstypLista(document.getElementById('brottstyp-sok').value);
      oppnaBrottstypLista();
      return;
    }
    brottstypAktivIndex = Math.min(brottstypAktivIndex + 1, alternativ.length - 1);
    markeraAktivtBrottstypAlternativ(alternativ);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    brottstypAktivIndex = Math.max(brottstypAktivIndex - 1, 0);
    markeraAktivtBrottstypAlternativ(alternativ);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (brottstypAktivIndex >= 0 && alternativ[brottstypAktivIndex]) {
      valjBrottstyp(alternativ[brottstypAktivIndex].dataset.id);
      document.getElementById('brottstyp-sok').blur();
    } else if (alternativ.length === 1) {
      valjBrottstyp(alternativ[0].dataset.id);
      document.getElementById('brottstyp-sok').blur();
    }
  } else if (e.key === 'Escape') {
    document.getElementById('brottstyp-sok').blur();
  }
}

function markeraAktivtBrottstypAlternativ(alternativ) {
  const sokInput = document.getElementById('brottstyp-sok');
  for (const el of alternativ) el.classList.remove('aktiv');
  const aktiv = alternativ[brottstypAktivIndex];
  if (aktiv) {
    aktiv.classList.add('aktiv');
    aktiv.scrollIntoView({ block: 'nearest' });
    sokInput.setAttribute('aria-activedescendant', aktiv.id);
  } else {
    sokInput.removeAttribute('aria-activedescendant');
  }
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
  // Webbläsarens inbyggda valideringspopup ("Value must be less than or equal to 6")
  // visas på användarens webbläsarspråk, inte appens - blev engelska mitt i en annars
  // helt svensk sida. Constraint Validation API:ets setCustomValidity() låter oss byta
  // ut texten mot en svensk motsvarighet utan att bygga om hela felhanteringen.
  const straffvardeInput = document.getElementById('straffvarde');
  straffvardeInput.addEventListener('invalid', () => {
    const v = straffvardeInput.validity;
    if (v.rangeOverflow) {
      straffvardeInput.setCustomValidity(`Värdet får vara högst ${straffvardeInput.max} månader för den valda brottstypen.`);
    } else if (v.rangeUnderflow) {
      straffvardeInput.setCustomValidity(`Värdet måste vara minst ${straffvardeInput.min} månader för den valda brottstypen.`);
    } else if (v.valueMissing) {
      straffvardeInput.setCustomValidity('Ange ett straffvärde i månader.');
    } else if (v.stepMismatch || v.badInput) {
      straffvardeInput.setCustomValidity('Ange ett giltigt tal, t.ex. 4,5.');
    } else {
      straffvardeInput.setCustomValidity('Ogiltigt värde.');
    }
  });
  // setCustomValidity() består mellan valideringsförsök tills den nollställs manuellt -
  // annars förblir fältet "ogiltigt" med gammalt felmeddelande även efter att
  // användaren rättat värdet.
  straffvardeInput.addEventListener('input', () => straffvardeInput.setCustomValidity(''));

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
    // Flytta fokus tillbaka till brottstyp-sökningen, redo för nästa brott - annars
    // krävs ett extra klick per tillagt brott, vilket är onödigt friktion i just det
    // arbetsflöde (mata in FLERA brott i rad) som hela appen är byggd för.
    document.getElementById('brottstyp-sok').focus();
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
  renderModellVal();
  renderBrottLista();
  renderVikter();
  const res = berakna({
    brott: state.brott,
    vikter: state.vikter,
    golvProcent: state.golvProcent,
    straffskalor: state.straffskalor,
    takAllmantManader: state.takAllmantManader,
    allmantGolvManader: state.allmantGolvManader,
    modell: state.modell,
    alderVidBrott: state.alderVidBrott,
  });
  renderTrappa(res);
  renderResultat(res);
  renderReferensdomar();
}

function renderModellVal() {
  const arAndelsmodell = state.modell === 'andelsmodell';
  document.getElementById('golv-procent-wrap').hidden = arAndelsmodell;
  document.getElementById('vikt-lista-details').hidden = arAndelsmodell;
  document.getElementById('modell-beskrivning').textContent = arAndelsmodell
    ? 'Enligt SOU 2023:1 (s. 130), som beskriver detta som redan etablerad domstolspraxis: ' +
      'hälften av varje ytterligare brotts straffvärde läggs till om det svåraste brottets ' +
      'straffvärde är högst 1 år 6 månader, annars en tredjedel. Vikterna går inte att ' +
      'justera för hand i detta läge - de följer regeln automatiskt.'
    : 'Vikterna är en förenklad illustration, inte en lagfäst formel – justera fritt.';
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
  if (state.modell === 'andelsmodell') return; // vikterna styrs automatiskt i detta läge
  const antal = Math.max(state.brott.length, 1);
  document.getElementById('vikt-lista-summary').textContent =
    `Justera vikter manuellt (avancerat) — ${antal} brott`;
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
  document.getElementById('skriv-ut-btn').hidden = res.sorterade.length === 0;
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
  const arAndelsmodell = res.modell === 'andelsmodell';
  const modellLabel = arAndelsmodell ? 'Andelsmodell (SOU 2023:1)' : 'Halveringsmodell';
  const modellLabelGenitiv = arAndelsmodell ? 'andelsmodellens' : 'halveringsmodellens';
  // Ungdomsreduktionen (29 kap. 7 § BrB) visas bara som en extra rad när den faktiskt slår
  // till (ålder ifylld och under 21) - annars är faktorn 1 och raden vore bara brus.
  const ungdomsRad = res.ungdomsfraktion !== 1
    ? `<div class="resultat-rad highlight ungdom">
        <span class="label">e) Straffmätningsvärde efter ungdomsreduktion (29 kap. 7 § BrB,
          ${res.alderVidBrott} år vid gärningstillfället — faktor ${Math.round(res.ungdomsfraktion * 100)}%)</span>
        <span class="varde">${formatManader(res.straffmatningsvarde)}</span>
      </div>`
    : '';
  container.innerHTML = `
    <div class="resultat-rad">
      <span class="label">a) Ren kumulation (summa av alla straffvärden)</span>
      <span class="varde">${formatManader(res.renKumulation)}</span>
    </div>
    <div class="resultat-rad">
      <span class="label">b) ${modellLabel} (viktad summa, före tak/golv)</span>
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
    ${ungdomsRad}
    ${golvNotis}
    <p class="resultat-not">Justerat resultat = ${modellLabelGenitiv} summa, begränsat till intervallet [golv, tak].
      Mängdrabatten (d) är a) minus c) räknat på de avrundade talen ovan, så att siffrorna går ihop
      vid kontrollräkning. Förenklad modell — den faktiska straffmätningen görs av domstolen utifrån
      samtliga omständigheter i det enskilda fallet.${res.ungdomsfraktion !== 1
        ? ' Ungdomsreduktionen (e) är en vägledande praxis-skala, inte en lagfäst tabell — det enskilda fallet kan motivera avvikelse.'
        : ''}</p>
  `;
}

// ---- Referensdomar & förklaringar ----

async function laddaReferensdomar() {
  const statusEl = document.getElementById('refs-status');
  try {
    const data = await hamtaJson('data/referensdomar.json');
    state.referensdomar = data.referensdomar || [];
    const antalRefs = state.referensdomar.length;
    statusEl.textContent = antalRefs > 0
      ? `${antalRefs} ${antalRefs === 1 ? 'referensdom hittad och sparad' : 'referensdomar hittade och sparade'} i cachen.`
      : 'Inga referensdomar har hittats och verifierats ännu. Sök manuellt via länkarna i den förklarande sektionen tills vidare.';
    renderTackning();
    renderReferensdomar();
  } catch (e) {
    statusEl.textContent = 'Kunde inte hämta referensdomar från backend.';
  }
}

function renderTackning() {
  const container = document.getElementById('tackning-lista');
  if (!container) return;
  const rader = analyseraTackning(state.referensdomar, state.straffskalor, state.forklarandeKallor);
  container.innerHTML = rader.map((r) => {
    const brist = r.flerfaldighet === 0 && r.doktrin === 0;
    const delar = [];
    if (r.totalt > 0) {
      delar.push(`${r.flerfaldighet} flerfaldighetsexempel${r.gransdragning > 0 ? `, ${r.gransdragning} gränsdragningsmål` : ''}`);
    }
    // Länkar direkt till doktrinkällorna här, i stället för att bara visa ett antal och
    // låta läsaren leta upp dem själv i "Bakgrundskällor"-panelen längre ner.
    const doktrinKallor = state.forklarandeKallor.filter((f) => (f.brottstyper || []).includes(r.id));
    if (doktrinKallor.length > 0) {
      const lankar = doktrinKallor.map((f, i) => {
        const text = doktrinKallor.length > 1 ? `[${i + 1}]` : f.kalla;
        return `<a href="${f.kalla_url}" target="_blank" rel="noopener" class="tackning-doktrinlank" title="${f.kalla}: ${f.titel}">${text}</a>`;
      }).join(' ');
      delar.push(`${r.doktrin} doktrin-/förarbets${r.doktrin > 1 ? 'källor' : 'källa'} (${lankar})`);
    }
    const detaljer = delar.length > 0 ? delar.join(' · ') : 'inga referensdomar eller doktrinkällor ännu';
    return `
      <div class="tackning-rad${brist ? ' tackning-brist' : ''}">
        <span class="tackning-namn">${r.namn}</span>
        <span class="tackning-siffror">${detaljer}</span>
      </div>
    `;
  }).join('');
}

function byggReferensdomLi(r, poang) {
  const li = document.createElement('li');
  if (!r.tillganglig) li.classList.add('otillganglig');
  // Används av @media print för att bara ta med relevanta referensdomar i utskriften -
  // se "Skriv ut resultat"-knappen.
  if (poang === 0) li.classList.add('ref-ej-relevant');
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
  return li;
}

function renderReferensdomar() {
  const ul = document.getElementById('refs-lista');
  const ulOvriga = document.getElementById('refs-lista-ovriga');
  const detaljerOvriga = document.getElementById('refs-ovriga-details');
  const summaryOvriga = document.getElementById('refs-ovriga-summary');
  const bristNotis = document.getElementById('refs-brist-notis');
  const tomNotis = document.getElementById('refs-tom-notis');
  ul.innerHTML = '';
  ulOvriga.innerHTML = '';

  if (state.referensdomar.length === 0) {
    bristNotis.hidden = true;
    tomNotis.hidden = true;
    detaljerOvriga.hidden = true;
    return;
  }

  const valdaTyper = new Set(state.brott.map((b) => b.typId));
  const rader = state.referensdomar
    .map((r, ursprungsindex) => ({ r, ursprungsindex, poang: relevansPoang(r, valdaTyper) }))
    .sort((a, b) => b.poang - a.poang || a.ursprungsindex - b.ursprungsindex);

  // Bara de faktiskt relevanta domarna visas direkt - resten (eller allihop, om inget
  // brott är tillagt ännu) hamnar i en utfällbar lista i stället för att alla ~30
  // referensdomar alltid skulle behöva skrollas igenom.
  const relevanta = rader.filter((rad) => rad.poang > 0);
  const ovriga = rader.filter((rad) => rad.poang === 0);
  const ingaBrottAnnu = valdaTyper.size === 0;

  if (ingaBrottAnnu) {
    tomNotis.hidden = false;
    bristNotis.hidden = true;
  } else if (relevanta.length === 0) {
    tomNotis.hidden = true;
    bristNotis.hidden = false;
    bristNotis.innerHTML = '<strong>Inga referensdomar täcker dina tillagda brottstyper ännu.</strong> ' +
      'Fäll ut listan nedan för att se samtliga referensdomar som jämförelsematerial.';
  } else {
    tomNotis.hidden = true;
    bristNotis.hidden = true;
  }

  for (const { r, poang } of relevanta) ul.appendChild(byggReferensdomLi(r, poang));
  for (const { r, poang } of ovriga) ulOvriga.appendChild(byggReferensdomLi(r, poang));

  detaljerOvriga.hidden = ovriga.length === 0;
  if (ovriga.length > 0) {
    summaryOvriga.textContent = relevanta.length > 0
      ? `Visa ${ovriga.length} ytterligare referensdomar (mindre relevanta för dina brott)`
      : `Visa alla ${ovriga.length} referensdomar`;
  }
}

async function laddaForklaringar() {
  const container = document.getElementById('forklaring-lista');
  try {
    const data = await hamtaJson('data/forklarande-kallor.json');
    const rader = data.forklarande_kallor || [];
    state.forklarandeKallor = rader;
    renderTackning();
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
