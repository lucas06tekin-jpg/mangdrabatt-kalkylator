// Uppdaterar cachen och skriver om docs/data/*.json - kör detta innan `git push` för att
// publicera nya referensdomar/förklarande källor till den statiska GitHub Pages-sajten.

import { uppdateraCache } from "./src/scraper.js";
import { exportStatic } from "./src/exportStatic.js";

const cacheResultat = await uppdateraCache();
const exportResultat = exportStatic();

console.log("Cache uppdaterad:", JSON.stringify(cacheResultat, null, 2));
console.log("Statiska filer exporterade:", JSON.stringify(exportResultat, null, 2));
