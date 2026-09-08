// Regressionstester för beräkningsmodellen i docs/calc.js. Körs med Node:s inbyggda
// testrunner: `npm test` (från backend/) eller `node --test test/`.
//
// Testfallet "tre brott med fallande halveringsvikter" är samma scenario som
// hand-verifierades manuellt i webbläsaren när tak/golv-regeln (26 kap. 2 § BrB,
// SFS 2026:1318) implementerades - se git-historiken för det ursprungliga felet detta
// skulle ha fångat automatiskt.

import { test } from "node:test";
import assert from "node:assert/strict";

import { berakna, avrundaMangdrabatt, relevansPoang, analyseraTackning, sorteradeBrott, skalaFor } from "../../docs/calc.js";

const ANDELSMODELL = "andelsmodell";

const STRAFFSKALOR = [
  { id: "ringa_stold", namn: "Ringa stöld", paragraf: "8 kap. 2 § BrB", min_manader: 0, max_manader: 6 },
  { id: "stold", namn: "Stöld", paragraf: "8 kap. 1 § BrB", min_manader: 0, max_manader: 24 },
  { id: "grov_stold", namn: "Grov stöld", paragraf: "8 kap. 4 § BrB", min_manader: 12, max_manader: 72 },
  { id: "inbrottsstold", namn: "Inbrottsstöld", paragraf: "8 kap. 4 a § BrB", min_manader: 12, max_manader: 72 },
  { id: "ringa_bedrageri", namn: "Ringa bedrägeri", paragraf: "9 kap. 2 § BrB", min_manader: 0, max_manader: 6 },
  { id: "bedrageri", namn: "Bedrägeri", paragraf: "9 kap. 1 § BrB", min_manader: 0, max_manader: 24 },
  { id: "grovt_bedrageri", namn: "Grovt bedrägeri", paragraf: "9 kap. 3 § BrB", min_manader: 12, max_manader: 72 },
];
const TAK_ALLMANT = 216;
const GOLV_ALLMANT = 1;

function brott(typId, manader, instId = 1) {
  return { instId, typId, manader };
}

function berakning(overrides) {
  return berakna({
    brott: [],
    vikter: [],
    golvProcent: 3,
    straffskalor: STRAFFSKALOR,
    takAllmantManader: TAK_ALLMANT,
    allmantGolvManader: GOLV_ALLMANT,
    ...overrides,
  });
}

test("berakna: ett enda brott ger ingen mängdrabatt", () => {
  const res = berakning({ brott: [brott("stold", 10)] });
  assert.equal(res.renKumulation, 10);
  assert.equal(res.halveringssumma, 10);
  assert.equal(res.takManader, 24);
  assert.equal(res.justeratResultat, 10);
  assert.equal(res.mangdrabattManader, 0);
});

test("berakna: tre brott med fallande halveringsvikter (grov stöld 36, stöld 10, ringa stöld 3)", () => {
  const res = berakning({
    brott: [brott("grov_stold", 36, 1), brott("stold", 10, 2), brott("ringa_stold", 3, 3)],
  });
  assert.equal(res.renKumulation, 49);
  assert.equal(res.halveringssumma, 41.75);
  assert.equal(res.svarasteTyp.id, "grov_stold");
  assert.equal(res.takManader, 102); // min(summa maxstraff 6+24+72=102, 2×72=144, 216)
  assert.equal(res.golvManader, 1);
  assert.equal(res.justeratResultat, 41.75);
  assert.equal(res.mangdrabattManader, 7.25);
  assert.ok(Math.abs(res.mangdrabattProcent - (7.25 / 49) * 100) < 1e-9);
});

