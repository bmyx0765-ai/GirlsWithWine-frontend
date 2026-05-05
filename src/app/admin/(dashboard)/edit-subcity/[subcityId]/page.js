"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { 
  FiMapPin, 
  FiSearch, 
  FiType, 
  FiCheckCircle, 
  FiChevronLeft,
  FiRefreshCw,
  FiTag
} from "react-icons/fi";

import {
  fetchSubCityById,
  updateSubCity,
  clearSubCity
} from "@/store/slices/subCitySlice";
import { getCitiesThunk } from "@/store/slices/citySlice";
import RichTextEditor from "@/components/RichTextEditor";

const SubEditCity = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  const id = Array.isArray(params?.subcityId) ? params.subcityId[0] : params?.subcityId || "";

  const { selectedSubCity, loading } = useSelector((s) => s.subCity);
  const { cities } = useSelector((s) => s.city);

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

  // FETCH DATA
  useEffect(() => {
    if (!id) return;
    dispatch(fetchSubCityById(id));
    dispatch(getCitiesThunk());

    return () => {
      dispatch(clearSubCity());
    };
  }, [id, dispatch]);

  // SYNC DATA TO FORM
  useEffect(() => {
    if (selectedSubCity?._id) {
      setForm({
        name: selectedSubCity.name || "",
        cityId: selectedSubCity.city?._id || "",
        permalink: selectedSubCity.permalink || "",
        heading: selectedSubCity.heading || "",
        subDescription: selectedSubCity.subDescription || "",
        description: selectedSubCity.description || "",
        seoTitle: selectedSubCity.seoTitle || "",
        seoDescription: selectedSubCity.seoDescription || "",
        seoKeywords: selectedSubCity.seoKeywords || "",
        tags: selectedSubCity.tags?.join(", ") || "",
      });
    }
  }, [selectedSubCity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditor = (val) => {
    setForm((prev) => ({ ...prev, description: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    const res = await dispatch(updateSubCity({ id, formData: fd }));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("SubCity updated successfully!");
      router.push("/admin/sub-city");
    }
  };

  if (loading && !selectedSubCity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Fetching details...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-xl font-bold text-slate-900">Edit SubCity</h1>
              <p className="text-[10px] text-indigo-600 uppercase tracking-widest font-bold">Update existing location</p>
            </div>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95 disabled:opacity-70"
          >
            {loading ? <FiRefreshCw className="animate-spin" /> : <FiCheckCircle />}
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Basic Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 font-bold text-slate-700 bg-slate-50/50">
                <FiMapPin className="text-indigo-500" /> Location Details
              </div>
              <div className="p-6 grid md:grid-cols-2 gap-5">
                <SelectCity cities={cities} value={form.cityId} onChange={handleChange} />
                <Input label="SubCity Name" name="name" value={form.name} onChange={handleChange} />
                <Input label="Permalink (Slug)" name="permalink" value={form.permalink} onChange={handleChange} />
                <Input label="Display Heading" name="heading" value={form.heading} onChange={handleChange} />
              </div>
            </div>

            {/* Editor Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 font-bold text-slate-700 bg-slate-50/50">
                <FiType className="text-indigo-500" /> Content Management
              </div>
              <div className="p-6 space-y-5">
                <Textarea
                  label="Short Summary"
                  name="subDescription"
                  rows={2}
                  value={form.subDescription}
                  onChange={handleChange}
                />
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-widest font-black text-slate-400 ml-1">Main Description Body</label>
                  <div className="rounded-xl border border-slate-200 focus-within:border-indigo-400 transition-colors overflow-hidden font-sans">
                    <RichTextEditor value={form.description} onChange={handleEditor} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* SEO & Meta Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 flex items-center gap-2 bg-slate-50/50">
                <FiSearch className="text-indigo-500" /> SEO Optimization
              </div>
              <div className="p-6 space-y-5">
                <Input label="Meta Title" name="seoTitle" value={form.seoTitle} onChange={handleChange} />
                <Textarea label="Meta Description" name="seoDescription" value={form.seoDescription} onChange={handleChange} />
                <Textarea label="Meta Keywords" name="seoKeywords" value={form.seoKeywords} onChange={handleChange} />
                <hr className="border-slate-100" />
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-3 font-bold text-slate-700">
                    <FiTag className="text-indigo-500" size={14} />
                    <span className="text-[11px] uppercase tracking-widest">Classification</span>
                  </div>
                  <Input label="Search Tags" name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. Luxury, Central" />
                </div>
              </div>
            </div>

            {/* Help/Status Card */}
            <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
               <h4 className="font-bold mb-2 flex items-center gap-2">
                 <FiRefreshCw size={16} /> 
                 Sync Status
               </h4>
               <p className="text-indigo-200 text-xs leading-relaxed">
                 Updating this subcity will immediately reflect changes across the multi-city classifieds dashboard. Ensure permalinks remain consistent to avoid SEO 404 errors.
               </p>
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
      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none text-slate-700 placeholder:text-slate-300 text-sm font-medium" 
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[11px] uppercase tracking-widest font-black text-slate-400 ml-1">{label}</label>
    <textarea 
      {...props} 
      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none text-slate-700 placeholder:text-slate-300 text-sm min-h-[90px]" 
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
      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none text-slate-700 appearance-none text-sm cursor-pointer font-medium"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23cbd5e1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
    >
      <option value="">Choose a city</option>
      {cities?.map(c => (
        <option key={c._id} value={c._id}>{c.mainCity}</option>
      ))}
    </select>
  </div>
);

export default SubEditCity;