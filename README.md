# Mängdrabatt-kalkylator för förmögenhetsbrott

Ett lokalt körande verktyg som uppskattar det samlade straffvärdet vid flerfaldig
förmögenhetsbrottslighet (för närvarande stöld, bedrägeri och häleri) enligt en
förenklad, icke lagfäst modell av asperationsprincipen.

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
  - `src/straffskalor.js` – de hårdkodade straffskalorna, en per brottstyp, grupperade per
    brottsfamilj (`familj`-fältet) som styr grupperingen i appens brottstyp-dropdown.
  - `src/robots.js` – ren robots.txt-parsning och åtkomstbeslut (inga nätverksanrop),
    utbruten just för att kunna testas fristående - se `test/robots.test.js`.
  - `src/scraper.js` – kontrollerar (respekterar robots.txt via `robots.js`) att de manuellt
    verifierade käll-URL:erna i `seedSources.js` fortfarande svarar, och uppdaterar `cache.db`.
  - `src/exportStatic.js` / `build.js` – skriver cachens innehåll till `docs/data/*.json`.
  - `server.js` – enkel statisk förhandsgranskningsserver för `docs/` under utveckling.
  - `test/calc.test.js` – Node-tester mot `docs/calc.js` (körs med `npm test`).
  - `test/robots.test.js` – Node-tester mot `src/robots.js`, med fixturer byggda på de
    riktiga robots.txt-filerna för lawline.se, domstol.se och lagen.nu som lästes av under
    research. Innehåller ett regressionstest för just upptäckten att lawline.se nekar
    "ClaudeBot" trots att `User-agent: *` annars tillåter allt.
  - `test/seedSources.test.js` – dataintegritetstester: att varje `brottstyper`-id i en
    referensdom faktiskt finns i `straffskalor.js`, att inga id:n dubbleras, att varje
    straffskala har ett `familj`-fält. Skriven efter en genomgång inför utökningen till
    bedrägeri, för att fånga felstavningar/dubbletter automatiskt när fler brottstyper
    läggs till - annars upptäcks de bara om man råkar leta efter dem för hand.
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
skickar - och en lawline.se-post märks aldrig "otillgänglig" bara för att den inte
kontrolleras (det vore att blanda ihop "vi frågar inte" med "sidan är nere"). Fyra av de
nio Lawline-posterna är manuellt granskade i sin helhet (2026-09-03); fem tillkom senare
via sökmotorutdrag utan att sidan öppnats (lawline.se går inte att fritt fram och tillbaka
till för verifiering på samma sätt) - dessa är tydligt märkta "Endast sökmotorutdrag, ej
öppnad" i UI:t, till skillnad från "Fulltext läst" för övriga källor. Två artiklar i
Svensk Juristtidning (Jareborg 1999, Sunnqvist 2011) och en nyhet från Åklagarmyndigheten
om värdegränsen för ringa stöld är fulltextlästa och auto-uppdateras precis som
referensdomarna, eftersom svjt.se och aklagare.se båda tillåter allmän automatiserad
hämtning enligt sina robots.txt-filer (verifierat 2026-09-04).

### Kommande reform - läs innan du litar för mycket på halveringsmodellen

Riksdagen godkände den 13 augusti 2026 en ny påföljdsreform (prop. 2025/26:297, bet.
2025/26:JuU48) som avskaffar mängdrabatt/asperationsprincipen i nuvarande form och
ersätter den med en modell där varje brotts fulla straffvärde räknas samman och en
proportionalitetsjustering görs i ett sista steg - en helt annan mekanik än denna
kalkylators halveringsmodell. Lagen är **antagen men ännu inte i kraft**: regeringen
bestämmer själv ikraftträdandedatum, uttryckligen kopplat till Kriminalvårdens kapacitet
att ta emot fler intagna. Detta visas som en notis i appens "Fasta juridiska fakta"-panel.
Två artiklar av Nils Jareborg (SvJT 1999 s. 264) och Martin Sunnqvist (SvJT 2011 s. 495)
ger djupare, icke-numerisk bakgrund till varför asperationsprincipen ser ut som den gör
och varför en exakt matematisk formel (som denna kalkylators halveringsmodell) aldrig
har varit den rättsligt vedertagna metoden - se `backend/src/seedSources.js`.

**Viktig lärdom från denna research:** en första sökning misstolkade omröstningsresultatet
för prop. 2025/26:297 (en AI-genererad sökresultatsammanfattning påstod felaktigt att
riksdagen avslagit förslaget). Detta motbevisades genom att direkt läsa riksdagens egen
ärendesida och betänkandet - en påminnelse om att alltid verifiera mot primärkällan när
en sekundär sammanfattning gör ett påstående som skulle vara viktigt om det stämde.

**Andelsmodellen (SOU 2023:1) är inte heller lag** - varken idag eller i den kommande
reformen ovan. Den beskrivs i utredningen som redan etablerad domstolspraxis (inte ett
lagförslag), men SFS 2026:1318:s ändringar av 26 kap. gäller bara taket och golvet
(2 § och 1 §) - 29 kap. 1 § om straffvärdesbedömning ändrades inte i den reformen. Den
finns i kalkylatorn som ett andra, väljarbart alternativ för jämförelse, inte som ersättare
för halveringsmodellen.

`lagen.nu` och `domstol.se`, som båda är öppna för automatiserad hämtning enligt sina
robots.txt-filer, kontrolleras om vid varje cacheuppdatering (med 2 sekunders fördröjning
mellan varje anrop och en tydlig kontakt-UA).

### Referensdomar som hittades (kategori A)

10 av 10 eftersökta referensdomar hittades och kunde verifieras oberoende:
NJA 2008 s. 359, NJA 2016 s. 1143, RH 2015:26, RH 2006:49, NJA 2019 s. 951,
NJA 2025:67, RH 2021:17, NJA 2024:2, NJA 2006 s. 524 och RH 1998:101. Fyra av dem
(NJA 2019 s. 951, NJA 2025:67, RH 2021:17 och NJA 2024:2) är gränsdragningsmål eller
enstaka brott snarare än exempel på flerfaldighetsbedömning - varje referensdom har ett
`flerfaldighetsexempel`-fält i `seedSources.js` som styr detta, och det används för att
rangordna listan (se nedan). RH 2021:17 är trots det medvetet med eftersom det är det
enda verifierbara avgörandet om inbrottsstöld. NJA 2006 s. 524 är den ledande domen om
hur en "snatteritur" med både ringa stöld och stöld ska hanteras vid gemensam
straffmätning. RH 1998:101 fyller luckan för en renodlad flerfaldig "stöld"-dom utan
komplicerande sidobrott (en "stöldrajd" i ett köpcentrum) - men är från 1998 och gav en
icke-fängelsepåföljd (villkorlig dom + dagsböter), så den saknar en fängelsemånader-siffra
att jämföra mot; medtagen ändå för sitt renodlade brottsmönster, tydligt flaggad i sin
sammanfattning. En riktad sökning efter (a) ett flerfaldighetsavgörande om enbart ringa
stöld, (b) ett avgörande som tillämpar den nya kombinationsstraffregeln i 26 kap. 2 § BrB
(i kraft sedan 1 aug 2026) och (c) en multi-count inbrottsstöld-dom gav inga tillräckligt
starka/verifierbara träffar – inget hittat än så länge, snarare än gissat eller hittepå.
En tidigare riktad sökning efter fler grov stöld-avgöranden hittade
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

### Utökning till bedrägeri

Appen täcker sedan 2026-09-05 även bedrägeribrott, med samma tre nivåer som stöld:
**ringa bedrägeri** (9 kap. 2 § BrB, 0-6 mån), **bedrägeri** (9 kap. 1 § BrB, 0-24 mån)
och **grovt bedrägeri** (9 kap. 3 § BrB, 12-72 mån - höjt golv från och med SFS 2026:1318,
samma reform som höjde golvet för grov stöld). Tre nya referensdomar tillkom:

