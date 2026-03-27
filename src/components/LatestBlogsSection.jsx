"use client";

import { getAllBlogsThunk } from "@/store/slices/blogSlice";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* ✅ UI HELPER: CLEAN TEXT */
const stripHtmlAndSlice = (html, limit = 80) => {
  if (!html) return "";
  const cleanText = html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return cleanText.length > limit ? cleanText.slice(0, limit) + "..." : cleanText;
};

/* ✅ UI HELPER: SKELETON LOADER */
const BlogSkeleton = () => (
  <div className="animate-pulse bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
    <div className="bg-gray-200 aspect-[16/10] rounded-2xl mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-full"></div>
  </div>
);

export default function LatestBlogsSection() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { blogs, loading } = useSelector((state) => state.blog || {});

  useEffect(() => {
    dispatch(getAllBlogsThunk());
  }, [dispatch]);

  /* ✅ FIXED: SLICE TO 3 ONLY */
  const latestBlogs = useMemo(() => {
    if (!blogs?.length) return [];
    return [...blogs]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3); // Sirf 3 cards ke liye
  }, [blogs]);

  return (
    <section className="bg-[#FAFAFB] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Latest <span className="text-[#A3195B]">Insights</span>
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              Explore our top 3 handpicked stories for you.
            </p>
          </div>
          <button 
            onClick={() => router.push('/blog')}
            className="group text-[#A3195B] font-bold text-sm flex items-center gap-2 transition-all hover:gap-3"
          >
            EXPLORE BLOG <span>→</span>
          </button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[...Array(3)].map((_, i) => <BlogSkeleton key={i} />)}
          </div>
        ) : latestBlogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 font-medium">No stories published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {latestBlogs.map((blog) => (
              <article
                key={blog._id}
                onClick={() => router.push(`/blog/${blog.slug}`)}
                className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-[0_20px_50px_rgba(163,25,91,0.1)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col"
              >
                {/* IMAGE CONTAINER */}
                <div className="relative w-full aspect-[16/11] overflow-hidden bg-gray-100">
                  <Image
                    src={blog.imageUrl || "/placeholder.jpg"}
                    alt={blog.imageAlt || blog.title}
                    width={600}
                    height={550}
                    unoptimized
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* TEXT CONTENT */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-[#A3195B] text-white text-[9px] font-black rounded-lg uppercase tracking-widest shadow-sm">
                      NEW
                    </span>
                    <time className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                    </time>
                  </div>

                  <h3 className="text-gray-900 text-xl font-bold leading-tight group-hover:text-[#A3195B] transition-colors line-clamp-2 mb-4">
                    {blog.title}
                  </h3>

                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6">
                    {stripHtmlAndSlice(blog.description, 95)}
                  </p>

                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[#A3195B] font-extrabold text-[11px] uppercase tracking-widest group-hover:underline">
                      Read Full Story
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#A3195B] group-hover:text-white transition-all duration-300">
                      <span className="text-lg">→</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}