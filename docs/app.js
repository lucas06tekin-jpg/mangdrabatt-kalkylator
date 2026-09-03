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

function formatManader(m) {
  const rounded = Math.round(m * 10) / 10;
  return `${rounded} mån`;
}

function skalaFor(typId) {
  return state.straffskalor.find((s) => s.id === typId);
}

// ---- Init ----

async function init() {
  const skalorResp = await hamtaJson('data/straffskalor.json');
  state.straffskalor = skalorResp.straffskalor;
  state.takAllmantManader = skalorResp.tak_allmant_manader;
  state.allmantGolvManader = skalorResp.allmant_golv_manader;

  renderStraffskalorFakta();
  fyllBrottstypDropdown();
  bindForm();

  document.getElementById('golv-procent').addEventListener('input', (e) => {
    state.golvProcent = Math.max(0.5, Number(e.target.value) || 0);
    rakenOmOchRendera();
  });

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
    dd.textContent = s.skala_text;
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
  const skala = skalaFor(typId);
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
    const skala = skalaFor(typId);
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

// ---- Beräkning ----

function sorteradeBrott() {
  return [...state.brott].sort((a, b) => b.manader - a.manader);
}

function berakna() {
  const sorterade = sorteradeBrott();
  const golv = state.golvProcent / 100;

  const viktade = sorterade.map((b, i) => {
    const vikt = i < state.vikter.length ? state.vikter[i] / 100 : Math.max(golv, Math.pow(0.5, i));
    return { ...b, vikt, viktatVarde: b.manader * vikt };
  });

  const renKumulation = sorterade.reduce((sum, b) => sum + b.manader, 0);
  const halveringssumma = viktade.reduce((sum, b) => sum + b.viktatVarde, 0);

  let golvManader = state.allmantGolvManader;
  let takManader = state.takAllmantManader;
  let svarasteTyp = null;

  if (sorterade.length > 0) {
    const typerMedd = sorterade.map((b) => skalaFor(b.typId));
    svarasteTyp = typerMedd.reduce((max, s) => (s.max_manader > max.max_manader ? s : max), typerMedd[0]);
    const summaMax = typerMedd.reduce((sum, s) => sum + s.max_manader, 0);
    // 26 kap. 2 § BrB, lydelse efter SFS 2026:1318 (i kraft 1 aug 2026): taket är det
    // högsta maximistraffet bland brotten, dubblerat - men aldrig mer än summan av
    // maximistraffen eller 18 år. Den äldre stegvisa tilläggsregeln (+1/+2/+4 år) och
    // den äldre golvregeln (strängaste minimistraffet) är avskaffade i samma reform.
    takManader = Math.min(summaMax, svarasteTyp.max_manader * 2, state.takAllmantManader);
  }

  const justeratResultat = sorterade.length > 0
    ? Math.min(takManader, Math.max(golvManader, halveringssumma))
    : 0;

  const mangdrabattManader = renKumulation - justeratResultat;
  const mangdrabattProcent = renKumulation > 0 ? (mangdrabattManader / renKumulation) * 100 : 0;

  return {
    sorterade, viktade, renKumulation, halveringssumma,
    golvManader, takManader, svarasteTyp, justeratResultat,
    mangdrabattManader, mangdrabattProcent,
  };
}

// ---- Rendering ----

function rakenOmOchRendera() {
  renderBrottLista();
  renderVikter();
  const res = berakna();
  renderTrappa(res);
  renderResultat(res);
  renderReferensdomar();
}

function renderBrottLista() {
  const ul = document.getElementById('brott-lista');
  ul.innerHTML = '';
  const sorterade = sorteradeBrott();
  if (sorterade.length === 0) {
    const li = document.createElement('li');
    li.className = 'brott-tom';
    li.textContent = 'Inga brott tillagda ännu.';
    ul.appendChild(li);
    return;
  }
  sorterade.forEach((b, i) => {
    const skala = skalaFor(b.typId);
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
    const skala = skalaFor(b.typId);
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
      <span class="varde">${formatManader(res.mangdrabattManader)} (${res.mangdrabattProcent.toFixed(1)}%)</span>
    </div>
    <p class="resultat-not">Justerat resultat = halveringsmodellens summa, begränsat till intervallet [golv, tak].
      Förenklad modell — den faktiska straffmätningen görs av domstolen utifrån samtliga omständigheter i
      det enskilda fallet.</p>
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

function relevansPoang(ref, valdaTyper) {
  const brottstyper = ref.brottstyper || [];
  if (brottstyper.length === 0 || valdaTyper.size === 0) return 0;
  const matchade = brottstyper.filter((t) => valdaTyper.has(t));
  if (matchade.length === 0) return 0;
  // Fler matchande typer väger tyngst; en dom där ALLA dess brottstyper matchar
  // (t.ex. en renodlad grov stöld-dom när bara grov stöld är ifyllt) rankas före
  // en dom som bara delvis matchar. Ett litet tillägg ser till att faktiska
  // flerfaldighetsexempel (verkliga avgöranden om flera brott) rankas före
  // gränsdragningsmål/enstaka brott med samma brottstypsträff.
  return matchade.length + matchade.length / brottstyper.length + (ref.flerfaldighetsexempel ? 0.4 : 0);
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
    li.innerHTML = `
      <div class="ref-id">${r.id}
        <span class="verif-badge ${verifClass}">${verifText}</span>
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
      div.innerHTML = `
        <h4>${f.titel}</h4>
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
