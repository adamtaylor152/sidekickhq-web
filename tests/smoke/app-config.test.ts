import { describe, expect, it } from "vitest";

import pkg from "../../package.json";

describe("application scripts", () => {
  it("provides one complete verification command", () => {
    expect(pkg.scripts.verify).toBe(
      "npm run check && npm run lint && npm test && npm run build",
    );
  });
});
