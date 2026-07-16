import { describe, expect, it } from "vitest";

import { HELP_CATEGORIES } from "@/content/resources";
import { PRODUCTS } from "@/content/products";

describe("Customer Help Center architecture", () => {
  it("organizes every product through category, product, section, and topic levels", () => {
    const helpProducts = HELP_CATEGORIES.flatMap(({ products }) => products);
    expect(new Set(helpProducts.map(({ slug }) => slug))).toEqual(new Set(PRODUCTS.map(({ slug }) => slug)));
    expect(helpProducts).toHaveLength(PRODUCTS.length);
    for (const product of helpProducts) {
      expect(product.sections.length).toBeGreaterThanOrEqual(3);
      for (const section of product.sections) expect(section.topics.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps the landing page at navigation depth only without article bodies", () => {
    const serialized = JSON.stringify(HELP_CATEGORIES);
    expect(serialized).not.toContain("articleBody");
    expect(serialized).not.toContain("markdown");
  });
});
