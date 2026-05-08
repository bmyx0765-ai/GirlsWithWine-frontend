"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import root from "react-shadow";

export default function BlogDetails({ slug }) {

  const [blog, setBlog] = useState(null);

  const [loading, setLoading] = useState(true);

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

          setBlog({

            title:
              post?.title?.rendered || "",

            // ✅ CONTENT
            fullContent:
              post?.full_content ||
              post?.content?.rendered ||
              "",

            imageUrl:
              post?._embedded?.["wp:featuredmedia"]?.[0]
                ?.source_url ||
              "/images/default.jpg",

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

        {/* BACK */}
        <Link
          href="/blog"
          className="text-pink-600 hover:underline"
        >
          ← Back
        </Link>



      


        {/* TITLE */}
        <h1
          className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-4"
          dangerouslySetInnerHTML={{
            __html: blog.title,
          }}
        />



        {/* DATE */}
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

              body {
                margin: 0;
                padding: 0;
              }

              img {
                max-width: 100%;
                height: auto;
              }

              table {
                width: 100%;
              }
            `}
          </style>

          {/* ✅ WORDPRESS HTML */}
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