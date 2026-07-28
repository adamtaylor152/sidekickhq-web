import type { APIRoute } from "astro";

import { autocompleteCompanies, InfisicalSecretResolver } from "@/lib/google-places";

export const prerender = false;

const secrets = new InfisicalSecretResolver();

export const GET: APIRoute = async ({ url }) => {
  const input = (url.searchParams.get("input") || "").trim().slice(0, 160);
  const sessionToken = (url.searchParams.get("sessionToken") || "").trim().slice(0, 100);
  if (input.length < 2 || !sessionToken) {
    return json({ ok: true, data: { suggestions: [] } }, 200);
  }
  try {
    const apiKey = await secrets.getGooglePlacesApiKey();
    const suggestions = await autocompleteCompanies({ input, sessionToken, apiKey });
    return json({ ok: true, data: { suggestions } }, 200);
  } catch {
    return json(
      {
        ok: false,
        error: {
          message: "Company suggestions are unavailable. You can still enter your company manually.",
        },
      },
      503,
    );
  }
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
