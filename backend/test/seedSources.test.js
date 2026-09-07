// Dataintegritetstester för backend/src/seedSources.js och straffskalor.js. Dessa fångar
// den typ av fel som är lätt att göra av misstag när fler brottstyper eller referensdomar
// läggs till för hand - en felstavad brottstyp-id, en kopierad post med samma id, eller en
// ny straffskala utan familj-fält (som gör dropdown-grupperingen i appen ofullständig).

import { test } from "node:test";
import assert from "node:assert/strict";

import { STRAFFSKALOR } from "../src/straffskalor.js";
import { REFERENSDOMAR, FORKLARANDE_KALLOR } from "../src/seedSources.js";

test("STRAFFSKALOR: varje straffskala har ett familj-fält (styr dropdown-grupperingen)", () => {
  for (const s of STRAFFSKALOR) {
    assert.ok(s.familj, `${s.id} saknar familj-fält`);
  }
});

test("STRAFFSKALOR: inga dubbla id:n", () => {
  const ids = STRAFFSKALOR.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("REFERENSDOMAR: varje brottstyper-id refererar en verklig straffskala", () => {
  const giltigaIds = new Set(STRAFFSKALOR.map((s) => s.id));
  for (const dom of REFERENSDOMAR) {
    for (const typId of dom.brottstyper) {
      assert.ok(giltigaIds.has(typId), `${dom.id} refererar okänd brottstyp "${typId}"`);
    }
  }
});

test("REFERENSDOMAR: varje post har minst en brottstyp (annars matchas den aldrig av relevanssorteringen)", () => {
  for (const dom of REFERENSDOMAR) {
    assert.ok(dom.brottstyper.length > 0, `${dom.id} saknar brottstyper`);
  }
});

test("REFERENSDOMAR: inga dubbla id:n (skulle annars skriva över varandra i cachen)", () => {
  const ids = REFERENSDOMAR.map((d) => d.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("FORKLARANDE_KALLOR: inga dubbla id:n", () => {
  const ids = FORKLARANDE_KALLOR.map((f) => f.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("FORKLARANDE_KALLOR: varje post har ett giltigt granskningsdjup", () => {
  for (const f of FORKLARANDE_KALLOR) {
    assert.ok(
      f.granskningsdjup === "fulltext" || f.granskningsdjup === "snippet",
      `${f.id} har ogiltigt granskningsdjup "${f.granskningsdjup}"`
    );
  }
});
