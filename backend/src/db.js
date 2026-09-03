import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DB_PATH = path.join(__dirname, "..", "cache.db");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS referensdomar (
    id TEXT PRIMARY KEY,
    kalla TEXT NOT NULL,
    kalla_url TEXT NOT NULL,
    domstol TEXT,
    brott_sammanfattning TEXT NOT NULL,
    straffvarde_text TEXT,
    brottstyper TEXT NOT NULL DEFAULT '[]',
    verifieringsstatus TEXT NOT NULL,
    senast_kontrollerad TEXT,
    tillganglig INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS forklarande_kallor (
    id TEXT PRIMARY KEY,
    kalla TEXT NOT NULL,
    titel TEXT NOT NULL,
    kalla_url TEXT NOT NULL,
    sammanfattning TEXT NOT NULL,
    senast_kontrollerad TEXT,
    tillganglig INTEGER NOT NULL DEFAULT 1,
    auto_uppdateras INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS kallstatus (
    kalla TEXT PRIMARY KEY,
    kategori TEXT NOT NULL,
    robots_tillater INTEGER,
    senast_forsokt TEXT,
    status TEXT,
    meddelande TEXT
);
`;

let _db = null;

export function getDb() {
  if (!_db) {
    _db = new DatabaseSync(DB_PATH);
    _db.exec(SCHEMA);
  }
  return _db;
}

export function upsertReferensdom(row) {
  const db = getDb();
  db.prepare(
    `INSERT INTO referensdomar
       (id, kalla, kalla_url, domstol, brott_sammanfattning, straffvarde_text,
        brottstyper, verifieringsstatus, senast_kontrollerad, tillganglig)
     VALUES (@id, @kalla, @kalla_url, @domstol, @brott_sammanfattning, @straffvarde_text,
             @brottstyper, @verifieringsstatus, @senast_kontrollerad, @tillganglig)
     ON CONFLICT(id) DO UPDATE SET
       kalla=excluded.kalla, kalla_url=excluded.kalla_url, domstol=excluded.domstol,
       brott_sammanfattning=excluded.brott_sammanfattning, straffvarde_text=excluded.straffvarde_text,
       brottstyper=excluded.brottstyper,
       verifieringsstatus=excluded.verifieringsstatus, senast_kontrollerad=excluded.senast_kontrollerad,
       tillganglig=excluded.tillganglig`
  ).run(row);
}

export function upsertForklarandeKalla(row) {
  const db = getDb();
  db.prepare(
    `INSERT INTO forklarande_kallor
       (id, kalla, titel, kalla_url, sammanfattning, senast_kontrollerad, tillganglig, auto_uppdateras)
     VALUES (@id, @kalla, @titel, @kalla_url, @sammanfattning, @senast_kontrollerad, @tillganglig, @auto_uppdateras)
     ON CONFLICT(id) DO UPDATE SET
       kalla=excluded.kalla, titel=excluded.titel, kalla_url=excluded.kalla_url,
       sammanfattning=excluded.sammanfattning, senast_kontrollerad=excluded.senast_kontrollerad,
       tillganglig=excluded.tillganglig, auto_uppdateras=excluded.auto_uppdateras`
  ).run(row);
}

export function upsertKallstatus(row) {
  const db = getDb();
  db.prepare(
    `INSERT INTO kallstatus (kalla, kategori, robots_tillater, senast_forsokt, status, meddelande)
     VALUES (@kalla, @kategori, @robots_tillater, @senast_forsokt, @status, @meddelande)
     ON CONFLICT(kalla) DO UPDATE SET
       kategori=excluded.kategori, robots_tillater=excluded.robots_tillater,
       senast_forsokt=excluded.senast_forsokt, status=excluded.status, meddelande=excluded.meddelande`
  ).run(row);
}

export function fetchAll(table) {
  const db = getDb();
  return db.prepare(`SELECT * FROM ${table}`).all();
}

export function countRows(table) {
  const db = getDb();
  return db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get().n;
}
