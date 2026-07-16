import { describe, expect, it } from "vitest";
import { PRICE_OFFERS, localAnnualPrice, localMonthlyPrice } from "../../src/content/pricing";

describe("localized pricing", () => {
  it("prices Canada at 40 percent above US, rounded", () => expect(localMonthlyPrice(24,"CA")).toBe(34));
  it("makes annual service equal ten monthly payments", () => expect(localAnnualPrice(60,"US")).toBe(600));
  it("never gives Voice or Protect a trial", () => expect(PRICE_OFFERS.filter(({product}) => ["Sidekick Voice","Sidekick Protect"].includes(product)).every(({trialEligible})=>!trialEligible)).toBe(true));
});
