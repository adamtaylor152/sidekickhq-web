import type { LegalLink } from "./types";

export const LEGAL_LINKS: readonly LegalLink[] = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Acceptable Use", href: "/legal/acceptable-use" },
  { label: "Accessibility", href: "/legal/accessibility" },
  { label: "Refunds", href: "/legal/refunds" },
] as const;
