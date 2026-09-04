# Mängdrabatt-kalkylator för stöldbrott

Ett lokalt körande verktyg som uppskattar det samlade straffvärdet vid flerfaldig
stöldbrottslighet enligt en förenklad, icke lagfäst modell av asperationsprincipen.

**Detta är ett uppskattningsverktyg, inte en förutsägelse av domstolens utfall.** Se
disclaimern i appen.

## Publicerad sajt

**Live:** https://lucas06tekin-jpg.github.io/mangdrabatt-kalkylator/

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

- **`docs/`** – hela den publicerade sajten: `index.html`, `style.css`, `app.js`,
  `calc.js` och `data/*.json` (straffskalor, referensdomar, förklarande källor). `calc.js`
  innehåller all ren beräkningslogik (inga DOM-anrop) så att den kan testas fristående;
  `app.js` importerar den och sköter formuläret/renderingen. Ren HTML/CSS/JS via ES-moduler,
  ingen byggprocess krävs för att visa sajten. Detta är mappen GitHub Pages pekas mot.
- **`backend/`** – ett Node-byggverktyg, inte en produktionsserver:
  - `src/straffskalor.js` – de fyra hårdkodade straffskalorna.
  - `src/scraper.js` – kontrollerar (respekterar robots.txt) att de manuellt verifierade
    käll-URL:erna i `seedSources.js` fortfarande svarar, och uppdaterar `cache.db`.
  - `src/exportStatic.js` / `build.js` – skriver cachens innehåll till `docs/data/*.json`.
  - `server.js` – enkel statisk förhandsgranskningsserver för `docs/` under utveckling.
  - `test/calc.test.js` – Node-tester mot `docs/calc.js` (körs med `npm test`).
- **`backend/cache.db`** (SQLite, Node:s inbyggda `node:sqlite`, gitignorad) – mellanlager
  mellan scraper och export; källan för `docs/data/*.json`.
- **`.github/workflows/refresh-cache.yml`** – schemalagd GitHub Action som testar och
  uppdaterar källcachen automatiskt (se "Automatisk källkontroll" nedan).

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

9 av upp till 10 eftersökta referensdomar hittades och kunde verifieras oberoende:
NJA 2008 s. 359, NJA 2016 s. 1143, RH 2015:26, RH 2006:49, NJA 2019 s. 951,
NJA 2025:67, RH 2021:17, NJA 2024:2 och NJA 2006 s. 524. Fyra av dem (NJA 2019 s. 951,
NJA 2025:67, RH 2021:17 och NJA 2024:2) är gränsdragningsmål eller enstaka brott snarare
än exempel på flerfaldighetsbedömning - varje referensdom har ett `flerfaldighetsexempel`-
fält i `seedSources.js` som styr detta, och det används för att rangordna listan (se
nedan). RH 2021:17 är trots det medvetet med eftersom det är det enda verifierbara
avgörandet om inbrottsstöld. NJA 2006 s. 524 är den ledande domen om hur en "snatteritur"
med både ringa stöld och stöld ska hanteras vid gemensam straffmätning. En riktad sökning
efter (a) ett flerfaldighetsavgörande om enbart ringa stöld, (b) ett avgörande som
tillämpar den nya kombinationsstraffregeln i 26 kap. 2 § BrB (i kraft sedan 1 aug 2026)
och (c) en renodlad multi-count "stöld"-dom utan komplicerande sidobrott gav inga
tillräckligt starka/verifierbara träffar – inget hittat än så länge, snarare än gissat
eller hittepå. En efterföljande riktad sökning efter fler grov stöld-avgöranden hittade
Falu tingsrätts dom i mål B 574-25 (juni 2026, en organiserad, regionöverskridande
härva för stöld av crossmotorcyklar/terränghjulingar - en annorlunda och färsk
brottsbild jämfört med de befintliga grov stöld-fallen) men den togs medvetet INTE med:
tingsrättsavgöranden publiceras inte i fulltext på samma sätt som hovrätts-/HD-referat
(bara ett pressmeddelande kunde verifieras) och saknar den vägledande, prejudicerande
tyngd som övriga nio referensdomar har. Ytterligare fall nämndes i sekundärkällor
(Lawline-artiklar) men kunde inte verifieras oberoende och togs medvetet inte med – se
kommentarerna i `seedSources.js`.

Referensdomspanelen i appen sorterar om sig live efter vilka brottstyper som fyllts i
kalkylatorn: domar vars `brottstyper` överlappar med de ifyllda rankas överst, med extra
vikt för domar som faktiskt är flerfaldighetsexempel (inte bara gränsdragningsmål) - se
`relevansPoang()` i `docs/calc.js`. Varje post i listan visar också en tydlig
"Flerfaldighetsexempel"- eller "Gränsdragning/enstaka brott"-tagg.

## Modellen (frontend, redigerbar)

- **Ren kumulation**: summan av alla inmatade straffvärden.
- **Halveringsmodell**: brott 1 = 100 %, brott 2 = 50 %, brott 3 = 25 % osv., med ett
  redigerbart golv per brott (default 3 %). Vikterna kan justeras fritt i appen.
- **Tak/golv enligt 26 kap. 2 § BrB**, i lydelsen efter SFS 2026:1318 (prop. 2025/26:218),
  i kraft sedan den 1 augusti 2026: taket är det svåraste maximistraffet bland de ingående
  brotten, dubblerat, men aldrig mer än summan av maximistraffen och aldrig mer än 18 år.
  Golvet är det allmänna golvet på 1 månad enligt 26 kap. 1 § BrB – den äldre regeln om att
  straffet inte fick underskrida det strängaste minimistraffet bland brotten avskaffades i
  samma reform. (Innan denna kontroll byggdes verifierades lagtexten mot den promulgerade
  SFS-texten, inte bara mot allmän kunskap om äldre rätt – se `backend/src/straffskalor.js`.)
- **Mängdrabatt**: skillnaden mellan ren kumulation och det tak/golv-justerade resultatet,
  i månader och procent.

## Övriga UI-funktioner

- **Inmatningen sparas lokalt** (`localStorage`, i din egen webbläsare - lämnar aldrig
  datorn) så att tillagda brott, golv och vikter finns kvar om sidan laddas om av misstag.
  "Rensa alla brott"-knappen nollställer både vyn och det sparade läget.
- **Lagtext** för varje straffskala kan fällas ut ("Visa lagtext") under "Fasta juridiska
  fakta", för den som vill se den fullständiga paragraftexten utan att lämna sidan.

## Testa

```bash
cd backend
npm test
```

Kör Node:s inbyggda testrunner mot `docs/calc.js` - den rena beräkningslogiken (halverings-
modellen, tak/golv enligt 26 kap. 2 § BrB, relevansrankningen av referensdomar) utan någon
webbläsare inblandad. Testerna innehåller bl.a. ett regressionstest för det ursprungliga
felet där gränsdragningsmål rankades lika högt som faktiska flerfaldighetsexempel.

## Automatisk källkontroll

`.github/workflows/refresh-cache.yml` kör `npm test` + `npm run build` i backend/ varje
måndag (och kan triggas manuellt via GitHub-fliken "Actions" → "Uppdatera källcache" →
"Run workflow"). Om något ändrats i `docs/data/*.json` (t.ex. att en källa blivit
otillgänglig) committas och pushas det automatiskt, med tester som en gate innan det
sker. Detta uppdaterar bara tillgänglighetsstatusen på redan verifierade källor - att
lägga till nya referensdomar kräver fortsatt manuell research och en redigering av
`backend/src/seedSources.js`.
