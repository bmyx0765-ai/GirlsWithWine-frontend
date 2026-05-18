// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// import {
//   getAllGirlsThunk,
//   toggleGirlStatusThunk,
//   deleteGirlThunk,
// } from "@/store/slices/girlSlice";

// /* Skeleton Loader with improved pulsing */
// const GirlsSkeleton = () => {
//   return (
//     <>
//       {Array.from({ length: 5 }).map((_, i) => (
//         <tr key={i} className="animate-pulse border-b border-gray-100">
//           <td className="p-4"><div className="w-12 h-12 bg-gray-200 rounded-xl"></div></td>
//           <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
//           <td className="p-4"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
//           <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
//           <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
//           <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
//           <td className="p-4"><div className="h-8 bg-gray-200 rounded-full w-20"></div></td>
//           <td className="p-4 text-center"><div className="h-8 w-24 bg-gray-200 rounded-lg mx-auto"></div></td>
//         </tr>
//       ))}
//     </>
//   );
// };

// export default function AllGirlsList() {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const { loading, girls, error } = useSelector((state) => state.girls);
//   const [statusLoadingId, setStatusLoadingId] = useState(null);

//   /* Pagination */
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 10;
//   const totalItems = girls?.length || 0;
//   const totalPages = Math.ceil(totalItems / pageSize);

//   const paginatedGirls = girls?.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   useEffect(() => {
//     dispatch(getAllGirlsThunk());
//   }, [dispatch]);

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this profile?")) {
//       dispatch(deleteGirlThunk({ id }));
//     }
//   };

//   const handleStatusChange = async (girl) => {
//     setStatusLoadingId(girl._id);
//     await dispatch(
//       toggleGirlStatusThunk({
//         id: girl._id,
//         status: girl.status === "Active" ? "Inactive" : "Active",
//       })
//     );
//     setStatusLoadingId(null);
//   };

//   const renderCities = (cityArray) => {
//     if (!Array.isArray(cityArray) || cityArray.length === 0) return <span className="text-gray-400 italic text-xs">No City</span>;
//     return (
//       <div className="flex flex-wrap gap-1">
//         {cityArray.slice(0, 2).map((c, idx) => (
//           <span key={idx} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-md border border-gray-200">
//             {c.mainCity}
//           </span>
//         ))}
//         {cityArray.length > 2 && <span className="text-[10px] text-gray-400">+{cityArray.length - 2} more</span>}
//       </div>
//     );
//   };


//   const getImageUrl = (url) => {
//   if (!url || typeof url !== "string") {
//     return "https://placehold.co/100x100?text=No+Image";
//   }

//   // already full URL
//   if (url.startsWith("http")) {
//     return url.trim();
//   }

//   // fallback for relative path
//   return `http://localhost:5000/${url.trim()}`;
// };

//   return (
//     <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8">
//       <div className="max-w-7xl mx-auto space-y-6">

//         {/* TOP ACTION BAR */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Models Inventory</h2>
//             <p className="text-gray-500 text-sm">Manage profile visibility, details, and active listings.</p>
//           </div>

//           <Link
//             href="/admin/add-girl"
//             className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-pink-100 active:scale-95"
//           >
//             <span>+</span>
//             <span>Add New Profile</span>
//           </Link>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm">
//             ⚠️ {error}
//           </div>
//         )}

//         {/* TABLE CONTAINER */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-semibold">
//                   <th className="px-6 py-4">Preview</th>
//                   <th className="px-6 py-4">Name & Age</th>
//                   <th className="px-6 py-4">Locations</th>
//                   <th className="px-6 py-4">Headline</th>
//                   <th className="px-6 py-4">Status</th>
//                   <th className="px-6 py-4 text-center">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-50 text-sm">
//                 {loading ? (
//                   <GirlsSkeleton />
//                 ) : paginatedGirls?.length > 0 ? (
//                   paginatedGirls.map((girl) => (


//                     <tr key={girl._id} className="hover:bg-blue-50/30 transition-colors group">
//                      <td className="px-6 py-4">
//   <img
//     src={getImageUrl(girl.imageUrl)}
//     onError={(e) => {
//       e.currentTarget.src = "https://placehold.co/100x100?text=No+Image";
//     }}
//     className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-100 group-hover:ring-pink-100 transition-all shadow-sm"
//     alt={girl.name}
//   />
// </td>

//                       <td className="px-6 py-4">
//                         <div className="font-bold text-gray-900 capitalize">{girl.name}</div>
//                         <div className="text-gray-500 text-xs">{girl.age} Years Old</div>
//                       </td>

//                       <td className="px-6 py-4 max-w-[150px]">
//                         {renderCities(girl.city)}
//                       </td>

//                       <td className="px-6 py-4">
//                         <p className="text-gray-600 line-clamp-1 text-xs italic">"{girl.heading}"</p>
//                       </td>



