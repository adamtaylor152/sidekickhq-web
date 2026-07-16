import { expect, test } from "@playwright/test";

test("homepage presents the connected product platform", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Every part of your business");
  await expect(page.getByRole("heading", { name: "Sidekick Appointments" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Browse hardware" })).toHaveCount(2);
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
