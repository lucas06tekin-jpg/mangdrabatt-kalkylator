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
      "bedrägeri med stulet bankkort (ca 265 800 kr) samt narkotikainnehav.",
    straffvarde_text:
      "Påföljd: fängelse 2 år 3 månader. HD prövade om de upprepade stölderna skulle " +
      "rubriceras som grov stöld och fann att ordinarie stöld var korrekt rubricering trots " +
      "det systematiska tillvägagångssättet.",
    brottstyper: ["stold"],
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
    granskningsdjup: "fulltext",
  },
];
