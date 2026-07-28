import { describe, expect, it, vi } from "vitest";

import {
  autocompleteCompanies,
  getGooglePlaceDetails,
  InfisicalSecretResolver,
} from "@/lib/google-places";

describe("Infisical Google Places key resolution", () => {
  it("logs in with Universal Auth and reads the current key from sm.heroit.ca", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async (input) => {
      const url = String(input);
      if (url.endsWith("/api/v1/auth/universal-auth/login")) {
        return Response.json({ accessToken: "short-lived-token", expiresIn: 3600, accessTokenMaxTTL: 3600, tokenType: "Bearer" });
      }
      if (url.includes("/api/v4/secrets/GOOGLE_PLACES_API_KEY")) {
        return Response.json({ secret: { secretKey: "GOOGLE_PLACES_API_KEY", secretValue: "rotated-google-key" } });
      }
      return new Response("not found", { status: 404 });
    });
    const resolver = new InfisicalSecretResolver({
      env: {
        INFISICAL_API_URL: "https://sm.heroit.ca",
        INFISICAL_CLIENT_ID: "sidekick-client",
        INFISICAL_CLIENT_SECRET: "sidekick-secret",
        INFISICAL_PROJECT_ID: "project-id",
        INFISICAL_ENVIRONMENT: "prod",
        INFISICAL_SECRET_PATH: "/",
      },
      fetchImpl,
    });

    await expect(resolver.getGooglePlacesApiKey()).resolves.toBe("rotated-google-key");

    const secretUrl = new URL(String(fetchImpl.mock.calls[1]?.[0]));
    expect(secretUrl.origin).toBe("https://sm.heroit.ca");
    expect(secretUrl.searchParams.get("projectId")).toBe("project-id");
    expect(secretUrl.searchParams.get("environment")).toBe("prod");
  });

  it("refreshes the Infisical value after the short cache expires", async () => {
    let now = 1_000;
    let version = 0;
    const fetchImpl = vi.fn<typeof fetch>(async (input) => {
      if (String(input).endsWith("/api/v1/auth/universal-auth/login")) {
        return Response.json({ accessToken: `token-${version}`, expiresIn: 3600, accessTokenMaxTTL: 3600, tokenType: "Bearer" });
      }
      version += 1;
      return Response.json({ secret: { secretValue: `google-key-${version}` } });
    });
    const resolver = new InfisicalSecretResolver({
      env: {
        INFISICAL_CLIENT_ID: "client",
        INFISICAL_CLIENT_SECRET: "secret",
        INFISICAL_PROJECT_ID: "project",
      },
      fetchImpl,
      now: () => now,
      cacheTtlMs: 300_000,
    });

    await expect(resolver.getGooglePlacesApiKey()).resolves.toBe("google-key-1");
    await expect(resolver.getGooglePlacesApiKey()).resolves.toBe("google-key-1");
    now += 300_001;
    await expect(resolver.getGooglePlacesApiKey()).resolves.toBe("google-key-2");
  });
});

describe("Google Places server bridge", () => {
  it("restricts company suggestions to Canada and the United States", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () =>
      Response.json({
        suggestions: [
          {
            placePrediction: {
              placeId: "place-1",
              text: { text: "Taylor Repair, Calgary, AB, Canada" },
              structuredFormat: {
                mainText: { text: "Taylor Repair" },
                secondaryText: { text: "Calgary, AB, Canada" },
              },
              types: ["car_repair", "establishment"],
            },
          },
        ],
      }),
    );

    const results = await autocompleteCompanies({
      input: "Taylor Rep",
      sessionToken: "session-1",
      apiKey: "google-key",
      fetchImpl,
    });

    expect(results).toEqual([
      {
        placeId: "place-1",
        fullText: "Taylor Repair, Calgary, AB, Canada",
        primaryText: "Taylor Repair",
        secondaryText: "Calgary, AB, Canada",
      },
    ]);
    const request = fetchImpl.mock.calls[0]?.[1];
    expect(JSON.parse(String(request?.body))).toMatchObject({
      input: "Taylor Rep",
      includedRegionCodes: ["ca", "us"],
      sessionToken: "session-1",
      includePureServiceAreaBusinesses: true,
    });
  });

  it("returns the complete raw Place Details payload for CSV persistence", async () => {
    const raw = {
      id: "place-1",
      displayName: { text: "Taylor Repair", languageCode: "en" },
      formattedAddress: "123 Main Street, Calgary, AB, Canada",
      addressComponents: [{ longText: "Canada", shortText: "CA", types: ["country"] }],
      location: { latitude: 51.0447, longitude: -114.0719 },
      businessStatus: "OPERATIONAL",
      primaryType: "car_repair",
      types: ["car_repair", "establishment"],
      websiteUri: "https://example.test",
      nationalPhoneNumber: "(403) 555-0100",
      googleMapsUri: "https://maps.google.com/?cid=123",
    };
    const fetchImpl = vi.fn<typeof fetch>(async () => Response.json(raw));

    const result = await getGooglePlaceDetails({
      placeId: "place-1",
      sessionToken: "session-1",
      apiKey: "google-key",
      fetchImpl,
    });

    expect(result).toMatchObject({
      placeId: "place-1",
      displayName: "Taylor Repair",
      formattedAddress: "123 Main Street, Calgary, AB, Canada",
      raw,
    });
  });
});
