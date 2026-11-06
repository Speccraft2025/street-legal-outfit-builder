import { DROP_HTML } from "../storefront-html";

export const dynamic = "force-static";

export function GET() {
  return new Response(DROP_HTML, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
