import { describe, expect, it } from "vitest";
import { INDUSTRIES } from "../../src/content/industries";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("industry mini-sites", () => {
  it("ships forty specific industry routes", () => {
    expect(INDUSTRIES).toHaveLength(40);
    expect(new Set(INDUSTRIES.map(({ slug }) => slug)).size).toBe(40);
  });

  it("gives each industry a product recipe and workflow", () => {
    expect(INDUSTRIES.every(({ productSlugs, workflows }) => productSlugs.length >= 3 && workflows.length >= 2)).toBe(true);
  });

  it("renders role-specific examples in every industry mini-site", () => {
    expect(INDUSTRIES.every(({ roleExamples }) => roleExamples.length >= 3)).toBe(true);
    const source = readFileSync(resolve(process.cwd(), "src/pages/industries/[industry].astro"), "utf8");
    expect(source).toContain("industry.roleExamples");
  });
});
