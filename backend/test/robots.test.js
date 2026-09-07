// Regressionstester för robots.txt-tolkningen i backend/src/robots.js. Fixturerna nedan
// är riktiga robots.txt-utdrag som lästes av under research inför den här appen (verifierat
// 2026-09-03/04) - inte påhittade exempel.
//
// "beslutaOmAtkomst: lawline.se nekar ClaudeBot..." är det viktigaste testet i filen: det är
// exakt den upptäckten som ledde till att scraper.js aldrig får hämta från lawline.se
// automatiskt (se MANUELL_ENDAST_DOMANER i scraper.js). Om robots.txt-tolkningen någonsin
// ändras på ett sätt som skulle låta den regeln glida igenom är det precis det här testet
// som ska slå larm.

import { test } from "node:test";
import assert from "node:assert/strict";

import { parseRobots, pathAllowed, beslutaOmAtkomst } from "../src/robots.js";

const LAWLINE_ROBOTS = `
User-Agent: Googlebot
Allow: /
User-Agent: Bingbot
Allow: /
User-Agent: DuckDuckBot
Allow: /
User-Agent: ChatGPT-User
Allow: /
User-Agent: PerplexityBot
Allow: /
User-Agent: Google-Extended
Allow: /
User-Agent: GPTBot
Disallow: /
User-Agent: ClaudeBot
Disallow: /
User-Agent: Amazonbot
Disallow: /
User-Agent: FacebookBot
Disallow: /
User-Agent: *
Allow: /
Sitemap: https://lawline.se/sitemap.xml
`;

const DOMSTOL_ROBOTS = `
User-agent: *
Allow: /
Sitemap: https://www.domstol.se/sitemap.xml
`;

const LAGEN_NU_ROBOTS = `
User-agent: *
Disallow: /api/
Disallow: /search/
Disallow: /-/
Disallow: /*fs/*.png
`;

test("parseRobots: grupperar Lawlines separata User-agent-block var för sig", () => {
  const groups = parseRobots(LAWLINE_ROBOTS);
  assert.deepEqual(groups["claudebot"].rules, [{ path: "/", allow: false }]);
  assert.deepEqual(groups["gptbot"].rules, [{ path: "/", allow: false }]);
  assert.deepEqual(groups["googlebot"].rules, [{ path: "/", allow: true }]);
  assert.deepEqual(groups["*"].rules, [{ path: "/", allow: true }]);
});

test("parseRobots: en User-agent-rad direkt efter en annan hör till samma block", () => {
  const text = `
User-agent: A
User-agent: B
Disallow: /hemligt/
`;
  const groups = parseRobots(text);
  assert.deepEqual(groups["a"].rules, [{ path: "/hemligt/", allow: false }]);
  assert.deepEqual(groups["b"].rules, [{ path: "/hemligt/", allow: false }]);
});

test("parseRobots: en User-agent-rad efter en regel startar ett NYTT block", () => {
  const text = `
User-agent: A
Disallow: /a-hemligt/
User-agent: B
Disallow: /b-hemligt/
`;
  const groups = parseRobots(text);
  assert.deepEqual(groups["a"].rules, [{ path: "/a-hemligt/", allow: false }]);
  assert.deepEqual(groups["b"].rules, [{ path: "/b-hemligt/", allow: false }]);
});

test("pathAllowed: längsta matchande regel vinner (Allow under Disallow)", () => {
  const groups = parseRobots(`
User-agent: *
Disallow: /api/
Allow: /api/public/
`);
  assert.equal(pathAllowed(groups, "*", "/api/hemligt"), false);
  assert.equal(pathAllowed(groups, "*", "/api/public/data"), true);
  assert.equal(pathAllowed(groups, "*", "/annat"), null); // ingen regel matchar
});

test("pathAllowed: ingen regel alls för en agent ger null (okänt, inte nekat)", () => {
  const groups = parseRobots(LAWLINE_ROBOTS);
  assert.equal(pathAllowed(groups, "nagon-helt-annan-bot", "/vad-som-helst"), null);
});

test('pathAllowed: tomt "Disallow:" betyder tillåt allt', () => {
  const groups = parseRobots(`
User-agent: *
Disallow:
`);
  assert.equal(pathAllowed(groups, "*", "/vad-som-helst"), true);
});

test("beslutaOmAtkomst: lawline.se nekar ClaudeBot trots att wildcard tillåter allt", () => {
  // Detta är den verkliga upptäckten som ligger bakom hela lawline.se-policyn i scraper.js.
  const groups = parseRobots(LAWLINE_ROBOTS);
  const tillaten = beslutaOmAtkomst(groups, "/answers/nagon-artikel", {
    namngivnaAgenter: ["claudebot", "gptbot", "ccbot"],
    egenUA: "mangdrabattkalkylator/1.0",
  });
  assert.equal(tillaten, false);
});

test("beslutaOmAtkomst: domstol.se-liknande wildcard-only tillåter allt", () => {
  const groups = parseRobots(DOMSTOL_ROBOTS);
  const tillaten = beslutaOmAtkomst(groups, "/tjanster-och-blanketter/sok-rattspraxis/", {
    namngivnaAgenter: ["claudebot", "gptbot", "ccbot"],
    egenUA: "mangdrabattkalkylator/1.0",
  });
  assert.equal(tillaten, true);
});

test("beslutaOmAtkomst: lagen.nu-liknande sajt nekar tekniska sökvägar men tillåter domsidor", () => {
  const groups = parseRobots(LAGEN_NU_ROBOTS);
  assert.equal(
    beslutaOmAtkomst(groups, "/dom/rh/2015:26", { namngivnaAgenter: ["claudebot"], egenUA: "mangdrabattkalkylator/1.0" }),
    true
  );
  assert.equal(
    beslutaOmAtkomst(groups, "/api/sok", { namngivnaAgenter: ["claudebot"], egenUA: "mangdrabattkalkylator/1.0" }),
    false
  );
});

test("beslutaOmAtkomst: ingen robots.txt-regel alls ger tillåtet som standard", () => {
  assert.equal(beslutaOmAtkomst({}, "/vad-som-helst", { namngivnaAgenter: ["claudebot"] }), true);
});

test("beslutaOmAtkomst: egen UA:s explicita regel vinner över wildcard", () => {
  const groups = parseRobots(`
User-agent: mangdrabattkalkylator/1.0
Disallow: /
User-agent: *
Allow: /
`);
  const tillaten = beslutaOmAtkomst(groups, "/nagon-sida", {
    namngivnaAgenter: [],
    egenUA: "mangdrabattkalkylator/1.0",
  });
  assert.equal(tillaten, false);
});
