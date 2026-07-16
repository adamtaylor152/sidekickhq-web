import { INDUSTRIES } from "./industries";
import { PRODUCTS } from "./products";

export type MediaSourceType = "generated" | "licensed" | "manufacturer";

export interface MediaAssetRecord {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
  readonly sourceType: MediaSourceType;
  readonly approval: "approved";
  readonly focalPoint: "left" | "centre" | "right";
}

const licensedIndustrySources = new Set([
  "construction",
  "equipment-rental",
  "oil-and-gas",
  "retail",
  "restaurants-and-food-service",
  "education-and-training",
  "law-firms",
  "accountants-and-bookkeepers",
  "financial-services",
  "insurance",
  "professional-services",
  "engineering-firms",
  "architecture-and-design",
  "staffing-and-recruiting",
  "non-profits",
  "multi-entity-operators",
]);

export const MEDIA: readonly MediaAssetRecord[] = [
  ...PRODUCTS.map((product): MediaAssetRecord => ({
    src: product.media.src,
    width: 1440,
    height: 960,
    alt: product.media.alt,
    sourceType: product.media.kind === "hardware" ? "manufacturer" : "generated",
    approval: "approved",
    focalPoint: "centre",
  })),
  ...INDUSTRIES.map((industry): MediaAssetRecord => ({
    src: industry.media.src,
    width: 1440,
    height: 960,
    alt: industry.media.alt,
    sourceType: licensedIndustrySources.has(industry.slug) ? "licensed" : "generated",
    approval: "approved",
    focalPoint: "centre",
  })),
] as const;

export const getMediaAsset = (src: string) =>
  MEDIA.find((asset) => asset.src === src);
