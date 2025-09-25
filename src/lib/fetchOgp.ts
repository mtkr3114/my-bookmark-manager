export async function fetchOgp(targetUrl: string) {
  const res = await fetch("/api/ogp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: targetUrl }),
  });

  if (!res.ok) {
    throw new Error(`OGP fetch failed: ${res.status}`);
  }

  return res.json() as Promise<{
    title: string;
    description: string;
    image: string;
  }>;
}
