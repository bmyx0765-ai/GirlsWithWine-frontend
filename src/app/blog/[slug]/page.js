import BlogDetails from "./BlogDetails";

// ✅ HTML CLEAN FUNCTION
const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
};

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const res = await fetch(
      `http://localhost:5000/api/blogs/${slug}`,
      { cache: "no-store" }
    );

    const data = await res.json();
    const blog = data?.data;

    // ✅ PRIORITY SEO FIELDS
    const title =
      blog?.seoTitle || `${blog?.title} | Girls With Wine`;

    const description =
      blog?.seoDescription ||
      stripHtml(blog?.description).slice(0, 160);

    const keywords =
      blog?.seoKeywords?.length > 0
        ? blog.seoKeywords
        : [
            blog?.title,
            "girls with wine blog",
            "business growth",
          ];

    const canonical =
      blog?.canonicalUrl ||
      `https://girlswithwine.com/blog/${slug}`;

    return {
      title,
      description,
      keywords,

      // ✅ CANONICAL FIX
      alternates: {
        canonical,
      },

      openGraph: {
        title,
        description,
        url: canonical,
        siteName: "Girls With Wine",
        images: [
          {
            url: blog?.imageUrl,
            width: 1200,
            height: 630,
          },
        ],
        type: "article",
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [blog?.imageUrl],
      },
    };
  } catch (error) {
    return {
      title: "Blog",
      description: "Read latest blog updates",
    };
  }
}

// ✅ PAGE
export default async function Page({ params }) {
  const { slug } = await params;

  return <BlogDetails slug={slug} />;
}