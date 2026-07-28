import type { Pool } from "pg";
import { newDb } from "pg-mem";
import { afterEach, describe, expect, it } from "vitest";

import {
  EarlyAccessStore,
  validateEarlyAccessSubmission,
} from "@/lib/early-access";

const pools: Pool[] = [];

afterEach(async () => {
  await Promise.all(pools.splice(0).map((pool) => pool.end()));
});

function createStore() {
  const database = newDb();
  const adapter = database.adapters.createPg();
  const pool = new adapter.Pool() as unknown as Pool;
  pools.push(pool);
  return {
    pool,
    store: new EarlyAccessStore({ pool, baselineCount: 2_312 }),
  };
}

const googlePlace = {
  placeId: "ChIJ-sidekick",
  displayName: "Taylor & Co. Repair",
  formattedAddress: "123 Main Street, Calgary, AB T2P 1A1, Canada",
  addressComponents: [{ longText: "Canada", shortText: "CA", types: ["country"] }],
  location: { latitude: 51.0447, longitude: -114.0719 },
  businessStatus: "OPERATIONAL",
  primaryType: "car_repair",
  types: ["car_repair", "establishment"],
  websiteUri: "https://example.test",
  nationalPhoneNumber: "(403) 555-0100",
  googleMapsUri: "https://maps.google.com/?cid=123",
  raw: {
    id: "ChIJ-sidekick",
    displayName: { text: "Taylor & Co. Repair", languageCode: "en" },
    primaryType: "car_repair",
    types: ["car_repair", "establishment"],
    editorialSummary: { text: "A family-owned repair shop." },
  },
};

describe("early-access submission validation", () => {
  it("normalizes a complete signup while preserving the selected Google place", () => {
    const result = validateEarlyAccessSubmission({
      firstName: "  Jamie ",
      lastName: " Taylor  ",
      email: " JAMIE@EXAMPLE.COM ",
      companyName: " Taylor & Co. Repair ",
      publicDisplayConsent: true,
      marketingCommunicationsConsent: true,
      googlePlace,
      website: "",
    });

    expect(result).toEqual({
      firstName: "Jamie",
      lastName: "Taylor",
      email: "jamie@example.com",
      companyName: "Taylor & Co. Repair",
      publicDisplayConsent: true,
      marketingCommunicationsConsent: true,
      googlePlace,
    });
  });

  it("defaults optional marketing consent to false", () => {
    const result = validateEarlyAccessSubmission({
      firstName: "Jamie",
      lastName: "Taylor",
      email: "jamie@example.com",
      companyName: "Taylor & Co. Repair",
      publicDisplayConsent: true,
    });

    expect(result.marketingCommunicationsConsent).toBe(false);
  });

  it("rejects malformed email, missing names, and filled honeypots", () => {
    expect(() =>
      validateEarlyAccessSubmission({
        firstName: "",
        lastName: "Taylor",
        email: "not-an-email",
        companyName: "Taylor Repair",
        website: "https://bot.example",
      }),
    ).toThrow("Please check the highlighted fields");
  });
});

describe("PostgreSQL early-access store", () => {
  it("stores the shared counter in PostgreSQL and never increments twice for one email", async () => {
    const { pool, store } = createStore();
    const signup = validateEarlyAccessSubmission({
      firstName: "Jamie",
      lastName: "Taylor",
      email: "jamie@example.com",
      companyName: "Taylor & Co. Repair",
      publicDisplayConsent: true,
      googlePlace,
    });

    const first = await store.submit(signup);
    const duplicate = await store.submit(signup);

    expect(first).toMatchObject({ created: true, signupNumber: 2_313, count: 2_313 });
    expect(duplicate).toMatchObject({ created: false, signupNumber: 2_313, count: 2_313 });
    await expect(store.getCount()).resolves.toBe(2_313);
    const counter = await pool.query<{ current_count: number }>(
      "SELECT current_count FROM early_access_counter WHERE singleton = TRUE",
    );
    expect(Number(counter.rows[0]?.current_count)).toBe(2_313);
  });

  it("stores Google business categories, normalized details, and the full raw payload", async () => {
    const { pool, store } = createStore();

    await store.submit(
      validateEarlyAccessSubmission({
        firstName: "Jamie",
        lastName: "Taylor",
        email: "jamie@example.com",
        companyName: "Taylor & Co. Repair",
        publicDisplayConsent: true,
        marketingCommunicationsConsent: true,
        googlePlace,
      }),
    );

    const result = await pool.query<{
      google_place_id: string;
      google_primary_type: string;
      google_types: string[];
      google_display_name: string;
      google_formatted_address: string;
      google_address_components: unknown[];
      google_raw: Record<string, unknown>;
      marketing_communications_consent: boolean;
    }>(`
      SELECT google_place_id, google_primary_type, google_types,
             google_display_name, google_formatted_address,
             google_address_components, google_raw,
             marketing_communications_consent
      FROM early_access_registrations
    `);

    expect(result.rows[0]).toMatchObject({
      google_place_id: "ChIJ-sidekick",
      google_primary_type: "car_repair",
      google_types: ["car_repair", "establishment"],
      google_display_name: "Taylor & Co. Repair",
      google_formatted_address: "123 Main Street, Calgary, AB T2P 1A1, Canada",
      google_address_components: googlePlace.addressComponents,
      google_raw: googlePlace.raw,
      marketing_communications_consent: true,
    });
  });

  it("returns only consented real names while keeping the database-backed aggregate count", async () => {
    const { store } = createStore();

    await store.submit(
      validateEarlyAccessSubmission({
        firstName: "Jamie",
        lastName: "Taylor",
        email: "jamie@example.com",
        companyName: "Taylor Repair",
        publicDisplayConsent: true,
      }),
    );
    await store.submit(
      validateEarlyAccessSubmission({
        firstName: "Morgan",
        lastName: "Lee",
        email: "morgan@example.com",
        companyName: "Morgan Consulting",
        publicDisplayConsent: false,
      }),
    );

    await expect(store.getSocialProof()).resolves.toEqual({
      count: 2_314,
      people: [
        expect.objectContaining({
          displayName: "Jamie T.",
          signupNumber: 2_313,
        }),
      ],
    });
  });
});
