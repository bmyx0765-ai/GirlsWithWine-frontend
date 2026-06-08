
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import root from "react-shadow";

export default function BlogDetails({ slug }) {

  const [blog, setBlog] = useState(null);

  const [loading, setLoading] = useState(true);

  const [seoHeadings, setSeoHeadings] = useState([]);

  // ✅ TOC STATES
  const [tableOfContents, setTableOfContents] = useState([]);
  const [showTOC, setShowTOC] = useState(true);

  // ✅ SHADOW REF
  const shadowRef = useRef(null);

  

 useEffect(() => {
  const fetchBlog = async () => {
    try {
      const res = await fetch(
        `https://blog.girlswithwine.com/wp-json/wp/v2/posts?slug=${slug}&_embed`
      );

      const data = await res.json();

      console.log("BLOG API 👉", data);

      if (data && data.length > 0) {
        const post = data[0];

        let content =
          post?.full_content ||
          post?.content?.rendered ||
          "";

        // Remove strong tags from headings
        content = content.replace(
          /<h([1-6])([^>]*)>\s*<strong>(.*?)<\/strong>\s*<\/h\1>/gi,
          "<h$1$2>$3</h$1>"
        );

        // Convert WP image URLs to local images
        content = content.replace(
          /https:\/\/blog\.girlswithwine\.com\/wp-content\/uploads\//g,
          "/blog-images/"
        );

        content = content.replace(
          /https:\/\/girlswithwine\.com\/wp-content\/uploads\//g,
          "/blog-images/"
        );

        // Debug
        const imgMatch = content.match(
          /<img[^>]+src="([^"]+)"/i
        );

        console.log(
          "CONTENT IMAGE =>",
          imgMatch?.[1]
        );

        // SEO Headings
        const seoHeadingMatches = [
          ...content.matchAll(
            /<h([1-6])[^>]*>(.*?)<\/h\1>/gi
          ),
        ];

        const headings = seoHeadingMatches.map(
          (item) => ({
            level: item[1],
            text: item[2]
              .replace(/<[^>]+>/g, "")
              .trim(),
          })
        );

        setSeoHeadings(headings);

        // TOC Headings
        const headingMatches = [
          ...content.matchAll(
            /<h2[^>]*>(.*?)<\/h2>/gi
          ),
        ];

        const tocHeadings = [];

        headingMatches.forEach(
          (item, index) => {
            const text = item[1]
              .replace(/<[^>]+>/g, "")
              .trim();

            const id = `heading-${index}`;

            tocHeadings.push({
              id,
              text,
            });

            const original = item[0];

            const updated =
              original.replace(
                "<h2",
                `<h2 id="${id}"`
              );

            content = content.replace(
              original,
              updated
            );
          }
        );

        setTableOfContents(
          tocHeadings
        );

        // Featured Image
        const featuredImage =
          (
            post?._embedded?.[
              "wp:featuredmedia"
            ]?.[0]?.source_url ||
            "/images/default.jpg"
          )
            .replace(
              "https://blog.girlswithwine.com/wp-content/uploads/",
              "/blog-images/"
            )
            .replace(
              "https://girlswithwine.com/wp-content/uploads/",
              "/blog-images/"
            );

        console.log(
          "FEATURED IMAGE =>",
          featuredImage
        );

        setBlog({
          title:
            post?.title?.rendered ||
            "",
          fullContent: content,
          imageUrl: featuredImage,
          createdAt:
            post?.date || "",
        });
      }
    } catch (error) {
      console.log(
        "BLOG ERROR 👉",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (slug) {
    fetchBlog();
  }
}, [slug]);

  // ✅ LOADING
  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">

        Loading...

      </div>

    );

  }

  // ✅ BLOG NOT FOUND
  if (!blog) {

    return (

      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">

        Blog Not Found

      </div>

    );

  }

  return (

    <div className="bg-[#FBFCFE] min-h-screen pb-20">

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">

      


        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">

            {/* ================= TOC ================= */}
        {/* Ensure your parent grid in the main component is set to: lg:grid-cols-[360px_1fr] */}
<aside className="lg:sticky lg:top-24 h-fit w-full">
  {/* Reduced padding (p-3) to make it feel less tall */}
  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-3">
    
    <div className="flex items-center justify-between gap-3 mb-2 px-1">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setShowTOC(!showTOC)}
          className="w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-600 hover:text-white flex items-center justify-center text-pink-600 font-bold transition-all text-xs"
        >
          {showTOC ? "−" : "☰"}
        </button>
        <h3 className="text-sm font-bold text-gray-900">Table of Contents</h3>
      </div>
    </div>

    {/* Height reduced to 40vh for a shorter profile */}
    <div className={`transition-all duration-500 ease-in-out ${showTOC ? "max-h-[40vh] opacity-100 overflow-y-auto" : "max-h-0 opacity-0 overflow-hidden"}`}>
      <div className="flex flex-col gap-1 pt-1">
        {tableOfContents.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              const element = shadowRef.current?.shadowRoot?.getElementById(item.id);
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            className="group flex items-center gap-2 p-2 rounded-xl hover:bg-pink-50 text-left w-full"
          >
            <span className="min-w-[20px] h-[20px] rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[9px] font-bold group-hover:bg-pink-600 group-hover:text-white">
              {index + 1}
            </span>
            <span className="text-[12px] font-medium text-gray-600 group-hover:text-pink-700 line-clamp-1 leading-tight">
              {item.text}
            </span>
          </button>
        ))}
      </div>
    </div>
    
  </div>
