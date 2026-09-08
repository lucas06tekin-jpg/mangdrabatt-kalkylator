// Hårdkodade straffskalor. Ursprungligen bara förmögenhetsbrott (stöld, bedrägeri,
// häleri, rån, utpressning, ocker, olovligt förfogande, trolöshet mot huvudman - 8, 9
// och 10 kap. BrB), men utökad 2026-09-08 med tre brottsfamiljer utanför
// förmögenhetsbrottskategorin (misshandel, olaga hot, narkotikabrott) på uttrycklig
// begäran - appens NAMN och inramning förblir "förmögenhetsbrottslighet"-fokuserat, men
// brottstypslistan är inte längre begränsad till den kategorin. Källa: Brottsbalken
// (1962:700) och, för narkotikabrott, narkotikastrafflagen (1968:64) - båda verifierade
// mot Sveriges riksdags författningstext.
//
// Förskingring och tillgrepp av fortskaffningsmedel lades till 2026-09-08 men togs bort
// samma dag efter en genomgång av vilka brott som faktiskt passar en
// mängdrabatt-kalkylator: forskningen visade att upprepad förskingring i praxis
// genomgående behandlas som ETT sammanhållet brott (brottsenhet) snarare än flerfaldig
// brottslighet (NJA 1992 s. 470, RH 1996:42), och att tillgrepp av fortskaffningsmedel
// oftast förekommer vid ett enda tillfälle i kombination med andra brott snarare än
// upprepat - se README:s git-historik för detaljer om researchen bakom borttagningen.
//
// Reformhistorik (viktigt att inte anta att alla "grovt X"-golv kommer från samma
// reform): SFS 2026:1318 höjde minimistraffet från 6 månader till 1 år för grov stöld,
// grovt bedrägeri, grovt häleri, grovt ocker och grov trolöshet mot huvudman (samma
// reform). Grovt råns minimistraff (5 år) höjdes i stället 2017-07-01 (prop. 2016/17:108). Grov
// utpressning (2-8 år) höjdes 2023-07-01 av SFS 2023:257 (prop. 2022/23:53) - SAMMA
// reform höjde även grovt olaga hot (4 kap. 5 § andra stycket) och narkotikabrotts
// försäljningsgolv (6 månader, SFS 2023:258, samma proposition). Grovt olovligt
// förfogande som eget gradindelat brott infördes 2017-07-01 av SFS 2017:442 (prop.
// 2016/17:131, samma som skärpte grovt bedrägeri). Rån korsverifierat mot NJA 2025:12
// ("Jackan"), som citerar 8 kap. 5 § fjärde stycket ordagrant.

