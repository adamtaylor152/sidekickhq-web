# Sidekick Marketing Storefront Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Sidekick marketing website, product mini-sites, edition pages, 40 industry pages, Help Center landing page, localized pricing, persistent cart, and product-aware checkout shell as one production-grade Astro application.

**Architecture:** Astro renders accessible HTML by default from typed product, edition, industry, resource, and legal registries. Small React islands own only country selection, live catalogue pricing, cart state, and checkout state. Production pricing is fetched from HeroNet's public Sidekick catalogue projection; a clearly isolated development fixture supports local review and is forbidden in production.

**Tech Stack:** Astro 5, strict TypeScript, Tailwind CSS 4, React 19 islands, Zod, Vitest, Testing Library, Playwright, axe-core, Docker, Node 22.

## Global Constraints

- Public brand is Sidekick; never expose HeroNet to customers.
- Company is Sidekick HQ Inc.; target domain is `sidekickhq.ca`.
- Use the exact approved caped-K SVG; never redraw or regenerate it.
- Use semantic tokens: deep navy/electric blue, warm paper, Manrope 600 headings, Inter body, purposeful circles.
- Product pages are distinct mini-sites, not a repeated standard-page template.
- Publish every product and all 40 approved industry pages; do not publish Help Center article bodies.
- Canada and the United States only; CAD and USD only; Canada is the detection fallback.
- Software CAD prices equal 140% of USD prices rounded to whole dollars.
- Annual software pricing equals ten USD monthly payments; CAD annual equals 140% of that total rounded to a whole dollar.
- Hardware uses verified local retail MSRP and never receives annual discounting.
- Sidekick Voice, Payments, and Protect never receive trials; eligible software receives 30 days without a card.
- Phone hardware is Yealink and Poly only.
- Never identify the underlying Payments or Protect provider publicly.
- No testimonials, customer logos, fabricated metrics, unsupported adoption claims, or CSS device-screen overlays.
- Production checkout stays disabled until every launch gate in the approved spec passes.

---

