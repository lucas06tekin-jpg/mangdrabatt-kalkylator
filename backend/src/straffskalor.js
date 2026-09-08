// Hårdkodade straffskalor för förmögenhetsbrott (stöld, bedrägeri, häleri, rån,
// förskingring, utpressning) enligt 8, 9 och 10 kap. brottsbalken (BrB), aktuell lydelse.
// Källa: Brottsbalken (1962:700), verifierad mot Sveriges riksdags författningstext
// (stöld 2026-09-03, bedrägeri 2026-09-05, häleri 2026-09-06, rån 2026-09-08,
// förskingring 2026-09-08, utpressning 2026-09-08) samt den promulgerade texten i SFS
// 2026:1318 för grov stöld, grovt bedrägeri, grovt häleri och grov förskingring (alla
// fyra fick sitt minimistraff höjt från 6 månader till 1 år av samma reform). Grovt råns
// minimistraff (5 år) höjdes redan 2017-07-01 av en tidigare reform (prop. 2016/17:108),
// och grov utpressnings straffskala (2-8 år, upp från en lägre skala) höjdes 2023-07-01
// av SFS 2023:257 (prop. 2022/23:53, "Skärpta straff för brott i kriminella nätverk") -
// ingen av dessa två är alltså SFS 2026:1318. Rån korsverifierat mot NJA 2025:12
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
    id: "forskingring",
    namn: "Förskingring",
    familj: "Förskingring",
    paragraf: "10 kap. 1 § BrB",
    lagtext:
      "Den som på grund av avtal, allmän eller enskild tjänst eller dylik ställning fått " +
      "egendom i besittning för annan med skyldighet att utgiva egendomen eller redovisa " +
      "för denna, genom att tillägna sig egendomen eller annorledes åsidosätter vad han " +
      "har att iakttaga för att kunna fullgöra sin skyldighet, dömes, om gärningen " +
      "innebär vinning för honom och skada för den berättigade, för förskingring till " +
      "fängelse i högst två år.",
    min_manader: 0,
    max_manader: 24,
    skala_text: "Fängelse i högst 2 år",
  },
  {
    // Traditionellt/i doktrinen ofta kallad "undandräkt" - men lagtextens (och
    // riksdagen.se:s konsoliderade författningstexts) egen rubrik för 10 kap. 2 § är
    // "Ringa förskingring", vilket är namnet som används här för konsekvens med övriga
    // "ringa X"-brottstyper (ringa stöld, ringa bedrägeri).
    id: "ringa_forskingring",
    namn: "Ringa förskingring",
    familj: "Förskingring",
    paragraf: "10 kap. 2 § BrB",
    lagtext:
      "Är brott som avses i 1 § med hänsyn till det förskingrades värde och övriga " +
      "omständigheter vid brottet att anse som ringa, döms för ringa förskingring till " +
      "böter eller fängelse i högst sex månader.",
    min_manader: 0,
    max_manader: 6,
    skala_text: "Böter eller fängelse i högst 6 månader",
  },
  {
    id: "grov_forskingring",
    namn: "Grov förskingring",
    familj: "Förskingring",
    paragraf: "10 kap. 3 § BrB",
    lagtext:
      "Om brott som avses i 1 § är att anse som grovt, döms för grov förskingring till " +
      "fängelse i lägst ett och högst sex år.",
    min_manader: 12,
    max_manader: 72,
    skala_text: "Fängelse i lägst 1 år och högst 6 år",
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
