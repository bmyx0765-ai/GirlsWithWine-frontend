// "use client";

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getBlogBySlugThunk } from "@/store/slices/blogSlice";
// import Link from "next/link";

// const createMarkup = (html) => {
//   return { __html: html || "" };
// };

// export default function BlogDetails({ slug }) {
//   const dispatch = useDispatch();
//   const { singleBlog, loading, error } = useSelector((state) => state.blog);
//   const blog = singleBlog?.data;

//   useEffect(() => {
//     if (slug) {
//       dispatch(getBlogBySlugThunk(slug));
//     }
//   }, [slug, dispatch]);

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center p-8 bg-white shadow-xl rounded-3xl border border-red-100">
//           <p className="text-red-500 font-bold mb-4">Error: {error}</p>
//           <Link href="/blog" className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm">
//             Go Back
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   if (loading || !blog) {
//     return (
//       <div className="max-w-4xl mx-auto py-20 px-6 animate-pulse">
//         <div className="flex flex-col md:flex-row gap-10 items-center">
//           <div className="flex-1 space-y-4">
//              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//              <div className="h-12 bg-gray-200 rounded w-full"></div>
//              <div className="h-4 bg-gray-200 rounded w-2/4"></div>
//           </div>
//           <div className="w-40 h-40 bg-gray-200 rounded-3xl"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#FBFCFE] min-h-screen pb-20 font-sans">
//       {/* NAVIGATION BAR */}
//       <nav className="max-w-5xl mx-auto px-6 pt-8">
//         <Link href="/blog" className="group inline-flex items-center gap-2 text-gray-400 hover:text-[#00B9BE] transition-all text-sm font-semibold">
//           <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 group-hover:bg-[#00B9BE] group-hover:text-white transition-all">
//             ←
//           </span>
//           Back to Journal
//         </Link>
//       </nav>

//       <div className="max-w-5xl mx-auto px-6 mt-12">
//         {/* ================= HEADER SECTION ================= */}
//         <header className="flex flex-col md:flex-row gap-8 md:items-center justify-between mb-16">
          
//           <div className="flex-1 order-2 md:order-1">
//             <div className="flex items-center gap-3 mb-6">
//               <span className="px-3 py-1 bg-[#00B9BE]/10 text-[#00B9BE] rounded-lg text-[10px] font-bold uppercase tracking-widest">
//                 Article
//               </span>
//               <span className="text-gray-300 text-xs">•</span>
//               <time className="text-gray-500 text-xs font-medium">
//   {blog?.createdAt ? (
//     new Date(blog.createdAt).toLocaleDateString('en-US', { 
//       month: 'short', 
//       day: 'numeric', 
//       year: 'numeric' 
//     })
//   ) : (
//     "Date Unavailable"
//   )}
// </time>
//             </div>
            
//             <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
//               {blog.title}
//             </h1>

//             <div className="flex items-center gap-4">
//                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-full shadow-sm">
//                   <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#00B9BE] to-teal-400 flex items-center justify-center text-[10px] text-white font-bold">
//                     A
//                   </div>
//                   <span className="text-xs font-bold text-gray-700">Admin Staff</span>
//                </div>
//                <span className="text-gray-400 text-xs italic">5 min read</span>
//             </div>
//           </div>

//           {/* REFINED SQUARE IMAGE */}
//           <div className="flex justify-center md:justify-end order-1 md:order-2">
//             <div className="relative group shrink-0">
//               {/* Decorative background shadow */}
//               <div className="absolute inset-0 bg-[#00B9BE] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
              
//               <div className="relative w-44 h-44 md:w-52 md:h-52 aspect-square overflow-hidden rounded-[2rem] border-[6px] border-white shadow-xl">
//                 <img
//                   src={blog.imageUrl || "/images/default.jpg"}
//                   alt={blog.title}
//                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                 />
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* ================= CONTENT BODY ================= */}
//         <main className="relative max-w-6xl mx-auto">
//           <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-14 lg:p-20 overflow-hidden">
//             {/* Elegant accent line */}
//             <div className="w-20 h-1.5 bg-gradient-to-r from-[#00B9BE] to-teal-200 rounded-full mb-10"></div>
            
//             <article
//               className="
//                 prose 
//                 max-w-none 
//                 prose-lg 
//                 prose-headings:text-gray-900 
//                 prose-headings:font-bold
//                 prose-p:text-gray-600 
//                 prose-p:leading-relaxed 
//                 prose-p:mb-6
//                 prose-strong:text-gray-800
//                 prose-a:text-[#00B9BE] 
//                 prose-a:no-underline 
//                 hover:prose-a:underline
//                 prose-img:rounded-3xl
//                 prose-img:shadow-md
//               "
//               dangerouslySetInnerHTML={createMarkup(blog.description)}
//             />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }








"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const createMarkup = (html) => {
  return { __html: html || "" };
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

        if (data.length > 0) {
          const post = data[0];

          setBlog({
            title: post.title.rendered,

            description: post.content.rendered,

            imageUrl:
              post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
              "/images/default.jpg",

            createdAt: post.date,
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

  if (loading || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-[#FBFCFE] min-h-screen pb-20 font-sans">
      <nav className="max-w-5xl mx-auto px-6 pt-8">
        <Link href="/blog">← Back to Blogs</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 mt-12">
        <header className="mb-10">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-[400px] object-cover rounded-3xl mb-8"
          />

          <h1
            className="text-4xl font-bold mb-4"
            dangerouslySetInnerHTML={{
              __html: blog.title,
            }}
          />

          <p className="text-gray-500">
            {new Date(blog.createdAt).toDateString()}
          </p>
        </header>

        <article
          className="prose max-w-none prose-lg"
          dangerouslySetInnerHTML={createMarkup(blog.description)}
        />
      </div>
    </div>
  );
}