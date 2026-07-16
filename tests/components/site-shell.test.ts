import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const requiredFiles = [
  "src/layouts/SiteLayout.astro",
  "src/layouts/ProductLayout.astro",
  "src/components/site/Header.astro",
  "src/components/site/Footer.astro",
  "src/components/site/MegaMenu.astro",
  "src/components/site/ProductMiniNav.astro",
  "src/components/ui/SkipLink.astro",
] as const;

const absolute = (path: string) => resolve(process.cwd(), path);
const source = (path: string) => readFileSync(absolute(path), "utf8");

describe("site shell", () => {
  it("provides every required semantic shell component", () => {
    expect(requiredFiles.filter((path) => !existsSync(absolute(path)))).toEqual([]);
  });

  it("keeps navigation, account, country, cart, main, and legal landmarks explicit", () => {
    const missing = requiredFiles.filter((path) => !existsSync(absolute(path)));
    expect(missing).toEqual([]);
    if (missing.length > 0) return;

    const layout = source("src/layouts/SiteLayout.astro");
    const header = source("src/components/site/Header.astro");
    const footer = source("src/components/site/Footer.astro");

    expect(layout).toContain("<SkipLink");
    expect(layout).toContain('<main id="main-content"');
    expect(header).toContain("Login");
    expect(header).toContain("Start Trial");
    expect(header).toContain("data-country-selector");
    expect(header).toContain("data-cart-button");
    expect(footer).toContain("LEGAL_LINKS");
  });

  it("never exposes the internal repository name in the customer shell", () => {
    const present = requiredFiles.filter((path) => existsSync(absolute(path)));
    expect(present.map(source).join("\n")).not.toContain("HeroNet");
  });
});
