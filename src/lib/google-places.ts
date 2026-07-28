import type { GooglePlaceData } from "@/lib/early-access";

const GOOGLE_AUTOCOMPLETE_URL = "https://places.googleapis.com/v1/places:autocomplete";
const GOOGLE_PLACE_DETAILS_URL = "https://places.googleapis.com/v1/places";
const DEFAULT_INFISICAL_URL = "https://sm.heroit.ca";
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1_000;

type RuntimeEnvironment = Record<string, string | undefined>;

export class InfisicalSecretResolver {
  private readonly env: RuntimeEnvironment;
  private readonly fetchImpl: typeof fetch;
  private readonly now: () => number;
  private readonly cacheTtlMs: number;
  private cached: { value: string; expiresAt: number } | null = null;

  constructor(options: {
    env?: RuntimeEnvironment;
    fetchImpl?: typeof fetch;
    now?: () => number;
    cacheTtlMs?: number;
  } = {}) {
    this.env = options.env ?? process.env;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.now = options.now ?? Date.now;
    this.cacheTtlMs = options.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;
  }

  async getGooglePlacesApiKey() {
    if (this.cached && this.cached.expiresAt > this.now()) return this.cached.value;

    const clientId = this.env.INFISICAL_CLIENT_ID;
    const clientSecret = this.env.INFISICAL_CLIENT_SECRET;
    const projectId = this.env.INFISICAL_PROJECT_ID;
    let value: string;
    if (clientId && clientSecret && projectId) {
      value = await this.readFromInfisical({ clientId, clientSecret, projectId });
    } else if (this.env.GOOGLE_PLACES_API_KEY) {
      value = this.env.GOOGLE_PLACES_API_KEY;
    } else {
      throw new Error("Google Places is not configured.");
    }

    this.cached = { value, expiresAt: this.now() + this.cacheTtlMs };
    return value;
  }

  private async readFromInfisical(input: {
    clientId: string;
    clientSecret: string;
    projectId: string;
  }) {
    const baseUrl = (this.env.INFISICAL_API_URL || DEFAULT_INFISICAL_URL).replace(/\/$/, "");
    const loginResponse = await this.fetchImpl(
      `${baseUrl}/api/v1/auth/universal-auth/login`,
      {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ clientId: input.clientId, clientSecret: input.clientSecret }),
      },
    );
    if (!loginResponse.ok) throw new Error("Infisical authentication failed.");
    const login = (await loginResponse.json()) as { accessToken?: unknown };
    if (typeof login.accessToken !== "string" || !login.accessToken) {
      throw new Error("Infisical authentication returned no access token.");
    }

    const secretName = this.env.INFISICAL_GOOGLE_PLACES_SECRET_NAME || "GOOGLE_PLACES_API_KEY";
    const url = new URL(`${baseUrl}/api/v4/secrets/${encodeURIComponent(secretName)}`);
    url.searchParams.set("projectId", input.projectId);
    url.searchParams.set("environment", this.env.INFISICAL_ENVIRONMENT || "prod");
    url.searchParams.set("secretPath", this.env.INFISICAL_SECRET_PATH || "/");
    url.searchParams.set("viewSecretValue", "true");
    url.searchParams.set("expandSecretReferences", "true");
    const secretResponse = await this.fetchImpl(url, {
      headers: {
        authorization: `Bearer ${login.accessToken}`,
        accept: "application/json",
      },
    });
    if (!secretResponse.ok) throw new Error("Infisical could not read Google Places configuration.");
    const body = (await secretResponse.json()) as { secret?: { secretValue?: unknown } };
    if (typeof body.secret?.secretValue !== "string" || !body.secret.secretValue) {
      throw new Error("Infisical returned an empty Google Places key.");
    }
    return body.secret.secretValue;
  }
}

export type CompanySuggestion = {
  placeId: string;
  fullText: string;
  primaryText: string;
  secondaryText: string | null;
};

export async function autocompleteCompanies(options: {
  input: string;
  sessionToken: string;
  apiKey: string;
  fetchImpl?: typeof fetch;
}): Promise<CompanySuggestion[]> {
  const query = options.input.trim();
  if (query.length < 2) return [];
  const response = await (options.fetchImpl ?? fetch)(GOOGLE_AUTOCOMPLETE_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-Goog-Api-Key": options.apiKey,
      "X-Goog-FieldMask":
        "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat,suggestions.placePrediction.types",
    },
    body: JSON.stringify({
      input: query,
      includedRegionCodes: ["ca", "us"],
      locationBias: {
        circle: {
          center: { latitude: 51.0447, longitude: -114.0719 },
          radius: 50_000,
        },
      },
      includePureServiceAreaBusinesses: true,
      sessionToken: options.sessionToken,
    }),
  });
  if (!response.ok) throw new Error("Company suggestions are temporarily unavailable.");
  const body = (await response.json()) as Record<string, unknown>;
  const suggestions = Array.isArray(body.suggestions) ? body.suggestions : [];
  return suggestions.flatMap((entry) => {
    if (!entry || typeof entry !== "object" || !("placePrediction" in entry)) return [];
    const prediction = entry.placePrediction as Record<string, unknown>;
    const placeId = asString(prediction.placeId);
    const fullText = localizedText(prediction.text);
    if (!placeId || !fullText) return [];
    const structured = asRecord(prediction.structuredFormat);
    return [
      {
        placeId,
        fullText,
        primaryText: localizedText(structured?.mainText) || fullText,
        secondaryText: localizedText(structured?.secondaryText),
      },
    ];
  });
}

export async function getGooglePlaceDetails(options: {
  placeId: string;
  sessionToken: string;
  apiKey: string;
  fetchImpl?: typeof fetch;
}): Promise<GooglePlaceData> {
  const placeId = options.placeId.trim();
  if (!placeId) throw new Error("Choose a company from the suggestions.");
  const url = new URL(`${GOOGLE_PLACE_DETAILS_URL}/${encodeURIComponent(placeId)}`);
  if (options.sessionToken) url.searchParams.set("sessionToken", options.sessionToken);
  const response = await (options.fetchImpl ?? fetch)(url, {
    headers: {
      "X-Goog-Api-Key": options.apiKey,
      "X-Goog-FieldMask":
        "id,displayName,formattedAddress,addressComponents,location,nationalPhoneNumber,internationalPhoneNumber,websiteUri,businessStatus,primaryType,primaryTypeDisplayName,types,rating,userRatingCount,googleMapsUri,editorialSummary",
    },
  });
  if (!response.ok) throw new Error("Company details are temporarily unavailable.");
  const raw = (await response.json()) as Record<string, unknown>;
  const location = asRecord(raw.location);
  return {
    placeId: asString(raw.id) || placeId,
    displayName: localizedText(raw.displayName) || "",
    formattedAddress: asString(raw.formattedAddress),
    addressComponents: Array.isArray(raw.addressComponents) ? raw.addressComponents : [],
    location: location
      ? {
          latitude: asNumber(location.latitude),
          longitude: asNumber(location.longitude),
        }
      : null,
    businessStatus: asString(raw.businessStatus),
    primaryType: asString(raw.primaryType),
    types: Array.isArray(raw.types)
      ? raw.types.filter((value): value is string => typeof value === "string")
      : [],
    websiteUri: asString(raw.websiteUri),
    nationalPhoneNumber:
      asString(raw.nationalPhoneNumber) || asString(raw.internationalPhoneNumber),
    googleMapsUri: asString(raw.googleMapsUri),
    raw,
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function localizedText(value: unknown) {
  return asString(asRecord(value)?.text);
}

function asString(value: unknown) {
  return typeof value === "string" && value ? value : null;
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
