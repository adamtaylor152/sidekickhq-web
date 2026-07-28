import type { Pool, PoolClient } from "pg";
import { z } from "zod";

export const VERIFIED_HERONET_BASELINE = 2_312;

export type GooglePlaceData = {
  placeId: string;
  displayName: string;
  formattedAddress: string | null;
  addressComponents: unknown[];
  location: { latitude: number | null; longitude: number | null } | null;
  businessStatus: string | null;
  primaryType: string | null;
  types: string[];
  websiteUri: string | null;
  nationalPhoneNumber: string | null;
  googleMapsUri: string | null;
  raw: Record<string, unknown>;
};

export type EarlyAccessSubmission = {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  publicDisplayConsent: boolean;
  marketingCommunicationsConsent: boolean;
  googlePlace?: GooglePlaceData;
};

const googlePlaceSchema = z.object({
  placeId: z.string().trim().min(1).max(512),
  displayName: z.string().trim().min(1).max(300),
  formattedAddress: z.string().trim().max(1_000).nullable(),
  addressComponents: z.array(z.unknown()).max(100),
  location: z
    .object({
      latitude: z.number().finite().nullable(),
      longitude: z.number().finite().nullable(),
    })
    .nullable(),
  businessStatus: z.string().trim().max(100).nullable(),
  primaryType: z.string().trim().max(100).nullable(),
  types: z.array(z.string().trim().max(100)).max(100),
  websiteUri: z.string().trim().max(2_000).nullable(),
  nationalPhoneNumber: z.string().trim().max(100).nullable(),
  googleMapsUri: z.string().trim().max(2_000).nullable(),
  raw: z.record(z.string(), z.unknown()),
});

const submissionSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(254),
  companyName: z.string().trim().min(1).max(300),
  publicDisplayConsent: z.boolean().default(false),
  marketingCommunicationsConsent: z.boolean().default(false),
  googlePlace: googlePlaceSchema.optional(),
  website: z.string().trim().max(0).optional(),
});

export function validateEarlyAccessSubmission(input: unknown): EarlyAccessSubmission {
  const result = submissionSchema.safeParse(input);
  if (!result.success) {
    throw new Error("Please check the highlighted fields and try again.");
  }
  const submission = { ...result.data };
  delete submission.website;
  return submission;
}

type RegistrationRow = {
  signup_number: string | number;
  created_at: Date | string;
  first_name: string;
  last_name: string;
};

export class EarlyAccessStore {
  private readonly pool: Pool;
  private readonly baselineCount: number;
  private initialization: Promise<void> | null = null;

  constructor(options: { pool: Pool; baselineCount?: number }) {
    this.pool = options.pool;
    this.baselineCount = options.baselineCount ?? VERIFIED_HERONET_BASELINE;
  }

