import type { APIRoute } from "astro";
import { Pool } from "pg";

import {
  EarlyAccessStore,
  validateEarlyAccessSubmission,
  VERIFIED_HERONET_BASELINE,
} from "@/lib/early-access";
import { getGooglePlaceDetails, InfisicalSecretResolver } from "@/lib/google-places";

export const prerender = false;

const databaseUrl = process.env.DATABASE_URL;
const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      max: 10,
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 30_000,
    })
  : null;
const store = pool
  ? new EarlyAccessStore({ pool, baselineCount: VERIFIED_HERONET_BASELINE })
  : null;
const secrets = new InfisicalSecretResolver();

export const GET: APIRoute = async () => {
  if (!store) return unavailable();
  try {
    const socialProof = await store.getSocialProof();
    return json({ ok: true, data: socialProof }, 200);
  } catch {
    return unavailable();
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (!store) return unavailable();
  try {
    const rawBody = await request.text();
    if (rawBody.length > 64 * 1024) {
      return json({ ok: false, error: { message: "That request is too large." } }, 413);
    }
    const body = JSON.parse(rawBody) as Record<string, unknown>;
    let googlePlace;
    if (typeof body.googlePlaceId === "string" && body.googlePlaceId.trim()) {
      const apiKey = await secrets.getGooglePlacesApiKey();
      googlePlace = await getGooglePlaceDetails({
        placeId: body.googlePlaceId,
        sessionToken:
          typeof body.googleSessionToken === "string" ? body.googleSessionToken : "",
        apiKey,
      });
    }
    const submission = validateEarlyAccessSubmission({ ...body, googlePlace });
    const result = await store.submit(submission);
    return json({ ok: true, data: result }, result.created ? 201 : 200);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return json(
        { ok: false, error: { message: "Please check the highlighted fields and try again." } },
        400,
      );
    }
    if (error instanceof Error && isSubmissionError(error.message)) {
      return json({ ok: false, error: { message: error.message } }, 400);
    }
    return unavailable();
  }
};

function isSubmissionError(message: string) {
  return message === "Please check the highlighted fields and try again." ||
    message === "Choose a company from the suggestions.";
}

function unavailable() {
  return json(
    { ok: false, error: { message: "Early-access signup is temporarily unavailable." } },
    503,
  );
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
