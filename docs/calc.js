// Ren beräkningslogik - inga DOM-anrop här. Delas mellan appen (via <script type="module">)
// och Node-testerna i backend/test/calc.test.js, så att modellen kan testas utan webbläsare.

export function formatManader(m) {
  const rounded = Math.round(m * 10) / 10;
  return `${rounded} mån`;
}

export function skalaFor(straffskalor, typId) {
  return straffskalor.find((s) => s.id === typId);
}

export function sorteradeBrott(brott) {
  return [...brott].sort((a, b) => b.manader - a.manader);
}

export function berakna({ brott, vikter, golvProcent, straffskalor, takAllmantManader, allmantGolvManader }) {
  const sorterade = sorteradeBrott(brott);
  const golv = golvProcent / 100;

  const viktade = sorterade.map((b, i) => {
    const vikt = i < vikter.length ? vikter[i] / 100 : Math.max(golv, Math.pow(0.5, i));
    return { ...b, vikt, viktatVarde: b.manader * vikt };
  });

  const renKumulation = sorterade.reduce((sum, b) => sum + b.manader, 0);
  const halveringssumma = viktade.reduce((sum, b) => sum + b.viktatVarde, 0);

  let golvManader = allmantGolvManader;
  let takManader = takAllmantManader;
  let svarasteTyp = null;

  if (sorterade.length > 0) {
    const typerMedd = sorterade.map((b) => skalaFor(straffskalor, b.typId));
    svarasteTyp = typerMedd.reduce((max, s) => (s.max_manader > max.max_manader ? s : max), typerMedd[0]);
    const summaMax = typerMedd.reduce((sum, s) => sum + s.max_manader, 0);
    // 26 kap. 2 § BrB, lydelse efter SFS 2026:1318 (i kraft 1 aug 2026): taket är det
    // högsta maximistraffet bland brotten, dubblerat - men aldrig mer än summan av
    // maximistraffen eller 18 år. Den äldre stegvisa tilläggsregeln (+1/+2/+4 år) och
    // den äldre golvregeln (strängaste minimistraffet) är avskaffade i samma reform.
    takManader = Math.min(summaMax, svarasteTyp.max_manader * 2, takAllmantManader);
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

// Mängdrabatten i resultatpanelen visas som "a) minus c)" (ren kumulation minus det
// tak/golv-justerade resultatet). Om den siffran räknas ut från de OAVRUNDADE värdena
// stämmer den inte alltid överens med vad man får om man själv drar av de AVRUNDADE
// talen som faktiskt visas för a) och c) - t.ex. kan 4,5 (a) och 3,8 (c, avrundat från
// 3,75) se ut att ge 0,7 i mängdrabatt för den som räknar efter, trots att den exakta
// modellen ger 0,75 → avrundat 0,8. Den här funktionen räknar därför ut mängdrabatten
// från samma avrundade tal som visas, så att siffrorna alltid går ihop för den som
// kontrollräknar.
export function avrundaMangdrabatt(renKumulation, justeratResultat) {
  const renKumulationAvrundad = Math.round(renKumulation * 10) / 10;
  const justeratResultatAvrundat = Math.round(justeratResultat * 10) / 10;
  const mangdrabattManader = Math.round((renKumulationAvrundad - justeratResultatAvrundat) * 10) / 10;
  const mangdrabattProcent = renKumulationAvrundad > 0 ? (mangdrabattManader / renKumulationAvrundad) * 100 : 0;
  return { renKumulationAvrundad, justeratResultatAvrundat, mangdrabattManader, mangdrabattProcent };
}

export function relevansPoang(ref, valdaTyper) {
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
