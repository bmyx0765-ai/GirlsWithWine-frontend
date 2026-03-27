"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllContactsThunk,
  deleteContactThunk,
  toggleContactStatusThunk,
} from "@/store/slices/contactSlice";

/* ------------------------
   Skeleton Loader Component
------------------------- */
const ContactSkeleton = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-gray-100">
          <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
          <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
          <td className="p-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
          <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
          <td className="p-4"><div className="h-8 bg-gray-200 rounded-full w-20"></div></td>
          <td className="p-4 text-center"><div className="h-8 w-20 bg-gray-200 rounded-lg mx-auto"></div></td>
        </tr>
      ))}
    </>
  );
};

const AllContactsList = () => {
  const dispatch = useDispatch();
  const { contacts = [], loading } = useSelector((state) => state.contacts);

  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredContacts = contacts.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.mobile?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredContacts.length / pageSize);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    dispatch(getAllContactsThunk());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this enquiry permanently?")) {
      dispatch(deleteContactThunk({ id }));
    }
  };

  const handleStatus = async (contact) => {
    setStatusLoadingId(contact._id);
    await dispatch(toggleContactStatusThunk({ id: contact._id }));
    setStatusLoadingId(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER SECTION */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight font-sans">Enquiries</h2>
            <p className="text-gray-500 text-sm mt-1">Manage and respond to user messages and leads.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <input 
              type="text"
              placeholder="Search leads..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-widest font-bold border-b border-gray-100">
                  <th className="px-6 py-5">Sender Info</th>
                  <th className="px-6 py-5">Message Detail</th>
                  <th className="px-6 py-5">Captcha</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <ContactSkeleton />
                ) : paginatedContacts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20">
                      <div className="flex flex-col items-center opacity-30">
                        <span className="text-5xl mb-2">✉️</span>
                        <p className="text-gray-500 font-medium text-lg">No enquiries found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedContacts.map((c) => (
                    <tr key={c._id} className="hover:bg-blue-50/30 transition-colors group">
                      
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="font-bold text-gray-900 capitalize text-base">{c.name}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded italic">@</span> {c.email}
                          </div>
                          <div className="text-xs text-blue-600 font-medium flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeWidth="2"/></svg>
                            {c.mobile}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="max-w-xs space-y-1">
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Sub: {c.subject}</div>
                          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                            {c.message}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-lg text-xs font-mono border border-gray-200">
                          {c.captcha}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {statusLoadingId === c._id ? (
                           <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <button
                            onClick={() => handleStatus(c)}
                            className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tighter transition-all ${
                              c.status === "New"
                                ? "bg-blue-100 text-blue-700 hover:bg-blue-200 ring-2 ring-blue-50"
                                : c.status === "Seen"
                                ? "bg-amber-100 text-amber-700 hover:bg-amber-200 ring-2 ring-amber-50"
                                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 ring-2 ring-emerald-50"
                            }`}
                          >
                            ● {c.status}
                          </button>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button 
                            onClick={() => handleDelete(c._id)} 
                            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                            title="Delete Lead"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER / PAGINATION */}
          <div className="bg-gray-50/50 px-8 py-5 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 font-medium tracking-wide">
              Showing <span className="text-gray-900 font-bold">{paginatedContacts.length}</span> out of {filteredContacts.length} enquiries
            </p>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-all font-bold text-xs"
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
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-100 scale-110"
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
                  className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-all font-bold text-xs"
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

export default AllContactsList;