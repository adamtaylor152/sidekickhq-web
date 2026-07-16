import type { EditionDefinition, ProductSlug } from "./types";

const tier = (
  productSlug: ProductSlug,
  slug: EditionDefinition["slug"],
  input: Omit<EditionDefinition, "productSlug" | "slug" | "name">,
): EditionDefinition => ({
  productSlug,
  slug,
  name: `${productSlug === "msp" ? "MSP" : productSlug[0].toUpperCase() + productSlug.slice(1)} ${slug[0].toUpperCase() + slug.slice(1)}`,
  ...input,
});

export const EDITIONS: readonly EditionDefinition[] = [
  tier("crm", "essentials", {
    offerKey: "crm.essentials",
    billingUnit: "user",
    summary: "The customer record, pipeline, tasks, and finance foundation a growing team needs.",
    bestFor: "Small teams replacing spreadsheets or a disconnected entry CRM.",
    includes: ["Companies, contacts, and sites", "Activities, tasks, and opportunities", "Core pipeline and imports", "Finance Core", "Standard reporting"],
    limits: ["One core pipeline", "Standard automation and AI limits"],
    trialEligible: true,
  }),
  tier("crm", "professional", {
    offerKey: "crm.professional",
    billingUnit: "user",
    summary: "A complete selling system with automation, forecasting, proposals, and enhanced AI.",
    bestFor: "Teams with a repeatable sales motion and multiple routes to revenue.",
    includes: ["Everything in Essentials", "Multiple pipelines", "Email and calendar synchronization", "Cadences and sales automation", "Enrichment, proposals, and forecasting", "Advanced reporting and enhanced AI"],
    limits: ["Professional API and automation limits"],
    trialEligible: true,
  }),
  tier("crm", "enterprise", {
    offerKey: "crm.enterprise",
    billingUnit: "user",
    summary: "Governed CRM for complex organizations, integrations, and higher-volume operations.",
    bestFor: "Multi-team organizations with audit, policy, integration, and reporting requirements.",
    includes: ["Everything in Professional", "APIs and webhooks", "Advanced permissions and governance", "Audit controls", "Enterprise reporting and higher limits", "Enterprise AI"],
    limits: ["Contracted enterprise limits"],
    trialEligible: true,
  }),
  tier("msp", "essentials", {
    offerKey: "msp.essentials",
    billingUnit: "technician",
    summary: "PSA, projects, customer records, and service operations for a focused MSP.",
    bestFor: "Small providers standardizing tickets, projects, time, and client work.",
    includes: ["PSA and ticket operations", "Projects and time", "Sidekick CRM and Finance Core", "Core service reporting", "Standard Sidekick AI"],
    limits: ["Edition-defined managed endpoint limit", "Core automation"],
    trialEligible: true,
  }),
  tier("msp", "professional", {
    offerKey: "msp.professional",
    billingUnit: "technician",
    summary: "Unified PSA and RMM with automation, client portal, and stronger operational intelligence.",
    bestFor: "Established MSPs managing recurring service across many customers and endpoints.",
    includes: ["Everything in Essentials", "RMM, alerts, and assets", "Client portal", "Service automation", "Internal operations", "Enhanced finance and AI"],
    limits: ["Professional endpoint and automation limits"],
    trialEligible: true,
  }),
  tier("msp", "enterprise", {
    offerKey: "msp.enterprise",
    billingUnit: "technician",
    summary: "Enterprise-grade service delivery, governance, integrations, and unlimited RMM.",
    bestFor: "Large or multi-entity providers with custom controls and integration requirements.",
    includes: ["Everything in Professional", "Advanced proposals and bookings", "API and webhooks", "Governance and audit", "Unlimited RMM", "Enterprise finance and AI"],
    limits: ["Contracted service limits"],
    trialEligible: true,
  }),
  tier("rentals", "essentials", {
    offerKey: "rentals.essentials",
    billingUnit: "organization",
    summary: "Core rental availability, reservations, commerce, projects, and customer operations.",
    bestFor: "Independent rental businesses moving beyond paper and disconnected calendars.",
    includes: ["Rental catalogue and availability", "Quotes and reservations", "Commerce and POS", "Projects, proposals, and bookings", "HR, CRM, and Sidekick AI"],
    limits: ["Single-location operating model", "Core warehouse workflows"],
    trialEligible: true,
  }),
  tier("rentals", "professional", {
    offerKey: "rentals.professional",
    billingUnit: "organization",
    summary: "Multi-location rental operations with portal, warehouse, dispatch, and enhanced intelligence.",
    bestFor: "Growing fleets coordinating inventory, delivery, inspections, and customer self-service.",
    includes: ["Everything in Essentials", "Customer portal", "Warehouse and dispatch", "Multi-location operations", "Enhanced finance", "Enhanced AI"],
    limits: ["Professional telemetry and integration limits"],
    trialEligible: true,
  }),
  tier("rentals", "enterprise", {
    offerKey: "rentals.enterprise",
    billingUnit: "organization",
    summary: "Governed fleet and rental operations with telemetry, APIs, and enterprise controls.",
    bestFor: "Regional and national operators with complex fleets, entities, and integrations.",
    includes: ["Everything in Professional", "Enterprise rental operations", "Telemetry", "API and webhooks", "Governance", "Enterprise finance and AI"],
    limits: ["Contracted fleet and integration limits"],
    trialEligible: true,
  }),
  ...(["commerce", "appointments", "sites"] as const).flatMap((productSlug) => [
    tier(productSlug, "essentials", {
      offerKey: `${productSlug}.essentials`, billingUnit: productSlug === "appointments" ? "location" : productSlug === "sites" ? "published site" : "organization",
      summary: `The focused ${productSlug} foundation for a small business.`, bestFor: "Teams launching a professional operation with clear room to grow.",
      includes: ["Core workflows", "Standard reporting", "Sidekick CRM connection", "Standard Sidekick AI"], limits: ["Essentials usage and collaboration limits"], trialEligible: true,
    }),
    tier(productSlug, "professional", {
      offerKey: `${productSlug}.professional`, billingUnit: productSlug === "appointments" ? "location" : productSlug === "sites" ? "published site" : "organization",
      summary: `Advanced ${productSlug} workflows, automation, and multi-team operations.`, bestFor: "Growing businesses that need automation and deeper operational control.",
      includes: ["Everything in Essentials", "Advanced workflows", "Automation", "Enhanced reporting", "Enhanced Sidekick AI"], limits: ["Professional usage and collaboration limits"], trialEligible: true,
    }),
    tier(productSlug, "enterprise", {
      offerKey: `${productSlug}.enterprise`, billingUnit: productSlug === "appointments" ? "location" : productSlug === "sites" ? "published site" : "organization",
      summary: `Governed ${productSlug} for complex, multi-location, and integrated businesses.`, bestFor: "Organizations with enterprise control, scale, and integration requirements.",
      includes: ["Everything in Professional", "Advanced governance", "API and webhooks", "Higher limits", "Enterprise Sidekick AI"], limits: ["Contracted enterprise limits"], trialEligible: true,
    }),
  ]),
] as const;

export const getProductEditions = (productSlug: ProductSlug) =>
  EDITIONS.filter((edition) => edition.productSlug === productSlug);
