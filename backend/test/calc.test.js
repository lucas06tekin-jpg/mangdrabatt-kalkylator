// Regressionstester för beräkningsmodellen i docs/calc.js. Körs med Node:s inbyggda
// testrunner: `npm test` (från backend/) eller `node --test test/`.
//
// Testfallet "tre brott med fallande halveringsvikter" är samma scenario som
// hand-verifierades manuellt i webbläsaren när tak/golv-regeln (26 kap. 2 § BrB,
// SFS 2026:1318) implementerades - se git-historiken för det ursprungliga felet detta
// skulle ha fångat automatiskt.

import { test } from "node:test";
import assert from "node:assert/strict";

import { berakna, relevansPoang, sorteradeBrott, skalaFor } from "../../docs/calc.js";

const STRAFFSKALOR = [
  { id: "ringa_stold", namn: "Ringa stöld", paragraf: "8 kap. 2 § BrB", min_manader: 0, max_manader: 6 },
  { id: "stold", namn: "Stöld", paragraf: "8 kap. 1 § BrB", min_manader: 0, max_manader: 24 },
  { id: "grov_stold", namn: "Grov stöld", paragraf: "8 kap. 4 § BrB", min_manader: 12, max_manader: 72 },
  { id: "inbrottsstold", namn: "Inbrottsstöld", paragraf: "8 kap. 4 a § BrB", min_manader: 12, max_manader: 72 },
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
