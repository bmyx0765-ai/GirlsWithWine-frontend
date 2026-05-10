"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import root from "react-shadow";

export default function BlogDetails({ slug }) {

  const [blog, setBlog] = useState(null);

  const [loading, setLoading] = useState(true);

  const [seoHeadings, setSeoHeadings] = useState([]);

  useEffect(() => {

    const fetchBlog = async () => {

      try {

        const res = await fetch(
          `https://blog.girlswithwine.com/wp-json/wp/v2/posts?slug=${slug}&_embed`
        );

        const data = await res.json();

        console.log("BLOG API 👉", data);

        // ✅ ARRAY CHECK
        if (data && data.length > 0) {

          const post = data[0];

          let content =
            post?.full_content ||
            post?.content?.rendered ||
            "";



          // ✅ REMOVE STRONG FROM H1-H6
          content = content.replace(
            /<h([1-6])([^>]*)>\s*<strong>(.*?)<\/strong>\s*<\/h\1>/gi,
            "<h$1$2>$3</h$1>"
          );



          // ✅ CHANGE ALL BLOG DOMAIN TO MAIN DOMAIN
          content = content.replaceAll(
            "https://blog.girlswithwine.com",
            "https://girlswithwine.com"
          );



          // ✅ EXTRACT HEADINGS FOR SEO
          const headingMatches = [
            ...content.matchAll(
              /<h([1-6])[^>]*>(.*?)<\/h\1>/gi
            ),
          ];

          const headings = headingMatches.map((item) => ({
            level: item[1],
            text: item[2].replace(/<[^>]+>/g, ""),
          }));

          setSeoHeadings(headings);



          setBlog({

            title:
              post?.title?.rendered || "",

            fullContent:
              content,



            // ✅ FEATURE IMAGE DOMAIN CHANGE
            imageUrl:
              (
                post?._embedded?.["wp:featuredmedia"]?.[0]
                  ?.source_url || "/images/default.jpg"
              ).replaceAll(
                "https://blog.girlswithwine.com",
                "https://girlswithwine.com"
              ),

            createdAt:
              post?.date || "",

          });

        }

      } catch (error) {

        console.log("BLOG ERROR 👉", error);

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

      <div className="max-w-5xl mx-auto px-6 py-10">

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



        {/* ✅ FEATURE IMAGE */}
       



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

  );

}