import { PRODUCTS } from "./products";
import type { HelpCategory, ProductSlug, ResourceCategory } from "./types";

export const RESOURCE_CATEGORIES: readonly ResourceCategory[] = [
  {
    slug: "customer-growth",
    name: "Customer and growth",
    description: "CRM, selling, proposals, and customer relationships.",
    children: [
      { slug: "crm", name: "Sidekick CRM", taskAreas: ["Get started", "Customer records", "Pipelines", "Automation", "Reports"] },
      { slug: "ai", name: "Sidekick AI", taskAreas: ["Embedded AI", "AI Agents", "Credits", "Governance"] },
    ],
  },
  {
    slug: "communications",
    name: "Communications",
    description: "Calling, numbers, phones, queues, and voice intelligence.",
    children: [
      { slug: "voice", name: "Sidekick Voice", taskAreas: ["Activation", "Numbers and porting", "Desk phones", "Call flows", "Voicemail", "Voice AI"] },
      { slug: "desktop", name: "Sidekick Desktop", taskAreas: ["Install", "Calling", "Notifications", "Updates"] },
    ],
  },
  {
    slug: "money-commerce",
    name: "Money and commerce",
    description: "Payments, finance, orders, storefronts, and terminals.",
    children: [
      { slug: "payments", name: "Sidekick Payments", taskAreas: ["Merchant setup", "Terminals", "Processing", "Payouts", "Refunds"] },
      { slug: "erp", name: "Sidekick ERP", taskAreas: ["Finance", "Purchasing", "Inventory", "Projects", "Reporting"] },
      { slug: "commerce", name: "Sidekick Commerce", taskAreas: ["Products", "Orders", "POS", "Shipping", "Returns"] },
    ],
  },
  {
    slug: "operations",
    name: "Operations",
    description: "Service delivery, rentals, appointments, and protection.",
    children: [
      { slug: "msp", name: "Sidekick MSP", taskAreas: ["PSA", "RMM", "Tickets", "Projects", "Client portal"] },
      { slug: "rentals", name: "Sidekick Rentals", taskAreas: ["Availability", "Reservations", "Dispatch", "Inspections", "Returns"] },
      { slug: "appointments", name: "Sidekick Appointments", taskAreas: ["Services", "Staff calendars", "Online booking", "Reminders", "Deposits"] },
      { slug: "protect", name: "Sidekick Protect", taskAreas: ["Coverage", "Policies", "Backup", "Restore", "Alerts"] },
      { slug: "sites", name: "Sidekick Sites", taskAreas: ["Create", "Publish", "Domains", "Forms", "SEO"] },
    ],
  },
] as const;

export const HELP_CATEGORIES: readonly HelpCategory[] = RESOURCE_CATEGORIES.map((category) => ({
  slug: category.slug,
  name: category.name,
  description: category.description,
  products: category.children.map((child) => {
    const product = PRODUCTS.find(({ slug }) => slug === child.slug);
    if (!product) throw new Error(`Help Center product ${child.slug} is not registered.`);
    return {
      slug: child.slug as ProductSlug,
      name: child.name,
      description: product.tagline,
      sections: [
        {
          name: "Start and configure",
          topics: [`Start with ${child.name}`, "Workspace, roles, and access", "Import, connect, or migrate existing data"],
        },
        ...product.featureGroups.map((group) => ({ name: group.title, topics: group.features })),
      ],
    };
  }),
}));
