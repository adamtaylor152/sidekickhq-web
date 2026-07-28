import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
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

type StoredSignup = EarlyAccessSubmission & {
  signupNumber: number;
  createdAt: string;
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

const CSV_HEADERS = [
  "signup_number",
  "created_at",
  "first_name",
  "last_name",
  "email",
  "company_name",
  "public_display_consent",
  "marketing_communications_consent",
  "google_place_id",
  "google_display_name",
  "google_formatted_address",
  "google_address_components_json",
  "google_latitude",
  "google_longitude",
  "google_business_status",
  "google_primary_type",
  "google_types_json",
  "google_website_uri",
  "google_national_phone",
  "google_maps_uri",
  "google_raw_json",
] as const;

export class EarlyAccessStore {
  private readonly csvPath: string;
  private readonly sqlitePath: string;
  private readonly baselineCount: number;
  private initialized = false;
  private database: DatabaseSync | null = null;
  private queue: Promise<unknown> = Promise.resolve();

  constructor(options: { csvPath: string; sqlitePath?: string; baselineCount?: number }) {
    this.csvPath = options.csvPath;
    this.sqlitePath = options.sqlitePath ?? this.csvPath.replace(/\.csv$/i, ".sqlite");
    this.baselineCount = options.baselineCount ?? VERIFIED_HERONET_BASELINE;
  }

  async submit(submission: EarlyAccessSubmission) {
    return this.exclusive(async () => {
      await this.initialize();
      const database = this.getDatabase();
      const existing = this.findByEmail(submission.email);
      if (existing) {
        return {
          created: false,
          signupNumber: existing.signupNumber,
          count: this.baselineCount + this.rowCount(),
        };
      }

      const record: StoredSignup = {
        ...submission,
        signupNumber: this.baselineCount + this.rowCount() + 1,
        createdAt: new Date().toISOString(),
      };
      database
        .prepare(`
          INSERT INTO early_access_signups (
            signup_number, created_at, first_name, last_name, email,
            company_name, public_display_consent, marketing_communications_consent,
            google_place_json
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .run(
          record.signupNumber,
          record.createdAt,
          record.firstName,
          record.lastName,
          record.email,
          record.companyName,
          record.publicDisplayConsent ? 1 : 0,
          record.marketingCommunicationsConsent ? 1 : 0,
          JSON.stringify(record.googlePlace ?? null),
        );
      await this.syncCsvMirror();
      return {
        created: true,
        signupNumber: record.signupNumber,
        count: this.baselineCount + this.rowCount(),
      };
    });
  }

  async getCount() {
    return this.exclusive(async () => {
      await this.initialize();
      return this.baselineCount + this.rowCount();
    });
  }

  async getSocialProof() {
    return this.exclusive(async () => {
      await this.initialize();
      const rows = this.getDatabase()
        .prepare(`
          SELECT signup_number, created_at, first_name, last_name, email,
                 company_name, public_display_consent, marketing_communications_consent,
                 google_place_json
          FROM early_access_signups
          WHERE public_display_consent = 1
          ORDER BY signup_number DESC
          LIMIT 50
        `)
        .all() as unknown as StoredRow[];
      return {
        count: this.baselineCount + this.rowCount(),
        people: rows
          .map(fromStoredRow)
          .map((record) => ({
            displayName: `${record.firstName} ${record.lastName.slice(0, 1).toUpperCase()}.`,
            signupNumber: record.signupNumber,
            createdAt: record.createdAt,
          })),
      };
    });
  }

  private async initialize() {
    if (this.initialized) return;
    await mkdir(dirname(this.csvPath), { recursive: true });
    this.database = new DatabaseSync(this.sqlitePath);
    this.database.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = FULL;
      CREATE TABLE IF NOT EXISTS early_access_signups (
        signup_number INTEGER NOT NULL UNIQUE,
        created_at TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
        company_name TEXT NOT NULL,
        public_display_consent INTEGER NOT NULL DEFAULT 0,
        marketing_communications_consent INTEGER NOT NULL DEFAULT 0,
        google_place_json TEXT NOT NULL DEFAULT 'null'
      );
      CREATE INDEX IF NOT EXISTS early_access_signups_public_recent
        ON early_access_signups (public_display_consent, signup_number DESC);
    `);
    const columns = this.database.prepare("PRAGMA table_info(early_access_signups)").all() as unknown as Array<{ name: string }>;
    if (!columns.some((column) => column.name === "marketing_communications_consent")) {
      this.database.exec("ALTER TABLE early_access_signups ADD COLUMN marketing_communications_consent INTEGER NOT NULL DEFAULT 0");
    }

    try {
      const csv = await readFile(this.csvPath, "utf8");
      if (this.rowCount() === 0) {
        for (const record of parseStoredRecords(csv)) this.insertImportedRecord(record);
      }
    } catch (error) {
      if (!isMissingFile(error)) throw error;
    }
    await this.syncCsvMirror();
    this.initialized = true;
  }

  private getDatabase() {
    if (!this.database) throw new Error("Early-access store is not initialized.");
    return this.database;
  }

  private rowCount() {
    const row = this.getDatabase()
      .prepare("SELECT COUNT(*) AS count FROM early_access_signups")
      .get() as unknown as { count: number | bigint };
    return Number(row.count);
  }

  private findByEmail(email: string) {
    const row = this.getDatabase()
      .prepare(`
        SELECT signup_number, created_at, first_name, last_name, email,
               company_name, public_display_consent, marketing_communications_consent,
               google_place_json
        FROM early_access_signups WHERE email = ? COLLATE NOCASE
      `)
      .get(email) as unknown as StoredRow | undefined;
    return row ? fromStoredRow(row) : null;
  }

  private insertImportedRecord(record: StoredSignup) {
    this.getDatabase()
      .prepare(`
        INSERT OR IGNORE INTO early_access_signups (
          signup_number, created_at, first_name, last_name, email,
          company_name, public_display_consent, marketing_communications_consent,
          google_place_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        record.signupNumber,
        record.createdAt,
        record.firstName,
        record.lastName,
        record.email,
        record.companyName,
        record.publicDisplayConsent ? 1 : 0,
        record.marketingCommunicationsConsent ? 1 : 0,
        JSON.stringify(record.googlePlace ?? null),
      );
  }

  private async syncCsvMirror() {
    const records = (
      this.getDatabase()
        .prepare(`
          SELECT signup_number, created_at, first_name, last_name, email,
                 company_name, public_display_consent, marketing_communications_consent,
                 google_place_json
          FROM early_access_signups ORDER BY signup_number
        `)
        .all() as unknown as StoredRow[]
    ).map(fromStoredRow);
    const body = [CSV_HEADERS.join(","), ...records.map(serializeRecord), ""].join("\n");
    const temporaryPath = `${this.csvPath}.tmp-${process.pid}`;
    await writeFile(temporaryPath, body, { encoding: "utf8", mode: 0o600 });
    await rename(temporaryPath, this.csvPath);
  }

  private exclusive<T>(operation: () => Promise<T>): Promise<T> {
    const run = this.queue.then(operation, operation);
    this.queue = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }
}

type StoredRow = {
  signup_number: number | bigint;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
  public_display_consent: number | bigint;
  marketing_communications_consent: number | bigint;
  google_place_json: string;
};

function fromStoredRow(row: StoredRow): StoredSignup {
  return {
    signupNumber: Number(row.signup_number),
    createdAt: row.created_at,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    companyName: row.company_name,
    publicDisplayConsent: Number(row.public_display_consent) === 1,
    marketingCommunicationsConsent: Number(row.marketing_communications_consent) === 1,
    googlePlace: parseGooglePlace(row.google_place_json),
  };
}

function parseGooglePlace(value: string): GooglePlaceData | undefined {
  try {
    const parsed = JSON.parse(value) as unknown;
    return parsed ? googlePlaceSchema.parse(parsed) : undefined;
  } catch {
    return undefined;
  }
}

function serializeRecord(record: StoredSignup) {
  const place = record.googlePlace;
  return [
    record.signupNumber,
    record.createdAt,
    record.firstName,
    record.lastName,
    record.email,
    record.companyName,
    record.publicDisplayConsent,
    record.marketingCommunicationsConsent,
    place?.placeId ?? "",
    place?.displayName ?? "",
    place?.formattedAddress ?? "",
    JSON.stringify(place?.addressComponents ?? []),
    place?.location?.latitude ?? "",
    place?.location?.longitude ?? "",
    place?.businessStatus ?? "",
    place?.primaryType ?? "",
    JSON.stringify(place?.types ?? []),
    place?.websiteUri ?? "",
    place?.nationalPhoneNumber ?? "",
    place?.googleMapsUri ?? "",
    JSON.stringify(place?.raw ?? {}),
  ]
    .map(csvCell)
    .join(",");
}

function csvCell(value: unknown) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function parseStoredRecords(csv: string): StoredSignup[] {
  const rows = parseCsv(csv);
  if (rows.length < 2) return [];
  const header = rows[0] ?? [];
  const index = Object.fromEntries(header.map((name, position) => [name, position]));
  return rows.slice(1).flatMap((row) => {
    if (!row.length || !row[index.email ?? -1]) return [];
    const placeId = row[index.google_place_id ?? -1] ?? "";
    const googlePlace = placeId
      ? {
          placeId,
          displayName: row[index.google_display_name ?? -1] ?? "",
          formattedAddress: row[index.google_formatted_address ?? -1] || null,
          addressComponents: parseJsonArray(row[index.google_address_components_json ?? -1]),
          location: {
            latitude: parseNullableNumber(row[index.google_latitude ?? -1]),
            longitude: parseNullableNumber(row[index.google_longitude ?? -1]),
          },
          businessStatus: row[index.google_business_status ?? -1] || null,
          primaryType: row[index.google_primary_type ?? -1] || null,
          types: parseJsonArray(row[index.google_types_json ?? -1]).filter(
            (value): value is string => typeof value === "string",
          ),
          websiteUri: row[index.google_website_uri ?? -1] || null,
          nationalPhoneNumber: row[index.google_national_phone ?? -1] || null,
          googleMapsUri: row[index.google_maps_uri ?? -1] || null,
          raw: parseJsonObject(row[index.google_raw_json ?? -1]),
        }
      : undefined;
    return [
      {
        signupNumber: Number(row[index.signup_number ?? -1]),
        createdAt: row[index.created_at ?? -1] ?? "",
        firstName: row[index.first_name ?? -1] ?? "",
        lastName: row[index.last_name ?? -1] ?? "",
        email: (row[index.email ?? -1] ?? "").toLowerCase(),
        companyName: row[index.company_name ?? -1] ?? "",
        publicDisplayConsent: row[index.public_display_consent ?? -1] === "true",
        marketingCommunicationsConsent:
          row[index.marketing_communications_consent ?? -1] === "true",
        googlePlace,
      },
    ];
  });
}

function parseCsv(csv: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;
  for (let position = 0; position < csv.length; position += 1) {
    const character = csv[position];
    if (quoted) {
      if (character === '"' && csv[position + 1] === '"') {
        value += '"';
        position += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        value += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(value);
      value = "";
    } else if (character === "\n") {
      row.push(value.replace(/\r$/, ""));
      if (row.some(Boolean)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }
  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }
  return rows;
}

function parseJsonArray(value: string | undefined): unknown[] {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseJsonObject(value: string | undefined): Record<string, unknown> {
  try {
    const parsed = JSON.parse(value || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function parseNullableNumber(value: string | undefined) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isMissingFile(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "ENOENT");
}
