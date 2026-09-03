# Mängdrabatt-kalkylator för stöldbrott

Ett lokalt körande verktyg som uppskattar det samlade straffvärdet vid flerfaldig
stöldbrottslighet enligt en förenklad, icke lagfäst modell av asperationsprincipen.

**Detta är ett uppskattningsverktyg, inte en förutsägelse av domstolens utfall.** Se
disclaimern i appen.

## Publicerad sajt

Appen är byggd som en **statisk sajt** i `docs/` så att den kan publiceras gratis via
GitHub Pages – se "Publicera på GitHub Pages" nedan. Ingen server behövs för att visa
appen för någon annan; all beräkning sker i webbläsaren.

## Köra/utveckla lokalt

Kräver bara [Node.js](https://nodejs.org/) 22 eller senare (inget Python behövs). Node
används bara som byggverktyg (uppdatera källcachen + exportera JSON) och för en enkel
lokal förhandsgranskningsserver – inte för att driva den publicerade sajten.

```bash
cd backend
npm install
npm run build   # kontrollerar källorna och skriver om docs/data/*.json
npm start        # förhandsgranska på http://localhost:8000
```

Kör `npm run build` igen (och committa/pusha resultatet) varje gång du vill uppdatera
referensdomarna eller de förklarande källorna på den publicerade sajten – GitHub Pages
har inget eget byggsteg, den serverar bara det som ligger i `docs/`.

## Arkitektur

- **`docs/`** – hela den publicerade sajten: `index.html`, `style.css`, `app.js` och
  `data/*.json` (straffskalor, referensdomar, förklarande källor). Ren HTML/CSS/JS, ingen
  byggprocess krävs för att visa den. Detta är mappen GitHub Pages pekas mot.
- **`backend/`** – ett Node-byggverktyg, inte en produktionsserver:
  - `src/straffskalor.js` – de fyra hårdkodade straffskalorna.
  - `src/scraper.js` – kontrollerar (respekterar robots.txt) att de manuellt verifierade
    käll-URL:erna i `seedSources.js` fortfarande svarar, och uppdaterar `cache.db`.
  - `src/exportStatic.js` / `build.js` – skriver cachens innehåll till `docs/data/*.json`.
  - `server.js` – enkel statisk förhandsgranskningsserver för `docs/` under utveckling.
- **`backend/cache.db`** (SQLite, Node:s inbyggda `node:sqlite`, gitignorad) – mellanlager
  mellan scraper och export; källan för `docs/data/*.json`.

## Publicera på GitHub Pages

1. Skapa ett nytt (publikt) repo på GitHub, t.ex. `mangdrabatt-kalkylator` – inget behöver
   bockas i (README/gitignore/licens), det finns redan lokalt.
2. Koppla och pusha det lokala repot (kör i projektmappen):
   ```bash
   git remote add origin https://github.com/<ditt-anvandarnamn>/<repo-namn>.git
   git push -u origin main
   ```
3. På GitHub: Settings → Pages → under "Build and deployment", välj Source: "Deploy from
   a branch", Branch: `main` och mapp `/docs` → Save.
4. Efter någon minut är sajten live på `https://<ditt-anvandarnamn>.github.io/<repo-namn>/`
   – den länken kan du skicka till advokaten.
5. När du vill publicera en uppdatering: gör dina ändringar, kör vid behov
   `npm run build` i `backend/` (om referensdomar/källor ska uppdateras), och:
   ```bash
   git add -A
   git commit -m "Uppdatering"
   git push
   ```
   GitHub Pages hämtar automatiskt den nya versionen inom någon minut.

**Obs:** Pages på gratis GitHub-konton kräver ett publikt repo – koden och de
egenformulerade domsammanfattningarna blir då synliga för alla med länken (inga
personuppgifter eller fulltexter av domar lagras, se nästa avsnitt).

### Viktigt om källhanteringen

`backend/src/seedSources.js` innehåller **manuellt verifierade** poster – varje
referensdom har lästs i sin faktiska domtext (via lagen.nu) eller ett officiellt
pressmeddelande (domstol.se) innan den lades till. `backend/src/scraper.js` är alltså
**ingen fritt sökande crawler**; den kontrollerar bara periodiskt att de redan
verifierade URL:erna fortfarande svarar, och sparar aldrig hela källtexter – bara de
korta, egenformulerade sammanfattningarna som redan finns i seed-listan.

**Lawline-källorna (kategori B) auto-uppdateras aldrig.** Vid research inför den här
appen visade det sig att `lawline.se/robots.txt` uttryckligen nekar `ClaudeBot` (även om
`User-agent: *` annars tillåter allt). Scraper.js har därför en hårdkodad spärr som
aldrig hämtar från lawline.se automatiskt, oavsett vilken User-Agent-sträng den själv
skickar. De fyra Lawline-artiklarna i appen är istället manuellt granskade en gång
(2026-09-03) och måste verifieras på nytt av en människa om de behöver uppdateras.

`lagen.nu` och `domstol.se`, som båda är öppna för automatiserad hämtning enligt sina
robots.txt-filer, kontrolleras om vid varje cacheuppdatering (med 2 sekunders fördröjning
mellan varje anrop och en tydlig kontakt-UA).

### Referensdomar som hittades (kategori A)

6 av upp till 10 eftersökta referensdomar hittades och kunde verifieras oberoende:
NJA 2008 s. 359, NJA 2016 s. 1143, RH 2015:26, RH 2006:49, NJA 2019 s. 951 och
NJA 2025:67. De två sistnämnda är gränsdragningsmål (ringa stöld/stöld-tröskeln) snarare
än exempel på flerfaldighetsbedömning, vilket framgår tydligt i appens UI. Ytterligare
fall nämndes i sekundärkällor (en Lawline-artikel) men kunde inte verifieras oberoende
och togs medvetet inte med – se kommentarerna i `seedSources.js`.

## Modellen (frontend, redigerbar)

- **Ren kumulation**: summan av alla inmatade straffvärden.
- **Halveringsmodell**: brott 1 = 100 %, brott 2 = 50 %, brott 3 = 25 % osv., med ett
  redigerbart golv per brott (default 3 %). Vikterna kan justeras fritt i appen.
- **Tak/golv enligt 26 kap. 2 § BrB**: golvet är det strängaste minimistraffet bland de
  ingående brotten; taket är det svåraste maximistraffet plus ett tillägg (1/2/4 år
  beroende på hur strängt det svåraste straffet är), men aldrig mer än summan av
  maximistraffen och aldrig mer än 18 år.
- **Mängdrabatt**: skillnaden mellan ren kumulation och det tak/golv-justerade resultatet,
  i månader och procent.
