/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_CHECKOUT_ENABLED?: "true" | "false";
  readonly HERONET_STOREFRONT_API_URL?: string;
  readonly HERONET_STOREFRONT_API_KEY?: string;
  readonly SIDEKICK_USE_CATALOG_FIXTURE?: "true" | "false";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
