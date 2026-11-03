import { STOREFRONT_HTML } from "./storefront-html";

export const dynamic = "force-static";

export function GET() {
  return new Response(STOREFRONT_HTML, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