export const STRAFFSKALOR = [
  {
    id: "ringa_stold",
    namn: "Ringa stöld",
    familj: "Stöld",
    paragraf: "8 kap. 2 § BrB",
    lagtext:
      "Är brott som avses i 1 § med hänsyn till det tillgripnas värde och övriga " +
      "omständigheter vid brottet att anse som ringa, döms för ringa stöld till böter " +
      "eller fängelse i högst sex månader.",
    min_manader: 0,
    max_manader: 6,
    skala_text: "Böter eller fängelse i högst 6 månader",
  },
  {
    id: "stold",
    namn: "Stöld",
    familj: "Stöld",
    paragraf: "8 kap. 1 § BrB",
    lagtext:
      "Den som olovligen tager vad annan tillhör med uppsåt att tillägna sig det, " +
      "dömes, om tillgreppet innebär skada, för stöld till fängelse i högst två år.",
    min_manader: 0,
    max_manader: 24,
    skala_text: "Fängelse i högst 2 år",
  },
  {
    id: "grov_stold",
    namn: "Grov stöld",
    familj: "Stöld",
    paragraf: "8 kap. 4 § BrB",
    lagtext:
      "Är brott som avses i 1 § att anse som grovt, döms för grov stöld till " +
      "fängelse i lägst ett och högst sex år.",
    min_manader: 12,
    max_manader: 72,
    skala_text: "Fängelse i lägst 1 år och högst 6 år",
  },
  {
    id: "inbrottsstold",
    namn: "Inbrottsstöld",
    familj: "Stöld",
    paragraf: "8 kap. 4 a § BrB",
    lagtext:
      "Om brott som avses i 1 § har skett efter intrång i bostad eller annat " +
      "liknande boende, döms för inbrottsstöld till fängelse i lägst ett och högst sex år.",
    min_manader: 12,
    max_manader: 72,
    skala_text: "Fängelse i lägst 1 år och högst 6 år",
  },
  {
    id: "ringa_bedrageri",
    namn: "Ringa bedrägeri",
    familj: "Bedrägeri",
    paragraf: "9 kap. 2 § BrB",
    lagtext:
      "Är brott som avses i 1 § med hänsyn till skadans omfattning och övriga " +
      "omständigheter vid brottet att anse som ringa, döms för ringa bedrägeri till " +
      "böter eller fängelse i högst sex månader.",
    min_manader: 0,
    max_manader: 6,
    skala_text: "Böter eller fängelse i högst 6 månader",
  },
  {
    id: "bedrageri",
    namn: "Bedrägeri",
    familj: "Bedrägeri",
    paragraf: "9 kap. 1 § BrB",
    lagtext:
      "Den som medelst vilseledande förmår någon till handling eller underlåtenhet, " +
      "som innebär vinning för gärningsmannen och skada för den vilseledde eller någon " +
      "i vars ställe denne är, dömes för bedrägeri till fängelse i högst två år.",
    min_manader: 0,
    max_manader: 24,
    skala_text: "Fängelse i högst 2 år",
  },
  {
    id: "grovt_bedrageri",
    namn: "Grovt bedrägeri",
    familj: "Bedrägeri",
    paragraf: "9 kap. 3 § BrB",
    lagtext:
      "Är brott som avses i 1 § att anse som grovt, döms för grovt bedrägeri till " +
      "fängelse i lägst ett och högst sex år.",
    min_manader: 12,
    max_manader: 72,
    skala_text: "Fängelse i lägst 1 år och högst 6 år",
  },
  {
    id: "haleriforseelse",
    namn: "Häleriförseelse",
    familj: "Häleri",
    paragraf: "9 kap. 7 § BrB",
    lagtext:
      "Om brott som avses i 6 eller 6 a § är ringa, döms för häleriförseelse till " +
      "böter eller fängelse i högst sex månader.",
    min_manader: 0,
    max_manader: 6,
    skala_text: "Böter eller fängelse i högst 6 månader",
  },
  {
    id: "haleri",
    namn: "Häleri",
    familj: "Häleri",
    paragraf: "9 kap. 6 § BrB",
    lagtext:
      "Den som 1. på ett sätt som är ägnat att försvåra ett återställande tar " +
      "befattning med något som är frånhänt annan genom brott, 2. bereder sig " +
      "otillbörlig vinning av annans brottsliga förvärv, eller 3. genom krav, " +
      "överlåtelse eller på annat liknande sätt hävdar genom brott tillkommen fordran " +
      "döms för häleri till fängelse i högst två år.",
    min_manader: 0,
    max_manader: 24,
    skala_text: "Fängelse i högst 2 år",
  },
  {
    id: "grovt_haleri",
    namn: "Grovt häleri",
    familj: "Häleri",
    paragraf: "9 kap. 6 § BrB",
    lagtext:
      "Är brott som avses i första eller andra stycket grovt, döms för grovt häleri " +
      "till fängelse i lägst ett och högst sex år.",
    min_manader: 12,
    max_manader: 72,
    skala_text: "Fängelse i lägst 1 år och högst 6 år",
  },
  {
    id: "ran",
    namn: "Rån",
    familj: "Rån",
    paragraf: "8 kap. 5 § BrB",
    lagtext:
      "Den som med våld på person eller med hot som innebär eller för den hotade " +
      "framstår som trängande fara begår stöld, döms för rån till fängelse i lägst ett " +
      "år och sex månader och högst sex år. Är gärningen med hänsyn till våldet, hotet " +
      "eller omständigheterna i övrigt av mindre allvarlig art, döms dock inte för rån " +
      "utan för annat brott som gärningen innefattar (8 kap. 5 § fjärde stycket).",
    min_manader: 18,
    max_manader: 72,
    skala_text: "Fängelse i lägst 1 år 6 månader och högst 6 år",
  },
  {
    id: "grovt_ran",
    namn: "Grovt rån",
    familj: "Rån",
    paragraf: "8 kap. 6 § BrB",
    lagtext:
      "Är brott som avses i 5 § grovt, döms för grovt rån till fängelse i lägst fem och " +
      "högst tio år. Vid bedömningen av om brottet är grovt ska det särskilt beaktas om " +
      "våldet varit livsfarligt, om gärningsmannen tillfogat svår kroppsskada eller " +
      "allvarlig sjukdom eller annars visat synnerlig råhet eller på ett hänsynslöst " +
      "sätt utnyttjat den rånades skyddslösa eller utsatta ställning, eller om gärningen " +
      "varit av särskilt farlig art.",
    min_manader: 60,
    max_manader: 120,
    skala_text: "Fängelse i lägst 5 år och högst 10 år",
  },
  {
    id: "ringa_utpressning",
    namn: "Ringa utpressning",
    familj: "Utpressning",
    paragraf: "9 kap. 4 § första stycket BrB",
    lagtext:
      "Är brott som avses i 9 kap. 4 § första stycket ringa, döms för ringa utpressning " +
      "till böter eller fängelse i högst sex månader.",
    min_manader: 0,
    max_manader: 6,
    skala_text: "Böter eller fängelse i högst 6 månader",
  },
  {
    id: "utpressning",
    namn: "Utpressning",
    familj: "Utpressning",
    paragraf: "9 kap. 4 § första stycket BrB",
    lagtext:
      "Den som genom olaga tvång förmår någon till handling eller underlåtenhet som " +
      "innebär vinning för gärningsmannen och skada för den tvingade eller någon i vars " +
      "ställe denne är döms, om inte brottet är att anse som rån eller grovt rån, för " +
      "utpressning till fängelse i högst tre år.",
    min_manader: 0,
    max_manader: 36,
    skala_text: "Fängelse i högst 3 år",
  },
  {
    id: "grov_utpressning",
    namn: "Grov utpressning",
    familj: "Utpressning",
    paragraf: "9 kap. 4 § andra stycket BrB",
    lagtext:
      "Är brottet grovt, döms för grov utpressning till fängelse i lägst två och högst " +
      "åtta år. Vid bedömningen av om brottet är grovt ska det särskilt beaktas om " +
      "gärningen innefattat våld av allvarligt slag eller hot som påtagligt förstärkts " +
      "med hjälp av vapen, sprängämne eller vapenattrapp eller genom anspelning på ett " +
      "våldskapital eller som annars varit av allvarligt slag, eller om gärningen annars " +
      "varit av särskilt hänsynslös eller farlig art.",
    min_manader: 24,
    max_manader: 96,
    skala_text: "Fängelse i lägst 2 år och högst 8 år",
  },
  {
    id: "ocker",
    namn: "Ocker",
    familj: "Ocker",
    paragraf: "9 kap. 5 § BrB",
    lagtext:
      "Den som vid avtal eller någon annan rättshandling utnyttjar någons trångmål, " +
      "oförstånd, lättsinne eller beroendeställning till att bereda sig förmån, som står " +
      "i uppenbart missförhållande till motprestationen eller för vilken motprestation " +
      "inte ska lämnas, döms för ocker till böter eller fängelse i högst två år.",
    min_manader: 0,
    max_manader: 24,
    skala_text: "Böter eller fängelse i högst 2 år",
  },
  {
    id: "grovt_ocker",
    namn: "Grovt ocker",
    familj: "Ocker",
    paragraf: "9 kap. 5 § BrB",
    lagtext:
      "Är brottet grovt, döms för grovt ocker till fängelse i lägst ett och högst sex år.",
    min_manader: 12,
    max_manader: 72,
    skala_text: "Fängelse i lägst 1 år och högst 6 år",
  },
  {
    id: "olovligt_forfogande",
    namn: "Olovligt förfogande",
    familj: "Olovligt förfogande",
    paragraf: "10 kap. 4 § första stycket BrB",
    lagtext:
      "Den som i annat fall än som anges i 1, 2 eller 3 § vidtar åtgärd med egendom, " +
      "som han eller hon har i besittning men till vilken ägande- eller säkerhetsrätt är " +
      "förbehållen eller tillförsäkrad eller annars tillkommer någon annan, varigenom " +
      "egendomen frånhänds den andre eller denne på annat sätt berövas sin rätt, döms för " +
      "olovligt förfogande till böter eller fängelse i högst ett år.",
    min_manader: 0,
    max_manader: 12,
    skala_text: "Böter eller fängelse i högst 1 år",
  },
  {
    id: "grovt_olovligt_forfogande",
    namn: "Grovt olovligt förfogande",
    familj: "Olovligt förfogande",
    paragraf: "10 kap. 4 § andra stycket BrB",
    lagtext:
      "Är brottet grovt, döms för grovt olovligt förfogande till fängelse i lägst sex " +
      "månader och högst fyra år.",
    min_manader: 6,
    max_manader: 48,
    skala_text: "Fängelse i lägst 6 månader och högst 4 år",
  },
  {
    id: "troloshet_mot_huvudman",
    namn: "Trolöshet mot huvudman",
    familj: "Trolöshet mot huvudman",
    paragraf: "10 kap. 5 § första stycket BrB",
    lagtext:
      "Om någon, som på grund av förtroendeställning fått till uppgift att för någon " +
      "annan sköta en ekonomisk angelägenhet eller självständigt hantera en kvalificerad " +
      "teknisk uppgift eller övervaka skötseln av en sådan angelägenhet eller uppgift, " +
      "missbrukar sin förtroendeställning och därigenom skadar huvudmannen, döms han " +
      "eller hon för trolöshet mot huvudman till böter eller fängelse i högst två år.",
    min_manader: 0,
    max_manader: 24,
    skala_text: "Böter eller fängelse i högst 2 år",
  },
  {
    id: "grov_troloshet_mot_huvudman",
    namn: "Grov trolöshet mot huvudman",
    familj: "Trolöshet mot huvudman",
    paragraf: "10 kap. 5 § andra stycket BrB",
    lagtext:
      "Är brottet grovt, döms för grov trolöshet mot huvudman till fängelse i lägst ett " +
      "och högst sex år.",
    min_manader: 12,
    max_manader: 72,
    skala_text: "Fängelse i lägst 1 år och högst 6 år",
  },
  {
    id: "ringa_misshandel",
    namn: "Ringa misshandel",
    familj: "Misshandel",
    paragraf: "3 kap. 5 § BrB",
    lagtext:
      "Den som tillfogar en annan person kroppsskada, sjukdom eller smärta eller " +
      "försätter honom eller henne i vanmakt eller något annat sådant tillstånd, döms " +
      "för misshandel till fängelse i högst två år eller, om brottet är ringa, till " +
      "böter eller fängelse i högst sex månader.",
    min_manader: 0,
    max_manader: 6,
    skala_text: "Böter eller fängelse i högst 6 månader",
  },
  {
    id: "misshandel",
    namn: "Misshandel",
    familj: "Misshandel",
    paragraf: "3 kap. 5 § BrB",
    lagtext:
      "Den som tillfogar en annan person kroppsskada, sjukdom eller smärta eller " +
      "försätter honom eller henne i vanmakt eller något annat sådant tillstånd, döms " +
      "för misshandel till fängelse i högst två år eller, om brottet är ringa, till " +
      "böter eller fängelse i högst sex månader.",
    min_manader: 0,
    max_manader: 24,
    skala_text: "Fängelse i högst 2 år",
  },
  {
    id: "grov_misshandel",
    namn: "Grov misshandel",
    familj: "Misshandel",
    paragraf: "3 kap. 6 § första stycket BrB",
    lagtext:
      "Är brott som avses i 5 § att anse som grovt, döms för grov misshandel till " +
      "fängelse i lägst ett år och sex månader och högst sju år.",
    min_manader: 18,
    max_manader: 84,
    skala_text: "Fängelse i lägst 1 år 6 månader och högst 7 år",
  },
  {
    id: "synnerligen_grov_misshandel",
    namn: "Synnerligen grov misshandel",
    familj: "Misshandel",
    paragraf: "3 kap. 6 § andra stycket BrB",
    lagtext:
      "Är brottet att anse som synnerligen grovt, döms för synnerligen grov misshandel " +
      "till fängelse i lägst sex och högst tolv år.",
    min_manader: 72,
    max_manader: 144,
    skala_text: "Fängelse i lägst 6 år och högst 12 år",
  },
  {
    id: "olaga_hot",
    namn: "Olaga hot",
    familj: "Olaga hot",
    paragraf: "4 kap. 5 § första stycket BrB",
    lagtext:
      "Den som hotar någon annan med brottslig gärning på ett sätt som är ägnat att hos " +
      "den hotade framkalla allvarlig rädsla för egen eller annans säkerhet till person, " +
      "egendom, frihet eller frid, döms för olaga hot till böter eller fängelse i högst " +
      "två år.",
    min_manader: 0,
    max_manader: 24,
    skala_text: "Böter eller fängelse i högst 2 år",
  },
  {
    id: "grovt_olaga_hot",
    namn: "Grovt olaga hot",
    familj: "Olaga hot",
    paragraf: "4 kap. 5 § andra stycket BrB",
    lagtext:
      "Om brottet är grovt döms för grovt olaga hot till fängelse i lägst ett och högst " +
      "fyra år.",
    min_manader: 12,
    max_manader: 48,
    skala_text: "Fängelse i lägst 1 år och högst 4 år",
  },
  {
    id: "ringa_narkotikabrott",
    namn: "Ringa narkotikabrott",
    familj: "Narkotikabrott",
    paragraf: "2 § narkotikastrafflagen (1968:64)",
    lagtext:
      "Är brott som avses i 1 § första stycket med hänsyn till arten och mängden " +
      "narkotika samt övriga omständigheter att anse som ringa, döms för ringa " +
      "narkotikabrott till böter eller fängelse i högst sex månader.",
    min_manader: 0,
    max_manader: 6,
    skala_text: "Böter eller fängelse i högst 6 månader",
  },
  {
    id: "narkotikabrott",
    namn: "Narkotikabrott",
    familj: "Narkotikabrott",
    paragraf: "1 § narkotikastrafflagen (1968:64)",
    lagtext:
      "Den som olovligen överlåter narkotika, framställer narkotika som är avsedd för " +
      "missbruk, förvärvar narkotika i överlåtelsesyfte, eller innehar, brukar eller tar " +
      "annan befattning med narkotika döms för narkotikabrott till fängelse i högst tre " +
      "år (första stycket). Den som säljer narkotika eller annars befattar sig med " +
      "narkotika som är avsedd att säljas, eller bjuder ut narkotika till försäljning, " +
      "döms till fängelse i lägst sex månader och högst tre år (andra och tredje " +
      "styckena). Denna straffskala använder första styckets vidare intervall (0-3 år) " +
      "som en förenkling - försäljningsrelaterade gärningar har i praktiken ett golv på " +
      "6 månader som inte återges separat här.",
    min_manader: 0,
    max_manader: 36,
    skala_text: "Fängelse i högst 3 år (försäljning: lägst 6 månader)",
  },
  {
    id: "grovt_narkotikabrott",
    namn: "Grovt narkotikabrott",
    familj: "Narkotikabrott",
    paragraf: "3 § narkotikastrafflagen (1968:64)",
    lagtext:
      "Är brott som avses i 1 § att anse som grovt, döms för grovt narkotikabrott till " +
      "fängelse i lägst två och högst sju år.",
    min_manader: 24,
    max_manader: 84,
    skala_text: "Fängelse i lägst 2 år och högst 7 år",
  },
  {
    id: "synnerligen_grovt_narkotikabrott",
    namn: "Synnerligen grovt narkotikabrott",
    familj: "Narkotikabrott",
    paragraf: "3 § narkotikastrafflagen (1968:64)",
    lagtext:
      "Är brottet att anse som synnerligen grovt, döms för synnerligen grovt " +
      "narkotikabrott till fängelse i lägst sex och högst tio år.",
    min_manader: 72,
    max_manader: 120,
    skala_text: "Fängelse i lägst 6 år och högst 10 år",
  },
];

// 26 kap. 2 § BrB — gemensamt straff vid flerfaldig brottslighet, i lydelsen efter
// SFS 2026:1318 (prop. 2025/26:218), i kraft sedan den 1 augusti 2026. Verifierad mot
// den promulgerade lagtexten 2026-09-03.
//
// Tak: det högsta maximistraffet bland de ingående brotten får dubbleras, men aldrig
// överstiga summan av maximistraffen för brotten och aldrig 18 år (216 månader).
// Den äldre tilläggsmodellen (+1/+2/+4 år beroende på hur strängt det svåraste straffet
// var) är avskaffad och ersatt av denna enkla dubbleringsregel.
//
// Golv: den tidigare regeln om att straffet inte fick underskrida det strängaste av
// minimistraffen bland brotten togs bort i samma reform. Kvar är bara det allmänna
// golvet i 26 kap. 1 § BrB - fängelse på viss tid får inte understiga en månad.
export const TAK_ALLMANT_MANADER = 216; // 18 år
export const ALLMANT_GOLV_MANADER = 1; // 26 kap. 1 § BrB

export function takManader(summaMaxManader, svarasteMaxManader) {
  return Math.min(summaMaxManader, svarasteMaxManader * 2, TAK_ALLMANT_MANADER);
}
