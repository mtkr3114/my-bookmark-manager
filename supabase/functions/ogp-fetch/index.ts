// supabase/functions/ogp-fetch/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req: Request) => {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "Invalid URL" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!/^https?:\/\//.test(url)) {
      return new Response(JSON.stringify({ error: "Only http/https supported" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const res = await fetch(url);
    if (!res.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch: ${res.status}` }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const getMeta = (prop: string) =>
      doc?.querySelector(`meta[property="${prop}"]`)?.getAttribute("content") ??
      doc?.querySelector(`meta[name="${prop}"]`)?.getAttribute("content");

    const result = {
      title: getMeta("og:title") || doc?.querySelector("title")?.textContent || "",
      description: getMeta("og:description") || getMeta("description") || "",
      og_image_url: getMeta("og:image") || "",
    };

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // ✅ CORS対応
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
