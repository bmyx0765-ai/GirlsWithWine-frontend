export async function GET(req, { params }) {
  try {
    const path = params.path.join("/");

    const wpImageUrl =
      `https://blog.girlswithwine.com/wp-content/uploads/${path}`;

    const response = await fetch(wpImageUrl);

    if (!response.ok) {
      return new Response("Image not found", { status: 404 });
    }

    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "image/webp",
      },
    });
  } catch (error) {
    return new Response("Server Error", { status: 500 });
  }
} 