//                       <td className="px-6 py-4">
//                         {statusLoadingId === girl._id ? (
//                           <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
//                         ) : (
//                           <button
//                             onClick={() => handleStatusChange(girl)}
//                             className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${girl.status === "Active"
//                               ? "bg-green-100 text-green-700 hover:bg-green-200"
//                               : "bg-gray-100 text-gray-500 hover:bg-gray-200"
//                               }`}
//                           >
//                             ● {girl.status}
//                           </button>
//                         )}
//                       </td>

//                       <td className="px-6 py-4 text-center">
//                         <div className="flex justify-center items-center gap-2">
//                           <button
//                             onClick={() => router.push(`/admin/edit-girl/${girl._id}`)}
//                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                             title="Edit"
//                           >
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
//                           </button>
//                           <button
//                             onClick={() => handleDelete(girl._id)}
//                             className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//                             title="Delete"
//                           >
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={8} className="py-20 text-center">
//                       <div className="flex flex-col items-center opacity-40">
//                         <span className="text-4xl mb-2">📂</span>
//                         <p className="text-gray-500 font-medium">No model records found</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* FOOTER / PAGINATION */}
//           <div className="bg-gray-50/50 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-100">
//             <p className="text-xs text-gray-500 font-medium">
//               Showing <span className="text-gray-900">{paginatedGirls?.length}</span> of <span className="text-gray-900">{totalItems}</span> models
//             </p>

//             {totalPages > 1 && (
//               <div className="flex items-center gap-1">
//                 <button
//                   onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                   disabled={currentPage === 1}
//                   className="px-3 py-1.5 rounded-lg border bg-white text-gray-600 disabled:opacity-50 text-xs font-semibold hover:bg-gray-50 transition-colors"
//                 >
//                   Prev
//                 </button>

//                 <div className="flex gap-1 px-2">
//                   {Array.from({ length: totalPages }).map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setCurrentPage(i + 1)}
//                       className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1
//                         ? "bg-pink-600 text-white shadow-md shadow-pink-100"
//                         : "bg-white text-gray-500 hover:bg-gray-100"
//                         }`}
//                     >
//                       {i + 1}
//                     </button>
//                   ))}
//                 </div>

//                 <button
//                   onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-1.5 rounded-lg border bg-white text-gray-600 disabled:opacity-50 text-xs font-semibold hover:bg-gray-50 transition-colors"
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import { useEffect, useState } from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  getAllGirlsThunk,
  toggleGirlStatusThunk,
  deleteGirlThunk,
} from "@/store/slices/girlSlice";

import {
  convertCloudinaryUrl,
} from "@/utils/convertCloudinaryUrl.js";

/* =========================================
   SKELETON
========================================= */

const GirlsSkeleton = () => {

  return (
    <>
      {Array.from({
        length: 5,
      }).map((_, i) => (

        <tr
          key={i}
          className="animate-pulse border-b border-gray-100"
        >

          <td className="p-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          </td>

          <td className="p-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </td>

          <td className="p-4">
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </td>

          <td className="p-4">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>

          <td className="p-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </td>

          <td className="p-4">
            <div className="h-8 bg-gray-200 rounded-full w-20"></div>
          </td>

          <td className="p-4 text-center">
            <div className="h-8 w-24 bg-gray-200 rounded-lg mx-auto"></div>
          </td>

        </tr>
      ))}
    </>
  );
};

/* =========================================
   IMAGE URL
========================================= */

const getImageUrl = (
  url
) => {

  if (
    !url ||
    typeof url !==
      "string"
  ) {

    return "/placeholder.jpg";
  }

  return convertCloudinaryUrl(
    url.trim()
  );
};

/* =========================================
   MAIN COMPONENT
========================================= */

