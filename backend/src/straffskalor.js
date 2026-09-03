// Hårdkodade straffskalor för stöldbrott enligt 8 kap. brottsbalken (BrB), aktuell lydelse.
// Källa: Brottsbalken (1962:700), verifierad mot Sveriges riksdags författningstext 2026-09-03.

export const STRAFFSKALOR = [
  {
    id: "ringa_stold",
    namn: "Ringa stöld",
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
    paragraf: "8 kap. 4 a § BrB",
    lagtext:
      "Om brott som avses i 1 § har skett efter intrång i bostad eller annat " +
      "liknande boende, döms för inbrottsstöld till fängelse i lägst ett och högst sex år.",
    min_manader: 12,
    max_manader: 72,
    skala_text: "Fängelse i lägst 1 år och högst 6 år",
  },
];

// 26 kap. 2 § BrB — gemensamt straff vid flerfaldig brottslighet.
// Golv: det strängaste av minimistraffen för de ingående brotten.
// Tak: det svåraste maximistraffet + tillägg, men aldrig mer än summan av maximistraffen
// och aldrig mer än 18 år (216 månader) fängelse på viss tid (26 kap. 1 § BrB).
export const TAK_ALLMANT_MANADER = 216; // 18 år

export function tillaggManader(svarasteMaxManader) {
  if (svarasteMaxManader < 48) return 12; // kortare än 4 år
  if (svarasteMaxManader < 96) return 24; // 4 år men kortare än 8 år
  return 48; // 8 år eller längre
}
