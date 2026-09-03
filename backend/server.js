// Enkel lokal förhandsgranskningsserver för docs/ - samma statiska filer som GitHub Pages
// kommer att servera. Kör `npm run build` först (eller `npm run build` innehåller alltid
// den senaste exporten) så att docs/data/*.json finns.

import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.static(path.join(__dirname, "..", "docs")));

app.listen(PORT, () => {
  console.log(`Förhandsgranskning körs på http://localhost:${PORT}`);
});