- **NJA 2021 s. 970** - HD, 11 fall av grovt bedrägeri medelst urkundsförfalskning,
  gemensamt straffvärde satt till 2 år (obs: enligt den äldre, lägre straffskalan för
  grovt bedrägeri som gällde innan 2026 års reform).
- **RH 1993:201** - Svea hovrätt, en blandad förmögenhetsbrottsserie (bedrägeri, grovt
  bedrägeri, häleri, förskingring) - äldre avgörande (1993) men fulltextverifierat.
- **Svea hovrätt B 8808-25** - telefon-/sms-bedrägerier mot äldre ("vishing"), ca 70
  brottstillfällen, verifierat via domstol.se:s pressmeddelande.

Även **NJA 2016 s. 1143** (redan i databasen för stöld) omtaggades med `bedrageri`,
eftersom dess 26 bedrägerifall bekräftat åtalades och dömdes enligt 9 kap. 1 § BrB
(ordinarie bedrägeri, inte grovt - obestritt i målet).

Tre ytterligare, sakligt intressanta fall (organiserade åldringsbedrägerier med
inbrottsstöld-koppling, en investeringsbedrägeri-härva, en föreningskapningshärva - alla
2025-2026) hittades men togs medvetet INTE med: samtliga är tingsrättsavgöranden utan
publicerad fulltextdom, samma skäl som uteslöt Falu tingsrätts mopedhärva för grov stöld.

### Utökning till häleri

Appen täcker sedan 2026-09-06 även häleribrott, återigen tre nivåer: **häleriförseelse**
(9 kap. 7 § BrB, 0-6 mån), **häleri** (9 kap. 6 § BrB, 0-24 mån) och **grovt häleri**
(9 kap. 6 § tredje stycket BrB, 12-72 mån - höjt golv från SFS 2026:1318, samma reform
som höjde golvet för grov stöld och grovt bedrägeri). Titeln bytte samtidigt namn till den
vedertagna juridiska samlingsbeteckningen "förmögenhetsbrott" i stället för att räkna upp
varje brottsnamn för sig - skalar bättre när fler brottsfamiljer läggs till.

En ny referensdom tillkom:

- **RH 2021:25** - Göta hovrätt, ett genuint flerfaldighetsfall: stöldgods anträffat hos
  en man vid fyra separata tillfällen/platser, ursprungligen dömt som tre fall av grovt
  häleri + ett häleri + en stöld i tingsrätten. Hovrätten prövade brottsenhetsfrågan
  (hur många separata häleribrott det blir när gods dyker upp vid flera tillfällen) och
  satte ned samtliga häleriräkningar till ordinarie grad. Slutresultat: 4 fall häleri +
  1 stöld, gemensamt straffvärde fängelse 10 månader.

Även **RH 1993:201** (redan i databasen för bedrägeri) omtaggades med `haleri`, eftersom
en av dess tio åtalspunkter uttryckligen är ett häleribrott - upptäckt vid en genomgång
inför häleriutökningen, inte av research-agenten som letade efter nya fall.

Flera lovande fall (en "hälericentral" för elcyklar, häleriverksamhet med byggverktyg via
Blocket, en båtdelshärva) nämndes i nyhetsartiklar men kunde INTE verifieras - inget
mål-nummer eller domstolsnamn gick att hitta för att spåra upp den faktiska domen, så de
togs inte med.

### Utökning till rån

Appen täcker sedan 2026-09-08 även rån, två nivåer: **rån** (8 kap. 5 § BrB, 18-72 mån)
och **grovt rån** (8 kap. 6 § BrB, 60-120 mån). Till skillnad från de tre tidigare
brottsfamiljerna innehåller rånparagrafen ett eget gränsdragningsstycke (8 kap. 5 §
fjärde stycket): är gärningen "av mindre allvarlig art" döms inte för rån utan för annat
brott (t.ex. grov stöld) - direkt illustrerat av **NJA 2025:12** ("Jackan") nedan. Grovt
råns minimistraff höjdes från 4 till 5 år 2017-07-01 (prop. 2016/17:108); rån av
normalgraden lämnades då uttryckligen oförändrat - se doktrinkällan nedan.

Tre nya referensdomar tillkom:

- **NJA 1994 s. 732** - Högsta domstolen underkände hovrättens grova rubricering (attrapper
  användes, inget fysiskt våld) och fastslog att en tillräckligt kraftfull reaktion kan
  beslutas inom straffskalan för rån av normalgraden. Två tilltalade, vardera dömda för
  TVÅ fall av rån - ett genuint flerfaldighetsexempel, om än från 1994 (innan 2017 års
  minimistraffhöjning för grovt rån, som inte är relevant här eftersom fallet stannade
  vid normalgraden).
- **RH 2006:31** - Svea hovrätt fördubblade tingsrättens straff till fängelse 6 år för
  rån vid 13 tillfällen, försök till rån vid 2 tillfällen och häleri - systematiska
  väpnade rån mot ensamarbetande butikspersonal. Ett av de tydligaste
  flerfaldighetsexemplen i hela databasen (13 räknade brottstillfällen).
- **NJA 2025:12** ("Jackan") - gränsdragningsmål, inte flerfaldighet: en 18-åring hotade
  en 14-åring för en jacka. HD tillämpade 8 kap. 5 § fjärde stycket och omklassificerade
  gärningen till grov stöld eftersom den var "av mindre allvarlig art" (inget våld,
  verbalt hot). Viktig varning-exempel: uppfyller de formella rånrekvisiten men blir ändå
  inte rån.

