import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const components = [
  "HeroSlice",
  "ProductConstellation",
  "WorkflowStory",
  "FeatureLedger",
  "EditorialSplit",
  "MediaStage",
  "IndustryPathways",
  "AiOperatingLayer",
  "HardwareStage",
  "EditionComparison",
  "FaqList",
  "ConversionBand",
] as const;

const path = (name: string) => resolve(process.cwd(), `src/components/slices/${name}.astro`);

describe("marketing slice renderer", () => {
  it("implements every approved slice role", () => {
    expect(components.filter((name) => !existsSync(path(name)))).toEqual([]);
  });

  it("maps every slice role through one exhaustive renderer", () => {
    const rendererPath = path("SliceRenderer");
    expect(existsSync(rendererPath)).toBe(true);
    if (!existsSync(rendererPath)) return;
    const renderer = readFileSync(rendererPath, "utf8");
    for (const component of components) expect(renderer).toContain(component);
    expect(renderer).toContain("satisfies Record<SliceKind");
  });

  it("does not expose a CSS screen-overlay slot on hardware stages", () => {
    const hardwarePath = path("HardwareStage");
    if (!existsSync(hardwarePath)) return;
    expect(readFileSync(hardwarePath, "utf8")).not.toMatch(/screen[-_ ]overlay/i);
  });
});
