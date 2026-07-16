import { PRODUCTS } from "./products";
import type { NavigationItem } from "./types";

export const GLOBAL_NAVIGATION: readonly NavigationItem[] = [
  {
    label: "Products",
    href: "/products",
    children: PRODUCTS.map((product) => ({
      label: product.name,
      href: `/products/${product.slug}`,
      description: product.tagline,
    })),
  },
  {
    label: "Industries",
    href: "/industries",
    description: "See how Sidekick fits the way your business actually works.",
  },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Customer Help Center", href: "/help", description: "Browse future help paths by product and task." },
      { label: "Platform", href: "/platform", description: "Understand how Sidekick products work together." },
      { label: "Company", href: "/company", description: "Meet Sidekick HQ Inc." },
      { label: "Contact", href: "/contact", description: "Talk with the Sidekick team." },
    ],
  },
  { label: "Pricing", href: "/pricing" },
] as const;

export const ACCOUNT_NAVIGATION: readonly NavigationItem[] = [
  { label: "Login", href: "/login" },
  { label: "Start Trial", href: "/checkout" },
] as const;
