import { expect, test } from "@playwright/test";

test("homepage presents the connected early-access invitation", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Sidekick - CRM & ERP for Small Business");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://sidekickhq.ca/images/social/sidekick-social-preview.jpg");
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  await expect(page.locator('meta[name="keywords"]')).toHaveAttribute("content", /CRM for small business/);
  const hero = page.getByRole("region", { name: "CRM & ERP for small business, finally on the same side." });
  await expect(hero.getByRole("heading", { level: 1 })).toContainText("CRM & ERP");
  await expect(page.getByTitle("See Sidekick in motion")).toHaveAttribute("src", /youtube-nocookie\.com\/embed\/2MrzTzUV6bI/);
  await expect(page.getByText(/coming soon/i)).toHaveCount(0);
  await expect(hero.getByRole("button", { name: "Request Early Invite" })).toBeVisible();
  await expect
    .poll(async () => Number((await hero.locator("[data-social-count]").textContent())?.replaceAll(",", "")))
    .toBeGreaterThanOrEqual(2_312);
  await expect(hero.getByText("small businesses have requested early access.", { exact: true })).toBeVisible();
  await expect
    .poll(() => page.getByRole("banner").getByRole("img", { name: "Sidekick" }).evaluate((logo) => logo.getBoundingClientRect().width))
    .toBeGreaterThanOrEqual(page.viewportSize()!.width <= 480 ? 128 : 168);
  await expect(page.getByRole("banner").getByRole("link", { name: "Login", exact: true })).toHaveAttribute("href", "https://app.sidekickhq.ca");
  const legal = page.getByRole("navigation", { name: "Legal" });
  await expect(legal.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/legal/privacy");
  await expect(legal.getByRole("link", { name: "Terms of Use" })).toHaveAttribute("href", "/legal/terms");
  await expect(page.getByRole("contentinfo")).toHaveCount(0);
});

test("wide hero uses 4K landscape artwork that crosses centre and bleeds right", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.route("**/api/early-access", (route) => route.fulfill({ json: { data: { count: 2_312, people: [] } } }));
  await page.goto("/");

  const artwork = page.locator(".hero-landscape");
  const geometry = await artwork.evaluate((image: HTMLImageElement) => {
    const bounds = image.getBoundingClientRect();
    return {
      naturalWidth: image.naturalWidth,
      left: bounds.left,
      right: bounds.right,
      viewportWidth: window.innerWidth,
    };
  });

  expect(geometry.naturalWidth).toBeGreaterThanOrEqual(3840);
  expect(geometry.left).toBeLessThan(geometry.viewportWidth / 2);
  expect(geometry.right).toBeGreaterThan(geometry.viewportWidth);
});

test("invite form sends an explicit marketing preference and offers existing-user login", async ({ page }) => {
  let submittedBody: Record<string, unknown> | undefined;
  await page.route("**/api/places/autocomplete**", (route) => route.fulfill({ json: { data: { suggestions: [] } } }));
  await page.route("**/api/early-access", async (route) => {
    if (route.request().method() === "POST") {
      submittedBody = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({ status: 201, json: { data: { count: 2_313, signupNumber: 2_313 } } });
      return;
    }
    await route.fulfill({ json: { data: { count: 2_312, people: [] } } });
  });

  await page.goto("/#invite");
  const invite = page.getByRole("region", { name: "Put your business near the front of the line." });
  const publicDisplay = invite.getByRole("checkbox", { name: /show my first name and last initial/i });
  const marketing = invite.getByRole("checkbox", { name: /marketing communications/i });
  await expect(publicDisplay).toBeChecked();
  await expect(marketing).not.toBeChecked();
  await marketing.check();
  await invite.getByRole("textbox", { name: "First name" }).fill("Jamie");
  await invite.getByRole("textbox", { name: "Last name" }).fill("Taylor");
  await invite.getByRole("textbox", { name: "Email address" }).fill("jamie@example.com");
  await invite.getByRole("combobox", { name: /Company/ }).fill("Taylor & Co. Repair");
  await invite.getByRole("button", { name: "Request Early Invite" }).click();

  await expect.poll(() => submittedBody?.marketingCommunicationsConsent).toBe(true);
  await expect(page.getByRole("link", { name: "Already granted early access?" })).toHaveAttribute("href", "https://app.sidekickhq.ca");
});

