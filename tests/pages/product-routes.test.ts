import { describe, expect, it } from "vitest";
import { PRODUCTS } from "../../src/content/products";
import { EDITIONS } from "../../src/content/editions";

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
});
