type BridgeOptions = {
  baseUrl: string;
  apiKey: string;
  fetchImpl?: typeof fetch;
};

type HeroNetEnvelope<T> = {
  ok: boolean;
  data?: T;
  error?: { message?: string };
};

export type HeroNetCatalog = {
  schemaVersion?: number;
  catalogueVersion: string;
  countries?: string[];
  offers: unknown[];
};

export type HeroNetOrderResult = {
  orderId: string;
  status: string;
  replayed: boolean;
  trial?: { enabled: boolean; days: number | null; requiresPaymentMethod: boolean };
};

export async function fetchHeroNetCatalog(options: BridgeOptions): Promise<HeroNetCatalog> {
  return request<HeroNetCatalog>(options, "/api/v1/storefront/catalog", { method: "GET" });
}

export async function submitHeroNetStorefrontOrder(options: BridgeOptions & { payload: unknown }): Promise<HeroNetOrderResult> {
  return request<HeroNetOrderResult>(options, "/api/v1/storefront/orders", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(options.payload),
  });
}

async function request<T>(options: BridgeOptions, path: string, init: RequestInit): Promise<T> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const baseUrl = options.baseUrl.replace(/\/$/, "");
  const response = await fetchImpl(`${baseUrl}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${options.apiKey}`,
      accept: "application/json",
      ...(init.headers ?? {}),
    },
  });
  const body = await readEnvelope<T>(response);
  if (!response.ok || !body.ok || !body.data) {
    throw new Error(body.error?.message || "Sidekick ordering is temporarily unavailable.");
  }
  return body.data;
}

async function readEnvelope<T>(response: Response): Promise<HeroNetEnvelope<T>> {
  try {
    return await response.json() as HeroNetEnvelope<T>;
  } catch {
    return { ok: false, error: { message: "Sidekick ordering is temporarily unavailable." } };
  }
}
