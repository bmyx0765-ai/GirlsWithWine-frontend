"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ✅ HTML remove helper
const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
};

export default function BlogClient() {

  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);

  // ✅ PAGINATION
  const [currentPage, setCurrentPage] = useState(1);

  const blogsPerPage = 3;



  // ✅ FETCH WORDPRESS BLOGS
  useEffect(() => {

    const fetchBlogs = async () => {

      try {

        const res = await fetch(
          "https://blog.girlswithwine.com/wp-json/wp/v2/posts?_embed"
        );

        const data = await res.json();

        console.log("BLOGS 👉", data);

        const formattedBlogs = data.map((post) => ({

          id: post.id,

          slug: post.slug,

          title: post.title.rendered,

          description: post.content.rendered,



          // ✅ DOMAIN CHANGE
          imageUrl:
            (
              post?._embedded?.["wp:featuredmedia"]?.[0]
                ?.source_url ||
              "/images/default.jpg"
            ).replaceAll(
              "https://blog.girlswithwine.com",
              "https://girlswithwine.com"
            ),

          createdAt: post.date,

        }));

        setBlogs(formattedBlogs);

      } catch (error) {

        console.log("BLOG ERROR 👉", error);

      } finally {

        setLoading(false);

      }

    };

    fetchBlogs();

  }, []);




  // ================= PAGINATION LOGIC =================
  const indexOfLast = currentPage * blogsPerPage;

  const indexOfFirst = indexOfLast - blogsPerPage;

  const currentBlogs = blogs.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);




  // ================= SKELETON =================
  const SkeletonCard = () => (

    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col md:flex-row animate-pulse">

      <div className="md:w-1/2 w-full h-[300px] bg-gray-300" />

      <div className="md:w-1/2 w-full p-6 space-y-3">

        <div className="h-5 bg-gray-300 rounded w-3/4"></div>

        <div className="h-4 bg-gray-300 rounded w-full"></div>

        <div className="h-4 bg-gray-300 rounded w-5/6"></div>

      </div>

    </div>

  );




  return (

    <div className="min-h-screen bg-[#f6f7fb] px-4 py-16">

      {/* HEADING */}
      <div className="text-center mb-16">

        <p className="text-orange-500 font-semibold tracking-wide">
          \ Our Blogs \
        </p>

        <h1 className="text-4xl font-bold text-gray-800 mt-2">
          Latest Blogs
        </h1>

      </div>




      {/* BLOG LIST */}
      <div className="max-w-6xl mx-auto flex flex-col gap-20">

        {loading

          ? Array(2)
              .fill(0)
              .map((_, i) => (
                <SkeletonCard key={i} />
              ))

          : currentBlogs.map((blog, index) => (

              <div
                key={blog.id}
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 !== 0
                    ? "lg:flex-row-reverse"
                    : ""
                }`}
              >

                {/* IMAGE */}
                <div className="relative w-full lg:w-1/2 flex justify-center items-center">

                  <div className="relative z-10 w-full max-w-lg p-3 md:p-4">

                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-[280px] md:h-[350px] object-cover rounded-2xl shadow-xl"
                    />

                  </div>

                </div>




                {/* CONTENT */}
                <div className="w-full lg:w-1/2 flex flex-col justify-between lg:text-left">

                  <h2
                    className="text-2xl lg:text-3xl font-bold mb-4"
                    dangerouslySetInnerHTML={{
                      __html: blog.title,
                    }}
                  />



                  <p className="text-gray-600 mb-6">

                    {stripHtml(blog.description).slice(0, 220)}...

                  </p>



                  <Link
                    href={`/blog/${blog.slug}`}
                    className="inline-block w-fit bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
                  >
                    Read More
                  </Link>

                </div>

              </div>

            ))}

      </div>




      {/* PAGINATION */}
      {!loading && totalPages > 1 && (

        <div className="flex justify-center mt-16 gap-2 flex-wrap">

          <button
            onClick={() =>
              setCurrentPage((prev) => prev - 1)
            }
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>



          {Array.from(
            { length: totalPages },
            (_, i) => i + 1
          ).map((num) => (

            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === num
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {num}
            </button>

          ))}



          <button
            onClick={() =>
              setCurrentPage((prev) => prev + 1)
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>

        </div>

      )}

    </div>

  );

}