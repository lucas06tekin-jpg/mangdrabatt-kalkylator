// Ren robots.txt-parsning och åtkomstbeslut - inga nätverksanrop här, så logiken kan
// testas utan att mocka fetch (se backend/test/robots.test.js). scraper.js sköter själva
// hämtningen av robots.txt-filen och cachningen av resultatet.

export function parseRobots(text) {
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

export function pathAllowed(groups, uaName, urlPath) {
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

// Prioritetsordning: namngivna agenter (t.ex. AI-crawlers) som uttryckligen nekas ska
// respekteras oavsett vår egen deklarerade User-Agent - det var precis så vi upptäckte att
// lawline.se nekar "ClaudeBot" trots att User-agent: * annars tillåter allt. Därefter vår
// egen UA om den nämns explicit, annars wildcard-regeln, annars tillåtet som standard.
export function beslutaOmAtkomst(groups, urlPath, { namngivnaAgenter = [], egenUA } = {}) {
  for (const namngiven of namngivnaAgenter) {
    if (pathAllowed(groups, namngiven, urlPath) === false) return false;
  }
  if (egenUA) {
    const egenBeslut = pathAllowed(groups, egenUA, urlPath);
    if (egenBeslut !== null) return egenBeslut;
  }
  const wildcardBeslut = pathAllowed(groups, "*", urlPath);
  if (wildcardBeslut !== null) return wildcardBeslut;
  return true; // ingen regel alls hittades
}
