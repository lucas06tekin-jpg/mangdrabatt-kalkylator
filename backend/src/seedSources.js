// Manuellt verifierade källor, insamlade 2026-09-03.
//
// Kategori A (REFERENSDOMAR): varje post är kontrollerad genom att den faktiska domstexten
// (via lagen.nu) eller ett officiellt pressmeddelande (domstol.se) har lästs innan den lades
// till här. Sammanfattningarna är egenformulerade - inga citat ur domarna.
// autoUppdateras=true innebär att scraper.js periodiskt kontrollerar att URL:en fortfarande
// svarar (lagen.nu och domstol.se tillåter detta enligt deras robots.txt).
//
// Kategori B (FÖRKLARANDE KÄLLOR): Lawline-artiklar. VIKTIGT: lawline.se/robots.txt nekar
// uttryckligen "ClaudeBot" (även om User-agent: * tillåter allt). Dessa poster är därför
// manuellt granskade en gång och auto_uppdateras=false - scraper.js rör aldrig lawline.se.
// Om innehållet behöver verifieras på nytt måste det göras manuellt av en människa.

export const REFERENSDOMAR = [
  {
    id: "NJA 2008 s. 359",
    kalla: "lagen.nu",
    kalla_url: "https://lagen.nu/dom/nja/2008s359",
    domstol: "Högsta domstolen (mål B 1735-07, 2008-03-20)",
    brott_sammanfattning:
      "Två tilltalade dömda för en grov stöld och omkring 34–35 fall av stöld (bildelar, " +
      "båtmotorer, två inbrott varav ett med stöld av vapen), begångna 2004–2005.",
    straffvarde_text:
      "Sammantaget straffvärde motsvarande drygt ett års fängelse. Påföljden bestämdes dock " +
      "till skyddstillsyn med samhällstjänst 180 timmar, med hänsyn till bl.a. frivilligt " +
      "erkännande och skadestånd.",
    brottstyper: ["grov_stold", "stold"],
    flerfaldighetsexempel: true,
    verifieringsstatus: "manuell_fulltext",
    autoUppdateras: true,
  },
  {
    id: "NJA 2016 s. 1143",
    kalla: "lagen.nu",
    kalla_url: "https://lagen.nu/dom/nja/2016s1143",
    domstol: "Högsta domstolen (mål B 3380-16)",
    brott_sammanfattning:
      "24 fall av stöld (systematisk stöld av handbagage från tågresenärer), 26 fall av " +
      "bedrägeri med stulet bankkort (ca 265 800 kr, åtalat enligt 9 kap. 1 § andra " +
      "stycket BrB - ordinarie bedrägeri, ej grovt) samt narkotikainnehav.",
    straffvarde_text:
      "Påföljd: fängelse 2 år 3 månader. HD prövade om de upprepade stölderna skulle " +
      "rubriceras som grov stöld och fann att ordinarie stöld var korrekt rubricering trots " +
      "det systematiska tillvägagångssättet. Bedrägerirubriceringen (ordinarie, ej grovt) " +
      "var inte tvistig i målet.",
    brottstyper: ["stold", "bedrageri"],
    flerfaldighetsexempel: true,
    verifieringsstatus: "manuell_fulltext",
    autoUppdateras: true,
  },
  {
    id: "RH 2015:26",
    kalla: "lagen.nu",
    kalla_url: "https://lagen.nu/dom/rh/2015:26",
    domstol: "Göta hovrätt (mål B 636-15, 2015-05-25)",
    brott_sammanfattning:
      "En hemtjänstanställd dömd för 10 fall av grov stöld – systematisk stöld av smycken " +
      "och klockor från äldre brukare vid hembesök (4 600–29 500 kr per tillfälle).",
    straffvarde_text:
      "Varje enskild stöld värderades till ca 6 månaders straffvärde. Med tillämpning av " +
      "asperationsprincipen bestämdes det sammantagna straffvärdet till ca 1 år 8 månader; " +
      "hovrätten satte påföljden till fängelse 1 år 4 månader (tingsrättens 3 år sänktes). " +
      "Domen betonar att asperationsprincipen ska ges tydligt genomslag vid upprepad, " +
      "likartad brottslighet – sannolikt den mest direkt relevanta domen för denna kalkylator.",
    brottstyper: ["grov_stold"],
    flerfaldighetsexempel: true,
    verifieringsstatus: "manuell_fulltext",
    autoUppdateras: true,
  },
  {
    id: "RH 2006:49",
    kalla: "lagen.nu",
    kalla_url: "https://lagen.nu/dom/rh/2006:49",
    domstol: "Hovrätten över Skåne och Blekinge (mål B 2080-05)",
    brott_sammanfattning:
      "Stöld, tre fall av grov stöld (inbrott, 20 000–50 000 kr vardera), ytterligare stöld " +
      "av båt/gods (ca 50 000 kr), olovlig körning och narkotikainnehav.",
    straffvarde_text:
      "Sammantaget straffvärde bedömt till drygt ett år. Tingsrätten dömde till 10 månaders " +
      "fängelse; hovrätten skärpte till 13 månader med hänsyn till tidigare belastning.",
    brottstyper: ["stold", "grov_stold"],
    flerfaldighetsexempel: true,
    verifieringsstatus: "manuell_fulltext",
    autoUppdateras: true,
  },
  {
    id: "NJA 2019 s. 951",
    kalla: "lagen.nu",
    kalla_url: "https://lagen.nu/dom/nja/2019s951",
    domstol: "Högsta domstolen (mål B 6140-18, 2019-12-10)",
    brott_sammanfattning:
      "Gränsdragningsmål, INTE ett exempel på flerfaldighetsbedömning: enstaka stöld av " +
      "varor värda 1 142 kr. HD satte då gränsen mellan ringa stöld och stöld vid ett " +
      "tillgripet värde om 1 250 kr.",
    straffvarde_text:
      "Gränsvärdet 1 250 kr gällde fram till att det höjdes genom NJA 2025:67 (se nedan). " +
      "Relevant för att klassificera varje enskilt brott innan mängdrabatt beräknas.",
    brottstyper: ["ringa_stold", "stold"],
    flerfaldighetsexempel: false,
    verifieringsstatus: "manuell_fulltext",
    autoUppdateras: true,
  },
  {
    id: "NJA 2025:67",
    kalla: "domstol.se (pressmeddelande)",
    kalla_url:
      "https://www.domstol.se/nyheter/2025/10/vardegransen-mellan-stold-och-ringa-stold-vid-butikstillgrepp-har-bestamts-till-1-500-kr/",
    domstol: "Högsta domstolen (mål B 712-25)",
    brott_sammanfattning:
      "Gränsdragningsmål, INTE ett exempel på flerfaldighetsbedömning: två separata " +
      "butikstillgrepp (1 311 kr och 1 250 kr). HD höjde gränsen mellan ringa stöld och " +
      "stöld till 1 500 kr (inflationsjustering av NJA 2019 s. 951).",
    straffvarde_text:
      "Gränsvärdet 1 500 kr är aktuell gällande rätt (2026). OBS: endast domstol.se:s " +
      "pressmeddelande har lästs här, inte hela HD-domens fulltext.",
    brottstyper: ["ringa_stold", "stold"],
    flerfaldighetsexempel: false,
    verifieringsstatus: "manuell_pressmeddelande",
    autoUppdateras: true,
  },
  {
    id: "RH 2021:17",
    kalla: "lagen.nu",
    kalla_url: "https://lagen.nu/dom/rh/2021:17",
    domstol: "Hovrätten för Västra Sverige (mål B 4725-21, 2021-09-07)",
    brott_sammanfattning:
      "Enstaka brott, INTE ett flerfaldighetsexempel - men det enda verifierbara avgörandet " +
      "om inbrottsstöld: en kvinna utgav sig falskt för att vara vikarierande " +
      "hälsocentralspersonal, tog sig in på ett äldreboende och stal sex oskrapade lotter " +
      "(värda 180 kr) från en rullstolsburen boende.",
    straffvarde_text:
      "Hovrätten satte ned tingsrättens straff från 1 år 6 månader till 1 år 3 månaders " +
      "fängelse, med hänsyn till bl.a. offrets utsatta situation.",
    brottstyper: ["inbrottsstold"],
    flerfaldighetsexempel: false,
    verifieringsstatus: "manuell_fulltext",
    autoUppdateras: true,
  },
  {
    id: "NJA 2024:2",
    kalla: "domstol.se (pressmeddelande)",
    kalla_url: "https://www.domstol.se/nyheter/2024/01/stold-i-bostad-bedoms-inte-som-grov/",
    domstol: "Högsta domstolen (mål B 7974-22, 2024-01-04) - även refererad som NJA 2024 s. 12",
    brott_sammanfattning:
      "Gränsdragningsmål (\"Pianobäraren\"), INTE ett flerfaldighetsexempel: en man som " +
      "hjälpte till att bära in ett piano hos en säljare tog tillfället att stjäla en " +
      "plånbok (ca 800 kr, bankkort, körkort) ur en jacka i hallen medan säljare och köpare " +
      "förhandlade i ett angränsande rum.",
    straffvarde_text:
      "HD klargjorde att kvalifikationsgrunden \"omedelbar närhet\" för grov stöld kräver " +
      "att saken fysiskt befinner sig nära offret vid tillgreppet, och att en enskild " +
      "kvalifikationsgrund inte automatiskt medför att brottet ska bedömas som grovt - en " +
      "helhetsbedömning krävs. Gärningen bedömdes som stöld (ej grovt); påföljd 5 månaders " +
      "fängelse. OBS: endast domstol.se:s pressmeddelande har lästs här, inte hela HD-domens " +
      "fulltext.",
    brottstyper: ["stold", "grov_stold"],
    flerfaldighetsexempel: false,
    verifieringsstatus: "manuell_pressmeddelande",
    autoUppdateras: true,
  },
  {
    id: "NJA 2006 s. 524",
    kalla: "lagen.nu",
    kalla_url: "https://lagen.nu/dom/nja/2006s524",
    domstol: "Högsta domstolen (mål B 391-06, 2006-09-13)",
    brott_sammanfattning:
      "Två ungdomar (17 och 15 år) snattade/stal under en eftermiddag i flera butiker i ett " +
      "köpcentrum i Lund - den ena i 8 butiker (ca 3 840 kr sammanlagt), den andra i 5 " +
      "butiker (ca 2 759 kr) plus ett håleribrott. I en butik vardera hade larmbrickor " +
      "avlägsnats och värdet var högre - dessa två tillfällen bedömdes som stöld, medan " +
      "övriga tillfällen (19-598 kr styck) bedömdes som ringa stöld (domen använder den " +
      "äldre beteckningen \"snatteri\" - samma brott, 8 kap. 2 § BrB, före 2017 års " +
      "namnbyte), trots att de ingick i samma \"snatteritur\".",
    straffvarde_text:
      "HD avvisade uttryckligen åklagarens argument att spreens sammanlagda värde skulle " +
      "styra rubriceringen av varje enskild gärning, satte straffvärdet per stöldbrott till " +
      "ca en månads fängelse (räknat som vuxen) och fastställde den gemensamma påföljden om " +
      "100 dagsböter. Det mest citerade avgörandet om hur en butikstursspree med både ringa " +
      "stöld och stöld ska hanteras vid gemensam straffmätning - åberopat i minst åtta " +
      "senare avgöranden och två regeringspropositioner.",
    brottstyper: ["ringa_stold", "stold"],
    flerfaldighetsexempel: true,
    verifieringsstatus: "manuell_fulltext",
    autoUppdateras: true,
  },
  {
    id: "RH 1998:101",
    kalla: "lagen.nu",
    kalla_url: "https://lagen.nu/dom/rh/1998:101",
    domstol: "Hovrätten över Skåne och Blekinge (mål B 712/97, 1998-02-16)",
    brott_sammanfattning:
      "5 fullbordade och 1 försök till stöld under en \"stöldrajd\" i ett köpcentrum i Malmö " +
      "- gärningsmannen tog varor från sex butiker under några timmar (bl.a. Åhléns, " +
      "Intersport, Hennes & Mauritz, samt ett försök där en larmbricka avlägsnats innan han " +
      "greps), sammanlagt värde över 8 000 kr. Flera enskilda tillgrepp låg under den " +
      "dåvarande värdegränsen för stöld, men hovrätten rubricerade ändå samtliga som stöld " +
      "(inte ringa stöld/snatteri) på grund av det systematiska, planerade tillvägagångssättet.",
    straffvarde_text:
      "OBS: äldre avgörande (1998) utan fängelsestraff att jämföra siffermässigt - påföljden " +
      "blev villkorlig dom och 80 dagsböter, ingen fängelsemånader-siffra. Tas med som en " +
      "renodlad flerfaldig \"stöld\"-dom utan komplicerande sidobrott, och som exempel på hur " +
      "ett systematiskt tillvägagångssätt kan motivera stöld-rubricering (i stället för ringa " +
      "stöld) av flera lågvärdestillgrepp - inte för sifferjämförelse av straffvärde.",
    brottstyper: ["stold"],
    flerfaldighetsexempel: true,
    verifieringsstatus: "manuell_fulltext",
    autoUppdateras: true,
  },
  {
    id: "NJA 2021 s. 970",
    kalla: "lagen.nu",
    kalla_url: "https://lagen.nu/dom/nja/2021s970",
    domstol: "Högsta domstolen",
    brott_sammanfattning:
      "13 åtalade fall av grovt bedrägeri medelst urkundsförfalskning, begångna 2009-2014. " +
      "Tingsrätten friade helt; hovrätten dömde för 11 av de 13 fallen (2 hade preskriberats).",
    straffvarde_text:
      "Hovrätten satte det gemensamma straffvärdet för de 11 fallen till fängelse 2 år, men " +
      "påföljden blev villkorlig dom och 200 dagsböter med hänsyn till den mycket långa tid " +
      "som förflutit och den tilltalades allvarliga sjukdom. HD:s egen prövning gällde en " +
      "processfråga (rättegång i den tilltalades utevaro via sjukhustelefon), inte själva " +
      "straffmätningen. OBS: straffvärdet 2 år avser den äldre straffskalan för grovt " +
      "bedrägeri (lägre golv än dagens 1 år, som gäller sedan SFS 2026:1318).",
    brottstyper: ["grovt_bedrageri"],
    flerfaldighetsexempel: true,
    verifieringsstatus: "manuell_fulltext",
    autoUppdateras: true,
  },
  {
    id: "RH 1993:201",
    kalla: "lagen.nu",
    kalla_url: "https://lagen.nu/dom/rh/1993:201",
    domstol: "Svea hovrätt (mål B 2736-93, 1993-11-19)",
    brott_sammanfattning:
      "En villkorligt frigiven man begick under en dryg månad 1993 en serie förmögenhetsbrott: " +
      "4 fall av bedrägeri/urkundsförfalskning (falska hyreskontrakt, bedrägligt kort-/" +
      "checkanvändande, ca 31 300 kr), 2 fall av grovt bedrägeri medelst urkundsförfalskning " +
      "(bl.a. hyra av telefon och bil för ca 15 000 kr), försök till bedrägeri, häleri, " +
      "förskingring samt olaga knivinnehav - 10 åtalspunkter totalt.",
    straffvarde_text:
      "OBS: äldre avgörande (1993). Påföljden blev fängelse 1 år, och den villkorliga " +
      "frigivningen förverkades till 4 månader. Exempel på hur bedrägeri och grovt bedrägeri " +
      "blandas med annan förmögenhetsbrottslighet (häleri, förskingring) i en och samma dom.",
    brottstyper: ["bedrageri", "grovt_bedrageri", "haleri"],
    flerfaldighetsexempel: true,
    verifieringsstatus: "manuell_fulltext",
    autoUppdateras: true,
  },
  {
    id: "Svea hovrätt B 8808-25",
    kalla: "domstol.se (pressmeddelande)",
    kalla_url: "https://www.domstol.se/nyheter/2025/10/langa-fangelsestraff-for-aldringsbedragerier/",
    domstol: "Svea hovrätt (mål B 8808-25, 2025-10)",
    brott_sammanfattning:
      "Telefon-/sms-bedrägerier mot äldre (\"vishing\") - falska sms om påstådda beställningar " +
      "fick offren att ringa upp och luras att föra över pengar eller ge fjärråtkomst till sin " +
      "dator. Omkring 70 brottstillfällen sammanlagt, tre tilltalade; en av dem dömdes för ett " +
      "fullbordat bedrägeri, ett försök samt medhjälp till grovt bedrägeri i nio fall.",
    straffvarde_text:
      "Påföljder: fängelse 5 år 3 månader, 4 år 10 månader respektive 1 år 10 månader för de " +
      "tre tilltalade. OBS: endast domstol.se:s pressmeddelande har lästs här, inte hela " +
      "hovrättsdomens fulltext.",
    brottstyper: ["grovt_bedrageri"],
    flerfaldighetsexempel: true,
    verifieringsstatus: "manuell_pressmeddelande",
    autoUppdateras: true,
  },
  {
    id: "RH 2021:25",
    kalla: "lagen.nu",
    kalla_url: "https://lagen.nu/dom/rh/2021:25",
    domstol: "Göta hovrätt (mål B 864-21, 2021-04-29)",
    brott_sammanfattning:
      "Stöldgods från K.K. anträffades av polis vid fyra separata tillfällen/platser " +
      "(lägenheter) under oktober-november 2020, en del av godset spårat till samma " +
      "förbrott. Tingsrätten (Kalmar) dömde för tre fall av grovt häleri, ett fall av " +
      "häleri och en stöld. Hovrätten prövade brottsenhetsfrågan - hur många separata " +
      "häleribrott det blir när gods dyker upp vid flera tillfällen/platser - och fann " +
      "att varje nytt mottagande normalt utgör ett eget häleribrott (med hänvisning till " +
      "NJA 2018 s. 378 och NJA 2019 s. 747 om brottsenhet, och NJA 2013 s. 654 om " +
      "värdegränsen för grovt häleri).",
    straffvarde_text:
      "Hovrätten satte ned samtliga fyra häleriräkningar till ordinarie häleri (ej " +
      "styrkt värde/andra försvårande omständigheter för grovt), men beaktade det " +
      "systematiska mönstret inom den ordinarie gradens bedömning. Slutresultat: 4 fall " +
      "av häleri + 1 stöld, gemensamt straffvärde fängelse 10 månader. Påföljden blev " +
      "dock skyddstillsyn med föreskrift om missbruksvård, inte fängelse.",
    brottstyper: ["haleri", "stold"],
    flerfaldighetsexempel: true,
    verifieringsstatus: "manuell_fulltext",
    autoUppdateras: true,
  },
  {
    id: "RH 1995:249",
    kalla: "lagen.nu",
    kalla_url: "https://lagen.nu/dom/rh/1995:249",
    domstol: "Svea hovrätt (mål B 625-95, 1995-04-26)",
    brott_sammanfattning:
      "En estnisk medborgare dömd för fyra fall av grovt häleri - fyra stulna Volvo-bilar " +
      "(vardera värda ca 200 000-325 000 kr) omhändertagna dagar efter respektive stöld och " +
      "utförda via Arlanda mellan mitten av 1994 och tidigt 1995. En organiserad " +
      "exporthärva för stulna bilar, med fyra tydligt räknade brottstillfällen.",
    straffvarde_text:
      "Påföljd: fängelse 1 år 6 månader samt utvisning med tio års återreseförbud. " +
      "OBS: äldre avgörande (1995) - referatets huvudfråga rör utvisningsbedömningen, " +
      "men den underliggande fällande domen är genuint fyra räknade fall av grovt häleri.",
    brottstyper: ["grovt_haleri"],
    flerfaldighetsexempel: true,
    verifieringsstatus: "manuell_fulltext",
    autoUppdateras: true,
  },
  {
    id: "RH 1993:130",
    kalla: "lagen.nu",
    kalla_url: "https://lagen.nu/dom/rh/1993:130",
    domstol: "Hovrätten för Västra Sverige (mål B 197-93, 1993-11-12)",
    brott_sammanfattning:
      "Dömd för grovt häleri \"av stor omfattning\" - upprepat förvärvande av stulna " +
      "datorer och laserskrivare under en tvåårsperiod (maj 1989-maj 1991), sammanlagt " +
      "värde 600 000-750 000 kr, med en egen vinning på ca 150 000 kr. En systematisk, " +
      "yrkesmässig häleriverksamhet bedömd som ett sammanhållet grovt brott.",
    straffvarde_text:
      "OBS: äldre avgörande (1993). Tingsrätten dömde till skyddstillsyn och " +
      "samhällstjänst; hovrätten fann brottet allvarligt nog för skyddstillsyn i " +
      "förening med fängelse men lät den ursprungliga påföljden bestå eftersom " +
      "samhällstjänsten redan fullgjorts. Ingen ren fängelsemånader-siffra att jämföra " +
      "mot, men ett tydligt exempel på yrkesmässig häleriverksamhet som grovt brott.",
    brottstyper: ["grovt_haleri"],
    flerfaldighetsexempel: true,
    verifieringsstatus: "manuell_fulltext",
    autoUppdateras: true,
  },
  {
    id: "NJA 1994 s. 732",
    kalla: "lagen.nu",
    kalla_url: "https://lagen.nu/dom/nja/1994s732",
    domstol: "Högsta domstolen (mål B 4446-94, 1994-12-22)",
    brott_sammanfattning:
      "Två tilltalade, vardera dömda för TVÅ fall av rån (bankrån) samt tillgrepp av " +
      "fortskaffningsmedel. HD underkände hovrättens grova rubricering - eftersom " +
      "attrapper användes och inget fysiskt våld förekom - och fastslog att en " +
      "tillräckligt kraftfull reaktion kan beslutas inom straffskalan för normalgraden " +
      "av rån, utan att gå upp i grovt rån.",
    straffvarde_text:
      "R.A.: fängelse 6 år (sänkt från tingsrättens 10 år). M.L.: fängelse 4 år. Ett " +
      "genuint flerfaldighetsexempel - två räknade rånbrott per tilltalad - men OBS: " +
      "1994 års avgörande, innan grovt råns minimistraff höjdes från 4 till 5 år " +
      "(prop. 2016/17:108, i kraft 2017-07-01). Citerat för sitt flerfaldighetsresonemang " +
      "kring rån av normalgraden, inte som facit för dagens exakta straffnivå.",
    brottstyper: ["ran"],
    flerfaldighetsexempel: true,
    verifieringsstatus: "manuell_fulltext",
    autoUppdateras: true,
  },
  {
    id: "RH 2006:31",
    kalla: "lagen.nu",
    kalla_url: "https://lagen.nu/dom/rh/2006:31",
    domstol: "Svea hovrätt (från Stockholms tingsrätt)",
    brott_sammanfattning:
      "Rån vid 13 tillfällen, försök till rån vid 2 tillfällen, och häleri - systematiska " +
      "väpnade rån mot ensamarbetande butikspersonal under en kort period. Ett tydligt " +
      "räknat flerfaldighetsexempel med många brottstillfällen av samma brottstyp.",
    straffvarde_text:
      "Tingsrätten (2005-09-09): fängelse 3 år. Hovrätten (2005-11-04) fördubblade till " +
      "fängelse 6 år, med hänvisning till systematiken, vapen-/knivhot mot utsatta " +
      "ensamarbetande målsägande och den tilltalades återfall under prövotid.",
    brottstyper: ["ran", "haleri"],
    flerfaldighetsexempel: true,
    verifieringsstatus: "manuell_fulltext",
    autoUppdateras: true,
  },
  {
    id: "NJA 2025:12",
    kalla: "domstol.se (pressmeddelande)",
    kalla_url:
      "https://www.domstol.se/nyheter/2025/03/ett-fall-av-ran-har-ansetts-vara-av-mindre-allvarlig-art/",
    domstol: "Högsta domstolen (mål B 5428-24, 2025-03-13) - kallat \"Jackan\"",
    brott_sammanfattning:
      "Gränsdragningsmål, INTE ett flerfaldighetsexempel: en 18-åring hotade en " +
      "14-åring för att få hans jacka. HD tillämpade 8 kap. 5 § fjärde stycket BrB - " +
      "gärningen var, trots att den formellt uppfyllde rånrekvisiten, \"av mindre " +
      "allvarlig art\" (inget våld, verbalt hot utan tillhygge) och omklassificerades " +
      "därför till grov stöld i stället för rån.",
    straffvarde_text:
      "Straffvärde bedömt till fängelse 10 månader, reducerat till 6 månader för " +
      "ungdom. Påföljd: skyddstillsyn med 140 timmars samhällstjänst.",
    brottstyper: ["ran", "grov_stold"],
    flerfaldighetsexempel: false,
    verifieringsstatus: "manuell_pressmeddelande",
    autoUppdateras: true,
  },
  {
    // Båda förskingringsfallen nedan är GRÄNSDRAGNINGSMÅL om brottsenhet (är upprepad
    // förskingring från samma huvudman ETT sammanhållet brott eller flera separata brott
    // som ska läggas samman via 26 kap. 2 §?), inte flerfaldighetsexempel i vanlig mening.
    // HD/hovrätten behandlade i båda fallen den systematiska förskingringen som ETT brott -
    // strukturellt annorlunda än stöld/bedrägeri/häleri/rån, där upprepade tillfällen
    // normalt räknas och läggs samman som separata brott. Värt att känna till för den som
    // matar in flera förskingringstillfällen i den här kalkylatorn.
    id: "NJA 1992 s. 470",
    kalla: "lagen.nu",
    kalla_url: "https://lagen.nu/dom/nja/1992s470",
    domstol: "Högsta domstolen (mål B 1092-92, 1992-07-10)",
    brott_sammanfattning:
      "Grov förskingring, satt i system under perioden september 1986 till 17 december " +
      "1990 (missbruk av tjänsteställning). HD behandlade de upprepade förskingringarna " +
      "som ETT sammanhållet brott (brottsenhet), inte som flera separata brott.",
    straffvarde_text:
      "Förskingrat belopp: 200 000 kr enligt domstolarna (åklagaren yrkade 231 268 kr). " +
      "Tingsrätt och hovrätt: fängelse 10 månader. HD: villkorlig dom, med hänsyn till " +
      "att skadeståndet reglerats.",
    brottstyper: ["grov_forskingring"],
    flerfaldighetsexempel: false,
    verifieringsstatus: "manuell_fulltext",
    autoUppdateras: true,
  },
  {
    id: "RH 1996:42",
    kalla: "lagen.nu",
    kalla_url: "https://lagen.nu/dom/rh/1996:42",
    domstol: "Hovrätten för Västra Sverige (mål B 1273-95, 1996-04-30)",
    brott_sammanfattning:
      "Grov förskingring vid 351 tillfällen under perioden 1989-1994, som kassaförvaltare. " +
      "Liksom NJA 1992 s. 470 behandlat som ETT sammanhållet, systematiskt grovt brott - " +
      "inte 351 separata brott som läggs samman via asperationsprincipen.",
    straffvarde_text:
      "Åklagaren yrkade 620 856 kr; minst 400 000 kr ansågs styrkt. Tingsrätten: " +
      "villkorlig dom utan böter. Hovrätten: fängelse 10 månader, med hänsyn till att den " +
      "tilltalade förlorat sitt arbete.",
    brottstyper: ["grov_forskingring"],
    flerfaldighetsexempel: false,
    verifieringsstatus: "manuell_fulltext",
    autoUppdateras: true,
  },
  {
    id: "NJA 2009 s. 300",
    kalla: "lagen.nu",
    kalla_url: "https://lagen.nu/dom/nja/2009s300",
    domstol: "Högsta domstolen (mål B 5416-08, 2009-06-04)",
    brott_sammanfattning:
      "Grov utpressning och försök till grov utpressning vid FLERA tillfällen 2003-2007, " +
      "mot ett stort antal målsägande, samt grovt olaga tvång, olaga hot, misshandel och " +
      "vapenbrott. Hovrätten tillämpade principen att gärningar som var för sig inte " +
      "nödvändigtvis är grova kan bli det när de \"ingår i en serie av brott som " +
      "genomgående präglas av samma planmässighet och systematik\" - ett genuint " +
      "flerfaldighetsexempel, till skillnad från förskingringsfallen ovan.",
    straffvarde_text:
      "Hovrättens bedömning: fängelse 4 år 6 månader. HD:s slutliga straffvärde för den " +
      "samlade brottsligheten: ca fängelse 6 år 6 månader.",
    brottstyper: ["grov_utpressning"],
    flerfaldighetsexempel: true,
    verifieringsstatus: "manuell_fulltext",
    autoUppdateras: true,
  },
  {
    id: "RH 2018:44",
    kalla: "lagen.nu",
    kalla_url: "https://lagen.nu/dom/rh/2018:44",
    domstol: "Svea hovrätt (mål B 3135-17, 2018-05-31)",
    brott_sammanfattning:
      "Gränsdragningsmål, INTE flerfaldighet: försök till utpressning vid ETT tillfälle. " +
      "Huvudfrågan var om en fordran på svart lön (odeklarerad arbetsinkomst) är av sådan " +
      "beskaffenhet att den är \"oerkänd\" av rättsordningen vid bedömning av " +
      "förmögenhetsöverföring - hovrätten fann att den inte var det, men att kravet ändå " +
      "riktades mot personen och därför utgjorde utpressning.",
    straffvarde_text:
      "F.T. och E.A.: straffvärde 6 månader vardera (fängelse). Medhjälparen S.D.: " +
      "straffvärde 3 månader, villkorlig dom med 100 timmars samhällstjänst.",
    brottstyper: ["utpressning"],
    flerfaldighetsexempel: false,
    verifieringsstatus: "manuell_fulltext",
    autoUppdateras: true,
  },
  {
    // Till skillnad från förskingringsfallen ovan (NJA 1992 s. 470, RH 1996:42), som
    // BÅDA behandlade upprepad förskingring som ETT sammanhållet brott, är detta motsatt
    // exempel: hovrätten här dömde uttryckligen varje enskild överföring som ETT EGET
    // fullbordat brott - ett riktigt flerfaldighetsexempel med 19 räknade brott.
    id: "RH 2019:16",
    kalla: "lagen.nu",
    kalla_url: "https://lagen.nu/dom/rh/2019:16",
    domstol: "Svea hovrätt (mål B 9149-17, 2018-11-29)",
    brott_sammanfattning:
      "Grov trolöshet mot huvudman genom 19 separata överföringar om sammanlagt ca " +
      "26 450 000 kr. Hovrätten konstaterade uttryckligen att \"var och en av de ... " +
      "gjorda 19 överföringarna utgör ett fullbordat brott vilket får till följd att det " +
      "rör sig om flerfaldig brottslighet\" - varje överföring räknades som ett eget " +
      "brott, inte som ett sammanhållet brott. OBS: dömt enligt lydelsen av 10 kap. 5 § " +
      "BrB före 1 juli 2016 - paragrafens nuvarande lydelse är omformulerad men " +
      "grundstrukturen (böter/2 år normalgraden, 1-6 år grov) är oförändrad.",
    straffvarde_text:
      "Hovrättens straffvärde: fängelse 2 år 6 månader. Utdömd påföljd: fängelse 9 " +
      "månader, kraftigt reducerad med hänsyn till betydande medverkan i utredningen.",
    brottstyper: ["grov_troloshet_mot_huvudman"],
    flerfaldighetsexempel: true,
    verifieringsstatus: "manuell_fulltext",
    autoUppdateras: true,
  },
];