### Task 1: Scaffold the Astro application and quality gates

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/env.d.ts`
- Create: `src/test/setup.ts`
- Create: `tests/smoke/app-config.test.ts`

**Interfaces:**
- Produces: Node scripts `dev`, `build`, `preview`, `check`, `lint`, `test`, `test:e2e`, and `verify`.
- Produces: `@/*` alias mapped to `src/*`.

- [ ] **Step 1: Write the failing configuration test**

```ts
import { describe, expect, it } from "vitest";
import pkg from "../../package.json";

describe("application scripts", () => {
  it("provides one complete verification command", () => {
    expect(pkg.scripts.verify).toBe("npm run check && npm run lint && npm test && npm run build");
  });
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `npm test -- tests/smoke/app-config.test.ts`
Expected: FAIL because the package and test runner are not configured.

- [ ] **Step 3: Add the exact toolchain**

Create `package.json` with Node `>=22`, Astro `^5`, React `^19`, Tailwind `^4`, Zod `^3`, Vitest, Testing Library, Playwright, axe-core, ESLint, Prettier, and TypeScript. Configure strict TypeScript and the Node adapter in `astro.config.mjs`; configure jsdom in Vitest and Chromium/Desktop Safari/mobile Chromium projects in Playwright.

- [ ] **Step 4: Install and verify the scaffold**

Run: `npm install && npm test -- tests/smoke/app-config.test.ts && npm run check`
Expected: PASS with no Astro diagnostics.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts playwright.config.ts src/env.d.ts src/test/setup.ts tests/smoke/app-config.test.ts
git commit -m "chore: scaffold Sidekick storefront"
```

### Task 2: Install the exact brand assets and semantic design system

**Files:**
- Create: `public/brand/sidekick-lockup-color-dark.svg`
- Create: `public/brand/sidekick-mark-color.svg`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/styles/motion.css`
- Create: `src/styles/tokens.test.ts`

**Interfaces:**
- Produces: CSS variables `--sk-color-*`, `--sk-font-*`, `--sk-space-*`, `--sk-radius-*`, `--sk-shadow-*`, `--sk-duration-*`, `--sk-ease-*`, and `--sk-container-*`.
- Produces: `.sk-container`, `.sk-section`, `.sk-display`, `.sk-heading`, `.sk-body`, `.sk-focus-ring`, and reduced-motion behavior.

- [ ] **Step 1: Write a token-contract test**

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../../src/styles/tokens.css", import.meta.url), "utf8");

describe("design tokens", () => {
  it.each(["--sk-color-navy-950", "--sk-color-blue-500", "--sk-color-paper", "--sk-font-heading", "--sk-space-6", "--sk-radius-card"])("defines %s", token => {
    expect(css).toContain(token);
  });
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `npm test -- src/styles/tokens.test.ts`
Expected: FAIL because the token file does not exist.

- [ ] **Step 3: Copy and validate the approved vector**

Copy `/Users/adamtaylor/Github/heroITweb/.worktrees/sidekick-logo/public/brand/sidekick/sidekick-lockup-color-dark.svg` byte-for-byte to `public/brand/sidekick-lockup-color-dark.svg`. Derive the mark-only SVG by preserving the exact existing mark paths and viewBox; do not redraw geometry.

- [ ] **Step 4: Implement the token layers**

Define palette, typography, fluid type, spacing, containers, radii, borders, elevation, focus, and motion as semantic custom properties. Import Manrope weights 500/600 and Inter 400/500/600. Limit heading weight to 600 and implement `prefers-reduced-motion` globally.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- src/styles/tokens.test.ts && npm run check`
Expected: PASS.

```bash
git add public/brand src/styles
git commit -m "feat: add Sidekick brand design system"
```

### Task 3: Create typed route and content registries

**Files:**
- Create: `src/content/types.ts`
- Create: `src/content/products.ts`
- Create: `src/content/editions.ts`
- Create: `src/content/industries.ts`
- Create: `src/content/resources.ts`
- Create: `src/content/legal.ts`
- Create: `src/content/navigation.ts`
- Create: `src/content/validate.ts`
- Create: `src/content/content-registry.test.ts`

**Interfaces:**
- Produces: `ProductDefinition`, `EditionDefinition`, `IndustryDefinition`, `SliceDefinition`, `FeatureGroup`, `SeoDefinition`, and `CtaDefinition`.
- Produces: `PRODUCTS`, `EDITIONS`, `INDUSTRIES`, `RESOURCE_CATEGORIES`, `LEGAL_LINKS`, and `GLOBAL_NAVIGATION` as readonly validated registries.
- Produces: `getProduct(slug)`, `getProductEditions(productSlug)`, `getIndustry(slug)`, and `assertContentRegistry()`.

- [ ] **Step 1: Write registry completeness tests**

```ts
import { describe, expect, it } from "vitest";
import { PRODUCTS } from "@/content/products";
import { INDUSTRIES } from "@/content/industries";
import { assertContentRegistry } from "@/content/validate";

describe("content registry", () => {
  it("publishes the complete product constellation", () => {
    expect(PRODUCTS.map(product => product.slug)).toEqual(expect.arrayContaining([
      "crm", "voice", "payments", "msp", "rentals", "erp", "protect", "commerce", "appointments", "sites", "desktop", "ai",
    ]));
  });

  it("contains exactly forty unique industry routes", () => {
    expect(INDUSTRIES).toHaveLength(40);
    expect(new Set(INDUSTRIES.map(industry => industry.slug)).size).toBe(40);
  });

  it("has no broken cross references", () => expect(() => assertContentRegistry()).not.toThrow());
});
```

- [ ] **Step 2: Run the tests and verify failure**

Run: `npm test -- src/content/content-registry.test.ts`
Expected: FAIL because the registries do not exist.

- [ ] **Step 3: Define product and edition content**

Author all twelve product entries and the approved CRM, MSP, Rentals, Commerce, Appointments, and Sites edition entries. Each product must have unique hero copy, outcomes, grouped features, workflow slices, media direction, relevant industries, FAQs, mini-nav items, pricing offer keys, and CTA policy. Voice must foreground real Yealink/Poly phones; Payments must foreground real terminals; AI must explain embedded AI versus separately purchased agents.

- [ ] **Step 4: Define all forty industries**

Author every approved industry with a distinct buyer problem, recommended product combination, three concrete workflows, operational examples, feature links, photography direction, and CTA. The validator must reject duplicate slugs, unknown product references, fewer than three workflows, missing alt-text direction, missing CTA, or generic repeated hero copy.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- src/content/content-registry.test.ts && npm run check`
Expected: PASS with twelve products and forty industries.

```bash
git add src/content
git commit -m "feat: author Sidekick product and industry content"
```

### Task 4: Build accessible layouts, navigation, footer, and reusable primitives

**Files:**
- Create: `src/layouts/SiteLayout.astro`
- Create: `src/layouts/ProductLayout.astro`
- Create: `src/components/site/AnnouncementBar.astro`
- Create: `src/components/site/Header.astro`
- Create: `src/components/site/MegaMenu.astro`
- Create: `src/components/site/ProductMiniNav.astro`
- Create: `src/components/site/Footer.astro`
- Create: `src/components/ui/Button.astro`
- Create: `src/components/ui/LinkArrow.astro`
- Create: `src/components/ui/Icon.astro`
- Create: `src/components/ui/CircleAccent.astro`
- Create: `src/components/ui/Breadcrumbs.astro`
- Create: `src/components/ui/SkipLink.astro`
- Create: `tests/components/site-shell.test.ts`

**Interfaces:**
- Produces: `SiteLayout` props `{ title, description, canonicalPath, theme?, structuredData? }`.
- Produces: `ProductLayout` props `{ product, activePath }`.
- Consumes: global registries and cart/country islands from later tasks through stable component slots.

- [ ] **Step 1: Write shell rendering tests**

Test that the shell contains one skip link, one `main`, Login and Start Trial actions, Products/Industries/Resources/Pricing navigation, country and cart mount points, legal links, and no customer-facing `HeroNet` text.

- [ ] **Step 2: Run the tests and verify failure**

Run: `npm test -- tests/components/site-shell.test.ts`
Expected: FAIL because the layouts do not exist.

- [ ] **Step 3: Implement semantic primitives and shells**

Use native landmarks, disclosure buttons, focus management, keyboard-operable mega menus, escaped JSON-LD, and named slots. Build the product mini-nav as a sticky secondary navigation that changes by product rather than forcing every mini-site into identical sections.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/components/site-shell.test.ts && npm run check`
Expected: PASS.

```bash
git add src/layouts src/components tests/components/site-shell.test.ts
git commit -m "feat: build Sidekick site shell"
```

### Task 5: Build the visual slice library

**Files:**
- Create: `src/components/slices/HeroSlice.astro`
- Create: `src/components/slices/ProductConstellation.astro`
- Create: `src/components/slices/WorkflowStory.astro`
- Create: `src/components/slices/FeatureLedger.astro`
- Create: `src/components/slices/EditorialSplit.astro`
- Create: `src/components/slices/MediaStage.astro`
- Create: `src/components/slices/IndustryPathways.astro`
- Create: `src/components/slices/AiOperatingLayer.astro`
- Create: `src/components/slices/HardwareStage.astro`
- Create: `src/components/slices/EditionComparison.astro`
- Create: `src/components/slices/FaqList.astro`
- Create: `src/components/slices/ConversionBand.astro`
- Create: `src/components/slices/SliceRenderer.astro`
- Create: `tests/components/slice-renderer.test.ts`

**Interfaces:**
- Produces: `SliceRenderer({ slices, product?, industry? })` with an exhaustive switch over `SliceDefinition["kind"]`.
- Produces: varied slice compositions; no page is required to use every slice or the same order.

- [ ] **Step 1: Write exhaustive rendering tests**

Create one fixture per slice kind and assert semantic heading order, CTA links, alt text, and the absence of empty wrapper markup.

- [ ] **Step 2: Run the tests and verify failure**

Run: `npm test -- tests/components/slice-renderer.test.ts`
Expected: FAIL because the renderer is missing.

- [ ] **Step 3: Implement the slice library**

Use composition variants (`navy`, `paper`, `blue`, `white`), asymmetrical media stages, editorial grids, meaningful circle accents, and restrained motion. Hardware stages render complete production images only; they expose no CSS screen-overlay slot.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/components/slice-renderer.test.ts && npm run check`
Expected: PASS.

```bash
git add src/components/slices tests/components/slice-renderer.test.ts
git commit -m "feat: add flexible marketing slice system"
```

### Task 6: Generate and install production imagery

**Files:**
- Create: `public/images/products/voice/*`
- Create: `public/images/products/payments/*`
- Create: `public/images/products/*`
- Create: `public/images/industries/*`
- Create: `src/content/media.ts`
- Create: `src/content/media.test.ts`

**Interfaces:**
- Produces: `MEDIA` registry with `{ src, width, height, alt, sourceType, approval, focalPoint }`.
- Consumes: exact approved brand assets and product UI direction.

- [ ] **Step 1: Write media provenance tests**

Require every referenced image to exist, have intrinsic dimensions and human-written alt text, and declare `generated`, `licensed`, or `manufacturer` provenance. Reject filenames or metadata that expose the underlying Payments or Protect provider.

- [ ] **Step 2: Generate and curate the imagery**

Use the image-generation workflow for Sidekick-branded Yealink/Poly phone screens, payment-terminal screens, product UI compositions, and selected industry photography. Preserve recognizable manufacturer hardware geometry, avoid logos that Sidekick does not own, reject malformed hands/text/ports/buttons, and create desktop plus mobile crops where the composition cannot crop safely.

- [ ] **Step 3: Optimize assets**

Store final AVIF/WebP assets at appropriate intrinsic sizes, preserve a lossless master for hardware, and keep total above-the-fold transfer under the performance budget.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- src/content/media.test.ts`
Expected: PASS with no missing or unapproved asset.

```bash
git add public/images src/content/media.ts src/content/media.test.ts
git commit -m "feat: add production Sidekick imagery"
```

### Task 7: Build the homepage, platform, and AI pages

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/platform.astro`
- Create: `src/pages/products/ai/index.astro`
- Create: `src/pages/products/desktop/index.astro`
- Create: `tests/pages/core-pages.test.ts`

**Interfaces:**
- Consumes: `PRODUCTS`, slice components, media registry, pricing links.
- Produces: primary constellation discovery routes and Start Trial conversion paths.

- [ ] **Step 1: Write page contract tests**

Assert the main promise, twelve product links, Sidekick AI distinction, industry pathways, self-serve trial disclosure, Login, Start Trial, and valid canonical metadata.

- [ ] **Step 2: Run the tests and verify failure**

Run: `npm test -- tests/pages/core-pages.test.ts`
Expected: FAIL because the pages are missing.

- [ ] **Step 3: Implement distinctive compositions**

Build the homepage around a human business narrative, product constellation, connected workflows, AI operating layer, hardware proof, industry pathways, and transparent buying. Build Platform as the integration/data narrative. Build AI around embedded intelligence, separately purchased agents, credit transparency, and examples that look like real workflows rather than an abstract AI node graphic.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/pages/core-pages.test.ts && npm run check`
Expected: PASS.

```bash
git add src/pages/index.astro src/pages/platform.astro src/pages/products/ai src/pages/products/desktop tests/pages/core-pages.test.ts
git commit -m "feat: build Sidekick core marketing pages"
```

### Task 8: Build every product mini-site and edition route

**Files:**
- Create: `src/pages/products/index.astro`
- Create: `src/pages/products/[product].astro`
- Create: `src/pages/products/[product]/features/[feature].astro`
- Create: `src/pages/products/[product]/editions/index.astro`
- Create: `src/pages/products/[product]/editions/[edition].astro`
- Create: `src/pages/products/voice/phones.astro`
- Create: `src/pages/products/payments/terminals.astro`
- Create: `tests/pages/product-routes.test.ts`

**Interfaces:**
- Consumes: product and edition registries, `ProductLayout`, media, live offer keys.
- Produces: static paths for every approved product, warranted feature route, edition family, and hardware route.

- [ ] **Step 1: Write route-generation tests**

Assert that every product has a mini-site, CRM/MSP/Rentals have all three approved edition routes, Commerce/Appointments/Sites expose their three published offers, and every generated route has unique hero copy and a valid CTA policy.

- [ ] **Step 2: Run the tests and verify failure**

Run: `npm test -- tests/pages/product-routes.test.ts`
Expected: FAIL because the dynamic routes are missing.

- [ ] **Step 3: Implement mini-site routing**

Use `getStaticPaths()` from validated registries. Choose product-specific slice order and media treatment from each product definition. Voice opens with real phones and activation/porting; Payments opens with terminals and unified processing; Appointments opens with service-business scheduling; CRM, MSP, and Rentals lead into their full tier comparisons.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/pages/product-routes.test.ts && npm run check`
Expected: PASS for all routes.

```bash
git add src/pages/products tests/pages/product-routes.test.ts
git commit -m "feat: build Sidekick product mini-sites"
```

### Task 9: Build the 40 industry pages

**Files:**
- Create: `src/pages/industries/index.astro`
- Create: `src/pages/industries/[industry].astro`
- Create: `src/components/industry/IndustryHero.astro`
- Create: `src/components/industry/ProductRecipe.astro`
- Create: `src/components/industry/WorkflowExample.astro`
- Create: `tests/pages/industry-routes.test.ts`

**Interfaces:**
- Consumes: `INDUSTRIES`, product registry, media registry.
- Produces: forty statically rendered, cross-linked industry routes plus directory filtering metadata.

- [ ] **Step 1: Write industry-quality tests**

Assert forty pages, unique title/description/hero copy, at least three concrete workflows per page, at least two relevant products, a photography asset, and no unsupported metric/testimonial.

- [ ] **Step 2: Run the tests and verify failure**

Run: `npm test -- tests/pages/industry-routes.test.ts`
Expected: FAIL because the pages do not exist.

- [ ] **Step 3: Implement directory and pages**

Group the directory into the five approved industry families. Compose each page from its own problem statement, product recipe, workflow examples, operational detail, relevant feature deep links, and conversion path. Do not use a single fixed slice sequence across all pages.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/pages/industry-routes.test.ts && npm run check`
Expected: PASS with exactly forty pages.

```bash
git add src/pages/industries src/components/industry tests/pages/industry-routes.test.ts
git commit -m "feat: publish Sidekick industry solutions"
```

### Task 10: Build resources, Help Center landing, company, and legal pages

**Files:**
- Create: `src/pages/resources/index.astro`
- Create: `src/pages/help/index.astro`
- Create: `src/components/help/HelpSearch.tsx`
- Create: `src/components/help/CategoryTree.astro`
- Create: `src/pages/company/index.astro`
- Create: `src/pages/contact.astro`
- Create: `src/pages/legal/privacy.astro`
- Create: `src/pages/legal/terms.astro`
- Create: `src/pages/legal/cookies.astro`
- Create: `src/pages/legal/acceptable-use.astro`
- Create: `src/pages/legal/accessibility.astro`
- Create: `src/pages/legal/refunds.astro`
- Create: `tests/pages/resource-legal-routes.test.ts`

**Interfaces:**
- Produces: public Help Center category/search shell with login handoff for account-specific support.
- Produces: exact legal link parity with the approved Hero IT examples, rewritten for Sidekick HQ Inc.

- [ ] **Step 1: Write route and disclosure tests**

Assert Help Center has multiple category levels and no article-body routes; account-specific support points to login; every footer legal link resolves; refund copy distinguishes trials, recurring services, usage, merchant services, porting/setup, and hardware.

- [ ] **Step 2: Run the tests and verify failure**

Run: `npm test -- tests/pages/resource-legal-routes.test.ts`
Expected: FAIL because routes are missing.

- [ ] **Step 3: Implement the resource and legal surfaces**

Build the Help Center landing around product, task, and account categories with an accessible client-side filter over category metadata only. Publish legal shells as reviewable launch copy and visibly mark legal approval as a production-checkout gate in internal metadata, not public text.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/pages/resource-legal-routes.test.ts && npm run check`
Expected: PASS.

```bash
git add src/pages/resources src/pages/help src/pages/company src/pages/contact.astro src/pages/legal src/components/help tests/pages/resource-legal-routes.test.ts
git commit -m "feat: add Sidekick resources and legal pages"
```

### Task 11: Implement country detection and live catalogue pricing

**Files:**
- Create: `src/lib/country/types.ts`
- Create: `src/lib/country/resolve.ts`
- Create: `src/lib/catalogue/types.ts`
- Create: `src/lib/catalogue/schema.ts`
- Create: `src/lib/catalogue/client.ts`
- Create: `src/lib/catalogue/development-fixture.ts`
- Create: `src/pages/api/country.json.ts`
- Create: `src/pages/api/catalogue.json.ts`
- Create: `src/components/commerce/CountrySelector.tsx`
- Create: `src/components/commerce/PricingTable.tsx`
- Create: `src/pages/pricing.astro`
- Create: `tests/lib/country-catalogue.test.ts`

**Interfaces:**
- Produces: `CountryCode = "CA" | "US"` and `resolveCountry({ override, edgeCountry }): CountryCode`.
- Produces: `PublicCatalogue` Zod schema matching HeroNet's allowlisted projection.
- Produces: `getPublicCatalogue(country, fetcher): Promise<PublicCatalogue>` with ETag support and no stale indefinite fallback.
- Produces: `/api/catalogue.json?country=CA|US` and a `sk-country` secure first-party cookie.

- [ ] **Step 1: Write country and catalogue contract tests**

Test explicit override precedence, CA fallback, unsupported-country rejection, provider-field rejection, CAD/USD filtering, annual savings derived only from published components, and production refusal to use the development fixture.

- [ ] **Step 2: Run the tests and verify failure**

Run: `npm test -- tests/lib/country-catalogue.test.ts`
Expected: FAIL because resolvers do not exist.

- [ ] **Step 3: Implement safe catalogue fetching**

Validate the HeroNet response with Zod and expose only customer fields. Permit `SIDEKICK_USE_CATALOG_FIXTURE=true` only when `import.meta.env.PROD` is false. On production upstream failure, return `503` with `Retry-After` and render pricing unavailable rather than cached invented amounts.

- [ ] **Step 4: Implement the selector and pricing page**

Persist a manual country override, update the flag/label, refetch prices, and dispatch `sidekick:country-changed`. Display monthly or annual totals, whole-dollar effective monthly amounts, two-month-free messaging, units, trial policy, taxes disclosure, and a compare link.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- tests/lib/country-catalogue.test.ts && npm run check`
Expected: PASS.

```bash
git add src/lib/country src/lib/catalogue src/pages/api src/components/commerce/CountrySelector.tsx src/components/commerce/PricingTable.tsx src/pages/pricing.astro tests/lib/country-catalogue.test.ts
git commit -m "feat: add localized live pricing"
```

### Task 12: Implement persistent cart and checkout configuration shell

**Files:**
- Create: `src/lib/cart/types.ts`
- Create: `src/lib/cart/schema.ts`
- Create: `src/lib/cart/reducer.ts`
- Create: `src/lib/cart/storage.ts`
- Create: `src/components/commerce/CartButton.tsx`
- Create: `src/components/commerce/CartDrawer.tsx`
- Create: `src/components/commerce/AddOfferButton.tsx`
- Create: `src/pages/cart.astro`
- Create: `src/pages/checkout/index.astro`
- Create: `src/components/checkout/CheckoutShell.tsx`
- Create: `src/components/checkout/step-registry.ts`
- Create: `tests/lib/cart.test.ts`

**Interfaces:**
- Produces: `CartIntent { offerVersionId, configurationSchemaVersion, country, cadence, quantity, assignment, hardware, configuration }`.
- Produces: `cartReducer(state, action)`, `loadCart()`, `saveCart()`, `revalidateCart(country)`.
- Produces: checkout step registry keyed by `software`, `voice`, `payments`, `protect`, and `hardware` requirements.

- [ ] **Step 1: Write reducer and policy tests**

Test add/update/remove, item count, malformed storage recovery, country-change revalidation, price-change acknowledgement, mixed-cart payment requirement, 30-day eligible trial, and Voice/Payments/Protect no-trial rules.

- [ ] **Step 2: Run the tests and verify failure**

Run: `npm test -- tests/lib/cart.test.ts`
Expected: FAIL because cart modules do not exist.

- [ ] **Step 3: Implement persistent configured intents**

Use schema-versioned local storage without storing authoritative totals. Refetch catalogue state at cart display and checkout entry. Remove unavailable items only after explaining the change. Never trust browser prices at order submission.

- [ ] **Step 4: Implement the cart and checkout shell**

Render shared account/business/billing/review stages and inject product-specific stages: Voice numbers/porting/E911/users/call flow/phones; Payments merchant/terminals/shipping; Protect workloads/coverage; software users/admin/trial. Disable final production submission behind `PUBLIC_CHECKOUT_ENABLED` until the backend order endpoint and launch gates are ready.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- tests/lib/cart.test.ts && npm run check`
Expected: PASS.

```bash
git add src/lib/cart src/components/commerce src/components/checkout src/pages/cart.astro src/pages/checkout tests/lib/cart.test.ts
git commit -m "feat: add Sidekick cart and checkout shell"
```

### Task 13: Add SEO, analytics consent, error states, and deployment packaging

**Files:**
- Create: `src/components/site/Seo.astro`
- Create: `src/components/site/CookiePreferences.tsx`
- Create: `src/pages/404.astro`
- Create: `src/pages/500.astro`
- Create: `src/pages/robots.txt.ts`
- Create: `src/pages/sitemap-index.xml.ts`
- Create: `src/middleware.ts`
- Create: `Dockerfile`
- Create: `.dockerignore`
- Create: `docker-compose.yml`
- Create: `.env.example`
- Create: `tests/seo/metadata.test.ts`

**Interfaces:**
- Produces: canonical, OpenGraph, robots, JSON-LD, consent-gated analytics event interface, secure headers, health endpoint, and Node container.

- [ ] **Step 1: Write metadata and security tests**

Assert unique titles/descriptions, canonical host, structured data validity, no indexing of checkout/API/error routes, CSP/referrer/permissions headers, consent before non-essential analytics, and no secret environment values shipped to the browser.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- tests/seo/metadata.test.ts`
Expected: FAIL because SEO and middleware are missing.

- [ ] **Step 3: Implement deployment surfaces**

Add generated sitemap coverage for all public routes, secure middleware, consent preferences, branded error pages, `/api/health`, multi-stage Node 22 Docker build, non-root runtime user, and documented environment contract.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/seo/metadata.test.ts && npm run check && docker build -t sidekickhq-web:test .`
Expected: PASS and a healthy container image.

```bash
git add src/components/site/Seo.astro src/components/site/CookiePreferences.tsx src/pages/404.astro src/pages/500.astro src/pages/robots.txt.ts src/pages/sitemap-index.xml.ts src/pages/api/health.ts src/middleware.ts Dockerfile .dockerignore docker-compose.yml .env.example tests/seo/metadata.test.ts
git commit -m "feat: prepare Sidekick storefront for deployment"
```

### Task 14: Verify complete browser journeys and visual quality

**Files:**
- Create: `tests/e2e/navigation.spec.ts`
- Create: `tests/e2e/products-industries.spec.ts`
- Create: `tests/e2e/pricing-cart.spec.ts`
- Create: `tests/e2e/checkout.spec.ts`
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `tests/e2e/visual.spec.ts`
- Create: `scripts/check-route-inventory.ts`
- Create: `docs/verification/sidekick-storefront.md`

**Interfaces:**
- Consumes: complete application.
- Produces: route inventory, accessibility report, responsive screenshots, performance evidence, and checkout-gate evidence.

- [ ] **Step 1: Write end-to-end tests**

Cover desktop/mobile navigation, keyboard mega menu, all product routes, all forty industry routes, Help Center filtering, CA/US switching, monthly/annual pricing, cart persistence, cart revalidation, software trial, Voice phone configuration, Payments terminal configuration, Protect workload configuration, mixed-cart billing requirement, disabled production submission, and account login handoff.

- [ ] **Step 2: Run the suite and capture failures**

Run: `npm run dev -- --host 127.0.0.1` in one terminal, then `npm run test:e2e`.
Expected: initial failures identify missing integration or layout defects.

- [ ] **Step 3: Fix every observed defect**

Make narrowly scoped fixes with a regression assertion for each issue. Inspect real screenshots at 390×844, 768×1024, 1440×1000, and 1920×1080. Reject clipped type, generic repeated page rhythm, malformed generated hardware, low contrast, horizontal overflow, and inaccessible interactions.

- [ ] **Step 4: Run final verification**

Run: `npm run verify && npm run test:e2e && npx tsx scripts/check-route-inventory.ts`
Expected: all checks pass; route inventory reports twelve product roots, all edition routes, forty industries, Resources, Help Center landing, legal pages, Pricing, Cart, and Checkout.

- [ ] **Step 5: Commit**

```bash
git add tests/e2e scripts/check-route-inventory.ts docs/verification/sidekick-storefront.md
git commit -m "test: verify complete Sidekick storefront"
```

## Self-review

- Spec coverage: tasks cover brand, tokens, product constellation, twelve mini-sites, approved edition families, forty industry pages, Resources, Help Center landing only, legal, country/currency, published catalogue pricing, cart, product-aware checkout shell, imagery, SEO, accessibility, security, Docker, and launch gating.
- Deliberate boundary: authoritative catalogue, tenant creation, order submission, payment, and activation live in the companion HeroNet control-plane plan; this website remains reviewable with a development-only fixture and cannot silently enable production checkout.
- Placeholder scan: every implementation step names concrete files, interfaces, commands, and expected outcomes; no deferred fill-in steps remain.
- Type consistency: product, edition, industry, catalogue, country, cart, and checkout interfaces have one named owner and downstream consumers.
