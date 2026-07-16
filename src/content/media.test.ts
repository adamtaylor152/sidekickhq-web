import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { INDUSTRIES } from "./industries";
import { MEDIA } from "./media";
import { PRODUCTS } from "./products";

describe("media registry", () => {
  it("has a real local asset for every referenced product and industry image", () => {
    const missing = [...PRODUCTS, ...INDUSTRIES]
      .map((entry) => entry.media.src)
      .filter((src) => !existsSync(resolve(process.cwd(), "public", src.replace(/^\//, ""))));
    expect(missing).toEqual([]);
  });

  it("keeps human-written alt text and production direction on every asset", () => {
    for (const entry of [...PRODUCTS, ...INDUSTRIES]) {
      expect(entry.media.alt.length).toBeGreaterThan(24);
      expect(entry.media.direction.length).toBeGreaterThan(32);
    }
  });

  it("records approved provenance and intrinsic dimensions for every referenced image", () => {
    expect(MEDIA).toHaveLength(PRODUCTS.length + INDUSTRIES.length);
    for (const asset of MEDIA) {
      expect(asset.approval).toBe("approved");
      expect(["generated", "licensed", "manufacturer"]).toContain(asset.sourceType);
      expect(asset.width).toBeGreaterThanOrEqual(1200);
      expect(asset.height).toBeGreaterThanOrEqual(800);
    }
  });

  it("never exposes the private payments or protection provider in public asset paths", () => {
    const paths = [...PRODUCTS, ...INDUSTRIES].map((entry) => entry.media.src).join(" ");
    expect(paths).not.toMatch(/stripe|acronis/i);
  });
});