export const FORKLARANDE_KALLOR = [
  {
    id: "lawline-asperationsprincipen",
    kalla: "Lawline",
    titel: "Hur räknar man ut straffet vid flerfaldig brottslighet? (asperationsprincipen)",
    kalla_url:
      "https://lawline.se/answers/hur-raknar-man-ut-straffet-vid-flerfaldig-brottslighet-asperationsprincipen",
    sammanfattning:
      "Förklarar asperationsprincipens grundmekanik: det allvarligaste brottets fulla " +
      "straffvärde läggs samman med en avtagande andel av de övriga brottens straffvärden " +
      "(t.ex. ungefär hälften av det näst allvarligaste, en fjärdedel av det tredje) – i " +
      "stället för att brottens straffvärden summeras rakt av.",
    brottstyper: [], // generell mekanik, inte knuten till en viss brottstyp
    granskningsdjup: "fulltext",
  },
  {
    id: "lawline-15245",
    kalla: "Lawline",
    titel: "Straffmätning vid flerfaldig brottslighet – exempel enligt 26 kap. 2 § BrB",
    kalla_url: "https://lawline.se/answers/15245",
    sammanfattning:
      "Går igenom hur en domstol resonerar vid straffmätning för flera samtidigt lagförda " +
      "brott av olika slag, med ett räkneexempel som visar hur det gemensamma straffet hålls " +
      "inom taket och golvet i 26 kap. 2 § BrB.",
    brottstyper: [], // generellt räkneexempel, inte knutet till en viss brottstyp
    granskningsdjup: "fulltext",
  },
  {
    id: "lawline-ringa-stold-flertal",
    kalla: "Lawline",
    titel: "Ringa stöld vid flera tillfällen",
    kalla_url: "https://lawline.se/answers/ringa-stold-vid-flertal-tillfallen",
    sammanfattning:
      "Beskriver att upprepade fall av ringa stöld vid olika tillfällen bedöms som separata " +
      "brott – inte som ett enda sammanslaget värde – och att de därefter straffmäts " +
      "gemensamt enligt reglerna för flerfaldig brottslighet.",
    brottstyper: ["ringa_stold"],
    granskningsdjup: "fulltext",
  },
  {
    id: "lawline-butikstold-pafoljd",
    kalla: "Lawline",
    titel: "Påföljdsbedömning vid butikstöld",
    kalla_url: "https://lawline.se/answers/pafoljdsbedomning-vid-butikstold",
    sammanfattning:
      "Diskuterar påföljd vid butikstillgrepp, bl.a. ungdomsrabatt och värdegränsen mot " +
      "ringa stöld. Artikeln nämner flera rättsfall, varav NJA 2008 s. 359 och NJA 2019 s. " +
      "951 återfinns bland referensdomarna ovan (oberoende bekräftat). Den nämner även äldre " +
      "avgöranden (t.ex. NJA 1972 s. 253, RH 2007:49) som INTE har verifierats oberoende och " +
      "därför medvetet inte tagits med som referensdomar i kategori A.",
    brottstyper: ["ringa_stold", "stold"],
    granskningsdjup: "fulltext",
  },

  // Nedanstående fem är hittade via sökmotorsnutt (Google-liknande utdrag), INTE öppnade
  // och lästa i sin helhet - lawline.se/robots.txt nekar ClaudeBot, se scraper.js. Märkta
  // granskningsdjup: "snippet" i UI:t, till skillnad från fulltext-lästa poster ovan.
  {
    id: "lawline-vad-ar-mangdrabatt",
    kalla: "Lawline",
    titel: "Vad är mängdrabatt vid straff?",
    kalla_url: "https://lawline.se/answers/vad-ar-mangdrabatt-vid-straff",
    sammanfattning:
      "Enligt sökmotorutdraget: definierar mängdrabatt/asperationsprincipen - vid flera " +
      "samtidigt lagförda brott bestäms ett gemensamt straff i stället för att brottens " +
      "straffvärden läggs samman rakt av, med motiveringen att långa strafftider inte anses " +
      "minska återfallsrisken proportionerligt.",
    brottstyper: [], // generell definition, inte knuten till en viss brottstyp
    granskningsdjup: "snippet",
  },
  {
    id: "lawline-var-regleras-mangdreduktionen",
    kalla: "Lawline",
    titel: "Var regleras den straffrättsliga mängdreduktionen?",
    kalla_url: "https://lawline.se/answers/var-regleras-den-straffrattsliga-mangdreduktionen",
    sammanfattning:
      "Enligt sökmotorutdraget: pekar ut var i lagen mängdreduktionen regleras (26 kap. 2 § " +
      "BrB) - en hänvisningskälla snarare än en fördjupad förklaring.",
    brottstyper: [], // generell hänvisning, inte knuten till en viss brottstyp
    granskningsdjup: "snippet",
  },
  {
    id: "lawline-ringa-stold-500kr",
    kalla: "Lawline",
    titel: "Vad blir domen för flera olika fall av ringa stöld avseende ett värde om totalt 500 kronor?",
    kalla_url:
      "https://lawline.se/answers/vad-blir-domen-for-flera-olika-fall-av-ringa-stold-avseende-ett-varde-om-totalt-500-kronor",
    sammanfattning:
      "Enligt sökmotorutdraget: ett konkret räkneexempel med flera fall av ringa stöld som " +
      "tillsammans uppgår till ca 500 kr - ett lågvärdesscenario nära kalkylatorns egna " +
      "typexempel.",
    brottstyper: ["ringa_stold"],
    granskningsdjup: "snippet",
  },
  {
    id: "lawline-vad-raknas-som-grov-stold",
    kalla: "Lawline",
    titel: "Vad räknas som grov stöld?",
    kalla_url: "https://lawline.se/answers/vad-raknas-som-grov-stold",
    sammanfattning:
      "Enligt sökmotorutdraget: går igenom vilka omständigheter (t.ex. tillgreppets värde " +
      "eller tillvägagångssätt) som gör att en stöld bedöms som grov - bakgrund till " +
      "klassificeringssteget som föregår mängdrabattberäkningen.",
    brottstyper: ["grov_stold"],
    granskningsdjup: "snippet",
  },
  {
    id: "lawline-straff-inbrottsstold",
    kalla: "Lawline",
    titel: "Vad kan jag få för straff för inbrottsstöld?",
    kalla_url: "https://lawline.se/answers/vad-kan-jag-fa-for-straff-for-inbrottsstold",
    sammanfattning:
      "Enligt sökmotorutdraget: beskriver straffskalan och de omständigheter som beaktas vid " +
      "straffvärdesbedömning för inbrottsstöld (8 kap. 4 a § BrB) - den enda brottstyp i " +
      "kalkylatorn som tidigare helt saknade en förklarande Lawline-källa.",
    brottstyper: ["inbrottsstold"],
    granskningsdjup: "snippet",
  },

  // Två artiklar i Svensk Juristtidning - fulltextlästa (svjt.se tillåter allmän hämtning).
  {
    id: "svjt-jareborg-1999",
    kalla: "Svensk Juristtidning",
    titel: "Straffmätning vid flerfaldig brottslighet",
    kalla_url: "https://svjt.se/svjt/1999/264",
    sammanfattning:
      "Artikel av professor Nils Jareborg (SvJT 1999 s. 264) om den rättspolitiska grunden " +
      "för asperationsprincipen, med exemplet att två brott värda en månad vardera normalt " +
      "ger två månaders gemensamt straff - inte fyra. Jareborg avfärdar tidigare försök att " +
      "formalisera mängdrabatten som en exakt matematisk formel och förespråkar i stället en " +
      "normativ, skönsmässig bedömning - en påminnelse om att kalkylatorns halveringsmodell " +
      "är en pedagogisk förenkling, inte en återgivning av domstolarnas faktiska metod.",
    brottstyper: [], // generell rättspolitisk grund för asperationsprincipen
    granskningsdjup: "fulltext",
  },
  {
    id: "svjt-sunnqvist-2011",
    kalla: "Svensk Juristtidning",
    titel: "Sammanläggning av flera systematiskt begångna brott till ett grovt brott",
    kalla_url: "https://svjt.se/svjt/2011/495",
    sammanfattning:
      "Artikel av Martin Sunnqvist (SvJT 2011 s. 495) om hur flera systematiskt begångna, " +
      "lindrigare stölder historiskt och rättsligt kan behandlas som ett sammanhållet grovt " +
      "brott i stället för att varje tillfälle bedöms för sig - relevant för hur brott bör " +
      "klassificeras innan mängdrabatt över huvud taget blir aktuellt att räkna ut.",
    brottstyper: ["stold", "grov_stold"],
    granskningsdjup: "fulltext",
  },

  // Åklagarmyndighetens egen nyhet - fulltextläst (aklagare.se tillåter allmän hämtning).
  {
    id: "aklagarmyndigheten-vardegrans",
    kalla: "Åklagarmyndigheten",
    titel: "Höjd värdegräns för ringa stöld",
    kalla_url:
      "https://www.aklagare.se/for-media/aktuellt-pa-aklagarmyndigheten/2025/oktober/nu-galler-hojd-vardegrans-for-ringa-stold/",
    sammanfattning:
      "Åklagarmyndighetens egen nyhet om att värdegränsen mellan ringa stöld och stöld " +
      "höjdes från 1 250 kr till 1 500 kr från den 30 oktober 2025, till följd av HD:s " +
      "avgörande i mål B 712-25 (NJA 2025:67, som redan finns bland referensdomarna). " +
      "Bekräftar även justerade gränser för åtalsunderlåtelse (90 kr för vuxna, 30 kr för " +
      "unga).",
    brottstyper: ["ringa_stold", "stold"],
    granskningsdjup: "fulltext",
  },

  // Doktrin/förarbeten hittade vid en riktad sökning efter vägledning för de brottstyper
  // källtäckningsanalysen visade sakna referensdomar (ringa bedrägeri, häleriförseelse,
  // inbrottsstöld). regeringen.se och aklagare.se tillåter båda allmän hämtning enligt
  // sina robots.txt-filer.
  {
    id: "sou-2023-1-flerfaldig-brottslighet",
    kalla: "Regeringen",
    titel: "Skärpta straff för flerfaldig brottslighet (SOU 2023:1)",
    kalla_url:
      "https://www.regeringen.se/contentassets/c3577faba7894a7da9d5bcaf94750f7d/skarpta-straff-for-flerfaldig-brottslighet-sou-2023-1.pdf",
    sammanfattning:
      "Statlig utredning som dokumenterar hur domstolar tillämpat asperationsprincipen: " +
      "när det svåraste brottets straffvärde är högst 1 år 6 månader läggs normalt " +
      "hälften av varje ytterligare brotts straffvärde till, annars en tredjedel (med " +
      "hänvisning till bl.a. NJA 2008 s. 359, NJA 2018 s. 378 och NJA 2020 s. 703) - en " +
      "mer nyanserad, straffvärdesberoende andelsmodell än denna kalkylators fasta " +
      "halveringsmodell. Använder inbrottsstöld som eget räkneexempel: fem inbrottsstölder " +
      "ger ett samlat straffvärde om tre år, femton krävs för att nå maximistraffet. " +
      "Beskriver även bötesnivåns flerfaldighetsregel (dagsböter för det grövsta brottet " +
      "plus hälften av det sammanlagda antalet dagsböter för övriga, med hänvisning till " +
      "NJA 2014 s. 59 och NJA 2020 s. 344) - relevant vägledning för ringa bedrägeri och " +
      "häleriförseelse, som saknar egna referensdomar. Redogör också för varför ett " +
      "tidigare förslag om ett samlat \"grovt systematiskt häleri/stöld\"-brott avvisades.",
    brottstyper: ["inbrottsstold", "ringa_bedrageri", "haleriforseelse"],
    granskningsdjup: "fulltext",
  },
  {
    id: "prop-2020-21-52-inbrottsstold",
    kalla: "Regeringen",
    titel: "Tillträdesförbud till butik och förstärkt straffrättsligt skydd mot tillgreppsbrottslighet (Prop. 2020/21:52)",
    kalla_url: "https://www.regeringen.se/contentassets/c877a3de75dd4206a78d8f4d2e3a5461/prop-202021-52.pdf",
    sammanfattning:
      "Propositionen som införde inbrottsstöld (8 kap. 4 a § BrB) 2021. Övervägde och " +
      "avvisade uttryckligen ett samlat brott (\"grov systematisk stöld\"/\"grovt " +
      "systematiskt häleri\") som skulle ha slagit ihop flera tillgreppsbrott - även " +
      "upprepade fall av ringa stöld - till ett enda grovt brott, efter kritik från bl.a. " +
      "tingsrätter och Åklagarmyndigheten om gränsdragningssvårigheter. Konstaterar att " +
      "riksdagens tillkännagivande om att se upprepade stölder \"i ett sammanhang\" bara " +
      "delvis tillgodosågs genom den nya straffskalan för inbrottsstöld.",
    brottstyper: ["inbrottsstold"],
    granskningsdjup: "fulltext",
  },
  {
    id: "aklagarmyndigheten-normalstraff-botesbrott",
    kalla: "Åklagarmyndigheten",
    titel: "Normalstraff för vissa bötesbrott (RäV 2021:21)",
    kalla_url:
      "https://www.aklagare.se/globalassets/dokument/rattsliga-vagledningar/rav-202121-normalstraff-for-vissa-botesbrott.pdf",
    sammanfattning:
      "Åklagarmyndighetens rättsliga vägledning med normalstraff (antal dagsböter/kronor) " +
      "per värdeintervall för bl.a. ringa stöld och ringa bedrägeri, uppdaterad 30 oktober " +
      "2025 efter HD:s höjda värdegräns. Anger samma flerfaldighetsformel som SOU 2023:1: " +
      "antalet dagsböter för det grövsta brottet höjs normalt med hälften av det " +
      "sammanlagda antalet dagsböter för de övriga brotten. Häleriförseelse finns inte med " +
      "i tabellerna, men den allmänna flerfaldighetsformeln gäller bötesbrott generellt.",
    brottstyper: ["ringa_stold", "ringa_bedrageri", "haleriforseelse"],
    granskningsdjup: "fulltext",
  },

  // Doktrin/förarbeten för bedrägeri, grovt bedrägeri, häleri och grovt häleri - de fyra
  // brottstyper som tidigare bara täcktes av den allmänna asperationsprincip-doktrinen ovan
  // (lawline-asperationsprincipen m.fl.), inte av något brottsspecifikt förarbete. Hittade
  // vid riktad sökning 2026-09-08 och verifierade genom att läsa riksdagen.se:s egen
  // dokumenttext (inte bara sökmotorsammanfattningar).
  {
    id: "prop-2016-17-131-grovt-bedrageri",
    kalla: "Regeringen",
    titel: "Grovt fordringsbedrägeri och andra förmögenhetsbrott (Prop. 2016/17:131)",
    kalla_url:
      "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/proposition/grovt-fordringsbedrageri-och-andra_h403131/html/",
    sammanfattning:
      "Propositionen skärpte gradindelningen av grovt bedrägeri (9 kap. 3 § BrB): vid " +
      "bedömningen ska särskilt beaktas om gärningsmannen missbrukat allmänt förtroende, " +
      "använt urkund eller vilseledande bokföring, eller om gärningen annars varit av " +
      "särskilt farlig art. Samtidigt infördes ett nytt brott, grovt fordringsbedrägeri " +
      "(9 kap. 3 a § BrB), riktat mot systematiskt utskickade bluffakturor till en vidare " +
      "krets - straffbart redan vid utskicket, utan att någon faktiskt behöver ha betalat. " +
      "Relevant bakgrund till varför systematik och organiserad brottslighet väger tungt " +
      "vid bedömningen av bedrägeribrottens allvar, vilket i sin tur påverkar det " +
      "straffvärde som matas in i den här kalkylatorn. Samma proposition (titeln \"...och " +
      "andra förmögenhetsbrott\") skapade också en helt ny gradindelning för olovligt " +
      "förfogande (10 kap. 4 § BrB, SFS 2017:442, i kraft 2017-07-01): maxstraffet för " +
      "normalgraden sänktes från två år till ett år, och ett nytt grovt brott (\"grovt " +
      "olovligt förfogande\", fängelse lägst 6 månader högst 4 år) infördes samtidigt - " +
      "en direkt förklaring till varför den straffskalan finns i kalkylatorn.",
    brottstyper: ["bedrageri", "grovt_bedrageri", "olovligt_forfogande", "grovt_olovligt_forfogande"],
    granskningsdjup: "fulltext",
  },
  {
    id: "prop-1979-80-66-haleri",
    kalla: "Regeringen",
    titel: "Med förslag till lag om ändring i brottsbalken (häleri m.m.) (Prop. 1979/80:66)",
    kalla_url:
      "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/proposition/med-forslag-till-lag-om-andring-i-brottsbalken_g30366/html/",
    sammanfattning:
      "Den proposition som moderniserade häleribrottet (9 kap. 6 § BrB) och skärpte " +
      "straffskalorna. Reformens uttalade syfte var att komma åt \"yrkes- och " +
      "vanehälare\" - den som vanemässigt eller yrkesmässigt tar befattning med " +
      "stöldgods - snarare än den som vid ett enstaka tillfälle råkar köpa något " +
      "frånhänt annan. Historisk bakgrund till varför häleri (till skillnad från t.ex. " +
      "stöld) ofta bedöms strängare ju mer systematiskt det förekommit, vilket är direkt " +
      "relevant vid straffvärdesbedömning av flera häleribrott tillsammans. Notera att " +
      "de exakta straffskalorna propositionen beskriver senare har ändrats (se " +
      "straffskalor.js för aktuell lydelse) - källan citeras här för sitt resonemang, " +
      "inte som facit för dagens straffskala.",
    brottstyper: ["haleri", "grovt_haleri"],
    granskningsdjup: "fulltext",
  },
  {
    id: "ds-2019-1-haleri-systematik",
    kalla: "Regeringen",
    titel: "Straffrättsliga åtgärder mot tillgreppsbrott och vissa andra brott (Ds 2019:1)",
    kalla_url:
      "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/departementsserien/straffrattsliga-atgarder-mot-tillgreppsbrott-och_h7b41/html/",
    sammanfattning:
      "Departementspromemoria som föreslog att lägga till systematik som ett uttryckligt " +
      "kvalificerande rekvisit för grovt häleri (9 kap. 6 § BrB), definierat som brott " +
      "\"identiska eller likartade och föregåtts av planering eller kan betraktas som en " +
      "avgränsad närmast yrkesmässig eller organiserad verksamhet\". Diskuterar också " +
      "uttryckligen hur FLERA häleribrott bör läggas samman till ett samlat straffvärde - " +
      "två alternativa modeller övervägs (en kollektivbrottsmodell och en modell med " +
      "förebild i grov fridskränkning) - vilket gör den till den mest direkt relevanta " +
      "doktrinkällan för just mängdrabatt vid häleri i hela kalkylatorn.",
    brottstyper: ["haleri", "grovt_haleri"],
    granskningsdjup: "fulltext",
  },
  {
    id: "prop-2016-17-108-grovt-ran",
    kalla: "Regeringen",
    titel: "Straffskalorna för vissa allvarliga våldsbrott (Prop. 2016/17:108)",
    kalla_url:
      "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/proposition/straffskalorna-for-vissa-allvarliga-valdsbrott_H403108/html/",
    sammanfattning:
      "Propositionen höjde minimistraffet för grovt rån (8 kap. 6 § BrB) från fängelse " +
      "fyra år till fängelse fem år, i kraft sedan 2017-07-01. Samtidigt övervägdes och " +
      "avvisades uttryckligen en motsvarande höjning för rån av normalgraden (8 kap. 5 §): " +
      "\"Minimistraffet för rån bör därför lämnas oförändrat\", eftersom normalgradens rån " +
      "omfattar handlande av avsevärt mer skiftande karaktär än grovt rån och därför " +
      "behöver en vidare straffskala för nyanserad bedömning. Direkt förarbete till " +
      "gradindelningen mellan rån och grovt rån, vilket är avgörande för vilken " +
      "straffskala (och därmed vilket tak enligt 26 kap. 2 § BrB) som blir relevant vid " +
      "flerfaldiga rånbrott.",
    brottstyper: ["ran", "grovt_ran"],
    granskningsdjup: "fulltext",
  },
  {
    // Hittad via sökmotorutdrag - INTE öppnad och läst i sin helhet, samma
    // lawline.se/robots.txt-spärr som för övriga Lawline-poster ovan.
    id: "lawline-vad-ar-straffet-for-forskingring",
    kalla: "Lawline",
    titel: "Vad är straffet för förskingring?",
    kalla_url: "https://lawline.se/answers/vad-ar-straffet-for-forskingring-1",
    sammanfattning:
      "Enligt sökmotorutdraget: går igenom alla tre graderna - förskingring (10 kap. 1 §, " +
      "högst 2 år), ringa förskingring/undandräkt (10 kap. 2 §, böter eller högst 6 " +
      "månader) och grov förskingring (10 kap. 3 §, dåvarande skala lägst 6 månader " +
      "högst 6 år). OBS: minimistraffet för grov förskingring har sedan höjts till 1 år " +
      "av SFS 2026:1318 - artikeln återger den äldre skalan.",
    brottstyper: ["forskingring", "ringa_forskingring", "grov_forskingring"],
    granskningsdjup: "snippet",
  },
  {
    id: "prop-2022-23-53-utpressning",
    kalla: "Regeringen",
    titel: "Skärpta straff för brott i kriminella nätverk (Prop. 2022/23:53)",
    kalla_url:
      "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/proposition/skarpta-straff-for-brott-i-kriminella-natverk_ha0353/html/",
    sammanfattning:
      "Propositionen höjde straffskalan för utpressning (9 kap. 4 § BrB) från högst 2 år " +
      "till högst 3 år, och för grov utpressning från lägst 1 år/högst 6 år till lägst 2 " +
      "år/högst 8 år - i kraft sedan 2023-07-01 (SFS 2023:257). Motiveringen: utpressning " +
      "är \"kännetecknande för, framför allt, sådana lokala kriminella nätverk som driver " +
      "brottsutvecklingen\" och \"har utvecklats till en viktig inkomstkälla\" för många " +
      "kriminella grupper, riktat både mot näringsidkare i utsatta områden och inom den " +
      "kriminella miljön. Förklarar direkt varför NJA 2009 s. 300:s straffvärden (från " +
      "2009, innan denna höjning) ligger lägre än vad samma gärningar skulle bedömas till " +
      "idag.",
    brottstyper: ["utpressning", "grov_utpressning"],
    granskningsdjup: "fulltext",
  },
  {
    // Hittad via sökmotorutdrag - INTE öppnad och läst i sin helhet.
    id: "lawline-pafoljd-utpressning-grov-utpressning",
    kalla: "Lawline",
    titel: "Påföljd för utpressning alternativt grov utpressning",
    kalla_url: "https://www.lawline.se/answers/pafoljd-for-utpressning-alternativt-grov-utpressning",
    sammanfattning:
      "Enligt sökmotorutdraget: går igenom alla tre graderna av utpressning. OBS: " +
      "sökmotorutdraget återger en äldre skala för normalgraden (\"högst två år\") - " +
      "aktuell skala sedan 2023-07-01 är högst tre år, se Prop. 2022/23:53 ovan.",
    brottstyper: ["ringa_utpressning", "utpressning", "grov_utpressning"],
    granskningsdjup: "snippet",
  },
  {
    // Hittad via sökmotorutdrag - INTE öppnad och läst i sin helhet. Ingen referensdom
    // hittades för ocker vid denna sökning: den enda ordentligt belysta moderna NJA-domen
    // (NJA 2013 s. 1130) slutade i FRIKÄNNANDE (HD fastställde hovrättens frikännande),
    // med bara ett straffvärde nämnt av de skiljaktiga justitieråden i minoritet - för
    // missvisande för att tas med som en referensdom här, se README.
    id: "lawline-vad-ar-ocker",
    kalla: "Lawline",
    titel: "Vad innebär brottet \"ocker\"?",
    kalla_url: "https://lawline.se/answers/vad-innebar-brottet-ocker",
    sammanfattning:
      "Enligt sökmotorutdraget: förklarar rekvisiten för ocker (trångmål, oförstånd, " +
      "lättsinne eller beroendeställning som utnyttjas till en förmån i uppenbart " +
      "missförhållande till motprestationen) och gradindelningen mot grovt ocker " +
      "(hävdvunnet, i större omfattning, eller annars avsett betydande värde med särskild " +
      "hänsynslöshet). OBS: sökmotorutdraget återger en äldre skala för grovt ocker " +
      "(\"lägst 6 månader\") - minimistraffet höjdes till 1 år av SFS 2026:1318.",
    brottstyper: ["ocker", "grovt_ocker"],
    granskningsdjup: "snippet",
  },
  {
    // Hittad via sökmotorutdrag - INTE öppnad och läst i sin helhet.
    id: "lawline-pafoljd-troloshet-mot-huvudman",
    kalla: "Lawline",
    titel: "Vad blir påföljden vid trolöshet mot huvudman?",
    kalla_url: "https://lawline.se/answers/vad-blir-pafoljden-vid-troloshet-mot-huvudman",
    sammanfattning:
      "Enligt sökmotorutdraget: går igenom båda graderna - normalgraden (böter eller " +
      "högst 2 år) och grovt brott (lägst 6 månader högst 6 år, missbruk av urkund eller " +
      "vilseledande bokföring, eller betydande/kännbar skada för huvudmannen). OBS: " +
      "sökmotorutdraget återger en äldre skala för grov trolöshet (\"lägst 6 månader\") - " +
      "minimistraffet höjdes till 1 år av SFS 2026:1318, se RH 2019:16 ovan för ett " +
      "flerfaldighetsexempel.",
    brottstyper: ["troloshet_mot_huvudman", "grov_troloshet_mot_huvudman"],
    granskningsdjup: "snippet",
  },
];
