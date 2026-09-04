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

const USER_AGENT =
  "MangdrabattKalkylator/1.0 (kontakt: lucas06.tekin@gmail.com; enbart cache-uppdatering)";
const TIMEOUT_MS = 10_000;
const FORDROJNING_MS = 2000;
// Domäner vi aldrig hämtar automatiskt ifrån, oavsett vad robots.txt råkar säga för vår
// egen User-Agent-sträng - just nu bara lawline.se, som uttryckligen nekar ClaudeBot.
const MANUELL_ENDAST_DOMANER = ["lawline.se", "www.lawline.se"];

const robotsCache = new Map();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRobots(text) {
  // robots.txt-parser: en User-agent-rad som följer direkt efter en annan User-agent-rad
  // hör till samma block (delar regler); en User-agent-rad som följer efter en
  // Disallow/Allow-rad startar ett nytt block.
  const blocks = [];
  let current = null;
  let blockHasRules = false;
  for (const rawLine of text.split("\n")) {
    const line = rawLine.split("#")[0].trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (key === "user-agent") {
      if (!current || blockHasRules) {
        current = { agents: [], rules: [] };
        blocks.push(current);
        blockHasRules = false;
      }
      current.agents.push(value.toLowerCase());
    } else if ((key === "disallow" || key === "allow") && current) {
      current.rules.push({ path: value, allow: key === "allow" });
      blockHasRules = true;
    }
  }
  const byAgent = {};
  for (const block of blocks) {
    for (const agent of block.agents) {
      if (!byAgent[agent]) byAgent[agent] = { rules: [] };
      byAgent[agent].rules.push(...block.rules);
    }
  }
  return byAgent;
}

function pathAllowed(groups, uaName, urlPath) {
  const group = groups[uaName.toLowerCase()];
  if (!group) return null; // ingen regel för denna agent
  let best = null; // längsta matchande regel vinner
  for (const rule of group.rules) {
    if (rule.path === "") {
      // Disallow: (tomt) betyder tillåt allt
      if (!rule.allow && best === null) best = { allow: true, len: 0 };
      continue;
    }
    if (urlPath.startsWith(rule.path)) {
      if (!best || rule.path.length > best.len) {
        best = { allow: rule.allow, len: rule.path.length };
      }
    }
  }
  return best ? best.allow : null;
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

  // Kontrollera dels namngivna AI-crawlers (om sajten uttryckligen nekar dem bör vi
  // respektera det oavsett vår egen User-Agent), dels vår egen deklarerade UA, dels "*".
  for (const namngiven of ["claudebot", "gptbot", "ccbot"]) {
    const beslut = pathAllowed(groups, namngiven, parsed.pathname);
    if (beslut === false) return false;
  }
  const egenBeslut = pathAllowed(groups, "mangdrabattkalkylator/1.0", parsed.pathname);
  if (egenBeslut !== null) return egenBeslut;
  const wildcardBeslut = pathAllowed(groups, "*", parsed.pathname);
  if (wildcardBeslut !== null) return wildcardBeslut;
  return true; // ingen regel alls hittades
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
