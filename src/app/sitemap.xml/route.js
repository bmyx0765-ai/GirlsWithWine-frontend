export async function GET() {
  try {
    const response = await fetch(
      "https://girlswithwinebackend.vercel.app/sitemap.xml",
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
  } catch (error) {
    return new Response("Sitemap Error", {
      status: 500,
    });
  }
}