import { describe, expect, it } from "vitest";
import { INDUSTRIES } from "../../src/content/industries";

describe("industry mini-sites", () => {
  it("ships forty specific industry routes", () => {
    expect(INDUSTRIES).toHaveLength(40);
    expect(new Set(INDUSTRIES.map(({ slug }) => slug)).size).toBe(40);
  });

  it("gives each industry a product recipe and workflow", () => {
    expect(INDUSTRIES.every(({ productSlugs, workflows }) => productSlugs.length >= 3 && workflows.length >= 2)).toBe(true);
  });
});