export default function AllGirlsList() {

  const dispatch =
    useDispatch();

  const router =
    useRouter();

  const {
    loading,
    girls,
    error,
  } = useSelector(
    (state) =>
      state.girls
  );

  const [
    statusLoadingId,
    setStatusLoadingId,
  ] = useState(null);

  /* =========================================
     PAGINATION
  ========================================= */

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const pageSize = 10;

  const totalItems =
    girls?.length || 0;

  const totalPages =
    Math.ceil(
      totalItems /
      pageSize
    );

  const paginatedGirls =
    girls?.slice(
      (currentPage - 1) *
      pageSize,

      currentPage *
      pageSize
    );

  /* =========================================
     FETCH
  ========================================= */

  useEffect(() => {

    dispatch(
      getAllGirlsThunk()
    );

  }, [dispatch]);

  /* =========================================
     DELETE
  ========================================= */

  const handleDelete = (
    id
  ) => {

    if (
      window.confirm(
        "Are you sure you want to delete this profile?"
      )
    ) {

      dispatch(
        deleteGirlThunk({
          id,
        })
      );
    }
  };

  /* =========================================
     STATUS
  ========================================= */

  const handleStatusChange =
    async (girl) => {

      setStatusLoadingId(
        girl._id
      );

      await dispatch(
        toggleGirlStatusThunk(
          {
            id: girl._id,

            status:
              girl.status ===
              "Active"
                ? "Inactive"
                : "Active",
          }
        )
      );

      setStatusLoadingId(
        null
      );
    };

  /* =========================================
     RENDER CITY
  ========================================= */

  const renderCities = (
    cityArray
  ) => {

    if (
      !Array.isArray(
        cityArray
      ) ||
      cityArray.length === 0
    ) {

      return (
        <span className="text-gray-400 italic text-xs">

          No City

        </span>
      );
    }

    return (

      <div className="flex flex-wrap gap-1">

        {cityArray
          .slice(0, 2)
          .map(
            (
              c,
              idx
            ) => (

              <span
                key={idx}
                className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-md border border-gray-200"
              >

                {
                  c.mainCity
                }

              </span>
            )
          )}

        {cityArray.length >
          2 && (

            <span className="text-[10px] text-gray-400">

              +
              {cityArray.length -
                2}{" "}
              more

            </span>
          )}

      </div>
    );
  };

  return (

    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8">

      <div className="max-w-7xl mx-auto space-y-6">

        {/* =========================================
           TOP ACTION BAR
        ========================================= */}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">

              Models Inventory

            </h2>

            <p className="text-gray-500 text-sm">

              Manage profile visibility,
              details, and active
              listings.

            </p>

          </div>

          <Link
            href="/admin/add-girl"
            className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-pink-100 active:scale-95"
          >

            <span>+</span>

            <span>
              Add New Profile
            </span>

          </Link>
        </div>

        {/* =========================================
           ERROR
        ========================================= */}

        {error && (

          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm">

            ⚠️ {error}

          </div>
        )}

        {/* =========================================
           TABLE
        ========================================= */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse">

              <thead>

                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-semibold">

                  <th className="px-6 py-4">
                    Preview
                  </th>

                  <th className="px-6 py-4">
                    Name & Age
                  </th>

                  <th className="px-6 py-4">
                    Locations
                  </th>

                  <th className="px-6 py-4">
                    Headline
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-50 text-sm">

                {loading ? (

                  <GirlsSkeleton />

                ) : paginatedGirls?.length >
                  0 ? (

                  paginatedGirls.map(
                    (
                      girl
                    ) => (

                      <tr
                        key={
                          girl._id
                        }
                        className="hover:bg-blue-50/30 transition-colors group"
                      >

                        {/* IMAGE */}

                        <td className="px-6 py-4">

                          <img
                            src={
                              girl.imageUrl
                                ? getImageUrl(
                                  girl.imageUrl
                                )
                                : "/placeholder.jpg"
                            }
                            onError={(
                              e
                            ) => {

                              e.currentTarget.src =
                                "/placeholder.jpg";
                            }}
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-100 group-hover:ring-pink-100 transition-all shadow-sm"
                            alt={
                              girl.name ||
                              "Girl Image"
                            }
                          />

                        </td>

                        {/* NAME */}

                        <td className="px-6 py-4">

                          <div className="font-bold text-gray-900 capitalize">

                            {
                              girl.name
                            }

                          </div>

                          <div className="text-gray-500 text-xs">

                            {
                              girl.age
                            }{" "}
                            Years Old

                          </div>

                        </td>

                        {/* CITY */}

                        <td className="px-6 py-4 max-w-[150px]">

                          {renderCities(
                            girl.city
                          )}

                        </td>

                        {/* HEADING */}

                        <td className="px-6 py-4">

                          <p className="text-gray-600 line-clamp-1 text-xs italic">

                            "
                            {
                              girl.heading
                            }
                            "

                          </p>

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">

                          {statusLoadingId ===
                            girl._id ? (

                            <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>

                          ) : (

                            <button
                              onClick={() =>
                                handleStatusChange(
                                  girl
                                )
                              }
                              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${girl.status ===
                                "Active"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                            >

                              ●{" "}
                              {
                                girl.status
                              }

                            </button>
                          )}

                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-4 text-center">

                          <div className="flex justify-center items-center gap-2">

                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/edit-girl/${girl._id}`
                                )
                              }
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >

                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >

                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />

                              </svg>

                            </button>

                            <button
                              onClick={() =>
                                handleDelete(
                                  girl._id
                                )
                              }
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >

                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >

                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />

                              </svg>

                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan={8}
                      className="py-20 text-center"
                    >

                      <div className="flex flex-col items-center opacity-40">

                        <span className="text-4xl mb-2">

                          📂

                        </span>

                        <p className="text-gray-500 font-medium">

                          No model records
                          found

                        </p>

                      </div>

                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}