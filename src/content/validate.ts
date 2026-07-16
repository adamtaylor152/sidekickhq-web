import { EDITIONS } from "./editions";
import { INDUSTRIES } from "./industries";
import { LEGAL_LINKS } from "./legal";
import { PRODUCTS } from "./products";
import { RESOURCE_CATEGORIES } from "./resources";
import type { ProductSlug } from "./types";

const assert: (condition: unknown, message: string) => asserts condition = (
  condition,
  message,
) => {
  if (!condition) throw new Error(`Content registry: ${message}`);
};

const assertUnique = (values: readonly string[], label: string) => {
  assert(new Set(values).size === values.length, `${label} must be unique`);
};

export const assertContentRegistry = () => {
  assert(PRODUCTS.length === 12, "exactly twelve products are required");
  assert(INDUSTRIES.length === 40, "exactly forty industries are required");
  assertUnique(PRODUCTS.map((product) => product.slug), "product slugs");
  assertUnique(PRODUCTS.map((product) => product.hero.title), "product hero titles");
  assertUnique(INDUSTRIES.map((industry) => industry.slug), "industry slugs");
  assertUnique(INDUSTRIES.map((industry) => industry.hero.title), "industry hero titles");
  assertUnique(EDITIONS.map((edition) => edition.offerKey), "edition offer keys");
  assertUnique(LEGAL_LINKS.map((link) => link.href), "legal routes");
  assertUnique(RESOURCE_CATEGORIES.map((category) => category.slug), "resource category slugs");

  const productSlugs = new Set<ProductSlug>(PRODUCTS.map((product) => product.slug));
  const industrySlugs = new Set(INDUSTRIES.map((industry) => industry.slug));

  for (const product of PRODUCTS) {
    assert(product.outcomes.length >= 3, `${product.slug} needs at least three outcomes`);
    assert(product.featureGroups.length >= 2, `${product.slug} needs grouped feature depth`);
    assert(product.workflows.length >= 2, `${product.slug} needs at least two workflows`);
    assert(product.faqs.length >= 2, `${product.slug} needs at least two FAQs`);
    assert(product.media.alt.trim().length > 0, `${product.slug} needs media alt text`);
    assert(product.slices[0]?.kind === "hero", `${product.slug} must begin with a hero slice`);
    assert(product.slices.at(-1)?.kind === "conversion", `${product.slug} must end with a conversion slice`);
    for (const industrySlug of product.relevantIndustries) {
      assert(industrySlugs.has(industrySlug), `${product.slug} references unknown industry ${industrySlug}`);
    }
  }

  for (const industry of INDUSTRIES) {
    assert(industry.workflows.length >= 3, `${industry.slug} needs three workflows`);
    assert(industry.productSlugs.length >= 2, `${industry.slug} needs at least two relevant products`);
    assert(industry.aiActions.length >= 3, `${industry.slug} needs three AI actions`);
    assert(industry.roleExamples.length >= 3, `${industry.slug} needs three role examples`);
    assert(industry.media.alt.trim().length > 0, `${industry.slug} needs media alt text`);
    for (const productSlug of industry.productSlugs) {
      assert(productSlugs.has(productSlug), `${industry.slug} references unknown product ${productSlug}`);
    }
  }

  for (const edition of EDITIONS) {
    assert(productSlugs.has(edition.productSlug), `${edition.offerKey} references unknown product`);
    assert(edition.includes.length >= 4, `${edition.offerKey} needs meaningful inclusion detail`);
  }

  for (const slug of ["voice", "payments", "protect"] satisfies ProductSlug[]) {
    assert(PRODUCTS.find((product) => product.slug === slug)?.cta.trialEligible === false, `${slug} cannot offer a trial`);
  }

  return true;
};

assertContentRegistry();