test("berakna: blandad stöld + bedrägeri (verifierat på riktigt i webbläsaren, grovt bedrägeri 30 + bedrägeri 8 + stöld 5)", () => {
  const res = berakning({
    brott: [brott("grovt_bedrageri", 30, 1), brott("bedrageri", 8, 2), brott("stold", 5, 3)],
  });
  assert.equal(res.renKumulation, 43);
  assert.equal(res.halveringssumma, 35.25);
  assert.equal(res.svarasteTyp.id, "grovt_bedrageri");
  assert.equal(res.takManader, 120); // min(summa maxstraff 72+24+24=120, 2×72=144, 216)
  assert.equal(res.justeratResultat, 35.25);
  const { mangdrabattManader } = avrundaMangdrabatt(res.renKumulation, res.justeratResultat);
  assert.equal(mangdrabattManader, 7.7); // matchar "7,7 mån" som visades i webbläsaren
});

test("berakna: vid lika maxstraff mellan brottsfamiljer avgör högst faktiskt straffvärde vem som är 'svåraste'", () => {
  // grov_stold och grovt_bedrageri har samma maxstraff (72 mån) - grov_stold ska vinna
  // här eftersom dess faktiska straffvärde (20) är högre än grovt_bedrageris (15), inte
  // för att den råkar stå tidigare i listan.
  const res = berakning({
    brott: [brott("grovt_bedrageri", 15, 1), brott("grov_stold", 20, 2)],
  });
  assert.equal(res.svarasteTyp.id, "grov_stold");
});

test("berakna: andelsmodellen (SOU 2023:1) ger hälften per ytterligare brott när svåraste straffvärdet är högst 18 mån", () => {
  // grov_stold 15 mån (≤18) är svåraste - de två övriga ska då vardera få 50 %, INTE en
  // avtagande halveringsmodell (50 %, 25 %, ...) som annars vore standardläget.
  const res = berakning({
    brott: [brott("grov_stold", 15, 1), brott("stold", 10, 2), brott("stold", 8, 3)],
    modell: ANDELSMODELL,
  });
  assert.equal(res.modell, "andelsmodell");
  assert.equal(res.viktade[0].vikt, 1);
  assert.equal(res.viktade[1].vikt, 0.5);
  assert.equal(res.viktade[2].vikt, 0.5);
  assert.equal(res.halveringssumma, 15 + 10 * 0.5 + 8 * 0.5); // 24
});

test("berakna: andelsmodellen ger en tredjedel per ytterligare brott när svåraste straffvärdet överstiger 18 mån", () => {
  const res = berakning({
    brott: [brott("grov_stold", 24, 1), brott("stold", 9, 2)],
    modell: ANDELSMODELL,
  });
  assert.equal(res.viktade[0].vikt, 1);
  assert.ok(Math.abs(res.viktade[1].vikt - 1 / 3) < 1e-9);
  assert.ok(Math.abs(res.halveringssumma - (24 + 9 / 3)) < 1e-9); // 27
});

test("berakna: andelsmodellen ignorerar de manuellt satta vikterna helt (de gäller bara halveringsmodellen)", () => {
  const medVikter = berakning({
    brott: [brott("stold", 10, 1), brott("stold", 5, 2)],
    vikter: [100, 100], // skulle ge halveringssumma 15 i halveringsmodellen
    modell: ANDELSMODELL,
  });
  assert.equal(medVikter.halveringssumma, 10 + 5 * 0.5); // fortfarande andelsmodellens 50 %, inte 100 %
});

test("berakna: taket och golvet enligt 26 kap. 2 § BrB gäller oavsett vilken viktningsmodell som används", () => {
  const res = berakning({
    brott: [brott("grov_stold", 15, 1), brott("stold", 10, 2)],
    modell: ANDELSMODELL,
  });
  assert.equal(res.takManader, 96); // min(72+24=96, 2×72=144, 216) - samma takformel som alltid
  assert.equal(res.golvManader, 1);
});

test("berakna: taket enligt 26 kap. 2 § BrB (dubblerat maxstraff) klipper resultatet", () => {
  const tioStolder = Array.from({ length: 10 }, (_, i) => brott("stold", 24, i + 1));
  const res = berakning({ brott: tioStolder, vikter: Array(10).fill(100) });
  assert.equal(res.renKumulation, 240);
  assert.equal(res.halveringssumma, 240);
  assert.equal(res.takManader, 48); // 2 × stöldens maxstraff (24) - lägre än summan 240
  assert.equal(res.justeratResultat, 48);
  assert.equal(res.mangdrabattManader, 192);
  assert.equal(res.mangdrabattProcent, 80);
});

