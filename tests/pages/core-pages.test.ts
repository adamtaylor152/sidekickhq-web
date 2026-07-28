import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PRODUCTS } from "@/content/products";

const routes = [
  "src/pages/index.astro",
  "src/pages/platform.astro",
  "src/pages/products/ai/index.astro",
  "src/pages/products/desktop/index.astro",
] as const;

const path = (route: string) => resolve(process.cwd(), route);
const source = (route: string) => readFileSync(path(route), "utf8");

describe("core marketing pages", () => {
  it("publishes the homepage, platform, AI, and desktop routes", () => {
    expect(routes.filter((route) => !existsSync(path(route)))).toEqual([]);
  });

  it("builds the homepage around the early-access invitation", () => {
    if (!existsSync(path(routes[0]))) return;
    const homepage = source(routes[0]);
    expect(homepage).toContain("Sidekick - CRM & ERP for Small Business");
    expect(homepage).toContain("Request Early Invite");
    expect(homepage).toContain("YouTube video coming soon");
    expect(homepage).toContain("/api/early-access");
    expect(homepage).toContain("/api/places/autocomplete");
  });

  it("keeps embedded AI, AI Agents, and Voice AI commercially distinct", () => {
    const ai = PRODUCTS.find((product) => product.slug === "ai");
    expect(ai?.featureGroups.flatMap((group) => group.features).join(" ")).toContain("Agent");
    expect(ai?.faqs.map((faq) => faq.answer).join(" ")).toContain("Voice AI");
    expect(ai?.pricingOfferKeys).toEqual(["ai.agent", "ai.credits.10000"]);
  });

  it("submits checkout through the server bridge and never collects raw card credentials", () => {
    const checkout = source("src/pages/checkout.astro");
    expect(checkout).toContain('fetch("/api/orders"');
    expect(checkout).not.toContain("Card number");
    expect(checkout).not.toContain("Expiry and security code");
    expect(checkout).toContain("secure payment page");
    expect(checkout).toContain('get("hardware")');
    expect(checkout).toContain("offerKey:selectedHardware");
    expect(existsSync(path("src/pages/api/orders.ts"))).toBe(true);
  });

  it("hydrates public prices from the authoritative server catalog", () => {
    const layout = source("src/layouts/SiteLayout.astro");
    expect(layout).toContain('fetch("/api/catalog"');
    expect(layout).toContain("priceComponents");
    expect(layout).toContain("unitAmountCents");
  });
});
