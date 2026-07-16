import type { APIRoute } from "astro";

import { submitHeroNetStorefrontOrder } from "@/lib/heronet-storefront";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const baseUrl = import.meta.env.HERONET_STOREFRONT_API_URL;
  const apiKey = import.meta.env.HERONET_STOREFRONT_API_KEY;
  if (!baseUrl || !apiKey) {
    return json({ ok: false, error: { message: "Ordering is not configured yet." } }, 503);
  }
  try {
    const payload = await request.json();
    const data = await submitHeroNetStorefrontOrder({ baseUrl, apiKey, payload });
    return json({ ok: true, data }, data.replayed ? 200 : 202);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Order submission failed.";
    return json({ ok: false, error: { message } }, 400);
  }
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
