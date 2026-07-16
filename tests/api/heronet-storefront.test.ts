import { describe, expect, it, vi } from "vitest";

import { fetchHeroNetCatalog, submitHeroNetStorefrontOrder } from "@/lib/heronet-storefront";

describe("HeroNet storefront server bridge", () => {
  it("loads the authoritative catalog with a server-only bearer credential", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ ok: true, data: { catalogueVersion: "v1", offers: [] } }), { status: 200 }));

    const catalog = await fetchHeroNetCatalog({ baseUrl: "https://platform.example/", apiKey: "secret-key", fetchImpl });

    expect(catalog.catalogueVersion).toBe("v1");
    expect(fetchImpl).toHaveBeenCalledWith("https://platform.example/api/v1/storefront/catalog", expect.objectContaining({
      headers: { authorization: "Bearer secret-key", accept: "application/json" },
    }));
  });

  it("forwards an order without exposing the bearer credential to the browser", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ ok: true, data: { orderId: "order-1", status: "pending", replayed: false } }), { status: 202, headers: { "content-type": "application/json" } }));
    const payload = { requestKey: "checkout-12345678", country: "CA", currency: "CAD", orderKind: "software", trialRequested: true, business: { legalName: "Acme", adminName: "Ada Lovelace", email: "ada@example.com", phone: "+1 780 555 0100" }, activation: { workspaceName: "Acme" }, lines: [{ offerKey: "crm.essentials", quantity: 1 }] };

    const result = await submitHeroNetStorefrontOrder({ baseUrl: "https://platform.example", apiKey: "secret-key", payload, fetchImpl });

    expect(result).toMatchObject({ orderId: "order-1", status: "pending" });
    const [, request] = fetchImpl.mock.calls[0]!;
    expect(request?.headers).toEqual({ authorization: "Bearer secret-key", accept: "application/json", "content-type": "application/json" });
    expect(JSON.parse(String(request?.body))).toEqual(payload);
  });

  it("returns the platform error without leaking response internals", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ ok: false, error: { message: "Offer is unavailable." } }), { status: 400 }));

    await expect(submitHeroNetStorefrontOrder({ baseUrl: "https://platform.example", apiKey: "secret-key", payload: {}, fetchImpl })).rejects.toThrow("Offer is unavailable.");
  });
});
