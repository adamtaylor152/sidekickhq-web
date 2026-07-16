import { describe, expect, it } from "vitest";

import { EDITIONS } from "@/content/editions";
import { INDUSTRIES } from "@/content/industries";
import { PRODUCTS } from "@/content/products";
import { GET } from "@/pages/sitemap.xml";

const featureSlug = (title: string) => title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/(^-|-$)/g, "");

describe("public sitemap", () => {
  it("includes product, feature, plan, industry, resource, and hardware discovery routes", async () => {
    const response = await GET({} as never);
    const xml = await response.text();
    for (const product of PRODUCTS) {
      expect(xml).toContain(`https://sidekickhq.ca/products/${product.slug}`);
      for (const feature of product.featureGroups) expect(xml).toContain(`https://sidekickhq.ca/products/${product.slug}/features/${featureSlug(feature.title)}`);
    }
    for (const edition of EDITIONS) expect(xml).toContain(`https://sidekickhq.ca/products/${edition.productSlug}/editions/${edition.slug}`);
    for (const industry of INDUSTRIES) expect(xml).toContain(`https://sidekickhq.ca/industries/${industry.slug}`);
    expect(xml).toContain("https://sidekickhq.ca/products/voice/phones");
    expect(xml).toContain("https://sidekickhq.ca/products/payments/terminals");
    expect(xml).toContain("https://sidekickhq.ca/help");
  });
});
