"use client";

import { deleteBlogThunk, getAllBlogsThunk } from "@/store/slices/blogSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { 
  PencilSquareIcon, 
  TrashIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  DocumentTextIcon 
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

/* ------------------------
   Skeleton Loader Component
------------------------- */
const BlogSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-gray-100">
          <td className="p-4"><div className="h-12 w-16 bg-gray-200 rounded-lg"></div></td>
          <td className="p-4"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
          <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
          <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
          <td className="p-4 text-center"><div className="h-8 w-24 bg-gray-200 rounded-lg mx-auto"></div></td>
        </tr>
      ))}
    </>
  );
};

const AllBlogPage = () => {
  const dispatch = useDispatch();
  const { blogs = [], loading, error } = useSelector((state) => state.blog || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // FETCH BLOGS
  useEffect(() => {
    dispatch(getAllBlogsThunk());
  }, [dispatch]);

  // DELETE BLOG
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      dispatch(deleteBlogThunk(id));
      toast.error("Blog deleted successfully");
    }
  };

  /* SEARCH & PAGINATION LOGIC */
  const filteredBlogs = blogs.filter(blog => 
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.seoTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBlogs.length / pageSize);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* TOP BAR */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Blog Articles</h2>
            <p className="text-gray-500 text-sm mt-1">Create, edit, and manage your content strategy.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Add Blog Button */}
            <Link
              href="/admin/add-blog"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-100 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap w-full md:w-auto justify-center"
            >
              <PlusIcon className="w-5 h-5 stroke-[3]" />
              Write New Blog
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-sm font-medium">
            ⚠️ Error: {error}
          </div>
        )}

        {/* TABLE CONTAINER */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-[11px] uppercase tracking-[0.15em] font-black border-b border-gray-100">
                  <th className="px-6 py-5">Cover</th>
                  <th className="px-6 py-5">Article Title</th>
                  <th className="px-6 py-5">SEO Meta Title</th>
                  <th className="px-6 py-5">Published Date</th>
                  <th className="px-6 py-5 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <BlogSkeleton />
                ) : paginatedBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-24">
                      <div className="flex flex-col items-center opacity-20">
                        <DocumentTextIcon className="w-16 h-16 mb-2" />
                        <p className="text-xl font-bold">No articles found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedBlogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-emerald-50/30 transition-colors group">
                      
                      {/* BLOG IMAGE */}
                      <td className="px-6 py-4">
                        <div className="w-16 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                          {blog.imageUrl ? (
                            <img src={blog.imageUrl} className="w-full h-full object-cover" alt="blog" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">NA</div>
                          )}
                        </div>
                      </td>

                      {/* TITLE */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 text-sm leading-tight hover:text-emerald-600 transition-colors cursor-default">
                          {blog.title}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 font-mono uppercase tracking-tighter">
                          Slug: {blog.slug}
                        </div>
                      </td>

                      {/* SEO TITLE */}
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
                          {blog.seoTitle || "Not Set"}
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-600 font-medium">
                          {new Date(blog.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2">
                          <Link
                            href={`/admin/edit-blog/${blog.slug}`} // ✅ FIXED
                            className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all"
                            title="Edit Article"
                          >
                            <PencilSquareIcon className="w-5 h-5 stroke-[2]" />
                          </Link>

                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                            title="Delete Article"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          <div className="bg-gray-50/50 px-8 py-5 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 font-medium tracking-wide">
              Showing <span className="text-gray-900 font-bold">{paginatedBlogs.length}</span> of {filteredBlogs.length} articles
            </p>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-all font-bold text-xs"
                >
                  Prev
                </button>
                <div className="flex gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                        currentPage === num
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100 scale-105"
                          : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-all font-bold text-xs"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBlogPage;