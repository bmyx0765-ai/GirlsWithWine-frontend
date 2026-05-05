"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { 
  Trash2, 
  Edit3, 
  Plus, 
  Globe, 
  MapPin, 
  Building2, 
  UserCircle,
  HelpCircle,
  Eye,
  X
} from "lucide-react";

import {
  getFaqsThunk,
  deleteFaqThunk,
  toggleFaqStatusThunk,
} from "@/store/slices/faqSlice";

const AllFaq = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { faqs, loading } = useSelector((state) => state.faq);

  // Drawer State
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    dispatch(getFaqsThunk());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this FAQ group?")) {
      dispatch(deleteFaqThunk(id));
    }
  };

  const handleStatus = (id) => {
    dispatch(toggleFaqStatusThunk(id));
  };

  const openDrawer = (group) => {
    setSelectedGroup(group);
    setIsDrawerOpen(true);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "city": return <MapPin className="w-4 h-4 text-pink-500" />;
      case "subcity": return <Building2 className="w-4 h-4 text-blue-500" />;
      case "girl": return <UserCircle className="w-4 h-4 text-purple-500" />;
      default: return <Globe className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">FAQ Management</h2>
            <p className="text-gray-500 text-sm mt-1">Manage and view grouped questions.</p>
          </div>

          <button
            onClick={() => router.push("/admin/add-faq")}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-pink-100 transition-all"
          >
            <Plus className="w-5 h-5" /> Add FAQ Group
          </button>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Placement & Target</th>
                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Questions</th>
                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="4" className="py-20 text-center"><div className="inline-block w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div></td></tr>
              ) : faqs?.length > 0 ? (
                faqs.map((group) => (
                  <tr key={group._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm">{getTypeIcon(group.type)}</div>
                        <div>
                          <p className="font-bold text-gray-800 capitalize">{group.type}</p>
                          <p className="text-xs text-gray-400 font-medium">{group.city?.mainCity || group.subCity?.name || group.girl?.name || "Global"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-5">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold">
                        {group.faqs?.length || 0} Items
                      </span>
                    </td>

                    <td className="p-5">
                      <button
                        onClick={() => handleStatus(group._id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${group.status === "Active" ? "bg-pink-600" : "bg-gray-200"}`}
                      >
                        <span className={`${group.status === "Active" ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                      </button>
                    </td>

                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        {/* VIEW BUTTON */}
                        <button
                          onClick={() => openDrawer(group)}
                          className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-all"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        
                        <button
                          onClick={() => router.push(`/admin/edit-faq/${group._id}`)}
                          className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-xl transition-all"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(group._id)}
                          className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="p-20 text-center"><p className="text-gray-400">No FAQs found.</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DRAWER COMPONENT */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">FAQ Details</h3>
                <p className="text-sm text-gray-500 capitalize">{selectedGroup?.type} Placement</p>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-white rounded-full transition-all border border-transparent hover:border-gray-200"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {selectedGroup?.faqs?.map((item, idx) => (
                <div key={item._id} className="p-5 bg-[#F8FAFC] rounded-2xl border border-gray-100">
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <div className="space-y-3">
                      <p className="font-bold text-gray-800 leading-tight">Q: {item.question}</p>
                      <p className="text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-xl border border-gray-50">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t bg-gray-50/50">
              <button 
                onClick={() => router.push(`/admin/edit-faq/${selectedGroup?._id}`)}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" /> Edit this Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllFaq;