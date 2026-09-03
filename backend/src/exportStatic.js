// Exporterar cachens innehåll (SQLite) och de hårdkodade straffskalorna till statiska
// JSON-filer under docs/data/. GitHub Pages kan bara servera statiska filer - den här
// exporten gör att docs/ kan publiceras direkt utan någon live-server.
//
// Kör `npm run build` (scraper + denna export) innan du pushar en uppdatering till GitHub.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getDb, fetchAll } from "./db.js";
import { STRAFFSKALOR, TAK_ALLMANT_MANADER } from "./straffskalor.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "..", "docs", "data");

export function exportStatic() {
  getDb();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  fs.writeFileSync(
    path.join(OUT_DIR, "straffskalor.json"),
    JSON.stringify({ straffskalor: STRAFFSKALOR, tak_allmant_manader: TAK_ALLMANT_MANADER }, null, 2)
  );

  const referensdomar = fetchAll("referensdomar");
  fs.writeFileSync(
    path.join(OUT_DIR, "referensdomar.json"),
    JSON.stringify({ referensdomar, antal: referensdomar.length }, null, 2)
  );

  const forklarandeKallor = fetchAll("forklarande_kallor");
  fs.writeFileSync(
    path.join(OUT_DIR, "forklarande-kallor.json"),
    JSON.stringify({ forklarande_kallor: forklarandeKallor }, null, 2)
  );

  return { outDir: OUT_DIR, referensdomar: referensdomar.length, forklarandeKallor: forklarandeKallor.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const resultat = exportStatic();
  console.log(JSON.stringify(resultat, null, 2));
}