  async submit(submission: EarlyAccessSubmission) {
    await this.ensureSchema();
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const counterResult = await client.query<{ current_count: string | number }>(`
        SELECT current_count
        FROM early_access_counter
        WHERE singleton = TRUE
        FOR UPDATE
      `);
      const currentCount = Number(counterResult.rows[0]?.current_count);
      if (!Number.isFinite(currentCount)) throw new Error("Early-access counter is unavailable.");

      const existingResult = await client.query<{ signup_number: string | number }>(`
        SELECT signup_number
        FROM early_access_registrations
        WHERE email = $1
      `, [submission.email]);
      const existing = existingResult.rows[0];
      if (existing) {
        await client.query("COMMIT");
        return {
          created: false,
          signupNumber: Number(existing.signup_number),
          count: currentCount,
        };
      }

      const signupNumber = currentCount + 1;
      await this.insertRegistration(client, submission, signupNumber);
      await client.query(`
        UPDATE early_access_counter
        SET current_count = $1, updated_at = NOW()
        WHERE singleton = TRUE
      `, [signupNumber]);
      await client.query("COMMIT");
      return { created: true, signupNumber, count: signupNumber };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async getCount() {
    await this.ensureSchema();
    const result = await this.pool.query<{ current_count: string | number }>(`
      SELECT current_count FROM early_access_counter WHERE singleton = TRUE
    `);
    return Number(result.rows[0]?.current_count ?? this.baselineCount);
  }

  async getSocialProof() {
    await this.ensureSchema();
    const [count, registrations] = await Promise.all([
      this.getCount(),
      this.pool.query<RegistrationRow>(`
        SELECT signup_number, created_at, first_name, last_name
        FROM early_access_registrations
        WHERE public_display_consent = TRUE
        ORDER BY signup_number DESC
        LIMIT 50
      `),
    ]);
    return {
      count,
      people: registrations.rows.map((record) => ({
        displayName: `${record.first_name} ${record.last_name.slice(0, 1).toUpperCase()}.`,
        signupNumber: Number(record.signup_number),
        createdAt: toIsoString(record.created_at),
      })),
    };
  }

  private ensureSchema() {
    if (!this.initialization) {
      this.initialization = this.initialize().catch((error) => {
        this.initialization = null;
        throw error;
      });
    }
    return this.initialization;
  }

  private async initialize() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS early_access_counter (
        singleton BOOLEAN PRIMARY KEY DEFAULT TRUE,
        current_count BIGINT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT early_access_counter_singleton CHECK (singleton = TRUE)
      );

      CREATE TABLE IF NOT EXISTS early_access_registrations (
        id BIGSERIAL PRIMARY KEY,
        signup_number BIGINT NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        first_name VARCHAR(80) NOT NULL,
        last_name VARCHAR(80) NOT NULL,
        email VARCHAR(254) NOT NULL UNIQUE,
        company_name VARCHAR(300) NOT NULL,
        public_display_consent BOOLEAN NOT NULL DEFAULT FALSE,
        marketing_communications_consent BOOLEAN NOT NULL DEFAULT FALSE,
        google_place_id VARCHAR(512),
        google_display_name VARCHAR(300),
        google_formatted_address VARCHAR(1000),
        google_address_components JSONB NOT NULL,
        google_latitude DOUBLE PRECISION,
        google_longitude DOUBLE PRECISION,
        google_business_status VARCHAR(100),
        google_primary_type VARCHAR(100),
        google_types TEXT[] NOT NULL,
        google_website_uri VARCHAR(2000),
        google_national_phone VARCHAR(100),
        google_maps_uri VARCHAR(2000),
        google_raw JSONB NOT NULL
      );

      CREATE INDEX IF NOT EXISTS early_access_registrations_public_recent
        ON early_access_registrations (public_display_consent, signup_number DESC);
      CREATE INDEX IF NOT EXISTS early_access_registrations_primary_type
        ON early_access_registrations (google_primary_type);
    `);
    await this.pool.query(`
      INSERT INTO early_access_counter (singleton, current_count)
      VALUES (TRUE, $1)
      ON CONFLICT (singleton) DO NOTHING
    `, [this.baselineCount]);
  }

  private async insertRegistration(
    client: PoolClient,
    submission: EarlyAccessSubmission,
    signupNumber: number,
  ) {
    const place = submission.googlePlace;
    await client.query(`
      INSERT INTO early_access_registrations (
        signup_number, first_name, last_name, email, company_name,
        public_display_consent, marketing_communications_consent,
        google_place_id, google_display_name, google_formatted_address,
        google_address_components, google_latitude, google_longitude,
        google_business_status, google_primary_type, google_types,
        google_website_uri, google_national_phone, google_maps_uri, google_raw
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7,
        $8, $9, $10,
        $11::jsonb, $12, $13,
        $14, $15, $16,
        $17, $18, $19, $20::jsonb
      )
    `, [
      signupNumber,
      submission.firstName,
      submission.lastName,
      submission.email,
      submission.companyName,
      submission.publicDisplayConsent,
      submission.marketingCommunicationsConsent,
      place?.placeId ?? null,
      place?.displayName ?? null,
      place?.formattedAddress ?? null,
      JSON.stringify(place?.addressComponents ?? []),
      place?.location?.latitude ?? null,
      place?.location?.longitude ?? null,
      place?.businessStatus ?? null,
      place?.primaryType ?? null,
      place?.types ?? [],
      place?.websiteUri ?? null,
      place?.nationalPhoneNumber ?? null,
      place?.googleMapsUri ?? null,
      JSON.stringify(place?.raw ?? {}),
    ]);
  }
}

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}