**Grovt rån hade efter denna sökning fortfarande noll referensdomar** - varje genuint
grovt rån-fall som hittades var antingen ett gränsdragningsmål mot en helt annan
rättsmekanism (34 kap. 2 § BrB om nyupptäckt brott/EU-rambeslut, t.ex. NJA 2022 s. 227 och
NJA 2009 s. 485 - avsiktligt INTE medtagna eftersom de skulle vilseleda om vilken paragraf
som faktiskt tillämpas) eller för svårverifierade för att fulltextläsas. I stället täcks
grovt rån av doktrin: **Prop. 2016/17:108** ("Straffskalorna för vissa allvarliga
våldsbrott") - förarbetet till minimistraffhöjningen, som också förklarar varför rån av
normalgraden medvetet lämnades oförändrat.

### Förskingring - tillagd och sedan borttagen (2026-09-08)

Förskingring/ringa förskingring/grov förskingring lades till 2026-09-08 men togs bort
samma dag efter en genomgång av vilka brott som faktiskt passar en
mängdrabatt-kalkylator. Anledningen är strukturell, inte att researchen var dålig: de två
referensdomar som hittades för grov förskingring - **NJA 1992 s. 470** (systematisk
förskingring september 1986-december 1990, minst 200 000 kr) och **RH 1996:42**
(351 tillfällen under 1989-1994, minst 400 000 kr) - visade BÅDA att domstolarna
behandlar upprepad förskingring från samma huvudman som **ETT sammanhållet brott
(brottsenhet)**, inte som flera separata brott som läggs samman via 26 kap. 2 §.
Mängdrabatt-mekanismen som hela den här kalkylatorn bygger på blir alltså sällan aktuell
för just detta brott i praktiken - ett dåligt konceptuellt fit, inte bara en tunn källa.

### Utökning till utpressning

Appen täcker sedan 2026-09-08 även utpressning, tre nivåer: **ringa utpressning**
(9 kap. 4 § första stycket BrB, 0-6 mån), **utpressning** (samma paragraf, 0-36 mån) och
**grov utpressning** (9 kap. 4 § andra stycket BrB, 24-96 mån). Straffskalorna höjdes
2023-07-01 av SFS 2023:257 (prop. 2022/23:53, "Skärpta straff för brott i kriminella
nätverk") - utpressning från högst 2 till högst 3 år, grov utpressning från 1-6 år till
2-8 år. Notera att detta INTE är samma reform som SFS 2026:1318 (som höjde golven för
grov stöld/grovt bedrägeri/grovt häleri) - ännu en påminnelse om att varje brottstyps
ändringshistorik måste verifieras för sig, inte antas följa samma mönster.

Två nya referensdomar:

- **NJA 2009 s. 300** - ett genuint flerfaldighetsexempel: grov utpressning och försök
  till grov utpressning vid FLERA tillfällen 2003-2007 mot ett stort antal målsägande.
  Hovrätten tillämpade principen att annars icke-grova gärningar kan bli grova när de
  "ingår i en serie av brott som genomgående präglas av samma planmässighet och
  systematik". Straffvärde: hovrätten 4 år 6 månader, HD ca 6 år 6 månader för den samlade
  brottsligheten. OBS: dömt 2009, före 2023 års straffskärpning - straffvärdet skulle
  sannolikt bedömas högre idag.
- **RH 2018:44** - gränsdragningsmål, inte flerfaldighet: försök till utpressning vid ETT
  tillfälle, om en fordran på svart lön är en giltig grund för förmögenhetsöverföring.

### Utökning till ocker, olovligt förfogande och trolöshet mot huvudman

Appen täcker sedan 2026-09-08 även dessa tre brottsfamiljer, alla med normalgrad + grov
grad (ingen ringa-nivå finns i lagen för någon av dem):

- **Ocker** (9 kap. 5 § BrB, 0-24 mån) och **grovt ocker** (samma paragraf, 12-72 mån -
  golvet höjt 6 mån → 1 år av SFS 2026:1318, samma reform som grov stöld/grovt
  bedrägeri/grovt häleri).
- **Olovligt förfogande** (10 kap. 4 § första stycket BrB, 0-12 mån) och **grovt olovligt
  förfogande** (andra stycket, 6-48 mån). Grovgraden är en HELT NY brottsrubricering,
  införd 2017-07-01 av SFS 2017:442 - samma proposition (2016/17:131) som redan fanns i
  databasen för grovt bedrägeri ("...och andra förmögenhetsbrott" i titeln syftade
  bokstavligen på detta). Normalgradens maxstraff SÄNKTES samtidigt från 2 år till 1 år,
  för att harmonisera med den nya gradindelningen - inte SFS 2026:1318.
- **Trolöshet mot huvudman** (10 kap. 5 § första stycket BrB, 0-24 mån) och **grov
  trolöshet mot huvudman** (andra stycket, 12-72 mån - golvet höjt av SFS 2026:1318,
  samma mönster som ovan).

**RH 2019:16 är det tydligaste flerfaldighetsexemplet i hela databasen**, och ett
värdefullt MOTEXEMPEL till förskingringsfallens brottsenhets-mönster: en person genomförde
19 separata överföringar (sammanlagt ca 26,45 miljoner kr) och hovrätten slog uttryckligen
fast att "var och en av de ... gjorda 19 överföringarna utgör ett fullbordat brott vilket
får till följd att det rör sig om flerfaldig brottslighet" - alltså 19 räknade brott, inte
ett sammanhållet. Straffvärde: 2 år 6 månader; utdömd påföljd 9 månader efter kraftig
reduktion för medverkan i utredningen. Dömt enligt paragrafens lydelse före 1 juli 2016,
men grundstrukturen är oförändrad.

**Ingen referensdom hittades för ocker vid det här tillfället.** Den enda ordentligt
belysta moderna NJA-domen (NJA 2013 s. 1130) slutade i ett FRIKÄNNANDE - HD fastställde
hovrättens frikännande, och det enda konkreta straffvärdet (motsvarande fängelse ett år)
nämndes bara av två skiljaktiga justitieråd i minoritet. Att presentera den domen som ett
exempel på ockers straffvärde hade varit missvisande, så den uteslöts medvetet - ocker
täcktes i stället bara av en Lawline-doktrinkälla (se nedan för RH 2005:6, som senare
fyllde luckan för grovt ocker). Motsvarande gäller för olovligt förfogande: inget
genomsökt fall gav en ren, tydlig referensdom (ett kandidatfall, NJA 1986 s. 350, ledde
faktiskt till en dom för BEDRÄGERI, inte olovligt förfogande, och hade gett fel bild av
vilket brott som faktiskt tillämpades - samma typ av "fel mekanism"-misstag som uteslöts
för rån och utpressning ovan). Båda täcks av Prop. 2016/17:131/SFS 2017:442 som
doktrinkälla i stället; olovligt förfogande saknar fortfarande en referensdom.

### Tillgrepp av fortskaffningsmedel - tillagd och sedan borttagen (2026-09-08)

Tillgrepp av fortskaffningsmedel (alla tre graderna) lades till 2026-09-08 men togs
bort samma dag, av samma anledning som förskingring ovan: ingen flerfaldighetsdom
hittades trots flera riktade sökningar. Brottet verkade i stället oftare förekomma vid
ETT tillfälle i kombination med andra brott (rattfylleri, olovlig körning, stöldförsök)
snarare än upprepat i samma mål - de två HD-avgöranden som hittades (NJA 2021 s. 1102
och NJA 1984 s. 751) var båda gränsdragningsmål om gradindelning, inte
flerfaldighetsexempel. Svagare bevisning än förskingrings brottsenhets-fynd (ingen
uttrycklig doktrin mot flerfaldighet, bara frånvaro av träffar), men samma riktning:
mängdrabatt-mekanismen verkar sällan bli den centrala frågan för detta brott.

### Utökning bortom förmögenhetsbrott: misshandel, olaga hot, narkotikabrott

**Beslut om appens omfattning (2026-09-08):** användaren specialiserar sig mot
brottmål/försvarsadvokatarbete och bad uttryckligen om brottstyper utanför
förmögenhetsbrott där flerfaldighet är vanligt i praktiken - men appens NAMN, titel och
"förmögenhetsbrottslighet"-inramning i `index.html` ska INTE ändras. Lösningen: nya
brottstyper läggs till i brottstyp-dropdownen och "Fasta juridiska fakta"-panelen
(som redan räknar upp varje brottstyp med sin egen paragraf, oavsett kategori) utan att
röra rubrik/titel-texten - den blir bara delvis missvisande om exakt vilka
brottskategorier som täcks, men det är ett medvetet vägval, inte ett förbiseende.

Tre nya brottsfamiljer, samtliga med genuina flerfaldighetsexempel:

- **Misshandel** (3 kap. 5-6 § BrB): ringa (0-6 mån), normalgrad (0-24 mån), grov
  (18-84 mån - höjt av SFS 2026:1318, samma reform som de sex "grovt X"-förmögenhetsbrotten)
  och synnerligen grov (72-144 mån, samma reform).
- **Olaga hot** (4 kap. 5 § BrB): normalgrad (0-24 mån) och grovt (12-48 mån - höjt
  2023-07-01 av SFS 2023:257, SAMMA reform som höjde grov utpressning).
- **Narkotikabrott** (narkotikastrafflagen 1968:64, INTE brottsbalken): ringa (0-6 mån),
  normalgrad (0-36 mån - notera att försäljningsrelaterade gärningar enligt 1 § andra/
  tredje styckena har ett eget golv på 6 månader som denna förenklade modell inte särskiljer),
  grovt (24-84 mån) och synnerligen grovt (72-120 mån). Golvhöjningen för försäljning
  (SFS 2023:258) kommer från SAMMA lagstiftningspaket som SFS 2023:257 ovan.

**De starkaste flerfaldighetsexemplen i hela databasen hittades i denna omgång:**

- **NJA 2020 s. 564** ("Den utdragna misshandeln") - ett flerfaldighetsexempel som
  spänner över TRE brottsfamiljer samtidigt: synnerligen grov misshandel (en utdragen
  gärning), misshandel vid tre separata tillfällen, samt ringa narkotikabrott.
  Straffvärde: strax under 5 år 6 månader; HD skärpte till fängelse 6 år.
- **HD B 8157-25** ("Upprepade försäljningar av narkotika II", maj 2026 - mycket färsk,
  ännu utan fastställd NJA-referatbeteckning) - elva separata försäljningstillfällen av
  kokain på tre veckor. HD fastslog principiellt att varje försäljning är "en fullbordad
  och avgränsad gärning" och dömde för ELVA räknade brott - motsatsen till
  förskingringsfallens brottsenhets-mönster.
- **Hovrätten över Skåne och Blekinge B 206-22** - 13 räknade fall av grovt olaga hot
  (9 i tingsrätten, 4 fler i hovrätten). OBS: målets ledande gärning var försök till
  mord (en skolattack) - inte ett renodlat olaga hot-mål, men de 13 räknade fallen är
  en genuin flerfaldighet av just den brottstypen.
- **RH 2003:11** - tre fall av misshandel mot en sammanboende, klassade som
  normalgraden trots "jämförelsevis begränsad omfattning" av våldet - upprepningen och
  den nära relationen hindrade en ringa-klassning.
- **RH 2011:9** - två fall av olaga hot plus häleri i samma mål.

**Ingen renodlad grov misshandel-referensdom hittades** - täcks av en Lawline-doktrinkälla
i stället. **RH 2005:57** (grovt narkotikabrott) och **Hovrätten för Övre Norrland
B 379-26** ("Dalen-nätverket", synnerligen grovt narkotikabrott, juli 2026) är båda
straffvärdesreferenser för sin grad snarare än flerfaldighetsexempel - ett enda tillfälle
respektive en organisationsbaserad klassificering, inte räknade upprepade brott.

### Källtäckning - hitta luckor i referensdomarna systematiskt

I stället för att upptäcka källuckor av en slump (som när RH 1993:201:s dolda häleribrott
hittades av misstag) finns nu `analyseraTackning()` i `docs/calc.js`: den räknar, per
straffskala, hur många referensdomar som täcker den och hur många av dem som faktiskt är
flerfaldighetsexempel (inte bara gränsdragningsmål) - och sedan 2026-09-08 även hur många
förklarande källor (kategori B: doktrin/förarbeten) som är specifikt knutna till just den
brottstypen, via ett `brottstyper`-fält på `FORKLARANDE_KALLOR` (samma mönster som
`REFERENSDOMAR` redan hade). Källor utan brottstyper - t.ex. de som bara förklarar
asperationsprincipens allmänna mekanik - räknas medvetet INTE som täckning för någon
enskild brottstyp, annars skulle täckningsanalysen bli meningslös (allt skulle se
"täckt" ut). Två ställen i appen använder funktionen:

- Ett hopfällt "Källtäckning per brottstyp"-avsnitt i sidfoten, med varje brottstyp och en
  markering (gul bakgrund) bara för de som saknar BÅDE flerfaldighetsexempel OCH
  brottsspecifik doktrin.
- En notis ovanför referensdomslistan som visas live om de brott du fyllt i inte matchar
  någon referensdom alls.

Vid lanseringen (2026-09-06) syntes fyra tydliga luckor: ringa bedrägeri, häleriförseelse
och grovt häleri saknade referensdomar helt, och inbrottsstöld hade bara ett
gränsdragningsmål men inget flerfaldighetsexempel. En riktad forskningsomgång mot dessa
fyra gav:

- **Grovt häleri - löst.** Två verifierade flerfaldighetsexempel tillkom: **RH 1995:249**
  (Svea hovrätt - fyra stulna Volvobilar exporterade via Arlanda, fyra räknade fall av
  grovt häleri, fängelse 1 år 6 månader) och **RH 1993:130** (Hovrätten för Västra
  Sverige - yrkesmässig häleriverksamhet med stulna datorer/skrivare under två år,
  600 000-750 000 kr).
- **Ringa bedrägeri, häleriförseelse och inbrottsstöld - bekräftat äkta strukturella
  luckor, inte sökmissar.** En uttömmande sökning mot domstol.se:s fullständiga
  referatdatabas (exakt frastext, samtliga träffar genomgångna) gav: noll träffar alls
  för "ringa bedrägeri" i något publicerat HD-/hovrättsavgörande någonsin; samtliga 28
  träffar för "häleriförseelse" granskade och uteslutna (inget flerfaldighets- eller
  blandat fall); RH 2021:17 bekräftat fortfarande det enda inbrottsstöld-avgörandet i
  hela databasen. Dessa brottstyper är sannolikt för lindriga för att generera publicerad
  överrättspraxis - en riktig gräns för vad öppna källor kan ge, inte ett hål att fylla
  med bättre sökning.

Eftersom rättspraxis genuint saknas för dessa tre brottstyper söktes i stället doktrin/
förarbeten som ger vägledning ändå. Tre nya kategori B-källor tillkom:

- **SOU 2023:1** ("Skärpta straff för flerfaldig brottslighet") - dokumenterar hur
  domstolar historiskt tillämpat asperationsprincipen (hälften av varje ytterligare brott
  om det svåraste straffvärdet är ≤ 1 år 6 månader, annars en tredjedel), med
  **inbrottsstöld som eget räkneexempel** och en motsvarande formel för bötesnivån
  (dagsböter för det grövsta brottet + hälften av övrigas sammanlagda antal) - direkt
  relevant för ringa bedrägeri och häleriförseelse.
- **Prop. 2020/21:52** - propositionen som införde inbrottsstöld, förklarar varför ett
  samlat "grovt systematiskt häleri/stöld"-brott avvisades.
- **Åklagarmyndighetens RäV 2021:21** ("Normalstraff för vissa bötesbrott") - konkreta
  normalstraff-tabeller för ringa stöld/ringa bedrägeri och samma flerfaldighetsformel
  som SOU 2023:1, uppdaterad 2025-10-30.

**Beslut: tillagd som valbart alternativ.** SOU 2023:1:s andelsmodell (hälften/tredjedel
beroende på det svåraste straffvärdet) är mer nyanserad än kalkylatorns fasta
halveringsmodell - och beskrivs som redan etablerad domstolspraxis (med hänvisning till
verkliga NJA-avgöranden), inte bara ett framtida förslag. I stället för att byta ut
standardmodellen (störst risk, påverkar alla befintliga uppskattningar) lades den till som
ett väljarbart andra läge, så en advokat kan jämföra båda - se "Modellen" nedan.

**Alla tio brottstyper har nu förarbeten/doktrin (2026-09-08).** De fyra som tidigare bara
täcktes av den allmänna asperationsprincip-doktrinen (bedrägeri, grovt bedrägeri, häleri,
grovt häleri - alla med egna referensdomar, men ingen brottsspecifik doktrinkälla) fick
varsin riktad källa, verifierad genom att läsa riksdagen.se:s egen dokumenttext:

- **Prop. 2016/17:131** ("Grovt fordringsbedrägeri och andra förmögenhetsbrott") - skärpte
  gradindelningen av grovt bedrägeri (missbrukat förtroende, urkund, vilseledande
  bokföring, "särskilt farlig art") och införde det separata brottet grovt
  fordringsbedrägeri mot systematiska bluffakturor.
- **Prop. 1979/80:66** - moderniserade häleribrottet med uttalat syfte att träffa "yrkes-
  och vanehälare"; straffskalorna i propositionens egen text har senare ändrats (se
  `straffskalor.js` för aktuell lydelse), så källan citeras för sitt resonemang om
  systematik, inte som facit för dagens straffskala.
- **Ds 2019:1** ("Straffrättsliga åtgärder mot tillgreppsbrott och vissa andra brott") -
  föreslog systematik som uttryckligt kvalificerande rekvisit för grovt häleri och
  diskuterar direkt hur FLERA häleribrott bör läggas samman till ett samlat straffvärde
  (en kollektivbrottsmodell kontra en modell med förebild i grov fridskränkning) - den mest
  träffsäkra doktrinkällan för mängdrabatt vid häleri i hela kalkylatorn.

`backend/test/seedSources.test.js` har nu ett test som slår fast detta som en permanent
garanti, inte bara ett ögonblicksläge: "Varje straffskala har minst en referensdom ELLER
förklarande källa med matchande brottstyp" - failar automatiskt om någon framtida
brottstyp läggs till utan att någon knyter minst en källa till den. Garantin höll direkt
när rån och grovt rån lades till samma dag (se "Utökning till rån" ovan) - testet
tvingade fram en doktrinkälla för grovt rån innan den kunde committas.

## Modellen (frontend, redigerbar)

- **Ren kumulation**: summan av alla inmatade straffvärden.
- **Viktningen - två väljarbara lägen** (väljare i panel 2, `docs/calc.js`s
  `berakna({ modell })`-parameter):
  - **Halveringsmodell** (standard): brott 1 = 100 %, brott 2 = 50 %, brott 3 = 25 % osv.,
    med ett redigerbart golv per brott (default 3 %). Vikterna kan justeras fritt i appen.
  - **Andelsmodell (SOU 2023:1)**: brott 1 = 100 %, alla ytterligare brott får samma
    fasta andel - 50 % om det svåraste brottets straffvärde är högst 1 år 6 månader
    (18 månader), annars en tredjedel. Vikterna går inte att justera för hand i detta
    läge; golv-per-brott-kontrollen är dold eftersom den bara gäller halveringsmodellen.
  - Båda lägena delar samma tak/golv-logik och samma avrundningskonsekventa
    mängdrabatt-uträkning nedan - bara viktningen av "brott 2 och uppåt" skiljer sig åt.
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
- **Sökbar brottstyp-väljare** (2026-09-09): med 31 brottstyper i nio grupper blev en vanlig
  `<select>` otymplig, så den ersattes med en egenbyggd combobox (`#brottstyp-sok` +
  `#brottstyp-lista` i `docs/index.html`/`docs/app.js`) som filtrerar listan live medan man
  skriver, med pil upp/ned för navigering, Enter för att välja och Escape för att stänga.
  En dold `<input id="brottstyp">` håller det faktiska valda id:t så att resten av appen
  (straffvärdeshinten, formuläret) inte behövde ändras - samma kontrakt som den gamla
  `<select>`ens `.value`.
- **Doktrinkällor länkas direkt från källtäckningspanelen** (2026-09-09): panelen visade
  tidigare bara ett antal ("3 doktrinkällor") - nu länkar den direkt till varje källa
  (`[1] [2] [3]` vid flera, källnamnet vid en enda), med `title`-attribut som visar
  källa + titel vid hovring. Slipper leta upp samma källa i "Bakgrundskällor"-panelen.
- **"Skriv ut resultat"** (2026-09-09, `#skriv-ut-btn` i panel 2): en `@media print`-vy
  som döljer allt interaktivt (formulär, knappar, sökfält, viktreglage,
  diagnostikpanelerna i sidfoten) och bara skriver ut det som faktiskt behövs för en akt:
  tillagda brott, det beräknade resultatet (a-d) och de referensdomar som är relevanta för
  just de tillagda brotten (`.ref-ej-relevant`-klassen döljer resten). Länkarna till
  referensdomarna skrivs ut med sin URL i klartext (`.ref-link::after`) eftersom en
  utskrift inte kan klickas. Disclaimern finns kvar - det enda som aldrig får saknas i
  något som lämnar appen. Formaterad som ett neutralt PM (svartvitt, dokumenthuvud med
  datum och tomma fält för klient/ärende och upprättad av) snarare än en webbsideskärmdump
  - se `.skriv-ut-rubrik` i `index.html` och `@media print` i `style.css`.
- **Svenska valideringsmeddelanden** (2026-09-09): webbläsarens inbyggda
  valideringspopup för straffvärde-fältet visades tidigare på webbläsarens språk
  (t.ex. engelska: "Value must be less than or equal to 6") mitt i en annars helt
  svensk sida. `setCustomValidity()` i `bindForm()` byter ut den mot en svensk text
  anpassad efter felet (för högt, för lågt, tomt, eller ogiltigt tal).
- **Fokus hoppar tillbaka till brottstyp-sökningen efter varje tillagt brott**
  (2026-09-09): eftersom hela appen handlar om att mata in FLERA brott i rad krävde
  det tidigare ett extra klick per brottstyp - fokus stannade kvar i det (nu tomma)
  straffvärde-fältet. `bindForm()` flyttar nu fokus till `#brottstyp-sok` direkt efter
  att ett brott lagts till, vilket även öppnar listan igen (samma `focus`-hantering
  som combobox-sökningen redan hade) och markerar texten så nästa sökning kan skrivas
  direkt.
- **Referensdomarna döljs bakom en utfällbar lista om de inte matchar** (2026-09-09):
  med ~30 referensdomar krävde sidan mycket skrollande även innan man hunnit lägga
  till ett enda brott, eftersom alla domar alltid visades i sin helhet. `renderReferensdomar()`
  i `app.js` delar nu upp listan i två: matchande domar (`poang > 0`) i `#refs-lista`
  som vanligt, och resten i en `<details id="refs-ovriga-details">` som är hopfälld
  som standard (`Visa X ytterligare referensdomar (mindre relevanta för dina brott)`).
  Innan något brott är tillagt hamnar samtliga i den hopfällda listan och en kort notis
  ("Lägg till minst ett brott ovan...") visas i stället för en tom lista. Testat med
  grov stöld tillagd: 5 matchande domar visas direkt, 24 döljs bakom klicket - mot
  tidigare alla 29 alltid utskrivna i sin helhet.
- **Viktlistan är hopfälld som standard** (2026-09-11): halveringsmodellens manuella
  vikter fick en egen rad per tillagt brott, som nästan aldrig behöver justeras (golvet
  räcker i praktiken) men ändå alltid låg synlig och växte med varje nytt brott. Ligger
  nu bakom en `<details id="vikt-lista-details">` ("Justera vikter manuellt (avancerat)
  — X brott"), hopfälld tills man aktivt klickar sig in. Samma full bredd-stil som
  referensdomarnas utfällbara lista ovan. Fortsatt helt dold i andelsmodell-läget, där
  vikterna styrs automatiskt och inte går att justera för hand.
- **Ungdomsreduktion enligt 29 kap. 7 § BrB** (2026-09-11): den som begått brottet innan
  hen fyllt 21 år ska få ett lägre straff än brottets straffvärde annars motiverar. Ett
  nytt frivilligt fält ("Ålder vid brottstillfället") i modellpanelen tar emot ålder
  15–20 och tillämpar en vägledande praxis-skala (`UNGDOMSREDUKTION_TABELL`/
  `ungdomsfraktion()` i `calc.js`, etablerad sedan NJA 2000 s. 421) som en faktor på det
  redan tak/golv-justerade resultatet - inte på de enskilda brottens straffvärden var för
  sig. Visas bara som en extra rad ("e) Straffmätningsvärde efter ungdomsreduktion") när
  fältet är ifyllt med en ålder under 21; tomt fält (standard) ger ingen reduktion alls.
  Skalan är uttryckligen inte lagfäst - notisen under fältet och resultatraden säger båda
  att det enskilda fallet kan motivera avvikelse.
- **Straffskalelistan är hopfälld som standard** (2026-09-11): den fullständiga listan
  över alla 31 brottstypers straffskalor (med "Visa lagtext" per typ) låg alltid synlig
  under "Fasta juridiska fakta" i panel 1, vilket krävde mycket skrollande för att komma
  förbi - särskilt eftersom brottstyp-sökningen ovanför redan gör listan sökbar och visar
  det tillåtna intervallet för den valda typen. De två korta, alltid relevanta notiserna
  (tak/golv-regeln och kommande reform) ligger kvar synliga direkt; den 31-radiga listan
  ligger nu bakom en `<details id="straffskalor-details">` ("Fasta juridiska fakta –
  straffskalor (31 brottstyper)"), samma hopfällbara mönster som referensdomarnas och
  viktlistans motsvarande sektioner.
- **Tre nya referensdomar, alla lästa i fulltext på lagen.nu** (2026-09-11): en ny
  sökrunda via lagen.nu:s begreppsindex (`/begrepp/Flerfaldig_brottslighet`,
  `/begrepp/Ocker`, `/begrepp/Häleriförseelse` m.fl. - en mycket precisare ingång än
  fritextsökningen, eftersom lagen.nu taggar varje rättsfall med sina juridiska
  ämnesord) gav tre nya, verifierade poster i `REFERENSDOMAR`:
  - **HD B 8157-25 (2026-05-08)**, "Upprepade försäljningar av narkotika II" - ett
    pedagogiskt skolboksexempel på asperationsprincipen: HD omrubricerade elva
    narkotikaförsäljningar från "ett brott" (hovrättens bedömning) till elva separata
    brott, men landade ändå i exakt samma samlade straffvärde (1 år 10 månader) när
    asperationsprincipen tillämpades på de elva - visar att metoden ger samma resultat
    oavsett brottsenhetsindelning. Nytt andra flerfaldighetsexempel för narkotikabrott.
  - **RH 2005:6** - fyllde den tidigare bekräftade luckan för grovt ocker (se
    "Utökning till ocker..." ovan): två makar dömda till fängelse 2 respektive 1 år för
    att systematiskt ha tömt en dements 76-åriga kvinna på 3,3 miljoner kr. Taggad som
    straffvärdesreferens, inte flerfaldighetsexempel, eftersom åtalet omfattade
    gärningarna som ETT sammanhållet ockerbrott, inte flera räknade brott.
  - **NJA 1986 s. 374**, "De stulna silverföremålen" - fyllde häleriförseelse-luckan
    (se "Källtäckning" ovan, där en tidigare uttömmande sökning specifikt efter
    flerfaldighets-/blandfall inte gav träff) med ett gränsdragningsmål i stället: HD
    fann att en inköpare som köpt stulet antikt silver för en bråkdel av värdet haft
    "skälig anledning antaga" att godset var stulet men inte styrkt faktisk vetskap -
    därför häleriförseelse, inte häleri.
  Flera andra sökta luckor (grov misshandel, olovligt förfogande, grovt rån, ringa
  utpressning) gav inga användbara träffar den här omgången - antingen för att sökträffar
  visade sig gälla helt andra brott vid närmare läsning (t.ex. NJA 2011 s. 524, som
  egentligen handlar om en teoretisk besittningsfråga för förskingring), eller för att
  ingen publicerad överrättsdom hittades alls. De luckorna kvarstår därför genuint.

- **Ytterligare tre referensdomar (2026-09-11, samma dag)**: en andra sökrunda samma dag,
  fortfarande via lagen.nu:s begreppsindex, löste tre av de fyra luckor som just
  bekräftats ovan:
  - **RH 2011:64** - fyllde grov misshandel-luckan. Ett tvåårigt barn misshandlades
    svårt (skallbensbrott, hjärnblödning). VIKTIG BRASKLAPP i denna post: straffvärdet
    ("något under tre års fängelse") sattes ned kraftigt till 2 år av två billighetsskäl
    (starkt nedsatt förmåga att kontrollera sitt handlande + frivillig angivelse) - inte
    representativt för ett "typiskt" straffvärde, men det enda verifierade avgörandet för
    denna brottstyp.
  - **NJA 2018 s. 767** ("Rånet i guldsmedsbutiken") - fyllde grovt rån-luckan med ett
    gränsdragningsmål: HD nedgraderade ett tvåmannaöverfall med dödshot och en (oladdad)
    startpistol från grovt rån till rån av normalgraden (straffvärde 4 år 8 månader) -
    visar att ribban för grovt rån är förvånansvärt hög.
  - **NJA 1995 s. 430** - fyllde ocker-luckan (normalgraden): en kreditgivares
    företrädare dömd för tre separata ockerlån till olika låntagare, påföljd 50
    dagsböter.
  Ett kandidatfall för olovligt förfogande förkastades medvetet av samma anledning som
  tidigare (RH 2005:67 - "fyndautomat"-fallet - ledde faktiskt till en dom för
  FYNDFÖRSEELSE, inte olovligt förfogande). Ringa utpressning, olovligt förfogande/grovt
  olovligt förfogande och trolöshet mot huvudman (normalgraden) saknar fortfarande
  referensdomar helt.

- **En referensdom till, och en bekräftad strukturell lucka (2026-09-11, tredje
  sökrundan samma dag)**:
  - **NJA 1994 s. 480** - fyllde till slut olovligt förfogande-luckan: en man som av
    misstag fått 46 000 kr insatta på sitt bolags postgirokonto tog ut och behöll
    pengarna i två månader trots vetskap om felet. Påföljd: villkorlig dom. Domen är
    dessutom den principiella källan till att pengar på ett bankkonto överhuvudtaget kan
    vara i någons "besittning" i brottsbalkens mening - se NJA 2011 s. 524 ovan, som
    byggde vidare på just detta avgörande (men som själv förkastades här pga. sin
    komplexa, dissens-tyngda argumentation om förskingring snarare än en tydlig
    olovligt förfogande-illustration).
  - **Ringa utpressning bekräftat en genuint tom lucka, inte en sökmiss.** En riktad
    sökning efter exakt frastexten `"utpressning, ringa brott"` gav noll rättsfallsträffar
    alls (bara tre förarbeten som konstaterar att brottstypen existerar) - samma mönster
    som redan gäller ringa bedrägeri. Sannolikt för lindrig för att någonsin ha
    överklagats till en publicerad instans.
  Flera kandidater för trolöshet mot huvudman (normalgraden) förkastades eftersom de
  visade sig gälla den grova graden trots lovande sökträffar - starka belopp tycks
  konsekvent leda till att brottet rubriceras som grovt i praktiken. Trolöshet mot
  huvudman (normalgraden) och grovt olovligt förfogande kvarstår som genuina luckor.
- **Brottstyp-listan öppnas inte längre automatiskt efter "Lägg till brott"**
  (2026-09-11): fokus-återgången till `#brottstyp-sok` efter varje tillagt brott (se
  "Fokus hoppar tillbaka..." ovan) återanvände samma `focus`-lyssnare som ett riktigt
  klick i fältet, vilket slängde upp hela den grupperade brottstypslistan direkt efter
  varje tillägg - upplevdes som en oönskad popup mitt i arbetsflödet. `focus`-lyssnaren
  gör nu bara `select()` (markerar texten); listan öppnas i stället bara av faktiska
  användarinitierade handlingar - ett nytt `click`-lyssnare, inskrivning, eller
  piltangent om listan råkar vara stängd. En programmatisk `.focus()`-anrop (efter
  submit) utlöser aldrig `click`, så skillnaden mellan "fick fokus" och "blev klickad"
  är precis vad som behövdes.
- **Två nya doktrinkällor om blandade brottstyper** (2026-09-14): en användare frågade
  specifikt hur mängdrabatten fungerar när de kombinerade brotten är av OLIKA slag (inte
  bara flera likadana). Appens modell bryr sig redan bara om straffvärde och
  rangordning, aldrig om brottstyp (se `viktaBrott()` i `calc.js`) - och databasen hade
  redan åtta referensdomar med genuint blandade brottstyper (t.ex. NJA 2016 s. 1143:
  stöld + bedrägeri) samt två generella Lawline-källor om asperationsprincipens
  mekanik. Två nya Lawline-svar tillkom som konkret bekräftar att mekaniken är identisk
  oavsett brottstypernas art:
  - **"Vad är straffet för penningtvättsbrott och bedrägeri?"** - sju blandade ärenden
    av bedrägeri och penningtvättsbrott, ett gemensamt straff.
  - **"Påföljdsbestämning vid flera brott"** - narkotikainnehav + drograttfylleri +
    vårdslöshet i trafik efter en singelolycka.
  Ett tredje kandidatsvar (`16376`, om fem stölder) förkastades - det är samma
  brottstyp upprepad, inte en blandning, och överlappar redan SOU 2023:1:s eget
  inbrottsstöld-exempel.

- **Ytterligare en sökrunda mot kvarstående luckor, plus två strukturella luckor
  slutgiltigt bekräftade** (2026-09-14): en användare bad specifikt om prejudikat för
  ALLA brottstyper. Detta gav:
  - **NJA 2011 s. 675** ny referensdom för grovt narkotikabrott - ett gränsdragningsmål
    där HD nedgraderade åtta fall av (av hovrätten bedömt) grovt narkotikabrott/grov
    narkotikasmuggling till normalgraden, med hänvisning till att den etablerade
    mängdtabellen för den aktuella syntetiska drogen (MDPV) övervärderade dess
    farlighet. Straffvärdet föll från hovrättens 7 år till HD:s 1 år.
  - **Grovt olovligt förfogande bekräftat en genuint tom lucka**: lagen.nu:s eget
    begreppsindex för termen innehåller exakt noll rättsfall - bara lagtextens egen
    definition. Rimligt, eftersom gradindelningen är ny (SFS 2017:442) och sällan
    torde bli föremål för överklagande som egen fråga.
  - **Trolöshet mot huvudman (normalgraden) bekräftat en genuint tom lucka**: en
    riktad sökning gav noll rättsfallsträffar. Mönstret som redan noterats ovan
    (starka belopp klassas nästan alltid som grovt i praxis) förklarar sannolikt
    varför normalgraden aldrig blir föremål för publicerad överrätts-prövning.
  - **Inbrottsstöld-flerfaldighet bekräftat igen**: lagen.nu:s begreppsindex för
    "Inbrottsstöld" innehåller fortfarande bara RH 2021:17 (redan i databasen) - samma
    slutsats som tidigare sessioners uttömmande sökning.
  Efter denna omgång kvarstår fyra brottstyper helt utan referensdomar (ringa
  bedrägeri, ringa utpressning, grovt olovligt förfogande, trolöshet mot huvudman
  normalgraden) - samtliga nu bekräftade genom riktad, uttömmande sökning som genuina
  strukturella luckor i den publicerade svenska rättspraxisen, inte sökmissar.
  Samma sökrunda gav också **NJA 2011 s. 466** ("Det grova överfallsrånet") - ett
  ovanligt rikt fynd som fyller flera behov samtidigt: en tydlig grovt rån-fällande
  motpol till NJA 2018 s. 767 (gaturån som eskalerade till frihetsberövande i offrets
  eget hem över en timme), OCH ett genuint flerfaldighetsexempel med fyra olika
  brottstyper (grovt rån + rån + misshandel + ringa narkotikabrott, samlat
  straffvärde 6 år för en vuxen) OCH en verklig tillämpning av just den
  ungdomsreduktion appen implementerar (16-åring, sluten ungdomsvård 1 år - en kvot
  som matchar kalkylatorns egen 16-års-faktor på ungefär en fjärdedel).
  Slutligen tillkom **NJA 2000 s. 652** - en andra häleriförseelse-referens (köp av en
  stulen fritidsbåt värd ca 350 000 kr), som visar att gränsdragningen mot häleri
  gäller lika mycket vid högt värde som vid NJA 1986 s. 374:s lågvärdesexempel.

- **Bredare websökning löste en av de fyra kvarvarande luckorna** (2026-09-14): på
  användarens begäran vidgades sökningen bortom lagen.nu till allmän websökning
  (domstol.se:s pressmeddelandearkiv, Brottsoffermyndighetens referatsamling m.fl.).
  - **Trolöshet mot huvudman (normalgraden) - äntligen löst.** **Göta hovrätt B 3698-22**
    (pressmeddelande på domstol.se): en före detta VD dömdes ursprungligen av
    tingsrätten för trolöshet mot huvudman i TIO fall (privata inköp för bolagets
    räkning, ca 100 000 kr), men hovrätten friade honom från åtta av dessa och dömde
    honom slutligt för endast två fall (en hotellövernattning och en elinstallation,
    ca 23 000 kr) - flerfaldighet i mindre skala, men den enda referensdomen i hela
    databasen för just normalgraden av detta brott. Påföljd: villkorlig dom utan
    böter, med hänsyn till att han redan förlorat sin anställning.
  - **Straffbart.se förkastades medvetet som källa**, trots relevant innehåll om
    ringa bedrägeri (Brå-statistik, resonemang om upprepning/mönster): sajtens egen
    om-sida avslöjar att innehållet är "AI-assisterad textproduktion" från en
    enmansdriven sajt utan juridisk expertis bakom - för osäker grund jämfört med
    Lawlines juristbesvarade frågor eller primärkällor. Samma slutsats gäller
    Brottsoffermyndighetens referatsamling för utpressning: innehållet saknar
    domstolsnamn, målnummer och straffvärdesuppgifter (fokuserar bara på
    kränkningsersättning) och går därför inte att verifiera mot en primärkälla.
  - **Ringa utpressning, grovt olovligt förfogande och inbrottsstöld-flerfaldighet
    kvarstår, nu bekräftat även bortom lagen.nu.** Flera sökningar mot domstol.se:s
    pressmeddelanden och allmän web gav bara träffar på grov utpressning respektive
    grov stöld/inbrott i andra sammanhang. Dessa tre bedöms nu som väl uttömda med
    de metoder som finns tillgängliga. Ett konkret men obekräftat fynd för grovt
    olovligt förfogande (Dagens Juridik, Eskilstuna, en bilverkstad som behöll en
    Range Rover i 1,5 år, fälld i både tingsrätt och hovrätt) ligger bakom en
    betalvägg utan synligt målnummer - kan läggas till om målnumret hittas.
- **En doktrinkälla till för olaga hot/grovt olaga hot** (2026-09-14): brottsfamiljen
  hade tidigare noll förklarande källor trots egna referensdomar. **Lawline: "Påföljd
  vid olaga hot"** går igenom gradindelningsfaktorerna, inklusive att UPPREPADE
  allvarliga hot uttryckligen kan vara en faktor som gör hotet grovt.

### VIKTIG RÄTTELSE: ungdomsreduktionen byggdes på en lag som hann bli inaktuell
(2026-09-14)

Under research för föregående punkt (en Lawline-artikel om grovt narkotikabrott och
20-åringar) upptäcktes att 29 kap. 7 § BrB - paragrafen bakom appens
ungdomsreduktion, implementerad 2026-09-11 - hade ändrats **fyra dagar innan
upptäckten**, utan att det uppmärksammats:

- **SFS 2026:1528** (utfärdad 14 aug 2026, prop. 2025/26:293) **trädde i kraft den
  10 september 2026** - verifierat direkt mot den officiella författningstexten
  (svenskforfattningssamling.se), inte bara sekundära källor.
- Ungdomsreduktionen gäller nu bara den som begått brottet **innan hen fyllt 18 år**
  - inte upp till 21 år som tidigare. Reduktionen för 18-20-åringar ("myndiga
  lagöverträdare") är **helt avskaffad**. Lagrådet hade ingen invändning mot just
  den delen.
- Paragrafens lydelse ändrades samtidigt från "ska beaktas SÄRSKILT" till "ska
  beaktas i SKÄLIG OMFATTNING" för 15-17-åringar - enligt författningskommentaren
  till lagrådsremissen (verifierad via Lagrådets eget yttrande 2026-03-12) avsett
  att ge en AVSEVÄRT MINDRE reduktion än den gamla skalan (baserad på NJA 2000 s.
  421). De nya vägledande kvotdelarna: 15 år ≈ 2/5, 16 år ≈ 3/5, 17 år ≈ 4/5 (av
  vad en vuxen skulle få) - upp från tidigare 1/5, 1/4, 1/3.

**Åtgärdat**: `UNGDOMSREDUKTION_TABELL` och `ungdomsfraktion()` i `calc.js`
uppdaterade till de nya kvotdelarna för 15-17 år; `ungdomsfraktion()` returnerar nu
1 (ingen reduktion) från och med 18 år. UI-texten i `index.html` uppdaterad från
"Under 21 år..." till "Under 18 år...", med en tydlig brasklapp om att lagen är så
ny (fyra dagar vid upptäckten) att ingen domstolspraxis ännu bekräftat de exakta
kvottalen - författningskommentarens siffror är vägledande, inte lagfästa. Alla
kalc.test.js-tester uppdaterade och verifierade (51/51 gröna).

**Lärdom**: en straffrättslig kalkylator som denna kan inte bara byggas en gång -
lagstiftningen förändras löpande (precis som appen redan bevakar den ännu icke
ikraftträdda asperationsprincip-reformen SFS 2026:1318), och en redan
IMPLEMENTERAD funktion kan hinna bli inaktuell inom loppet av dagar. Detta hittades
av en slump under ett websökningsuppdrag - inte genom systematisk bevakning. Det
vore klokt att regelbundet kontrollera lagen.nu:s brottsbalken-sida för ändringar i
de paragrafer appen bygger på (26 kap. 1-2 §§, 29 kap. 1-7 §§).

### Ytterligare en sökrunda mot de tre sista luckorna (2026-09-14, samma dag)

- **Inbrottsstöld-flerfaldighet - äntligen ett fynd, men med reservationer.**
  **Västmanlands tingsrätt (Magazin24, 2026-03-31)**: en 31-åring dömd för
  inbrottsstöld (Hallstahammar, mars 2023) och stöld (byggarbetsplats i Arboga,
  april 2024). Detta är ett genuint avsteg från databasens annars strikta krav på
  primärkälla (lagen.nu-domtext eller domstol.se-pressmeddelande): artikeln anger
  inget målnummer, är bara tingsrättsnivå, och den rapporterade "sex månaders
  fängelse" är efter en 34 kap.-justering (nyupptäckt brottslighet i förhållande
  till en tidigare, orelaterad dom) - inte det renodlade asperationsresultatet
  ("drygt ett år" enligt artikeln). En ny verifieringsstatus,
  `manuell_nyhetsartikel`, infördes för att tydligt skilja denna typ av post från
  de annars primärkälleverifierade posterna - se kommentaren högst upp i
  `seedSources.js`.
- **Ringa utpressning och grovt olovligt förfogande kvarstår.** Ytterligare
  sökningar (lokaltidningsarkiv, generella sökfraser, "verkligabrott.se" som
  visade sig sakna den sökta artikeln) gav inget nytt. Dessa två bedöms nu vara
  uttömda så långt fria källor räcker - den enda kvarstående konkreta ledtråden är
  fortfarande Range Rover-fallet bakom Dagens Juridiks betalvägg.

### Ännu en sökrunda, nu även mot tingsrättsdomar (2026-09-14, samma dag)

Användaren godkände uttryckligen att även renodlade tingsrättsavgöranden (inte bara
hovrätt/HD) får läggas till, så länge de går att verifiera - vilket gav två nya fynd
via domstol.se:s egna pressmeddelanden (samma tillförlitlighetsnivå som databasens
övriga `manuell_pressmeddelande`-poster, till skillnad från gårdagens
lokaltidningsfynd):

- **Malmö tingsrätt B 1595-24** - en av elva män dömda i en stor dom om våldsamt
  upplopp (Fridhemsplan) dömdes i en helt separat händelse för rån, grov misshandel
  OCH olovligt förfogande (två värmepumpar) - tre olika brottstyper kombinerade,
  fängelse 2 år. Ett bra tillskott till samlingen av "blandade brottstyper"-exempel.
- **Stockholms tingsrätt B 2798-23** - fyller luckan för flerfaldighet inom
  utpressning av normalgraden (fanns tidigare bara ett gränsdragningsmål): en
  kvinna dömd för både fullbordad utpressning och försök till utpressning mot en
  riksdagsledamot (hot om att avslöja sexköp). Åklagaren yrkade grovt, tingsrätten
  sa nej. Påföljd: skyddstillsyn med samhällstjänst.

**Viktig läxa under research**: en AI-sammanfattning av sökträffar blandade
oavsiktligt ihop Malmö-domen med en helt orelaterad friande dom om en "vaccinbuss"
(Företagare som bedrivit vårdverksamhet, dom 2026-07). Det gick bara att reda ut
genom att läsa själva domstol.se-sidorna direkt - ett skäl till varför alla
sammanfattade sökträffar i den här kalkylatorn alltid läses i original innan de
läggs till.

Ringa utpressning och grovt olovligt förfogande gav fortsatt inget nytt trots
riktade domstol.se-sökningar (bl.a. en fulltext-genomläst tingsrättsdom om grov
utpressning/mordbrand som visade sig sakna den ringa graden helt). Bedöms nu vara
väl uttömda med webbaserade metoder.

Range Rover-fallets målnummer gick inte att hitta trots Wayback Machine (samma
betalvägg redan från publiceringsdagen), lokaltidningsarkiv och Eskilstuna
tingsrätts egen sida för publicerade avgöranden (som bekräftar att vanliga
tingsrättsdomar måste beställas med målnummer - moment 22 utan det). Väntar på att
användaren hittar numret via en egen Dagens Juridik-prenumeration eller genom att
beställa avgörandet direkt från tingsrätten.

### Doktrinluckor för narkotikabrott stängda, samt en riktig HD-dom för ocker
(2026-09-14, samma dag)

- **Två nya Lawline-källor** stänger de sista doktrin-luckorna för
  grovt/synnerligen grovt narkotikabrott (båda hade tidigare noll förklarande
  källor): "Vart går gränsen för grovt narkotikabrott för heroin?" (mängdriktmärken
  per preparat, med hänvisning till SvJT 2013 s. 53 och NJA 1997 s. 193) och "Straff
  vid synnerligt grovt narkotikabrott" (bekräftar straffskalan 6-10 år).
- **HD B 4262-12 (2013-12-20)** - en riktig HD-fulltext, inte bara ett
  pressmeddelande: en kvinna utnyttjade sin äldre, psykiskt sjuka systers
  oförstånd till att under tre veckor 2009 lura henne på värdepapper, kontanter
  och en fastighet - sammanlagt ca 2 082 000 kr fördelat på tre transaktioner.
  Tingsrätten dömde grovt ocker, hovrätten friade helt, HD återställde en fällande
  dom men bara för ocker av normalgraden (en skiljaktig justitieråd ville döma
  grovt). Ett rikt, verkligt HD-fall för `ocker`/`grovt_ocker` - som tidigare bara
  hade ett enda, tunnare exempel vardera.

**Bugg hittad och fixad under research**: `kontrolleraUrl()` i `scraper.js`
försökte HEAD före GET för att spara bandbredd, men om HEAD-anropet kastade ett
nätverksfel (i stället för att bara returnera en icke-2xx-status) fångades felet
direkt och GET-fallbacken kördes aldrig - en fullt fungerande källa flaggades då
felaktigt som otillgänglig. Upptäckt när HD B 4262-12:s PDF (som ligger under
domstol.se:s `/globalassets/`-sökväg) konsekvent gav "kunde inte nås: fetch
failed" trots att en vanlig GET fungerade perfekt. `domstol.se` svarar tydligen
inte alls på HEAD-förfrågningar för PDF:er under den sökvägen. Fixat genom att
fånga ett eventuellt HEAD-fel separat och ändå försöka GET efteråt, i stället för
att låta ett kastat HEAD-fel avbryta hela kontrollen.

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
