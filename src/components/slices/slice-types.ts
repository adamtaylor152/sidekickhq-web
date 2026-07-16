import type { IndustryDefinition, ProductDefinition, SliceDefinition } from "@/content/types";

export interface SliceProps {
  slice: SliceDefinition;
  product?: ProductDefinition;
  industry?: IndustryDefinition;
}
