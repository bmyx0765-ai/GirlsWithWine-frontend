"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const createMarkup = (html) => {
  return {
    __html: html || "",
  };
};

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

        if (data?.length > 0) {

          const post = data[0];

          setBlog({

            title:
              post?.title?.rendered || "",

            content:
              post?.content?.rendered || "",

            imageUrl:
              post?._embedded?.["wp:featuredmedia"]?.[0]
                ?.source_url ||
              "/images/default.jpg",

            createdAt:
              post?.date || "",

          });

        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchBlog();

  }, [slug]);



  // ✅ LOADING
  if (loading || !blog) {

    return (

      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">

        Loading...

      </div>

    );

  }



  return (

    <div className="bg-[#FBFCFE] min-h-screen pb-20 font-sans">

      {/* BACK */}
      <nav className="max-w-5xl mx-auto px-6 pt-8">

        <Link
          href="/blog"
          className="text-pink-600 font-medium hover:underline"
        >
          ← Back to Blogs
        </Link>

      </nav>



      {/* BLOG */}
      <div className="max-w-5xl mx-auto px-6 mt-12">

        {/* HEADER */}
        <header className="mb-10">

          

          {/* TITLE */}
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-gray-900"
            dangerouslySetInnerHTML={{
              __html: blog.title,
            }}
          />

          {/* DATE */}
          <p className="text-gray-500 text-sm">

            {new Date(blog.createdAt).toDateString()}

          </p>

        </header>



        {/* ✅ WORDPRESS CONTENT */}
        <article className="wordpress-content">

          <div
            dangerouslySetInnerHTML={createMarkup(blog.content)}
          />

        </article>

      </div>

    </div>

  );

}



















// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// export default function BlogDetails({ slug }) {

//   const [blog, setBlog] = useState(null);

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {

//     const fetchBlog = async () => {

//       try {

//         const res = await fetch(
//           `https://blog.girlswithwine.com/wp-json/wp/v2/posts?slug=${slug}&_embed`
//         );

//         const data = await res.json();

//         if (data?.length > 0) {

//           const post = data[0];

//           setBlog({

//             title:
//               post?.title?.rendered || "",

//             imageUrl:
//               post?._embedded?.["wp:featuredmedia"]?.[0]
//                 ?.source_url ||
//               "/images/default.jpg",

//             createdAt:
//               post?.date || "",

//           });

//         }

//       } catch (error) {

//         console.log(error);

//       } finally {

//         setLoading(false);

//       }

//     };

//     fetchBlog();

//   }, [slug]);



//   // ✅ LOADING
//   if (loading || !blog) {

//     return (

//       <div className="min-h-screen flex items-center justify-center text-lg font-semibold">

//         Loading...

//       </div>

//     );

//   }



//   return (

//     <div className="bg-[#FBFCFE] min-h-screen pb-20 font-sans">

//       {/* BACK */}
//       <nav className="max-w-5xl mx-auto px-6 pt-8">

//         <Link
//           href="/blog"
//           className="text-pink-600 font-medium hover:underline"
//         >
//           ← Back to Blogs
//         </Link>

//       </nav>



//       {/* BLOG */}
//       <div className="max-w-5xl mx-auto px-6 mt-12">

//         {/* HEADER */}
//         <header className="mb-10">

//           {/* IMAGE */}
//           <img
//             src={blog.imageUrl}
//             alt="Blog"
//             className="w-full h-[400px] object-cover rounded-3xl mb-8"
//           />

//           {/* TITLE */}
//           <h1
//             className="text-4xl font-bold mb-4 leading-tight"
//             dangerouslySetInnerHTML={{
//               __html: blog.title,
//             }}
//           />

//           {/* DATE */}
//           <p className="text-gray-500">

//             {new Date(blog.createdAt).toDateString()}

//           </p>

//         </header>



//         {/* ✅ EXACT WORDPRESS DESIGN */}
//         <iframe
//           src={`https://blog.girlswithwine.com/${slug}`}
//           className="w-full border-0 rounded-2xl bg-white"
//           style={{
//             minHeight: "5000px",
//           }}
//         />

//       </div>

//     </div>

//   );

// }