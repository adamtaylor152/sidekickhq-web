import type { APIRoute } from "astro";
import { PRODUCTS } from "@/content/products";
import { INDUSTRIES } from "@/content/industries";
import { LEGAL_LINKS } from "@/content/legal";
export const prerender=true;
const base="https://sidekickhq.ca";
export const GET:APIRoute=()=>{const paths=["/","/platform","/products","/industries","/pricing","/resources","/help","/company","/contact",...PRODUCTS.map(({slug})=>`/products/${slug}`),...INDUSTRIES.map(({slug})=>`/industries/${slug}`),...LEGAL_LINKS.map(({href})=>href)];const body=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path)=>`<url><loc>${base}${path}</loc></url>`).join("")}</urlset>`;return new Response(body,{headers:{"content-type":"application/xml"}})};
