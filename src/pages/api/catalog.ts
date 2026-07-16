import type { APIRoute } from "astro";
import { PHONE_HARDWARE, PRICE_OFFERS, TERMINAL_HARDWARE } from "@/content/pricing";
import { fetchHeroNetCatalog } from "@/lib/heronet-storefront";

export const prerender = false;

export const GET: APIRoute = async () => {
  const baseUrl = import.meta.env.HERONET_STOREFRONT_API_URL;
  const apiKey = import.meta.env.HERONET_STOREFRONT_API_KEY;
  if (baseUrl && apiKey) {
    try {
      const catalog = await fetchHeroNetCatalog({ baseUrl, apiKey });
      return response({ ...catalog, hardware: { phones: PHONE_HARDWARE, terminals: TERMINAL_HARDWARE } }, "private, max-age=60");
    } catch (error) {
      if (import.meta.env.SIDEKICK_USE_CATALOG_FIXTURE !== "true") {
        return response({ ok: false, error: { message: error instanceof Error ? error.message : "Catalog unavailable." } }, "no-store", 503);
      }
    }
  }
  if (import.meta.env.SIDEKICK_USE_CATALOG_FIXTURE !== "true") {
    return response({ ok: false, error: { message: "Catalog is not configured yet." } }, "no-store", 503);
  }
  return response({ version:"fixture-2026-07-16",countries:["CA","US"],offers:PRICE_OFFERS,hardware:{phones:PHONE_HARDWARE,terminals:TERMINAL_HARDWARE}}, "private, max-age=60");
};

function response(body: unknown, cacheControl: string, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers:{"content-type":"application/json; charset=utf-8","cache-control":cacheControl} });
}
