import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PRODUCTS } from "../../src/content/products";
import { EDITIONS } from "../../src/content/editions";
import { PRICE_OFFERS } from "../../src/content/pricing";

describe("product mini-site routes", () => {
  it("provides a complete mini-site model for every product", () => {
    expect(PRODUCTS).toHaveLength(12);
    for (const product of PRODUCTS) {
      expect(product.featureGroups.length).toBeGreaterThan(0);
      expect(product.workflows.length).toBeGreaterThan(0);
      expect(product.slices.at(0)?.kind).toBe("hero");
    }
  });

  it("keeps every edition linked to a real product", () => {
    const slugs = new Set(PRODUCTS.map(({ slug }) => slug));
    expect(EDITIONS.every(({ productSlug }) => slugs.has(productSlug))).toBe(true);
  });

  it("publishes a detail page model for every priced commercial offer", () => {
    const editionOfferKeys = new Set(EDITIONS.map(({ offerKey }) => offerKey));
    expect(PRICE_OFFERS.filter(({ key }) => !editionOfferKeys.has(key)).map(({ key }) => key)).toEqual([]);
  });

  it("links every priced product mini-site to its package collection", () => {
    for (const product of PRODUCTS.filter(({ pricingOfferKeys }) => pricingOfferKeys.length > 0)) {
      expect(product.miniNav).toContainEqual({ label: "Plans", href: `/products/${product.slug}/editions` });
      expect(EDITIONS.some(({ productSlug }) => productSlug === product.slug)).toBe(true);
    }
  });

  it("uses specific commercial capability copy instead of placeholder edition language", () => {
    for (const edition of EDITIONS) {
      expect(edition.includes.length).toBeGreaterThanOrEqual(5);
      expect(edition.includes).not.toContain("Core workflows");
      expect(edition.includes).not.toContain("Advanced workflows");
    }
  });

  it("gives edition pages product-specific feature and workflow slices", () => {
    const source = readFileSync(resolve(process.cwd(), "src/pages/products/[product]/editions/[edition].astro"), "utf8");
    expect(source).toContain("product.featureGroups");
    expect(source).toContain("product.workflows");
    expect(source).toContain("What this plan changes");
  });

  it("keeps feature pages grounded in product outcomes instead of generic template filler", () => {
    const source = readFileSync(resolve(process.cwd(), "src/pages/products/[product]/features/[feature].astro"), "utf8");
    expect(source).toContain("product.outcomes");
    expect(source).toContain("product.workflows");
    expect(source).not.toContain("Designed to keep this work connected to the customer, team, and operating record around it.");
  });
});
