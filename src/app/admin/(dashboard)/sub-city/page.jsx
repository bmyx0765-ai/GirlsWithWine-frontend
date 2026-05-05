"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Drawer from "@mui/material/Drawer";
import { toast } from "react-toastify";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

import {
  fetchSubCities,
  deleteSubCity,
  toggleSubCityStatus
} from "@/store/slices/subCitySlice";

// ---------------- Skeleton ----------------
const TableSkeleton = () => (
  <>
    {Array.from({ length: 5 }).map((_, i) => (
      <tr key={i} className="animate-pulse border-b border-gray-100">
        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
        <td className="p-4"><div className="h-8 bg-gray-200 rounded-full w-20"></div></td>
        <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
      </tr>
    ))}
  </>
);

export default function AllSubCities() {
  const dispatch = useDispatch();
  const { subCities = [], loading } = useSelector((s) => s.subCity);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [statusLoadingId, setStatusLoadingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalItems = subCities.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginated = subCities.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    dispatch(fetchSubCities());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this subcity?")) return;
    setDeleteId(id);
    const res = await dispatch(deleteSubCity(id));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("SubCity deleted successfully");
      dispatch(fetchSubCities());
    }
    setDeleteId(null);
  };

  const handleStatus = async (item) => {
    setStatusLoadingId(item._id);
    const res = await dispatch(toggleSubCityStatus(item._id));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Status updated");
      dispatch(fetchSubCities());
    }
    setStatusLoadingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">SubCity Directory</h2>
            <p className="text-slate-500 text-sm mt-1">
              Manage geographical locations and status visibility.
            </p>
          </div>
          <Link
            href="/admin/create-subcity"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm active:scale-95"
          >
            <PlusIcon className="w-5 h-5" />
            Add SubCity
          </Link>
        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">#</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">SubCity Details</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Main City</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Slug</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <TableSkeleton />
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">🏙️</span>
                        <p>No subcities found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((item, i) => (
                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4 text-sm text-slate-500 font-medium">
                        {(currentPage - 1) * pageSize + (i + 1)}
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-semibold text-slate-700 capitalize group-hover:text-indigo-600 transition-colors">
                          {item.name}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-600 capitalize">
                        {item.city?.mainCity || "N/A"}
                      </td>
                      <td className="p-4">
                        <code className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          {item.slug}
                        </code>
                      </td>
                      <td className="p-4">
                        {statusLoadingId === item._id ? (
                          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <button
                            onClick={() => handleStatus(item)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                              item.status === "Active"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                            }`}
                          >
                            {item.status}
                          </button>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end items-center gap-3">
                          <button 
                            onClick={() => { setSelected(item); setOpen(true); }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <Link 
                            href={`/admin/edit-subcity/${item._id}`}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </Link>
                          <button 
                            disabled={deleteId === item._id}
                            onClick={() => handleDelete(item._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-50"
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
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">
              Page <span className="text-slate-900">{currentPage}</span> of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              
              <div className="flex gap-1 mx-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 text-sm font-medium rounded-lg transition-all ${
                      currentPage === i + 1
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* DRAWER */}
        <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
          <div className="w-[450px] p-0 flex flex-col h-full bg-white">
            <div className="p-6 bg-slate-50 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">Location Details</h2>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto flex-1">
              {selected && (
                <>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Name</label>
                    <p className="text-lg font-semibold text-slate-800">{selected.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Parent City</label>
                      <p className="text-slate-700">{selected.city?.mainCity}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Status</label>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${selected.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {selected.status}
                      </span>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Description</label>
                    <div
                      className="prose prose-sm text-slate-600 max-w-none"
                      dangerouslySetInnerHTML={{ __html: selected.description || "No description provided." }}
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="p-6 border-t border-slate-100">
              <button 
                onClick={() => setOpen(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
}