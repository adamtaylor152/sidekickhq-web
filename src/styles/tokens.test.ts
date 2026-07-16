import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) =>
  readFileSync(new URL(path, import.meta.url), "utf8");

describe("Sidekick design system", () => {
  it.each([
    "--sk-color-navy-950",
    "--sk-color-blue-500",
    "--sk-color-paper",
    "--sk-font-heading",
    "--sk-space-6",
    "--sk-radius-card",
  ])("defines %s", (token) => {
    expect(read("./tokens.css")).toContain(token);
  });

  it("keeps the approved lockup byte-for-byte", () => {
    const logo = read("../../public/brand/sidekick-lockup-color-dark.svg");
    expect(createHash("sha256").update(logo).digest("hex")).toBe(
      "2bfd3081a95507941e04c87b58ca12dea067c8c58dc3dc657aaf5cf50f87a1fe",
    );
  });

  it("caps public heading weight at 600", () => {
    const css = `${read("./tokens.css")}\n${read("./global.css")}`;
    expect(css).not.toMatch(/font-weight:\s*(?:[7-9]00|bold|bolder)/);
  });
});
