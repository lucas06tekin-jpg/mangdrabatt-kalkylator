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

### Utökning till förskingring

Appen täcker sedan 2026-09-08 även förskingring, tre nivåer: **förskingring** (10 kap.
1 § BrB, 0-24 mån), **ringa förskingring** (10 kap. 2 § BrB, 0-6 mån - traditionellt/i
doktrinen ofta kallad "undandräkt", men lagtextens egen rubrik är "ringa förskingring")
och **grov förskingring** (10 kap. 3 § BrB, 12-72 mån - golvet höjt från 6 månader till
1 år av SFS 2026:1318, samma reform som höjde golvet för grov stöld, grovt bedrägeri och
grovt häleri).

**En strukturellt viktig upptäckt vid denna research:** de två referensdomar som hittades
för grov förskingring - **NJA 1992 s. 470** (systematisk förskingring september 1986 till
december 1990, minst 200 000 kr) och **RH 1996:42** (351 tillfällen under 1989-1994, minst
400 000 kr) - behandlades BÅDA av domstolen som **ETT sammanhållet brott (brottsenhet)**,
inte som flera separata brott som läggs samman via 26 kap. 2 §. Det är alltså inte bara det
att flerfaldighetsexempel saknas av en slump - upprepad förskingring från samma huvudman
tycks i praxis ofta bedömas som ett enda, fortlöpande brott snarare än flerfaldig
brottslighet i den mening den här kalkylatorn räknar på. Värt att ha i huvudet om du matar
in flera förskingringstillfällen: verklighetens domstolar kanske inte skulle se dem som
separata brott alls. Förskingring och ringa förskingring saknar egna referensdomar men
täcks av en Lawline-artikel (sökmotorutdrag, ej fulltextläst) som går igenom alla tre
graderna.

### Utökning till utpressning

Appen täcker sedan 2026-09-08 även utpressning, tre nivåer: **ringa utpressning**
(9 kap. 4 § första stycket BrB, 0-6 mån), **utpressning** (samma paragraf, 0-36 mån) och
**grov utpressning** (9 kap. 4 § andra stycket BrB, 24-96 mån). Straffskalorna höjdes
2023-07-01 av SFS 2023:257 (prop. 2022/23:53, "Skärpta straff för brott i kriminella
nätverk") - utpressning från högst 2 till högst 3 år, grov utpressning från 1-6 år till
2-8 år. Notera att detta INTE är samma reform som SFS 2026:1318 (som höjde golven för
grov stöld/grovt bedrägeri/grovt häleri/grov förskingring) - ännu en påminnelse om att
varje brottstyps ändringshistorik måste verifieras för sig, inte antas följa samma mönster.

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
  bedrägeri/grovt häleri/grov förskingring).
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

**Ingen referensdom hittades för ocker.** Den enda ordentligt belysta moderna NJA-domen
(NJA 2013 s. 1130) slutade i ett FRIKÄNNANDE - HD fastställde hovrättens frikännande, och
det enda konkreta straffvärdet (motsvarande fängelse ett år) nämndes bara av två
skiljaktiga justitieråd i minoritet. Att presentera den domen som ett exempel på ockers
straffvärde hade varit missvisande, så den uteslöts medvetet - ocker täcks i stället av en
Lawline-doktrinkälla. Motsvarande gäller för olovligt förfogande: inget genomsökt fall gav
en ren, tydlig referensdom (ett kandidatfall, NJA 1986 s. 350, ledde faktiskt till en dom
för BEDRÄGERI, inte olovligt förfogande, och hade gett fel bild av vilket brott som
faktiskt tillämpades - samma typ av "fel mekanism"-misstag som uteslöts för rån och
utpressning ovan). Båda täcks av Prop. 2016/17:131/SFS 2017:442 som doktrinkälla i
stället.

### Utökning till tillgrepp av fortskaffningsmedel

Appen täcker sedan 2026-09-08 även tillgrepp av fortskaffningsmedel ("biltillgrepp utan
tillägnelseuppsåt", dvs. att olovligen låna någon annans motorfordon utan avsikt att
behålla det - skiljer sig från stöld just genom avsaknaden av tillägnelseuppsåt). Ovanligt
strukturellt: alla tre graderna sitter i SAMMA paragraf (8 kap. 7 § BrB, olika stycken) i
stället för separata paragrafer som i övriga brottsfamiljer: **ringa** (andra stycket,
0-6 mån), **normalgrad** (första stycket, 0-24 mån) och **grovt** (tredje stycket,
6-48 mån). Grovgradens golv är INTE höjt av SFS 2026:1318 - verifierat genom riktad
sökning att ingen sådan höjning skett, till skillnad från de sex "grovt X"-brotten som
fick sitt golv höjt 6 månader → 1 år av den reformen.

Ingen flerfaldighetsdom hittades vid denna sökning - brottet verkar oftare förekomma vid
ETT tillfälle i kombination med andra brott (rattfylleri, olovlig körning, stöldförsök)
snarare än upprepat i samma mål, till skillnad från t.ex. rån eller trolöshet mot
huvudman. I stället gav sökningen två högkvalitativa HD-avgöranden om gradindelningen,
ett för vardera gränsen:

- **NJA 2021 s. 1102** ("Mopedtillgreppet i Västervik") - gränsdragningsmål mellan ringa
  och normalgrad. En 15-åring lånade en olåst moped och körde ca 200 meter. HD ändrade
  tingsrättens och hovrättens bedömning (normalgrad) till RINGA brott, och slog fast att
  en helhetsbedömning krävs där brukandets omfattning, skaderisk, fordonets värde och om
  gärningen var impulsiv eller planerad alla vägs in.
- **NJA 1984 s. 751** - gränsdragningsmål mellan normalgrad och grovt brott. HD
  underkände hovrättens grova rubricering och fastslog att enbart det faktum att
  tillgreppet skedde genom inbrott inte i sig gör brottet grovt - minimistraffets nivå
  (6 månader) förutsätter gärningar med "betydande straffvärde".

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
