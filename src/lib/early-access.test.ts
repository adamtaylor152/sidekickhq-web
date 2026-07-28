import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { afterEach, describe, expect, it } from "vitest";

import {
  EarlyAccessStore,
  validateEarlyAccessSubmission,
} from "@/lib/early-access";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
});

async function temporaryCsvPath() {
  const directory = await mkdtemp(join(tmpdir(), "sidekick-early-access-"));
  temporaryDirectories.push(directory);
  return join(directory, "early-access.csv");
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

describe("CSV-backed early-access store", () => {
  it("starts from the verified HeroNet baseline and never increments twice for one email", async () => {
    const store = new EarlyAccessStore({
      csvPath: await temporaryCsvPath(),
      baselineCount: 2_312,
    });
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
  });

  it("writes every selected Google Places field plus the raw response to CSV", async () => {
    const csvPath = await temporaryCsvPath();
    const sqlitePath = join(dirname(csvPath), "early-access.sqlite");
    const store = new EarlyAccessStore({ csvPath, sqlitePath, baselineCount: 2_312 });

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

    const csv = await readFile(csvPath, "utf8");
    expect(csv).toContain("signup_number,created_at,first_name,last_name,email,company_name,public_display_consent,marketing_communications_consent");
    expect(csv).toContain("google_place_id,google_display_name,google_formatted_address");
    expect(csv).toContain("ChIJ-sidekick");
    expect(csv).toContain("Taylor & Co. Repair");
    expect(csv).toContain('""editorialSummary""');

    expect((await stat(sqlitePath)).isFile()).toBe(true);
    const database = new DatabaseSync(sqlitePath, { readOnly: true });
    const row = database.prepare("SELECT COUNT(*) AS count, marketing_communications_consent AS marketingConsent FROM early_access_signups").get() as { count: number; marketingConsent: number };
    database.close();
    expect(row.count).toBe(1);
    expect(row.marketingConsent).toBe(1);
  });

  it("returns only consented real names while keeping the full aggregate count", async () => {
    const store = new EarlyAccessStore({
      csvPath: await temporaryCsvPath(),
      baselineCount: 2_312,
    });

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