test("berakna: golvet (1 månad, 26 kap. 1 § BrB) höjer ett artificiellt lågt viktat resultat", () => {
  const res = berakning({
    brott: [brott("ringa_stold", 0.5)],
    vikter: [50], // ovanligt låg vikt för ett enda brott, satt manuellt för att pröva golvet
  });
  assert.equal(res.halveringssumma, 0.25);
  assert.equal(res.golvManader, 1);
  assert.equal(res.justeratResultat, 1); // golvet vinner över det viktade värdet 0.25
});

test("berakna: inga brott ger nollresultat", () => {
  const res = berakning({});
  assert.equal(res.renKumulation, 0);
  assert.equal(res.justeratResultat, 0);
  assert.equal(res.svarasteTyp, null);
});

test("avrundaMangdrabatt: mängdrabatten stämmer med a) minus c) räknat på de avrundade talen", () => {
  // Regressionstest: två ringa stöld på 3 och 1,5 månader ger halveringssumma 3,75, som
  // visas avrundat som "3,8". Räknar man 4,5 - 3,8 för hand ska man få samma svar som
  // appen visar för mängdrabatten - inte 4,5 - 3,75 = 0,75 (som råkar avrunda till samma
  // "0,8" här, men inte alltid gör det).
  const res = avrundaMangdrabatt(4.5, 3.75);
  assert.equal(res.renKumulationAvrundad, 4.5);
  assert.equal(res.justeratResultatAvrundat, 3.8);
  assert.equal(res.mangdrabattManader, 0.7); // 4.5 - 3.8, INTE 4.5 - 3.75 (=0.75 → hade blivit 0.8)
});

test("avrundaMangdrabatt: procenten räknas på samma avrundade tal som månaderna", () => {
  const res = avrundaMangdrabatt(4.5, 3.75);
  assert.ok(Math.abs(res.mangdrabattProcent - (0.7 / 4.5) * 100) < 1e-9);
});

test("avrundaMangdrabatt: ingen brott/nollresultat ger 0 % utan att dela med noll", () => {
  const res = avrundaMangdrabatt(0, 0);
  assert.equal(res.mangdrabattManader, 0);
  assert.equal(res.mangdrabattProcent, 0);
});

test("relevansPoang: inga valda brottstyper ger alltid 0", () => {
  const ref = { brottstyper: ["grov_stold"], flerfaldighetsexempel: true };
  assert.equal(relevansPoang(ref, new Set()), 0);
});

test("relevansPoang: ingen överlappning ger 0", () => {
  const ref = { brottstyper: ["grov_stold"], flerfaldighetsexempel: true };
  assert.equal(relevansPoang(ref, new Set(["stold"])), 0);
});

test("relevansPoang: fullständig brottstypsträff rankas högre än delvis träff", () => {
  const heltMatchande = { brottstyper: ["grov_stold"], flerfaldighetsexempel: false };
  const delvisMatchande = { brottstyper: ["grov_stold", "stold", "ringa_stold"], flerfaldighetsexempel: false };
  const valda = new Set(["grov_stold"]);
  assert.ok(relevansPoang(heltMatchande, valda) > relevansPoang(delvisMatchande, valda));
});

test("relevansPoang: flerfaldighetsexempel rankas före gränsdragningsmål vid samma brottstypsträff", () => {
  // Regressionstest för buggen där NJA 2006 s. 524 (ett verkligt flerfaldighetsexempel)
  // rankades under gränsdragningsmålen NJA 2019 s. 951 / NJA 2025:67 trots samma träff.
  const flerfaldighetsexempel = { brottstyper: ["ringa_stold", "stold"], flerfaldighetsexempel: true };
  const gransdragningsmal = { brottstyper: ["ringa_stold", "stold"], flerfaldighetsexempel: false };
  const valda = new Set(["ringa_stold", "stold"]);
  assert.ok(relevansPoang(flerfaldighetsexempel, valda) > relevansPoang(gransdragningsmal, valda));
});

