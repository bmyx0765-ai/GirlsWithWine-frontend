export async function GET() {
  const response = await fetch(
    "https://girlswithwinebackend.vercel.app/page-sitemap.xml",
    {
      cache: "no-store",
    }
  );

  const xml = await response.text();

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}