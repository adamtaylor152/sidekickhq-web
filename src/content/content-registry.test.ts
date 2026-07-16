import { describe, expect, it } from "vitest";

import { INDUSTRIES } from "./industries";
import { PRODUCTS } from "./products";
import { assertContentRegistry } from "./validate";

describe("content registry", () => {
  it("publishes the complete product constellation", () => {
    expect(PRODUCTS.map((product) => product.slug)).toEqual(
      expect.arrayContaining([
        "crm",
        "voice",
        "payments",
        "msp",
        "rentals",
        "erp",
        "protect",
        "commerce",
        "appointments",
        "sites",
        "desktop",
        "ai",
      ]),
    );
    expect(PRODUCTS).toHaveLength(12);
  });

  it("contains exactly forty unique industry routes", () => {
    expect(INDUSTRIES).toHaveLength(40);
    expect(new Set(INDUSTRIES.map((industry) => industry.slug)).size).toBe(40);
  });

  it("gives every industry a distinct story and concrete workflow depth", () => {
    expect(new Set(INDUSTRIES.map((industry) => industry.hero.title)).size).toBe(40);
    for (const industry of INDUSTRIES) {
      expect(industry.workflows.length).toBeGreaterThanOrEqual(3);
      expect(industry.productSlugs.length).toBeGreaterThanOrEqual(2);
      expect(industry.media.alt).not.toHaveLength(0);
    }
  });

  it("has no broken cross references", () => {
    expect(() => assertContentRegistry()).not.toThrow();
  });
});
