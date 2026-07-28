import { join } from "node:path";
import type { APIRoute } from "astro";

import {
  EarlyAccessStore,
  validateEarlyAccessSubmission,
  VERIFIED_HERONET_BASELINE,
} from "@/lib/early-access";
import { getGooglePlaceDetails, InfisicalSecretResolver } from "@/lib/google-places";

export const prerender = false;

const dataDirectory =
  process.env.EARLY_ACCESS_DATA_DIR ||
  (process.env.NODE_ENV === "production" ? "/data" : join(process.cwd(), ".data"));
const store = new EarlyAccessStore({
  sqlitePath: join(dataDirectory, "early-access.sqlite"),
  csvPath: join(dataDirectory, "early-access.csv"),
  baselineCount: VERIFIED_HERONET_BASELINE,
});
const secrets = new InfisicalSecretResolver();

export const GET: APIRoute = async () => {
  const socialProof = await store.getSocialProof();
  return json({ ok: true, data: socialProof }, 200);
};

export const POST: APIRoute = async ({ request }) => {
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
    const message =
      error instanceof SyntaxError
        ? "Please check the highlighted fields and try again."
        : error instanceof Error
          ? error.message
          : "Early-access signup is temporarily unavailable.";
    return json({ ok: false, error: { message } }, 400);
  }
};

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