</aside>


          {/* ================= BLOG ================= */}
          <div>

          

            {/* ✅ SEO HEADINGS */}
            <div className="hidden">

              {seoHeadings.map((heading, index) => {

                const Tag = `h${heading.level}`;

                return (
                  <Tag key={index}>
                    {heading.text}
                  </Tag>
                );

              })}

            </div>

            {/* ✅ BACK */}
            <Link
              href="/blog"
              className="text-pink-600 hover:underline"
            >
              ← Back
            </Link>

            {/* ✅ TITLE */}
            <h1
              className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-4"
              dangerouslySetInnerHTML={{
                __html: blog.title,
              }}
            />

            {/* ✅ DATE */}
            <p className="text-gray-500 mb-12">

              {new Date(blog.createdAt).toDateString()}

            </p>

            {/* ✅ SHADOW DOM */}
            <root.div
              ref={shadowRef}
              className="wordpress-shadow-wrapper"
            >

              {/* ✅ WORDPRESS CSS */}
              <style>
                {`
                  @import url("https://blog.girlswithwine.com/wp-includes/css/dist/block-library/style.min.css");

                  @import url("https://blog.girlswithwine.com/wp-includes/css/dist/global-styles/style.min.css");

                  @import url("https://blog.girlswithwine.com/wp-content/themes/astra/style.css");

                  @import url("https://blog.girlswithwine.com/wp-content/themes/astra/assets/css/minified/main.min.css");

                  @import url("https://blog.girlswithwine.com/wp-content/plugins/seo-by-rank-math/assets/frontend/css/rank-math.css");

                  * {
                    box-sizing: border-box;
                  }

                  html{
                    scroll-behavior:smooth;
                  }

                  img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 20px;
                  }

                  iframe {
                    width: 100%;
                    max-width: 100%;
                  }

                  table {
                    width: 100%;
                  }

                  figure {
                    margin: 20px 0;
                  }

                  p {
                    line-height: 1.8;
                  }

                  h2{
                    scroll-margin-top:120px;
                  }

                  .animate-fadeIn{
                    animation:fadeIn .3s ease;
                  }

                  @keyframes fadeIn{
                    from{
                      opacity:0;
                      transform:translateY(-10px);
                    }
                    to{
                      opacity:1;
                      transform:translateY(0);
                    }
                  }
                `}
              </style>

              {/* ✅ WORDPRESS CONTENT */}
              <div
                dangerouslySetInnerHTML={{
                  __html: blog.fullContent,
                }}
              />

            </root.div>

          </div>

        </div>

      </div>

    </div>

  );

}





