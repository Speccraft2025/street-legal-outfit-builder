// Inlines public/storefront.html into a module so "/" can serve it from a route handler
// (Netlify doesn't apply next.config rewrites to static public files).
import { readFileSync, writeFileSync } from "node:fs";
const html = readFileSync(new URL("../public/storefront.html", import.meta.url), "utf8");
writeFileSync(
  new URL("../src/app/storefront-html.ts", import.meta.url),
  `// Generated from public/storefront.html by scripts/build-storefront.mjs — edit the HTML, not this file.\nexport const STOREFRONT_HTML = ${JSON.stringify(html)};\n`,
);
