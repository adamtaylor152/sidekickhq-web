import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

type Position = "left" | "centre" | "right";
type IndustryAsset = readonly [slug: string, source: string, position: Position, brightness: number, saturation: number];

const assets: readonly IndustryAsset[] = [
  ["beauty-salons-and-spas", "salon", "centre", 1, 1],
  ["fitness-and-wellness", "fitness", "centre", 1, 1],
  ["medical-clinics", "clinic", "centre", 1, 0.96],
  ["dental-clinics", "clinic", "right", 1.03, 0.9],
  ["veterinary-and-pet-services", "veterinary", "centre", 1, 1],
  ["senior-care-and-home-care", "care", "centre", 1, 0.92],
  ["childcare-and-daycares", "care", "right", 1.05, 1.04],
  ["life-sciences-and-private-health", "clinic", "left", 0.97, 0.82],
  ["home-services", "home-service", "centre", 1, 1],
  ["construction", "construction", "centre", 1, 0.96],
  ["commercial-cleaning", "property", "right", 1.04, 0.88],
  ["logistics-and-transportation", "warehouse", "left", 0.98, 0.92],
  ["automotive", "automotive", "centre", 1, 1],
  ["dealerships-and-equipment-sales", "automotive", "right", 1.03, 0.9],
  ["equipment-rental", "construction", "right", 0.96, 1.08],
  ["manufacturing", "warehouse", "centre", 1, 0.86],
  ["oil-and-gas", "construction", "left", 0.9, 0.78],
  ["agribusiness", "agribusiness", "centre", 1, 1],
  ["retail", "retail", "centre", 1, 0.96],
  ["restaurants-and-food-service", "retail", "right", 1.04, 1.06],
  ["hospitality", "hospitality", "centre", 1, 0.96],
  ["franchises-and-multi-location", "hospitality", "left", 1.02, 0.86],
  ["wholesale-distribution", "warehouse", "right", 1.02, 0.96],
  ["property-management", "property", "centre", 1, 1],
  ["real-estate", "property", "left", 1.06, 0.86],
  ["education-and-training", "professional", "centre", 1.04, 0.9],
  ["law-firms", "professional", "right", 0.98, 0.78],
  ["accountants-and-bookkeepers", "professional", "centre", 1.04, 0.84],
  ["financial-services", "professional", "left", 0.95, 0.7],
  ["insurance", "professional", "right", 1.02, 0.92],
  ["professional-services", "professional", "centre", 1, 1],
  ["engineering-firms", "professional", "left", 0.96, 0.8],
  ["architecture-and-design", "professional", "right", 1.05, 0.72],
  ["staffing-and-recruiting", "professional", "centre", 1.06, 1.02],
  ["non-profits", "professional", "left", 1.03, 0.94],
  ["managed-service-providers", "technology", "centre", 1, 1],
  ["technology-and-saas", "technology", "left", 0.96, 1.04],
  ["it-service-providers", "technology", "right", 1.03, 0.92],
  ["multi-entity-operators", "professional", "right", 0.94, 0.72],
  ["internal-service-desks", "technology", "centre", 1.05, 0.86],
] as const;

const sourceRoot = resolve(process.cwd(), "assets/photography");
const outputRoot = resolve(process.cwd(), "public/images/industries");
await mkdir(outputRoot, { recursive: true });

for (const [slug, source, position, brightness, saturation] of assets) {
  await sharp(resolve(sourceRoot, `${source}.webp`))
    .resize(1440, 960, { fit: "cover", position })
    .modulate({ brightness, saturation })
    .webp({ quality: 86, smartSubsample: true })
    .toFile(resolve(outputRoot, `${slug}.webp`));
}
