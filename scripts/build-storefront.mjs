// Inlines the standalone HTML pages from /public into a module so they can be served from
// route handlers (Netlify doesn't apply next.config rewrites to static public files).
//   public/storefront.html -> "/"      (src/app/route.ts)
//   public/drop.html       -> "/drop"  (src/app/drop/route.ts)
import { readFileSync, writeFileSync } from "node:fs";
const read = (f) => readFileSync(new URL(`../public/${f}`, import.meta.url), "utf8");
writeFileSync(
  new URL("../src/app/storefront-html.ts", import.meta.url),
  `// Generated from /public/*.html by scripts/build-storefront.mjs — edit the HTML, not this file.\n` +
    `export const STOREFRONT_HTML = ${JSON.stringify(read("storefront.html"))};\n` +
    `export const DROP_HTML = ${JSON.stringify(read("drop.html"))};\n`,
);
