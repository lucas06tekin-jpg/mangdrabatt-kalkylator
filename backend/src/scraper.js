// Uppdaterar cachen genom att kontrollera att de manuellt verifierade käll-URL:erna i
// seedSources.js fortfarande är nåbara - och respekterar varje sajts robots.txt.
//
// Detta är INTE en fritt sökande crawler. Varje post i seedSources.js har verifierats
// manuellt (URL öppnad, innehåll läst) innan den lades till. Scraperns jobb är att med
// jämna mellanrum kontrollera att källan fortfarande finns kvar, inte att extrahera och
// lagra fritext - hela källtexter sparas aldrig, bara de korta sammanfattningar som redan
// ligger i seed-listan.
//
// lawline.se nekar uttryckligen "ClaudeBot" i sin robots.txt (verifierat 2026-09-03), trots
// att User-agent: * tillåts. Den här scrapern rör därför ALDRIG lawline.se automatiskt -
// se hanteringen av FORKLARANDE_KALLOR nedan.

import {
  getDb,
  upsertReferensdom,
  upsertForklarandeKalla,
  upsertKallstatus,
} from "./db.js";
import { REFERENSDOMAR, FORKLARANDE_KALLOR } from "./seedSources.js";
import { parseRobots, beslutaOmAtkomst } from "./robots.js";

const USER_AGENT =
  "MangdrabattKalkylator/1.0 (kontakt: lucas06.tekin@gmail.com; enbart cache-uppdatering)";
const TIMEOUT_MS = 10_000;
const FORDROJNING_MS = 2000;
// Domäner vi aldrig hämtar automatiskt ifrån, oavsett vad robots.txt råkar säga för vår
// egen User-Agent-sträng - just nu bara lawline.se, som uttryckligen nekar ClaudeBot.
const MANUELL_ENDAST_DOMANER = ["lawline.se", "www.lawline.se"];
// Namngivna AI-crawlers vi respekterar en uttrycklig nekan från, oavsett vår egen UA.
const NAMNGIVNA_AI_AGENTER = ["claudebot", "gptbot", "ccbot"];
const EGEN_UA_NAMN = "mangdrabattkalkylator/1.0";

const robotsCache = new Map();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function robotsTillaterFetch(url) {
  const parsed = new URL(url);
  if (MANUELL_ENDAST_DOMANER.includes(parsed.hostname)) return false;

  const origin = parsed.origin;
  if (!robotsCache.has(origin)) {
    try {
      const resp = await fetchMedTimeout(`${origin}/robots.txt`);
      robotsCache.set(origin, resp.ok ? parseRobots(await resp.text()) : {});
    } catch {
      robotsCache.set(origin, null); // kunde inte läsas -> neka för säkerhets skull
    }
  }
  const groups = robotsCache.get(origin);
  if (groups === null) return false;

  return beslutaOmAtkomst(groups, parsed.pathname, {
    namngivnaAgenter: NAMNGIVNA_AI_AGENTER,
    egenUA: EGEN_UA_NAMN,
  });
}

async function fetchMedTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...options,
      headers: { "User-Agent": USER_AGENT, ...(options.headers || {}) },
      signal: controller.signal,
      redirect: "follow",
    });
  } finally {
    clearTimeout(timer);
  }
}

async function kontrolleraUrl(url) {
  const tillaten = await robotsTillaterFetch(url);
  if (!tillaten) {
    return { tillganglig: false, meddelande: "robots.txt tillåter inte automatiserad hämtning av denna sida" };
  }
  try {
    let resp = await fetchMedTimeout(url, { method: "HEAD" });
    if (!resp.ok) resp = await fetchMedTimeout(url, { method: "GET" });
    return resp.ok
      ? { tillganglig: true, meddelande: "ok" }
      : { tillganglig: false, meddelande: `HTTP ${resp.status}` };
  } catch (err) {
    return { tillganglig: false, meddelande: `kunde inte nås: ${err.message}` };
  }
}

export async function uppdateraCache() {
  getDb(); // säkerställ att schema finns
  const now = new Date().toISOString();
  const resultat = { referensdomar: 0, forklarandeKallor: 0, otillgangliga: [] };

  for (const post of REFERENSDOMAR) {
    const { tillganglig, meddelande } = await kontrolleraUrl(post.kalla_url);
    await sleep(FORDROJNING_MS);
    upsertReferensdom({
      id: post.id,
      kalla: post.kalla,
      kalla_url: post.kalla_url,
      domstol: post.domstol,
      brott_sammanfattning: post.brott_sammanfattning,
      straffvarde_text: post.straffvarde_text,
      brottstyper: JSON.stringify(post.brottstyper || []),
      flerfaldighetsexempel: post.flerfaldighetsexempel ? 1 : 0,
      verifieringsstatus: post.verifieringsstatus,
      senast_kontrollerad: now,
      tillganglig: tillganglig ? 1 : 0,
    });
    upsertKallstatus({
      kalla: post.kalla,
      kategori: "referensdom",
      robots_tillater: tillganglig ? 1 : 0,
      senast_forsokt: now,
      status: tillganglig ? "tillgänglig" : "otillgänglig",
      meddelande,
    });
    resultat.referensdomar += 1;
    if (!tillganglig) resultat.otillgangliga.push({ id: post.id, meddelande });
  }

  // Förklarande källor: domäner i MANUELL_ENDAST_DOMANER (lawline.se) kontrolleras ALDRIG
  // automatiskt - robots.txt-spärren där betyder "vi väljer att inte fråga", inte "sidan är
  // nere", så de ska inte märkas otillgängliga bara för att vi avstår från att fråga.
  // Övriga domäner (t.ex. svjt.se, aklagare.se) får en riktig nåbarhetskontroll.
  for (const post of FORKLARANDE_KALLOR) {
    const manuellEndast = MANUELL_ENDAST_DOMANER.includes(new URL(post.kalla_url).hostname);
    let tillganglig = true;
    let meddelande = "manuellt granskad - hämtas aldrig automatiskt (robots.txt nekar ClaudeBot)";
    let robotsTillater = 0;
    if (!manuellEndast) {
      ({ tillganglig, meddelande } = await kontrolleraUrl(post.kalla_url));
      robotsTillater = tillganglig ? 1 : 0;
      await sleep(FORDROJNING_MS);
    }
    upsertForklarandeKalla({
      id: post.id,
      kalla: post.kalla,
      titel: post.titel,
      kalla_url: post.kalla_url,
      sammanfattning: post.sammanfattning,
      granskningsdjup: post.granskningsdjup || "fulltext",
      senast_kontrollerad: now,
      tillganglig: tillganglig ? 1 : 0,
      auto_uppdateras: manuellEndast ? 0 : 1,
    });
    upsertKallstatus({
      kalla: post.kalla,
      kategori: "forklarande",
      robots_tillater: robotsTillater,
      senast_forsokt: now,
      status: manuellEndast ? "manuellt granskad (ej auto-uppdaterad)" : (tillganglig ? "tillgänglig" : "otillgänglig"),
      meddelande,
    });
    resultat.forklarandeKallor += 1;
    if (!manuellEndast && !tillganglig) resultat.otillgangliga.push({ id: post.id, meddelande });
  }

  return resultat;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  uppdateraCache().then((r) => console.log(JSON.stringify(r, null, 2)));
}
