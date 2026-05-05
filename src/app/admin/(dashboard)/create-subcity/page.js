"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiMapPin, FiSearch, FiType, FiCheckCircle, FiChevronLeft, FiTag } from "react-icons/fi";

import { createSubCity } from "@/store/slices/subCitySlice";
import { getCitiesThunk } from "@/store/slices/citySlice";
import RichTextEditor from "@/components/RichTextEditor";

const AddSubCity = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { cities } = useSelector((s) => s.city);
  const { loading } = useSelector((s) => s.subCity);

  const [form, setForm] = useState({
    name: "",
    cityId: "",
    permalink: "",
    heading: "",
    subDescription: "",
    description: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    tags: "",
  });

  useEffect(() => {
    dispatch(getCitiesThunk());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditor = (val) => {
    setForm((prev) => ({ ...prev, description: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.cityId) return toast.error("Select City");
    if (!form.name) return toast.error("Enter SubCity name");

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    dispatch(createSubCity(fd)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("SubCity created successfully!");
        router.push("/admin/sub-city");
      }
    });
  };

  return (
    <div className="pb-20 bg-slate-50 min-h-screen">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
            >
              <FiChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Add New SubCity</h1>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold tracking-tight">Location Management</p>
            </div>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95 disabled:opacity-70"
          >
            {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiCheckCircle />}
            {loading ? "Publishing..." : "Publish SubCity"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Basic Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 font-bold text-slate-700 bg-slate-50/50">
                <FiMapPin className="text-blue-500" /> Location Details
              </div>
              <div className="p-6 grid md:grid-cols-2 gap-5">
                <SelectCity cities={cities} value={form.cityId} onChange={handleChange} />
                <Input label="SubCity Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Adarsh Nagar" />
                <Input label="Permalink" name="permalink" value={form.permalink} onChange={handleChange} placeholder="adarsh-nagar-escorts" />
                <Input label="Display Heading" name="heading" value={form.heading} onChange={handleChange} placeholder="Top Services in Adarsh Nagar" />
              </div>
            </div>

            {/* Editor Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 font-bold text-slate-700 bg-slate-50/50">
                <FiType className="text-blue-500" /> Main Content
              </div>
              <div className="p-6 space-y-5">
                <Textarea
                  label="Short Listing Summary"
                  name="subDescription"
                  rows={2}
                  value={form.subDescription}
                  onChange={handleChange}
                  placeholder="Appears on the search result cards..."
                />
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-widest font-black text-slate-400 ml-1">Page Body Content</label>
                  <div className="rounded-lg border border-slate-200 focus-within:border-blue-400 transition-colors bg-white">
                    <RichTextEditor value={form.description} onChange={handleEditor} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* SEO Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 flex items-center gap-2 bg-slate-50/50">
                <FiSearch className="text-blue-500" /> Search Optimization
              </div>
              <div className="p-6 space-y-5">
                <Input label="Meta Title" name="seoTitle" value={form.seoTitle} onChange={handleChange} placeholder="Search engine title" />
                <Textarea label="Meta Description" name="seoDescription" value={form.seoDescription} onChange={handleChange} placeholder="Brief meta description..." />
                <Textarea label="Meta Keywords" name="seoKeywords" value={form.seoKeywords} onChange={handleChange} placeholder="SEO keywords..." />
              </div>
            </div>

            {/* Classification Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 flex items-center gap-2 bg-slate-50/50">
                <FiTag className="text-blue-500" /> Classification
              </div>
              <div className="p-6">
                <Input label="Search Tags" name="tags" value={form.tags} onChange={handleChange} placeholder="Comma separated tags..." />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------- REFINED UI COMPONENTS ----------------

const Input = ({ label, ...props }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[11px] uppercase tracking-widest font-black text-slate-400 ml-1">{label}</label>
    <input 
      {...props} 
      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none text-slate-700 placeholder:text-slate-300 text-sm font-medium" 
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[11px] uppercase tracking-widest font-black text-slate-400 ml-1">{label}</label>
    <textarea 
      {...props} 
      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none text-slate-700 placeholder:text-slate-300 text-sm min-h-[80px]" 
    />
  </div>
);

const SelectCity = ({ cities, value, onChange }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[11px] uppercase tracking-widest font-black text-slate-400 ml-1">Parent City</label>
    <select
      name="cityId"
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none text-slate-700 appearance-none text-sm cursor-pointer font-medium"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23cbd5e1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
    >
      <option value="">Choose a city</option>
      {cities?.map(c => (
        <option key={c._id} value={c._id}>{c.mainCity}</option>
      ))}
    </select>
  </div>
);

export default AddSubCity;