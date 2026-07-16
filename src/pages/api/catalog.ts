import type { APIRoute } from "astro";
import { PHONE_HARDWARE, PRICE_OFFERS, TERMINAL_HARDWARE } from "@/content/pricing";

export const prerender = true;

export const GET: APIRoute = () => new Response(JSON.stringify({version:"2026-07-16",countries:["CA","US"],offers:PRICE_OFFERS,hardware:{phones:PHONE_HARDWARE,terminals:TERMINAL_HARDWARE}}),{headers:{"content-type":"application/json; charset=utf-8","cache-control":"public, max-age=300"}});