test("relevansPoang: flerfaldighetsbonusen kan aldrig slå ut en bättre brottstypsträff", () => {
  const delvisMedBonus = { brottstyper: ["ringa_stold"], flerfaldighetsexempel: true }; // matchar 1 av 1
  const heltUtanBonus = { brottstyper: ["ringa_stold", "stold"], flerfaldighetsexempel: false }; // matchar 2 av 2
  const valda = new Set(["ringa_stold", "stold"]);
  assert.ok(relevansPoang(heltUtanBonus, valda) > relevansPoang(delvisMedBonus, valda));
});

test("sorteradeBrott: sorterar brotten fallande efter straffvärde", () => {
  const sorterat = sorteradeBrott([brott("stold", 5, 1), brott("grov_stold", 20, 2), brott("ringa_stold", 1, 3)]);
  assert.deepEqual(sorterat.map((b) => b.instId), [2, 1, 3]);
});

test("skalaFor: hittar rätt straffskala via id, annars undefined", () => {
  assert.equal(skalaFor(STRAFFSKALOR, "grov_stold").namn, "Grov stöld");
  assert.equal(skalaFor(STRAFFSKALOR, "okand_typ"), undefined);
});

test("analyseraTackning: räknar flerfaldighetsexempel och gränsdragningsmål separat per brottstyp", () => {
  const referensdomar = [
    { brottstyper: ["stold", "grov_stold"], flerfaldighetsexempel: true },
    { brottstyper: ["stold"], flerfaldighetsexempel: false },
    { brottstyper: ["grov_stold"], flerfaldighetsexempel: true },
  ];
  const rader = analyseraTackning(referensdomar, STRAFFSKALOR);

  const stold = rader.find((r) => r.id === "stold");
  assert.equal(stold.totalt, 2);
  assert.equal(stold.flerfaldighet, 1);
  assert.equal(stold.gransdragning, 1);

  const grovStold = rader.find((r) => r.id === "grov_stold");
  assert.equal(grovStold.totalt, 2);
  assert.equal(grovStold.flerfaldighet, 2);
  assert.equal(grovStold.gransdragning, 0);
});

test("analyseraTackning: en straffskala utan någon referensdom visas ändå, med nollor (så luckan syns)", () => {
  const rader = analyseraTackning([], STRAFFSKALOR);
  assert.equal(rader.length, STRAFFSKALOR.length);
  for (const rad of rader) {
    assert.equal(rad.totalt, 0);
    assert.equal(rad.flerfaldighet, 0);
    assert.equal(rad.gransdragning, 0);
    assert.equal(rad.doktrin, 0);
  }
});

test("analyseraTackning: brottstyper-id:n som saknas i straffskalorna ignoreras tyst (inte appens jobb att kasta fel här)", () => {
  const referensdomar = [{ brottstyper: ["okand_typ"], flerfaldighetsexempel: true }];
  const rader = analyseraTackning(referensdomar, STRAFFSKALOR);
  assert.equal(rader.every((r) => r.totalt === 0), true);
});

test("analyseraTackning: räknar förklarande källor (doktrin/förarbeten) separat per brottstyp", () => {
  const forklarandeKallor = [
    { brottstyper: ["stold", "grov_stold"] },
    { brottstyper: ["stold"] },
  ];
  const rader = analyseraTackning([], STRAFFSKALOR, forklarandeKallor);
  assert.equal(rader.find((r) => r.id === "stold").doktrin, 2);
  assert.equal(rader.find((r) => r.id === "grov_stold").doktrin, 1);
  assert.equal(rader.find((r) => r.id === "ringa_stold").doktrin, 0);
});

test("analyseraTackning: en förklarande källa utan brottstyper (generell doktrin) räknas inte som täckning för någon brottstyp", () => {
  const forklarandeKallor = [{ brottstyper: [] }, { }];
  const rader = analyseraTackning([], STRAFFSKALOR, forklarandeKallor);
  assert.equal(rader.every((r) => r.doktrin === 0), true);
});
