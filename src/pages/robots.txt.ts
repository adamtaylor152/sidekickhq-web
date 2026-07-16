import type { APIRoute } from "astro";
export const prerender=true;
export const GET:APIRoute=()=>new Response("User-agent: *\nAllow: /\nSitemap: https://sidekickhq.ca/sitemap.xml\n",{headers:{"content-type":"text/plain"}});
