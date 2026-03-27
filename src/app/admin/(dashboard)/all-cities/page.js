"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  getCitiesThunk,
  deleteCityThunk,
  updateCityStatusThunk,
} from "@/store/slices/citySlice";

import Drawer from "@mui/material/Drawer";
import { toast } from "react-toastify";

import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  MapPinIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";

/* ------------------------
   Skeleton Loader Component
------------------------- */
const TableSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-gray-100">
          <td className="p-4"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
          <td className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </td>
          <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
          <td className="p-4"><div className="h-8 bg-gray-200 rounded-full w-20"></div></td>
          <td className="p-4 text-center"><div className="h-8 bg-gray-200 rounded-lg w-24 mx-auto"></div></td>
        </tr>
      ))}
    </>
  );
};

export default function AllCities() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { cities = [], loading, deleteLoading } = useSelector((s) => s.city);

  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [statusLoadingId, setStatusLoadingId] = useState(null);

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalItems = cities?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedCities = cities?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /* FETCH CITIES */
  useEffect(() => {
    dispatch(getCitiesThunk());
  }, [dispatch]);

  /* HANDLERS */
  const handleDelete = async (cityId) => {
    if (!window.confirm("Delete this city permanentely?")) return;
    setDeleteId(cityId);
    const action = await dispatch(deleteCityThunk(cityId));
    if (action.meta.requestStatus === "fulfilled") {
      toast.success("City removed");
      dispatch(getCitiesThunk());
    }
    setDeleteId(null);
  };

  const handleStatusToggle = async (city) => {
    setStatusLoadingId(city._id);
    const newStatus = city.status === "Active" ? "Inactive" : "Active";
    const action = await dispatch(updateCityStatusThunk({ id: city._id, status: newStatus }));
    
    if (action.meta.requestStatus === "fulfilled") {
      toast.success(`City is now ${newStatus}`);
      dispatch(getCitiesThunk());
    }
    setStatusLoadingId(null);
  };

  const handleView = (city) => {
    setSelectedCity(city);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER CARD */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Cities Directory</h2>
            <p className="text-gray-500 text-sm mt-1">Manage service locations, contact info, and SEO content.</p>
          </div>
          <Link
            href="/admin/create-city"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-2"
          >
            <span>+</span> Add New City
          </Link>
        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-widest font-bold border-b border-gray-100">
                  <th className="px-6 py-5 w-16">#</th>
                  <th className="px-6 py-5">City Info</th>
                  <th className="px-6 py-5">Contact Details</th>
                  <th className="px-6 py-5">Created</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <TableSkeleton />
                ) : paginatedCities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-gray-400">
                      No city records found.
                    </td>
                  </tr>
                ) : (
                  paginatedCities.map((city, index) => (
                    <tr key={city._id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                        {(currentPage - 1) * pageSize + (index + 1)}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 overflow-hidden">
                            {city.imageUrl ? (
                                <img src={city.imageUrl} className="w-full h-full object-cover" alt={city.mainCity} />
                            ) : (
                                <MapPinIcon className="w-6 h-6 text-blue-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-base">{city.mainCity}</div>
                            <div className="text-gray-400 text-xs truncate max-w-[200px]">{city.heading}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <PhoneIcon className="w-3 h-3 text-blue-400" /> {city.phoneNumber || "N/A"}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <ChatBubbleLeftRightIcon className="w-3 h-3 text-green-400" /> {city.whatsappNumber || "N/A"}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(city.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>

                      <td className="px-6 py-4">
                        {statusLoadingId === city._id ? (
                           <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <button
                            onClick={() => handleStatusToggle(city)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter transition-all ${
                              city.status === "Active"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            {city.status}
                          </button>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2">
                          <button onClick={() => handleView(city)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <Link href={`/admin/edit-city/${city._id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                            <PencilSquareIcon className="w-5 h-5" />
                          </Link>
                          <button 
                            disabled={deleteId === city._id}
                            onClick={() => handleDelete(city._id)} 
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            {deleteId === city._id ? (
                                <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <TrashIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 font-medium tracking-wide">
              Displaying <span className="text-blue-600 font-bold">{paginatedCities.length}</span> out of {totalItems} cities
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-all"
                >
                  Prev
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                        currentPage === num
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                          : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* DETAILS DRAWER */}
        <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
          <div className="w-[450px] bg-white h-full flex flex-col">
            {selectedCity && (
              <>
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-2xl font-black text-gray-900">City Overview</h3>
                  <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-black text-2xl">×</button>
                </div>

                <div className="p-8 overflow-y-auto flex-1 space-y-8">
                  <div className="relative h-48 rounded-3xl overflow-hidden shadow-xl">
                    <img 
                      src={selectedCity.imageUrl || "https://placehold.co/600x400?text=No+Image"} 
                      className="w-full h-full object-cover" 
                      alt={selectedCity.imageAlt} 
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-blue-600 shadow-sm">
                      {selectedCity.status}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-3xl font-bold text-gray-900">{selectedCity.mainCity}</h4>
                    <p className="text-blue-600 font-medium text-sm">{selectedCity.heading}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-gray-50 rounded-2xl">
                        <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Phone</label>
                        <p className="text-sm font-semibold">{selectedCity.phoneNumber || "-"}</p>
                     </div>
                     <div className="p-4 bg-gray-50 rounded-2xl">
                        <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">WhatsApp</label>
                        <p className="text-sm font-semibold text-green-600">{selectedCity.whatsappNumber || "-"}</p>
                     </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-sm font-bold text-gray-900 border-l-4 border-blue-600 pl-3">Full Description</h5>
                    <div 
                      className="text-sm text-gray-600 leading-relaxed prose prose-sm"
                      dangerouslySetInnerHTML={{ __html: selectedCity.description }}
                    />
                  </div>

                  <div className="space-y-3 p-6 bg-blue-50 rounded-3xl">
                    <h5 className="text-sm font-bold text-blue-900">SEO Meta Info</h5>
                    <div className="space-y-2">
                        <p className="text-xs text-blue-700 italic">"{selectedCity.seoTitle}"</p>
                        <div className="flex flex-wrap gap-1">
                            {selectedCity.seoKeywords?.split(',').map((tag, i) => (
                                <span key={i} className="bg-white text-[10px] px-2 py-0.5 rounded-md text-blue-500 font-bold">#{tag.trim()}</span>
                            ))}
                        </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-gray-100 flex gap-4">
                    <Link 
                        href={`/admin/edit-city/${selectedCity._id}`}
                        className="flex-1 text-center py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all"
                    >
                        Edit Details
                    </Link>
                </div>
              </>
            )}
          </div>
        </Drawer>
      </div>
    </div>
  );
}