"use client";

import { 
  getAllReviewsThunk, 
  deleteReviewThunk, 
  approveReviewThunk, 
  rejectReviewThunk 
} from "@/store/slices/reviewSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  CheckIcon, 
  XMarkIcon, 
  TrashIcon, 
  UserCircleIcon,
  StarIcon 
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

/* ------------------------
   Skeleton Loader Component
------------------------- */
const ReviewSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-gray-100">
          <td className="p-4"><div className="h-10 w-10 bg-gray-200 rounded-full"></div></td>
          <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
          <td className="p-4"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
          <td className="p-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
          <td className="p-4"><div className="h-8 bg-gray-200 rounded-full w-20"></div></td>
          <td className="p-4 text-center"><div className="h-8 w-32 bg-gray-200 rounded-lg mx-auto"></div></td>
        </tr>
      ))}
    </>
  );
};

const AllReviewsPage = () => {
  const dispatch = useDispatch();
  const { reviews = [], loading, error } = useSelector((state) => state.review);
  const [actionId, setActionId] = useState(null);

  /* PAGINATION STATES */
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalItems = reviews?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedReviews = reviews?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    dispatch(getAllReviewsThunk());
  }, [dispatch]);

  /* ================= ACTION HANDLERS ================= */
  const handleApprove = async (id) => {
    setActionId(id);
    const res = await dispatch(approveReviewThunk(id));
    if (!res.error) toast.success("Review Approved Successfully");
    setActionId(null);
  };

  const handleReject = async (id) => {
    setActionId(id);
    const res = await dispatch(rejectReviewThunk(id));
    if (!res.error) toast.warn("Review marked as Rejected");
    setActionId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review permanently?")) {
      const res = await dispatch(deleteReviewThunk(id));
      if (!res.error) toast.error("Review Deleted");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Reviews Moderation</h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">Verify and manage feedback from your users.</p>
          </div>
          <div className="bg-blue-50 px-5 py-2 rounded-2xl border border-blue-100">
             <span className="text-blue-700 font-bold text-sm tracking-wide">Total Records: {totalItems}</span>
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
                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-widest font-black border-b border-gray-100">
                  <th className="px-6 py-5">Reviewer</th>
                  <th className="px-6 py-5">Profile Reviewed</th>
                  <th className="px-6 py-5">Comment</th>
                  <th className="px-6 py-5">Rating</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <ReviewSkeleton />
                ) : paginatedReviews?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-24">
                      <div className="flex flex-col items-center opacity-20">
                        <StarIcon className="w-16 h-16 mb-2" />
                        <p className="text-xl font-bold">No reviews found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedReviews.map((review) => (
                    <tr key={review._id} className="hover:bg-blue-50/30 transition-colors group">
                      
                      {/* USER INFO */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-100 flex-shrink-0">
                            {review.userImage ? (
                                <img src={review.userImage} className="w-full h-full object-cover" alt="User" />
                            ) : (
                                <UserCircleIcon className="w-full h-full text-gray-300" />
                            )}
                          </div>
                          <span className="font-bold text-gray-900 capitalize text-sm">{review.userName || "Anonymous"}</span>
                        </div>
                      </td>

                      {/* TARGET GIRL PROFILE */}
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                            <img src={review.girl?.imageUrl} className="w-10 h-10 rounded-xl object-cover border-2 border-gray-50 flex-shrink-0 shadow-sm" alt="Girl" />
                            <div className="text-xs font-bold text-gray-700">{review.girl?.name}</div>
                         </div>
                      </td>

                      {/* COMMENT */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 max-w-xs line-clamp-2 leading-relaxed italic">
                          "{review.comment}"
                        </p>
                      </td>

                      {/* RATING */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 w-fit shadow-sm">
                          <span className="text-amber-700 font-black text-xs">{review.rating}</span>
                          <StarIcon className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        </div>
                      </td>

                      {/* STATUS BADGE */}
                      <td className="px-6 py-4">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          review.status === "Approved" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : review.status === "Rejected"
                          ? "bg-red-50 text-red-700 border-red-100"
                          : "bg-blue-50 text-blue-700 border-blue-100"
                        }`}>
                          {review.status || "Pending"}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-1">
                          {review.status !== "Approved" && (
                            <button
                              disabled={actionId === review._id}
                              onClick={() => handleApprove(review._id)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                              title="Approve Review"
                            >
                               {actionId === review._id ? <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div> : <CheckIcon className="w-5 h-5 stroke-[2.5]" />}
                            </button>
                          )}

                          {review.status !== "Rejected" && (
                            <button
                              disabled={actionId === review._id}
                              onClick={() => handleReject(review._id)}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                              title="Reject Review"
                            >
                              <XMarkIcon className="w-5 h-5 stroke-[2.5]" />
                            </button>
                          )}

                          <div className="w-px h-4 bg-gray-200 mx-2"></div>

                          <button
                            onClick={() => handleDelete(review._id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete Permanently"
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
              Showing <span className="text-gray-900 font-bold">{paginatedReviews.length}</span> of {totalItems} reviews
            </p>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-all font-bold text-xs shadow-sm"
                >
                  Prev
                </button>
                <div className="flex gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                        currentPage === num
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-100 scale-105"
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
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-all font-bold text-xs shadow-sm"
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

export default AllReviewsPage;