test("invite form introduces the referral shortcut before personal details", async ({ page }) => {
  await page.route("**/api/early-access", (route) => route.fulfill({ json: { data: { count: 2_312, people: [] } } }));
  await page.goto("/#invite");

  const invite = page.getByRole("region", { name: "Put your business near the front of the line." });
  const referralHint = invite.getByRole("note", { name: "Sidekick referral hint" });
  const firstName = invite.getByRole("textbox", { name: "First name" });

  await expect(referralHint).toContainText("Know someone who already has Sidekick access?");
  await expect(referralHint).toContainText("Each company gets 5 invites they can share for instant access.");
  await expect
    .poll(async () => {
      const hintTop = await referralHint.evaluate((element) => element.getBoundingClientRect().top);
      const fieldTop = await firstName.evaluate((element) => element.getBoundingClientRect().top);
      return hintTop < fieldTop;
    })
    .toBe(true);
});

test("social proof appears frequently and rotates through different signups", async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0;
    const nativeSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = ((handler: TimerHandler, timeout = 0, ...args: unknown[]) =>
      nativeSetTimeout(handler, Number(timeout) * 0.01, ...args)) as typeof window.setTimeout;
    window.addEventListener("DOMContentLoaded", () => {
      const messages: string[] = [];
      Object.assign(window, { __socialProofMessages: messages });
      const message = document.querySelector("[data-social-proof-message]");
      if (!message) return;
      new MutationObserver(() => {
        const text = message.textContent?.trim();
        if (text && messages.at(-1) !== text) messages.push(text);
      }).observe(message, { childList: true, characterData: true, subtree: true });
    });
  });
  await page.route("**/api/early-access", (route) =>
    route.fulfill({
      json: {
        data: {
          count: 2_315,
          people: [
            { displayName: "Alex R.", signupNumber: 2_313, createdAt: "2026-07-28T00:00:00Z" },
            { displayName: "Morgan T.", signupNumber: 2_314, createdAt: "2026-07-28T00:01:00Z" },
            { displayName: "Sam K.", signupNumber: 2_315, createdAt: "2026-07-28T00:02:00Z" },
          ],
        },
      },
    }),
  );

  await page.goto("/");
  await expect(page.locator("[data-social-count]").first()).toHaveText("2,315");
  await page.mouse.click(20, 200);
  await page.waitForTimeout(450);

  const messages = await page.evaluate(() =>
    (window as typeof window & { __socialProofMessages?: string[] }).__socialProofMessages ?? [],
  );
  expect(messages.length).toBeGreaterThanOrEqual(5);
  expect(new Set(messages.slice(0, 3)).size).toBe(3);
});

test("company suggestions present business identity and location clearly", async ({ page }) => {
  await page.route("**/api/early-access", (route) => route.fulfill({ json: { data: { count: 2_312, people: [] } } }));
  await page.route("**/api/places/autocomplete**", (route) =>
    route.fulfill({
      json: {
        data: {
          suggestions: [
            {
              placeId: "places/sidekick-cafe",
              fullText: "Sidekick Cafe, 101 8 Avenue SW, Calgary, AB, Canada",
              primaryText: "Sidekick Cafe",
              secondaryText: "101 8 Avenue SW, Calgary, AB, Canada",
            },
          ],
        },
      },
    }),
  );

  await page.goto("/#invite");
  await page.getByRole("combobox", { name: "Company" }).fill("Sidekick");

  const option = page.getByRole("option");
  await expect(option.getByText("Sidekick Cafe", { exact: true })).toBeVisible();
  await expect(option.getByText("101 8 Avenue SW, Calgary, AB, Canada", { exact: true })).toBeVisible();
  await expect(option.getByText("Business match", { exact: true })).toBeVisible();
  await expect(option.locator(".company-suggestion__pin")).toBeVisible();
});

test("landing page links to a complete Sidekick privacy policy", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Legal" })
    .getByRole("link", { name: "Privacy Policy" })
    .click();

  await expect(page).toHaveURL("/legal/privacy");
  await expect(page.getByRole("heading", { level: 1, name: "Privacy Policy" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Privacy policy contents" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "What We Collect" })).toBeVisible();
  await expect(page.getByText("888 3rd St SW, Suite 1000, Calgary, AB T2P 5C5", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("2691003 ALBERTA INC.")).toHaveCount(0);
  await expect(page.getByText("Hero IT", { exact: true })).toHaveCount(0);
});

test("landing page links to complete Sidekick terms of use", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Legal" }).getByRole("link", { name: "Terms of Use" }).click();

  await expect(page).toHaveURL("/legal/terms");
  await expect(page.getByRole("heading", { level: 1, name: "Terms of Use" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Terms of use contents" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Permitted Use" })).toBeVisible();
  await expect(page.getByText("888 3rd St SW, Suite 1000, Calgary, AB T2P 5C5", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("(825) 479-2600", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("2691003 ALBERTA INC.")).toHaveCount(0);
  await expect(page.getByText("Hero IT", { exact: true })).toHaveCount(0);
});

test("privacy and terms omit shared navigation and footer escape routes", async ({ page }) => {
  for (const path of ["/legal/privacy", "/legal/terms"]) {
    await page.goto(path);
    await expect(page.getByRole("banner")).toHaveCount(0);
    await expect(page.getByRole("contentinfo")).toHaveCount(0);
    await expect(page.getByRole("complementary", { name: "Early access" })).toHaveCount(0);
  }
});

test("Voice uses activation and never advertises a trial", async ({ page }) => {
  await page.goto("/checkout?offer=voice.business");
  await expect(page.getByText("Guided activation")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sidekick Voice Business Voice" })).toBeVisible();
  await expect(page.getByText("30-day trial", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Numbers", { exact: true })).toBeVisible();
  await expect(page.getByText("Hardware", { exact: true })).toBeVisible();
});

test("eligible software has a no-card trial", async ({ page }) => {
  await page.goto("/checkout?offer=crm.essentials");
  await expect(page.getByText("30-day trial · no credit card required")).toBeVisible();
  await expect(page.getByText("Workspace", { exact: true })).toBeVisible();
});

test("country selector localizes CRM pricing", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("sidekick-country", "CA"));
  await page.goto("/pricing");
  await expect(page.getByRole("button", { name: "Choose country and currency" })).toContainText("Canada");
  await expect(page.locator('[data-price-for="crm.essentials"]')).toContainText("$34");
  await page.getByRole("button", { name: "Annual · 2 months free" }).click();
  await expect(page.locator('[data-price-for="crm.essentials"]')).toContainText("$336");
});

test("all forty industries are linked from the industry index", async ({ page }) => {
  await page.goto("/industries");
  await expect(page.locator('.industry-grid a')).toHaveCount(40);
});

test("Help Center narrows a four-level directory without publishing article bodies", async ({ page }) => {
  await page.goto("/help");
  await expect(page.getByRole("heading", { name: "Start with the product. Narrow to the job." })).toBeVisible();
  await page.getByRole("searchbox", { name: "What are you trying to do?" }).fill("Yealink");
  const voiceHelp = page.locator('details[data-help-slug="voice"]');
  await expect(voiceHelp).toBeVisible();
  await expect(voiceHelp).toHaveAttribute("open", "");
  await expect(page.locator("details[data-help-product]:visible")).toHaveCount(1);
  await expect(voiceHelp.getByText("Help articles coming in the Customer Help Center publishing phase.")).toBeVisible();
});

test("every Voice purchase path has a dedicated detail page", async ({ page }) => {
  await page.goto("/products/voice/editions");
  await expect(page.getByRole("link", { name: "Full edition details" })).toHaveCount(3);
  await expect(page.getByText("Optional Poly and Yealink phones")).toBeVisible();
});
