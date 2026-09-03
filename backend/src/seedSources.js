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
      "bedrägeri med stulet bankkort (ca 265 800 kr) samt narkotikainnehav.",
    straffvarde_text:
      "Påföljd: fängelse 2 år 3 månader. HD prövade om de upprepade stölderna skulle " +
      "rubriceras som grov stöld och fann att ordinarie stöld var korrekt rubricering trots " +
      "det systematiska tillvägagångssättet.",
    brottstyper: ["stold"],
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
    verifieringsstatus: "manuell_pressmeddelande",
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
  },
];
