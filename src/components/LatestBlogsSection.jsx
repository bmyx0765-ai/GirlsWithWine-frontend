"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/* ================= CLEAN TEXT ================= */

const stripHtml = (html = "") => {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

export default function LatestBlogsSection() {

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH WORDPRESS BLOGS ================= */

  useEffect(() => {

    const fetchBlogs = async () => {

      try {

        const res = await fetch(
          "https://blog.girlswithwine.com/wp-json/wp/v2/posts?_embed&per_page=3",
          {
            cache: "no-store",
          }
        );

        const data = await res.json();

        console.log("WORDPRESS BLOGS:", data);

        setBlogs(data);

      } catch (error) {

        console.log("BLOG FETCH ERROR:", error);

      } finally {

        setLoading(false);

      }
    };

    fetchBlogs();

  }, []);

  return (
    <section className="bg-[#EEF2F6] py-16 md:py-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TOP SECTION */}

        <div className="flex items-center justify-between mb-12">

          <div>

            <h2 className="text-4xl md:text-5xl font-black text-[#1B2B48]">
              Latest Blogs
            </h2>

            <p className="text-gray-500 text-lg mt-3">
              Latest articles from Girls With Wine Blog
            </p>

          </div>

          <a
            href="https://blog.girlswithwine.com"
            target="_blank"
            className="
              hidden md:flex
              items-center
              gap-2
              bg-[#0066D9]
              text-white
              px-6
              py-3
              rounded-xl
              font-semibold
              hover:bg-[#0052ad]
              transition-all
            "
          >
            View All →
          </a>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {[1, 2, 3].map((item) => (

              <div
                key={item}
                className="
                  bg-white
                  rounded-[28px]
                  overflow-hidden
                  animate-pulse
                  shadow-sm
                "
              >

                <div className="h-[260px] bg-gray-200"></div>

                <div className="p-7">

                  <div className="h-4 bg-gray-200 rounded w-32 mb-5"></div>

                  <div className="h-8 bg-gray-200 rounded mb-3"></div>

                  <div className="h-8 bg-gray-200 rounded w-[80%] mb-5"></div>

                  <div className="h-4 bg-gray-200 rounded w-40 mb-5"></div>

                  <div className="h-4 bg-gray-200 rounded mb-3"></div>

                  <div className="h-4 bg-gray-200 rounded w-[90%]"></div>

                </div>

              </div>
            ))}

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {blogs?.map((blog) => {

              /* ================= IMAGE ================= */

              const image =
                blog?._embedded?.["wp:featuredmedia"]?.[0]?.media_details
                  ?.sizes?.full?.source_url ||

                blog?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||

                blog?._embedded?.["wp:featuredmedia"]?.[0]?.guid?.rendered ||

                "https://girlswithwine.com/logo.png";

              return (

                <article
                  key={blog.id}
                  onClick={() => {
  window.location.href = `/blog/${blog.slug}`;
}}
                  className="
                    group
                    bg-white
                    rounded-[28px]
                    overflow-hidden
                    shadow-sm
                    hover:shadow-2xl
                    transition-all
                    duration-500
                    cursor-pointer
                    hover:-translate-y-2
                    border
                    border-gray-100
                  "
                >

                  {/* IMAGE */}

                  <div className="relative w-full h-[260px] overflow-hidden">

                    <Image
                      src={image}
                      alt={blog?.title?.rendered || "Blog"}
                      fill
                      unoptimized
                      className="
                        object-cover
                        group-hover:scale-110
                        transition-transform
                        duration-700
                      "
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                  </div>

                  {/* CONTENT */}

                  <div className="p-7 flex flex-col h-[340px]">

                    {/* CATEGORY */}

                    <span
                      className="
                        inline-flex
                        w-fit
                        px-4
                        py-1.5
                        rounded-full
                        bg-[#E8F1FF]
                        text-[#0066D9]
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        mb-5
                      "
                    >
                      {
                        blog?._embedded?.["wp:term"]?.[0]?.[0]
                          ?.name || "Blog"
                      }
                    </span>

                    {/* TITLE */}

                    <h3
                      className="
                        text-[18px]
                        leading-[40px]
                        font-black
                        text-[#1B2B48]
                        mb-5
                        line-clamp-3
                        group-hover:text-[#0066D9]
                        transition-colors
                      "
                      dangerouslySetInnerHTML={{
                        __html: blog?.title?.rendered,
                      }}
                    />

                    {/* DATE */}

                    <p
                      className="
                        text-[#0066D9]
                        font-semibold
                        text-[15px]
                        mb-5
                      "
                    >
                      Girls With Wine /{" "}

                      {new Date(blog.date).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}

                    </p>

                    {/* EXCERPT */}

                    <p
                      className="
                        text-[#39465E]
                        text-[17px]
                        leading-[34px]
                        line-clamp-4
                      "
                    >
                      {stripHtml(
                        blog?.excerpt?.rendered
                      ).slice(0,69)}
                      ...
                    </p>

                    {/* BUTTON */}

                    <div className="mt-auto pt-6">

                      <button
                        className="
                          flex
                          items-center
                          gap-2
                          text-[#0066D9]
                          font-bold
                          text-sm
                          uppercase
                          tracking-wider
                          group-hover:gap-4
                          transition-all
                        "
                      >
                        Read Full Blog →

                      </button>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>

        )}

        {/* MOBILE BUTTON */}

        <div className="mt-10 flex md:hidden justify-center">

          <a
            href="https://blog.girlswithwine.com"
            target="_blank"
            className="
              inline-flex
              items-center
              gap-2
              bg-[#0066D9]
              text-white
              px-6
              py-3
              rounded-xl
              font-semibold
            "
          >
            View All Blogs →
          </a>

        </div>

      </div>

    </section>
  );
}