export type ProductSlug =
  | "crm"
  | "voice"
  | "payments"
  | "msp"
  | "rentals"
  | "erp"
  | "protect"
  | "commerce"
  | "appointments"
  | "sites"
  | "desktop"
  | "ai";

export type EditionSlug = "essentials" | "professional" | "enterprise";

export type IndustryFamily =
  | "Service and Care"
  | "Trades, Field and Fleet"
  | "Storefront and Multi-Location"
  | "Professional and Regulated"
  | "Technology Operators";

export interface SeoDefinition {
  readonly title: string;
  readonly description: string;
}

export interface CtaDefinition {
  readonly label: string;
  readonly href: string;
  readonly trialEligible: boolean;
}

export interface MediaDefinition {
  readonly kind: "product-ui" | "hardware" | "photography" | "illustration";
  readonly src: string;
  readonly alt: string;
  readonly direction: string;
}

export interface FeatureGroup {
  readonly title: string;
  readonly description: string;
  readonly features: readonly string[];
}

export interface WorkflowDefinition {
  readonly title: string;
  readonly description: string;
  readonly steps: readonly string[];
}

export interface FaqDefinition {
  readonly question: string;
  readonly answer: string;
}

export interface MiniNavItem {
  readonly label: string;
  readonly href: string;
}

export type SliceKind =
  | "hero"
  | "constellation"
  | "workflow"
  | "feature-ledger"
  | "editorial-split"
  | "media-stage"
  | "industry-pathways"
  | "ai-layer"
  | "hardware-stage"
  | "edition-comparison"
  | "faq"
  | "conversion";

export interface SliceDefinition {
  readonly kind: SliceKind;
  readonly theme: "navy" | "paper" | "blue" | "white";
  readonly id: string;
}

export interface ProductDefinition {
  readonly slug: ProductSlug;
  readonly name: string;
  readonly category: string;
  readonly tagline: string;
  readonly hero: {
    readonly eyebrow: string;
    readonly title: string;
    readonly body: string;
  };
  readonly seo: SeoDefinition;
  readonly outcomes: readonly string[];
  readonly featureGroups: readonly FeatureGroup[];
  readonly workflows: readonly WorkflowDefinition[];
  readonly relevantIndustries: readonly string[];
  readonly faqs: readonly FaqDefinition[];
  readonly miniNav: readonly MiniNavItem[];
  readonly pricingOfferKeys: readonly string[];
  readonly cta: CtaDefinition;
  readonly media: MediaDefinition;
  readonly slices: readonly SliceDefinition[];
}

export interface EditionDefinition {
  readonly productSlug: ProductSlug;
  readonly slug: EditionSlug;
  readonly name: string;
  readonly offerKey: string;
  readonly billingUnit: string;
  readonly summary: string;
  readonly bestFor: string;
  readonly includes: readonly string[];
  readonly limits: readonly string[];
  readonly trialEligible: boolean;
}

export interface IndustryDefinition {
  readonly slug: string;
  readonly name: string;
  readonly family: IndustryFamily;
  readonly hero: {
    readonly eyebrow: string;
    readonly title: string;
    readonly body: string;
  };
  readonly seo: SeoDefinition;
  readonly pains: readonly string[];
  readonly productSlugs: readonly ProductSlug[];
  readonly workflows: readonly WorkflowDefinition[];
  readonly aiActions: readonly string[];
  readonly roleExamples: readonly string[];
  readonly caveat?: string;
  readonly media: MediaDefinition;
  readonly cta: CtaDefinition;
}

export interface NavigationItem {
  readonly label: string;
  readonly href: string;
  readonly description?: string;
  readonly children?: readonly NavigationItem[];
}

export interface ResourceCategory {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly children: readonly {
    readonly slug: string;
    readonly name: string;
    readonly taskAreas: readonly string[];
  }[];
}

export interface LegalLink {
  readonly label: string;
  readonly href: string;
}
