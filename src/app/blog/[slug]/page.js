import BlogDetails from "./BlogDetails";


// ✅ REMOVE HTML TAGS
const stripHtml = (html) => {

  if (!html) return "";

  return html.replace(/<[^>]+>/g, "");

};


// ✅ SEO META
export async function generateMetadata({ params }) {

  // ✅ NEXT 15
  const { slug } = await params;

  try {

    // ✅ WORDPRESS API
    const res = await fetch(
      `https://blog.girlswithwine.com/wp-json/wp/v2/posts?slug=${slug}&_embed`,
      {
        cache: "no-store",
      }
    );

    // ✅ JSON
    const data = await res.json();

    // ✅ WORDPRESS RETURNS ARRAY
    const blog = data?.[0];

    // ✅ BLOG NOT FOUND
    if (!blog) {

      return {
        title: "Blog Not Found",
        description: "Blog not found",
      };

    }

    // ✅ SEO OBJECT
    const seo = blog?.seo || {};

    // ✅ TITLE
    const title =
      seo?.seoTitle ||
      blog?.title?.rendered ||
      "Girls With Wine Blog";

    // ✅ DESCRIPTION
    const description =
      seo?.seoDescription ||
      stripHtml(
        blog?.excerpt?.rendered || ""
      ).slice(0, 160);

    // ✅ KEYWORDS
    const keywords =
      seo?.seoKeywords ||
      [
        blog?.title?.rendered,
        "girls with wine blog",
        "escort blog",
      ];

    // ✅ IMAGE
    const image =
      blog?._embedded?.["wp:featuredmedia"]?.[0]
        ?.source_url ||
      "https://girlswithwine.com/images/blog-banner.jpg";

    // ✅ CANONICAL
    const canonical =
      `https://girlswithwine.com/blog/${slug}`;

    return {

      title,

      description,

      keywords,

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
            url: image,
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

        images: [image],

      },

    };

  } catch (error) {

    console.log("SEO ERROR:", error);

    return {

      title: "Girls With Wine Blog",

      description:
        "Read latest blog updates from Girls With Wine.",

    };

  }

}


// ✅ PAGE
export default async function Page({ params }) {

  // ✅ NEXT 15
  const { slug } = await params;

  return <BlogDetails slug={slug} />;

}