import type { APIRoute } from "astro";
import { EDITIONS } from "@/content/editions";
import { PRODUCTS } from "@/content/products";
import { INDUSTRIES } from "@/content/industries";
import { LEGAL_LINKS } from "@/content/legal";
export const prerender=true;
const base="https://sidekickhq.ca";
const featureSlug=(title:string)=>title.toLowerCase().replaceAll(/[^a-z0-9]+/g,"-").replaceAll(/(^-|-$)/g,"");
export const GET:APIRoute=()=>{const editionProducts=new Set(EDITIONS.map(({productSlug})=>productSlug));const paths=["/","/platform","/products","/industries","/pricing","/resources","/help","/company","/contact","/products/voice/phones","/products/payments/terminals",...PRODUCTS.map(({slug})=>`/products/${slug}`),...PRODUCTS.flatMap((product)=>product.featureGroups.map(({title})=>`/products/${product.slug}/features/${featureSlug(title)}`)),...PRODUCTS.filter(({slug})=>editionProducts.has(slug)).map(({slug})=>`/products/${slug}/editions`),...EDITIONS.map(({productSlug,slug})=>`/products/${productSlug}/editions/${slug}`),...INDUSTRIES.map(({slug})=>`/industries/${slug}`),...LEGAL_LINKS.map(({href})=>href)];const body=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path)=>`<url><loc>${base}${path}</loc></url>`).join("")}</urlset>`;return new Response(body,{headers:{"content-type":"application/xml"}})};
