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

  it("builds the homepage around the approved promise and discovery paths", () => {
    if (!existsSync(path(routes[0]))) return;
    const homepage = source(routes[0]);
    expect(homepage).toContain("Every part of your business, working together—with AI built in.");
    expect(homepage).toContain("ProductConstellation");
    expect(homepage).toContain("AiOperatingLayer");
    expect(homepage).toContain("IndustryPathways");
    expect(homepage).toContain("HardwareStage");
  });

  it("keeps embedded AI, AI Agents, and Voice AI commercially distinct", () => {
    const ai = PRODUCTS.find((product) => product.slug === "ai");
    expect(ai?.featureGroups.flatMap((group) => group.features).join(" ")).toContain("Agent");
    expect(ai?.faqs.map((faq) => faq.answer).join(" ")).toContain("Voice AI");
    expect(ai?.pricingOfferKeys).toEqual(["ai.agent", "ai.credits.10000"]);
  });
});
